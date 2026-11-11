# Process Scroll

> The stages of a process as a row of numbered dark cards on a pixel texture, under a section title. On narrow screens the row scrolls sideways with snap; from the large breakpoint up the cards share the width. From the design sample's site `ProcessScroll`.

- Import: `import ProcessScroll from '@aziontech/webkit/process-scroll'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [process-scroll.json](https://github.com/aziontech/webkit/blob/main/.specs/process-scroll.json)

## When to use

- How something works in three to five ordered stages (build, deploy, observe).

## Do

- Name each stage with a verb.
- Keep descriptions to two lines.

## Don’t

- For more than five stages or stages with art — use `FeatureScroll`.
- For a row that pins while the page scrolls — use `StickyCarousel`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- StickyCarousel` — the same cards, pinned while the row travels.
- TextureMaterial`, `FrameBox`, `SectionTitle`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Overline above the title. |
| `titleKind` | `SectionTitleKind` | `'horizontal'` | false | Alignment of the section title over the card row. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Paragraph beside the headline. |
| `descriptionWidth` | `SectionTitleDescriptionWidth` | `'narrow'` | false | Column span of the paragraph: `wide` runs it across the middle column too. |
| `steps` | `ProcessScrollStep[]` | `[]` | false | The stages, in order; each is `{ title, description }` and gets its own numbered card. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the scrollable card row; defaults to the title. |

## States

- Renders nothing without a title or steps.
- Cards are `data-theme="dark"` in both themes (the sample's design).

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
- From large: cards share the width.

## Examples

### Default

```vue
<script setup>
  import ProcessScroll from '@aziontech/webkit/process-scroll'

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
  <ProcessScroll
    eyebrow="How it works"
    title="From commit to production"
    description="Four stages, all automatic once the repository is connected."
    :steps="steps"
  />
</template>
```
