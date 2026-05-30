import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { customAlphabet } from 'nanoid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 10-char codes from an unambiguous alphabet (no 0/O/1/I/L confusion)
const generateCode = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 10);

// Public URL of the site, used to build the buyer's personalized plan link.
// Defaults to the production domain; override via SITE_URL env var if needed.
const SITE_URL = (process.env.SITE_URL || 'https://promptmama.com').replace(/\/+$/, '');

async function sendCodeEmail({ to, code, planUrl }) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY not set — skipping email send');
    return;
  }

  // MailerLite v2 API — add/update subscriber + trigger an automation by group
  // Lauren creates an automation in MailerLite that triggers when a subscriber
  // joins the "Glow-Up Buyers" group, and the email template uses
  // {$fields.access_code} and {$fields.plan_url}.
  const groupId = process.env.MAILERLITE_BUYERS_GROUP_ID;

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: to,
      fields: { access_code: code, plan_url: planUrl },
      groups: groupId ? [groupId] : undefined
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error('MailerLite send failed', res.status, txt);
  }
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe signature verification failed', err.message);
    return new Response('bad signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('ignored', { status: 200 });
  }

  const session = event.data.object;
  const email = session.customer_details?.email || session.customer_email;
  const stripeId = session.id;

  if (!email) {
    console.error('No email on session', stripeId);
    return new Response('no email', { status: 400 });
  }

  // The buyer's encoded quiz answers travel through Stripe via client_reference_id.
  // If present, we can reconstruct a "your plan" link that reopens their exact
  // personalized plan on any device. If absent (e.g. someone bought via a bare
  // Payment Link URL), the link just opens /glow-up and they retake the quiz.
  const ref = (session.client_reference_id || '').trim();
  const isValidRef = /^[A-Za-z0-9_-]+$/.test(ref) && ref.length <= 250;
  const planUrl = isValidRef
    ? `${SITE_URL}/glow-up#p=${ref}`
    : `${SITE_URL}/glow-up`;

  // Idempotency: if we've already issued a code for this checkout session, do nothing.
  const { data: existing } = await supabase
    .from('access_codes')
    .select('code')
    .eq('stripe_id', stripeId)
    .maybeSingle();

  if (existing) {
    return new Response('already issued', { status: 200 });
  }

  const code = generateCode();
  const { error: insertError } = await supabase
    .from('access_codes')
    .insert({ code, email, stripe_id: stripeId });

  if (insertError) {
    console.error('Supabase insert failed', insertError);
    return new Response('db error', { status: 500 });
  }

  try {
    await sendCodeEmail({ to: email, code, planUrl });
  } catch (err) {
    console.error('Email send threw', err);
    // Don't fail the webhook — the code is in Supabase, Lauren can resend manually.
  }

  return new Response('ok', { status: 200 });
};

export const config = {
  path: '/.netlify/functions/stripe-webhook'
};
