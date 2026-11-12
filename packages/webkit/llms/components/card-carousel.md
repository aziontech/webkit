# Card Carousel

> The titled card-carousel band of a product or solution page: a section title on the start of the row with the previous/next controls at its end, over a horizontally scrolling track of standalone cards. Each card is an optional overline (the category), a heading, a sentence and, when it links somewhere, a mono link label closed by an arrow ("See example", "See solution"). The band answers "see how to use", "industries", "orchestration with control" on azion.com product pages, where the cases outnumber the row. It is a page section — the site places it from a `{ _id: 'card-carousel', props }` entry and binds `props` straight onto it — so its whole API is the props below. It composes `carousel` (`kind="cards"`, its `header` slot, `size="medium"` items and its step controls), `section-title` and `overline`, and owns only the card's inner layout.

- Import: `import CardCarousel from '@aziontech/webkit/card-carousel'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [card-carousel.json](https://github.com/aziontech/webkit/blob/main/.specs/card-carousel.json)

## When to use

- Four or more cases, industries or examples of equal weight that do not all need to be seen: the reader steps through them.
- When each case is a short card (overline, heading, one or two sentences) that may link to its own page or example.

## Do

- Give the band a `title`; its arrows sit on the title row, and the title names the row for assistive technology.
- Keep each card to a heading and one or two sentences, so the row height stays even.
- Use `eyebrow` on every card or on none; a row where some cards carry an overline reads as ragged.
- Give every card a `linkLabel` when every card has an `href`, and none when none does. The label is a visual cue; the card heading is the link.
- Pass as many cards as the content has; the track scrolls, so the count never has to fill the row.

## Don’t

- When every case must be visible, or there are three or six of equal weight → use `use-case-links` (linked grid) or `use-cases` (grid with one action).
- For a quote or testimonial row → use `quote-carousel` or `client-quotes`.
- For numbered principles pinned while the page scrolls → use `sticky-carousel`.
- For articles with images → use `article-cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [carousel](carousel.md) — the primitive this band composes; reach for it directly only for a non-card row.
- [use-case-links](use-case-links.md) — the same content as a static, fully visible grid.
- [sticky-carousel](sticky-carousel.md) — numbered dark cards pinned on scroll.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Overline above the band title. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` at the start of the row the step controls end; the band renders no title when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `CardCarouselItem[]` | `[]` | false | The cards, in order; each is `{ eyebrow?, title, description, href?, linkLabel? }`, and a card with `href` links to it. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card row; defaults to the title. |

## States

- Visual states: `default`; each linked card has `hover` (the arrow nudges toward the end edge, the label brightens) and `focus-visible` (an inset ring on the whole card).
- Empty: with no `items` the band renders nothing — no title, no controls.
- Untitled: with no `title` the controls sit alone at the start of the row (the carousel's own layout) and the row is named by `ariaLabel` only.
- Unlinked card: without `href` the card is a plain card with no hover state and no link label.
- The step controls carry `disabled` at each end of the track, from the carousel; a row that fits shows both disabled.
- `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`: the band cannot be in these states; it renders static content from props.

## Accessibility

- Pattern: the WAI-ARIA APG carousel (`aria-roledescription="carousel"`, named region) from `carousel`; the band root is a plain container so the row is the one named region, named by `ariaLabel` or the title.
- Outline: the title is the section title's `h2`; each card heading is an `h3`.
- Links: on a linked card the `h3` holds the anchor, so the link's name is the card title; a stretched `::after` makes the whole card its hit area. The link label and its arrow are `aria-hidden` decoration.
- Keyboard map: `Tab` reaches the previous control, the next control, the track (arrow keys scroll it natively) and each card link in order; `Enter` / `Space` on a control steps one card; `Enter` on a card link follows it. A card that scrolls into focus is brought into view by the browser.
- Visible focus: card links draw `focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)` around the whole card; the controls and track carry the carousel's ring.
- Contrast ≥4.5:1: copy is `var(--text-muted)` on `var(--bg-surface)`; the link label is `var(--text-muted)` at rest; the arrow is `var(--text-primary)` (≥3:1 as a graphic).
- `motion-reduce:transition-none` on every transition; the track never auto-advances (WCAG 2.2.2 does not apply).
- Touch target ≥40×40 px: the controls are 40×40; a card link spans its whole card.

## Right-to-left

- Layout: logical utilities only; the title row keeps the title at the start edge and the controls at the end edge.
- Icons: the link arrow (`pi pi-arrow-right`) mirrors under `rtl:-scale-x-100` and its hover nudge runs toward the end edge (`rtl:group-hover/card:-translate-x-0.5`); the carousel's chevrons mirror in `carousel`.
- Keyboard: the next control steps toward the end edge in both directions (`carousel`).
- User data: none.

## Internationalization

- No built-in strings: every visible string is marketing copy and arrives through props in the page's language. The control names and the `carousel` role description come from `carousel`'s own locale group (en, pt-BR, es).
- Formatting: none.

## Responsive

- Container queries: none; the cards have a fixed width (`size="medium"`, `var(--container-sm)`) and the track scrolls.
- Narrow (≤ 640 px): each card is 85% of the viewport wide, so one card fills a phone and the next peeks; the title wraps inside its cell while the controls stay on its row.
- Touch: the track swipes natively; the hover nudge is decoration only, and every card stays a full-card link on touch.
- Reflow: the page never scrolls sideways at 320 px; only the track does, which is the component's purpose (WCAG 1.4.10 exception for a carousel).

## Examples

### Default

```vue
<script setup>
  import CardCarousel from '@aziontech/webkit/card-carousel'

  const items = [
    {
      eyebrow: 'E-commerce',
      title: 'E-commerce product image optimization',
      description:
        'Optimize product images for faster page loads and better conversion rates. Automatically deliver responsive images at the right size and format for each device.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'Media',
      title: 'News and media site responsive images',
      description:
        'Deliver optimized images for news articles and media content that load instantly on any device. Automatic format conversion ensures the best experience.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'UGC',
      title: 'User-generated content optimization',
      description:
        'Optimize user-uploaded images on-the-fly from your storage. Apply consistent sizing, quality, and format standards without preprocessing.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'Marketplace',
      title: 'Marketplace listing thumbnails',
      description:
        'Crop and compress every seller photo to the same frame and quality, whatever size it was uploaded at.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'SaaS',
      title: 'Avatars and workspace logos',
      description:
        'Resize profile pictures and logos for every place your product shows them, from one original in your bucket.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'Travel',
      title: 'Destination galleries',
      description:
        'Serve large hotel and destination photos as WebP or AVIF, so galleries stay sharp without slowing the booking flow.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    }
  ]
</script>

<template>
  <CardCarousel
    title="See how to use"
    :items="items"
  />
</template>
```

### Plain cards

```vue
<script setup>
  import CardCarousel from '@aziontech/webkit/card-carousel'

  const items = [
    {
      title: 'E-commerce and retail platforms',
      description:
        'Handle peak shopping events and flash sales without downtime. Distribute traffic across multiple origins to keep checkout fast.'
    },
    {
      title: 'Media streaming and content delivery',
      description:
        'Deliver video and audio with low latency and high availability, balancing traffic across CDN origins and streaming servers.'
    },
    {
      title: 'Financial services and banking',
      description:
        'Keep transaction processing reliable with automated failover, distributing API traffic across multiple data centers.'
    },
    {
      title: 'SaaS and API platforms',
      description:
        'Spread tenant traffic across regions and origins, and route around an unhealthy origin before customers notice.'
    },
    {
      title: 'Gaming and interactive applications',
      description:
        'Hold sessions on the same origin with persistence, while the rest of the traffic scales out across healthy servers.'
    }
  ]
</script>

<template>
  <CardCarousel
    eyebrow="Industries"
    title="Optimize traffic distribution across industries"
    :items="items"
  />
</template>
```
