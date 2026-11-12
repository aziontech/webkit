# Carousel

> A horizontally scrollable track of cards with snap points and a pair of step controls. It is built on native scrolling and CSS scroll snap rather than a carousel runtime, so it is draggable, swipeable and keyboard-scrollable by default, and it never moves on its own. The unit is Carousel, then a `Carousel.Item` card, then its content — usually a `quote` or a `topic`. Two layouts, set on the root with `kind`: `strip` (the default) sets the cards edge to edge with no gutter — each draws its own hairline and the next one overlaps it by a pixel, so the row reads as one ruled strip; `cards` separates them with a gutter and rounds each one, so the row reads as a set of standalone cards. Each card takes its width from its own `size`, never from a class. The track fades at whichever end still has cards past it. An optional `header` slot shares the row the step controls sit in: the band's title goes at the start and the controls move to the end, so a titled carousel needs no hand-built row around it.

- Import: `import CarouselRoot from '@aziontech/webkit/carousel-root'`
- Compound import (dot notation, not tree-shakeable): `import Carousel from '@aziontech/webkit/carousel'`
- Category: marketing · Surface: marketing · Structure: composition
- API as JSON: [carousel.json](https://github.com/aziontech/webkit/blob/main/.specs/carousel.json)

## When to use

- When a set of cards, quotes, logos or figures is longer than the row it sits in and the reader chooses how far to go.
- For a peek-and-swipe row on narrow screens where a grid would stack into a very long column.
- Whenever the content is browsable rather than essential — a reader must never have to scroll a carousel to reach something they need.

## Do

- Never put essential content in a carousel. A slide past the first is content a reader may never see.
- Size the cards with `size` on `Carousel.Item` (`small` `var(--container-2xs)`, `medium` `var(--container-sm)`, `large` `var(--container-md)`; each capped at 85% of the viewport on phones). Never put width classes on the item: they fight its own width and the `no-style-override` lint rejects them.
- Put content straight into `Carousel.Item`, not inside another framed box. The item is already the card (border, surface, padding), and a second frame inside it draws two rules.
- Pick the layout with `kind`: `strip` for a ruled row of quotes or figures that reads as one surface, `cards` for standalone cards with a gutter (use-case cards, articles). Never add margins to the items to fake a gutter.
- Put the band's title in the `header` slot when the controls belong on the title row; the controls then sit at the row's end. For a whole titled band of overline/title/text cards use the `card-carousel` section instead of composing one.
- Keep a partial slide visible at the trailing edge on narrow screens; a peek is what tells a reader the track scrolls at all.
- The track is dragged with the pointer as well as scrolled. A mouse gets a grab cursor and drags the row directly; touch and pen keep native scrolling and its momentum, which is already better than anything a handler would impose.
- Always name the carousel with `ariaLabel`. "Customer stories" tells a screen-reader user what they are about to scroll through; an unnamed scroll region does not.
- The track never advances on its own, and it must not be made to. Auto-advancing content needs a pause control under WCAG 2.2.2 and steals reading time from everyone.

## Don’t

- For content the reader must see → lay it out as a grid; anything past the first slide can be missed.
- For a vertical list → use `item` with `ItemGroup`.
- For a framed grid of unequal cells → use `bento-grid`.
- For a set of figures that fits the row → use `big-numbers` or `logo-wall`, which wrap instead of scrolling.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the framed grid, when everything should be visible at once.
- [logo-wall](logo-wall.md) — a wrapping grid of marks; reach for the carousel only when the wall is too long.
- [topic](topic.md) — the usual slide content.
- [scroll-area](scroll-area.md) — the console's styled scroll container; this one owns snap points and step controls.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the scrollable track, announced before its contents. |
| `kind` | `CarouselKind` | `'strip'` | false | Layout of the row: `strip` sets the cards edge to edge as one ruled strip, `cards` separates them with a gutter and rounds each card. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The slides, composed as `Carousel.Item` elements in reading order. |
| `controls` | — | The step controls, composed as `Carousel.Previous` and `Carousel.Next`; rendered above the track, at the row's end when a header is set. |
| `header` | — | Content at the start of the controls row, usually the band's title; the controls move to the row's end. |

## Sub-component imports

- `@aziontech/webkit/carousel-item`
- `@aziontech/webkit/carousel-previous`
- `@aziontech/webkit/carousel-next`

## Sub-components

- `carousel-item/carousel-item.vue` — one card; a bordered, padded surface that is a snap point in the track, does not shrink and stretches its content to the row's tallest card. Prop `size?: CarouselItemSize` (`'small' | 'medium' | 'large'`, default `'medium'`) sets its width: `small` `var(--container-2xs)`, `medium` `var(--container-sm)`, `large` `var(--container-md)`, each at most 85% of the viewport below `sm`; carried as `data-size`. It reads the root's `kind` from the carousel context and carries it as `data-kind`: under `cards` it rounds its corners (`var(--shape-card)`) and drops the one-pixel overlap. `CarouselItemSize` is an exported type.
- `carousel-previous/carousel-previous.vue` — context-aware control that steps the track back; disables itself at the start.
- `carousel-next/carousel-next.vue` — context-aware control that steps the track forward; disables itself at the end.

## States

- Visual states: `default`, plus `hover` / `focus-visible` / `disabled` on each step control
- `data-kind` (`strip` | `cards`) is on the root, the track and every item; under `cards` the track gaps its items by `var(--spacing-md)` and each item is rounded
- The row above the track renders only when `header` or `controls` is filled; with a header it spreads the header to the start and the controls to the end, without one the controls sit at the start
- `data-scrollable` is present on the root while the track overflows its row; a track that fits renders no controls to press
- `data-can-scroll-prev` / `data-can-scroll-next` are on the root and the track while the track has content past its start / end edge. The track fades only the edge that continues, over 12% of its own width, so the row at rest fades on the right alone
- The fade stands down while the track has keyboard focus, so the focus ring it would otherwise mask is fully visible
- The track carries `data-scrollable` too, which is what gives it the grab cursor; a track that fits shows the ordinary pointer, because there is nothing to drag
- `data-dragging` is on the track for the length of a mouse drag: the cursor closes, snapping and smooth scrolling stand down so the row tracks the pointer exactly, and text selection is suppressed
- A drag that travels more than a few pixels swallows the click it ends on, so releasing over a link inside a slide does not follow it
- Each control carries `disabled` at its end of the track, so a reader is never offered a step that does nothing
- The track is focusable and shows the focus ring, because a scrollable region must be reachable by keyboard

## Accessibility

- Visible focus: the track and both controls carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` reaches the controls and the track itself; with the track focused the arrow keys scroll it natively, and `Enter` / `Space` on a control steps one slide. No custom key handler replaces native scrolling. Pointer dragging is an addition for mice, never the only way to move the track — the keyboard, the wheel, touch and the step controls all still reach every slide.
- ARIA: the root is a `<section>` with `aria-roledescription="carousel"` named by `ariaLabel`; the track is a `<ul>` of `<li>` slides carrying `tabindex="0"` so the scrollable region is keyboard-reachable (WCAG 2.1.1); each control is a real `<button>` with its own `ariaLabel` and the native `disabled` state at its end of the track.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the control glyph is `var(--text-muted)` on `var(--bg-surface)` and darkens to `var(--text-default)` on hover; slide content carries its own colours.
- `motion-reduce:scroll-auto` on the track and `motion-reduce:transition-none` on the controls. The track never auto-advances, so WCAG 2.2.2 (pause, stop, hide) does not apply by construction.
- Touch target ≥40×40 px — each step control is a 40×40 button.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next chevrons mirror (`rtl:-scale-x-100`).
- Keyboard and buttons: next scrolls toward the end edge; the scroll sign is inverted under `dir="rtl"` (`useDirection(track)`), and progress reads `Math.abs(scrollLeft)` because `scrollLeft` is zero or negative under `rtl`.
- Edge fades: the start/end masks follow the reading direction.
- User data: none.

## Internationalization

- Built-in strings: the root's `aria-roledescription` and the two controls' default names come from the `carousel` locale group (en, pt-BR, es). Slide content arrives through slots in the page's language.

## Responsive

- The track scrolls at every width; below `sm` every item size is capped at 85% of the viewport, so one card fills a phone with the next one peeking.
- The header row keeps the controls on the same line as the header at every width; a long header wraps inside its own cell.

## Examples

### Default

```vue
<script setup>
  import Carousel from '@aziontech/webkit/carousel'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Carousel aria-label="Customer testimonials">
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item size="large">
      <Quote
        text="With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market."
        name="Fabio Ramos"
        job-title="CEO, Axur"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes."
        name="Vitor Torres"
        job-title="CEO, Contabilizei"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
        name="Allan Monteiro"
        job-title="CISO & Head of Technology, Magalu"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers."
        name="Julian H"
        job-title="IT OPS, SRE & SEC Manager, Dafiti"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five."
        name="Renata Alves"
        job-title="Head of Information Security, Netshoes"
      />
    </Carousel.Item>
  </Carousel>
</template>
```

### Peek

```vue
<script setup>
  import Carousel from '@aziontech/webkit/carousel'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Carousel aria-label="Customer testimonials">
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item size="small">
      <Quote
        text="With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market."
        name="Fabio Ramos"
        job-title="CEO, Axur"
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes."
        name="Vitor Torres"
        job-title="CEO, Contabilizei"
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
        name="Allan Monteiro"
        job-title="CISO & Head of Technology, Magalu"
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers."
        name="Julian H"
        job-title="IT OPS, SRE & SEC Manager, Dafiti"
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five."
        name="Renata Alves"
        job-title="Head of Information Security, Netshoes"
      />
    </Carousel.Item>
  </Carousel>
</template>
```

### Titled cards

```vue
<script setup>
  import Carousel from '@aziontech/webkit/carousel'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <Carousel
    kind="cards"
    aria-label="Ways to use Image Processor"
  >
    <template #header>
      <SectionTitle
        kind="left"
        size="small"
        :framed="false"
        title="See how to use"
      />
    </template>
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item>
      <Topic
        title="E-commerce product image optimization"
        description="Serve product images at the right size and format for each device, so pages load faster and convert better."
        :heading-level="3"
      />
    </Carousel.Item>
    <Carousel.Item>
      <Topic
        title="News and media site responsive images"
        description="Deliver article images that load instantly on any device, with the format chosen for each browser."
        :heading-level="3"
      />
    </Carousel.Item>
    <Carousel.Item>
      <Topic
        title="User-generated content optimization"
        description="Resize and compress uploaded images on the fly from your storage, with no preprocessing step."
        :heading-level="3"
      />
    </Carousel.Item>
    <Carousel.Item>
      <Topic
        title="Marketplace listing thumbnails"
        description="Crop every seller's photo to the same frame and quality, whatever size it was uploaded at."
        :heading-level="3"
      />
    </Carousel.Item>
  </Carousel>
</template>
```
