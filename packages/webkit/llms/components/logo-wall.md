# Logo Wall

> The customer-proof band of a marketing page: a framed grid of square cells, one company mark to a cell, each one optionally linked to that customer's story, under one accessible group name. It is deliberately a static grid rather than an auto-scrolling strip — moving content needs a pause control to meet WCAG 2.2.2, and a wall a reader can scan beats one they have to wait for. The cells are `card-grid` frame cells, so the wall draws the same hairlines and registration marks as every other framed band on the page. A linked cell is the whole square: on hover and focus a wash rises behind it, the mark lifts, and a `Read story` label slides in under it, so the wall doubles as the way into the case studies. Fill the `aside` slot and the band splits from `lg` up — the wall on the start edge, one of those customers speaking on the end edge on a padded canvas panel framed like the cells, a registration mark in each of its corners and one shared hairline at its seam with the wall — and the wall narrows from six columns to three to sit in half the width at the same cell size. Every cell is a perfect square in every layout, and the wall alone sets the band's height: the `aside` panel is size-contained from `lg` up, so its content never stretches a row, and the statement sits centred in it. Between `lg` and `xl` the wall is two columns wide, so its three rows are tall enough for a client sentence; from `xl` it is three columns, two rows. Set `kind` to `rectangle` and every cell becomes a 3:2 rectangle instead: beside `aside` the wall holds three columns from `lg`, so nine rectangles take exactly the height six squares do, and below `sm` it keeps three columns so nine marks never leave a ragged row.

- Import: `import LogoWall from '@aziontech/webkit/logo-wall'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [logo-wall.json](https://github.com/aziontech/webkit/blob/main/.specs/logo-wall.json)

## When to use

- To show who already uses the product, as the proof band under a hero or section, with each mark leading to that customer's success case.
- Wherever a set of partner, customer or certification marks is the message.
- When the marks are recognisable enough that names are unnecessary.
- To set one customer's statement beside the crowd that backs it, by filling `aside` with a `quote`.

## Do

- Place the wall inside a `frame-box` (in a `section-module`, as every framed band is). The grid is `card-grid`'s `flush` frame: the surrounding frame draws the outer rules and the cells lay their right and bottom rules onto it.
- Supply marks that read on the page's own surface. The component applies no colour filter, so a mark that only works on one theme will not work on both; brand-colour marks read on either. When the marks come from a registry that already places them per theme, render them through the `mark` slot and keep `items` as the list they are drawn from.
- Set `shape: 'compact'` on a mark that is close to square (a roundel, a monogram) so it sits taller than the wordmarks beside it and all of them read at one visual weight.
- Give every mark a real `alt` — the company name. A linked cell is announced as `linkLabel`, then that name ("Read story, Magalu").
- Set `ariaLabel` so the group announces its purpose ("Clients running on Azion") instead of reading as an unnamed region.
- Link a mark with `href` only when there is somewhere worth going, such as a case study; a wall of links to nowhere costs a reader a tab stop per cell. In an app with a client-side router, handle `item-click`: call `event.preventDefault()` and push `item.href`.
- Put one statement in `aside`, not a second grid. The band's argument is _many customers, one of them talking_; two things of equal weight leave a reader with neither.
- Give the wall exactly six marks when `aside` is filled — two full rows of three squares beside the statement, and three rows of two between `lg` and `xl` — and a multiple of six when it is not, so the last row is never ragged.
- Reach for `kind: 'rectangle'` when the band names nine customers beside `aside`: three rows of three 3:2 cells at the height of the six-square wall. Nine is the count the rectangle wall is drawn for; without `aside` it runs six to a row like the square wall.

## Don’t

- For a measured claim rather than a set of names → use `big-numbers`.
- For one customer's statement → use `quote`.
- For a single brand mark, such as the product's own → use `brand`.
- For a grid of described features rather than marks → use `topic` in a `card-grid`.
- For a moving strip of many small marks, such as a tool stack → use `ticker`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the frame register the wall is built on; its cells draw the rules and marks.
- [quote](quote.md) — one named customer's statement; the wall shows many without words.
- [big-numbers](big-numbers.md) — the numeric form of the same proof band.
- [brand](brand.md) — the product's own mark, not a customer's.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `LogoWallKind` | `'square'` | false | The cell's proportion; `rectangle` sets every cell at 3:2, keeps three columns below `sm`, and holds three columns beside `aside` from `lg`. |
| `items` | `LogoItem[]` | `[]` | false | The marks rendered in the grid, in order; each item is `{ src, alt, href?, shape? }` where `src` is the mark's URL, `alt` names the company, `href` links the cell to that customer's story, and `shape` sets a near-square mark taller than a wordmark. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the group of marks, announced instead of an unnamed region. |
| `linkLabel` | `string` | `''` | false | Words revealed under a linked mark on hover and focus, and the lead of that link's accessible name. Empty uses the locale catalog (`Read story`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `item-click` | `(event: MouseEvent, item: LogoItem)` | Fired when a linked cell is activated; `item` is the matched `items` entry. The anchor still navigates unless the handler calls `event.preventDefault()`, which is how a client-side router takes over. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `aside` | — | Content set beside the wall from `lg` up, centred in a panel that never sets the band's height (keep it short enough to fit two rows of squares from `xl`), such as one customer's `quote`, on a `--bg-canvas` panel padded by `--spacing-xl` and framed with a registration mark in each corner; its child fills the panel's width. When it is empty the wall spans the full width. |
| `mark` | { item: LogoItem; index: number } | One cell's mark, replacing the image built from the item — for a mark that owns its own theming (a per-theme asset swap, a silhouette filter). The slotted content carries its own alternative text and sits in a 28px-tall box; on a linked cell it lifts with the built image's motion. |

## States

- Visual states: an unlinked cell is static; a linked cell on `hover` / `focus-visible` raises a `--bg-hover` wash behind the whole square, lifts the mark by `--spacing-sm`, and fades the `linkLabel` in beneath it with a trailing arrow
- `data-aside` is present when the `aside` slot is filled; from `lg` up it splits the band into two columns and narrows the wall from six columns to two, and to three from `xl`, so a cell is the same size in both layouts
- `data-kind` on the root is `square` or `rectangle`; `rectangle` sets every cell at 3:2 instead of 1:1
- Columns: two below `sm`, three from `sm`, six from `lg` (with `aside`: two from `lg`, three from `xl`); a `rectangle` wall is three below `sm` and three from `lg` beside `aside`
- `data-shape` on the built image is `wide` or `compact`; `compact` sets the mark 28px tall instead of 20px
- A cell's mark is the `mark` slot's content when it is filled, and the image built from the item otherwise
- Empty: when `items` is empty the wall renders no grid, so a page with no customers to name shows nothing rather than an empty frame — an `aside` given without items still renders, since a statement stands on its own

## Accessibility

- Visible focus: a linked cell carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`, inset so the ring stays inside the cell's rules; focus also lifts the mark and reveals the label, exactly as hover does. An unlinked cell is not focusable.
- Keyboard map: `Tab` reaches each linked cell in DOM order; `Enter` follows it. Unlinked cells are skipped. No arrow-key model — this is a list, not a composite widget.
- ARIA: the grid is `role="list"` of `role="listitem"` cells so the count is announced, inside a `section` named by `ariaLabel` when set. A linked cell's name is `"<linkLabel>, <alt>"`; the visible label is `aria-hidden` so it is not read twice. An unlinked cell's `alt` carries the company name. A mark supplied through the `mark` slot owns that name itself on an unlinked cell — the component cannot add it.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the label is `--text-default` on `--bg-hover` over `--bg-surface`. The marks are consumer-supplied images; WCAG 1.4.11 exempts logotypes from the contrast minimum, and the component adds no colour filter, so a mark must carry its own legibility against `var(--bg-surface)`. Anything in `aside` is ordinary content and is bound by the minimum in full.
- `motion-reduce:transition-none` / `motion-reduce:before:transition-none` on every hover transition. The band never auto-scrolls, so WCAG 2.2.2 (pause, stop, hide) does not apply.
- Touch target ≥40×40 px — a linked cell's anchor is its whole square.

