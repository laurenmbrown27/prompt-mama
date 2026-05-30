import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, msg: 'invalid request' }, { status: 400 });
  }

  const email = (payload.email || '').trim().toLowerCase();
  const code = (payload.code || '').trim().toUpperCase();

  if (!email || !code) {
    return Response.json({ ok: false, msg: 'Pop in the email + your code.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('access_codes')
    .select('code, email, redeemed_at')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    return Response.json({ ok: false, msg: 'Something went sideways — try again in a sec.' }, { status: 500 });
  }
  if (!data) {
    return Response.json({ ok: false, msg: "That code doesn't match anything we issued." }, { status: 401 });
  }
  if (data.email.trim().toLowerCase() !== email) {
    return Response.json({ ok: false, msg: 'That code belongs to a different email — use the one you bought with.' }, { status: 401 });
  }

  if (!data.redeemed_at) {
    await supabase
      .from('access_codes')
      .update({ redeemed_at: new Date().toISOString() })
      .eq('code', data.code);
  }

  return Response.json({ ok: true });
};

export const config = {
  path: '/api/verify-code'
};
