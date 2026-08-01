# About Page + Corner Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real, substantially-content-filled `about.html` page (deadpan-official copy explaining the site + Dragon Con lore), linked from `index.html` via a small, genuinely-visible corner link, with correct per-page SEO metadata.

**Architecture:** Two static HTML files (`index.html`, `about.html`) sharing the same inline-CSS visual shell, no build step, no JS framework — matches the existing site's plain-static-file approach. `about.html` is fully static (unlike `index.html`, it is never touched by `.github/scripts/update-status.mjs`).

**Tech Stack:** Plain HTML/CSS, no JS runtime dependency for either page. Verification uses `grep`, `node -e` (JSON.parse for JSON-LD validity), and `python3`'s `xml.etree.ElementTree` (for `sitemap.xml` validity) — the same ad hoc verification style already used elsewhere in this repo, since there is no test framework here.

## Global Constraints

- The corner link and all `about.html` content must be genuinely visible to a normal visitor at all times: never `display:none`, `visibility:hidden`, `opacity:0`, off-screen positioning (e.g. `left:-9999px`), or a color that matches the background. This is a hard requirement — it's what keeps this from being cloaking/hidden-text SEO, which was explicitly rejected during design.
- No `Event`-type (or any event-rich-result) structured data anywhere on the site — this isn't the official Dragon Con site and such markup risks misrepresenting it as an authoritative listing.
- `about.html` content is static and must not be wired into `.github/scripts/update-status.mjs` or `.github/workflows/update-status.yml` — those only ever touch `index.html` and `sitemap.xml`'s homepage `<lastmod>`.
- Use the approved copy verbatim (reproduced in Task 1 below) — do not reword, trim, or "improve" it during implementation.
- `about.html`'s Open Graph/Twitter image is `no.png` (already confirmed 1200×630 elsewhere in this repo) — it's the one status image not tied to a specific moment in the con calendar.

---

### Task 1: Create `about.html` and add it to `sitemap.xml`

**Files:**
- Create: `about.html`
- Modify: `sitemap.xml`

**Interfaces:**
- Produces: a page reachable at `/about.html`, with `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG/Twitter tags, and a `<script type="application/ld+json">` block of type `AboutPage`. Task 2 links to this URL.
- Produces: a second `<url>` entry in `sitemap.xml` for `https://isitdragonconyet.com/about.html`, alongside the existing homepage entry (do not remove or alter the homepage entry).

- [ ] **Step 1: Write the verification check and confirm it fails**

Run this in the repo root:

```bash
test -f about.html \
  && grep -q '<title>About — Is It Dragon Con Yet?</title>' about.html \
  && grep -q 'application/ld+json' about.html \
  && grep -q 'rel="canonical" href="https://isitdragonconyet.com/about.html"' about.html \
  && grep -q 'about.html' sitemap.xml \
  && echo "PASS" || echo "FAIL"
```

Expected: `FAIL` (`about.html` does not exist yet).

- [ ] **Step 2: Create `about.html`**

Create `about.html` with exactly this content:

