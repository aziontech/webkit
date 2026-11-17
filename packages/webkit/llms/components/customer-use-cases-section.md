# Customer Use Cases Section

> The "what teams use it for" band of a product page: a three-column frame whose first cell carries the band's overline, headline, lead and one call to action, followed by one cell per use case. It is a page section — the site places it from a `{ _id: 'customer-use-cases-section', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `card-grid`, `registration-frame`, `eyebrow`, `feature-item` and `button` rather than owning any anatomy of its own.

- Import: `import CustomerUseCasesSection from '@aziontech/webkit/customer-use-cases-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [customer-use-cases-section.json](customer-use-cases-section.json)

## When to use

- Use CustomerUseCasesSection when the band's title sits in the first grid cell with one action.
- On a product or solution page, right after the opening band, to name the concrete jobs the product is bought for. It is the one use-case band of a product page.
- Whenever a page needs three to six short, icon-led use cases with one link out to the documentation.

## Do

- On a product page give exactly four `items`; the first cell spans two rows at `lg`, so four cases fill the grid exactly. Elsewhere keep to four or so.
- Write `title` as the heading the page's outline needs; it is the band's `h2`.
- Give `primaryAction` an `href` to the documentation and set `trailing` so the chevron reads as "go".
- Leave `eyebrow` as the product name; it is the overline the reader scans first.

## Don’t

- For a grid of features with artwork → use `feature-tiles-section`.
- For use cases that each link to their own page, or any grid of claims with no single action → use `capability-grid-section`.
- Inside another band's cell → compose `feature-item` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [feature-item](feature-item.md) — the icon, title and description cell each use case is rendered with.
- [card-grid](card-grid.md) — the frame grid this band lays its cells in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Eyebrow above the headline in the title cell, closed by the blinking cursor. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` in the title cell. |
| `description` | `string` | `''` | false | One-line lead under the headline. |
| `primaryAction` | `SectionTitleAction` | `undefined` | false | Button pinned to the foot of the title cell; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `items` | `CustomerUseCasesSectionItem[]` | `[]` | false | The use cases rendered as frame cells, in order; each item is `{ icon, title, description }`. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the title cell, not the frame — because a use-case band with no use cases is absent from the page, not an `empty-state`
- The title cell spans two rows from `lg`, so four items fill a three-column grid exactly
- The eyebrow is plain text with no `//` prefix: that prefix belongs to the hero and the pricing sections only.

## Accessibility

- Visible focus: owned by the composed `button`, whose anchor carries the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` reaches the action link; `Enter` follows it. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` labelled by its `h2` (`aria-labelledby`); each use case is a `feature-item` with an `h3`, so the outline reads band → use cases. The overline is decorative text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline `var(--text-default)`, lead `var(--text-muted)`; icon colours are `feature-item`'s.
- `motion-reduce:transition-none motion-reduce:transform-none` — the overline cursor and the button's hover belong to `eyebrow` and `button`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the action is a large `button`.

## Right-to-left

- Layout: the composed `card-grid`, `registration-frame` and `feature-item` use logical utilities, so the intro cell sits at the inline start.
- Icons: the trailing chevron of the action is the `button`'s own and follows its mirroring.
- Keyboard: unchanged.

## Internationalization

- No built-in strings: the eyebrow, title, description, items and action label are marketing copy passed through props.

## Responsive

- Below large the intro cell and the use cases stack in one column; from large the intro cell spans two rows beside the use cases.
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import CustomerUseCasesSection from '@aziontech/webkit/customer-use-cases-section'
</script>

<template>
  <CustomerUseCasesSection
    eyebrow="SQL Database"
    title="What teams use SQL Database for"
    description="Teams use it to:"
    :primary-action="{ label: 'Docs', href: '/site/docs', trailing: true }"
    :items="[
      {
        icon: 'az az-comments',
        title: 'RAG Applications',
        description: 'Build topic-specific chatbots with the topic data stored in SQL Database.'
      },
      {
        icon: 'az az-search',
        title: 'Search Applications',
        description: 'Power search with vector similarity queries on stored embeddings.'
      },
      {
        icon: 'az az-sync',
        title: 'AI Context Injection',
        description: 'Give AI applications relevant context from vector embeddings.'
      },
      {
        icon: 'az az-globe',
        title: 'AI Workflows',
        description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.'
      }
    ]"
  />
</template>
```
