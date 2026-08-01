# About page + subtle corner link — design spec

## Context

`isitdragonconyet.com` is a single-page joke site that answers whether it's
Dragon Con yet, with a daily status computed by a GitHub Action (see
`.github/scripts/update-status.mjs`) and baked into `index.html`. Prior work
in this repo fixed the day-diff logic, cleaned up Open Graph/Twitter Card
meta tags, and added legitimate SEO signals (canonical tag, JSON-LD
`WebSite`, `robots.txt`, `sitemap.xml`). This spec covers the next round:
a real second page (`about.html`) with substantial unique content, linked
from `index.html` via a small, unobtrusive corner link — more indexable
content and better internal linking, without resorting to hidden/cloaked
text (which was explicitly considered and rejected as it violates search
engine guidelines and risks the site being delisted).

## Goals

- Add a genuinely useful, genuinely visible `about.html` page with unique,
  substantial copy (more indexable text, better long-tail keyword surface).
- Link to it from `index.html` in a way that's real and crawlable but
  doesn't visually clutter the minimal joke-site design.
- Give `about.html` its own correct SEO metadata (title, description,
  canonical, OG/Twitter tags) and a `sitemap.xml` entry.
- Explicitly avoid anything that reads as cloaking/deceptive SEO: the
  corner link and all page content must be genuinely visible to a normal
  visitor, not hidden via CSS tricks, off-screen positioning, or
  zero-opacity/zero-font-size techniques.

## Non-goals

- No `Event`-type structured data for Dragon Con itself on any page — this
  isn't the official convention site, and event-rich-result markup could
  misrepresent this as an authoritative listing (same category of concern
  as hidden text).
- No changes to the daily status Action's scope — `about.html` content is
  static (not day-dependent), so `update-status.mjs` is not touched.
- No new inside-joke content beyond what's specified below — content is
  locked by this spec, not expanded during implementation.

## Corner link (on `index.html`)

- A real `<a href="/about.html">` element, always present in the DOM and
  visible — never `display:none`, `visibility:hidden`, `opacity:0`,
  off-screen positioning, or matching the background color.
- Positioned fixed to the bottom-right corner of the viewport.
- Small font-size (~11px), muted/desaturated color drawn from the existing
  palette (not full-contrast gold `#F7D745`), so it doesn't visually
  compete with the main status content.
- Brightens (full contrast) on `:hover`/`:focus` for both discoverability
  and accessibility — it must not fail contrast requirements on focus.
- Link text: something short and low-key, e.g. "about" (lowercase, no
  chrome/button styling — just text).

## `about.html`

### Structure

Deadpan mock-official tone throughout (approved). Sections, in order:

1. **Masthead / Statement of Purpose** — establishes "the Service" framing.
2. **Our Methodology** — mock-legal explanation of the day-diff logic and
   the four status states (No / Depends / Yes-Wednesday / Yes).