```html
<!doctype html>
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-W6XNC00DVE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-W6XNC00DVE');
  </script>
  <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
  <link rel="canonical" href="https://isitdragonconyet.com/about.html" />
  <title>About — Is It Dragon Con Yet?</title>
  <style>
    html { height: 100% }
    body { text-align: center; min-height: 100%; display:flex; align-content: center; background-image:url("https://dragonconeternalmembers.files.wordpress.com/2018/06/22-3000-x-3000-pixels-9-tiles-150-dpi.png") }
    body { font: 18px Helvetica, sans-serif; color: #F7D745; }
    article { display: block; margin: 40px auto; max-width: 700px; padding: 10px 30px 30px; background-color: #620D76; border-radius: 25px; text-align: left; line-height: 1.5; }
    h1 { font-size: 32px; }
    h2 { font-size: 22px; margin-top: 1.5em; }
    h3 { font-size: 18px; margin-bottom: 0.3em; }
    a { color: #dc8100; text-decoration: none; }
    a:hover { color: #333; text-decoration: none; }
  </style>

  <meta property="og:title" content="About — Is It Dragon Con Yet?" />
  <meta property="og:site_name" content="Is It Dragon Con Yet?" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://isitdragonconyet.com/about.html" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="How this site's daily verdict works, plus Dragon Con lore: the Cult of the Marriott Carpet, the Cult of Jon, and badge ribbons." />
  <meta property="og:image" content="https://isitdragonconyet.com/no.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="About — Is It Dragon Con Yet?" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:domain" content="isitdragonconyet.com" />
  <meta name="twitter:url" content="https://isitdragonconyet.com/about.html" />
  <meta name="twitter:title" content="About — Is It Dragon Con Yet?" />
  <meta name="twitter:description" content="How this site's daily verdict works, plus Dragon Con lore: the Cult of the Marriott Carpet, the Cult of Jon, and badge ribbons." />
  <meta name="twitter:image" content="https://isitdragonconyet.com/no.png" />
  <meta name="twitter:image:alt" content="About — Is It Dragon Con Yet?" />
  <meta name="description" content="How this site's daily verdict works, plus Dragon Con lore: the Cult of the Marriott Carpet, the Cult of Jon, and badge ribbons." />
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About — Is It Dragon Con Yet?",
  "url": "https://isitdragonconyet.com/about.html",
  "description": "How this site's daily verdict works, plus Dragon Con lore: the Cult of the Marriott Carpet, the Cult of Jon, and badge ribbons.",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Is It Dragon Con Yet?",
    "url": "https://isitdragonconyet.com"
  },
  "inLanguage": "en-US"
}
  </script>
</head>

<article>
  <h1>About Is It Dragon Con Yet?</h1>

  <h2>Statement of Purpose</h2>
  <p><em>Is It Dragon Con Yet?</em> ("the Service") exists to answer, with the seriousness it deserves, the single most urgent recurring question in the Southeastern United States: <strong>is it, in fact, Dragon Con yet.</strong></p>
  <p>The Service does not editorialize. It does not speculate. It consults a calendar, applies a peer-reviewed algorithm, and returns a verdict. That verdict is final, except on Mondays and Tuesdays, when it is deliberately not final, because nothing about that period is final. See "Our Methodology" below.</p>

  <h2>Our Methodology</h2>
  <p>Status is computed daily, automatically, by a small robot that has never attended Dragon Con and has no plans to. It does not need to. It has a calendar.</p>
  <p>The algorithm recognizes four states:</p>
  <ul>
    <li><strong>No.</strong> The default. The overwhelming majority of the year lives here. This is fine.</li>
    <li><strong>Depends on who you ask.</strong> The Monday and Tuesday immediately preceding Dragon Con. Programming has not started. Badges are not yet available. And yet — ask around. Someone in your group is already "basically there." The Service declines to adjudicate this and returns the only honest answer available.</li>
    <li><strong>Yes!!! (Wednesday is the new Thursday, right?)</strong> Wednesday. Registration has not opened. This is not, technically, a convention day. And yet the lobby fills, the carpet (see below) is once again photographed, and a meaningful percentage of attendees have already informally begun. The Service acknowledges the vibe without endorsing the premise.</li>
    <li><strong>Yes!!!</strong> Thursday through Labor Day itself. Programming is happening. Panels are happening. It is, unambiguously, Dragon Con. The robot is very confident here.</li>
  </ul>

  <h2>Frequently Asked Questions</h2>

  <h3>Is this the official Dragon Con website?</h3>
  <p>No. Dragon Con's official website is dragoncon.org. This is a smaller, more focused service that answers one (1) question and does not sell badges, host programming, or represent the convention in any capacity.</p>

  <h3>Why does the site care so much about Wednesday specifically?</h3>
  <p>Because everyone else does too. Ask any attendee when Dragon Con "really starts" and you will get a fight, not an answer. The Service's position — Wednesday is a beautiful, badge-less limbo — is the closest thing to consensus this debate has ever produced.</p>

  <h3>What is the Cult of the Marriott Carpet?</h3>
  <p>A parade group, founded by Eternal Zan in 2017, dedicated to the Atlanta Marriott Marquis's distinctive geometric carpet pattern — a design so beloved that in 2013 two attendees cosplayed as it, went viral, and received an actual cease-and-desist from the carpet's manufacturer. The Cult has since produced a marching band, a color guard, a dinosaur mascot (Carpetsaurus Rex), and considerable grief when the hotel replaced the original pattern with a duller successor fans call the "Skid Marks" carpet.</p>

  <h3>Who is Jon?</h3>
  <p>Jon is a cardboard cutout of a FedEx delivery employee that has stood in the walkway between the Marriott and the Peachtree Center food court since 2019. He arrives each Thursday unadorned. By Friday he has acquired googly eyes. By Saturday, a lei, a mustache, and something that may or may not be fake blood. By Sunday he is unrecognizable, beloved, and the object of offerings (beer, pudding, candy) left in his honor. By Monday, he is gone, and a shrine remains. Cofounded by Mike Piazza and Ken Bryer, the Cult of Jon now numbers in the thousands. He did not ask for this. He is, nonetheless, the Deliverer.</p>

  <h3>What's the deal with badge ribbons?</h3>
  <p>Small strips of cardstock, given freely, that attach to the bottom of a con badge and — over the course of several days — form what attendees call a "badge beard." The tradition traces to the Loyal Order of the Ribbon, founded in 2017, which printed 1,500 ribbons and inadvertently created an economy. The current record for longest badge beard stands at 34 feet, 9 inches (369 ribbons), set in 2021.</p>

  <h3>Why does everyone dress as the same three things every year?</h3>
  <p>Because whatever dominated theaters or streaming that summer will, without fail, generate no fewer than forty near-identical costumes on the convention floor by Friday afternoon. This is not a bug. It is the ecosystem functioning as intended. The Service considers it a load-bearing tradition and asks that you be kind to costume number thirty-one.</p>

  <h2>Governance</h2>
  <p>This page is maintained with the same rigor as the rest of the Service: occasionally, and mostly by a GitHub Action.</p>
  <p><a href="/">Back to the only question that matters →</a></p>
</article>
```

