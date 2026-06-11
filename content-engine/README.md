# Prompt Mama Content Engine 🤖💗

A personalized content calendar system for [@prompt_mama](https://instagram.com/prompt_mama) that runs on **Claude + Google Calendar** — built around how Lauren actually works.

## How it works (the weekly loop)

```
Sunday 8:00 PM  →  Open Claude Code, say: "Run my content engine for next week"
                   Claude reads this folder, refreshes trends, drafts every post,
                   and pushes ready-to-post events into Google Calendar.

Post days       →  A calendar reminder pops up at posting time.
(Mon/Wed/Fri-ish)  Open the event → the full caption, hashtags, audio pick, and
                   shot notes are in the description. Copy, paste, post. Done.
```

That's the whole system. No dashboards, no subscriptions. Your calendar **is** the scheduler and Claude **is** the strategist.

## What's in this folder

| File | What it is |
|---|---|
| `CLAUDE.md` | The operating manual Claude follows when you say "plan my week" |
| `brand-profile.md` | Brand voice, content pillars, audience, and Lauren's real-life scheduling rules |
| `hashtag-bank.md` | Tiered, niche-specific hashtags (3–5 per post, rotated) |
| `trends.md` | Current Reels formats + trending audio, dated and refreshed weekly by Claude |
| `templates.md` | Post archetypes, hook bank, and caption skeletons in the Prompt Mama voice |
| `calendar/` | One markdown file per week — the drafted posts of record |

## The one prompt you need

Paste this into Claude Code (it's also in your recurring Sunday calendar event):

> Run my Prompt Mama content engine: read `content-engine/CLAUDE.md` in the
> prompt-mama repo, refresh `trends.md` with this week's Reels formats and audio,
> draft next week's posts into `content-engine/calendar/`, push them to my Google
> Calendar as post-reminder events, and commit everything to the repo.

## Mid-week extras Claude can do on demand

- *"Something just trended — swap Wednesday's post for it."*
- *"Rewrite Friday's caption, it feels too salesy."*
- *"Give me 5 story ideas for tomorrow."*
- *"My week blew up — move everything to next week."*

Claude updates both the repo file and the calendar event so they never drift apart.
