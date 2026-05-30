# Glow-Up Backend Setup

End-to-end setup for selling the 30-Day AI Glow-Up at `/glow-up`. ~45 minutes total, mostly clicking in dashboards.

```
┌──────────────────────────────────────────────────────────────────────┐
│  THE WHOLE FLOW                                                       │
│                                                                       │
│  1. Buyer clicks "Get instant access" on /glow-up                     │
│       ↓                                                               │
│  2. Stripe Checkout (hosted by Stripe) takes their $9.99 + email     │
│       ↓                                                               │
│  3. Stripe redirects them to /welcome (thanks + check your inbox)    │
│       ↓                                                               │
│  4. Stripe also fires checkout.session.completed → our webhook       │
│       ↓                                                               │
│  5. Webhook generates a unique code, stores it in Supabase, and      │
│     adds the buyer to MailerLite with the code in a custom field     │
│       ↓                                                               │
│  6. MailerLite automation emails the code to the buyer               │
│       ↓                                                               │
│  7. Buyer returns to /glow-up, takes the quiz, hits the paywall,    │
│     enters their email + code → /api/verify-code validates them      │
│       ↓                                                               │
│  8. Page unlocks Weeks 2–4 + reveals "Download my plan (PDF)" +     │
│     pops the post-purchase setup helper                              │
└──────────────────────────────────────────────────────────────────────┘
```

## Part 1 — Supabase (one-time)

1. Create a new Supabase project at https://supabase.com (free tier is plenty).
2. Open **SQL Editor → New query**, paste and run:

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

3. Leave Row-Level Security **off** for this table. Only the service-role key (stored in Netlify, never exposed to the browser) touches it.
4. From **Project Settings → API**, grab:
   - `SUPABASE_URL` (e.g. `https://abc123.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` (the **service_role** JWT — keep secret!)

## Part 2 — Stripe (one-time)

### 2a. Create the product + Payment Link

1. Stripe Dashboard → **Products → Add product**.
   - **Name:** `30-Day AI Glow-Up`
   - **Price:** $9.99 USD, one-time
   - **Description:** "Take the 2-minute quiz, get matched to your AI, and follow a personalized 30-day plan."
2. **Payment Links → New payment link** → select that product.
3. Under **After payment**:
   - **Redirect customers to**: `https://promptmama.com/welcome` (or your Netlify URL during testing)
4. Under **Options**:
   - ✅ Enable **Collect customer email** (this is critical — the webhook needs the email)
5. Save the link, copy the URL (it looks like `https://buy.stripe.com/abc123…`).
6. In `glow-up.html` find the `CONFIG` block and replace:
   ```js
   checkoutUrl: "https://buy.stripe.com/REPLACE_WITH_REAL_STRIPE_PAYMENT_LINK",
   ```
   with the real link.

### 2b. Set up the webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. **Endpoint URL:** `https://promptmama.netlify.app/.netlify/functions/stripe-webhook`
   (replace with your Netlify production domain — `https://promptmama.com/.netlify/functions/stripe-webhook` if the custom domain is your primary).
3. **Events to listen to:** select **only** `checkout.session.completed`.
4. Save. Reveal the **Signing secret** (`whsec_…`) and grab it for env vars.
5. From **Developers → API keys**, copy your **Secret key** (`sk_test_…` while testing, `sk_live_…` in production).

## Part 3 — MailerLite (transactional email)

You already use MailerLite for the Parent Guide gate, so we reuse it.

1. **Subscribers → Groups → Create group** — name it `Glow-Up Buyers`. Copy the group ID from the URL (e.g. `/groups/12345678`).
2. **Subscribers → Custom fields → Add field** — add **two** fields, both Text:
   - `access_code` — the unique code the buyer pastes to unlock
   - `plan_url` — the deep link back to their personalized plan (works on any device)

   Use these exact field keys — the webhook function references them.
3. **Automations → Create new automation**:
   - **Trigger:** When a subscriber joins a group → **Glow-Up Buyers**
   - **Action:** Send an email
4. Compose the email. Suggested content:

   **Subject:** `🎉 Your 30-Day AI Glow-Up access code`

   **Body:**
   > Hey, you did it!
   >
   > Your personalized 30-Day AI Glow-Up is ready.
   >
   > **Your plan:** {$fields.plan_url}
   > **Your access code:** `{$fields.access_code}`
   >
   > Tap your plan link from any device — it remembers your quiz answers and your AI match, so you pick up exactly where you left off. When you get there, paste this email + your code at the bottom of Week 1 to unlock the full 30 days.
   >
   > Want a saved copy? On the plan page hit **Download my 30-day plan (PDF)** to save your personalized plan as a PDF you can keep forever.
   >
   > Questions? Just reply to this email.
   >
   > xo Lauren

   **Bookmark this email** — your plan link in it is how you get back to your personalized plan on any device, anytime.

5. Activate the automation.
6. From **Integrations → MailerLite API**, copy your API key.

## Part 4 — Netlify environment variables

Site settings → **Environment variables → Add a variable** (apply to all scopes):

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_…` (or `sk_test_…` while testing) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` |
| `SUPABASE_URL` | `https://….supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role JWT |
| `MAILERLITE_API_KEY` | `eyJ0…` |
| `MAILERLITE_BUYERS_GROUP_ID` | numeric id (e.g. `12345678`) |
| `SITE_URL` | `https://promptmama.com` (used to build the plan link in welcome emails; defaults to promptmama.com if unset) |

Trigger a fresh deploy after setting them so the functions pick up the values.

## Part 5 — End-to-end test (Stripe test mode)

1. In Stripe Dashboard, toggle **Test mode** (top right).
2. Use the **test-mode Payment Link** and run a checkout with card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
3. After payment, Stripe should redirect you to `/welcome` with the confetti page.
4. In Supabase, run `select * from access_codes order by created_at desc limit 1;` — you should see a new row with your test email + a 10-char code.
5. Check your inbox — MailerLite should have sent the welcome email with the code (in test mode, real emails still send).
6. Go to `/glow-up`, take the quiz, hit the paywall, paste in your test email + the code, click **Unlock**.
7. Confetti, weeks 2–4 unlock, the Download-PDF button appears, and the setup helper modal pops.
8. Click **Download my 30-day plan (PDF)** — every day expands and the browser print dialog opens.

## Part 6 — Go live

Once test mode works end-to-end:

1. Flip Stripe to **Live mode**.
2. Recreate the Live-mode Payment Link with the same settings + the live success URL.
3. Recreate the Live-mode webhook endpoint (different signing secret from test).
4. Update the Netlify env vars to the **live** Stripe secret key + live webhook secret.
5. Update `CONFIG.checkoutUrl` in `glow-up.html` to the live Payment Link.
6. Deploy.

## Re-issuing a code (manual rescue)

If a buyer loses their email and emails you:

```sql
select code, created_at from access_codes where email = 'buyer@example.com' order by created_at desc;
```

Paste the code into a reply. Codes work for the same email on as many devices as the buyer uses, so they don't need a new one.

## How to disable the paywall (e.g. launch week, free promo)

In `glow-up.html` set:

```js
const CONFIG = { ..., paywallEnabled: false, ... };
```

Everyone gets the full plan instantly. Flip it back to `true` whenever.