- [ ] **Step 3: Add the sitemap entry**

In `sitemap.xml`, add a second `<url>` block after the existing homepage entry (keep the homepage entry unchanged), so the file reads:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://isitdragonconyet.com/</loc>
    <lastmod>2026-07-31</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://isitdragonconyet.com/about.html</loc>
    <lastmod>2026-07-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

(Use today's actual date for `<lastmod>` if it differs from 2026-07-31 at implementation time.)

- [ ] **Step 4: Re-run the verification check from Step 1**

```bash
test -f about.html \
  && grep -q '<title>About — Is It Dragon Con Yet?</title>' about.html \
  && grep -q 'application/ld+json' about.html \
  && grep -q 'rel="canonical" href="https://isitdragonconyet.com/about.html"' about.html \
  && grep -q 'about.html' sitemap.xml \
  && echo "PASS" || echo "FAIL"
```

Expected: `PASS`

- [ ] **Step 5: Validate JSON-LD, XML, and the Event-schema exclusion**

```bash
node -e "JSON.parse(require('fs').readFileSync('about.html','utf8').match(/<script type=\"application\/ld\+json\">\s*([\s\S]*?)\s*<\/script>/)[1]); console.log('JSON-LD valid')"
python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml'); print('sitemap.xml well-formed')"
! grep -q '"@type": *"Event"' about.html && echo "no Event schema present (as required)"
```

Expected: `JSON-LD valid`, `sitemap.xml well-formed`, `no Event schema present (as required)`.

- [ ] **Step 6: Smoke-test rendering**

```bash
python3 -m http.server 8934 &
sleep 1
curl -s http://localhost:8934/about.html | grep -c '<h3>' # expect 6 (six FAQ questions)
kill %1
```

Expected: `6`.

- [ ] **Step 7: Commit**

```bash
git add about.html sitemap.xml
git commit -m "$(cat <<'EOF'
Add about.html with site explanation and Dragon Con lore FAQ

Deadpan-official copy covering how the daily status is computed plus
researched, sourced answers about Dragon Con traditions: the Cult of
the Marriott Carpet, the Cult of Jon, badge ribbons, and the yearly
meta-cosplay phenomenon. Own canonical tag, OG/Twitter tags, and an
AboutPage JSON-LD block (isPartOf the homepage's WebSite entity, no
Event-type schema per design constraints). Added to sitemap.xml.
EOF
)"
```

---

### Task 2: Add the corner "about" link to `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `about.html` existing at `/about.html` (produced by Task 1).
- Produces: nothing consumed by later tasks — this is the final task in the plan.

- [ ] **Step 1: Write the verification check and confirm it fails**

```bash
grep -q 'href="/about.html"' index.html \
  && grep -q '\.corner-link' index.html \
  && echo "PASS" || echo "FAIL"
```

Expected: `FAIL` (index.html doesn't reference `/about.html` or `.corner-link` yet).

- [ ] **Step 2: Add the corner-link CSS rule**

In `index.html`, inside the existing `<style>` block, add this rule (after the existing `a:hover` rule):

```css
    .corner-link { position: fixed; right: 12px; bottom: 8px; font-size: 11px; color: rgba(247, 215, 69, 0.5); text-decoration: none; }
    .corner-link:hover, .corner-link:focus { color: #F7D745; text-decoration: underline; }
```

This keeps the link in the same gold hue as the rest of the site's palette, just dimmed to ~50% opacity so it doesn't visually compete with the status text — and restores full color plus an underline on hover/focus, so it's never harder to find than "small and in the corner." It is never `display:none`, `visibility:hidden`, `opacity:0`, or off-screen.

- [ ] **Step 3: Add the link element**

In `index.html`, add this line immediately after the closing `</article>` tag (as a sibling, not inside the article):

```html
<a href="/about.html" class="corner-link">about</a>
```

- [ ] **Step 4: Re-run the verification check from Step 1**

```bash
grep -q 'href="/about.html"' index.html \
  && grep -q '\.corner-link' index.html \
  && echo "PASS" || echo "FAIL"
```

Expected: `PASS`

- [ ] **Step 5: Confirm the link is never hidden**

```bash
! grep -A2 '\.corner-link {' index.html | grep -qE 'display:\s*none|visibility:\s*hidden|opacity:\s*0' && echo "not hidden (as required)"
```

Expected: `not hidden (as required)`

- [ ] **Step 6: Manual visual check**

```bash
python3 -m http.server 8934 &
sleep 1
echo "Open http://localhost:8934/ in a browser and confirm:"
echo "  - a small 'about' link is visible in the bottom-right corner"
echo "  - it's legible but clearly more muted than the main gold status text"
echo "  - hovering it brightens to full gold with an underline"
echo "  - clicking it navigates to /about.html"
kill %1
```

This step needs an actual browser — confirm visually rather than trying to script it.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add subtle corner link to the about page

A real, always-visible <a href="/about.html"> fixed to the bottom-right
corner — dimmed to ~50% opacity of the site's existing gold to stay out
of the way of the main status text, full contrast plus underline on
hover/focus. Never display:none/opacity:0/off-screen, per the design
constraint against anything that reads as hidden-text SEO.
EOF
)"
```
