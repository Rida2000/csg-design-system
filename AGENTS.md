# CSG Design System — SenseCraft AI

This project follows the **CSG Design System**. The full visual specification is in `DESIGN.md` at the project root. Always read it before generating or reviewing UI code.

---

## Design System Quick Reference

### Colors (always use CSS custom properties)
| Purpose | Token | Value |
|---------|-------|-------|
| Primary CTA / active | `--primary-500` | `#8FC31F` |
| Primary hover | `--primary-400` | `#A8E03C` |
| Primary pressed | `--primary-600` | `#76A219` |
| Dark text / teal accent | `--secondary-500` | `#003A4A` |
| Page / card surface | `--white` | `#FFFFFF` |
| Recessed chrome (inputs, nav, modal bars) | `--neutral-50` | `#FAFAFA` |
| Default border | `--border` | `#E5E5E5` |
| Input / modal border | `--border-regular` | `#D9D9D9` |
| Active / focus border | `--border-primary` | `#8FC31F` |
| Body text | `--neutral-700` | `#404040` |
| Heading text | `--neutral-900` | `#171717` |
| Placeholder / disabled | `--neutral-400` | `#A3A3A3` |
| Error | `--error` | `#DC2626` |
| Warning | `--warning` | `#FF9500` |

### Typography
- EN UI: `'Space Grotesk', ui-sans-serif, system-ui`
- Chinese: `'Noto Sans SC', sans-serif`
- Code / model IDs / metrics: `'Space Mono', ui-monospace, monospace`
- Negative letter-spacing at heading sizes: `-0.01rem` at 22px, `-0.02rem` at 36px, `-0.03rem` at 48px

### Icons — MingCute exclusively
```tsx
import { Icon } from '@iconify/react'
<Icon icon="mingcute:close-line" width={18} height={18} />
```
- Always use `*-line` (outline) variants by default
- Only `*-fill` when semantically required (destructive dialogs, selected states)
- Never use Heroicons, Lucide, Phosphor, or any other icon set

### Border Radius (only these values)
`0` | `4px` | `8px` | `12px` | `16px` | `24px` | `9999px`

### Elevation
- Cards/panels: `1px solid #E5E5E5` border only — no box-shadow
- Modals/dropdowns only: `0px 10px 24px -6px rgba(0,0,0,0.15)`

### Component Dimensions
- Text button: Small=28px, Default=36px, Large=42px height
- Text input: 42px height, `#FAFAFA` bg, 8px radius
- Pop-up: 422px wide, 12px radius
- Badge: pill 9999px, 4px 10px padding, 12px font

### Disabled State (all interactive)
`opacity: 0.4; cursor: not-allowed;` — no hover/pressed response

---

## Agents

### Component Builder
**When:** Building any UI component (buttons, inputs, cards, modals, badges, navigation)

Generate React + CSS Module components matching the design spec:
- Output `.tsx` + `.module.css` pairs with TypeScript interfaces
- Use CSS custom properties (`var(--token)`) — never hardcode hex
- Use `@iconify/react` with `mingcute:` prefix for all icons
- Match exact pixel dimensions from `DESIGN.md` component tables
- Implement all states: default, hover, pressed, disabled, error
- Use named exports

### Design Reviewer
**When:** Reviewing UI code or PRs before merge

Audit code and return a structured report:

```
## CSG Design Review: [files]
### PASS — [rules that passed]
### WARN — [minor issues + fix]
### FAIL — [broken rules + correct value]
### Summary: COMPLIANT / NEEDS FIXES / NON-COMPLIANT
```

Check for:
- Hardcoded hex values (should be CSS custom properties)
- Wrong icon libraries (must be MingCute only)
- Wrong font assignments (Space Mono for code, Space Grotesk for UI)
- Off-spec border radius (must be 0/4/8/12/16/24/9999)
- Shadows on cards/panels (should be borders only)
- Missing disabled states (opacity 0.4, cursor not-allowed)
- Dimension mismatches vs spec (WARN >2px, FAIL >8px)

### Design System Maintainer
**When:** Editing or extending `DESIGN.md`

Rules for editing the design spec:
- Never delete existing tokens or sections
- Never rename existing tokens
- Color tables must use: `| Token | Mobile | Value | Role |` format
- Token names follow convention: `--primary-N`, `--secondary-N`, `--neutral-N`
- New components get subsection 4.16+ with EN + CN title, Sizes table, Types & States table
- Always read current DESIGN.md first, show diff before editing

### Figma Sync
**When:** The Figma file has been updated and `DESIGN.md` needs to catch up

Figma file: `https://www.figma.com/design/QMSCzUBQ5hrq9Z3DNifY6Q/CSG-Design-System?m=dev` (key: `QMSCzUBQ5hrq9Z3DNifY6Q`)

**With Figma MCP connected:**
1. Use `get_variable_defs` with the file URL to extract all design tokens
2. Use `get_design_context` per page/frame to extract component specs
3. Use `use_figma` to inspect the full document tree

**Without MCP:**
```bash
FIGMA_TOKEN=<token> node scripts/figma-sync.js --update
```
Generates `FIGMA_SYNC_REPORT.md` with all extracted data and a diff against DESIGN.md.

Tokenization — every token has two names:
- **CSS**: `--kebab-case` (e.g. `--primary-500`, `--border-regular`)
- **Mobile**: `lowerCamelCase` (e.g. `primary500`, `borderRegular`)

Derive from the Figma variable name. Figma uses slash-separated groups:
- `Primary/500` → `--primary-500` / `primary500`
- `Border/Regular` → `--border-regular` / `borderRegular`
- `Radius/LG` → `--radius-lg` / `radiusLg`

**Exception**: font weights are NOT tokenized. Use raw numeric values (`300`–`800`).

Rules:
- Show a diff summary before editing DESIGN.md, highlight breaking changes separately
- **New variables**: generate both CSS + Mobile names, add row to correct table with `| Token | Mobile | Value | Role |`
- **Value changes**: update Value column only (non-breaking)
- **Renames/restructures**: flag as breaking change, show old → new names, confirm with user before applying
- **Deletions in Figma**: mark `(deprecated)` in Role column, never remove rows
- Preserve exact table format: `| Token | Mobile | Value | Role |`
- Use exact hex values from Figma
- After editing, run `npm run build` to regenerate the website

---

## Don'ts
- Don't hardcode hex — use `var(--token-name)`
- Don't use `#8FC31F` as a large fill — activation signal only
- Don't use `#003A4A` as surface background — text/accent color only
- Don't use Space Grotesk for code/model names — Space Mono only
- Don't mix CN and EN fonts in the same text element
- Don't add shadows to cards/panels — borders carry containment
- Don't use font-weight 800 for body text — hero numbers only
