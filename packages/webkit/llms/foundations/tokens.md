# Design tokens

> Every visual decision comes from a token: the token groups, what to use and what lint blocks.

## 1. Foundations — design tokens

**Every visual decision comes from a token.** Raw values are blocked; the token is always
the answer, and using it is what makes light/dark theming work for free.

| Foundation | ✅ Use                                                                                                                                                              | ❌ Never                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Color      | `var(--primary)` · `var(--bg-surface)` · `var(--text-default)` · `var(--border-default)` · feedback `--success/--warning/--danger/--info` (+ `-contrast`/`-border`) | `#f3652b` · `rgb(…)` · `hsl(…)` · Tailwind palette (`text-blue-600`, `bg-gray-500`)        |
| Typography | generated classes — `text-heading-md`, `text-body-sm`, `text-button-lg`, `text-label-md`, `text-overline-md` (font + size + line-height + tracking bundled)         | `text-sm` · `leading-*` · `tracking-*` · `font-family` · `text-[length:…]`                 |
| Spacing    | the semantic scale `var(--spacing-2xs…2xl)` — `p-(--spacing-md)`, `gap-(--spacing-sm)`                                                                              | the primitive numeric scale (`--spacing-1…-96`) · `p-4` when a token applies · `p-[13px]`  |
| Shape      | `rounded-(--shape-button)` · `--shape-card` · `--shape-control` · `rounded-[inherit]` for pseudo-elements                                                           | `rounded-lg` · numeric radii                                                               |
| Shadow     | `shadow-(--shadow-md)`                                                                                                                                              | bare `shadow-md` · hex/rgb elevation · legacy `--card-shadow`                              |
| Motion     | catalogued `animate-*` utilities + `transition-*` with token durations; **every** motion class pairs with `motion-reduce:`                                          | local `@keyframes` · `animate-[…]` / `duration-[…]` arbitrary values · animation libraries |

If a design needs a color/size that has no token, that is a **theme gap**: record it and
propose the token — never inline the raw value "until the theme catches up".

**Enforced by:** `validate-tokens` (write-time + the CI ratchet) · `webkit/no-hardcoded-color` + the
stylelint config (consumer lint).

---

## The rule

The design system ships tokens. Use them. Never hardcode a raw color or an off-scale value.

## Do

- Use CSS variables from `@aziontech/theme` for color: `var(--primary)`, `var(--bg-surface)`, `var(--text-default)`, `var(--border-default)`, and the other semantic tokens.
- Use one orange, the logo orange `#F3652B`, and never as a text colour: it misses WCAG AA as text on light surfaces. It is `var(--primary)`: a fill behind `--primary-foreground` text (the button, `Tag variant="primary"`, the `HeroTitle` highlight), or a bar, underline, glyph or glow beside text in `--text-default` (the `Quote` name bar, `LinkDirectory` column underlines). The `Eyebrow` carries no orange mark: its only mark is the `//` prefix on marketing headers. A glow starts from `--primary` and fades to transparent, never to a lighter or darker orange.
- Put text on a fill with that fill's pair: every fill colour has a `-foreground` text colour (`--primary` / `--primary-foreground`, `--danger` / `--danger-foreground`); the inverted surface `--bg-contrast` takes `--text-contrast`.
- Use the theme's semantic spacing and radius tokens: `var(--spacing-xs)`, `var(--spacing-md)` (scale `2xs…2xl`), `var(--shape-button)`.
- Use the generated typography classes / tokens for text (`text-button-lg`, and the other named type scales), not raw font sizes.
- Let the class pick the family: headings, titles, body copy and buttons are sans (`text-heading-*` except `text-heading-code-md`, `text-title-*`, `text-body-*`, `text-button-*`); eyebrows, big numbers and code are mono (`text-overline-*`, `text-big-number-*`, `text-label-code-*`, `text-body-code-sm`, `text-body-code-lg`, and `text-heading-code-md` for a code the reader compares by eye, such as a device code). Code that wraps or runs over several lines takes a `text-body-code-*` class, which has a real line height; the `text-label-code-*` set is one row per line, with no leading. The heading and big-number classes change size by breakpoint, so a page never sets its own type scale. A big number never wraps: inside a size container (`@container`) it shrinks to fit `--text-big-number-characters` glyphs (less the `--text-big-number-inset` gap width) on one line, which `Stats` sets for you.
- Weight lives in the role, never in a `font-*` utility. Every role is regular (400) except the `text-title-*` set, which is medium (500): the title of a contained surface, such as a dialog or drawer (`text-title-lg`), a side panel (`text-title-md`), or a popover, card, alert or toast (`text-title-sm`). Those parts already apply it; a page or section heading stays `text-heading-*`, regular, so large display type keeps the brand's light look.
- Keep heading letter spacing in `em`: the heading classes shrink on phones, and a tracking in `rem` stays the same width while the letters get smaller, so a small display heading runs its words together. `text-heading-3xl` tracks at `-0.046em` and `text-heading-2xl` at `-0.053em` from `md` up (2.56px at their desktop size) and both open to `-0.035em` on phones, so word spaces stay readable at 30px; a new heading role with tracking takes `em` or `0`, never `rem` or `px`.
- Import the styles once, near your app entry: `import './webkit.css'` (the theme, `@aziontech/theme/fonts.css` for the Azion font faces, and `./webkit.sources.css`, the WebKit files Tailwind compiles; `npx @aziontech/webkit init` writes it) and `import '@aziontech/icons'` for icons (the colour logos come with `./webkit.css`, compiled only for the logos your sources name).

## Don't

- No hex: never `#fff`, `#0a0a0a`, `text-[#1e40af]`.
- No `rgb(...)` / `rgba(...)` / `hsl(...)` literals for design colors.
- No orange text and no second orange: never `--text-primary` or `--text-brand` (both removed in 6.0, use `--text-default` with a `--primary` mark), `--color-orange-<step>`, `--color-brand-primary-<step>` or `--color-alpha-orange-<step>` other than the logo step `500`. The lighter and darker oranges stay inside the theme (the chart and severity scales use them as data colours). The `off-brand-orange` token check blocks them in components, examples, blocks and the docs and demos apps.
- No raw Tailwind palette: never `bg-blue-600`, `text-red-500`, `border-gray-200`. Those are not the design system's colors.
- No off-scale magic numbers for spacing (`p-[13px]`) when a spacing token exists.
- No inline hex for a colour the theme lacks: that is a design-system gap. Raise it; the full catalog is generated by `@aziontech/theme`.
- No zero with a length unit: write `0`, never `0px` / `0rem` / `0em`. A zero is identical in every unit, so the unit is noise — and it makes the same value read three different ways. This covers tokens, arbitrary values (`p-[0px]`), inline `style`, and authored CSS. Units that carry meaning at zero are fine: `0%`, `0s`, `0deg`, `0fr`. One exception: inside `calc()`/`min()`/`max()`/`clamp()` CSS requires a unit on the zero — there, write `0rem` (never `0px` / `0em`).

## Values and purposes

Every semantic token ships with its value and a one-line purpose: a colour has a light and a dark
value, a length or type class has a base value and the breakpoints it steps to. Ask the MCP
`list_tokens` (a group such as `bg` or `chart`, or one name such as `--bg-surface`), or read
`tokens.values` in `catalog.json` or `llms/foundations/tokens.md`. Pick a token by its purpose, never
by its value: two tokens can share a value today and part tomorrow.

## Design intent

The rules behind the groups, which no single token's purpose states:

- **Surfaces stack in one order.** `--bg-canvas` is the page, `--bg-surface` sits on it (cards,
  panels, tables) and `--bg-surface-raised` floats above a surface (menus, popovers, the chart
  tooltip). A raised layer also takes a shadow through its variable, `shadow-(--shadow-md)`, never
  Tailwind's `shadow-md`: the dark theme redefines every step.
