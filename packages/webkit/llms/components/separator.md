# Separator

> Thin separator line that visually splits content into groups. Renders as a full-width hairline (`horizontal`) or full-height hairline (`vertical`), and can carry centered content (an "Or"-style label) when the default slot or `label` prop is set. Unlike `ScrollArea` it adds no scrolling behaviour; it is a purely decorative-yet-semantic boundary exposing `role="separator"`.

- Import: `import Separator from '@aziontech/webkit/separator'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [separator.json](https://github.com/aziontech/webkit/blob/main/.specs/separator.json)

## When to use

- Separate groups of content inside a card, form, panel or menu.
- An "Or" break between two alternative paths (social sign-in and email) with `label`.
- A vertical rule between inline items in a toolbar or meta line.

## Do

- Size a vertical divider through its wrapper (`flex h-4 items-center`); its own `h-full` beats a height class passed to it, and in an `items-center` row it collapses to zero height.
- Keep `label` to a word or two; the default slot replaces it when you need inline markup.
- Use it to separate groups, not to add spacing; it renders `role="separator"` with `aria-orientation`.

## Don’t

- The break between two page sections → use `section-gap`.
- A bounded region that scrolls → use `scroll-area`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-gap](section-gap.md) — the frame that divides page sections, with its own rules and vertical air.
- [scroll-area](scroll-area.md) — scrolling container; Separator adds no scrolling.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | false | Layout axis of the separator line. |
| `label` | `string` | `''` | false | Fallback centered text shown when the default slot is empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Centered content; overrides `label` when provided. |

## States

- Visual states: `default`
- `data-orientation` mirrors the `orientation` prop: `horizontal` | `vertical`

## Accessibility

- Visible focus: not applicable — the separator is non-interactive and not in the tab order.
- Keyboard map: not applicable — no interactive controls.
- ARIA: root carries `role="separator"` and `aria-orientation="{orientation}"`. A labelled divider keeps the `separator` role and is named by its label through `aria-labelledby` (a separator's children are presentational, so the text alone would not reach assistive technology).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state — the muted label text meets the body-text ratio against canvas/surface.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states — not applicable; the component declares no motion.
- Touch target ≥40×40 px — not applicable; the component is non-interactive.

## Examples

### Default

```vue
<script setup>
  import Separator from '@aziontech/webkit/separator'
</script>

<template>
  <Separator orientation="horizontal" />
</template>
```

### WithLabel

```vue
<script setup>
  import Separator from '@aziontech/webkit/separator'
</script>

<template>
  <Separator
    orientation="horizontal"
    label="OR"
  />
</template>
```

### Orientations

```vue
<script setup>
  import Separator from '@aziontech/webkit/separator'
</script>

<template>
  <div class="flex items-center gap-8">
    <div class="w-[160px]">
      <Separator orientation="horizontal" />
    </div>
    <div class="flex items-center justify-center h-[80px]">
      <Separator orientation="vertical" />
    </div>
  </div>
</template>
```
