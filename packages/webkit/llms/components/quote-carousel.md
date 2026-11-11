# Quote Carousel

> A band of customer testimonials laid out as one scrollable row of flush cards. It is the wall form of `quote`: the same quotation, attribution and company mark, repeated across a track that snaps card by card and fades at both ends, so a page can carry more proof than the row is wide. The cards sit edge to edge with no gutter — each draws its own hairline and the next one's overlaps it, so the row reads as one ruled strip rather than a set of floating tiles. The fade at either end is what says the strip continues past the band's edge.

- Import: `import QuoteCarousel from '@aziontech/webkit/quote-carousel'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [quote-carousel.json](https://github.com/aziontech/webkit/blob/main/.specs/quote-carousel.json)

## When to use

- When a page has more testimonials than fit in one row and the reader chooses how far to go.
- As the proof band under a section headline, where a grid of quotes would run down the page instead of across it.
- When every quote carries equal weight — the track gives no card more room than its neighbours.
- For a row of analyst recognitions, where the source is a firm rather than a person: leave `name` out and the mark leads the card alone.

## Do

- Keep each `text` to one or two sentences. Cards in a track are read at a glance, and a paragraph turns a scannable strip into a wall.
- Give a person's quote a `name`. It is the attribution's lead and the source of the initials the card draws when there is no `photo`.
- Leave `name` out when the source is an institution — an analyst firm, a publication. The card then draws no likeness, the mark leads it, and `jobTitle` carries the report or article the claim comes from. Name the firm in that line as well, because the mark is decorative and a screen reader never reaches it.
- Name the company with `mark`, using a registry name rather than a URL, so the mark inherits the card's ink and reads on both themes. A name the registry does not carry is written as its own wordmark, which keeps the card complete while the artwork lands.
- Always pass `ariaLabel`. A scroll region with no name tells a screen-reader user nothing about what they are about to move through.
- Compose the headline above the band with `section-title`, unframed, so the band owns only the strip.
- Keep the band full width. The row is designed to run past the reader's view — inset it and the fade loses the thing it is signalling.
- The band is pure composition — Carousel, then `Carousel.Item`, then `quote` — so its flush ruled cards and end fades come from `carousel` and read the same as any other carousel on the page. It adds only the card width and the header row of likeness and mark.

## Don’t

- For a single testimonial → use `quote` directly; a track of one has nothing to scroll.
- For the one quotation a page features above the others → use `quote` in its `highlight` register.
- For a row of company marks with no quotation → use `ticker` (moving) or `logo-wall` (static).
- For a set of quotes the reader must read → lay them out as a `card-grid`; anything past the first card in a track can be missed.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [quote](quote.md) — the single testimonial this band repeats; the `inline` register is what each card draws.
- [carousel](carousel.md) — the scrollable track underneath, with the snap points, the step controls and the keyboard behaviour.
- [ticker](ticker.md) — the same clients without their words, moving on their own.
- [logo-wall](logo-wall.md) — the static wall of marks, when a quotation is not the point.
- [section-title](section-title.md) — the headline composed above the band; this component carries no heading of its own.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `QuoteCarouselItem[]` | `[]` | false | The testimonials rendered as cards, in order; each item is `{ text, name?, jobTitle?, photo?, mark? }` — the quotation, who said it, the rest of the attribution, their likeness and the registry name of the company's mark. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the scrollable row of testimonials, announced before its contents. |

## States

- Visual states: `default`, plus `focus-visible` on the track itself and `grab` / `grabbing` on the pointer while the row can be dragged
- A card with neither `name` nor `photo` draws no likeness, and its company mark leads the header row alone
- `data-scrollable` is present on the root while the track overflows its row; a band whose cards fit shows no fade and nothing to scroll. The end fades are `carousel`'s: each end fades only while there are cards past it, so the row at rest fades on the right alone
- An empty `items` renders the named track with no cards in it, so a band that is waiting on its data keeps its place and announces nothing
- The track is focusable and shows the focus ring, because a scrollable region must be reachable by keyboard

## Accessibility

- Visible focus: the track carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`, inherited from `carousel`.
- Keyboard map: `Tab` reaches the track; with it focused the arrow keys scroll it natively. The band adds no key handler of its own and replaces none.
- ARIA: the root is `carousel`'s `<section>` with `aria-roledescription="carousel"`, named by `ariaLabel`; each card is an `<li>` in the track holding one `<figure>` with its `<blockquote>` and `<figcaption>`. The likeness is decorative (`aria-hidden`), because the speaker is already named in the attribution, and the company mark is drawn `aria-hidden` with its name carried by the card's text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the quotation is `var(--text-default)` and the attribution `var(--text-muted)`, both on `var(--bg-surface)`; the mark is drawn in `var(--text-default)` so it inherits the card's ink on either theme.
- The band declares no animation, so there is nothing to suppress beyond `carousel`'s own `motion-reduce:scroll-auto`. The track never advances on its own, so WCAG 2.2.2 does not apply by construction.
- Touch target ≥40×40 px: the band exposes no control of its own; the track is dragged and swiped.

