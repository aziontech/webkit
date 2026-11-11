# Sticky Carousel

> A row of numbered dark cards that pins under the site header while the page scrolls and slides the row sideways until its last card is in view, then lets the page continue. Below the large breakpoint, or under reduced motion, it is a plain snap-scrolling row. From the design sample's site `StickyCarousel`.

- Import: `import StickyCarousel from '@aziontech/webkit/sticky-carousel'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [sticky-carousel.json](https://github.com/aziontech/webkit/blob/main/.specs/sticky-carousel.json)

## When to use

- Five to eight short points that read best one after another (principles, reasons).

## Do

- Keep each card to a heading and two lines.
- Do not nest it inside a container that clips overflow; sticky positioning needs the page scroll.

## Don’t

- For three to five ordered stages that fit the width — use `ProcessScroll`.
- For content the reader must compare side by side.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- ProcessScroll` — the same cards without pinning.
- StickyStack`, `FeatureScroll` — other scroll-driven bands.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Overline above the title. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Paragraph beside the headline. |
| `items` | `StickyCarouselItem[]` | `[]` | false | The cards, in order; each is `{ title, description }` and is numbered by its position. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card row; defaults to the title. |
| `headerOffset` | `string` | `'3.5rem'` | false | Height of the sticky site header the band pins under, from the large breakpoint up; any CSS length. |

## States

- Renders nothing without a title or items.
- Pinned (large, motion allowed): the runway grows by the row overflow and the row translates with the scroll.
- Not pinned: a snap-scrolling row.

## Accessibility

- The band root is a plain container; the row is the one focusable `region`, named by `ariaLabel` or the title.
- Cards are an ordered list; the number is `aria-hidden`.
- Keyboard: when pinned, focus moving into a card scrolls the page, and the row follows the page scroll.

## Right-to-left

- Layout: logical utilities; the pinned row slides toward the inline start in both directions.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Responsive

- Pins only from the large breakpoint up.
- Below large: cards `min(22rem, 80vw)` with snap.

## Examples

### Default

```vue
<script setup>
  import StickyCarousel from '@aziontech/webkit/sticky-carousel'

  const items = [
    { title: 'One platform', description: 'Code, data and security deploy together.' },
    { title: 'No regions', description: 'Everything runs everywhere by default.' },
    { title: 'No cold starts', description: 'Isolates start in under a millisecond.' },
    { title: 'Open standards', description: 'Web APIs, so code moves in and out freely.' },
    { title: 'Predictable bills', description: 'Pay for requests, not for idle servers.' },
    { title: 'Support that answers', description: 'Engineers on call, not ticket queues.' }
  ]
</script>

<template>
  <StickyCarousel
    eyebrow="Why teams move"
    title="Six reasons teams run on one platform"
    description="Scroll the page: the row pins under the header and slides until the last card is in view."
    :items="items"
  />
</template>
```
