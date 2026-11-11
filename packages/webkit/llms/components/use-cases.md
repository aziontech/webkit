# Use Cases

> The "what teams use it for" band of a product page: a three-column frame whose first cell carries the band's overline, headline, lead and one call to action, followed by one cell per use case. It is a page section — the site places it from a `{ _id: 'use-cases', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `card-grid`, `frame-box`, `overline`, `topic` and `button` rather than owning any anatomy of its own.

- Import: `import UseCases from '@aziontech/webkit/use-cases'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [use-cases.json](https://github.com/aziontech/webkit/blob/main/.specs/use-cases.json)

## When to use

- On a product or solution page, right after the opening band, to name the concrete jobs the product is bought for.
- Whenever a page needs three to six short, icon-led use cases with one link out to the documentation.

## Do

- Keep `items` to four or so; the first cell spans two rows at `lg`, so four cases fill the grid exactly.
- Write `title` as the heading the page's outline needs; it is the band's `h2`.
- Give `primaryAction` an `href` to the documentation and set `trailing` so the chevron reads as "go".
- Leave `eyebrow` as the product name; it is the overline the reader scans first.

## Don’t

- For a grid of features with artwork → use `feature-tiles`.
- For use cases that each link to their own page → use `use-case-links`.
- Inside another band's cell → compose `topic` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [topic](topic.md) — the icon, title and description cell each use case is rendered with.
- [card-grid](card-grid.md) — the frame grid this band lays its cells in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the headline in the title cell, closed by the blinking cursor. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` in the title cell. |
| `description` | `string` | `''` | false | One-line lead under the headline. |
| `primaryAction` | `UseCasesAction` | `undefined` | false | Button pinned to the foot of the title cell; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `items` | `UseCasesItem[]` | `[]` | false | The use cases rendered as frame cells, in order; each item is `{ icon, title, description }`. |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the title cell, not the frame — because a use-case band with no use cases is absent from the page, not an `empty-state`
- The title cell spans two rows from `lg`, so four items fill a three-column grid exactly

## Accessibility

- Visible focus: owned by the composed `button`, whose anchor carries the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` reaches the action link; `Enter` follows it. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` labelled by its `h2` (`aria-labelledby`); each use case is a `topic` with an `h3`, so the outline reads band → use cases. The overline is decorative text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline `var(--text-default)`, lead `var(--text-muted)`; icon colours are `topic`'s.
- `motion-reduce:transition-none motion-reduce:transform-none` — the overline cursor and the button's hover belong to `overline` and `button`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the action is a large `button`.

## Examples

### Default

```vue
<script setup>
  import UseCases from '@aziontech/webkit/use-cases'
</script>

<template>
  <UseCases
    eyebrow="SQL Database"
    title="What teams use SQL Database for"
    description="Teams use it to:"
    :primary-action="{ label: 'Docs', href: '/site/docs', trailing: true }"
    :items="[
      {
        icon: 'pi pi-comments',
        title: 'RAG Applications',
        description: 'Build topic-specific chatbots with the topic data stored in SQL Database.'
      },
      {
        icon: 'pi pi-search',
        title: 'Search Applications',
        description: 'Power search with vector similarity queries on stored embeddings.'
      },
      {
        icon: 'pi pi-sync',
        title: 'AI Context Injection',
        description: 'Give AI applications relevant context from vector embeddings.'
      },
      {
        icon: 'pi pi-globe',
        title: 'AI Workflows',
        description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.'
      }
    ]"
  />
</template>
```
