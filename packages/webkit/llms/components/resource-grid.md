# Resource Grid

> A band that points readers to further reading on solution pages: an overline, a headline and a short lead with an optional button sit beside a two-column frame grid of linked resource cards, each a title and one sentence. A card whose link leaves the site opens in a new tab; past four cards the grid scrolls inside a fading scroll area so the band keeps its height. It is a page section — the site places it from a `{ _id: 'resource-grid', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split`, `card-grid`, `topic`, `scroll-area` and `button`.

- Import: `import ResourceGrid from '@aziontech/webkit/resource-grid'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [resource-grid.json](https://github.com/aziontech/webkit/blob/main/.specs/resource-grid.json)

## When to use

- To close a solution page with documentation, articles and stories that go deeper into it.

## Do

- Keep four cards for a full grid; more than four scroll.
- Give a card a full `http` link only when it leaves the site, so only those open in a new tab.

## Don’t

- For related articles with covers → use `article-cards`.
- For linked use cases with media → use `use-case-links`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the copy-beside-media band that owns the heading and the named region.
- [topic](topic.md) — the linked title-and-sentence cell each card is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, which also names its region and the scroll area. |
| `description` | `string` | `''` | false | Lead sentence beside the grid. |
| `items` | `ResourceGridItem[]` | `[]` | false | The resource cards, in order; each is `{ title, description?, href }`, and a card with no title is skipped. |
| `primaryAction` | `ResourceGridAction` | `undefined` | false | Button under the copy; dropped when its label or link is missing. |

## States

- Visual states: `default`, `hover` and `focus-visible` on each card (owned by `topic`)
- `data-scrollable` is set when more than four cards render, and the grid scrolls inside a fading scroll area
- Empty: when no item has a title the band renders nothing
- The button renders only when `primaryAction` has a label and a link

## Accessibility

- Visible focus: owned by `topic` and `button`.
- Keyboard map: `Tab` moves card to card, then to the button; `Enter` follows the link. The scroll area is keyboard-scrollable.
- ARIA: `media-split` renders the named region and the headline (`h2`); the root is a plain `div` so the band has one landmark; each card's title is an `h3`; the scroll area is named by the title; external cards carry `target="_blank"` and `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `topic`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — every card is a full-cell link.

## Examples

### Default

```vue
<script setup>
  import ResourceGrid from '@aziontech/webkit/resource-grid'
</script>

<template>
  <ResourceGrid
    eyebrow="Go Deeper"
    title="Guides and Resources"
    description="Documentation, articles, and customer stories on building secure, compliant financial applications on a distributed architecture."
    :items="[
      {
        title: 'New to Azion? Start here',
        description: 'A guide to your first steps with Azion.',
        href: '/docs'
      },
      {
        title: 'Learning Center',
        description: 'Practical knowledge to speed up, secure, and scale applications.',
        href: '/learning'
      },
      {
        title: 'How Technology Can Help You Comply with Regulations for Fintech',
        description:
          'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
        href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
      },
      {
        title: 'How Justa is evolving its technology to meet modern digital demands',
        description:
          'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
        href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
      }
    ]"
    :primary-action="{
      label: 'See all guides',
      href: 'https://www.azion.com/en/documentation/products/guides/',
      trailing: true,
      target: '_blank'
    }"
  />
</template>
```

### Scrollable

```vue
<script setup>
  import ResourceGrid from '@aziontech/webkit/resource-grid'
</script>

<template>
  <ResourceGrid
    eyebrow="Go Deeper"
    title="Guides and Resources"
    description="Documentation and articles on building, securing, and scaling modern applications on a distributed architecture."
    :items="[
      {
        title: 'New to Azion? Start here',
        description: 'A guide to your first steps with Azion.',
        href: '/docs'
      },
      {
        title: 'Learning Center',
        description: 'Practical knowledge to speed up, secure, and scale applications.',
        href: '/learning'
      },
      {
        title: 'Build modern applications with Functions',
        description: 'Create serverless functions that run close to users.',
        href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
      },
      {
        title: 'SQL Database for modern applications',
        description:
          'Build data-driven applications with SQL Database on a distributed architecture.',
        href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
      },
      {
        title: 'How Technology Can Help You Comply with Regulations for Fintech',
        description:
          'Distributed infrastructure brings security, compliance, and monitoring together.',
        href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
      },
      {
        title: 'How Justa is evolving its technology to meet modern digital demands',
        description: 'See how Justa uses the Azion Web Platform in PIX and QR Code transactions.',
        href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
      }
    ]"
    :primary-action="{
      label: 'See all guides',
      href: 'https://www.azion.com/en/documentation/products/guides/',
      trailing: true,
      target: '_blank'
    }"
  />
</template>
```
