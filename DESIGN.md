# Design System — SenseCraft AI

## 1. Visual Theme & Atmosphere

> **This design system defines the light mode theme only.** Dark mode is not currently in scope.

SenseCraft AI presents a clean, precise aesthetic on a light neutral foundation. The interface sits on white (`#FFFFFF`) and near-white (`#FAFAFA`) surfaces that keep content legible and professional without clinical coldness. The deep teal secondary palette (`#003A4A`) provides typographic weight and structural accents, while the lime-green primary (`#8FC31F`) acts as the activation signal — used selectively for CTAs, active states, and status indicators.

The primary font is **Space Grotesk**, a geometric sans-serif with a technical edge and subtle character. **Noto Sans SC** serves all Chinese-language content at identical scale and weight. **Space Mono** handles all code, terminal output, and model identifiers.

Surface hierarchy is built with neutral grays: `#FFFFFF` for cards and containers, `#FAFAFA` for recessed chrome (nav bars, input backgrounds, modal headers/footers), with `#E5E5E5`–`#D9D9D9` borders to separate them. Shadows are reserved exclusively for floating layers (dropdowns, modals).

**Key Characteristics:**
- **Light mode only** — page background `#FFFFFF`, recessed chrome `#FAFAFA`
- Lime-green primary (`#8FC31F`) as the activation color — CTAs, active states, status
- Deep teal secondary (`#003A4A`) for headings, structural accents, dark text elements
- Space Grotesk for EN, Noto Sans SC for CN, Space Mono for code/terminal
- Neutral gray scale (`#FAFAFA`–`#171717`) for surface and text hierarchy
- Border-defined surfaces — `#E5E5E5`/`#D9D9D9` borders carry containment; shadows only for floating UI
- Border radius system from `4px` (tight chrome) to `9999px` (tags/pills)
- Semantic color set: green success, amber warning, red error, teal info
- **All icons use the [MingCute icon pack](https://www.mingcute.com/)** — no other icon library

---

## 2. Color Palette & Roles

### Primary (Lime Green — Action & Status)
| Token | Value | Role |
|-------|-------|------|
| `--primary-50` | `#F5FCE8` | Tint backgrounds, success fill |
| `--primary-100` | `#E8F8C8` | Hover backgrounds on light surfaces |
| `--primary-200` | `#D4F394` | Active/pressed tints |
| `--primary-300` | `#BDED60` | Progress bars, subtle accents |
| `--primary-400` | `#A8E03C` | Hover state for primary elements |
| `--primary-450` | `#A3D830` | Mid-hover |
| `--primary-500` | `#8FC31F` | **Primary CTA, interactive accent** |
| `--primary-600` | `#76A219` | Active/pressed primary |
| `--primary-700` | `#5D8113` | Dark text on light primary bg |
| `--primary-800` | `#44600D` | Deep emphasis |
| `--primary-900` | `#2B3F08` | Near-black green, high-contrast text |

### Secondary (Deep Teal — Accents & Dark Text)
| Token | Value | Role |
|-------|-------|------|
| `--secondary-50` | `#E6F1F3` | Tinted chip/tag backgrounds |
| `--secondary-100` | `#CCE3E7` | Hover tint on teal-accented elements |
| `--secondary-200` | `#99C7CF` | Inactive chip text, muted teal accents |
| `--secondary-300` | `#66ABB7` | Decorative borders, secondary icons |
| `--secondary-400` | `#338F9F` | Secondary interactive elements, info state |
| `--secondary-450` | `#045E77` | Mid-tier teal accent |
| `--secondary-500` | `#003A4A` | **Primary dark text, section headings** |
| `--secondary-600` | `#002E3B` | Pressed/active dark text |
| `--secondary-700` | `#00232C` | Deep accent text |
| `--secondary-800` | `#00171E` | Near-black teal, maximum contrast text |
| `--secondary-900` | `#000C0F` | Absolute darkest — use sparingly |

### Neutral (Pure Gray — Surfaces & Text)
| Token | Value | Role |
|-------|-------|------|
| `--neutral-50` | `#FAFAFA` | Recessed chrome: nav bars, input bg, modal header/footer |
| `--neutral-100` | `#F5F5F5` | Subtle hover tint on white surfaces |
| `--neutral-200` | `#E5E5E5` | Default border, card dividers |
| `--neutral-300` | `#D4D4D4` | Medium borders, disabled button bg |
| `--neutral-400` | `#A3A3A3` | Placeholder text, disabled text |
| `--neutral-500` | `#737373` | Secondary / meta text |
| `--neutral-600` | `#525252` | Caption text, labels |
| `--neutral-700` | `#404040` | Body text |
| `--neutral-800` | `#262626` | Strong body text |
| `--neutral-900` | `#171717` | Primary heading text |
| `--white` | `#FFFFFF` | Page background, card surfaces |
| `--black` | `#000000` | Pure black — avoid in UI, use `#171717` instead |

### Semantic Colors
| Token | Value | Role |
|-------|-------|------|
| `--success` | `#8FC31F` | Matches primary-500 — model loaded, inference OK |
| `--success-light` | `#A8E03C` | Success hover |
| `--success-dark` | `#76A219` | Success active/pressed |
| `--warning` | `#FF9500` | Throttling, resource alerts |
| `--warning-light` | `#FFB340` | Warning hover |
| `--warning-dark` | `#CC7700` | Warning active |
| `--error` | `#DC2626` | Error state, failed inference |
| `--error-light` | `#EF4444` | Error hover |
| `--error-dark` | `#B91C1C` | Error active |
| `--info` | `#003A4A` | Matches secondary-500 |
| `--info-light` | `#338F9F` | Info hover |
| `--info-dark` | `#002E3B` | Info active |

### Border Colors
| Token | Value | Role |
|-------|-------|------|
| `--border-light` | `#F5F5F5` | Subtle internal dividers |
| `--border` | `#E5E5E5` | Default card/container border |
| `--border-regular` | `#D9D9D9` | Modal/pop-up chrome borders, input borders |
| `--border-medium` | `#D4D4D4` | Moderate emphasis borders |
| `--border-dark` | `#A3A3A3` | Strong interactive borders |
| `--border-primary` | `#8FC31F` | Active/selected/focus state |
| `--border-secondary` | `#003A4A` | Teal-accented borders |
| `--border-success` | `#8FC31F` | Success outlined elements |
| `--border-warning` | `#FF9500` | Warning outlined elements |
| `--border-error` | `#DC2626` | Error outlined elements |

### Semantic Surface Colors
| Token | Value | Role |
|-------|-------|------|
| `--semantic-error-bg-light` | `#FFF1F1` | Error/validation inline alert background (light surface only) |

---

## 3. Typography Rules

### Font Families
| Token | Value | Use |
|-------|-------|-----|
| `--font-family-en` | `'Space Grotesk', ui-sans-serif, system-ui` | All EN UI, headings, body |
| `--font-family-cn` | `'Noto Sans SC', sans-serif` | All CN UI and content |
| `--font-family-code` | `'Space Mono', ui-monospace, monospace` | Code, model IDs, terminal output, slugs |

### Font Weights
| Token | Value | Use |
|-------|-------|-----|
| `--font-weight-light` | `300` | Subtle labels, decorative text |
| `--font-weight-normal` | `400` | Body, captions, UI labels |
| `--font-weight-medium` | `500` | Card titles, nav links |
| `--font-weight-semibold` | `600` | Section headings, strong emphasis |
| `--font-weight-bold` | `700` | Display headings, hero text |
| `--font-weight-extrabold` | `800` | Maximum-impact hero, stat numbers |

### Type Scale
| Token | Size | Letter Spacing | Use |
|-------|------|---------------|-----|
| `--text-xs` | `0.625rem` / `10px` | normal | Micro labels, badges |
| `--text-xs` | `0.75rem` / `12px` | normal | Captions, timestamps |
| `--text-sm` | `0.875rem` / `14px` | normal | Secondary body, card meta |
| `--text-base` | `1rem` / `16px` | normal | Primary body text |
| `--text-lg` | `1.125rem` / `18px` | normal | Lead text, intro paragraphs |
| `--text-xl` | `1.375rem` / `22px` | `-0.01rem` | Card headings, sub-headings |
| `--text-2xl` | `1.875rem` / `30px` | `-0.01rem` | Section headings |
| `--text-3xl` | `2.25rem` / `36px` | `-0.02rem` | Page headings |
| `--text-4xl` | `3rem` / `48px` | `-0.03rem` | Hero headings, stat numbers |

### Type Hierarchy
| Role | Size | Weight | Spacing | Font |
|------|------|--------|---------|------|
| Hero Display | `3rem` | `800` | `-0.03rem` | Space Grotesk |
| Page Heading | `2.25rem` | `700` | `-0.02rem` | Space Grotesk |
| Section Heading | `1.875rem` | `600` | `-0.01rem` | Space Grotesk |
| Card Title | `1.375rem` | `500` | `-0.01rem` | Space Grotesk |
| Body Large | `1.125rem` | `400` | normal | Space Grotesk |
| Body | `1rem` | `400` | normal | Space Grotesk |
| Caption / Meta | `0.75rem` | `400` | normal | Space Grotesk |
| Code / Model ID | `0.875rem` | `400` | normal | Space Mono |
| Badge / Micro | `0.625rem` | `500` | normal | Space Grotesk |

### Principles
- **Space Grotesk at scale**: Apply negative letter-spacing at heading sizes (`-0.01rem` at 22px, scaling to `-0.03rem` at 48px) for tight, confident editorial weight.
- **Space Mono for machine identity**: All model slugs, inference metrics, version strings, and terminal output use Space Mono — it signals precision and separates data from UI.
- **Bilingual parity**: Noto Sans SC mirrors Space Grotesk at identical sizes and weights. Never reduce CN text size to compensate for perceived density.
- **Weight range is wide**: Unlike warm lifestyle brands, SenseCraft AI uses the full range from `300` to `800` — heavier weights signal system output, lighter weights signal ambient info.

---

## 4. Component Stylings

Components are sourced from the CSG Design System (Figma). All sizes are exact from the Figma spec.

---

### 4.1 Text Button (文字按钮)

#### Sizes
| Size | Height | Label size | Use |
|------|--------|-----------|-----|
| Small | `28px` | `14px` | Compact toolbars, inline actions |
| Default | `36px` | `14px` | Standard UI actions |
| Large | `42px` | `14px` | Primary page CTAs |

#### Types & States
All button types share the same size system and support: **Default**, **Hover**, **Pressed**, **Disabled** states, and optional **Icon Left** / **Icon Right** layouts.

| Type | Use Case | Light Surface Style |
|------|----------|---------------------|
| **Primary** | Main CTA — Deploy, Run, Save | `#8FC31F` bg, `#FFFFFF` text; hover `#A8E03C`; pressed `#76A219` |
| **Default** | General action — Edit, View, Filter | `#FAFAFA` bg, `1px solid #D9D9D9` border, `#404040` text; hover border `#A3A3A3` |
| **Highlight** | Contextual emphasis — Upgrade, Featured | Teal accent bg/text; hover `#338F9F` |
| **Sensitive** | Confirmation step — Apply, Confirm | Neutral fill; requires user acknowledgement flow |
| **Destructive** | Delete, Remove, Wipe | `#DC2626` bg, `#FFFFFF` text; hover `#B91C1C`; pressed `#991B1B` |
| **Ghost** | Tertiary / minimal chrome | Transparent, `1px solid #D9D9D9` border; hover border `#A3A3A3` |
| **Link** | Inline text actions | No bg/border; underline on hover; text `#8FC31F` |

#### Disabled State (all types)
- Opacity: `0.4`
- `cursor: not-allowed`
- No hover/pressed response

---

### 4.2 Icon Button (图标按钮)

#### Sizes
| Size | Button | Icon inside | Use |
|------|--------|-------------|-----|
| Small | `28×28px` | `14×14px` | Dense toolbars, row actions |
| Default | `36×36px` | `18×18px` | Standard icon actions |
| Large | `42×42px` | `20×20px` | Primary icon CTAs |

#### Types & States
Supports same states as Text Button (Default / Hover / Pressed / Disabled).

| Type | Style |
|------|-------|
| **Default** | `#FAFAFA` bg, `1px solid #D9D9D9` border, icon `#404040`; hover border `#A3A3A3` |
| **Primary** | `#8FC31F` bg, icon `#FFFFFF`; hover `#A8E03C` |
| **Highlight** | Teal accent bg, icon `#FFFFFF`; hover `#338F9F` |
| **Secondary** | `#F5F5F5` bg, no border, icon `#737373`; hover icon `#404040` |
| **Sensitive** | Neutral fill; requires confirmation |
| **Destructive** | `#DC2626` bg, icon `#FFFFFF`; hover `#B91C1C` |
| **Ghost** | Transparent, no border at rest; `1px solid #D9D9D9` border on hover |

- Radius: `--radius-md` (`8px`) for Default/Large; `--radius-sm` (`4px`) for Small
- Icon color inherits from the type's text/icon token

---

### 4.3 Text Input (文字输入框)

#### Dimensions
- Height: `42px` (all variants)
- Standard width: `270px`; wide: `502px`; narrow: `162px`–`245px`
- Multiline (description): `502×114px`

#### Variants
| Variant | Description |
|---------|-------------|
| **Default** | Plain text input |
| **With Icon** | Left icon for context (search, lock, etc.) |
| **Extendable** | Grows vertically; used for description fields |

#### States
| State | Border | Text |
|-------|--------|------|
| Default | `1px solid #D9D9D9` | `#404040` |
| Placeholder | `1px solid #D9D9D9` | `#A3A3A3` |
| Focus | `1px solid #8FC31F` | `#404040` |
| Error | `1px solid #DC2626` | `#404040` |
| Disabled | `1px solid #E5E5E5` | `#A3A3A3`, opacity `0.5` |

#### Specs
- Background: `#FAFAFA`
- Radius: `--radius-md` (`8px`)
- Padding: `0 12px` (horizontal)
- Label: `14px` Space Grotesk `400`, above input, gap `8px`
- Character counter (e.g. `2/16`): `12px` `#737373`, trailing right
- Gap between stacked inputs: `12px`
- Gap between label and input: `8px`
- Gap between button and input group: `24px`
- Use `Space Mono` for inputs accepting model names, slugs, IDs, or commands

---

### 4.4 Dropdown (下拉菜单)

#### Trigger Box
- Height: `42px`, width: `270px` standard / `480px` wide (e.g. device picker)
- Same visual style as Text Input (Default state)
- Trailing chevron icon; optional leading icon variant

#### States
Same as Text Input: Default / Placeholder / Focus / Error / Disabled

#### Menu Items
- Height per item: `36px`
- Width: `197px` standard

| Item Type | Variants |
|-----------|----------|
| **Default** | Icon=No / Left / Right × Default, Hover, Pressed, Disabled |
| **Primary** | Same — used for selected/active item |
| **Destructive** | Same — used for delete/remove options |
| **Separator** | Height `8px`, full-width horizontal rule |
| **Title** | Height `28px`, section label in muted text |

#### Menu Container
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Radius: `--radius-md` (`8px`)
- Shadow: `--shadow-md` (floating surface)
- Padding: `4px` top/bottom

---

### 4.5 Radio Button (单选框)

- Container row: `344×41px`
- Radio control: `71×17px`
- Label: `14px` Space Grotesk `400`, `8px` gap from control

| State | Appearance |
|-------|-----------|
| Selected, Enabled | Filled circle `#8FC31F` |
| Unselected, Enabled | Empty circle, border `--border-medium` |
| Selected, Disabled | Filled circle, opacity `0.4` |
| Unselected, Disabled | Empty circle, opacity `0.4` |

---

### 4.6 Toggle Switch (开关)

- Container row: `472×50px`
- Toggle control: `103×26px`
- Track: `--radius-full` pill; thumb: circular

| State | Appearance |
|-------|-----------|
| ON, Enabled | Track `#8FC31F`, thumb white |
| OFF, Enabled | Track `#003A4A`, thumb `#737373` |
| ON, Disabled | Track `#76A219`, opacity `0.4` |
| OFF, Disabled | Track `#002E3B`, opacity `0.4` |

---

### 4.7 Checkbox (复选框)

- Container row: `368×44px`
- Checkbox control: `77×20px`
- Label: `14px` Space Grotesk `400`, `8px` gap from box

| State | Appearance |
|-------|-----------|
| Checked, Enabled | Filled box `#8FC31F`, white checkmark |
| Unchecked, Enabled | Empty box, border `--border-medium` |
| Checked, Disabled | Filled box, opacity `0.4` |
| Unchecked, Disabled | Empty box, opacity `0.4` |

---

### 4.8 Cards & Containers

**Standard Card**
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Radius: `12px`
- Inner padding: `24px`
- Hover: border `1px solid #D4D4D4`

**Model Card (Domain-Specific)**
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Radius: `12px`
- Type badge: pill `9999px`, `#003A4A` text, `#E6F1F3` bg, `1px solid #CCE3E7` border
- Title: `1.125rem` Space Grotesk `500`, `#171717`
- Meta (params, file size, format): `0.75rem` Space Mono `400`, `#737373`
- Hover: border `1px solid #8FC31F`
- Featured: border `1px solid #8FC31F`

**Featured Card**
- Radius: `16px`
- Background: `#FFFFFF`
- Border: `1px solid #8FC31F`

---

### 4.9 Badges & Status Indicators

- Shape: pill (`9999px`), padding `4px 10px`, font `12px` Space Grotesk `500`

| Status | Text | Border | Background |
|--------|------|--------|------------|
| Running / Active | `#8FC31F` | `1px solid #8FC31F` | `rgba(143,195,31,0.1)` |
| Warning | `#FF9500` | `1px solid #FF9500` | `rgba(255,149,0,0.1)` |
| Error | `#DC2626` | `1px solid #DC2626` | `rgba(220,38,38,0.1)` |
| Inactive | `#A3A3A3` | `1px solid #404040` | `rgba(163,163,163,0.1)` |
| Info | `#338F9F` | `1px solid #003A4A` | `rgba(51,143,159,0.1)` |

---

### 4.10 Navigation Bar

- Background: `#FFFFFF`
- Border-bottom: `1px solid #E5E5E5`
- Nav links: use **Nav Button** components (see 4.12 below)
- Active link: Primary type Nav Button (`#8FC31F` text, `rgba(143,195,31,0.1)` bg)
- CTA: Primary text button (Large, `42px`), right-aligned
- Mobile: hamburger Nav Icon Button (Default size, `36×36px`); full-screen overlay on `#FFFFFF`

---

### 4.12 Nav Button (导航按钮)

Navigation-specific text buttons used in sidebars, top nav, and breadcrumbs. Shares the same size system as Text Button but with an additional **Center** icon layout and intended for navigation-context interactions.

#### Sizes
| Size | Height | Use |
|------|--------|-----|
| Small | `28px` | Compact sidebar items, sub-nav |
| Default | `36px` | Standard nav items |
| Large | `42px` | Top-level nav, primary nav CTA |

Width in styles matrix: `197px` (standard nav item width)

#### Types, Icon Positions & States

All types support icon positions **Left**, **Right**, and **Center**, and all four states: **Default**, **Hover**, **Pressed**, **Disabled**.

| Type | Use in Navigation | Style Guidance |
|------|-------------------|---------------|
| **Default** | Standard nav item (inactive) | Transparent bg; text `#737373`; hover text `#171717` + `#F5F5F5` bg tint |
| **Highlight** | Contextual call-to-action in nav (e.g. "Upgrade", "New") | Teal accent; `#003A4A` text; hover `#E6F1F3` bg tint |
| **Primary** | Active / selected nav item | `#8FC31F` text; `rgba(143,195,31,0.1)` bg tint |
| **Sensitive** | Confirmation-required nav action | Neutral fill; requires confirmation before navigating away |
| **Destructive** | Dangerous nav action (e.g. "Delete Workspace") | `#DC2626` text; hover `rgba(220,38,38,0.06)` bg |
| **Ghost** | Minimal nav item, no fill or border at rest | Transparent; `1px solid #D9D9D9` border on hover; text `#737373` → `#404040` |

#### Icon Layout
| Position | Description |
|----------|-------------|
| **Left** | Icon precedes label — used for nav items with a category icon |
| **Right** | Icon follows label — used for items with a chevron, badge, or external link indicator |
| **Center** | Icon only, no visible label — used for collapsed sidebar or icon-only nav rail |

#### Disabled State
- Opacity: `0.4`; `cursor: not-allowed`; no hover/pressed response

---

### 4.13 Nav Icon Button (导航图标按钮)

Icon-only buttons used within navigation chrome — toolbars, collapsed sidebars, action rails, and mobile headers.

#### Sizes
| Size | Button | Icon inside | Use |
|------|--------|-------------|-----|
| Small | `28×28px` | `14×14px` | Dense toolbar actions |
| Default | `36×36px` | `18×18px` | Standard nav toolbar |
| Large | `42×42px` | `20×20px` | Primary nav action, mobile hamburger |

#### Types & States

All types support: **Default**, **Hover**, **Pressed**, **Disabled**.

| Type | Style Guidance |
|------|---------------|
| **Default** | Transparent bg; icon `#737373`; hover `#F5F5F5` bg + icon `#404040` |
| **Highlight** | `#E6F1F3` bg; icon `#003A4A`; hover `#CCE3E7` bg |
| **Primary** | `#8FC31F` bg; icon `#FFFFFF`; hover `#A8E03C` bg |
| **Secondary** | `#F5F5F5` bg; icon `#737373`; hover icon `#404040` — used for secondary nav chrome |
| **Destructive** | Icon `#DC2626`; hover `rgba(220,38,38,0.06)` bg |
| **Ghost** | No bg or border at rest; `1px solid #D9D9D9` border on hover only |

> **Nav Icon Button vs Icon Button (4.2):** Nav Icon Button is designed for navigation chrome contexts. It gains a **Secondary** type (for toolbar chrome) and drops the **Sensitive** type. Use Nav Icon Button for anything inside nav bars, sidebars, or toolbars; use Icon Button for actions within content areas.

---

### 4.14 Icons

**Icon pack: [MingCute](https://www.mingcute.com/) — exclusively.**

All icons across the entire SenseCraft AI interface must come from the MingCute icon library. Do not use Heroicons, Lucide, Phosphor, or any other icon set.

#### Usage rules
- Import as React components via `@iconify/react` with the `mingcute:` prefix, or use MingCute's own React package
- Size icons to match the button/context they appear in:

| Context | Icon size |
|---------|-----------|
| Nav Icon Button Small | `14×14px` |
| Nav Icon Button Default | `18×18px` |
| Nav Icon Button Large / Pop-up close | `20×20px` |
| Icon Button Small | `14×14px` |
| Icon Button Default | `18×18px` |
| Icon Button Large | `20×20px` |
| Inline (body text, labels) | `16×16px` |
| Alert / status indicator | `20×20px` |
| Empty state / illustration | `40×40px` or `48×48px` |

- Icon color always inherits from the surrounding text/button token — never hard-code a hex on an icon
- **Always use `*-line` (outline) variants by default.** Only use `*-fill` when there is a strong semantic reason — e.g. a warning icon inside a destructive dialog, or an explicitly filled/selected state. When in doubt, use `-line`.
- Common icons referenced in this design system:
  - `close-line` — dismiss, close pop-up
  - `warning-line` — inline validation error
  - `warning-fill` — destructive confirmation dialog

---

### 4.15 Pop-up (弹窗)

Pop-ups are modal dialogs that appear centered over the page. They are used for confirmations, destructive actions, and multi-step flows requiring focused user input.

#### Container
- Background: `white` (`#FFFFFF`) — pop-ups always use a **light surface**, regardless of page theme
- Border: `1px solid #E5E5E5`
- Border radius: `12px` (`--round-corner/md`)
- Shadow: `0px 10px 24px -6px rgba(0,0,0,0.15)` (Shadow/2XL)
- Width: `422px` standard; scales to full-width on mobile
- Overflow: `hidden` (clips children to radius)
- Structure: **Top Bar** (optional) → **Content** → **Bottom Bar** (optional)

---

#### Top Bar (顶栏)

Two styles, both `h-[36px]`, full width, `p-[4px]`.

| Style | Layout | Use |
|-------|--------|-----|
| **Style 1** | Title left, close icon button right | Standard pop-up with user-dismissible close |
| **Style 2** | Title centered only | Confirmation dialogs where close is not available |

**Specs:**
- Background: `#FAFAFA` (`--neutral-50`)
- Border-bottom: `1px solid #D9D9D9` (`--border-regular`) — Style 1 only
- Title: Space Grotesk Medium, `13px` (`--size-sm`), `#525252` (`--neutral-600`), `8px` horizontal padding
- Close button (Style 1 only): Nav Icon Button Default (`28×28px`), `close-line` MingCute icon, `14×14px`

---

#### Content Area (弹窗内容)

- Padding: `24px`
- Gap between elements: `16px`
- Body text: Space Grotesk Regular, `13px`, `#000000` or `#404040`; mixed weight allowed (Regular for context, Medium for key phrases)

**Inline validation alert:**
- Background: `#FFF1F1` (`--semantic-error-bg-light`)
- Border: `1px solid #DC2626` (`--border-error`)
- Border radius: `12px`
- Padding: `10px`
- Icon: `warning-line` MingCute, `20×20px`
- Text: Space Grotesk Regular, `12px`, `#DC2626`

---

#### Bottom Bar (底栏)

Three styles, all full width, `p-[8px]`, button height `32px`, button radius `10px` (`--round-corner`).

| Style | Height | Layout | Button widths | Use |
|-------|--------|--------|---------------|-----|
| **Style 1** | `48px` | `justify-end` | `72px` each | Standard confirm/cancel — right-aligned |
| **Style 2-1** | `72px` | `justify-center` | `128px` each | Destructive confirm — centered, equal weight |
| **Style 2-2** | `72px` | `justify-center` | `128px` single | Single primary action — centered |

**Button specs inside Bottom Bar:**
- Cancel button: `bg-[#FAFAFA]`, `border 1px solid #D9D9D9`, text `#404040` (`--neutral-700`), Space Grotesk Medium `16px`
- Confirm button: `bg-[#8FC31F]` (`--primary-500`), text white, Space Grotesk Medium `16px`
- Delete button: `bg-[#DC2626]` (`--semantic-error`), text white, Space Grotesk Medium `16px`
- Disabled Confirm: `bg-[#D4D4D4]` (`--neutral-300`), text `#A3A3A3` (`--neutral-400`) — used when required fields are incomplete

---

#### Use Cases

**Use Case 1 — Confirmation with form content (e.g. Publish)**
```
Top Bar Style 1 (title + close)
  Content:
    Body text (Regular + Medium mixed)
    Checkbox with agreement terms
    Inline validation alert (if errors present)
Bottom Bar Style 1 (Cancel 72px | Confirm/Publish 72px, right-aligned)
  → Confirm disabled (#D4D4D4) until checkbox checked
```

**Use Case 2 — Destructive confirmation (e.g. Delete)**
```
No Top Bar
  Content (centered):
    warning-fill icon 28×28px
    Title: Space Grotesk Medium 13px, black
    Subtitle: Space Grotesk Regular 13px, #DC2626
Bottom Bar Style 2-1 (Cancel 128px | Delete 128px, centered)
```

**Use Case 3 — Single action confirmation (e.g. Continue)**
```
Top Bar Style 2 (centered title only)
  Content area (custom)
Bottom Bar Style 2-2 (single Confirm/Continue 128px, centered)
```

---

### 4.11 Code Blocks / Terminal Output

- Background: `#F5F5F5`
- Text: `#171717` (Space Mono `14px`)
- Border: `1px solid #E5E5E5`
- Radius: `8px`
- Padding: `16px`
- Keyword/value accent: `#003A4A`
- Comment: `#A3A3A3`

---

## 5. Layout Principles

### Spacing System
- Base unit: `4px`
- Scale: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`, `96px`, `128px`

| Token | Value | Use |
|-------|-------|-----|
| `spacing-1` | `0.25rem` / `4px` | Title padding-left, label-to-right-content gap |
| `spacing-2` | `0.5rem` / `8px` | Label-to-input gap, badge gaps, button padding unit |
| `spacing-3` | `0.75rem` / `12px` | Input-to-input gap, card inner padding |
| `spacing-4` | `1rem` / `16px` | Standard gap, form fields, code block padding |
| `spacing-5` | `1.25rem` / `20px` | Button horizontal padding |
| `spacing-6` | `1.5rem` / `24px` | Button-to-input-group gap, section inner padding, card padding |

### Grid & Container
- Max content width: `1280px` (centered)
- Sidebar layouts: fixed `240px` nav + fluid content
- Model card grid: 3–4 columns on desktop, 2 on tablet, 1 on mobile
- Hero: full-width with `96px` vertical padding
- Section padding: `64px` vertical desktop, `40px` mobile

### Border Radius Scale
| Token | Value | Use |
|-------|-------|-----|
| `--radius-none` | `0` | Sharp technical UI, table rows |
| `--radius-sm` | `4px` | Badges, tiny chips, code tokens |
| `--radius-md` | `8px` | Buttons, inputs, standard cards |
| `--radius-lg` | `12px` | Model cards, panels |
| `--radius-xl` | `16px` | Featured cards, hero containers |
| `--radius-2xl` | `24px` | Full-bleed modal sheets |
| `--radius-full` | `9999px` | Tags, category pills, toggles |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, `#FFFFFF` bg | Page base surface, cards |
| Recessed (1) | `#FAFAFA` bg + `1px solid #E5E5E5` border | Input fields, nav chrome, modal header/footer |
| Raised (2) | `#FFFFFF` bg + `1px solid #E5E5E5` border | Standard cards, panels |
| Elevated (3) | `#FFFFFF` bg + `1px solid #E5E5E5` border + `--shadow-sm` | Dropdown menus, tooltips |
| Modal (4) | `0px 10px 24px -6px rgba(0,0,0,0.15)` (`--shadow-2xl`) | Pop-ups, dialogs |
| Focus | `0 0 0 2px #8FC31F` | Keyboard focus on inputs/buttons |

**Confirmed shadow value from Figma:** `--shadow-2xl: 0px 10px 24px -6px rgba(0,0,0,0.15)` — used for pop-up / modal containers.

**Shadow Philosophy**: On light surfaces, elevation is expressed first through background tone (`#FFFFFF` vs `#FAFAFA`) and border presence, then through shadow for floating layers. Reserve shadow for dropdowns and modals only — cards and panels use borders alone.

---

## 7. Do's and Don'ts

### Do
- Use MingCute icon pack exclusively — default to `*-line`; only use `*-fill` when semantically necessary
- Use `#FFFFFF` for page and card surfaces; `#FAFAFA` for recessed chrome (inputs, nav bars, modal header/footer)
- Use `#8FC31F` (primary-500) sparingly — it's the activation signal, not a fill color
- Use Space Mono for all model identifiers, metrics, benchmark values, and code
- Use border color changes (`--border-primary: #8FC31F`) to show selected/active card state
- Apply negative letter-spacing at heading sizes (`-0.03rem` at `3rem`)
- Use semantic color tokens (`--success`, `--error`, `--warning`) for all status indicators
- Use `9999px` radius for tag pills and category filters only
- Express elevation through surface tone (`#FFFFFF` vs `#FAFAFA`) before reaching for shadows

### Don't
- Don't use Heroicons, Lucide, Phosphor, or any icon set other than MingCute
- Don't use `*-fill` icons by default — only when `-line` is semantically insufficient
- Don't use `#8FC31F` as a large fill or background color — buttons and active states only
- Don't use dark secondary tones (`#003A4A`, `#00171E`, `#000C0F`) as surface backgrounds — these are text and accent colors in light mode
- Don't use Space Grotesk for code, model names, or terminal output — Space Mono only
- Don't mix CN and EN fonts in the same line — use one family per text run
- Don't add shadows to cards or panels — borders (`#E5E5E5`) carry containment
- Don't use `font-weight-extrabold` (`800`) for body or UI text — reserve it for hero numbers

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < `640px` | Single column, full-width cards, stacked nav |
| Tablet | `640px`–`1024px` | 2-column model grid, condensed sidebar |
| Desktop | `1024px`–`1280px` | 3-column grid, full sidebar |
| Large Desktop | > `1280px` | 4-column grid, max-width container |

### Collapsing Strategy
- Model card grid: 4-col → 3-col → 2-col → 1-col
- Hero heading: `3rem` → `2.25rem` → `1.875rem`
- Navigation: full horizontal → icon-only sidebar → hamburger overlay
- Section spacing: `96px` → `64px` → `40px`

---

## 9. Agent Prompt Guide

### Quick Color Reference
| Purpose | Token | Value |
|---------|-------|-------|
| Page / card background | `--white` | `#FFFFFF` |
| Recessed chrome (inputs, nav, modal bars) | `--neutral-50` | `#FAFAFA` |
| Default border | `--border` | `#E5E5E5` |
| Input / modal border | `--border-regular` | `#D9D9D9` |
| Active / focus border | `--border-primary` | `#8FC31F` |
| Primary CTA bg | `--primary-500` | `#8FC31F` |
| Heading text | `--neutral-900` | `#171717` |
| Body text | `--neutral-700` | `#404040` |
| Secondary / meta text | `--neutral-600` | `#525252` |
| Placeholder / disabled | `--neutral-400` | `#A3A3A3` |
| Dark accent / teal heading | `--secondary-500` | `#003A4A` |
| Code / mono | `--font-family-code` | `Space Mono` |

### Example Component Prompts
- **Model Card**: "White card (`#FFFFFF`), border `1px solid #E5E5E5`, radius `12px`. Title `1.125rem` Space Grotesk weight `500`, color `#171717`. Type badge: pill `9999px`, `#003A4A` text, `#E6F1F3` bg, `1px solid #CCE3E7` border. Metric row: `0.75rem` Space Mono `#737373`. Hover: border `1px solid #8FC31F`."
- **Hero Section**: "Full-width section on `#FFFFFF`. Headline `3rem` Space Grotesk weight `800`, letter-spacing `-0.03rem`, color `#171717`. Subhead `1.125rem` weight `400`, color `#737373`. CTA: `#8FC31F` bg, `#FFFFFF` text, `8px` radius, `8px 20px` padding."
- **Status Badge**: "Pill badge, `9999px` radius, `4px 10px` padding. Running: `#8FC31F` text + border, `rgba(143,195,31,0.1)` background. Error: `#DC2626` text + border, `rgba(220,38,38,0.1)` background."
- **Code Block**: "`#F5F5F5` background, `1px solid #E5E5E5` border, `8px` radius, `16px` padding. Text `0.875rem` Space Mono `#171717`. Keyword accent: `#003A4A`."
- **Navigation**: "Sticky nav on `#FFFFFF`, `1px solid #E5E5E5` bottom border. Logo left. Nav items use Nav Button Default type (`197×42px`): text `#737373`, transparent bg, hover text `#171717` + `#F5F5F5` bg. Active: Nav Button Primary type, text `#8FC31F`, bg `rgba(143,195,31,0.1)`. Right-aligned CTA: Primary text button Large (`42px`)."
- **Sidebar**: "Fixed sidebar on `#FAFAFA`, `1px solid #E5E5E5` right border. Nav items: Nav Button Default Left-icon (`197×42px`). Active: Nav Button Primary Left-icon, text `#8FC31F`, bg `rgba(143,195,31,0.1)`. Toolbar icons: Nav Icon Button Default or Secondary (`36×36px`)."
- **Confirm Pop-up**: "White pop-up (`422px`, `12px` radius, shadow `0px 10px 24px -6px rgba(0,0,0,0.15)`, border `1px solid #E5E5E5`). Top Bar Style 1 (`36px`, `#FAFAFA` bg, border-bottom `#D9D9D9`, title Space Grotesk Medium `13px` `#525252`, close MingCute `close-line` `28×28px`). Content `24px` padding. Bottom Bar Style 1 (`48px`, `justify-end`, Cancel `72px` `#FAFAFA`/border, Confirm `72px` `#8FC31F`/white, both `32px` height `10px` radius)."
- **Destructive Pop-up**: "White pop-up, no top bar. Content centered: MingCute `warning-line` `28×28px` `#DC2626`, title Medium `13px` `#171717`, subtitle Regular `13px` `#DC2626`. Bottom Bar Style 2-1 (`72px`, centered, Cancel `128px` neutral, Delete `128px` `#DC2626`/white)."

### Iteration Guide
1. Page and card base is `#FFFFFF`; use `#FAFAFA` for recessed chrome (inputs, sidebar, modal bars)
2. Borders do the work: `#E5E5E5` for cards, `#D9D9D9` for inputs and modal chrome
3. `#8FC31F` activates the page — one CTA, one active state, one status indicator at a time
4. `#003A4A` (secondary-500) is your dark accent for headings and teal-branded text elements
5. Every model identifier, metric, or version string uses Space Mono
6. Letter-spacing tightens with size: `-0.03rem` at `48px`, `-0.02rem` at `36px`, `-0.01rem` at `22–30px`, normal below
7. Status colors are semantic tokens — never hard-code `#DC2626` for error; use `--error`
8. For bilingual pages: Space Grotesk and Noto Sans SC at matching sizes — no size reduction for CN
