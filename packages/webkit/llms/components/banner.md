# Banner

> A split promotional band: the announcement and its actions in the wide leading column, a short supporting note on a raised surface in the narrow trailing one. It is the page's one loud interruption between sections — wider and more assertive than `call-to-action`, which is a single-column closing ask.

- Import: `import Banner from '@aziontech/webkit/banner'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [banner.json](https://github.com/aziontech/webkit/blob/main/.specs/banner.json)

## When to use

- To announce a launch, programme or offer part-way down a marketing page.
- Whenever an announcement needs both a primary action and a short piece of supporting context beside it.
- Once per page. A second banner turns the first into furniture.

## Do

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.
- Put the announcement in `title` and keep the trailing column to one supporting sentence — it is context, not a second pitch.
- Lead with one primary action in the `actions` slot; the band's whole job is that one target.
- Use `eyebrow` to name the programme the banner belongs to, so the band reads in context when a reader lands mid-page.
- Keep the trailing note short enough not to set the band's height; it sits beside the announcement, not under it.

## Don’t

- For the closing ask at the end of a page or section → use `call-to-action`, a single-column panel.
- For the page's leading statement → use `hero`, whose `Hero.Title` owns the `h1`.
- For a dismissible or status-bearing notice inside the product → use `message`.
- For a feature tile in a grid → use `topic` in a `card-grid`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [call-to-action](call-to-action.md) — the single-column closing ask; this is the wider mid-page announcement.
- [hero](hero.md) — the page's leading band; its `Hero.Title` owns the page's statement and `h1`.
- message` — the in-product notice, which can be dismissed and carries severity.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The announcement, rendered as the band's `h2` in the leading column. |
| `description` | `string` | `''` | false | Supporting note set on the raised trailing column; overridden by the `aside` slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline naming the programme, above the announcement. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | — | The controls the band exists to offer, under the announcement. |
| `aside` | — | Trailing column content; replaces the `description` prop when provided. |

## States

- Visual states: `default`
- The band holds no state of its own; controls composed into `actions` keep theirs
- Below `md` the two columns stack, announcement first, so reading order matches visual order

## Accessibility

- Visible focus: not applicable to the band itself; controls composed into `actions` keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the announcement is a real `h2` rendered by the composed `section-title`, and the band is a `<section>` named by its `title`, so it is reachable as a named landmark; no `role` is added.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the announcement is `var(--text-default)` on `var(--bg-surface)`; the trailing note uses `var(--text-muted)` on `var(--bg-surface-raised)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target ≥40×40 px — the `actions` row stretches its children to full width below `md`, so slotted buttons keep their own target size.

## Examples

### Default

```vue
<script setup>
  import Banner from '@aziontech/webkit/banner'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Banner
    eyebrow="Edge Runtime"
    title="WebAssembly now runs in every edge location."
    description="Ship the same binary everywhere — no regions to pick and no cold starts to budget for."
  >
    <template #actions>
      <Button label="Read the announcement" />
    </template>
  </Banner>
</template>
```

### WithAside

```vue
<script setup>
  import Banner from '@aziontech/webkit/banner'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Banner
    eyebrow="Edge Runtime"
    title="WebAssembly now runs in every edge location."
  >
    <template #actions>
      <Button label="Read the announcement" />
    </template>
    <template #aside>
      Rolling out to every account through October —
      <a
        class="text-link"
        href="/changelog/webassembly-rollout"
        >the rollout schedule</a
      >
      lists the date each region switches over.
    </template>
  </Banner>
</template>
```
