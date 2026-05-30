# MailerLite Welcome Email — Full Template

Everything you need to build the post-purchase welcome email in MailerLite. Send-time fields it expects: `access_code` and `plan_url` (already set up — the Stripe webhook populates both).

---

## SUBJECT LINE

```
🎉 You're in — here's your 30-Day AI Glow-Up plan
```

**Alternative subjects to A/B test later:**
- `Your Glow-Up plan is ready 💗`
- `Welcome to your 30-Day AI Glow-Up`
- `Day 1 starts now — here's your code`

---

## PREHEADER (the preview text that shows next to the subject)

```
Tap the link in this email to open YOUR personalized plan on any device.
```

---

## BUILD IT IN MAILERLITE — STEP BY STEP

In MailerLite, create a **new email** for the **Glow-Up Buyers** automation. Either:

**Option A — Use MailerLite's drag-and-drop editor** (recommended if you want to tweak the design later)
Build it block by block using the copy in **PLAIN CONTENT** below. Use these block types:
1. Heading block — "You did it. 🎉"
2. Text block — opening paragraph
3. Button block — "Open my plan →" linking to `{$fields.plan_url}`
4. Text block — the access-code section
5. Divider
6. Text block — what happens next (numbered list)
7. Text block — bookmark reminder
8. Text block — signoff

