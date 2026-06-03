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
const SITE_URL = (process.env.SITE_URL || 'https://promptmama.ai').replace(/\/+$/, '');

// Sending identity for Resend. Default lets the function work right away
// using Resend's testing sender; swap to a verified address on your own
// domain in production via the RESEND_FROM env var.
const FROM_EMAIL = process.env.RESEND_FROM || 'Lauren · Prompt Mama <onboarding@resend.dev>';
const REPLY_TO  = process.env.RESEND_REPLY_TO || 'prompt.mama.community@gmail.com';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

function welcomeEmailHtml({ code, planUrl }) {
  const safeCode = escapeHtml(code);
  const safeUrl  = escapeHtml(planUrl);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You're in!</title></head>
<body style="margin:0;padding:0;background:#FFF6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFF6F1;padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="580" style="max-width:580px;width:100%;background:#FFFFFF;border-radius:24px;border:2px solid #BFDFEF;padding:36px 32px;">
      <tr><td align="center" style="padding-bottom:8px;">
        <div style="font-size:48px;line-height:1;">🎉</div>
        <h1 style="margin:14px 0 0;font-size:32px;font-weight:900;color:#1E2A4A;line-height:1.1;letter-spacing:-0.01em;">You did it.</h1>
        <p style="margin:14px 0 0;font-size:16px;color:#475379;font-weight:500;line-height:1.55;max-width:42ch;">Welcome to your 30-Day AI Glow-Up. Everything below is yours forever — bookmark this email so you can come back to <span style="color:#EC4899;font-weight:700;">YOUR</span> plan on any device, anytime.</p>
      </td></tr>
      <tr><td align="center" style="padding:28px 0 8px;">
        <a href="${safeUrl}" style="display:inline-block;background:#EC4899;color:#FFFFFF;font-weight:800;font-size:16px;text-decoration:none;padding:16px 32px;border-radius:999px;box-shadow:0 4px 0 #1E2A4A;">Open my plan →</a>
      </td></tr>
      <tr><td style="padding:24px 0 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FEF9C3;border-radius:18px;border:2px solid #FDE047;">
          <tr><td style="padding:22px 24px;text-align:center;">
            <div style="font-size:12px;font-weight:800;letter-spacing:0.12em;color:#1E2A4A;text-transform:uppercase;">🔑 Your access code</div>
            <div style="margin:12px 0 8px;font-size:32px;font-weight:900;letter-spacing:0.15em;color:#1E2A4A;font-family:'Courier New',Courier,monospace;">${safeCode}</div>
            <div style="font-size:13.5px;color:#475379;font-weight:500;line-height:1.5;">Paste it (with the email you bought with) at the bottom of Week 1 to unlock the full 30 days.</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 0;">
        <hr style="border:none;border-top:1px dashed #BFDFEF;margin:16px 0;">
      </td></tr>
      <tr><td style="padding:0 0 8px;">
        <h2 style="margin:0 0 14px;font-size:20px;font-weight:900;color:#1E2A4A;letter-spacing:-0.01em;">Here's what happens next</h2>
        <ol style="margin:0;padding-left:22px;color:#1E2A4A;font-size:14.5px;font-weight:500;line-height:1.65;">
          <li style="margin-bottom:8px;"><b style="font-weight:800;">Tap "Open my plan"</b> above — it remembers your quiz answers and your AI match, so you pick up exactly where you left off.</li>
          <li style="margin-bottom:8px;"><b style="font-weight:800;">Hit "Unlock"</b> at the bottom of Week 1.</li>
          <li style="margin-bottom:8px;"><b style="font-weight:800;">Paste in</b> the email you bought with + your access code above.</li>
          <li style="margin-bottom:8px;"><b style="font-weight:800;">Weeks 2–4 unlock instantly</b>, and a quick setup helper walks you through getting started on your matched AI.</li>
          <li style="margin-bottom:0;"><b style="font-weight:800;">Hit 📥 Download</b> anytime to save your personalized plan as a PDF you can keep forever.</li>
        </ol>
      </td></tr>
      <tr><td style="padding:20px 0 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FEF9C3;border-radius:14px;">
          <tr><td style="padding:16px 20px;font-size:14px;color:#1E2A4A;font-weight:500;line-height:1.55;">
            <b style="font-weight:800;">✨ Pro tip:</b> bookmark this email. Your plan link works on any device — phone, laptop, tablet — and your quiz answers travel with it. No login needed, no password to remember.
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:28px 0 0;text-align:center;">
        <p style="margin:0;font-size:14.5px;color:#475379;font-weight:500;line-height:1.6;">Questions, hiccups, or feedback?<br>Just hit reply — I read every email.</p>
        <p style="margin:18px 0 0;font-size:16px;color:#1E2A4A;font-weight:700;font-family:Georgia,'Times New Roman',serif;font-style:italic;">xo Lauren</p>
        <p style="margin:4px 0 0;font-size:12px;color:#475379;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Prompt Mama</p>
      </td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="580" style="max-width:580px;width:100%;margin-top:18px;">
      <tr><td align="center" style="padding:8px 16px;font-size:11.5px;color:#475379;font-weight:500;line-height:1.5;">
        You're getting this because you bought the 30-Day AI Glow-Up at promptmama.ai.<br>
        <a href="${SITE_URL}" style="color:#DB2777;text-decoration:none;font-weight:700;">promptmama.ai</a> &nbsp;·&nbsp;
        <a href="https://instagram.com/prompt_mama" style="color:#DB2777;text-decoration:none;font-weight:700;">@prompt_mama</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function welcomeEmailText({ code, planUrl }) {
  return `You did it. 🎉

Welcome to your 30-Day AI Glow-Up.

Open your plan: ${planUrl}

🔑 YOUR ACCESS CODE: ${code}

Paste it (with the email you bought with) at the bottom of Week 1 to unlock the full 30 days.

Here's what happens next:
1. Tap "Open my plan" above — it remembers your quiz answers and your AI match.
2. Hit "Unlock" at the bottom of Week 1.
3. Paste in the email you bought with + your access code.
4. Weeks 2-4 unlock instantly, and a quick setup helper walks you through getting started.
5. Hit "Download my 30-day plan (PDF)" anytime to save your personalized plan.

✨ Pro tip: bookmark this email. Your plan link works on any device — phone, laptop, tablet — and your quiz answers travel with it. No login needed.

Questions? Just reply.

xo Lauren
Prompt Mama
promptmama.ai · @prompt_mama`;
}

async function sendCodeEmail({ to, code, planUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email send');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      reply_to: REPLY_TO,
      subject: '🎉 You\'re in — here\'s your 30-Day AI Glow-Up plan',
      html: welcomeEmailHtml({ code, planUrl }),
      text: welcomeEmailText({ code, planUrl })
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error('Resend send failed', res.status, txt);
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