3. **Frequently Asked Questions**, covering:
   - Whether this is the official Dragon Con site (it is not; disclaims
     any affiliation, points to dragoncon.org).
   - Why Wednesday gets special treatment (the "is it starting yet" debate
     — corrected to NOT claim badge pickup/registration happens Wednesday;
     it's about attendees informally congregating a day early).
   - Cult of the Marriott Carpet (founder Eternal Zan, 2017; 2013 viral
     cosplay + cease-and-desist origin story; marching band/color guard/
     Carpetsaurus Rex offshoots; the "Skid Marks" replacement-carpet
     controversy).
   - Cult of Jon (the FedEx cardboard cutout cofounded by Mike Piazza and
     Ken Bryer in 2019; the Thu→Mon escalation from googly eyes to full
     shrine; 4,500+ member community).
   - Badge ribbons (Loyal Order of the Ribbon, founded 2017 by Josh
     Thomas; badge beards; 2021 record of 34'9" / 369 ribbons).
   - The yearly meta-cosplay phenomenon (generic — whatever pop culture
     saturated that summer cloning across the con floor — no unverifiable
     specifics claimed).
4. **Governance** — closing joke ("maintained... mostly by a GitHub
   Action") + link back to `/`.

### Exact copy

The full approved copy (verbatim, not to be altered during implementation
without going back to the user):

```markdown
# About Is It Dragon Con Yet?

## Statement of Purpose

*Is It Dragon Con Yet?* ("the Service") exists to answer, with the seriousness it deserves, the single most urgent recurring question in the Southeastern United States: **is it, in fact, Dragon Con yet.**

The Service does not editorialize. It does not speculate. It consults a calendar, applies a peer-reviewed algorithm, and returns a verdict. That verdict is final, except on Mondays and Tuesdays, when it is deliberately not final, because nothing about that period is final. See "Our Methodology" below.

## Our Methodology

Status is computed daily, automatically, by a small robot that has never attended Dragon Con and has no plans to. It does not need to. It has a calendar.

The algorithm recognizes four states:

- **No.** The default. The overwhelming majority of the year lives here. This is fine.
- **Depends on who you ask.** The Monday and Tuesday immediately preceding Dragon Con. Programming has not started. Badges are not yet available. And yet — ask around. Someone in your group is already "basically there." The Service declines to adjudicate this and returns the only honest answer available.
- **Yes!!! (Wednesday is the new Thursday, right?)** Wednesday. Registration has not opened. This is not, technically, a convention day. And yet the lobby fills, the carpet (see below) is once again photographed, and a meaningful percentage of attendees have already informally begun. The Service acknowledges the vibe without endorsing the premise.
- **Yes!!!** Thursday through Labor Day itself. Programming is happening. Panels are happening. It is, unambiguously, Dragon Con. The robot is very confident here.

## Frequently Asked Questions

**Is this the official Dragon Con website?**
No. Dragon Con's official website is dragoncon.org. This is a smaller, more focused service that answers one (1) question and does not sell badges, host programming, or represent the convention in any capacity.

**Why does the site care so much about Wednesday specifically?**
Because everyone else does too. Ask any attendee when Dragon Con "really starts" and you will get a fight, not an answer. The Service's position — Wednesday is a beautiful, badge-less limbo — is the closest thing to consensus this debate has ever produced.

**What is the Cult of the Marriott Carpet?**
A parade group, founded by Eternal Zan in 2017, dedicated to the Atlanta Marriott Marquis's distinctive geometric carpet pattern — a design so beloved that in 2013 two attendees cosplayed as it, went viral, and received an actual cease-and-desist from the carpet's manufacturer. The Cult has since produced a marching band, a color guard, a dinosaur mascot (Carpetsaurus Rex), and considerable grief when the hotel replaced the original pattern with a duller successor fans call the "Skid Marks" carpet.

**Who is Jon?**
Jon is a cardboard cutout of a FedEx delivery employee that has stood in the walkway between the Marriott and the Peachtree Center food court since 2019. He arrives each Thursday unadorned. By Friday he has acquired googly eyes. By Saturday, a lei, a mustache, and something that may or may not be fake blood. By Sunday he is unrecognizable, beloved, and the object of offerings (beer, pudding, candy) left in his honor. By Monday, he is gone, and a shrine remains. Cofounded by Mike Piazza and Ken Bryer, the Cult of Jon now numbers in the thousands. He did not ask for this. He is, nonetheless, the Deliverer.

**What's the deal with badge ribbons?**
Small strips of cardstock, given freely, that attach to the bottom of a con badge and — over the course of several days — form what attendees call a "badge beard." The tradition traces to the Loyal Order of the Ribbon, founded in 2017, which printed 1,500 ribbons and inadvertently created an economy. The current record for longest badge beard stands at 34 feet, 9 inches (369 ribbons), set in 2021.

**Why does everyone dress as the same three things every year?**
Because whatever dominated theaters or streaming that summer will, without fail, generate no fewer than forty near-identical costumes on the convention floor by Friday afternoon. This is not a bug. It is the ecosystem functioning as intended. The Service considers it a load-bearing tradition and asks that you be kind to costume number thirty-one.

## Governance

This page is maintained with the same rigor as the rest of the Service: occasionally, and mostly by a GitHub Action.

[Back to the only question that matters →](/)
```

### Technical/SEO details for `about.html`

- Reuses the same visual shell as `index.html` (same background, palette,
  `<article>` box treatment) so it doesn't feel like a different site —
  content is left-aligned prose inside the box rather than the centered
  single-line status treatment.
- Unique `<title>` (e.g. "About — Is It Dragon Con Yet?").
- Unique `<meta name="description">` (not a duplicate of the homepage's).
- `<link rel="canonical" href="https://isitdragonconyet.com/about.html" />`.
- Own Open Graph/Twitter Card tags (title/description/url pointing at
  `/about.html`). Image: reuses `no.png` — it's the one status image not
  tied to a specific moment in the con calendar, so it's the only one
  that stays accurate on an unfurl of a static, non-day-dependent page.
- Light JSON-LD: `AboutPage` type, `isPartOf` referencing the `WebSite`
  entity already declared on the homepage.
- Static — no involvement from `update-status.mjs` or the daily Action.

### Sitemap

Add a second `<url>` entry to `sitemap.xml` for `/about.html`, with a
`<lastmod>` set at creation time (static thereafter, since the page
doesn't change daily).

## Open questions / risks

None outstanding — tone, tag inclusion, and corrected Wednesday framing
were all confirmed with the user during brainstorming.
