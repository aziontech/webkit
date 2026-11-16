# Rule: never restyle a webkit component with class/style

The design system owns each component's appearance. Putting `class`, `:class`, `style`, or
`:style` on a webkit component tag overrides its tokens, breaks light/dark theming, and
makes upgrades unpredictable. The `webkit/no-style-override` ESLint rule blocks it as an
**error** — this rule is why, and what to do instead.

## The one exception: layout utilities

A **static** `class` made only of layout utilities is allowed, because they set how the
component's box sits in its parent (outer size and flex participation) and never change how it
looks. The full list: `w-full`, `h-full`, `max-w-*`, `min-w-*`, `max-h-*`, `min-h-*`, `flex-1`, `flex-auto`, `flex-initial`, `flex-none`, `grow`, `grow-*`, `basis-*`, `self-*`, `shrink-0`.

| Purpose             | Families                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Fill the parent     | `w-full`, `h-full`                                                                          |
| Cap or floor a size | `max-w-*`, `min-w-*`, `max-h-*`, `min-h-*` (`max-w-(--container-sm)`)                       |
| Take part in a flex | `flex-1`, `flex-auto`, `flex-initial`, `flex-none`, `grow`, `grow-*`, `basis-*`, `shrink-0` |
| Align itself        | `self-*` (`self-start`, `self-center`)                                                      |

Any other class on the same tag still fails, and so does a bound `:class` or a variant prefix
(`lg:w-full`). The list is the `LAYOUT_CLASS_FAMILIES` export of
`@aziontech/webkit/eslint-plugin`; the MCP's `get_component` (`allowedClasses`) and
`validate_usage` (with `component`) read the same list.

## The second exception: the chart palette variables

A dashboard may re-colour its charts by setting the **chart palette variables** on a container,
including a webkit tag (`DashboardGrid`, `ChartCard`, a page component): the charts inside read them
by inheritance. This is how the console API offers palettes other than the default. Exactly these
variables are allowed, nothing else on the same attribute:

- `--chart-series-1` … `--chart-series-8`
- `--chart-sequential-1` … `--chart-sequential-7`
- `--chart-diverging-negative`, `--chart-diverging-neutral`, `--chart-diverging-positive`

Write them as a static `style` (`style="--chart-series-1: var(--palette-1)"`), an object-literal
`:style` whose keys are all palette variables (`:style="{ '--chart-series-1': palette[0] }"`), or
`[--chart-series-1:…]` classes beside the layout utilities. A bound `:style="palette"` or a spread
cannot be checked and stays blocked: spell the keys out, or set the variables on your own wrapper
element (never checked). `--chart-series-other`, `--chart-status-*`, the severity, grid, axis, label,
crosshair and tooltip variables are fixed: they mean a state or draw the chart's chrome. The list is
the `CHART_PALETTE_VARIABLES` export of `@aziontech/webkit/eslint-plugin`; the full palette contract
is in `webkit-tokens.md` § "Chart palettes".

## Do

- Compose your own markup **inside the component's slots** — your elements, your classes:
  the component's own surface stays untouched.
- Use a component that is **built to be personalized** (`styleSeam` in the catalog, e.g.
  `RegistrationFrame`, `SectionContainer`) when a container must accept your classes.
- Size or align the component in its parent with the layout utilities above
  (`<Button class="w-full" />`, `<Card class="w-full max-w-(--container-sm)" />`).
- Change behavior/appearance through the component's **props** (`variant`, `size`, `severity`).
- If no prop or slot covers a legitimate need, request the variant in the design system —
  do not patch it locally.

## Do not

- Never `<Button class="p-8" />` or `<Button :class="cls" />` — blocked by lint.
- Never mix a layout utility with anything else (`<Button class="w-full mt-4" />`): put the
  spacing on a wrapper element.
- Never `<Dialog style="width: 800px" />` — same.
- Never set a `--chart-*` variable outside the palette list on a webkit tag (`--chart-status-danger`,
  `--chart-axis`): status and chrome colours are fixed.
- Never wrap a webkit component in a styled element just to force different spacing/colors
  through inheritance or CSS descendant selectors targeting its internals.
- Never `!important` against a webkit class, and never target its `data-testid`/internal
  markup from your stylesheets.

## Correct

<!-- prettier-ignore -->
```html
<!-- compose around it: your markup, your classes; the text goes through its props -->
<div class="flex items-center gap-(--spacing-xs)">
  <Button variant="primary" label="Create account" @click="submit" />
</div>

<!-- layout utilities only: fill the column, cap the width; content in the default slot -->
<Card class="w-full max-w-(--container-sm)">
  …
</Card>

<!-- a styleSeam component accepts consumer classes by design -->
<RegistrationFrame class="bg-(--bg-canvas)">…</RegistrationFrame>
```

## Wrong

<!-- prettier-ignore -->
```html
<Button class="p-8 bg-[#0a0a0a]" @click="submit">Create account</Button>
<Dialog :style="{ width: '800px' }" />
```
