# Module Header

> The framed header row that opens a page section: an optional overline, the section's `h2`, an optional description and an optional row of actions, held inside a registration frame whose bottom rule is what divides the header from the section body. `variant` picks the layout — `center` for a symmetric opener, `start` for a reading-order one, and `split` for a wide row that sets the headline against its description.

- Import: `import ModuleHeader from '@aziontech/ui/module-header'`
- Category: layout · Surface: site · Structure: monolithic
- API as JSON: [module-header.json](module-header.json)

## When to use

- Use ModuleHeader as the header row of a marketing band; console pages use Subheader.
- Opening a marketing or landing page section that needs a framed header.
- Whenever the header itself should carry the rule that separates it from the content below, with no extra margin.
- For a wide band whose headline and supporting sentence should sit side by side rather than stacked — `align="split"`.

## Do

- Leave `framed` on when the header is a brick of its own in a page column; turn it off when a band composes the header inside a frame it already draws, so the rule and the padding are not drawn twice.
- `framed` defaults to `true` here, unlike `call-to-action`, `faq` and `media-split`, where it defaults to `false`: a section title most often opens a page section as its own brick, while those components are most often composed inside a band's frame. The default stays as it is because flipping it would change every existing page; pass `framed` explicitly when composing.
- Keep one `module-header` per section, and let it own the section's `h2` so the page keeps one document outline. `size` changes the headline's step on the type scale, never its heading level — a page with a `large` and a `small` header still reads as two `h2`s.
- Leave `size` at `medium` for an ordinary section opener. Reach for `large` only where the headline is the band's whole statement, and for `small` where the header opens a subsection inside a band that already has one.
- Write the eyebrow as one or two words: it is set uppercase and prefixed with `//`, so a sentence in it reads as noise.
- Reach for `split` when the description is long enough to earn its own column — on a narrow viewport it stacks back under the headline.
- In `split`, set `--module-header-headline-span` to `2` from the consumer's class to run the headline across the middle column too, when it would otherwise wrap to three lines; the description keeps the third column, and the default `1` leaves that column as air. `--module-header-headline-max` caps the headline's width inside its span (`none` by default), so a headline that would fit on one line across two columns still breaks into two.
- In `split`, set `descriptionWidth="wide"` when the description runs to a paragraph and would stack six or more lines in the third column alone; it then spans the middle and third columns, capped at `--container-xl` and aligned to the right edge so it ends where the narrow description ends. It takes the column a `--module-header-headline-span` of `2` would claim, so use one or the other. Outside `split` the prop has no effect.
- Put the section's CTAs in the `actions` slot rather than in the body; the slot already stacks them fluid below `sm` and aligns them with the chosen `align` above it.
- The vertical rhythm around the header belongs to the `spacer` frames on either side, not to this component.

## Don’t

- For the page's leading band and its `h1` → use `hero` instead.
- For the top bar of an application shell → use `app-header` instead.
- For a plain framed container with arbitrary content → use `registration-frame` instead.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero](hero.md) — the opening band; its `Hero.Title` renders the page's `h1` at hero scale.
- [registration-frame](registration-frame.md) — the frame this component composes.
- [spacer](spacer.md) — the empty frame that sets the air before and after a section header; this component holds no vertical air of its own beyond its padding.
- [eyebrow](eyebrow.md) — the eyebrow treatment rendered above the headline.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | Headline of the section, rendered as the section's `h2`. |
| `description` | `string` | `''` | false | Supporting sentence under the headline; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `align` | `'start' \| 'center' \| 'split'` | `'center'` | false | Layout of the header: `center` stacks and centers the copy, `start` stacks it at the start edge, `split` sets the headline and its description in two columns. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Step of the headline on the heading scale: `small` for a subsection inside a band, `medium` for an ordinary section opener, `large` for a band whose headline is the statement. |
| `framed` | `boolean` | `true` | false | Draw the header's own frame and padding. Turn it off when the header is composed inside a band that already owns both. |
| `padding` | `'small' \| 'medium'` | `'medium'` | false | Vertical padding of the framed header: `medium` for a section opener, `small` for a header that sits tight over its band. |
| `descriptionWidth` | `'narrow' \| 'wide'` | `'narrow'` | false | Width of the description in the horizontal layout: `narrow` keeps it to the third column, `wide` runs it across the middle column too. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Description body; replaces the `description` prop when provided. |
| `actions` | — | Call-to-action row under the copy, aligned with the chosen `align`. |

## States

- Visual states: `default`
- `data-align` mirrors the `align` prop: `start` | `center` | `split`
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-framed` present when the header draws its own frame and padding
- `data-padding` mirrors the `padding` prop: `small` | `medium`
- `data-description-width` mirrors the `descriptionWidth` prop: `narrow` | `wide`

## Accessibility

- Visible focus: not applicable to the header itself; controls composed into the `actions` slot keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the headline is a real `h2` (the page's `h1` belongs to `Hero.Title`), so no `role` or `aria-label` is added; the frame's rules and corner marks stay `aria-hidden="true"`. In `split` the headline precedes its description in DOM order, so the reading order matches the visual one.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline on `var(--text-default)`, description on `var(--text-muted)`, both over the page canvas.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — the `actions` row stretches its children to full width below `sm`, so slotted buttons keep their own target size.

## Examples

### Default

```vue
<script setup>
  import ModuleHeader from '@aziontech/ui/module-header'
</script>

<template>
  <ModuleHeader
    eyebrow="Platform"
    title="Everything runs at the edge"
    description="One platform for applications, security and observability."
  />
</template>
```

### Alignments

```vue
<script setup>
  import ModuleHeader from '@aziontech/ui/module-header'
</script>

<template>
  <div>
    <ModuleHeader
      align="center"
      eyebrow="Platform"
      title="Build once, run everywhere"
      description="One deploy serves your application from every region, with no servers to manage."
    />
    <ModuleHeader
      align="start"
      eyebrow="Observability"
      title="See every request as it happens"
      description="Logs, metrics and traces stream to one place, ready to query in seconds."
    />
    <ModuleHeader
      align="split"
      eyebrow="Security"
      title="Protect every request"
      description="Firewall rules, bot protection and DDoS mitigation run before your code, on the same network, so a blocked request never costs you compute."
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import ModuleHeader from '@aziontech/ui/module-header'
</script>

<template>
  <div>
    <ModuleHeader
      size="small"
      align="start"
      eyebrow="Functions"
      title="Runtime APIs"
      description="Fetch, streams and crypto work the way they do in the browser."
    />
    <ModuleHeader
      size="medium"
      align="start"
      eyebrow="Security"
      title="Protect every request"
      description="Firewall rules and bot protection run before your code, on the same network."
    />
    <ModuleHeader
      size="large"
      align="start"
      eyebrow="Platform"
      title="Build once, run everywhere"
      description="One deploy serves your application from every region, with no servers to manage."
    />
  </div>
</template>
```
