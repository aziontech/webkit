# Quote Tabs

> A testimonial band a reader browses by client: the selected client's quotation featured at the top in the client's own colours, and a wall of client cards below it that is the selector itself — clicking a card brings that client's quotation in. It is the band a page reaches for when several customers have one strong sentence each and only one of them should be read at a time. The band owns the selection and nothing else. The featured quotation is `quote` in its `highlight` register, and every card is the same framed cell `logo-wall` draws, so a quotation and a client card look the same here as everywhere else on the page. The quotation travels sideways in the direction of the choice — a card later in the wall brings its quotation in from the right, an earlier one from the left — so the reader feels the wall as a sequence. Left alone it moves through the clients on its own, the way `media-tabs` does: a hairline along the panel's bottom edge fills toward the next client, and the band holds still while the reader points at it or works it from the keyboard.

- Import: `import QuoteTabs from '@aziontech/webkit/quote-tabs'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [quote-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/quote-tabs.json)

## When to use

- To feature one client quotation at a time out of three to twelve peers, with every other client one click away on the wall below.
- As a success-story band where the wall of customers and the quotation are the same content, not two lists.

## Do

- Give the wall a full row: six clients fill it from `lg` up and three from below `sm`, so six or twelve leave no empty cell.
- Give every item a `logo` in the client's own colours; it is drawn as-is on its card and in the featured quotation, so pick artwork that carries its own contrast on both themes. Without one, `mark` names a one-ink mark from the brand registry instead.
- Let `clientName` default to the registry's label for `mark`; set it when the item has only a `logo`, or a client the registry does not carry. It is the card's accessible name, so it is never optional in practice.
- Keep each quotation to one or two sentences, verbatim, without typed quotation marks — `quote` draws its own glyph. The panel holds the tallest quotation's height for all of them and floors the attribution and the `actions` control, so one much longer quotation opens a wide gap under every shorter one.
- Keep each quotation readable inside `autoplayInterval`; raise the interval before shortening a verbatim quotation, and turn `autoplay` off when the band sits beside other moving content.

## Don’t

- For one quotation on its own → use `quote` with `kind="highlight"`.
- For several quotations read side by side or swiped through → use `quote-carousel`.
- For a wall whose cards link to each customer's story → use `logo-wall`.
- For a moving strip of marks with no links → use `ticker`.
- For switching a page's content between views → use `tabs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [quote](quote.md) — the `highlight` register this band renders for the selected client.
- [logo-wall](logo-wall.md) — the same framed client cells, as links out rather than as a selector.
- [card-grid](card-grid.md) — the framed grid the cards are laid out on.
- [frame-box](frame-box.md) — the registration frame the quotation panel is drawn in, with the same corner marks as the cards below it; also what a page wraps the band in to close its outer edges.
- [quote-carousel](quote-carousel.md) — the same testimonials as a row the reader scrolls through, every one visible.
- [media-tabs](media-tabs.md) — the same timer and progress hairline, for claims paired with a medium.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `QuoteTabsItem[]` | `[]` | false | The clients, in wall order; each item is `{ logo?, mark?, clientName?, shape?, text, name?, jobTitle?, photo? }` — the URL of the client's colour logo, the registry name of its one-ink mark, its name in prose, how tall its mark sits on the card, the quotation, who said it, their role and their likeness. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the wall of client cards. |
| `autoplay` | `boolean` | `true` | false | Advances to the next client on a timer; pauses under the pointer or keyboard focus, restarts its count on a selection, and never runs under reduced motion. |
| `autoplayInterval` | `number` | `5000` | false | Milliseconds each client is held before the band advances. |
| `showProgress` | `boolean` | `true` | false | Advances a hairline along the quotation panel's bottom edge while the timer runs. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | — | A trailing control under the featured quotation's attribution, such as a secondary `Button` to the success stories; rendered in `quote`'s own `actions` area, the same for every client. |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                                 |
| --------- | -------- | ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `number` | `0`     | `update:modelValue` | Index of the selected client, two-way through `defineModel`; left unbound the band keeps its own selection, starting on the first card. A click, an arrow key or the timer writes the new index back. |

