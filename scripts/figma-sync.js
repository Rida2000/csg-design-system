#!/usr/bin/env node
'use strict';

/**
 * CSG Design System — Figma Sync
 *
 * Reads the full Figma file via REST API and outputs a structured
 * extraction of colors, typography, components, spacing, and styles.
 *
 * Usage:
 *   FIGMA_TOKEN=xxx node scripts/figma-sync.js
 *   FIGMA_TOKEN=xxx node scripts/figma-sync.js --file-key ABC123
 *   FIGMA_TOKEN=xxx node scripts/figma-sync.js --update   (writes to DESIGN.md)
 *
 * Outputs a report to stdout by default.
 * With --update, merges extracted tokens into DESIGN.md.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── config ───────────────────────────────────────────────────────────────────

const DEFAULT_FILE_KEY = 'QMSCzUBQ5hrq9Z3DNifY6Q';
const FIGMA_TOKEN = process.env.FIGMA_TOKEN || process.env.FIGMA_API_KEY || '';
const ROOT = path.join(__dirname, '..');
const DESIGN_MD = path.join(ROOT, 'DESIGN.md');

const args = process.argv.slice(2);
const fileKey = getArg('--file-key') || DEFAULT_FILE_KEY;
const shouldUpdate = args.includes('--update');
const outputJson = args.includes('--json');

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

// ─── Figma API helpers ────────────────────────────────────────────────────────

function figmaGet(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://api.figma.com/v1${endpoint}`;
    const options = {
      headers: { 'X-FIGMA-TOKEN': FIGMA_TOKEN },
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Figma API ${res.statusCode}: ${data.slice(0, 200)}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── extractors ───────────────────────────────────────────────────────────────

/** Parse RGBA to hex */
function rgbaToHex(c) {
  if (!c) return '#000000';
  const r = Math.round((c.r || 0) * 255);
  const g = Math.round((c.g || 0) * 255);
  const b = Math.round((c.b || 0) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

/** Recursively collect all nodes from the document tree */
function collectNodes(node, list = []) {
  list.push(node);
  if (node.children) {
    for (const child of node.children) {
      collectNodes(child, list);
    }
  }
  return list;
}

/** Extract color styles from the file */
function extractColors(styles, nodes) {
  const colors = [];
  const nodeMap = new Map();
  for (const n of nodes) {
    if (n.id) nodeMap.set(n.id, n);
  }

  for (const [id, style] of Object.entries(styles)) {
    if (style.style_type === 'FILL') {
      const node = nodeMap.get(id);
      let hex = null;
      if (node && node.fills && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === 'SOLID' && fill.color) {
          hex = rgbaToHex(fill.color);
        }
      }
      colors.push({
        name: style.name,
        hex: hex,
        description: style.description || '',
      });
    }
  }
  return colors;
}

/** Extract text styles from the file */
function extractTypography(styles, nodes) {
  const typeStyles = [];
  const nodeMap = new Map();
  for (const n of nodes) {
    if (n.id) nodeMap.set(n.id, n);
  }

  for (const [id, style] of Object.entries(styles)) {
    if (style.style_type === 'TEXT') {
      const node = nodeMap.get(id);
      const ts = node?.style || {};
      typeStyles.push({
        name: style.name,
        fontFamily: ts.fontFamily || 'Unknown',
        fontWeight: ts.fontWeight || 400,
        fontSize: ts.fontSize || 16,
        letterSpacing: ts.letterSpacing || 0,
        lineHeight: ts.lineHeightPx || null,
        description: style.description || '',
      });
    }
  }
  return typeStyles;
}

/** Extract component metadata */
function extractComponents(components) {
  const comps = [];
  for (const [id, comp] of Object.entries(components)) {
    comps.push({
      id,
      name: comp.name,
      description: comp.description || '',
      containingFrame: comp.containing_frame?.name || '',
      componentSetId: comp.componentSetId || null,
    });
  }
  return comps;
}

/** Extract local variables (colors, spacing, etc.) */
async function extractVariables(fileKey) {
  try {
    const data = await figmaGet(`/files/${fileKey}/variables/local`);
    const variables = [];
    const collections = data.meta?.variableCollections || {};
    const vars = data.meta?.variables || {};

    for (const [id, v] of Object.entries(vars)) {
      const collection = collections[v.variableCollectionId];
      const modeId = collection?.defaultModeId;
      const value = modeId && v.valuesByMode?.[modeId];

      let resolvedValue = null;
      if (value) {
        if (v.resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
          resolvedValue = rgbaToHex(value);
        } else if (v.resolvedType === 'FLOAT' && typeof value === 'number') {
          resolvedValue = `${value}px`;
        } else if (typeof value === 'string') {
          resolvedValue = value;
        }
      }

      variables.push({
        name: v.name,
        type: v.resolvedType,
        collection: collection?.name || 'Unknown',
        value: resolvedValue,
        description: v.description || '',
      });
    }
    return variables;
  } catch (e) {
    console.warn(`  Warning: Could not fetch variables (${e.message}). Requires Figma Enterprise or paid plan.`);
    return [];
  }
}

/** Walk document tree and extract page/frame structure */
function extractStructure(document) {
  const pages = [];
  if (document.children) {
    for (const page of document.children) {
      const frames = [];
      if (page.children) {
        for (const frame of page.children) {
          frames.push({
            name: frame.name,
            type: frame.type,
            width: frame.absoluteBoundingBox?.width,
            height: frame.absoluteBoundingBox?.height,
            childCount: frame.children?.length || 0,
          });
        }
      }
      pages.push({
        name: page.name,
        frameCount: frames.length,
        frames,
      });
    }
  }
  return pages;
}

// ─── report formatters ────────────────────────────────────────────────────────

function formatReport(data) {
  let report = '';

  report += `# Figma Sync Report\n`;
  report += `File: ${data.fileName}\n`;
  report += `Last modified: ${data.lastModified}\n`;
  report += `Synced: ${new Date().toISOString()}\n\n`;

  // Structure
  report += `## Document Structure\n\n`;
  for (const page of data.structure) {
    report += `### ${page.name} (${page.frameCount} frames)\n`;
    for (const frame of page.frames) {
      const size = frame.width && frame.height ? ` — ${Math.round(frame.width)}x${Math.round(frame.height)}` : '';
      report += `- ${frame.name} (${frame.type}${size}, ${frame.childCount} children)\n`;
    }
    report += '\n';
  }

  // Variables
  if (data.variables.length > 0) {
    report += `## Design Variables (${data.variables.length} total)\n\n`;

    // Group by collection
    const byCollection = {};
    for (const v of data.variables) {
      const key = v.collection;
      if (!byCollection[key]) byCollection[key] = [];
      byCollection[key].push(v);
    }

    for (const [collection, vars] of Object.entries(byCollection)) {
      report += `### ${collection}\n\n`;

      // Group by type within collection
      const colorVars = vars.filter(v => v.type === 'COLOR');
      const floatVars = vars.filter(v => v.type === 'FLOAT');
      const otherVars = vars.filter(v => v.type !== 'COLOR' && v.type !== 'FLOAT');

      if (colorVars.length > 0) {
        report += `#### Colors\n`;
        report += `| Variable | Value | Description |\n`;
        report += `|----------|-------|-------------|\n`;
        for (const v of colorVars) {
          report += `| \`${v.name}\` | \`${v.value || '—'}\` | ${v.description} |\n`;
        }
        report += '\n';
      }

      if (floatVars.length > 0) {
        report += `#### Spacing / Sizing\n`;
        report += `| Variable | Value | Description |\n`;
        report += `|----------|-------|-------------|\n`;
        for (const v of floatVars) {
          report += `| \`${v.name}\` | \`${v.value || '—'}\` | ${v.description} |\n`;
        }
        report += '\n';
      }

      if (otherVars.length > 0) {
        report += `#### Other\n`;
        report += `| Variable | Type | Value | Description |\n`;
        report += `|----------|------|-------|-------------|\n`;
        for (const v of otherVars) {
          report += `| \`${v.name}\` | ${v.type} | \`${v.value || '—'}\` | ${v.description} |\n`;
        }
        report += '\n';
      }
    }
  }

  // Color styles
  if (data.colors.length > 0) {
    report += `## Color Styles (${data.colors.length})\n\n`;
    report += `| Name | Value | Description |\n`;
    report += `|------|-------|-------------|\n`;
    for (const c of data.colors) {
      report += `| ${c.name} | \`${c.hex || '—'}\` | ${c.description} |\n`;
    }
    report += '\n';
  }

  // Typography
  if (data.typography.length > 0) {
    report += `## Text Styles (${data.typography.length})\n\n`;
    report += `| Name | Font | Size | Weight | Letter Spacing |\n`;
    report += `|------|------|------|--------|----------------|\n`;
    for (const t of data.typography) {
      const ls = t.letterSpacing ? `${t.letterSpacing}px` : 'normal';
      report += `| ${t.name} | ${t.fontFamily} | ${t.fontSize}px | ${t.fontWeight} | ${ls} |\n`;
    }
    report += '\n';
  }

  // Components
  if (data.components.length > 0) {
    // Group by containing frame
    const byFrame = {};
    for (const c of data.components) {
      const key = c.containingFrame || 'Ungrouped';
      if (!byFrame[key]) byFrame[key] = [];
      byFrame[key].push(c);
    }

    report += `## Components (${data.components.length})\n\n`;
    for (const [frame, comps] of Object.entries(byFrame)) {
      report += `### ${frame}\n`;
      for (const c of comps) {
        report += `- **${c.name}**`;
        if (c.description) report += ` — ${c.description}`;
        report += '\n';
      }
      report += '\n';
    }
  }

  return report;
}

// ─── diff engine ──────────────────────────────────────────────────────────────

function diffAgainstDesignMd(data) {
  if (!fs.existsSync(DESIGN_MD)) return '\nNo DESIGN.md found to diff against.\n';

  const md = fs.readFileSync(DESIGN_MD, 'utf8');
  let diff = '\n## Diff Against Current DESIGN.md\n\n';
  let diffs = 0;

  // Check color variables against DESIGN.md token tables
  for (const v of data.variables.filter(v => v.type === 'COLOR' && v.value)) {
    // Try to find this color in DESIGN.md
    const nameNormalized = v.name.replace(/\//g, '-').toLowerCase();
    const hexInMd = new RegExp(`\`${v.value}\``, 'i');

    // Check if the variable name maps to a known token pattern
    if (!md.includes(v.value)) {
      diff += `- **New/changed color**: \`${v.name}\` = \`${v.value}\` — not found in DESIGN.md\n`;
      diffs++;
    }
  }

  // Check float variables (spacing)
  for (const v of data.variables.filter(v => v.type === 'FLOAT' && v.value)) {
    const pxVal = v.value;
    if (!md.includes(pxVal)) {
      diff += `- **New/changed spacing**: \`${v.name}\` = \`${v.value}\` — not found in DESIGN.md\n`;
      diffs++;
    }
  }

  if (diffs === 0) {
    diff += 'No differences detected. DESIGN.md appears up to date.\n';
  } else {
    diff += `\n**${diffs} potential difference(s)** found. Review above and update DESIGN.md accordingly.\n`;
  }

  return diff;
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!FIGMA_TOKEN) {
    console.error('Error: Set FIGMA_TOKEN environment variable.');
    console.error('  Create one at: https://www.figma.com/developers/api#access-tokens');
    console.error('');
    console.error('Usage:');
    console.error('  FIGMA_TOKEN=xxx node scripts/figma-sync.js');
    console.error('  FIGMA_TOKEN=xxx node scripts/figma-sync.js --update');
    console.error('  FIGMA_TOKEN=xxx node scripts/figma-sync.js --json');
    process.exit(1);
  }

  console.log(`Fetching Figma file: ${fileKey}...`);

  // Fetch file (with reduced depth for large files)
  const [file, variables] = await Promise.all([
    figmaGet(`/files/${fileKey}?depth=3`),
    extractVariables(fileKey),
  ]);

  console.log(`  File: ${file.name}`);
  console.log(`  Last modified: ${file.lastModified}`);

  const allNodes = collectNodes(file.document);
  console.log(`  Nodes: ${allNodes.length}`);

  const data = {
    fileName: file.name,
    fileKey,
    lastModified: file.lastModified,
    structure: extractStructure(file.document),
    variables,
    colors: extractColors(file.styles || {}, allNodes),
    typography: extractTypography(file.styles || {}, allNodes),
    components: extractComponents(file.components || {}),
  };

  console.log(`  Variables: ${data.variables.length}`);
  console.log(`  Color styles: ${data.colors.length}`);
  console.log(`  Text styles: ${data.typography.length}`);
  console.log(`  Components: ${data.components.length}`);
  console.log(`  Pages: ${data.structure.length}`);
  console.log('');

  if (outputJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const report = formatReport(data);
  const diffReport = diffAgainstDesignMd(data);

  if (shouldUpdate) {
    // Write sync report next to DESIGN.md
    const reportPath = path.join(ROOT, 'FIGMA_SYNC_REPORT.md');
    fs.writeFileSync(reportPath, report + diffReport, 'utf8');
    console.log(`Sync report written to: ${reportPath}`);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Review FIGMA_SYNC_REPORT.md for differences');
    console.log('  2. Use the csg-figma-sync agent to merge changes into DESIGN.md');
    console.log('  3. Run `npm run build` to regenerate the website');
  } else {
    console.log(report);
    console.log(diffReport);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