**Option B — Paste the full HTML** (faster if you want it to look exactly like what's below)
Drag a **Custom HTML block** into your email and paste the HTML in **HTML VERSION** below.

---

## PLAIN CONTENT (for the drag-drop editor)

**HEADING (centered, big):**
```
You did it. 🎉
```

**SUBHEAD / OPENING PARAGRAPH (centered):**
```
Welcome to your 30-Day AI Glow-Up. Everything below is yours forever — bookmark this email so you can come back to YOUR plan on any device, anytime.
```

**BUTTON (pink, centered):**
- **Button text:** `Open my plan →`
- **Link URL:** `{$fields.plan_url}`

**TEXT BLOCK — Access code box (yellow background):**
```
🔑 Your access code

{$fields.access_code}

Paste it (along with the email you bought with) at the bottom of Week 1 to unlock the full 30 days.
```

**DIVIDER**

**HEADING (smaller):**
```
Here's what happens next
```

**TEXT BLOCK — Numbered list:**
```
1. Tap "Open my plan" above — it remembers your quiz answers and your AI match, so you pick up exactly where you left off.

2. Hit "Unlock" at the bottom of Week 1.

3. Paste in the email you bought with + your access code above.

4. Weeks 2–4 unlock instantly. A quick setup helper walks you through getting started on your matched AI.

5. Hit "📥 Download my 30-day plan (PDF)" anytime to save your personalized plan as a PDF.
```

**TEXT BLOCK — Bookmark callout (yellow soft background):**
```
✨ Pro tip: bookmark this email. Your plan link works on any device — phone, laptop, tablet — and your quiz answers travel with it. No login needed, no password to remember.
```

**TEXT BLOCK — Signoff:**
```
Questions, hiccups, or feedback? Just hit reply — I read every email.

xo Lauren
Prompt Mama
```

---

## HTML VERSION (paste into a Custom HTML block)

Drop this entire chunk into a single Custom HTML block in MailerLite. The merge tags `{$fields.access_code}` and `{$fields.plan_url}` will fill in automatically when the email sends.

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFF6F1;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="580" style="max-width:580px;width:100%;background:#FFFFFF;border-radius:24px;border:2px solid #BFDFEF;padding:36px 32px;">

        <!-- HEADER -->
        <tr><td align="center" style="padding-bottom:8px;">
          <div style="font-size:48px;line-height:1;">🎉</div>
          <h1 style="margin:14px 0 0;font-size:32px;font-weight:900;color:#1E2A4A;line-height:1.1;letter-spacing:-0.01em;">You did it.</h1>
          <p style="margin:14px 0 0;font-size:16px;color:#475379;font-weight:500;line-height:1.55;max-width:42ch;">Welcome to your 30-Day AI Glow-Up. Everything below is yours forever — bookmark this email so you can come back to <span style="color:#EC4899;font-weight:700;">YOUR</span> plan on any device, anytime.</p>
        </td></tr>

        <!-- CTA BUTTON -->
        <tr><td align="center" style="padding:28px 0 8px;">
          <a href="{$fields.plan_url}" style="display:inline-block;background:#EC4899;color:#FFFFFF;font-weight:800;font-size:16px;text-decoration:none;padding:16px 32px;border-radius:999px;box-shadow:0 4px 0 #1E2A4A;">Open my plan →</a>
        </td></tr>

        <!-- ACCESS CODE BOX -->
        <tr><td style="padding:24px 0 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FEF9C3;border-radius:18px;border:2px solid #FDE047;">
            <tr><td style="padding:22px 24px;text-align:center;">
              <div style="font-size:12px;font-weight:800;letter-spacing:0.12em;color:#1E2A4A;text-transform:uppercase;">🔑 Your access code</div>
              <div style="margin:12px 0 8px;font-size:32px;font-weight:900;letter-spacing:0.15em;color:#1E2A4A;font-family:'Courier New',Courier,monospace;">{$fields.access_code}</div>
              <div style="font-size:13.5px;color:#475379;font-weight:500;line-height:1.5;">Paste it (with the email you bought with) at the bottom of Week 1 to unlock the full 30 days.</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- DIVIDER -->
        <tr><td style="padding:8px 0;">
          <hr style="border:none;border-top:1px dashed #BFDFEF;margin:16px 0;">
        </td></tr>

        <!-- WHAT HAPPENS NEXT -->
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

        <!-- BOOKMARK CALLOUT -->
        <tr><td style="padding:20px 0 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FEF9C3;border-radius:14px;">
            <tr><td style="padding:16px 20px;font-size:14px;color:#1E2A4A;font-weight:500;line-height:1.55;">
              <b style="font-weight:800;">✨ Pro tip:</b> bookmark this email. Your plan link works on any device — phone, laptop, tablet — and your quiz answers travel with it. No login needed, no password to remember.
            </td></tr>
          </table>
        </td></tr>

        <!-- SIGNOFF -->
        <tr><td style="padding:28px 0 0;text-align:center;">
          <p style="margin:0;font-size:14.5px;color:#475379;font-weight:500;line-height:1.6;">Questions, hiccups, or feedback?<br>Just hit reply — I read every email.</p>
          <p style="margin:18px 0 0;font-size:16px;color:#1E2A4A;font-weight:700;font-family:Georgia,'Times New Roman',serif;font-style:italic;">xo Lauren</p>
          <p style="margin:4px 0 0;font-size:12px;color:#475379;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Prompt Mama</p>
        </td></tr>

      </table>

      <!-- FOOTER -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="580" style="max-width:580px;width:100%;margin-top:18px;">
        <tr><td align="center" style="padding:8px 16px;font-size:11.5px;color:#475379;font-weight:500;line-height:1.5;">
          You're getting this because you bought the 30-Day AI Glow-Up at promptmama.com.<br>
          <a href="https://promptmama.com" style="color:#DB2777;text-decoration:none;font-weight:700;">promptmama.com</a> &nbsp;·&nbsp;
          <a href="https://instagram.com/prompt_mama" style="color:#DB2777;text-decoration:none;font-weight:700;">@prompt_mama</a>
        </td></tr>
      </table>

    </td>
  </tr>
</table>
```

---

## MERGE TAGS — QUICK REFERENCE

These are the dynamic fields the Stripe webhook fills in for each buyer:

| Merge tag | What it is | Example value |
|---|---|---|
| `{$fields.access_code}` | The buyer's unique 10-character unlock code | `KX4MNP7QR2` |
| `{$fields.plan_url}` | Deep link back to their personalized plan | `https://promptmama.com/glow-up#p=eyJ0Ij...` |
| `{$email}` | The buyer's email address (built into MailerLite) | `buyer@example.com` |

MailerLite also has standard merge tags like `{$name}` and `{$last_name}` if you ever collect them — but Stripe Payment Links only collect email, so those'll be blank for now.

---

## BEFORE YOU ACTIVATE — TEST IT

1. In the MailerLite automation editor, hit **Preview** to see the template render.
2. Add yourself manually to the **Glow-Up Buyers** group with test values:
   - `access_code`: `TEST1234XY`
   - `plan_url`: `https://promptmama.com/glow-up`
3. The automation will fire and send you the email — check that both the button link and the code render correctly.
4. Open the email on your phone too — confirm it doesn't look broken.

Then run the full Stripe test-mode purchase (see `SETUP.md` Part 5) and confirm a real `plan_url` (with `#p=…`) lands in your inbox and reopens your plan when clicked.

---

## DESIGN NOTES (in case you want to tweak)

**Colors used:**
- Pink button: `#EC4899` (matches the Glow-Up brand pink)
- Navy text: `#1E2A4A`
- Yellow accent (code box): `#FDE047` / `#FEF9C3`
- Blue card border: `#BFDFEF`
- Background: `#FFF6F1` (warm cream)

**Why a table-based HTML layout?** Email clients (especially Outlook) don't render flexbox/grid reliably. Tables look identical everywhere — Gmail, Apple Mail, Outlook, mobile, Yahoo. Inline styles for the same reason.

**Mobile considerations:** The 580px max-width is the safe spot for desktop, and the content stacks naturally on phones. No `@media` queries needed.

**Plain-text version:** MailerLite auto-generates one from the HTML — you don't need to write it separately, but check the auto-generated text version in MailerLite's editor and clean it up if needed.