## States

- Visual states: `default`, `hover`, `focus-visible` on each card
- The band is two regions: the quotation panel on top, drawn as a `frame-box` with all four corner marks and only its bottom rule — the seam it shares with the wall of client cards below it. The band draws no outer frame of its own, exactly like `logo-wall`: the wall's flush grid pulls its right and bottom rules onto whatever frames the band, so a page places it inside its framed column (a `frame-box` with `borders="y"`, the column supplying the sides) and every edge is a single hairline, never doubled against the page's own rules
- The wall is a `card-grid` of framed cells at 3:2, three columns below `lg` and six from `lg`, drawn from `--border-default`; each cell is one card
- `data-active` marks the selected card; it sits on `--bg-selected` while the others rest on the plain surface
- Hover paints `--bg-hover` as a `::before` ghost layer over a resting card; the selected card shows no ghost. A card reveals no link label — clicking it selects, it never navigates
- The panel renders every item's `quote` with `kind="highlight"` in one shared grid cell; only the selected one is visible, and the others are transparent (`opacity-0`), `inert` and `aria-hidden`. The panel is therefore always as tall as the tallest quotation, so its height never changes between clients or during a change. They are hidden by opacity, never by `visibility: hidden`: a registry mark's SVG clip path is resolved by id from its first copy in the document, and a clip path inside a `visibility: hidden` subtree clips every copy of that mark to nothing
- The visible quotation fills that held height, and `quote` gives the slack to the quotation itself, so the attribution and the `actions` control sit on the same line for every client and a change of client never moves them
- `data-direction` on the panel is `forward` when the new card sits after the previous one in the wall and `back` when it sits before it; an arrow key that wraps keeps its own direction (`ArrowRight` from the last card to the first is `forward`, `ArrowLeft` from the first to the last is `back`). It decides which side the quotations travel to and from
- `data-autoplay` marks the root while the timer runs. It runs when `autoplay` is on, the band has more than one client and the reader has not asked for reduced motion; it pauses while the pointer rests on the band or keyboard focus (`:focus-visible`) is inside it, and resumes on leave
- Every change of client restarts the count, whether the timer, a click, an arrow key or a bound `modelValue` made it; clicking the selected card restarts it too, and a click keeps the timer running with the pointer still on the band. The timer moves to the next card and wraps from the last to the first, travelling `forward`
- While the timer runs and `showProgress` is on, a `--primary` hairline grows along the panel's bottom edge, across the panel's full width rather than the quotation's padded column, and reaches the right edge as the band advances; it is decorative and `aria-hidden`
- During a change the leaving quotation travels out first and the entering one travels in once it has gone, both within that same cell, so two quotations never overlap and the wall below never moves
- A client's mark resolves in order: its `logo`, drawn as-is in its own colours; else its registry `mark`, drawn in one ink; else its name, in heading type, on the card and in the panel alike
- `shape` on a card's mark is `wide` (the default, 20px tall) or `compact` (28px), matching `logo-wall`
- When the `actions` slot is filled, its content is rendered under the featured quotation's attribution through `quote`'s `actions` slot, and again in each stacked copy so the held height includes it; the stacked copies stay `inert` and `aria-hidden`, so the control is reachable once. When the slot is empty, no actions area is drawn
- `modelValue` past the last item is clamped to the last card, so the band always shows a quotation while it has items
- Empty: when `items` is empty the band renders nothing

## Accessibility

