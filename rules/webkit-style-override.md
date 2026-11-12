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

## Do

- Compose your own markup **inside the component's slots** — your elements, your classes:
  the component's own surface stays untouched.
- Use a component that is **built to be personalized** (`styleSeam` in the catalog, e.g.
  `FrameBox`, `SectionContainer`) when a container must accept your classes.
- Size or align the component in its parent with the layout utilities above
  (`<Button class="w-full" />`, `<Card class="w-full max-w-(--container-sm)" />`).
- Change behavior/appearance through the component's **props** (`kind`, `size`, `severity`).
- If no prop or slot covers a legitimate need, request the variant in the design system —
  do not patch it locally.

## Do not

- Never `<Button class="p-8" />` or `<Button :class="cls" />` — blocked by lint.
- Never mix a layout utility with anything else (`<Button class="w-full mt-4" />`): put the
  spacing on a wrapper element.
- Never `<Dialog style="width: 800px" />` — same.
- Never wrap a webkit component in a styled element just to force different spacing/colors
  through inheritance or CSS descendant selectors targeting its internals.
- Never `!important` against a webkit class, and never target its `data-testid`/internal
  markup from your stylesheets.

## Correct

<!-- prettier-ignore -->
```html
<!-- compose around it: your markup, your classes; the text goes through its props -->
<div class="flex items-center gap-(--spacing-xs)">
  <Button kind="primary" label="Create account" @click="submit" />
</div>

<!-- layout utilities only: fill the column, cap the width; content in a named slot -->
<Card class="w-full max-w-(--container-sm)">
  <template #content>…</template>
</Card>

<!-- a styleSeam component accepts consumer classes by design -->
<FrameBox class="bg-(--bg-canvas)">…</FrameBox>
```

## Wrong

<!-- prettier-ignore -->
```html
<Button class="p-8 bg-[#0a0a0a]" @click="submit">Create account</Button>
<Dialog :style="{ width: '800px' }" />
```