## Examples

### Default

```vue
<script setup>
  import QuoteCarousel from '@aziontech/webkit/quote-carousel'
  import SectionTitle from '@aziontech/webkit/section-title'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl) py-(--spacing-xxl)">
    <SectionTitle
      kind="left"
      :framed="false"
      title="Battle-Tested by the World's Largest Banks and E-commerce Companies"
    />
    <QuoteCarousel
      aria-label="Customer testimonials"
      :items="[
        {
          text: 'With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market.',
          name: 'Fabio Ramos',
          jobTitle: 'CEO',
          mark: 'axur'
        },
        {
          text: 'Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes.',
          name: 'Vitor Torres',
          jobTitle: 'CEO',
          mark: 'contabilizei'
        },
        {
          text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
          name: 'Allan Monteiro',
          jobTitle: 'CISO & Head of Technology',
          mark: 'magalu'
        },
        {
          text: 'One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers.',
          name: 'Julian H',
          jobTitle: 'IT OPS, SRE & SEC Manager',
          mark: 'dafiti'
        },
        {
          text: 'We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five.',
          name: 'Renata Alves',
          jobTitle: 'Head of Information Security',
          mark: 'netshoes'
        }
      ]"
    />
  </div>
</template>
```

### Fallback

```vue
<script setup>
  import QuoteCarousel from '@aziontech/webkit/quote-carousel'
</script>

<template>
  <QuoteCarousel
    aria-label="Customer testimonials"
    :items="[
      {
        text: 'Orders peak in the same forty minutes every night. Azion holds the edge steady through it, so our release window is no longer the riskiest hour of the day.',
        name: 'Camila Duarte',
        jobTitle: 'VP of Engineering',
        mark: 'iFood'
      },
      {
        text: 'Payments cannot wait on an origin round trip. Running the checks at the edge cut our approval latency in half and took a whole tier out of the stack.',
        name: 'Rafael Nunes',
        jobTitle: 'CTO',
        mark: 'Zoop'
      },
      {
        text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
        name: 'Allan Monteiro',
        jobTitle: 'CISO & Head of Technology',
        mark: 'magalu'
      }
    ]"
  />
</template>
```

### Recognitions

```vue
<script setup>
  import QuoteCarousel from '@aziontech/webkit/quote-carousel'
</script>

<template>
  <QuoteCarousel
    aria-label="Analyst recognitions"
    :items="[
      {
        text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
        jobTitle: 'GigaOm Radar for Full-Stack Edge Deployments v3 — May 2026',
        mark: 'gigaom'
      },
      {
        text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
        jobTitle: 'The Forrester Wave™: Edge Development Platforms, Q1 2026 — March 2026',
        mark: 'forrester'
      },
      {
        text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
        jobTitle: 'Gartner Market Guide for Edge Distribution Platforms — November 2025',
        mark: 'gartner'
      },
      {
        text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry.',
        jobTitle: 'Frost & Sullivan, 2026 Latin America Company of the Year — June 2026',
        mark: 'frost-and-sullivan'
      }
    ]"
  />
</template>
```
