# Process Scroll Section

> The stages of a process as a row of numbered dark cards on a pixel texture, under a section title. On narrow screens the row scrolls sideways with snap; from the large breakpoint up the cards share the width, or, with `pinned`, keep a 26rem card width while the band pins under the site header and the page scroll slides the row sideways until its last card is in view (azion.com's careers hiring process). The retired `'sticky-carousel'` `_id` resolves here with `pinned: true` and `titleAlign: 'center'`. From the design sample's site `ProcessScrollSection`.

- Import: `import ProcessScrollSection from '@aziontech/ui/process-scroll-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [process-scroll-section.json](process-scroll-section.json)

## When to use

- Use ProcessScrollSection for numbered stage cards; set `pinned` to pin them under the header while they slide.
- How something works in three to five ordered stages (build, deploy, observe), or five to eight short numbered points pinned on scroll (`pinned`, `title-align="center"`).

## Do

- Name each stage with a verb.
- Keep descriptions to two lines.
- Set `pinned` when the stages run wider than the page column (five tall cards, as the careers hiring process): the band stays on screen while the page scroll walks the row. Do not nest a pinned band in a container that clips overflow; sticky positioning needs the page scroll.

## Don’t

- For more than five stages or stages with art — use `FeatureScrollSection`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `Texture`, `RegistrationFrame`, `ModuleHeader`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the title. |
| `titleAlign` | `ModuleHeaderAlign` | `'split'` | false | Alignment of the section title over the card row. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Paragraph beside the headline. |
| `descriptionWidth` | `ModuleHeaderDescriptionWidth` | `'narrow'` | false | Column span of the paragraph: `wide` runs it across the middle column too. |
| `steps` | `ProcessScrollSectionStep[]` | `[]` | false | The stages, in order; each is `{ title, description }` and gets its own numbered card. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the scrollable card row; defaults to the title. |
| `pinned` | `boolean` | `false` | false | From the large breakpoint, pins the band under the site header while the page scrolls and slides the card row sideways until its last card is in view; below it, or under reduced motion, the row scrolls sideways on its own. |
| `headerOffset` | `string` | `'var(--layout-header-height)'` | false | Height of the sticky site header a pinned band sticks under; defaults to the SiteHeaderSection bar's token, any CSS length. |

## States

- Renders nothing without a title or steps.
- Cards are `data-theme="dark"` in both themes (the sample's design).
- `data-pinned` on the root mirrors `pinned`. From `lg` with motion allowed, the band is `sticky` under `headerOffset` and one screen tall, the root (the runway) grows by the row's overflow, and the row's `translate` follows the page scroll (mirrored in right-to-left); below `lg` the band does not pin and the row scrolls inside itself; from `lg` under `prefers-reduced-motion` the band does not pin and every card shares one row in equal columns, as the unpinned band does, so no card sits off-screen without a scrollbar. The runway is measured on mount and on scroll/resize, so the server HTML is the unpinned band.

## Accessibility

- The band root is a plain container; the scroll row is the one focusable `region`, named by `ariaLabel` or the title, so keyboard users can scroll it with the arrow keys and the page has one landmark per band.
- Stages are an ordered list; the big number is `aria-hidden` because the list already orders them.
- Each stage heading is an `h3`.

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Responsive

- Below large: cards are `min(22rem, 80vw)` wide and snap; the row scrolls inside itself, never the page.
- From large: cards share the width; with `pinned`, cards keep a 26rem width and the pinned band slides them sideways.

## Examples

### Default

```vue
<script setup>
  import ProcessScrollSection from '@aziontech/ui/process-scroll-section'

  const steps = [
    { title: 'Push', description: 'Every push to the main branch builds a new version.' },
    { title: 'Build', description: 'The build runs in an isolated worker with your settings.' },
    {
      title: 'Deploy',
      description: 'The version goes live everywhere at once, with no regions to pick.'
    },
    { title: 'Observe', description: 'Metrics and logs for the new version arrive in seconds.' }
  ]
</script>

<template>
  <ProcessScrollSection
    eyebrow="How it works"
    title="From commit to production"
    description="Four stages, all automatic once the repository is connected."
    :steps="steps"
  />
</template>
```

### Pinned

```vue
<script setup>
  import ProcessScrollSection from '@aziontech/ui/process-scroll-section'

  const steps = [
    { title: 'Role request', description: 'A hiring manager requests a new role.' },
    {
      title: 'Scope and posting',
      description: 'People and the hiring manager scope the role and publish the opening.'
    },
    {
      title: 'Recruiting and interviews',
      description: 'Candidates meet the team in technical and culture interviews.'
    },
    { title: 'Calibration', description: 'The panel compares notes and decides together.' },
    { title: 'Offer letter', description: 'The chosen candidate receives the offer.' }
  ]
</script>

<template>
  <ProcessScrollSection
    pinned
    title-align="center"
    title="Hiring process"
    description="Every role goes through the same five stages, from the first request to the offer."
    :steps="steps"
  />
</template>
```
