#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const DESIGN_MD = path.join(ROOT, 'DESIGN.md');
const OUT_FILE = path.join(ROOT, 'docs', 'index.html');

// ─── helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Extract a hex or rgba colour from a raw markdown cell string */
function extractColor(raw) {
  // strip markdown inline code backticks
  const text = raw.replace(/`/g, '');
  const hex = text.match(/#([0-9A-Fa-f]{3,8})\b/);
  if (hex) return hex[0];
  const rgba = text.match(/rgba?\([^)]+\)/);
  if (rgba) return rgba[0];
  return null;
}

/** Convert a marked table cell to plain string */
function cellText(cell) {
  if (!cell) return '';
  // marked v12: cell is { text, tokens[] }
  if (typeof cell === 'object' && cell.text != null) return cell.text;
  if (typeof cell === 'string') return cell;
  return String(cell);
}

/** Slugify a heading for anchor IDs */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── section-aware renderer ───────────────────────────────────────────────────

const COLOR_SECTION = '2. Color Palette & Roles';
const TYPE_SECTION  = '3. Typography Rules';

function isColorSection(h2) { return h2.includes('Color Palette'); }
function isTypeSection(h2)  { return h2.includes('Typography'); }
function isComponentSection(h2) { return /^4\./.test(h2); }

// ─── rendering helpers ────────────────────────────────────────────────────────

function renderColorTable(headers, rows) {
  // Find columns dynamically (supports Token|Value|Role and Token|Mobile|Value|Role)
  const headerTexts = headers.map(h => cellText(h).toLowerCase().replace(/\*\*/g,''));
  const valIdx = headerTexts.indexOf('value');
  const roleIdx = headerTexts.indexOf('role');
  let html = '<div class="swatch-grid">';
  for (const row of rows) {
    const token = cellText(row[0]).replace(/`/g, '');
    const value = cellText(row[valIdx >= 0 ? valIdx : 1]).replace(/`/g, '');
    const role  = cellText(row[roleIdx >= 0 ? roleIdx : row.length - 1]).replace(/`/g, '');
    const color = extractColor(value);
    const swatchStyle = color
      ? `background:${color};`
      : 'background: repeating-linear-gradient(45deg,#ccc 0,#ccc 5px,#fff 5px,#fff 10px);';
    html += `
      <div class="swatch-row">
        <div class="swatch" style="${escapeHtml(swatchStyle)}" title="${escapeHtml(color || 'no color')}"></div>
        <code class="token-name">${escapeHtml(token)}</code>
        <span class="token-value">${escapeHtml(color || value)}</span>
        <span class="token-role">${escapeHtml(role)}</span>
      </div>`;
  }
  html += '</div>';
  return html;
}

function renderTypeScaleTable(headers, rows) {
  const headerTexts = headers.map(h => cellText(h).toLowerCase().replace(/\*\*/g,''));
  const sizeIdx = headerTexts.indexOf('size');
  const spIdx = headerTexts.findIndex(h => h.includes('spacing'));
  let html = '<div class="type-scale">';
  for (const row of rows) {
    const token   = cellText(row[0]).replace(/`/g, '');
    const sizeRaw = cellText(row[sizeIdx >= 0 ? sizeIdx : 1]).replace(/`/g, '');
    const spacing = cellText(row[spIdx >= 0 ? spIdx : 2]).replace(/`/g, '');
    // parse rem or px
    const remMatch = sizeRaw.match(/([\d.]+)rem/);
    const pxMatch  = sizeRaw.match(/([\d.]+)px/);
    const remVal   = remMatch ? remMatch[1] : (pxMatch ? (parseFloat(pxMatch[1])/16).toFixed(3) : '1');
    const lsVal    = spacing === 'normal' ? 'normal' : spacing;
    const label    = sizeRaw.split('/')[0].trim();
    html += `
      <div class="type-specimen">
        <p class="specimen-text" style="font-size:${remVal}rem;letter-spacing:${lsVal};font-family:'Space Grotesk',ui-sans-serif,system-ui">
          The quick brown fox jumps
        </p>
        <div class="specimen-meta">
          <code>${escapeHtml(token)}</code>
          <span>${escapeHtml(label)}</span>
          <span>letter-spacing: ${escapeHtml(lsVal)}</span>
        </div>
      </div>`;
  }
  html += '</div>';
  return html;
}

function renderTypeHierarchyTable(rows) {
  const weightMap = { '300':'Light','400':'Regular','500':'Medium','600':'SemiBold','700':'Bold','800':'ExtraBold' };
  let html = '<div class="type-hierarchy">';
  for (const row of rows) {
    const role    = cellText(row[0]).replace(/`/g,'');
    const size    = cellText(row[1]).replace(/`/g,'');
    const weight  = cellText(row[2]).replace(/`/g,'');
    const spacing = cellText(row[3]).replace(/`/g,'');
    const font    = cellText(row[4]).replace(/`/g,'');
    const fontFamily = font.includes('Mono')
      ? "'Space Mono',ui-monospace,monospace"
      : "'Space Grotesk',ui-sans-serif,system-ui";
    const remVal = size.replace('rem','');
    const lsVal  = spacing === 'normal' ? 'normal' : spacing;
    const wLabel = weightMap[weight] || weight;
    html += `
      <div class="hierarchy-row">
        <div class="hierarchy-specimen" style="font-size:${escapeHtml(size)};font-weight:${escapeHtml(weight)};letter-spacing:${escapeHtml(lsVal)};font-family:${fontFamily}">
          ${escapeHtml(role)}
        </div>
        <div class="hierarchy-meta">
          <code>${escapeHtml(size)}</code>
          <span>${escapeHtml(wLabel)} (${escapeHtml(weight)})</span>
          <span>${escapeHtml(font)}</span>
        </div>
      </div>`;
  }
  html += '</div>';
  return html;
}