## Examples

### Default

```vue
<script setup>
  import herosparkLogo from '@aziontech/webkit/assets/herospark-extended-color.svg'
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import nznLogo from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <FrameBox>
    <LogoWall
      aria-label="Clients running on Azion"
      :items="[
        { src: magaluLogo, alt: 'Magalu', href: 'https://www.azion.com/en/success-case/magalu/' },
        {
          src: ifoodLogo,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: nznLogo, alt: 'NZN', href: 'https://www.azion.com/en/success-case/nzn/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        }
      ]"
    >
      <template #aside>
        <Quote
          kind="signed"
          :logo="herosparkLogo"
          logo-alt="HeroSpark"
          text="Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."
          name="Mateus Leonardi"
          job-title="CTO at HeroSpark"
        />
      </template>
    </LogoWall>
  </FrameBox>
</template>
```

### Wall

```vue
<script setup>
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import nznLogo from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
</script>

<template>
  <FrameBox>
    <LogoWall
      aria-label="Clients running on Azion"
      :items="[
        { src: magaluLogo, alt: 'Magalu', href: 'https://www.azion.com/en/success-case/magalu/' },
        {
          src: ifoodLogo,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: nznLogo, alt: 'NZN', href: 'https://www.azion.com/en/success-case/nzn/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        },
        { src: magaluLogo, alt: 'Magalu', href: 'https://www.azion.com/en/success-case/magalu/' },
        {
          src: ifoodLogo,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: nznLogo, alt: 'NZN', href: 'https://www.azion.com/en/success-case/nzn/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        }
      ]"
    />
  </FrameBox>
</template>
```

### Rectangle

```vue
<script setup>
  import herosparkLogo from '@aziontech/webkit/assets/herospark-extended-color.svg'
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import marisaLogo from '@aziontech/webkit/assets/marisa-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import nznLogo from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import rennerLogo from '@aziontech/webkit/assets/renner-extended-color.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import zoopLogo from '@aziontech/webkit/assets/zoop-extended-color.svg'
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <FrameBox>
    <LogoWall
      kind="rectangle"
      aria-label="Clients running on Azion"
      :items="[
        { src: magaluLogo, alt: 'Magalu', href: 'https://www.azion.com/en/success-case/magalu/' },
        {
          src: ifoodLogo,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: nznLogo, alt: 'NZN', href: 'https://www.azion.com/en/success-case/nzn/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        },
        { src: rennerLogo, alt: 'Renner', href: 'https://www.azion.com/en/success-case/renner/' },
        { src: marisaLogo, alt: 'Marisa', href: 'https://www.azion.com/en/success-case/marisa/' },
        { src: zoopLogo, alt: 'Zoop', href: 'https://www.azion.com/en/success-case/zoop/' }
      ]"
    >
      <template #aside>
        <Quote
          kind="signed"
          :logo="herosparkLogo"
          logo-alt="HeroSpark"
          text="Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."
          name="Mateus Leonardi"
          job-title="CTO at HeroSpark"
        />
      </template>
    </LogoWall>
  </FrameBox>
</template>
```
