# CSG Design System

The single source of truth for **SenseCraft AI** — bridging what designers build in Figma with what developers ship in code.

`DESIGN.md` is a portable, AI-readable spec that defines every color, font, spacing value, and component. Drop it into any project and your AI coding tool (Claude Code, Cursor, or Codex) instantly knows how to build pixel-perfect SenseCraft UI.

**[Browse the live design system](https://rida2000.github.io/csg-design-system/)** -- color swatches, type specimens, component demos — auto-generated from `DESIGN.md`.

---

## Get Started

Run this in your project root:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)
```

It asks which tool you use and installs the right files:

| You pick | What gets installed |
|----------|-------------------|
| **Claude Code** | `DESIGN.md` + 7 agents in `~/.claude/agents/` |
| **Cursor** | `DESIGN.md` + `.cursorrules` + `.cursor/rules/*.mdc` |
| **Codex** | `DESIGN.md` + `AGENTS.md` |
| **All** | Everything above |

To update later, run the same command again — or add `npm run design:update` to your project:

```json
{ "scripts": { "design:update": "bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)" } }
```

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

Seven agents ship with the design system. The first four are CSG-specific (design system rules baked in). The last three are general-purpose agents from [VoltAgent](https://github.com/VoltAgent/awesome-claude-code-subagents) that pair well with any design system workflow.

### Design System Agents

| Agent | What it does | Example prompt |
|-------|-------------|----------------|
| **Component Builder** | Generates `.tsx` + `.module.css` pairs matching the exact Figma spec. CSS custom properties only, MingCute icons, all states. | *"Build a Primary button in all three sizes"* |
| **Design Reviewer** | Audits code against the spec. Returns a PASS / WARN / FAIL report for colors, icons, fonts, radius, shadows, disabled states. | *"Review Button.tsx for design compliance"* |
| **Maintenance** | Safely edits `DESIGN.md` — adds tokens, adds component sections, never breaks the table format. | *"Add a Date Picker component as section 4.16"* |
| **Figma Sync** | Pulls latest tokens and component specs from the Figma file into `DESIGN.md`. Works via MCP or REST API. | *"Sync DESIGN.md with the latest Figma file"* |

### General-Purpose Agents (from VoltAgent)

| Agent | What it does | Example prompt |
|-------|-------------|----------------|
| **Design Bridge** | Translates `DESIGN.md` into polished build instructions for any UI framework. Bridges the gap between design spec and implementation. | *"Translate DESIGN.md into Tailwind setup instructions"* |
| **Frontend Developer** | Full frontend development across React, Vue, and Angular. Multi-framework expertise with full-stack integration. | *"Build the model cards grid page with filtering"* |
| **UI Designer** | Visual interface design, component libraries, interaction patterns, and accessibility. Expert at refining aesthetics. | *"Design an empty state illustration for the model library"* |

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
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install-agents.sh)
```

Restart Claude Code. Type `/agents` to see them.

</details>

<details>
<summary><strong>Cursor</strong></summary>

```bash
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md
curl -o .cursorrules https://raw.githubusercontent.com/Rida2000/csg-design-system/main/.cursorrules
mkdir -p .cursor/rules
for rule in csg-component-builder csg-design-reviewer csg-maintenance csg-figma-sync; do
  curl -o .cursor/rules/${rule}.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/${rule}.mdc
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
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md
curl -o AGENTS.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/AGENTS.md
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
  frontend-developer.md          Multi-framework frontend dev (VoltAgent)
  ui-designer.md                 Visual design + accessibility (VoltAgent)
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
