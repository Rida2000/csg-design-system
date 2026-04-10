# CSG Design System

The single source of truth for **SenseCraft AI** — bridging what designers create in Figma with what developers build in code.

`DESIGN.md` is the spec. It defines every color, font, spacing value, and component in one portable file that lives in your project root and powers your AI coding tool.

**[View the visual design system](https://rida2000.github.io/csg-design-system/)**

---

## What's inside DESIGN.md

| Section | What it covers |
|---------|---------------|
| Colors | 57 tokens across primary (lime green), secondary (deep teal), neutral, and semantic palettes |
| Typography | Space Grotesk for UI, Noto Sans SC for Chinese, Space Mono for code — with a full type scale |
| Components | 15 component types with pixel-exact specs from Figma: buttons, inputs, dropdowns, cards, badges, modals, nav, toggles, and more |
| Layout | 4px spacing system, border radius scale, responsive breakpoints (mobile to large desktop) |
| Elevation | Shadow philosophy — when to use borders vs. shadows, with exact Figma shadow values |
| Do's & Don'ts | Guard rails so the AI never strays from the design language |

---

## For Designers

### Browse the live spec

Open **[rida2000.github.io/csg-design-system](https://rida2000.github.io/csg-design-system/)** to see the design system rendered with actual color swatches, live typography specimens, and interactive component demos. This page auto-updates whenever `DESIGN.md` changes — no manual deploys needed.

### How to update the spec

Edit `DESIGN.md` directly (or ask a developer to). The format is plain Markdown tables — easy to read, easy to diff in pull requests. When merged to `main`, the website rebuilds automatically.

If you use Claude Code, Cursor, or Codex, the **Maintenance** agent can help you add tokens or components safely without breaking the table format.

---

## For Developers

### 1. Add the design system to your project

One command installs `DESIGN.md` + the right config for your AI coding tool:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)
```

It asks which tool you use and sets up everything:

| You pick | What gets installed |
|----------|-------------------|
| **Claude Code** | `DESIGN.md` + 3 agents in `~/.claude/agents/` |
| **Cursor** | `DESIGN.md` + `.cursorrules` + `.cursor/rules/*.mdc` |
| **Codex** | `DESIGN.md` + `AGENTS.md` in project root |
| **All** | Everything above |

### 2. Update to the latest version

Run the same command again. Or add a shortcut to your `package.json`:

```json
{
  "scripts": {
    "design:update": "bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)"
  }
}
```

Then teammates just run `npm run design:update`.

---

## What the AI Agents Do

Three specialized behaviors ship with the design system. They work the same way across Claude Code, Cursor, and Codex — just adapted to each tool's format.

### Component Builder

Tell your AI tool to build a component, and it will follow the exact Figma spec:
- Outputs `.tsx` + `.module.css` pairs
- Uses CSS custom properties (`var(--primary-500)`) — never hardcoded hex
- Icons from MingCute only, via `@iconify/react`
- Matches pixel-exact dimensions from the component tables
- Implements all states: default, hover, pressed, disabled, error

**Example prompts:**
- *"Build a Primary button in all three sizes"*
- *"Build a Model Card matching section 4.8 of DESIGN.md"*
- *"Build the destructive confirmation pop-up from section 4.15"*

### Design Reviewer

Ask your AI tool to review code, and it checks every rule from the spec:
- Hardcoded hex values (should be CSS custom properties)
- Wrong icon libraries (must be MingCute)
- Wrong fonts (Space Mono for code, Space Grotesk for UI)
- Off-spec border radius, shadows on cards, missing disabled states

Returns a structured **PASS / WARN / FAIL** report.

**Example prompts:**
- *"Review Button.tsx and Button.module.css for design compliance"*
- *"Audit the sidebar component against the design system"*

### Maintenance

Helps safely edit `DESIGN.md` without breaking the structure:
- Adds new color tokens following the naming convention (`--primary-N`)
- Adds new component sections with the correct table format
- Never deletes existing tokens or sections
- Shows a diff before applying changes

**Example prompts:**
- *"Add a Date Picker component as section 4.16"*
- *"Add a --primary-475 token between 450 and 500"*

### Figma Sync

Pulls the latest design tokens, components, and specs from the Figma source file and updates `DESIGN.md` to match. Works two ways:

**With Figma MCP connected** (Claude Code / Cursor) — the agent reads directly from Figma using MCP tools. No token needed.

**Without MCP** — uses the Figma REST API:
```bash
FIGMA_TOKEN=<your-token> npm run figma:update
```

This generates a `FIGMA_SYNC_REPORT.md` showing everything extracted from Figma and a diff against the current DESIGN.md. Review it, then let the agent apply the changes.

**Example prompts:**
- *"Sync DESIGN.md with the latest Figma file"*
- *"Check if any colors changed in Figma since the last update"*
- *"A new component was added in Figma — pull it into DESIGN.md"*

<details>
<summary>Setting up Figma MCP in Claude Code</summary>

Run `/mcp` in Claude Code, select `figma`, authenticate. Or add manually to your settings:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

</details>

<details>
<summary>Getting a Figma API token (for the script method)</summary>

1. Go to [figma.com/developers/api#access-tokens](https://www.figma.com/developers/api#access-tokens)
2. Create a personal access token with **File content** read access
3. Set it as an environment variable: `export FIGMA_TOKEN=fig_...`

</details>

---

## Tool-Specific Setup (Manual)

<details>
<summary><strong>Claude Code</strong> — manual steps</summary>

```bash
# Get the design spec
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md

# Install agents
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install-agents.sh)
```

Restart Claude Code. Type `/agents` to see the three agents.

</details>

<details>
<summary><strong>Cursor</strong> — manual steps</summary>

```bash
# Get the design spec
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md

# Project-level rules (auto-loads when Cursor opens the project)
curl -o .cursorrules https://raw.githubusercontent.com/Rida2000/csg-design-system/main/.cursorrules

# Modular rules (activate on matching file patterns)
mkdir -p .cursor/rules
curl -o .cursor/rules/csg-component-builder.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/csg-component-builder.mdc
curl -o .cursor/rules/csg-design-reviewer.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/csg-design-reviewer.mdc
curl -o .cursor/rules/csg-maintenance.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/csg-maintenance.mdc
```

Restart Cursor. Rules activate automatically based on which files you're editing:

| Rule | Activates on |
|------|-------------|
| Component Builder | `src/components/**/*.tsx` |
| Design Reviewer | `src/**/*.tsx`, `src/**/*.css` |
| Maintenance | `DESIGN.md` |

</details>

<details>
<summary><strong>Codex (OpenAI)</strong> — manual steps</summary>

```bash
# Get the design spec
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md

# Agent instructions (Codex reads this automatically)
curl -o AGENTS.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/AGENTS.md
```

Codex picks up `AGENTS.md` from the project root. It contains the full design reference and all three agent behaviors.

</details>

---

## Contributing to the Design System

### Rebuild the website locally

```bash
npm install
npm run build        # generates docs/index.html from DESIGN.md
npm run preview      # serves docs/ on localhost
```

### How it works

`DESIGN.md` is the only file you edit. Everything else is derived from it:

```
DESIGN.md                        you edit this
  +--> docs/index.html           auto-generated website (npm run build)
  +--> .cursorrules              references DESIGN.md
  +--> AGENTS.md                 references DESIGN.md
  +--> agents/*.md               reference DESIGN.md
```

GitHub Actions auto-rebuilds `docs/` on every push to `main` that touches `DESIGN.md`.

### Project structure

```
DESIGN.md                        Single source of truth
.cursorrules                     Cursor project rules
AGENTS.md                        Codex agent instructions
scripts/
  build.js                       DESIGN.md -> docs/index.html
  install.sh                     Multi-tool installer
  install-agents.sh              Claude Code agent installer
agents/                          Claude Code agents
  csg-maintenance.md
  csg-component-builder.md
  csg-design-reviewer.md
cursor/                          Cursor modular rules
  csg-component-builder.mdc
  csg-design-reviewer.mdc
  csg-maintenance.mdc
docs/                            Auto-generated (do not edit)
  index.html
```
