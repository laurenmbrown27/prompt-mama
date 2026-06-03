/*
  Lookup-code function: powers the "auto-unlock after payment" flow.

  Welcome page calls this with the Stripe session_id (passed in the
  redirect URL via the {CHECKOUT_SESSION_ID} placeholder). It checks
  Supabase to see if the webhook has finished issuing a code for this
  session yet, and if so returns enough info to drop the buyer straight
  into their unlocked plan — no email-and-paste-the-code dance.

  Welcome page polls this every ~1.5s. If pending=true, keep polling.
  Once code arrives, welcome page writes it to localStorage and
  redirects to /glow-up?welcome=1#p=<ref>, where the existing
  on-load IIFE hydrates the personalized plan and the localStorage
  flag bypasses the paywall.

  Email still gets sent by the webhook in parallel, so cross-device
  buyers and people who close the welcome tab still have a fallback.
*/
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const url = new URL(req.url);
  const sid = (url.searchParams.get('session_id') || '').trim();

  if (!/^cs_[A-Za-z0-9_]+$/.test(sid) || sid.length > 100) {
    return Response.json({ error: 'invalid session_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('access_codes')
    .select('code, email')
    .eq('stripe_id', sid)
    .maybeSingle();

  if (error) {
    return Response.json({ error: 'db error' }, { status: 500 });
  }
  if (!data) {
    // Webhook hasn't fired yet — welcome page should keep polling.
    return Response.json({ pending: true }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  // We have a code. Fetch the Stripe session to get the encoded
  // quiz answers, so we can build the plan URL with the buyer's
  // personalized hash.
  let ref = '';
  try {
    const session = await stripe.checkout.sessions.retrieve(sid);
    ref = (session.client_reference_id || '').trim();
  } catch (e) {
    // Non-fatal: if Stripe lookup fails, we still return the code
    // and the welcome page can fall back to a generic plan URL.
  }
  const isValidRef = /^[A-Za-z0-9_-]+$/.test(ref) && ref.length <= 250;
  const planPath = isValidRef
    ? `/glow-up?welcome=1#p=${ref}`
    : '/glow-up?welcome=1';

  return Response.json(
    { code: data.code, email: data.email, planUrl: planPath },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
};

export const config = {
  path: '/api/lookup-code'
};
