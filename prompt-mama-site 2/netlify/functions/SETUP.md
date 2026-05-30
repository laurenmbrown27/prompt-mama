# Glow-Up backend setup

One-time setup before the page can sell access. ~30 minutes total.

## 1. Supabase

Create a new project (or use an existing one). In **SQL Editor**, paste and run:

```sql
create table access_codes (
  code text primary key,
  email text not null,
  stripe_id text unique,
  created_at timestamptz default now(),
  redeemed_at timestamptz
);
create index access_codes_email_idx on access_codes (email);
```

Leave RLS off — only the service-role key (kept secret in Netlify) touches this table.

Grab from **Project Settings → API**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (the `service_role` JWT — keep secret, never put in client code)

## 2. Stripe

1. **Dashboard → Products → Add Product** — "30-Day AI Glow-Up", $9.99 USD, one-time.
2. **Payment Links → New** — pick that product. Set success URL to `https://promptmama.ai/glow-up?paid=1`. Cancel URL to `https://promptmama.ai/glow-up`. Enable "Collect customer email."
3. Copy the Payment Link URL. Paste it into `glow-up.html` → `CONFIG.checkoutUrl` (around line 600).
4. **Webhooks → Add endpoint**:
   - URL: `https://promptmama.netlify.app/.netlify/functions/stripe-webhook` (or your production domain)
   - Events: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_…`)

Grab:
- `STRIPE_SECRET_KEY` (`sk_live_…` or `sk_test_…` while testing)
- `STRIPE_WEBHOOK_SECRET` (`whsec_…`)

## 3. MailerLite (email delivery)

1. **Subscribers → Groups → Create group** — "Glow-Up Buyers".
2. **Subscribers → Custom fields → Add field** — text field named `access_code`.
3. **Automation → Create new** — trigger: "When subscriber joins group" → Glow-Up Buyers.
4. Add one "Send email" step. In the email body, reference the code with `{$access_code}` (or whatever placeholder syntax MailerLite uses for custom fields). Subject line: "🎉 Your 30-Day AI Glow-Up access code".
5. Activate the automation.

Grab:
- `MAILERLITE_API_KEY` — from **Integrations → MailerLite API**
- `MAILERLITE_BUYERS_GROUP_ID` — from the URL when viewing that group (or via the API)

## 4. Netlify environment variables

**Site settings → Environment variables → Add a variable** (set for all scopes):

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | sk_live_… (or sk_test_… for testing) |
| `STRIPE_WEBHOOK_SECRET` | whsec_… |
| `SUPABASE_URL` | https://….supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role JWT |
| `MAILERLITE_API_KEY` | eyJ0… |
| `MAILERLITE_BUYERS_GROUP_ID` | numeric id |

Redeploy after setting these so the functions pick them up.

## 5. Test the flow

In Stripe **test mode**:

1. Buy with card `4242 4242 4242 4242`, any future date, any CVC.
2. Check Supabase `access_codes` — new row with your test email + a 10-char code.
3. Check the inbox — MailerLite should have sent you the code.
4. Go to `/glow-up`, take the quiz, hit the paywall, enter your email + code, hit Unlock.
5. Weeks 2–4 unlock + the "Download PDF" button appears at the top.
6. Click Download — all 30 days expand and the print dialog opens. Save as PDF.

Flip Stripe to live mode when you're ready.

## Re-issuing a code

If a buyer loses their email:

```sql
select code from access_codes where email = 'buyer@example.com';
```

Send it to them manually. The page accepts the same code for multiple devices as long as the email matches.
