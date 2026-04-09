# CSG Design System — Claude Code Agents

Three agents for maintaining and using the CSG Design System in Claude Code.

## Install

**Option A — from this cloned repo:**
```bash
npm run install-agents
```

**Option B — directly, no clone needed:**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install-agents.sh)
```

Restart Claude Code after installing. Agents appear in `/agents`.

---

## Agents

### `csg-maintenance`
**Use when:** Adding new tokens, updating component specs, or extending DESIGN.md.

Knows the exact table format, token naming conventions (`--primary-N`), and section structure. Never deletes existing tokens. Always shows a diff before editing.

**Example prompts:**
- "Add a new `--primary-475` token between 450 and 500"
- "Add a new component section 4.16 for a Date Picker"
- "Update the Toggle Switch spec — the OFF state track color changed to `#595959`"

---

### `csg-component-builder`
**Use when:** Building a React component that must match the design system.

Reads `DESIGN.md` for exact pixel specs. Outputs `.tsx` + `.module.css` pairs. Uses `@iconify/react` with `mingcute:` prefix. Always uses CSS custom properties — never hardcodes hex values.

**Example prompts:**
- "Build a Primary text button in all three sizes with hover/pressed/disabled states"
- "Build a Model Card component matching section 4.8"
- "Build a status Badge component with Running, Warning, Error, Inactive, and Info variants"
- "Build the Confirm Pop-up (Use Case 1) from section 4.15"

---

### `csg-design-reviewer`
**Use when:** Reviewing a PR or implementation before merge.

Checks: hardcoded colors, wrong icon libraries, wrong fonts, off-spec border radii, shadows on cards, missing disabled states. Returns a structured PASS/WARN/FAIL report.

**Example prompts:**
- "Review `src/components/Button/Button.tsx` and `Button.module.css`"
- "Check this component for design system compliance"
- "Audit the nav bar implementation against the design spec"

---

## Update Agents

To get the latest agent definitions:
```bash
# If you cloned the repo:
git pull && npm run install-agents

# Or re-run the direct install:
bash <(curl -fsSL https://raw.githubusercontent.com/Rida2000/csg-design-system/main/scripts/install-agents.sh)
```
