# Story Library

> Every success story of a company as one filterable library. A left-aligned title sits over a toolbar — a search field and one searchable select per facet (industry, solution, product) on one row — then a grid of story cards and a load-more button. Each card is one link named by its company: the client mark in a single ink, the story's category as an overline, its description and a read cue whose arrow nudges on hover. The grid runs one column on phones, two from `sm` and three from `lg`. Search and facets combine; when nothing matches, an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'story-library', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `input`, `select`, `button` and `empty-state`; the search, the facet selections and each select's own option search are local state.

- Import: `import StoryLibrary from '@aziontech/webkit/story-library'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [story-library.json](https://github.com/aziontech/webkit/blob/main/.specs/story-library.json)

## When to use

- To list every success story with search and facet filters.

## Do

- Derive each facet's `options` from the values the items carry, so every option matches at least one story.
- Give every item a `facets` entry per facet `key`; an item without one never matches a selection on that facet.
- Pass `client.logo` as any image URL or imported asset (`import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'`); the card fits a mark of any intrinsic size, so do not pre-scale or crop it.

## Don’t

- For a closing row of three related stories → use `article-cards`.
- For a filterable list of articles → use `article-index-blog` or `article-index-resource-hub`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [article-index-resource-hub](article-index-resource-hub.md) — the sibling listing of articles with facet dropdowns.
- [empty-state](empty-state.md) — the no-match state.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty. |
| `items` | `StoryLibraryItem[]` | `[]` | false | The stories, in order; each is `{ key, href, client, category, description, facets? }`. |
| `facets` | `StoryLibraryFacet[]` | `[]` | false | The facet selects, in order; each is `{ key, label, allLabel, options }`. |
| `search` | `StoryLibrarySearch` | `undefined` | false | The search field's `placeholder` and accessible `label`; the field is omitted when absent. |
| `empty` | `StoryLibraryEmpty` | `undefined` | false | The no-match state's `title` and the `action` label of its clear-filters button. |
| `linkLabel` | `string` | `''` | false | Read cue at the foot of each card, also the lead of its accessible name. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the grid; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of stories. |

## States

- Visual states: `default`, `hover` (a card lifts to the raised surface, the read cue brightens and its arrow nudges), `focus-visible` (inset ring)
- Filtered: the search matches the client name and the description; each facet keeps the stories whose `facets[key]` holds the selected value; all filters combine
- Empty: when no story matches, the grid and the load-more button give way to `empty-state`, whose action clears the search and every facet; it renders only when `empty` is set
- `data-last-row-sm` / `data-last-row-lg` mark the cards on the grid's last row so it drops its bottom rule
- Client mark: drawn at the mark row's height, at most `9rem` wide, keeping its aspect ratio; when the card is narrower than that (two columns at 200% zoom) the mark shrinks to the card's width (`min-w-0`) and stays start-aligned, so a mark of any size or aspect ratio never pushes the card past its column

## Accessibility

- Visible focus: every card shows an inset `focus-visible` ring; the field, selects and buttons own theirs.
- Keyboard map: `Tab` moves through the search field, each select, the cards and the load-more button; the selects own their keyboard map.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `search` landmark; the field is named by `search.label` and each select trigger by its facet `label`; the list is named by `ariaLabel`; each card link is named `linkLabel: client name`, its mark decorative (`alt=""`) and its read cue `aria-hidden`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every card is a full-cell link.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the external-link arrow does not mirror; its hover nudge moves toward the end edge (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import StoryLibrary from '@aziontech/webkit/story-library'
  import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
</script>

<template>
  <StoryLibrary
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    link-label="Read story"
    more-label="Load more"
    :items="[
      {
        key: 'case-gpa',
        href: '/site/success-cases/gpa',
        client: { name: 'GPA', logo: gpaExtendedReversed },
        category: 'Retail',
        description:
          'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
        facets: { industry: ['Retail'], solution: ['Secure'] }
      },
      {
        key: 'case-axur',
        href: '/site/success-cases/axur',
        client: { name: 'Axur', logo: axurExtendedReversed },
        category: 'Tech',
        description:
          'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
        facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
      },
      {
        key: 'case-exame',
        href: '/site/success-cases/exame',
        client: { name: 'Exame', logo: exameExtendedReversed },
        category: 'Media',
        description:
          'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
        facets: { industry: ['Media'], solution: ['Build', 'Deploy'] }
      }
    ]"
    :facets="[
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        key: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    :search="{ placeholder: 'Search by company or story', label: 'Search success stories' }"
    :empty="{ title: 'No stories match these filters.', action: 'View all success stories' }"
  />
</template>
```

### NoResults

```vue
<script setup>
  import StoryLibrary from '@aziontech/webkit/story-library'
</script>

<template>
  <StoryLibrary
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    :items="[]"
    :facets="[
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        key: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    :search="{ placeholder: 'Search by company or story', label: 'Search success stories' }"
    :empty="{ title: 'No stories match these filters.', action: 'View all success stories' }"
  />
</template>
```
