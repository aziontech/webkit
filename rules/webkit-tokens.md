# Rule: colors, spacing, and typography come from @aziontech/theme

The design system ships tokens. Use them. Never hardcode a raw color or an off-scale value.

## Do

- Use CSS variables from `@aziontech/theme` for color: `var(--primary)`, `var(--bg-surface)`, `var(--text-default)`, `var(--border-default)`, and the other semantic tokens.
- Put text on a fill with that fill's pair: every fill colour has a `-foreground` text colour (`--primary` / `--primary-foreground`, `--danger` / `--danger-foreground`); the inverted surface `--bg-contrast` takes `--text-contrast`.
- Use the theme's semantic spacing and radius tokens: `var(--spacing-xs)`, `var(--spacing-md)` (scale `2xs…2xl`), `var(--shape-button)`.
- Use the generated typography classes / tokens for text (`text-button-lg`, and the other named type scales), not raw font sizes.
- Let the class pick the family: headings, body copy and buttons are sans (`text-heading-*`, `text-body-*`, `text-button-*`); eyebrows, big numbers and code are mono (`text-overline-*`, `text-big-number-*`, `text-label-code-*`, `text-body-code-sm`). The heading and big-number classes change size by breakpoint, so a page never sets its own type scale.
- Import the styles once, near your app entry: `import './webkit.css'` (the theme, `@aziontech/theme/fonts.css` for the Azion font faces, and `./webkit.sources.css`, the WebKit files Tailwind compiles; `npx @aziontech/webkit init` writes it) and `import '@aziontech/icons'` for icons.

## Do not

- No hex: never `#fff`, `#0a0a0a`, `text-[#1e40af]`.
- No `rgb(...)` / `rgba(...)` / `hsl(...)` literals for design colors.
- No raw Tailwind palette: never `bg-blue-600`, `text-red-500`, `border-gray-200`. Those are not the design system's colors.
- No off-scale magic numbers for spacing (`p-[13px]`) when a spacing token exists.
- No zero with a length unit: write `0`, never `0px` / `0rem` / `0em`. A zero is identical in every unit, so the unit is noise — and it makes the same value read three different ways. This covers tokens, arbitrary values (`p-[0px]`), inline `style`, and authored CSS. Units that carry meaning at zero are fine: `0%`, `0s`, `0deg`, `0fr`. One exception: inside `calc()`/`min()`/`max()`/`clamp()` CSS requires a unit on the zero — there, write `0rem` (never `0px` / `0em`).

## Which color token does which job

A color token names a job, not a hue. Use the component that already does the job, and pick a token
by hand only for your own elements. The table lists what each group is for and the components that
use it, so you can check a choice against a real one.