function renderStandardTable(headers, rows) {
  let html = '<div class="table-wrap"><table><thead><tr>';
  for (const h of headers) {
    html += `<th>${escapeHtml(cellText(h).replace(/\*\*/g,''))}`;
  }
  html += '</tr></thead><tbody>';
  for (const row of rows) {
    html += '<tr>';
    for (const cell of row) {
      const raw = cellText(cell);
      // render inline code
      const rendered = raw.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      html += `<td>${rendered}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
}

// Component demo snippets keyed by component heading slug
const COMPONENT_DEMOS = {
  '41-text-button': `
    <div class="demo-strip">
      <button class="demo-btn-primary">Primary</button>
      <button class="demo-btn-default">Default</button>
      <button class="demo-btn-destructive">Destructive</button>
      <button class="demo-btn-ghost">Ghost</button>
      <button class="demo-btn-link">Link</button>
      <button class="demo-btn-primary" disabled style="opacity:0.4;cursor:not-allowed">Disabled</button>
    </div>`,
  '43-text-input': `
    <div class="demo-strip demo-col">
      <input class="demo-input" placeholder="Default input" />
      <input class="demo-input demo-input-focus" value="Focused input" />
      <input class="demo-input demo-input-error" value="Error state" />
      <input class="demo-input" disabled placeholder="Disabled input" style="opacity:0.5;cursor:not-allowed"/>
    </div>`,
  '46-toggle-switch': `
    <div class="demo-strip">
      <label class="demo-toggle">
        <input type="checkbox" checked style="display:none"/>
        <span class="demo-track demo-track-on"><span class="demo-thumb"></span></span>
        <span style="font-size:13px;color:#404040">ON</span>
      </label>
      <label class="demo-toggle">
        <input type="checkbox" style="display:none"/>
        <span class="demo-track demo-track-off"><span class="demo-thumb demo-thumb-off"></span></span>
        <span style="font-size:13px;color:#404040">OFF</span>
      </label>
    </div>`,
  '47-checkbox': `
    <div class="demo-strip demo-col">
      <label class="demo-checkbox-row"><span class="demo-check demo-check-on">✓</span> Checked</label>
      <label class="demo-checkbox-row"><span class="demo-check"></span> Unchecked</label>
      <label class="demo-checkbox-row" style="opacity:0.4"><span class="demo-check demo-check-on">✓</span> Checked (disabled)</label>
    </div>`,
  '48-cards-containers': `
    <div class="demo-strip" style="align-items:flex-start">
      <div class="demo-card">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="font-size:1.125rem;font-weight:500;color:#171717;font-family:'Space Grotesk',sans-serif">Model Card</span>
          <span class="demo-badge-type">LLM</span>
        </div>
        <div style="font-size:0.75rem;font-family:'Space Mono',monospace;color:#737373">7B · Q4_0 · 4.2 GB</div>
      </div>
      <div class="demo-card demo-card-featured">
        <div style="font-size:1.125rem;font-weight:500;color:#171717;font-family:'Space Grotesk',sans-serif">Featured Card</div>
        <div style="font-size:0.875rem;color:#737373;margin-top:8px">Selected / featured state</div>
      </div>
    </div>`,
  '49-badges-status-indicators': `
    <div class="demo-strip">
      <span class="demo-badge demo-badge-running">Running</span>
      <span class="demo-badge demo-badge-warning">Warning</span>
      <span class="demo-badge demo-badge-error">Error</span>
      <span class="demo-badge demo-badge-inactive">Inactive</span>
      <span class="demo-badge demo-badge-info">Info</span>
    </div>`,
  '411-code-blocks-terminal-output': `
    <div class="demo-code">
      <span style="color:#003A4A">model</span>: llama3-8b-q4<br>
      <span style="color:#003A4A">status</span>: <span style="color:#8FC31F">loaded</span><br>
      <span style="color:#A3A3A3"># inference ready</span><br>
      <span style="color:#171717">tokens/s</span>: 42.7
    </div>`,
  '415-pop-up': `
    <div class="demo-popup">
      <div class="demo-popup-top">
        <span style="font-size:13px;font-weight:500;color:#525252;font-family:'Space Grotesk',sans-serif;padding-left:8px">Publish Model</span>
        <button class="demo-close">✕</button>
      </div>
      <div class="demo-popup-content">
        <p style="font-size:13px;color:#404040;margin:0">Ready to publish this model to the registry?</p>
        <label class="demo-checkbox-row" style="margin-top:12px"><span class="demo-check demo-check-on">✓</span> I agree to the terms</label>
      </div>
      <div class="demo-popup-bottom">
        <button class="demo-btn-default" style="width:72px;height:32px;border-radius:10px;font-size:14px">Cancel</button>
        <button class="demo-btn-primary" style="width:72px;height:32px;border-radius:10px;font-size:14px">Publish</button>
      </div>
    </div>`,
};

// ─── main build ───────────────────────────────────────────────────────────────

function build() {
  const md = fs.readFileSync(DESIGN_MD, 'utf8');
  const tokens = marked.lexer(md);

  // Pass 1: collect headings for sidebar nav
  const navItems = [];
  for (const tok of tokens) {
    if (tok.type === 'heading') {
      const text = tok.text.replace(/\*\*/g,'').replace(/`/g,'');
      navItems.push({ depth: tok.depth, text, id: slugify(text) });
    }
  }

  // Pass 2: render body
  let currentH2 = '';
  let currentH3 = '';
  let bodyHtml   = '';
  let swatchCount = 0, specimenCount = 0, componentCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (tok.type === 'heading') {
      const text = tok.text.replace(/\*\*/g,'').replace(/`/g,'');
      const id   = slugify(text);
      const tag  = `h${tok.depth}`;
      if (tok.depth === 2) currentH2 = text;
      if (tok.depth === 3) currentH3 = text;
      const cls = tok.depth <= 2 ? ' class="section-heading"' : '';
      bodyHtml += `<${tag} id="${escapeHtml(id)}"${cls}>${escapeHtml(text)}</${tag}>\n`;
      if (isComponentSection(text)) componentCount++;
      continue;
    }

    if (tok.type === 'table') {
      const headers = tok.header;
      const rows    = tok.rows;

      if (isColorSection(currentH2)) {
        bodyHtml += renderColorTable(headers, rows);
        swatchCount += rows.length;
      } else if (isTypeSection(currentH2) && currentH3.includes('Type Scale')) {
        bodyHtml += renderTypeScaleTable(headers, rows);
        specimenCount += rows.length;
      } else if (isTypeSection(currentH2) && currentH3.includes('Type Hierarchy')) {
        bodyHtml += renderTypeHierarchyTable(rows);
        specimenCount += rows.length;
      } else {
        bodyHtml += renderStandardTable(headers, rows);
      }

      // Inject component demo after the first table in each component section
      if (isComponentSection(currentH2)) {
        // find the component slug from h3
        const compSlug = slugify(currentH3);
        if (COMPONENT_DEMOS[compSlug] && !bodyHtml.includes(`demo-injected-${compSlug}`)) {
          bodyHtml += `<div class="component-demo demo-injected-${escapeHtml(compSlug)}" aria-label="Visual demo">${COMPONENT_DEMOS[compSlug]}</div>`;
        }
      }
      continue;
    }

    if (tok.type === 'paragraph') {
      const html = marked.parseInline(tok.text);
      bodyHtml += `<p>${html}</p>\n`;
      continue;
    }

    if (tok.type === 'blockquote') {
      const inner = tok.tokens.map(t => {
        if (t.type === 'paragraph' && t.text) return marked.parseInline(t.text);
        if (t.text) return escapeHtml(t.text);
        return '';
      }).join(' ');
      bodyHtml += `<blockquote>${inner}</blockquote>\n`;
      continue;
    }

    if (tok.type === 'code') {
      bodyHtml += `<pre><code>${escapeHtml(tok.text)}</code></pre>\n`;
      continue;
    }

    if (tok.type === 'list') {
      const tag = tok.ordered ? 'ol' : 'ul';
      bodyHtml += `<${tag}>`;
      for (const item of tok.items) {
        const inner = item.tokens.map(t => {
          if (t.type === 'text') return marked.parseInline(t.text);
          return t.raw || '';
        }).join('');
        bodyHtml += `<li>${inner}</li>`;
      }
      bodyHtml += `</${tag}>\n`;
      continue;
    }

    if (tok.type === 'hr') {
      bodyHtml += '<hr/>\n';
      continue;
    }

    if (tok.type === 'space') continue;
  }

  // Build sidebar HTML
  let sidebarHtml = '';
  for (const item of navItems) {
    if (item.depth > 3) continue;
    const indent = item.depth === 3 ? ' style="padding-left:1.25rem;font-size:0.8rem"' : '';
    sidebarHtml += `<a href="#${escapeHtml(item.id)}" class="nav-link nav-d${item.depth}"${indent}>${escapeHtml(item.text)}</a>\n`;
  }

  // ─── full page template ──────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CSG Design System — SenseCraft AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
/* ── Design tokens ─────────────────────────────────────── */
:root {
  --primary-50:#F5FCE8;--primary-100:#E8F8C8;--primary-200:#D4F394;
  --primary-300:#BDED60;--primary-400:#A8E03C;--primary-450:#A3D830;
  --primary-500:#8FC31F;--primary-600:#76A219;--primary-700:#5D8113;
  --primary-800:#44600D;--primary-900:#2B3F08;
  --secondary-50:#E6F1F3;--secondary-100:#CCE3E7;--secondary-200:#99C7CF;
  --secondary-300:#66ABB7;--secondary-400:#338F9F;--secondary-450:#045E77;
  --secondary-500:#003A4A;--secondary-600:#002E3B;--secondary-700:#00232C;
  --secondary-800:#00171E;--secondary-900:#000C0F;
  --neutral-50:#FAFAFA;--neutral-100:#F5F5F5;--neutral-200:#E5E5E5;
  --neutral-300:#D4D4D4;--neutral-400:#A3A3A3;--neutral-500:#737373;
  --neutral-600:#525252;--neutral-700:#404040;--neutral-800:#262626;
  --neutral-900:#171717;--white:#FFFFFF;--black:#000000;
  --success:#8FC31F;--success-light:#A8E03C;--success-dark:#76A219;
  --warning:#FF9500;--warning-light:#FFB340;--warning-dark:#CC7700;
  --error:#DC2626;--error-light:#EF4444;--error-dark:#B91C1C;
  --info:#003A4A;--info-light:#338F9F;--info-dark:#002E3B;
  --border-light:#F5F5F5;--border:#E5E5E5;--border-regular:#D9D9D9;
  --border-medium:#D4D4D4;--border-dark:#A3A3A3;
  --border-primary:#8FC31F;--border-secondary:#003A4A;
  --border-success:#8FC31F;--border-warning:#FF9500;--border-error:#DC2626;
  --radius-none:0;--radius-sm:4px;--radius-md:8px;--radius-lg:12px;
  --radius-xl:16px;--radius-2xl:24px;--radius-full:9999px;
  --shadow-2xl:0px 10px 24px -6px rgba(0,0,0,0.15);
  --font-family-en:'Space Grotesk',ui-sans-serif,system-ui;
  --font-family-cn:'Noto Sans SC',sans-serif;
  --font-family-code:'Space Mono',ui-monospace,monospace;
  --sidebar-w:260px;
}

/* ── Reset & base ──────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{
  font-family:var(--font-family-en);
  background:var(--white);
  color:var(--neutral-700);
  line-height:1.6;
  display:flex;
  min-height:100vh;
}

/* ── Sidebar ───────────────────────────────────────────── */
.sidebar{
  position:fixed;top:0;left:0;bottom:0;
  width:var(--sidebar-w);
  background:var(--neutral-50);
  border-right:1px solid var(--border);
  overflow-y:auto;
  padding:0 0 2rem;
  z-index:100;
}
.sidebar-header{
  padding:1.5rem 1.25rem 1rem;
  border-bottom:1px solid var(--border);
  margin-bottom:0.5rem;
}
.sidebar-header h1{
  font-size:0.875rem;font-weight:700;color:var(--secondary-500);
  letter-spacing:0.05em;text-transform:uppercase;
}
.sidebar-header p{
  font-size:0.75rem;color:var(--neutral-500);margin-top:2px;
}
.nav-link{
  display:block;padding:0.3rem 1.25rem;
  font-size:0.8125rem;color:var(--neutral-600);
  text-decoration:none;border-left:2px solid transparent;
  transition:color .15s,background .15s,border-color .15s;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.nav-link:hover{color:var(--neutral-900);background:var(--neutral-100);border-left-color:var(--border-medium)}
.nav-link.nav-d2{font-weight:500;font-size:0.8125rem;color:var(--neutral-700);margin-top:0.25rem}
.nav-link.nav-d3{padding-left:2rem;font-size:0.75rem}

/* ── Main content ──────────────────────────────────────── */
.main{
  margin-left:var(--sidebar-w);
  flex:1;
  max-width:calc(100% - var(--sidebar-w));
  padding:3rem 4rem 6rem;
}
.main > * + *{margin-top:1rem}

h1{font-size:3rem;font-weight:800;letter-spacing:-0.03rem;color:var(--neutral-900);margin-top:0;line-height:1.1}
h2.section-heading{
  font-size:1.875rem;font-weight:600;letter-spacing:-0.01rem;
  color:var(--secondary-500);margin-top:3rem;padding-top:3rem;
  border-top:1px solid var(--border);
}
h3{font-size:1.375rem;font-weight:500;letter-spacing:-0.01rem;color:var(--neutral-900);margin-top:2rem}
h4{font-size:1rem;font-weight:600;color:var(--neutral-800);margin-top:1.5rem}
p{color:var(--neutral-700);font-size:0.9375rem;line-height:1.7}
code{
  font-family:var(--font-family-code);font-size:0.8125rem;
  background:var(--neutral-100);color:var(--secondary-500);
  padding:0.125rem 0.375rem;border-radius:var(--radius-sm);
}
pre{
  background:var(--neutral-100);border:1px solid var(--border);
  border-radius:var(--radius-md);padding:1rem;overflow-x:auto;
  font-family:var(--font-family-code);font-size:0.8125rem;
  color:var(--neutral-900);
}
pre code{background:none;padding:0;color:inherit}
blockquote{
  border-left:3px solid var(--primary-500);
  padding:0.75rem 1rem;margin:1rem 0;
  background:var(--primary-50);border-radius:0 var(--radius-md) var(--radius-md) 0;
  color:var(--neutral-700);font-size:0.9rem;
}
hr{border:none;border-top:1px solid var(--border);margin:2rem 0}
ul,ol{padding-left:1.5rem;color:var(--neutral-700);font-size:0.9375rem}
li{margin-top:0.25rem}
strong{color:var(--neutral-900)}

/* ── Tables ────────────────────────────────────────────── */
.table-wrap{overflow-x:auto;margin:1rem 0}
table{width:100%;border-collapse:collapse;font-size:0.875rem}
th{
  text-align:left;padding:0.5rem 0.75rem;
  background:var(--neutral-50);color:var(--neutral-600);
  font-weight:600;font-size:0.8rem;letter-spacing:0.03em;text-transform:uppercase;
  border-bottom:2px solid var(--border);
}
td{
  padding:0.5rem 0.75rem;border-bottom:1px solid var(--border-light);
  color:var(--neutral-700);vertical-align:top;line-height:1.5;
}
tr:hover td{background:var(--neutral-50)}

/* ── Color swatches ────────────────────────────────────── */
.swatch-grid{display:flex;flex-direction:column;gap:0.375rem;margin:1rem 0}
.swatch-row{
  display:grid;grid-template-columns:40px 220px 120px 1fr;
  align-items:center;gap:0.75rem;padding:0.375rem 0;
  border-bottom:1px solid var(--border-light);
}
.swatch{
  width:36px;height:36px;border-radius:var(--radius-md);
  border:1px solid var(--border-medium);flex-shrink:0;
}
.token-name{font-family:var(--font-family-code);font-size:0.8rem;color:var(--secondary-500);background:transparent;padding:0}
.token-value{font-family:var(--font-family-code);font-size:0.8rem;color:var(--neutral-600)}
.token-role{font-size:0.8rem;color:var(--neutral-500)}

/* ── Typography specimens ──────────────────────────────── */
.type-scale{display:flex;flex-direction:column;gap:1.5rem;margin:1.5rem 0}
.type-specimen{border-bottom:1px solid var(--border-light);padding-bottom:1.25rem}
.specimen-text{font-family:var(--font-family-en);color:var(--neutral-900);line-height:1.2;margin:0 0 0.5rem}
.specimen-meta{display:flex;gap:1rem;flex-wrap:wrap}
.specimen-meta code{font-size:0.75rem}
.specimen-meta span{font-size:0.75rem;color:var(--neutral-500)}

.type-hierarchy{display:flex;flex-direction:column;gap:1.25rem;margin:1.5rem 0}
.hierarchy-row{display:flex;align-items:baseline;gap:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border-light)}
.hierarchy-specimen{flex:0 0 auto;max-width:55%;color:var(--neutral-900);line-height:1.15}
.hierarchy-meta{display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center}
.hierarchy-meta code{font-size:0.75rem}
.hierarchy-meta span{font-size:0.75rem;color:var(--neutral-500)}

/* ── Component demos ───────────────────────────────────── */
.component-demo{
  background:var(--neutral-50);border:1px solid var(--border);
  border-radius:var(--radius-lg);padding:1.5rem;margin:1.25rem 0;
  display:flex;align-items:center;justify-content:center;
}
.demo-strip{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.demo-strip.demo-col{flex-direction:column;align-items:flex-start}

/* Buttons */
.demo-btn-primary{
  height:36px;padding:0 16px;border-radius:var(--radius-md);border:none;
  background:var(--primary-500);color:#fff;font-family:var(--font-family-en);
  font-size:14px;font-weight:500;cursor:pointer;
}
.demo-btn-primary:hover{background:var(--primary-400)}
.demo-btn-default{
  height:36px;padding:0 16px;border-radius:var(--radius-md);
  background:var(--neutral-50);border:1px solid var(--border-regular);
  color:var(--neutral-700);font-family:var(--font-family-en);
  font-size:14px;font-weight:500;cursor:pointer;
}
.demo-btn-default:hover{border-color:var(--border-dark)}
.demo-btn-destructive{
  height:36px;padding:0 16px;border-radius:var(--radius-md);border:none;
  background:var(--error);color:#fff;font-family:var(--font-family-en);
  font-size:14px;font-weight:500;cursor:pointer;
}
.demo-btn-ghost{
  height:36px;padding:0 16px;border-radius:var(--radius-md);
  background:transparent;border:1px solid var(--border-regular);
  color:var(--neutral-700);font-family:var(--font-family-en);
  font-size:14px;font-weight:500;cursor:pointer;
}
.demo-btn-link{
  height:36px;padding:0 4px;border:none;background:transparent;
  color:var(--primary-500);font-family:var(--font-family-en);
  font-size:14px;font-weight:500;cursor:pointer;text-decoration:underline;
}

/* Text input */
.demo-input{
  height:42px;width:270px;background:var(--neutral-50);
  border:1px solid var(--border-regular);border-radius:var(--radius-md);
  padding:0 12px;font-family:var(--font-family-en);font-size:14px;
  color:var(--neutral-700);outline:none;
}
.demo-input-focus{border-color:var(--primary-500);box-shadow:0 0 0 2px rgba(143,195,31,0.15)}
.demo-input-error{border-color:var(--error)}

/* Toggle */
.demo-toggle{display:flex;align-items:center;gap:10px;cursor:pointer}
.demo-track{
  display:flex;align-items:center;width:52px;height:26px;
  border-radius:var(--radius-full);padding:2px;transition:background .2s;
}
.demo-track-on{background:var(--primary-500)}
.demo-track-off{background:var(--secondary-500)}
.demo-thumb{
  width:22px;height:22px;border-radius:50%;background:#fff;
  margin-left:auto;transition:margin .2s;
}
.demo-thumb-off{margin-left:0;background:var(--neutral-500)}

/* Checkbox */
.demo-checkbox-row{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--neutral-700);cursor:pointer}
.demo-check{
  width:18px;height:18px;border-radius:4px;border:1px solid var(--border-medium);
  display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;
}
.demo-check-on{background:var(--primary-500);border-color:var(--primary-500);color:#fff}

/* Cards */
.demo-card{
  background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);
  padding:20px;min-width:180px;max-width:220px;transition:border-color .2s;
}
.demo-card:hover{border-color:var(--primary-500)}
.demo-card-featured{border-color:var(--primary-500)}
.demo-badge-type{
  font-size:11px;font-weight:500;color:var(--secondary-500);
  background:var(--secondary-50);border:1px solid var(--secondary-100);
  border-radius:var(--radius-full);padding:2px 8px;
}

/* Badges */
.demo-badge{
  font-size:12px;font-weight:500;border-radius:var(--radius-full);
  padding:4px 10px;border:1px solid;
  font-family:var(--font-family-en);
}
.demo-badge-running{color:var(--primary-500);border-color:var(--primary-500);background:rgba(143,195,31,0.1)}
.demo-badge-warning{color:var(--warning);border-color:var(--warning);background:rgba(255,149,0,0.1)}
.demo-badge-error{color:var(--error);border-color:var(--error);background:rgba(220,38,38,0.1)}
.demo-badge-inactive{color:var(--neutral-400);border-color:var(--neutral-700);background:rgba(163,163,163,0.1)}
.demo-badge-info{color:var(--info-light);border-color:var(--secondary-500);background:rgba(51,143,159,0.1)}

/* Code block demo */
.demo-code{
  background:var(--neutral-100);border:1px solid var(--border);border-radius:var(--radius-md);
  padding:16px;font-family:var(--font-family-code);font-size:14px;
  color:var(--neutral-900);line-height:1.6;
}

/* Popup demo */
.demo-popup{
  background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);
  box-shadow:var(--shadow-2xl);width:360px;overflow:hidden;
}
.demo-popup-top{
  display:flex;align-items:center;justify-content:space-between;
  background:var(--neutral-50);border-bottom:1px solid var(--border-regular);
  height:36px;padding:4px;
}
.demo-close{
  width:28px;height:28px;border:none;background:transparent;
  cursor:pointer;border-radius:var(--radius-sm);font-size:12px;
  color:var(--neutral-500);display:flex;align-items:center;justify-content:center;
}
.demo-close:hover{background:var(--neutral-100)}
.demo-popup-content{padding:20px}
.demo-popup-bottom{
  padding:8px;display:flex;justify-content:flex-end;gap:8px;
  background:var(--neutral-50);border-top:1px solid var(--border-light);
}

/* ── Responsive ────────────────────────────────────────── */
@media(max-width:900px){
  .sidebar{display:none}
  .main{margin-left:0;max-width:100%;padding:2rem 1.5rem 4rem}
}
</style>
</head>
<body>

<nav class="sidebar">
  <div class="sidebar-header">
    <h1>CSG Design System</h1>
    <p>SenseCraft AI</p>
  </div>
  ${sidebarHtml}
</nav>

<main class="main">
  ${bodyHtml}
</main>

<script>
// Highlight active nav link on scroll
const links = document.querySelectorAll('.nav-link');
const headings = document.querySelectorAll('h1,h2,h3,h4');
const observer = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.isIntersecting) {
      const id = e.target.id;
      links.forEach(l => {
        l.style.borderLeftColor = l.getAttribute('href') === '#' + id
          ? 'var(--primary-500)' : '';
        l.style.color = l.getAttribute('href') === '#' + id
          ? 'var(--secondary-500)' : '';
      });
    }
  }
}, { rootMargin: '0px 0px -70% 0px', threshold: 0 });
headings.forEach(h => { if (h.id) observer.observe(h); });
</script>
</body>
</html>`;

  fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
  fs.writeFileSync(OUT_FILE, html, 'utf8');

  console.log(`Built: ${OUT_FILE}`);
  console.log(`  Color swatches : ${swatchCount}`);
  console.log(`  Type specimens : ${specimenCount}`);
  console.log(`  Component secs : ${componentCount}`);
}

build();
