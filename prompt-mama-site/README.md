# Prompt Mama

Personal landing page for [@prompt_mama](https://instagram.com/prompt_mama) — helping parents use AI with confidence.

Built by Lauren Howard · Mom of 2 · CAEVO co-founder · 15+ years in tech enablement.

## Tech stack

- **HTML / CSS / vanilla JS** — no framework, no build step, no dependencies
- **Google Fonts** — Poppins (headlines) + Caveat (handwritten accents)
- **Hosted on Netlify** with auto-deploy from this GitHub repo

The whole site is one HTML page, one stylesheet, one tiny JS file. That's intentional. Static, fast, easy to maintain.

## File structure

```
.
├── index.html              # Main page
├── styles.css              # All styles
├── script.js               # Scroll reveal + dynamic year
├── netlify.toml            # Netlify deploy config + cache headers
├── robots.txt              # SEO crawler config
├── sitemap.xml             # Single-page sitemap
├── .gitignore
├── README.md
└── assets/
    ├── logo.png            # Hero logo (transparent PNG)
    ├── logo-sm.png         # Footer logo (smaller)
    ├── lauren.jpg          # About photo (JPEG fallback)
    ├── lauren.webp         # About photo (modern format)
    ├── og-image.png        # Social share preview (1200×630)
    ├── favicon.ico         # Multi-size favicon
    ├── favicon-16.png
    ├── favicon-32.png
    └── apple-touch-icon.png
```

## Local development

No build step. Just open `index.html` in a browser.

For better local previews (live reload, mobile testing), serve with any static server:

```bash
# Python (built-in)
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploy to Netlify

**Option 1: GitHub auto-deploy (recommended)**

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import existing project"
3. Connect GitHub, select the repo
4. Build command: *(leave blank)*
5. Publish directory: `.`
6. Click Deploy

Every commit to `main` will auto-deploy. Live in ~30 seconds.

**Option 2: Drag-and-drop**

Zip the folder, drag onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.

## Custom domain

In Netlify: **Site settings → Domain management → Add custom domain**.

If using `promptmama.com` (or similar), update these references in `index.html`:

- `<link rel="canonical">`
- All `og:url` and `twitter:url` meta tags
- All image URLs in the JSON-LD structured data
- `sitemap.xml`
- `robots.txt`

A find-and-replace on `https://promptmama.com` does it.

## Updating content

### Swap a tool link

Open `index.html`, search for `tool-card`. Replace `href="#"` with the real URL for each:

- The Reset Journal → ChatGPT Custom GPT URL
- AI Automation Guide → email signup landing page
- Land Your Next Job → email signup landing page
- Prompt Mama Prompt Generator → Claude Artifact URL or GPT URL

### Update the photo

Replace `assets/lauren.jpg` and `assets/lauren.webp` with new versions at the same dimensions (~900×947 recommended). Keep both formats so browsers pick the smaller WebP automatically.

### Update stats

Search `stat-num` in `index.html` — they're plain numbers in `<div>` tags.

### Add a new feed item

Each `<a class="feed-item">` block in the **Content Feed** section is one tile. Copy a block, change the title and color class (`pink-bg`, `yellow-bg`, `blue-bg`, `navy-bg`, or no class for white).

## SEO & social sharing

- Open Graph + Twitter Card meta tags configured for rich previews on iMessage, Slack, LinkedIn, Twitter, Facebook
- JSON-LD structured data for `Person`, `Organization`, and `WebSite` schemas
- Single-page sitemap and robots.txt
- Test social previews: [opengraph.xyz](https://www.opengraph.xyz/) or [metatags.io](https://metatags.io/)
- Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)

## Performance

- Critical assets are preloaded (logo)
- Photo uses `<picture>` with WebP for ~50% smaller file size on modern browsers
- Lazy-loaded below-the-fold images
- Netlify caches static assets for 1 year (busted automatically by filename changes)
- No external scripts or trackers — fast first paint

## Accessibility

- Semantic HTML (`<header>`, `<section>`, `<nav>`, `<footer>`)
- ARIA labels on icon-only buttons
- Honors `prefers-reduced-motion` (animations disabled if user has motion sensitivity)
- Color contrast meets WCAG AA on all text/background pairings

## License

Personal site — all content, branding, and copy © Lauren Howard. Code is provided as a reference but the visual design and brand assets are not licensed for reuse.

## Contact

- Instagram: [@prompt_mama](https://instagram.com/prompt_mama)
- TikTok: [@prompt_mama](https://www.tiktok.com/@prompt_mama)
- Email: hello@promptmama.com
- CAEVO: [caevo.ai](https://caevo.ai)
