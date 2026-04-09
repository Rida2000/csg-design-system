# CSG Design System

**SenseCraft AI** design system — the single source of truth bridging Figma design and development.

- **DESIGN.md** — the spec (colors, typography, 15 component types)
- **Website** — [csg-design-system.github.io](https://rida2000.github.io/csg-design-system/) — visual preview of the design system
- **Agents** — Claude Code agents for maintenance, component generation, and design review

---

## For Developers — Add DESIGN.md to Your Project

Run this once in your project root to get the design spec:

```bash
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md
```

### Update to the Latest Version

Run this any time the design system has been updated:

```bash
curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md
```

### Optional — npm Script Alias

Add this to your project's `package.json` so teammates can run `npm run design:update`:

```json
{
  "scripts": {
    "design:update": "curl -o DESIGN.md https://raw.githubusercontent.com/Rida2000/csg-design-system/main/DESIGN.md"
  }
}
```

---

## For Designers — View the Design System Website

Open: **[https://rida2000.github.io/csg-design-system/](https://rida2000.github.io/csg-design-system/)**

The site auto-updates whenever `DESIGN.md` changes. It shows:
- Color palettes with live swatches
- Typography specimens using actual fonts
- Component specifications with visual demos

---

## For Maintainers — Install Claude Code Agents

The `agents/` folder contains Claude Code agents for maintaining and using the design system.

### Install All Agents

**Option A — from this cloned repo:**
```bash
npm run install-agents
```

**Option B — directly (no clone needed):**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install-agents.sh)
```

After installing, restart Claude Code. The agents appear when you type `/agents` in Claude Code.

### Available Agents

| Agent | What it does |
|-------|-------------|
| `csg-maintenance` | Updates design tokens, adds new components to `DESIGN.md` following the exact table format |
| `csg-component-builder` | Generates React + CSS Module components from the design spec |
| `csg-design-reviewer` | Audits code/designs against the design system — returns PASS/WARN/FAIL report |

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
├── DESIGN.md                    # ← Edit this. Single source of truth.
├── scripts/
│   ├── build.js                 # Parses DESIGN.md → docs/index.html
│   └── install-agents.sh        # Copies agents/ → ~/.claude/agents/
├── agents/
│   ├── csg-maintenance.md
│   ├── csg-component-builder.md
│   └── csg-design-reviewer.md
└── docs/                        # Auto-generated — do not edit
    └── index.html
```

**Never edit `docs/` by hand.** Always edit `DESIGN.md`, then run `npm run build`.

The GitHub Actions workflow auto-rebuilds `docs/` on every push to `main` that changes `DESIGN.md`.

---

## Versioning

The `package.json` version tracks the design system version. Bump it when making breaking changes to the design spec. Tag releases as `v1.0.0`, `v1.1.0`, etc.