- Visible focus: each card and the panel carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`, inset so the grid's hairlines never clip the ring.
- Keyboard map: `Tab` reaches the selected card only (roving tabindex); `ArrowRight` / `ArrowLeft` move to the next / previous card in wall order and select it, wrapping at either end; `Home` / `End` select the first / last card; `Shift+Tab` from the wall moves back to the panel.
- ARIA: only the selected quotation is exposed; the others in the panel's cell are `inert` (so never focusable or reachable) and `aria-hidden` (so never announced). The wall is a `role="tablist"` named by `ariaLabel`; each card is a native `<button role="tab">` named by the client's name through `aria-label`, with `aria-selected` and `aria-controls` pointing at the panel; the card's artwork is decorative (`alt=""` or `aria-hidden`), since the name is its label. The panel is `role="tabpanel"` with `tabindex="0"` and `aria-labelledby` pointing at the selected card; its colour logo carries the client name as its alternative text, and a one-ink mark is `aria-hidden` with the quotation's attribution naming the company. Ids come from `useId()`. The leaving quotation stays `aria-hidden` while it travels out, so a screen reader reads one quotation.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): colour logos are logotypes, exempt under WCAG 1.4.11, and are drawn as the consumer supplies them; the name fallback is `var(--text-default)` on both card surfaces.
- `motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:translate-x-0` on the travelling quotation (the zero duration is what lets the out-in swap finish at once instead of waiting out the leave), `motion-reduce:transition-none` on the card surface and `motion-reduce:before:transition-none` on its ghost layer; under reduced motion the band never advances on its own.
- Pause (WCAG 2.2.2): the timer stops while the pointer rests on the band or keyboard focus is inside it, so a reader holds a quotation by pointing at it or reaching the band with `Tab`; `autoplay` off removes the movement entirely. The panel is not a live region, so a change the timer makes is never announced over the reader.
- Touch target ≥40×40 px: each card is a full 3:2 cell of the wall, well above 40px on every breakpoint.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous quote, swapped under `dir="rtl"` (`logicalArrowKey`).
- Motion: the panel slides in from the end edge when moving forward and from the start edge when moving back (`rtl:` flips the `translate-x`).
- User data: quotes and names in another script keep their own direction.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import herosparkLogo from '@aziontech/webkit/assets/herospark-extended-color.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
</script>

<template>
  <FrameBox>
    <QuoteTabs
      aria-label="Client stories"
      :items="[
        {
          logo: magaluLogo,
          clientName: 'Magalu',
          text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
          name: 'Allan Monteiro',
          jobTitle: 'CISO & Head of Technology at Magalu'
        },
        {
          logo: ifoodLogo,
          clientName: 'iFood',
          shape: 'compact',
          text: 'iFood serves every order screen from the edge, so a lunch-hour peak reaches millions of customers without a capacity plan.',
          name: 'iFood',
          jobTitle: 'Food delivery'
        },
        {
          logo: herosparkLogo,
          clientName: 'HeroSpark',
          text: 'HeroSpark serves course pages and checkouts from the edge, so a launch day reaches every student without a capacity plan.',
          name: 'HeroSpark',
          jobTitle: 'Education technology'
        },
        {
          mark: 'fourbank',
          text: 'Fourbank runs its digital banking on Azion, keeping every account screen fast and protected from the first login.',
          name: 'Fourbank',
          jobTitle: 'Financial services'
        },
        {
          logo: stoneLogo,
          clientName: 'Stone',
          text: 'Stone keeps its payment flows answering in milliseconds for merchants across Brazil, peak day or not.',
          name: 'Stone',
          jobTitle: 'Payments'
        },
        {
          logo: itauLogo,
          clientName: 'Itaú',
          shape: 'compact',
          text: 'Itaú protects its digital banking channels at the edge, before a request ever reaches its origin.',
          name: 'Itaú',
          jobTitle: 'Financial services'
        }
      ]"
    >
      <template #actions>
        <Button
          label="See success stories"
          kind="secondary"
          size="large"
          href="https://www.azion.com/en/success-case/"
          target="_blank"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </QuoteTabs>
  </FrameBox>
</template>
```

### Fallback

```vue
<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
</script>

<template>
  <FrameBox>
    <QuoteTabs
      aria-label="Client stories"
      :items="[
        {
          logo: magaluLogo,
          clientName: 'Magalu',
          text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
          name: 'Allan Monteiro',
          jobTitle: 'CISO & Head of Technology at Magalu'
        },
        {
          clientName: 'Acme',
          text: 'Acme moved its storefront to the edge and now ships every release to all of its regions at once.',
          name: 'Acme',
          jobTitle: 'E-commerce'
        }
      ]"
    />
  </FrameBox>
</template>
```
