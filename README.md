# CSG Design System

<!-- csg:meta-start -->
**Figma Version:** `1.0.0` · **Last Synced from Figma:** `2026-04-13` · **Last Updated:** `2026-04-13 13:48 CST`
<!-- csg:meta-end -->

The single source of truth for **SenseCraft AI** — bridging what designers build in Figma with what developers ship in code.

`DESIGN.md` is a portable, AI-readable spec that defines every color, font, spacing value, and component. Drop it into any project and your AI coding tool (Claude Code, Cursor, or Codex) instantly knows how to build pixel-perfect SenseCraft UI.

**[Browse the live design system](https://rida2000.github.io/csg-design-system/)** -- color swatches, type specimens, component demos — auto-generated from `DESIGN.md`.

---

## Get Started

Run this in your project root:

```bash
curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh | bash
```

It asks which tool you use and installs the right files:

| You pick | What gets installed |
|----------|-------------------|
| **Claude Code** | `DESIGN.md` + 8 agents in `~/.claude/agents/` |
| **Cursor** | `DESIGN.md` + `.cursorrules` + `.cursor/rules/*.mdc` |
| **Codex** | `DESIGN.md` + `AGENTS.md` |
| **All** | Everything above |

Downloaded files are automatically added to your `.gitignore` — they're fetched from the source repo, not authored in your project.

### Update to the latest version

Run the same command again. All files are overwritten with the latest version.

---

## For Designers

### Browse the spec visually

**[rida2000.github.io/csg-design-system](https://rida2000.github.io/csg-design-system/)** renders the full design system with:

- Live color swatches for all 57 tokens (primary, secondary, neutral, semantic)
- Typography specimens using the actual fonts (Space Grotesk, Noto Sans SC, Space Mono)
- Interactive component demos (buttons, inputs, toggles, cards, badges, modals)

The page rebuilds automatically whenever `DESIGN.md` is updated — no manual deploy needed.

### Update the spec

Edit `DESIGN.md` directly — it's plain Markdown tables, easy to read and review in PRs. Or use the **Maintenance** agent in your AI tool to add tokens and components without breaking the format.

### Sync from Figma

When the Figma file changes, use the **Figma Sync** agent to pull the latest tokens and component specs into `DESIGN.md` automatically. See [Figma Sync](#figma-sync) below.

---

## For Developers

### What's inside DESIGN.md

| Section | What it covers |
|---------|---------------|
| **Colors** | 57 tokens — primary (lime green `#8FC31F`), secondary (deep teal `#003A4A`), neutral, semantic, border |
| **Typography** | Space Grotesk (UI), Noto Sans SC (Chinese), Space Mono (code) — full type scale with letter-spacing |
| **Components** | 15 types from Figma: buttons, inputs, dropdowns, cards, badges, modals, nav, toggles, radio, checkbox, code blocks |
| **Layout** | 4px base spacing, border radius scale, 4 responsive breakpoints |
| **Elevation** | When to use borders vs shadows, exact Figma shadow values |
| **Do's & Don'ts** | Guard rails so the AI never strays from the design language |
| **Agent Prompts** | Ready-to-use prompts for common components |

### How the AI uses it

When `DESIGN.md` is in your project root, your AI tool automatically:
- Uses CSS custom properties (`var(--primary-500)`) instead of hardcoded hex
- Uses MingCute icons exclusively via `@iconify/react`
- Matches pixel-exact component dimensions from the Figma spec
- Applies correct fonts (Space Mono for code/IDs, Space Grotesk for UI)
- Implements all states: default, hover, pressed, disabled, error

---

## AI Agents

Seven agents ship with the design system. All are token-first — they read `DESIGN.md` and use CSS variables and Mobile token names instead of hardcoded values.

### Design System Agents

| Agent | What it does | Example prompt |
|-------|-------------|----------------|
| **csg-component-builder** | Generates `.tsx` + `.module.css` pairs matching the exact Figma spec. CSS custom properties only, MingCute icons, all states. | *"Build a Primary button in all three sizes"* |
| **csg-design-reviewer** | Audits code against the spec. Returns a PASS / WARN / FAIL report for colors, icons, fonts, radius, shadows, disabled states. | *"Review Button.tsx for design compliance"* |
| **csg-maintenance** | Safely edits `DESIGN.md` — adds tokens, adds component sections, never breaks the table format. | *"Add a Date Picker component as section 4.16"* |
| **csg-figma-sync** | Pulls latest tokens and component specs from the Figma file into `DESIGN.md`. Generates CSS + Mobile token names, flags breaking changes. | *"Sync DESIGN.md with the latest Figma file"* |
| **csg-frontend-developer** | Full frontend development across React, Vue, Angular, and React Native. Token-first: reads DESIGN.md and uses `var(--token)` / mobile `camelCase` tokens. | *"Build the model cards grid page with filtering"* |
| **csg-ui-designer** | Visual interface design, interaction patterns, accessibility. Specifies all designs using existing tokens; flags when new tokens are needed. | *"Design an empty state illustration for the model library"* |
| **design-bridge** | Translates `DESIGN.md` into polished build instructions for any UI framework. Bridges the gap between design spec and implementation. | *"Translate DESIGN.md into Tailwind setup instructions"* |

### Figma Sync Details

**With Figma MCP** (Claude Code / Cursor) — reads directly from Figma, no API token needed:

```
"Sync DESIGN.md with the latest Figma file"
"Check if any colors changed in Figma since the last update"
```

**Without MCP** — uses the Figma REST API script:

```bash
FIGMA_TOKEN=<your-token> npm run figma:update
```

Generates `FIGMA_SYNC_REPORT.md` with everything extracted from Figma + a diff against current `DESIGN.md`.

<details>
<summary>Set up Figma MCP in Claude Code</summary>

Run `/mcp` in Claude Code, select `figma`, authenticate. Or add manually:

```json
{ "mcpServers": { "figma": { "url": "https://mcp.figma.com/mcp" } } }
```

</details>

<details>
<summary>Get a Figma API token (for the script method)</summary>

1. Go to [figma.com/developers/api#access-tokens](https://www.figma.com/developers/api#access-tokens)
2. Create a personal access token with **File content** read access
3. `export FIGMA_TOKEN=fig_...`

</details>

---

## Manual Setup by Tool

<details>
<summary><strong>Claude Code</strong></summary>

```bash
# One command installs DESIGN.md + all 7 Claude Code agents
CHOICE=1 curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh | bash
```

Restart Claude Code. Type `/agents` to see them.

</details>

<details>
<summary><strong>Cursor</strong></summary>

```bash
REPO="Rida2000/csg-design-system"

# Download DESIGN.md + .cursorrules
for f in DESIGN.md .cursorrules; do
  gh api "repos/$REPO/contents/$f?ref=main" --jq '.content' | base64 -d > "$f"
done

# Download modular rules
mkdir -p .cursor/rules
for rule in csg-component-builder csg-design-reviewer csg-maintenance csg-figma-sync; do
  gh api "repos/$REPO/contents/cursor/${rule}.mdc?ref=main" --jq '.content' | base64 -d > ".cursor/rules/${rule}.mdc"
done
```

Restart Cursor. `.cursorrules` loads automatically. Modular rules activate on matching files:

| Rule | Activates on |
|------|-------------|
| Component Builder | `src/components/**/*.tsx` |
| Design Reviewer | `src/**/*.tsx`, `src/**/*.css` |
| Maintenance | `DESIGN.md` |
| Figma Sync | `DESIGN.md`, `FIGMA_SYNC_REPORT.md` |

</details>

<details>
<summary><strong>Codex (OpenAI)</strong></summary>

```bash
REPO="Rida2000/csg-design-system"
for f in DESIGN.md AGENTS.md; do
  gh api "repos/$REPO/contents/$f?ref=main" --jq '.content' | base64 -d > "$f"
done
```

Codex reads `AGENTS.md` automatically from the project root.

</details>

---

## Contributing

### Project structure

```
DESIGN.md                        Single source of truth (edit this)
.cursorrules                     Cursor project-level rules
AGENTS.md                        Codex agent instructions
scripts/
  build.js                       DESIGN.md -> docs/index.html
  figma-sync.js                  Figma REST API extractor
  install.sh                     Multi-tool installer
  install-agents.sh              Claude Code agent installer
agents/                          Claude Code agents
  csg-component-builder.md       Design system component generator
  csg-design-reviewer.md         Design compliance auditor
  csg-maintenance.md             DESIGN.md editor
  csg-figma-sync.md              Figma -> DESIGN.md sync
  design-bridge.md               DESIGN.md -> build instructions (VoltAgent)
  csg-frontend-developer.md      Multi-framework frontend dev, token-first
  csg-ui-designer.md             Visual design + accessibility, token-first
cursor/                          Cursor modular rules (.mdc)
  csg-component-builder.mdc
  csg-design-reviewer.mdc
  csg-maintenance.mdc
  csg-figma-sync.mdc
docs/                            Auto-generated website (do not edit)
  index.html
```

### Build the website locally

```bash
npm install
npm run build        # DESIGN.md -> docs/index.html
npm run preview      # serve on localhost
```

### How everything connects

```
Figma (source of truth for design)
  |
  +--> figma-sync agent ------> DESIGN.md (source of truth for code)
                                    |
                                    +--> docs/index.html    (auto-generated website)
                                    +--> .cursorrules       (references DESIGN.md)
                                    +--> AGENTS.md          (references DESIGN.md)
                                    +--> agents/*.md        (reference DESIGN.md)
```

GitHub Actions auto-rebuilds `docs/` on every push to `main` that touches `DESIGN.md`.