- **Placeholders are translucent.** A loading placeholder uses `--bg-placeholder` and its sweep
  `--bg-placeholder-highlight`, never an opaque surface token: the translucent fill reads on every
  surface, an opaque one only on the surface it was picked against.
- **Two rhythm steps.** `--layout-section-gap` between the sections of a parent,
  `--layout-group-gap` between the parts of one section; tighter `--spacing-*` steps only inside one
  unit. The `--spacing-*` scale grows by breakpoint on its own, so never restate it per breakpoint.
- **Radius by role.** `--shape-card` for cards, panels and dialogs, `--shape-button` for buttons,
  `--shape-control` for fields and chips, `--shape-flat` for a surface that meets an edge.
- **Type by role.** A text class carries family, size, line height and tracking, and steps up by
  breakpoint (the headings and big numbers): choose the class for the job and never add a size,
  `leading-*` or `tracking-*` beside it.
- **Every colour token is a plain colour.** No token is an opacity or a `color-mix()` of another,
  so canvas charts and contrast checks can read it; never fake a lighter step with `opacity`.

## Which color token does which job

A color token names a job, not a hue. Use the component that already does the job, and pick a token
by hand only for your own elements. The table lists what each group is for and the components that
use it, so you can check a choice against a real one.

| Job                                                 | Tokens                                                                                   | Used by                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main action                                         | `--primary`, `--primary-foreground`                                                      | `Button variant="primary"`, `Checkbox` checked, `Progress` fill, `Tag variant="primary"`, `StatusIndicator severity="alt"`                                                                                                                                                                                                                                                                                                                |
| Second action                                       | `--secondary`, `--secondary-foreground`                                                  | `Button variant="secondary"`, `IconButton`, `Badge variant="secondary"`                                                                                                                                                                                                                                                                                                                                                                   |
| Brand tint                                          | `--primary-mask`, `--primary-selected`                                                   | `RadioGroup` selected card                                                                                                                                                                                                                                                                                                                                                                             |
| Accent: a live state or connection, never an action | `--accent`, `--accent-foreground`                                                        | `Switch` on, `Slider` fill, `Tag variant="accent"`, resize handles in `Sidebar` and `Resizable`, a dragged `Table` row, `FlowDiagram` edges and ports                                                                                                                                                                                                                                                                                     |
| Brand marks: the logo colours                       | `--primary`, `--brand-blue`, `--brand-blue-foreground`                                   | the logo orange as a mark beside text in `--text-default` or a fill behind `--primary-foreground`, never as text (owner, 2026-11-22): the `Quote` name bar, `LinkDirectory` column underlines, the `HeroTitle` highlight fill, the `CompetitorComparisonSection` group bar, `Tag variant="primary"`, the hovered linked `FeatureItem` underline; the `Eyebrow` cursor in the brand blue (`--brand-blue`, `#0072F5`, the azion.com blue) |
| Selected item                                       | `--bg-selected`, `--border-selected`                                                     | selected rows and options in `Table`, `MenuItem`, `DropdownMenu`, `ToggleGroup`, `Select`, `Combobox`, `Trace`; `RadioGroup` card and `Chip` borders                                                                                                                                                                                                                                                                                      |
| Selected tab                                        | `--secondary-mask`                                                                       | the sliding indicator in `Tabs`                                                                                                                                                                                                                                                                                                                                                                                                           |
| Hover and press                                     | `--bg-hover`, `--bg-active`, `--bg-mask`                                                 | every interactive component (`--bg-mask` is the hover layer on `Button variant="outline"` and `variant="ghost"`)                                                                                                                                                                                                                                                                                                                          |
| Surfaces                                            | `--bg-canvas`, `--bg-surface`, `--bg-surface-raised`                                     | page, cards and panels, `Avatar`, striped `Table` rows                                                                                                                                                                                                                                                                                                                                                                                    |
| Inverted surface                                    | `--bg-contrast`, `--text-contrast`                                                       | `Tooltip`, `Tag variant="contrast"`                                                                                                                                                                                                                                                                                                                                                                                                       |
| Behind a modal                                      | `--bg-backdrop`                                                                          | `Dialog`, `Drawer`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Status message                                      | `--success`, `--warning`, `--danger`, `--info` with `-border`, `-foreground` and `-mark` | `Alert`, `Tag`, `Badge`, `Trace` spans, `Button variant="danger"`. The fill is the box, `-border` its edge, `-foreground` its icon or text. A status mark or icon that stands on the page (the `StatusIndicator` dot, the `OutcomeIcon` disc, the check and cross of a Do / Don't pair) is `-mark`; `-foreground` is near black in light, made for its pale fill, and reads as no colour on a surface.                                    |
| Severity                                            | `--severity-critical`, `-high`, `-medium`, `-low`                                        | the bars of `SeverityTag` only                                                                                                                                                                                                                                                                                                                                                                                                            |
| Links                                               | `--text-link`, `--text-link-hover`                                                       | `Button variant="link"`, links in text                                                                                                                                                                                                                                                                                                                                                                                                    |
| Error text on the page                              | `--text-danger`                                                                          | `FieldError` message, a field error in `FieldDescription`, any error sentence on a surface (red.600 in light, red.200 in dark). Not `--danger-foreground`, which is text on the `--danger` fill                                                                                                                                                                                                                                           |
| Form field outline                                  | `--border-input`                                                                         | the resting and disabled outline of `Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `PasswordInput`, `OtpInput`, the date fields, `Checkbox`, `RadioGroup`, `Switch`                                                                                                                                                                                                                                                         |
| Charts                                              | `--chart-*`                                                                              | the chart components; series, status and severity colors are not interchangeable                                                                                                                                                                                                                                                                                                                                                          |

Defined but not used by any component yet: `--accent-mask`, `--accent-selected`,
`--bg-surface-overlay`, `--severity-info`. Do not build on them until a component does.

## Contrast: APCA and WCAG 2

Every colour pair passes **both** WCAG 2.1 AA (4.5:1 text, 3:1 large text, icons and UI marks) and
APCA (0.0.98G-4g, the `|Lc|` value):

| What sits on the colour                    | APCA target | Examples                                                                                                                                                        |
| ------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Body text                                  | Lc 75       | `--text-default` on the surfaces                                                                                                                                |
| Other text (labels, captions, button text) | Lc 60       | `--text-muted`, links, `--text-danger`, every `-foreground` on its fill                                                                                         |
| Icons                                      | Lc 45       | a status icon standing on a surface in `--success-mark`, `--warning-mark`, `--danger-mark` (the Do / Don't check and cross); `-foreground` only on its own fill |
| Solid marks (dots, bars, chart series)     | Lc 30       | `--chart-series-*`, `--severity-*`, `--border-selected`, the ring                                                                                               |
| Borders and dividers                       | Lc 15       | `--border-default`, `--border-muted`, `--border-input`, `--danger-border` (also WCAG 3:1, the invalid field outline)                                            |

The theme test `packages/theme/test/apca-contrast.test.mjs` computes Lc for these pairs on
`--bg-canvas`, `--bg-surface` and `--bg-surface-raised` in light and dark, and fails a pair below
its target unless it is listed here. A new token pair, or a value change, must pass before it ships.

Exceptions (the one list; `accepted` means the owner chose the look, `open` waits for a decision):

| Pair                                      | Theme       | Lc   | Status   | Reason                                                                                                      |
| ----------------------------------------- | ----------- | ---- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `--primary-foreground` on `--primary`     | light, dark | 46.6 | accepted | The black label on the logo orange `#F3652B` matches the logo (2026-11-14). WCAG 6.71:1 passes.             |
| `--border-default` on the surfaces        | dark        | 0    | accepted | Dark dividers keep the original `#2B2B2B` look (2026-11-16). Form outlines stay `--border-input` `#535353`. |
| `--border-muted` on the surfaces          | dark        | 0    | accepted | Dark muted dividers keep the original `#242424` look (2026-11-16).                                          |
| `--border-muted` on `--bg-canvas`         | light       | 13.3 | accepted | Light muted divider on the page canvas, target Lc 15: kept as is (owner decision 2026-11-16).               |
| `--text-muted` on `--bg-surface-raised`   | dark        | 59.9 | accepted | Dark muted text in menus and popovers, target Lc 60: kept as is (owner decision 2026-11-16).                |
| `--border-input` on `--bg-surface-raised` | dark        | 14.6 | accepted | Dark field outline inside a raised panel, target Lc 15: kept as is (owner decision 2026-11-16).             |

Do not "fix" an accepted pair; do not add a pair to this list without the design owner's decision.

## Chart palettes

WebKit ships **one** chart palette: the values of the `--chart-*` tokens. There are no alternate
palettes in `@aziontech/theme`. An app that offers other palettes (the console API's palette picker)
sets these variables on the dashboard's root element, and every chart inside re-colours:

| A palette may set                                                                                                 | A palette never sets                                                                                   |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `--chart-series-1` … `--chart-series-8`                                                                           | `--chart-series-other` (the grey a ninth series folds into)                                            |
| `--chart-sequential-1` (lowest) … `--chart-sequential-7`                                                          | `--chart-status-*` and `--severity-*` (they mean a state)                                              |
| `--chart-diverging-negative` (`-2`, `-3`), `--chart-diverging-neutral`, `--chart-diverging-positive` (`-3`, `-2`) | `--chart-grid`, `--chart-axis`, `--chart-label`, `--chart-crosshair`, `--chart-tooltip-*` (the chrome) |

- **Gridlines are half a border.** `--chart-grid` (the lines behind the marks) sits halfway, in
  perceived lightness, between `--border-default` and `--bg-surface`: it keeps half the border's
  contrast, so the card edge reads before the grid and the grid never competes with the data. Light
  `#E5E5E5`, dark `#1A1A1A`. The axis baseline stays `--chart-axis`, at full border strength. The
  value is a primitive step, never `color-mix()` or an opacity: tokens resolve to a plain colour so
  canvas charts and the contrast tests can read them. If `--border-default` or `--bg-surface`
  changes, pick the new halfway step; `chart-role.test.mjs` fails until you do.
- **Both themes.** A palette supplies a light and a dark value for every variable it sets (set the
  dark values under `[data-theme='dark']`); a half palette breaks the theme switch.
- **Same checks as the default.** Every series value clears 3:1 (WCAG) and Lc 30 (APCA) on
  `--bg-surface`, `--bg-canvas` and `--chart-tooltip-bg` in its theme, the eight series are eight
  distinct colours, and a series keeps its hue family across the theme switch. These are the checks
  `packages/theme/test/chart-role.test.mjs` and `apca-contrast.test.mjs` run on the default.
- **Diverging runs in three or seven steps.** Three: `--chart-diverging-negative`, `-neutral`,
  `-positive`. Seven, from the negative end to the positive end: `-negative`, `-negative-2`,
  `-negative-3`, `-neutral`, `-positive-3`, `-positive-2`, `-positive`. The intermediate steps keep
  the end's hue and lose chroma toward the neutral; every coloured step clears 3:1 and Lc 30 on the
  chart surfaces, and neighbours stay at least 0.05 apart in OKLab (`chart-role.test.mjs`). A palette
  that sets the diverging variables sets all seven.
- **Eight series, then Other.** A palette has at most eight series; a chart with more folds the
  rest into `--chart-series-other`. A palette never adds `--chart-series-9`.
- **Where.** On your own root element, or on a webkit tag as a static `style`, an object-literal
  `:style` or `[--chart-series-1:…]` classes; `webkit/no-style-override` allows exactly these
  variables (`CHART_PALETTE_VARIABLES` in `@aziontech/webkit/eslint-plugin`) and nothing else.

## One outline per toolbar

Outlined controls side by side in a header or a toolbar share one border colour: the toolbar's
`--border-default`, the outline of `IconButton variant="outline"`, `Button variant="outline"` and
`SearchTrigger`. `--border-input` is the form field outline; it belongs to a text field you type in
and to a field in a form, never to a button-like control in a header. A header language switch is
`LanguageSelect variant="ghost"`, not a field-sized `Select`; a header switcher of any other kind is
`Select variant="ghost"`.

- **Do:** a search field, a ghost `LanguageSelect`, outline icon buttons: one border colour in the row.
- **Don't:** a field-sized `Select` (`--border-input`) between outline icon buttons (`--border-default`).

The styled visual suite checks it on every docs page, example and block (`toolbar-outlines.spec.ts`).

## Use a variant only when the component has it

A token pair is not a variant. `--accent` and `--accent-foreground` exist, but `Button` has no accent
kind, so there is no accent button: an "Upgrade" or "New" call to action is `Button variant="primary"`
or `variant="secondary"`. Before you draw or build a variant, check that the component lists it in its
`variant` or `severity` union in `catalog.json` (or the MCP `get_component`). If it is not there, use
one that is.

- No `--accent` fill on a button, link or call to action.
- No `--accent` or `--primary` for a selected row, item or option: that is `--bg-selected`.
- No status colors (`--success`, `--danger`, …) to tell categories apart: they mean a state.
- No `--severity-*` outside a severity scale.

## Example

### Do

```html
<div class="bg-(--bg-surface) text-(--text-default) p-(--spacing-md) rounded-(--shape-card)">
  ...
</div>
```

### Don't

```html
<div class="bg-[#161616] text-white p-[13px] m-[0px] rounded-md">...</div>
```

## Token groups

786 CSS custom properties from `@aziontech/theme`, grouped by their first segment. The MCP tool `list_tokens` returns the same list.

| Group | Count | Tokens |
| --- | --- | --- |
| accent | 4 | `--accent` · `--accent-foreground` · `--accent-mask` · `--accent-selected` |
| animate | 31 | `--animate-autoplay-progress` · `--animate-blink` · `--animate-blink-settle` · `--animate-bounce` · `--animate-brand-marquee` · `--animate-content-enter` · `--animate-fade-in` · `--animate-fade-out` · `--animate-flow-dash` · `--animate-flow-dash-settle` · `--animate-highlight-fade` · `--animate-page-enter` · `--animate-ping` · `--animate-ping-settle` · `--animate-popup-scale-in` · `--animate-popup-scale-out` · `--animate-progress-indeterminate` · `--animate-progress-indeterminate-short` · `--animate-pulse` · `--animate-pulse-settle` · `--animate-shimmer` · `--animate-slide-down` · `--animate-slide-in-end` · `--animate-slide-in-start` · `--animate-slide-out-end` · `--animate-slide-out-start` · `--animate-spin` · `--animate-spin-settle` · `--animate-status-pulse` · `--animate-texture-wave-a` · `--animate-texture-wave-b` |
| aspect | 1 | `--aspect-video` |
| bg | 13 | `--bg-active` · `--bg-backdrop` · `--bg-canvas` · `--bg-contrast` · `--bg-disabled` · `--bg-hover` · `--bg-mask` · `--bg-placeholder` · `--bg-placeholder-highlight` · `--bg-selected` · `--bg-surface` · `--bg-surface-overlay` · `--bg-surface-raised` |
| blur | 7 | `--blur-2xl` · `--blur-3xl` · `--blur-lg` · `--blur-md` · `--blur-sm` · `--blur-xl` · `--blur-xs` |
| border | 11 | `--border-default` · `--border-input` · `--border-muted` · `--border-selected` · `--border-strong` · `--border-width-0` · `--border-width-1` · `--border-width-2` · `--border-width-3` · `--border-width-4` · `--border-width-default` |
| brand | 2 | `--brand-blue` · `--brand-blue-foreground` |
| breakpoint | 5 | `--breakpoint-2xl` · `--breakpoint-lg` · `--breakpoint-md` · `--breakpoint-sm` · `--breakpoint-xl` |
| chart | 35 | `--chart-axis` · `--chart-crosshair` · `--chart-diverging-negative` · `--chart-diverging-negative-2` · `--chart-diverging-negative-3` · `--chart-diverging-neutral` · `--chart-diverging-positive` · `--chart-diverging-positive-2` · `--chart-diverging-positive-3` · `--chart-grid` · `--chart-label` · `--chart-sequential-1` · `--chart-sequential-2` · `--chart-sequential-3` · `--chart-sequential-4` · `--chart-sequential-5` · `--chart-sequential-6` · `--chart-sequential-7` · `--chart-series-1` · `--chart-series-2` · `--chart-series-3` · `--chart-series-4` · `--chart-series-5` · `--chart-series-6` · `--chart-series-7` · `--chart-series-8` · `--chart-series-other` · `--chart-status-danger` · `--chart-status-info` · `--chart-status-success` · `--chart-status-warning` · `--chart-tooltip-bg` · `--chart-tooltip-border` · `--chart-tooltip-muted` · `--chart-tooltip-text` |
| code | 9 | `--code-editor-line-height` · `--code-syntax-comment` · `--code-syntax-function` · `--code-syntax-identifier` · `--code-syntax-keyword` · `--code-syntax-line-number` · `--code-syntax-punctuation` · `--code-syntax-string` · `--code-syntax-type` |
| color | 214 | `--color-absolute-black` · `--color-absolute-white` · `--color-alpha-absolute-black` · `--color-alpha-absolute-white` · `--color-alpha-black-100` · `--color-alpha-black-200` · `--color-alpha-black-300` · `--color-alpha-black-400` · `--color-alpha-black-50` · `--color-alpha-black-500` · `--color-alpha-black-600` · `--color-alpha-black-700` · `--color-alpha-black-800` · `--color-alpha-black-900` · `--color-alpha-blue-100` · `--color-alpha-blue-200` · `--color-alpha-blue-300` · `--color-alpha-blue-400` · `--color-alpha-blue-50` · `--color-alpha-blue-500` · `--color-alpha-blue-600` · `--color-alpha-blue-700` · `--color-alpha-blue-800` · `--color-alpha-blue-900` · `--color-alpha-green-100` · `--color-alpha-green-200` · `--color-alpha-green-300` · `--color-alpha-green-400` · `--color-alpha-green-50` · `--color-alpha-green-500` · `--color-alpha-green-600` · `--color-alpha-green-700` · `--color-alpha-green-800` · `--color-alpha-green-900` · `--color-alpha-orange-100` · `--color-alpha-orange-200` · `--color-alpha-orange-300` · `--color-alpha-orange-400` · `--color-alpha-orange-50` · `--color-alpha-orange-500` · `--color-alpha-orange-600` · `--color-alpha-orange-700` · `--color-alpha-orange-800` · `--color-alpha-orange-900` · `--color-alpha-red-100` · `--color-alpha-red-200` · `--color-alpha-red-300` · `--color-alpha-red-400` · `--color-alpha-red-50` · `--color-alpha-red-500` · `--color-alpha-red-600` · `--color-alpha-red-700` · `--color-alpha-red-800` · `--color-alpha-red-900` · `--color-alpha-violet-100` · `--color-alpha-violet-200` · `--color-alpha-violet-300` · `--color-alpha-violet-400` · `--color-alpha-violet-50` · `--color-alpha-violet-500` · `--color-alpha-violet-600` · `--color-alpha-violet-700` · `--color-alpha-violet-800` · `--color-alpha-violet-900` · `--color-alpha-white-100` · `--color-alpha-white-200` · `--color-alpha-white-300` · `--color-alpha-white-400` · `--color-alpha-white-50` · `--color-alpha-white-500` · `--color-alpha-white-600` · `--color-alpha-white-700` · `--color-alpha-white-75` · `--color-alpha-white-800` · `--color-alpha-white-900` · `--color-alpha-yellow-100` · `--color-alpha-yellow-200` · `--color-alpha-yellow-300` · `--color-alpha-yellow-400` · `--color-alpha-yellow-50` · `--color-alpha-yellow-500` · `--color-alpha-yellow-600` · `--color-alpha-yellow-700` · `--color-alpha-yellow-800` · `--color-alpha-yellow-900` · `--color-base-black` · `--color-base-white` · `--color-blue-100` · `--color-blue-200` · `--color-blue-300` · `--color-blue-400` · `--color-blue-50` · `--color-blue-500` · `--color-blue-600` · `--color-blue-700` · `--color-blue-800` · `--color-blue-900` · `--color-blue-950` · `--color-brand-accent-100` · `--color-brand-accent-200` · `--color-brand-accent-300` · `--color-brand-accent-400` · `--color-brand-accent-50` · `--color-brand-accent-500` · `--color-brand-accent-600` · `--color-brand-accent-700` · `--color-brand-accent-800` · `--color-brand-accent-900` · `--color-brand-accent-950` · `--color-brand-primary-100` · `--color-brand-primary-200` · `--color-brand-primary-300` · `--color-brand-primary-400` · `--color-brand-primary-50` · `--color-brand-primary-500` · `--color-brand-primary-600` · `--color-brand-primary-700` · `--color-brand-primary-800` · `--color-brand-primary-900` · `--color-brand-primary-950` · `--color-gray-100` · `--color-gray-150` · `--color-gray-200` · `--color-gray-250` · `--color-gray-275` · `--color-gray-300` · `--color-gray-400` · `--color-gray-50` · `--color-gray-500` · `--color-gray-600` · `--color-gray-650` · `--color-gray-700` · `--color-gray-750` · `--color-gray-775` · `--color-gray-800` · `--color-gray-900` · `--color-gray-950` · `--color-green-100` · `--color-green-200` · `--color-green-300` · `--color-green-400` · `--color-green-50` · `--color-green-500` · `--color-green-600` · `--color-green-700` · `--color-green-800` · `--color-green-900` · `--color-green-950` · `--color-indigo-100` · `--color-indigo-200` · `--color-indigo-300` · `--color-indigo-400` · `--color-indigo-50` · `--color-indigo-500` · `--color-indigo-600` · `--color-indigo-700` · `--color-indigo-800` · `--color-indigo-900` · `--color-indigo-950` · `--color-orange-100` · `--color-orange-200` · `--color-orange-300` · `--color-orange-400` · `--color-orange-50` · `--color-orange-500` · `--color-orange-600` · `--color-orange-700` · `--color-orange-800` · `--color-orange-900` · `--color-orange-950` · `--color-red-100` · `--color-red-200` · `--color-red-300` · `--color-red-400` · `--color-red-50` · `--color-red-500` · `--color-red-600` · `--color-red-700` · `--color-red-800` · `--color-red-900` · `--color-red-950` · `--color-slate-100` · `--color-slate-200` · `--color-slate-300` · `--color-slate-400` · `--color-slate-50` · `--color-slate-500` · `--color-slate-600` · `--color-slate-700` · `--color-slate-800` · `--color-slate-900` · `--color-slate-950` · `--color-violet-100` · `--color-violet-200` · `--color-violet-300` · `--color-violet-400` · `--color-violet-50` · `--color-violet-500` · `--color-violet-600` · `--color-violet-700` · `--color-violet-800` · `--color-violet-900` · `--color-violet-950` · `--color-yellow-100` · `--color-yellow-200` · `--color-yellow-300` · `--color-yellow-400` · `--color-yellow-50` · `--color-yellow-500` · `--color-yellow-600` · `--color-yellow-700` · `--color-yellow-800` · `--color-yellow-900` · `--color-yellow-950` |
| container | 13 | `--container-2xl` · `--container-2xs` · `--container-3xl` · `--container-3xs` · `--container-4xl` · `--container-5xl` · `--container-6xl` · `--container-7xl` · `--container-lg` · `--container-md` · `--container-sm` · `--container-xl` · `--container-xs` |
| danger | 4 | `--danger` · `--danger-border` · `--danger-foreground` · `--danger-mark` |
| direction | 1 | `--direction-sign` |
| drop | 6 | `--drop-shadow-2xl` · `--drop-shadow-lg` · `--drop-shadow-md` · `--drop-shadow-sm` · `--drop-shadow-xl` · `--drop-shadow-xs` |
| ease | 7 | `--ease-expressive-entrance` · `--ease-expressive-exit` · `--ease-in` · `--ease-in-out` · `--ease-out` · `--ease-productive-entrance` · `--ease-productive-exit` |
| font | 12 | `--font-code` · `--font-display` · `--font-sans` · `--font-weight-black` · `--font-weight-bold` · `--font-weight-extrabold` · `--font-weight-extralight` · `--font-weight-light` · `--font-weight-medium` · `--font-weight-normal` · `--font-weight-semibold` · `--font-weight-thin` |
| illustration | 21 | `--illustration-accent` · `--illustration-block` · `--illustration-code-keyword` · `--illustration-code-punctuation` · `--illustration-danger` · `--illustration-ground` · `--illustration-highlight` · `--illustration-info` · `--illustration-info-surface` · `--illustration-ink` · `--illustration-ink-muted` · `--illustration-line` · `--illustration-line-muted` · `--illustration-line-strong` · `--illustration-primary` · `--illustration-success` · `--illustration-success-surface` · `--illustration-surface` · `--illustration-surface-raised` · `--illustration-warning` · `--illustration-warning-surface` |
| info | 4 | `--info` · `--info-border` · `--info-foreground` · `--info-mark` |
| inset | 3 | `--inset-shadow-2xs` · `--inset-shadow-sm` · `--inset-shadow-xs` |
| layout | 16 | `--layout-boundary-end` · `--layout-boundary-inline` · `--layout-boundary-start` · `--layout-column-measure` · `--layout-group-gap` · `--layout-header-height` · `--layout-measure` · `--layout-measure-content` · `--layout-measure-control` · `--layout-measure-focused` · `--layout-measure-form` · `--layout-measure-form-create` · `--layout-measure-site` · `--layout-measure-site-header` · `--layout-section-gap` · `--layout-sticky-top` |
| leading | 6 | `--leading-loose` · `--leading-none` · `--leading-normal` · `--leading-relaxed` · `--leading-snug` · `--leading-tight` |
| opacity | 4 | `--opacity-100` · `--opacity-25` · `--opacity-50` · `--opacity-75` |
| perspective | 5 | `--perspective-distant` · `--perspective-dramatic` · `--perspective-midrange` · `--perspective-near` · `--perspective-normal` |
| primary | 4 | `--primary` · `--primary-foreground` · `--primary-mask` · `--primary-selected` |
| radius | 9 | `--radius` · `--radius-2xl` · `--radius-3xl` · `--radius-full` · `--radius-lg` · `--radius-md` · `--radius-none` · `--radius-sm` · `--radius-xl` |
| ring | 2 | `--ring-color` · `--ring-offset` |
| secondary | 4 | `--secondary` · `--secondary-foreground` · `--secondary-mask` · `--secondary-selected` |
| severity | 5 | `--severity-critical` · `--severity-high` · `--severity-info` · `--severity-low` · `--severity-medium` |
| shadow | 7 | `--shadow-2xl` · `--shadow-2xs` · `--shadow-lg` · `--shadow-md` · `--shadow-sm` · `--shadow-xl` · `--shadow-xs` |
| shape | 4 | `--shape-button` · `--shape-card` · `--shape-control` · `--shape-flat` |
| size | 28 | `--size-10` · `--size-11` · `--size-12` · `--size-14` · `--size-16` · `--size-2` · `--size-20` · `--size-24` · `--size-28` · `--size-3` · `--size-32` · `--size-36` · `--size-4` · `--size-40` · `--size-44` · `--size-48` · `--size-5` · `--size-52` · `--size-56` · `--size-6` · `--size-60` · `--size-64` · `--size-7` · `--size-72` · `--size-8` · `--size-80` · `--size-9` · `--size-96` |
| spacing | 36 | `--spacing-1` · `--spacing-10` · `--spacing-11` · `--spacing-12` · `--spacing-14` · `--spacing-16` · `--spacing-2` · `--spacing-20` · `--spacing-24` · `--spacing-28` · `--spacing-2xl` · `--spacing-2xs` · `--spacing-3` · `--spacing-32` · `--spacing-36` · `--spacing-4` · `--spacing-40` · `--spacing-44` · `--spacing-48` · `--spacing-5` · `--spacing-52` · `--spacing-56` · `--spacing-6` · `--spacing-60` · `--spacing-64` · `--spacing-7` · `--spacing-72` · `--spacing-8` · `--spacing-80` · `--spacing-9` · `--spacing-96` · `--spacing-lg` · `--spacing-md` · `--spacing-sm` · `--spacing-xl` · `--spacing-xs` |
| success | 4 | `--success` · `--success-border` · `--success-foreground` · `--success-mark` |
| text | 229 | `--text-2xl` · `--text-2xl--line-height` · `--text-3xl` · `--text-3xl--line-height` · `--text-4xl` · `--text-4xl--line-height` · `--text-5xl` · `--text-5xl--line-height` · `--text-6xl` · `--text-6xl--line-height` · `--text-7xl` · `--text-7xl--line-height` · `--text-8xl` · `--text-8xl--line-height` · `--text-9xl` · `--text-9xl--line-height` · `--text-amount-lg-font-size` · `--text-amount-lg-font-weight` · `--text-amount-lg-letter-spacing` · `--text-amount-lg-line-height` · `--text-amount-lg-text-wrap-style` · `--text-amount-md-font-size` · `--text-amount-md-font-weight` · `--text-amount-md-letter-spacing` · `--text-amount-md-line-height` · `--text-amount-md-text-wrap-style` · `--text-amount-sm-font-size` · `--text-amount-sm-font-weight` · `--text-amount-sm-letter-spacing` · `--text-amount-sm-line-height` · `--text-base` · `--text-base--line-height` · `--text-big-number-lg-font-family` · `--text-big-number-lg-font-size` · `--text-big-number-lg-font-weight` · `--text-big-number-lg-line-height` · `--text-big-number-lg-white-space` · `--text-big-number-md-font-family` · `--text-big-number-md-font-size` · `--text-big-number-md-font-weight` · `--text-big-number-md-line-height` · `--text-big-number-md-white-space` · `--text-big-number-sm-font-family` · `--text-big-number-sm-font-size` · `--text-big-number-sm-font-weight` · `--text-big-number-sm-line-height` · `--text-big-number-sm-white-space` · `--text-big-number-unit-font-family` · `--text-big-number-unit-font-weight` · `--text-big-number-unit-line-height` · `--text-body-2xs-font-size` · `--text-body-2xs-font-weight` · `--text-body-2xs-line-height` · `--text-body-2xs-text-wrap-style` · `--text-body-code-lg-font-family` · `--text-body-code-lg-font-size` · `--text-body-code-lg-font-weight` · `--text-body-code-lg-letter-spacing` · `--text-body-code-lg-line-height` · `--text-body-code-lg-text-wrap-style` · `--text-body-code-sm-font-family` · `--text-body-code-sm-font-size` · `--text-body-code-sm-font-weight` · `--text-body-code-sm-letter-spacing` · `--text-body-code-sm-line-height` · `--text-body-code-sm-text-wrap-style` · `--text-body-lg-font-size` · `--text-body-lg-font-weight` · `--text-body-lg-line-height` · `--text-body-lg-text-wrap-style` · `--text-body-md-font-size` · `--text-body-md-font-weight` · `--text-body-md-line-height` · `--text-body-md-text-wrap-style` · `--text-body-prose-md-font-size` · `--text-body-prose-md-font-weight` · `--text-body-prose-md-line-height` · `--text-body-sm-font-size` · `--text-body-sm-font-weight` · `--text-body-sm-line-height` · `--text-body-sm-text-wrap-style` · `--text-body-xs-font-size` · `--text-body-xs-font-weight` · `--text-body-xs-line-height` · `--text-body-xs-text-wrap-style` · `--text-button-lg-font-family` · `--text-button-lg-font-size` · `--text-button-lg-font-weight` · `--text-button-lg-letter-spacing` · `--text-button-lg-line-height` · `--text-button-md-font-family` · `--text-button-md-font-size` · `--text-button-md-font-weight` · `--text-button-md-letter-spacing` · `--text-button-md-line-height` · `--text-contrast` · `--text-danger` · `--text-default` · `--text-disabled` · `--text-heading-2xl-font-size` · `--text-heading-2xl-font-weight` · `--text-heading-2xl-letter-spacing` · `--text-heading-2xl-line-height` · `--text-heading-2xl-text-wrap-style` · `--text-heading-2xl-word-spacing` · `--text-heading-2xs-font-size` · `--text-heading-2xs-font-weight` · `--text-heading-2xs-letter-spacing` · `--text-heading-2xs-line-height` · `--text-heading-2xs-text-wrap-style` · `--text-heading-3xl-font-size` · `--text-heading-3xl-font-weight` · `--text-heading-3xl-letter-spacing` · `--text-heading-3xl-line-height` · `--text-heading-3xl-text-wrap-style` · `--text-heading-3xl-word-spacing` · `--text-heading-code-md-font-family` · `--text-heading-code-md-font-size` · `--text-heading-code-md-font-variant-numeric` · `--text-heading-code-md-font-weight` · `--text-heading-code-md-letter-spacing` · `--text-heading-code-md-line-height` · `--text-heading-lg-font-size` · `--text-heading-lg-font-weight` · `--text-heading-lg-letter-spacing` · `--text-heading-lg-line-height` · `--text-heading-lg-text-wrap-style` · `--text-heading-md-font-size` · `--text-heading-md-font-weight` · `--text-heading-md-letter-spacing` · `--text-heading-md-line-height` · `--text-heading-md-text-wrap-style` · `--text-heading-sm-font-size` · `--text-heading-sm-font-weight` · `--text-heading-sm-letter-spacing` · `--text-heading-sm-line-height` · `--text-heading-sm-text-wrap-style` · `--text-heading-xl-font-size` · `--text-heading-xl-font-weight` · `--text-heading-xl-letter-spacing` · `--text-heading-xl-line-height` · `--text-heading-xl-text-wrap-style` · `--text-heading-xs-font-size` · `--text-heading-xs-font-weight` · `--text-heading-xs-letter-spacing` · `--text-heading-xs-line-height` · `--text-heading-xs-text-wrap-style` · `--text-label-code-lg-font-family` · `--text-label-code-lg-font-size` · `--text-label-code-lg-font-weight` · `--text-label-code-lg-letter-spacing` · `--text-label-code-lg-line-height` · `--text-label-code-md-font-family` · `--text-label-code-md-font-size` · `--text-label-code-md-font-weight` · `--text-label-code-md-letter-spacing` · `--text-label-code-md-line-height` · `--text-label-code-sm-font-family` · `--text-label-code-sm-font-size` · `--text-label-code-sm-font-weight` · `--text-label-code-sm-letter-spacing` · `--text-label-code-sm-line-height` · `--text-label-lg-font-size` · `--text-label-lg-font-weight` · `--text-label-lg-letter-spacing` · `--text-label-lg-line-height` · `--text-label-md-font-size` · `--text-label-md-font-weight` · `--text-label-md-letter-spacing` · `--text-label-md-line-height` · `--text-label-sm-font-size` · `--text-label-sm-font-weight` · `--text-label-sm-letter-spacing` · `--text-label-sm-line-height` · `--text-lg` · `--text-lg--line-height` · `--text-link` · `--text-link-border-radius` · `--text-link-color` · `--text-link-font-size` · `--text-link-hover` · `--text-link-line-height` · `--text-link-text-decoration-color` · `--text-link-text-decoration-line` · `--text-link-text-underline-offset` · `--text-link-transition` · `--text-muted` · `--text-overline-md-font-family` · `--text-overline-md-font-size` · `--text-overline-md-letter-spacing` · `--text-overline-md-line-height` · `--text-overline-md-text-transform` · `--text-overline-sm-font-family` · `--text-overline-sm-font-size` · `--text-overline-sm-letter-spacing` · `--text-overline-sm-line-height` · `--text-overline-sm-text-transform` · `--text-overline-xs-font-family` · `--text-overline-xs-font-size` · `--text-overline-xs-letter-spacing` · `--text-overline-xs-line-height` · `--text-overline-xs-text-transform` · `--text-sm` · `--text-sm--line-height` · `--text-tag-md-font-size` · `--text-tag-md-font-weight` · `--text-tag-md-line-height` · `--text-tag-sm-font-size` · `--text-tag-sm-font-weight` · `--text-tag-sm-line-height` · `--text-title-lg-font-size` · `--text-title-lg-font-weight` · `--text-title-lg-letter-spacing` · `--text-title-lg-line-height` · `--text-title-lg-text-wrap-style` · `--text-title-md-font-size` · `--text-title-md-font-weight` · `--text-title-md-letter-spacing` · `--text-title-md-line-height` · `--text-title-md-text-wrap-style` · `--text-title-sm-font-size` · `--text-title-sm-font-weight` · `--text-title-sm-letter-spacing` · `--text-title-sm-line-height` · `--text-title-sm-text-wrap-style` · `--text-xl` · `--text-xl--line-height` · `--text-xs` · `--text-xs--line-height` |
| tracking | 6 | `--tracking-normal` · `--tracking-tight` · `--tracking-tighter` · `--tracking-wide` · `--tracking-wider` · `--tracking-widest` |
| transition | 8 | `--transition-duration-fast-01` · `--transition-duration-fast-02` · `--transition-duration-moderate-01` · `--transition-duration-moderate-02` · `--transition-duration-slow-01` · `--transition-duration-slow-02` · `--transition-duration-slow-03` · `--transition-duration-slow-04` |
| warning | 4 | `--warning` · `--warning-border` · `--warning-foreground` · `--warning-mark` |
| z | 2 | `--z-control` · `--z-control-overlay` |

## Semantic tokens

196 semantic tokens with their value and a one-line purpose: pick a token by its purpose, never by its value. `catalog.json` holds the same export under `tokens.values`, and the MCP tool `list_tokens` returns it per group or per token.

### Colours (light and dark)

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `--primary` | `#F3652B` | `#F3652B` | The main action fill: the primary button, a checked checkbox, a progress fill. |
| `--primary-mask` | `#FE601F33` | `#FE601F33` | A translucent primary tint behind brand-highlighted content. |
| `--primary-selected` | `#FE601F33` | `#FE601F33` | The translucent primary tint of a selected brand card. |
| `--primary-foreground` | `#000000` | `#000000` | Text and icons on a --primary fill. |
| `--secondary` | `#0A0A0A` | `#FFFFFF` | The second action fill: the secondary button and the icon button. |
| `--secondary-mask` | `#00000005` | `#FFFFFF1A` | The sliding indicator under the selected tab. |
| `--secondary-selected` | `#0A0A0A` | `#FFFFFF` | The selected day of a date picker, drawn in the secondary fill. |
| `--secondary-foreground` | `#FFFFFF` | `#000000` | Text and icons on a --secondary fill. |
| `--accent` | `#005FCC` | `#99C9FF` | A live state or a connection, never an action: a switch on, a slider fill, diagram edges. |
| `--accent-mask` | `#0072F51A` | `#0072F51A` | A translucent accent tint; defined, not used by any component yet. |
| `--accent-selected` | `#005FCC` | `#99C9FF` | A selected accent mark; defined, not used by any component yet. |
| `--accent-foreground` | `#FFFFFF` | `#000000` | Text and icons on an --accent fill. |
| `--brand-blue` | `#0072F5` | `#0072F5` | The azion.com blue for brand marks only, such as the eyebrow cursor. |
| `--brand-blue-foreground` | `#FFFFFF` | `#FFFFFF` | Text on a --brand-blue fill. |
| `--bg-canvas` | `#F5F5F5` | `#000000` | The page background behind every surface. |
| `--bg-surface` | `#FFFFFF` | `#0A0A0A` | Cards, panels and table bodies that sit on the canvas. |
| `--bg-surface-raised` | `#FFFFFF` | `#141414` | Menus, popovers and the chart tooltip that float above a surface. |
| `--bg-mask` | `#00000005` | `#FFFFFF0D` | The hover layer on outline and ghost buttons. |
| `--bg-surface-overlay` | `#FAFAFA` | `#4D4D4D` | A third surface step; defined, not used by any component yet; text on it is --text-default. |
| `--bg-placeholder` | `#00000014` | `#FFFFFF1A` | The translucent fill a loading placeholder reserves the space with. |
| `--bg-placeholder-highlight` | `#FFFFFF99` | `#FFFFFF1A` | The sweep that passes over a loading placeholder. |
| `--bg-hover` | `#00000014` | `#FFFFFF14` | The hover fill of an interactive row, item or control. |
| `--bg-active` | `#00000005` | `#FFFFFF0D` | The pressed fill of an interactive row, item or control. |
| `--bg-backdrop` | `#000000CC` | `#000000CC` | The dimmed layer behind a dialog or drawer. |
| `--bg-selected` | `#E5E5E5` | `#2B2B2B` | The fill of a selected row, option or toggle. |
| `--bg-contrast` | `#141414` | `#FAFAFA` | The inverted surface of a tooltip or a contrast tag. |
| `--bg-disabled` | `#E5E5E5` | `#1A1A1A` | The fill of a disabled control. |
| `--border-default` | `#D1D1D1` | `#2B2B2B` | Dividers and the edge of cards, tables and panels. |
| `--border-muted` | `#DADADA` | `#242424` | Quieter dividers inside a framed surface. |
| `--border-input` | `#D1D1D1` | `#535353` | The resting and disabled outline of a field, select, checkbox, radio or switch. |
| `--border-strong` | `#000000` | `#FFFFFF` | A full-strength outline that must read before every other line. |
| `--border-selected` | `#F3652B` | `#F3652B` | The outline of a selected card, chip or option. |
| `--text-default` | `#141414` | `#FAFAFA` | Body text and headings on any surface. |
| `--text-muted` | `#535353` | `#B2B2B2` | Secondary text: descriptions, captions, metadata. |
| `--text-disabled` | `#999999` | `#4D4D4D` | Text of a disabled control. |
| `--text-link` | `#005FCC` | `#99C9FF` | Links in text and the link button. |
| `--text-link-hover` | `#004799` | `#99C9FF` | A link under the pointer. |
| `--text-danger` | `#B71515` | `#F3A5A5` | Error text on the page, such as the FieldError message. |
| `--text-contrast` | `#FAFAFA` | `#000000` | Text on the inverted --bg-contrast surface. |
| `--ring-color` | `#666666` | `#808080` | The keyboard focus ring. |
| `--code-syntax-identifier` | `#141414` | `#FAFAFA` | Identifiers and plain code text. |
| `--code-syntax-line-number` | `#535353` | `#999999` | Line numbers in the code gutter. |
| `--code-syntax-keyword` | `#004799` | `#99C9FF` | Language keywords. |
| `--code-syntax-punctuation` | `#535353` | `#B2B2B2` | Brackets, operators and punctuation. |
| `--code-syntax-comment` | `#535353` | `#999999` | Code comments. |
| `--code-syntax-function` | `#B03C02` | `#F3652B` | Function and method names. |
| `--code-syntax-type` | `#634B03` | `#FAD76B` | Type names and annotations. |
| `--code-syntax-string` | `#004799` | `#99C9FF` | String literals. |
| `--success` | `#78EDA2` | `#0A2916` | The box of a success message, tag or badge. |
| `--success-border` | `#22C55E66` | `#22C55E66` | The edge of a success box. |
| `--success-foreground` | `#0A2916` | `#52E086` | Text and icons on --success; on a surface, --success-mark. |
| `--success-mark` | `#16833F` | `#18B452` | A success mark standing on the page: the status dot, the outcome disc. |
| `--warning` | `#FAD76B` | `#312602` | The box of a warning message, tag or badge. |
| `--warning-border` | `#F7BD0880` | `#F7BD0880` | The edge of a warning box. |
| `--warning-foreground` | `#312602` | `#F7BD08` | Text and icons on --warning; on a surface, --warning-mark. |
| `--warning-mark` | `#947105` | `#C59707` | A warning mark standing on the page: the status dot, the outcome disc. |
| `--danger` | `#F3A5A5` | `#5B0B0B` | The box of an error message, tag or badge, and the danger button. |
| `--danger-border` | `#E74B4B` | `#E74B4B` | The edge of a danger box and the outline of an invalid field. |
| `--danger-foreground` | `#2E0606` | `#F9D2D2` | Text and icons on --danger; on a surface, --danger-mark. |
| `--danger-mark` | `#E51A1A` | `#ED7878` | An error mark standing on the page: the status dot, the outcome disc. |
| `--info` | `#99C9FF` | `#001833` | The box of an informational message, tag or badge. |
| `--info-border` | `#0072F566` | `#0072F566` | The edge of an info box. |
| `--info-foreground` | `#003066` | `#99C9FF` | Text and icons on --info; on a surface, --info-mark. |
| `--info-mark` | `#0072F5` | `#3392FF` | An info mark standing on the page: the status dot, the outcome disc. |
| `--illustration-ground` | `#F5F5F5` | `#000000` | The ground an illustration scene stands on. |
| `--illustration-surface` | `#FFFFFF` | `#0A0A0A` | Panels drawn inside an illustration. |
| `--illustration-surface-raised` | `#FFFFFF` | `#141414` | Raised panels drawn inside an illustration. |
| `--illustration-block` | `#E5E5E5` | `#2B2B2B` | Filled blocks and placeholder bars in an illustration. |
| `--illustration-line` | `#D1D1D1` | `#2B2B2B` | Outlines in an illustration. |
| `--illustration-line-muted` | `#DADADA` | `#242424` | Quiet outlines and dividers in an illustration. |
| `--illustration-line-strong` | `#999999` | `#4D4D4D` | Emphasised outlines in an illustration. |
| `--illustration-highlight` | `#000000` | `#FFFFFF` | The one strongest line of an illustration. |
| `--illustration-ink` | `#141414` | `#FAFAFA` | Text and glyphs drawn in an illustration. |
| `--illustration-ink-muted` | `#535353` | `#B2B2B2` | Secondary text drawn in an illustration. |
| `--illustration-primary` | `#F3652B` | `#F3652B` | The brand orange in an illustration. |
| `--illustration-accent` | `#005FCC` | `#99C9FF` | Connections and live states in an illustration. |
| `--illustration-code-punctuation` | `#535353` | `#B2B2B2` | Code punctuation drawn in an illustration. |
| `--illustration-code-keyword` | `#004799` | `#99C9FF` | Code keywords drawn in an illustration. |
| `--illustration-success` | `#0A2916` | `#52E086` | A success mark in an illustration. |
| `--illustration-success-surface` | `#78EDA2` | `#0A2916` | A success box in an illustration. |
| `--illustration-danger` | `#2E0606` | `#F9D2D2` | An error mark in an illustration. |
| `--illustration-warning` | `#312602` | `#F7BD08` | A warning mark in an illustration. |
| `--illustration-warning-surface` | `#FAD76B` | `#312602` | A warning box in an illustration. |
| `--illustration-info` | `#003066` | `#99C9FF` | An info mark in an illustration. |
| `--illustration-info-surface` | `#99C9FF` | `#001833` | An info box in an illustration. |
| `--chart-series-other` | `#808080` | `#808080` | The grey a ninth and later series fold into. |
| `--chart-axis` | `#D1D1D1` | `#2B2B2B` | The axis baseline and ticks of a chart. |
| `--chart-label` | `#535353` | `#B2B2B2` | Axis labels and legend text of a chart. |
| `--chart-crosshair` | `#535353` | `#B2B2B2` | The crosshair that follows the pointer over a chart. |
| `--chart-tooltip-bg` | `#FFFFFF` | `#141414` | The chart tooltip surface. |
| `--chart-tooltip-text` | `#141414` | `#FAFAFA` | The values in a chart tooltip. |
| `--chart-tooltip-muted` | `#535353` | `#D1D1D1` | Labels and secondary text in a chart tooltip. |
| `--chart-tooltip-border` | `#D1D1D1` | `#2B2B2B` | The edge of the chart tooltip. |
| `--chart-grid` | `#E5E5E5` | `#1A1A1A` | Gridlines behind chart marks, half the contrast of a border. |
| `--chart-series-1` | `#0072F5` | `#2F86FF` | The first categorical series of a chart (blue). |
| `--chart-series-2` | `#0D9488` | `#14A08C` | The second categorical series of a chart (teal). |
| `--chart-series-3` | `#6D28D9` | `#8B5CF6` | The third categorical series of a chart (violet). |
| `--chart-series-4` | `#E8590C` | `#E65A1E` | The fourth categorical series of a chart (orange). |
| `--chart-series-5` | `#0891B2` | `#0EA5C6` | The fifth categorical series of a chart (cyan). |
| `--chart-series-6` | `#4338CA` | `#6366F1` | The sixth categorical series of a chart (indigo). |
| `--chart-series-7` | `#4D7C0F` | `#6AA51A` | The seventh categorical series of a chart (lime). |
| `--chart-series-8` | `#C026D3` | `#D946EF` | The eighth and last categorical series of a chart (fuchsia). |
| `--chart-status-success` | `#16833F` | `#18B452` | A chart series whose colour means success, such as served requests. |
| `--chart-status-warning` | `#947105` | `#C59707` | A chart series whose colour means a warning. |
| `--chart-status-danger` | `#E51A1A` | `#E74B4B` | A chart series whose colour means an error, such as blocked requests. |
| `--chart-status-info` | `#0072F5` | `#3392FF` | A chart series whose colour means information. |
| `--chart-sequential-1` | `#E0E7FF` | `#1E1B4B` | The lowest step of a sequential magnitude scale. |
| `--chart-sequential-2` | `#C7D2FE` | `#312E81` | Step 2 of 7 of a sequential magnitude scale. |
| `--chart-sequential-3` | `#A5B4FC` | `#3730A3` | Step 3 of 7 of a sequential magnitude scale. |
| `--chart-sequential-4` | `#818CF8` | `#4F46E5` | Step 4 of 7 of a sequential magnitude scale. |
| `--chart-sequential-5` | `#6366F1` | `#6366F1` | Step 5 of 7 of a sequential magnitude scale. |
| `--chart-sequential-6` | `#4F46E5` | `#818CF8` | Step 6 of 7 of a sequential magnitude scale. |
| `--chart-sequential-7` | `#4338CA` | `#A5B4FC` | The highest step of a sequential magnitude scale. |
| `--chart-diverging-negative` | `#D94A03` | `#FF8E4D` | The negative end of a diverging scale (orange). |
| `--chart-diverging-negative-2` | `#C96746` | `#CD8157` | The second negative step of a seven-step diverging scale. |
| `--chart-diverging-negative-3` | `#B57D6A` | `#9D725C` | The negative step next to the neutral in a seven-step diverging scale. |
| `--chart-diverging-neutral` | `#ECECEC` | `#2B2B2B` | The midpoint of a diverging scale. |
| `--chart-diverging-positive-3` | `#6E8CB8` | `#5D7EA7` | The positive step next to the neutral in a seven-step diverging scale. |
| `--chart-diverging-positive-2` | `#4377C3` | `#4D89D2` | The second positive step of a seven-step diverging scale. |
| `--chart-diverging-positive` | `#005FCC` | `#3392FF` | The positive end of a diverging scale (blue). |
| `--severity-critical` | `#B71515` | `#ED7878` | The critical bar of a severity tag. |
| `--severity-high` | `#D94A03` | `#FF8E4D` | The high bar of a severity tag. |
| `--severity-medium` | `#947105` | `#F7BD08` | The medium bar of a severity tag. |
| `--severity-low` | `#005FCC` | `#66ADFF` | The low bar of a severity tag. |
| `--severity-info` | `#808080` | `#999999` | An informational severity; defined, not used by any component yet. |

### Spacing, layout, shape and layers

| Token | Value | Breakpoints | Purpose |
| --- | --- | --- | --- |
| `--spacing-2xl` | `2rem` | sm: 4rem, xl: 6rem | The largest gap, between marketing bands; grows at sm and xl. |
| `--spacing-xl` | `1.5rem` | sm: 2rem, xl: 3rem | The gap between page sections; grows at sm and xl. |
| `--spacing-lg` | `1rem` | sm: 1.5rem | Card padding and the page boundary inset; grows at sm. |
| `--spacing-md` | `1rem` |  | The gap between the parts of one section and the padding of a control. |
| `--spacing-sm` | `0.75rem` |  | The gap between related controls in a row. |
| `--spacing-xs` | `0.5rem` |  | The gap between the parts of one control, such as its label and its icon. |
| `--spacing-2xs` | `0.25rem` |  | The tightest gap: the padding and gaps inside a menu or list of options. |
| `--layout-boundary-inline` | `var(--spacing-lg)` |  | The side inset of a page body. |
| `--layout-boundary-end` | `var(--spacing-lg)` |  | The bottom inset of a page body. |
| `--layout-boundary-start` | `var(--spacing-lg)` |  | The top inset of a page body. |
| `--layout-section-gap` | `var(--spacing-xl)` |  | The gap between the sections of a parent. |
| `--layout-group-gap` | `var(--spacing-md)` |  | The gap between the parts inside one section, and the floor between two regions. |
| `--layout-measure` | `var(--container-7xl)` |  | The width cap of the standard data page column. |
| `--layout-measure-focused` | `var(--container-4xl)` |  | The width cap of a single-task focused page. |
| `--layout-measure-form` | `var(--container-4xl)` |  | The width cap of a settings or in-page edit form. |
| `--layout-measure-form-create` | `var(--container-5xl)` |  | The width cap of a dedicated create page. |
| `--layout-measure-content` | `var(--container-3xl)` |  | The width cap of a prose column, set by line length. |
| `--layout-measure-site` | `var(--container-6xl)` |  | The frame of a marketing site page, shared by every section. |
| `--layout-measure-site-header` | `var(--container-7xl)` |  | The column of the marketing site top bar. |
| `--layout-measure-control` | `var(--container-3xs)` |  | The width of a form control in a form column; a create page widens it. |
| `--layout-header-height` | `calc(var(--spacing) * 14)` |  | The height of the top header, which a full-height hero subtracts. |
| `--layout-sticky-top` | `var(--layout-header-height)` |  | Where a sticky part inside the page stops: under the sticky header; 0 inside a scroller with no header above it. |
| `--z-control` | `1` |  | Lifts a control above its neighbours, such as a focused input in a group. |
| `--z-control-overlay` | `1100` |  | The layer of overlays: menus, popovers, dialogs, toasts. |
| `--code-editor-line-height` | `1rem` |  | The line step of code in the code editor. |
| `--shape-flat` | `0` |  | No rounding, for surfaces that meet an edge. |
| `--shape-card` | `8px` |  | The corner radius of cards, panels and dialogs. |
| `--shape-button` | `6px` |  | The corner radius of buttons. |
| `--shape-control` | `6px` |  | The corner radius of inputs, chips and small surfaces. |
| `--border-width-default` | `0.8px` |  | The hairline width of every border and divider. |