| Job                                                 | Tokens                                                                                   | Used by                                                                                                                                                                                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main action                                         | `--primary`, `--primary-foreground`                                                      | `Button variant="primary"`, `Checkbox` checked, `Progress` fill, `Tag variant="primary"`, `StatusIndicator severity="alt"`                                                                                                                        |
| Second action                                       | `--secondary`, `--secondary-foreground`                                                  | `Button variant="secondary"`, `IconButton`, `Badge variant="secondary"`                                                                                                                                                                           |
| Brand text and tint                                 | `--text-primary`, `--primary-mask`, `--primary-selected`                                 | the required asterisk in `FieldLabel`, `Tag variant="highlight"`, `RadioGroup` selected card                                                                                                                                                      |
| Accent: a live state or connection, never an action | `--accent`, `--accent-foreground`                                                        | `Switch` on, `Slider` fill, `Tag variant="accent"`, resize handles in `Sidebar` and `Resizable`, a dragged `Table` row, `FlowDiagram` and `TopologyDiagram` edges and ports                                                                       |
| Brand marks: the logo colours                       | `--text-brand`, `--brand-blue`, `--brand-blue-foreground`                                | `Eyebrow` text in the logo orange (`--text-brand`: the logo orange `#F3652B` in light and dark, an owner-accepted contrast exception below) and its blinking cursor in the brand blue (`--brand-blue`, `#0072F5`, the azion.com blue)             |
| Selected item                                       | `--bg-selected`, `--border-selected`                                                     | selected rows and options in `Table`, `MenuItem`, `DropdownMenu`, `ToggleGroup`, `Select`, `Combobox`, `Trace`; `RadioGroup` card and `Chip` borders                                                                                              |
| Selected tab                                        | `--secondary-mask`                                                                       | the sliding indicator in `Tabs`                                                                                                                                                                                                                   |
| Hover and press                                     | `--bg-hover`, `--bg-active`, `--bg-mask`                                                 | every interactive component (`--bg-mask` is the hover layer on `Button variant="outline"` and `variant="ghost"`)                                                                                                                                  |
| Surfaces                                            | `--bg-canvas`, `--bg-surface`, `--bg-surface-raised`                                     | page, cards and panels, `Avatar`, striped `Table` rows                                                                                                                                                                                            |
| Inverted surface                                    | `--bg-contrast`, `--text-contrast`                                                       | `Tooltip`, `Tag variant="contrast"`                                                                                                                                                                                                               |
| Behind a modal                                      | `--bg-backdrop`                                                                          | `Dialog`, `Drawer`                                                                                                                                                                                                                                |
| Status message                                      | `--success`, `--warning`, `--danger`, `--info` with `-border`, `-foreground` and `-mark` | `Alert`, `Tag`, `Badge`, `Trace` spans, `Button variant="danger"`. The fill is the box, `-border` its edge, `-foreground` its icon or text. A status mark that stands on the page (the `StatusIndicator` dot, the `OutcomeIcon` disc) is `-mark`. |
| Severity                                            | `--severity-critical`, `-high`, `-medium`, `-low`                                        | the bars of `SeverityTag` only                                                                                                                                                                                                                    |
| Links                                               | `--text-link`, `--text-link-hover`                                                       | `Button variant="link"`, links in text                                                                                                                                                                                                            |
| Form field outline                                  | `--border-input`                                                                         | the resting and disabled outline of `Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `PasswordInput`, `OtpInput`, the date fields, `Checkbox`, `RadioGroup`, `Switch`                                                                 |
| Charts                                              | `--chart-*`                                                                              | the chart components; series, status and severity colors are not interchangeable                                                                                                                                                                  |

Defined but not used by any component yet: `--accent-mask`, `--accent-selected`,
`--bg-surface-overlay`, `--severity-info`. Do not build on them until a component does.

## Contrast: APCA and WCAG 2

Every colour pair passes **both** WCAG 2.1 AA (4.5:1 text, 3:1 large text, icons and UI marks) and
APCA (0.0.98G-4g, the `|Lc|` value):

| What sits on the colour                    | APCA target | Examples                                                          |
| ------------------------------------------ | ----------- | ----------------------------------------------------------------- |
| Body text                                  | Lc 75       | `--text-default` on the surfaces                                  |
| Other text (labels, captions, button text) | Lc 60       | `--text-muted`, links, every `-foreground` on its fill            |
| Icons                                      | Lc 45       | status icons in `--success-foreground` … on a surface             |
| Solid marks (dots, bars, chart series)     | Lc 30       | `--chart-series-*`, `--severity-*`, `--border-selected`, the ring |
| Borders and dividers                       | Lc 15       | `--border-default`, `--border-muted`, `--border-input`            |

The theme test `packages/theme/test/apca-contrast.test.mjs` computes Lc for these pairs on
`--bg-canvas`, `--bg-surface` and `--bg-surface-raised` in light and dark, and fails a pair below
its target unless it is listed here. A new token pair, or a value change, must pass before it ships.

Exceptions (the one list; `accepted` means the owner chose the look, `open` waits for a decision):

| Pair                                      | Theme       | Lc        | Status   | Reason                                                                                                                                                                                                                                                |
| ----------------------------------------- | ----------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--primary-foreground` on `--primary`     | light, dark | 46.6      | accepted | The black label on the logo orange `#F3652B` matches the logo (2026-11-14). WCAG 6.71:1 passes.                                                                                                                                                       |
| `--border-default` on the surfaces        | dark        | 0         | accepted | Dark dividers keep the original `#2B2B2B` look (2026-11-16). Form outlines stay `--border-input` `#535353`.                                                                                                                                           |
| `--border-muted` on the surfaces          | dark        | 0         | accepted | Dark muted dividers keep the original `#242424` look (2026-11-16).                                                                                                                                                                                    |
| `--text-brand` on the surfaces            | dark        | 43.5–44.3 | accepted | The `Eyebrow` label stays the logo orange `#F3652B` in dark. WCAG 5.5:1 passes.                                                                                                                                                                       |
| `--text-brand` on the surfaces            | light       | 51.5–57.5 | accepted | brand: the eyebrow matches the logo orange; owner decision 2026-11-16. Fails both APCA (Lc 60) and WCAG 2 AA (2.9–3.1:1, needs 4.5:1). axe skips `color-contrast` on the Eyebrow label only, listed in `packages/webkit/src/test/a11y-accepted.json`. |
| `--border-muted` on `--bg-canvas`         | light       | 13.3      | accepted | Light muted divider on the page canvas, target Lc 15: kept as is (owner decision 2026-11-16).                                                                                                                                                         |
| `--text-muted` on `--bg-surface-raised`   | dark        | 59.9      | accepted | Dark muted text in menus and popovers, target Lc 60: kept as is (owner decision 2026-11-16).                                                                                                                                                          |
| `--border-input` on `--bg-surface-raised` | dark        | 14.6      | accepted | Dark field outline inside a raised panel, target Lc 15: kept as is (owner decision 2026-11-16).                                                                                                                                                       |

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

## Correct

```html
<div class="bg-(--bg-surface) text-(--text-default) p-(--spacing-md) rounded-(--shape-card)">
  ...
</div>
```

## Wrong

```html
<div class="bg-[#161616] text-white p-[13px] m-[0px] rounded-md">...</div>
```

The full token catalog is generated by `@aziontech/theme`. If you need a color that has no token, that is a design-system gap — raise it, do not inline a hex.
