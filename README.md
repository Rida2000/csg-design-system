# CSG Design System

**SenseCraft AI** design system — the single source of truth bridging Figma design and development.

- **DESIGN.md** — the spec (colors, typography, 15 component types)
- **Website** — [visual preview](https://rida2000.github.io/csg-design-system/) of the design system
- **Multi-tool** — works with Claude Code, Cursor, and Codex out of the box

---

## Quick Start — One Command

Run this in your project root. It installs `DESIGN.md` + the right config for your AI tool:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)
```

It will ask which tool you use (Claude Code / Cursor / Codex / all) and install accordingly.

---

## Manual Setup by Tool

### Get DESIGN.md (all tools)

```bash
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md
```

Update anytime with the same command.

---

### Claude Code

Installs 3 agents to `~/.claude/agents/`:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install-agents.sh)
```

Restart Claude Code, then type `/agents` to see them.

| Agent | What it does |
|-------|-------------|
| `csg-maintenance` | Updates tokens, adds components to `DESIGN.md` |
| `csg-component-builder` | Generates React + CSS Module components from spec |
| `csg-design-reviewer` | Audits code against the design system (PASS/WARN/FAIL) |

---

### Cursor

Installs `.cursorrules` + modular rules to `.cursor/rules/`:

```bash
# .cursorrules (project-level design system context)
curl -o .cursorrules https://raw.githubusercontent.com/Rida2000/csg-design-system/main/.cursorrules

# Modular rules (activate per-task in Cursor Settings > Rules)
mkdir -p .cursor/rules
curl -o .cursor/rules/csg-component-builder.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/csg-component-builder.mdc
curl -o .cursor/rules/csg-design-reviewer.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/csg-design-reviewer.mdc
curl -o .cursor/rules/csg-maintenance.mdc https://raw.githubusercontent.com/Rida2000/csg-design-system/main/cursor/csg-maintenance.mdc
```

Restart Cursor to activate. The `.cursorrules` loads automatically; modular rules activate based on file globs or manually in Settings > Rules.

| Rule | Activates on | What it does |
|------|-------------|-------------|
| `csg-component-builder` | `src/components/**/*.tsx` | Generates components from design spec |
| `csg-design-reviewer` | `src/**/*.tsx`, `src/**/*.css` | Design compliance audit |
| `csg-maintenance` | `DESIGN.md` | Safe editing of the design spec |

---

### Codex (OpenAI)

Installs `AGENTS.md` to your project root — Codex reads it automatically:

```bash
curl -o AGENTS.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/AGENTS.md
```

`AGENTS.md` contains the full design system reference + all three agent behaviors (component builder, design reviewer, maintainer). Codex picks up the context automatically when working in the repo.

---

## Update Everything

Re-run the same install command to update all files to the latest version:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)
```

Or add an npm alias to your project:

```json
{
  "scripts": {
    "design:update": "bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install.sh)"
  }
}
```

---

## For Designers — View the Design System Website

Open: **[https://rida2000.github.io/csg-design-system/](https://rida2000.github.io/csg-design-system/)**

Auto-updates whenever `DESIGN.md` changes. Shows:
- Color palettes with live swatches
- Typography specimens using actual fonts
- Component specifications with visual demos

---

## For This Repo — Development

### Rebuild the Website Locally

```bash
npm install
npm run build
npm run preview   # opens docs/index.html in a local server
```

### Project Structure

```
├── DESIGN.md                    # Single source of truth
├── .cursorrules                 # Cursor project-level rules
├── AGENTS.md                    # Codex agent instructions
├── scripts/
│   ├── build.js                 # Parses DESIGN.md → docs/index.html
│   ├── install.sh               # Multi-tool installer (Claude/Cursor/Codex)
│   └── install-agents.sh        # Claude Code agent installer
├── agents/                      # Claude Code agents
│   ├── csg-maintenance.md
│   ├── csg-component-builder.md
│   └── csg-design-reviewer.md
├── cursor/                      # Cursor modular rules
│   ├── csg-component-builder.mdc
│   ├── csg-design-reviewer.mdc
│   └── csg-maintenance.mdc
└── docs/                        # Auto-generated — do not edit
    └── index.html
```

**Never edit `docs/` by hand.** Edit `DESIGN.md`, then `npm run build`.

GitHub Actions auto-rebuilds `docs/` on every push to `main` that changes `DESIGN.md`.
