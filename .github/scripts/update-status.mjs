// Computes today's Dragon Con status (Atlanta/Eastern time) and bakes it into
// index.html's meta tags and visible content. Run daily by
// .github/workflows/update-status.yml — this repo is static GitHub Pages
// with no server-side rendering, so the page has to be pre-baked with the
// correct status rather than computed client-side.

import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const indexPath = join(repoRoot, 'index.html');
const sitemapPath = join(repoRoot, 'sitemap.xml');
const siteOrigin = 'https://isitdragonconyet.com';

// Returns the chosen status plus the diagnostics that produced it (today's
// Atlanta date, the Labor Day it was measured against, and the day count),
// so the log line can show *why* the bot decided what it decided.
function getDragonConStatus(now = new Date()) {
  // Convert to Atlanta time (Eastern Time), then normalize to midnight so
  // day-of-week math isn't skewed by the current time-of-day
  const atlantaNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const today = new Date(atlantaNow.getFullYear(), atlantaNow.getMonth(), atlantaNow.getDate());

  // Find Labor Day for current year (first Monday in September)
  const currentYear = today.getFullYear();
  const currentLaborDay = new Date(currentYear, 8, 1); // September 1st
  while (currentLaborDay.getDay() !== 1) { // 1 = Monday
    currentLaborDay.setDate(currentLaborDay.getDate() + 1);
  }

  // Find Labor Day for next year
  const nextYearLaborDay = new Date(currentYear + 1, 8, 1);
  while (nextYearLaborDay.getDay() !== 1) {
    nextYearLaborDay.setDate(nextYearLaborDay.getDate() + 1);
  }

  // Use this year's Labor Day until it has passed, then look ahead to next year's
  const targetLaborDay = today <= currentLaborDay ? currentLaborDay : nextYearLaborDay;

  // Whole days between today and the target Labor Day (0 = Labor Day itself)
  const daysDiff = Math.round((targetLaborDay - today) / (1000 * 60 * 60 * 24));

  const diagnostics = {
    todayIso: today.toISOString().slice(0, 10),
    targetLaborDayIso: targetLaborDay.toISOString().slice(0, 10),
    daysDiff,
  };

  let status = {
    image: 'no.png',
    title: 'No 😢',
    description: '',
  };

  if (daysDiff === 6 || daysDiff === 7) { // Monday & Tuesday before Dragon Con
    status = {
      image: 'depends.png',
      title: 'Depends on who you ask.',
      description: '',
    };
  } else if (daysDiff === 5) { // Wednesday before Dragon Con
    status = {
      image: 'yes_wed.png',
      title: 'YES!!!',
      description: '(Wednesday is the new Thursday, right?)',
    };
  } else if (daysDiff >= 0 && daysDiff <= 4) { // Thursday before Labor Day through Labor Day itself
    status = {
      image: 'yes.png',
      title: 'YES!!!',
      description: `Dragon Con ${currentYear} is ON!!!`,
    };
  }

  return { ...status, ...diagnostics };
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Replaces the content="..." value of a single-line <meta ... content="..." />
// tag identified by a preceding attribute like `property="og:image"`.
function setMetaContent(html, identifyingAttr, newValue) {
  const escapedAttr = identifyingAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(<meta[^>]*${escapedAttr}[^>]*content=")[^"]*(")`);
  if (!regex.test(html)) {
    throw new Error(`Could not find <meta ${identifyingAttr}> in index.html`);
  }
  return html.replace(regex, `$1${escapeHtml(newValue)}$2`);
}

function setElementText(html, elementRegex, newText) {
  if (!elementRegex.test(html)) {
    throw new Error(`Could not find element matching ${elementRegex} in index.html`);
  }
  return html.replace(elementRegex, `$1${escapeHtml(newText)}$2`);
}

// Updates the `description` field inside the page's JSON-LD <script> block
function setJsonLdDescription(html, newDescription) {
  const regex = /(<script type="application\/ld\+json">\s*)([\s\S]*?)(\s*<\/script>)/;
  const match = html.match(regex);
  if (!match) {
    throw new Error('Could not find JSON-LD <script> block in index.html');
  }
  const data = JSON.parse(match[2]);
  data.description = newDescription;
  return html.replace(regex, `$1${JSON.stringify(data, null, 2)}$3`);
}

const status = getDragonConStatus();
const imageUrl = `${siteOrigin}/${status.image}`;
const combinedDescription = status.description ? `${status.title} ${status.description}` : status.title;

const originalHtml = readFileSync(indexPath, 'utf8');
let html = originalHtml;

html = setMetaContent(html, 'property="og:description"', combinedDescription);
html = setMetaContent(html, 'property="og:image"', imageUrl);
html = setMetaContent(html, 'property="og:image:alt"', combinedDescription);
html = setMetaContent(html, 'name="twitter:description"', combinedDescription);
html = setMetaContent(html, 'name="twitter:image"', imageUrl);
html = setMetaContent(html, 'name="twitter:image:alt"', combinedDescription);
html = setMetaContent(html, 'name="description"', combinedDescription);
html = setJsonLdDescription(html, combinedDescription);

html = setElementText(html, /(<h1 id="dragon-con-title">)[^<]*(<\/h1>)/, status.title);

html = html.replace(
  /<p id="dragon-con-description"[^>]*>[^<]*<\/p>/,
  status.description
    ? `<p id="dragon-con-description">${escapeHtml(status.description)}</p>`
    : `<p id="dragon-con-description" style="display:none"></p>`
);

const htmlChanged = html !== originalHtml;
if (htmlChanged) {
  writeFileSync(indexPath, html);
}

// Keep the sitemap's lastmod honest — only bump it when the page actually changed
if (htmlChanged) {
  const originalSitemap = readFileSync(sitemapPath, 'utf8');
  const newSitemap = originalSitemap.replace(
    /<lastmod>[^<]*<\/lastmod>/,
    `<lastmod>${status.todayIso}</lastmod>`
  );
  if (newSitemap !== originalSitemap) {
    writeFileSync(sitemapPath, newSitemap);
  }
}

// Log what was decided and why, so it shows up in the Action's run log
console.log(
  `today=${status.todayIso} (America/New_York)  ` +
  `targetLaborDay=${status.targetLaborDayIso}  daysDiff=${status.daysDiff}  ` +
  `title=${JSON.stringify(status.title)}  description=${JSON.stringify(status.description)}  ` +
  `image=${status.image}  changed=${htmlChanged}`
);

const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  appendFileSync(
    githubOutput,
    `changed=${htmlChanged}\nsummary=${status.title}${status.description ? ` (${status.description})` : ''}\n`
  );
}
