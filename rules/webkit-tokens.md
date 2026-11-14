# Rule: colors, spacing, and typography come from @aziontech/theme

The design system ships tokens. Use them. Never hardcode a raw color or an off-scale value.

## Do

- Use CSS variables from `@aziontech/theme` for color: `var(--primary)`, `var(--bg-surface)`, `var(--text-default)`, `var(--border-default)`, and the other semantic tokens.
- Use the theme's semantic spacing and radius tokens: `var(--spacing-xs)`, `var(--spacing-md)` (scale `xxs…xxl`), `var(--shape-button)`.
- Use the generated typography classes / tokens for text (`text-button-lg`, and the other named type scales), not raw font sizes.
- Import the theme once, near your app entry: `import '@aziontech/theme'` (and `import '@aziontech/icons'` for icons).

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

| Job                                                 | Tokens                                                                        | Used by                                                                                                                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main action                                         | `--primary`, `--primary-contrast`                                             | `Button kind="primary"`, `Checkbox` checked, `Progress` fill, `Tag severity="primary"`, `StatusIndicator severity="alt"`                                                                          |
| Second action                                       | `--secondary`, `--secondary-contrast`                                         | `Button kind="secondary"`, `IconButton`, `Badge severity="secondary"`                                                                                                                             |
| Brand text and tint                                 | `--text-primary`, `--primary-mask`, `--primary-selected`                      | `Overline` text, the required asterisk in `Label` and `FieldLabel`, `Tag severity="highlight"`, `RadioCards` selected card                                                                        |
| Accent: a live state or connection, never an action | `--accent`, `--accent-contrast`                                               | `Switch` on, `Slider` fill, `Tag severity="accent"`, the `Overline` cursor, resize handles in `Sidebar` and `Resizable`, a dragged `Table` row, `Flow` and `TopologyDiagram` edges and ports      |
| Selected item                                       | `--bg-selected`, `--border-selected`                                          | selected rows and options in `Table`, `MenuItem`, `DropdownMenu`, `ToggleGroup`, `Select`, `Combobox`, `Trace`; `RadioCards` and `Chip` borders                                                   |
| Selected tab                                        | `--secondary-mask`                                                            | the sliding indicator in `Tabs`                                                                                                                                                                   |
| Hover and press                                     | `--bg-hover`, `--bg-active`, `--bg-mask`                                      | every interactive component (`--bg-mask` is the hover layer on `Button kind="outlined"` and `kind="transparent"`)                                                                                 |
| Surfaces                                            | `--bg-canvas`, `--bg-surface`, `--bg-surface-raised`                          | page, cards and panels, `Avatar`, striped `Table` rows                                                                                                                                            |
| Inverted surface                                    | `--bg-contrast`, `--text-contrast`                                            | `Tooltip`, `Tag severity="contrast"`                                                                                                                                                              |
| Behind a modal                                      | `--bg-backdrop`                                                               | `Dialog`, `Drawer`                                                                                                                                                                                |
| Status message                                      | `--success`, `--warning`, `--danger`, `--info` with `-border` and `-contrast` | `Alert`, `Tag`, `Badge`, `Trace` spans, `Button kind="danger"`. The fill is the box, `-border` its edge, `-contrast` its icon or text. A status dot is the `-contrast` color (`StatusIndicator`). |
| Severity                                            | `--severity-critical`, `-high`, `-medium`, `-low`                             | the bars of `SeverityTag` only                                                                                                                                                                    |
| Links                                               | `--text-link`, `--text-link-hover`                                            | `Button kind="link"`, links in text                                                                                                                                                               |
| Charts                                              | `--chart-*`                                                                   | the chart components; series, status and severity colors are not interchangeable                                                                                                                  |

Defined but not used by any component yet: `--accent-mask`, `--accent-selected`,
`--bg-surface-overlay`, `--severity-info`. Do not build on them until a component does.

## Use a variant only when the component has it

A token pair is not a variant. `--accent` and `--accent-contrast` exist, but `Button` has no accent
kind, so there is no accent button: an "Upgrade" or "New" call to action is `Button kind="primary"`
or `kind="secondary"`. Before you draw or build a variant, check that the component lists it in its
`kind` or `severity` union in `catalog.json` (or the MCP `get_component`). If it is not there, use
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
