# Story Library

> Every success story of a company as one filterable library. A left-aligned title sits over a toolbar — a search field and one select per facet (industry, solution, product) on one row, each starting with an option that clears it — then a grid of story cards and a load-more button that reveals the next page. Below `lg` the toolbar folds to the search field (with its shorter placeholder) and a filter button that reveals the selects, with each applied facet listed under it as a removable chip. A select with more than seven options gains an option search. Each card is one link named by its company: the client mark in a single ink, the story's category as an overline, its description and a read cue whose arrow nudges on hover. The grid runs one column on phones, two from `sm` and three from `lg`. Search and facets combine; when nothing matches, an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'story-library', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `input`, `select`, `chip`, `button` and `empty-state`; the search, the facet selections, each select's own option search and the page count are local state, and facets can be seeded from the URL query.

- Import: `import StoryLibrary from '@aziontech/webkit/story-library'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [story-library.json](https://github.com/aziontech/webkit/blob/main/.specs/story-library.json)

## When to use

- Use StoryLibrary for a card grid of customer stories with search and facets.

## Do

- Derive each facet's `options` from the values the items carry, so every option matches at least one story.
- Give every item a `facets` entry per facet `id`; an item without one never matches a selection on that facet.
- Pass `client.logo` as any image URL or imported asset (`import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'`); the card fits a mark of any intrinsic size, so do not pre-scale or crop it.

## Don’t

- For a closing row of three related stories → use `article-cards`.
- For the full filterable list of articles or resources → use `article-index`.
- For a filterable list of non-article rows (jobs) → use `listing-browser`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [article-index](article-index.md) — the filterable list of articles or resources.
- [empty-state](empty-state.md) — the no-match state.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty. |
| `items` | `StoryLibraryItem[]` | `[]` | false | The stories, in order; each is `{ id, href, client, category, description, facets?, target? }`; a story whose `target` is `_blank` opens in a new tab. |
| `facets` | `StoryLibraryFacet[]` | `[]` | false | The facet selects, in order; each is `{ id, label, allLabel, options }`. |
| `searchPlaceholder` | `string` | `''` | false | Placeholder of the search field; the field is omitted when this and `searchAriaLabel` are both empty. |
| `searchShortPlaceholder` | `string` | `''` | false | Shorter placeholder of the search field below `lg`; empty uses `searchPlaceholder`. |
| `searchAriaLabel` | `string` | `''` | false | Accessible name of the search field. |
| `emptyTitle` | `string` | `''` | false | Message of the no-match state; the state renders only with it. |
| `emptyActionLabel` | `string` | `''` | false | Label of the no-match state's button that clears every filter; no button renders without it. |
| `linkLabel` | `string` | `''` | false | Read cue at the foot of each card, also the lead of its accessible name. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the grid; without it every match is listed and no button renders. |
| `pageSize` | `number` | `12` | false | Stories listed per page when `moreLabel` is set; the load-more button reveals the next page. |
| `filterLabel` | `string` | `''` | false | Label of the filter button below `lg`; empty uses the locale catalog (`Filters`). |
| `seedFromQuery` | `boolean` | `false` | false | Seeds each facet on mount from the URL query parameter named by its `id` when the value is one of its options. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of stories. |

## States

- Visual states: `default`, `hover` (a card lifts to the raised surface, the read cue brightens and its arrow nudges), `focus-visible` (inset ring)
- Filtered: the search matches the client name and the description; each facet keeps the stories whose `facets[id]` holds the selected value; all filters combine
- Paged: with `moreLabel` set, the first `pageSize` matches render and the load-more button, shown while more remain, adds the next `pageSize`; changing the search or a facet returns to the first page
- Clearing one facet: every select starts with an option labelled by its `allLabel` that clears that facet
- Folded toolbar (below `lg`): a filter button (`aria-expanded`, `aria-controls`) beside the search field shows or hides the selects, stacked (the panel carries `data-state="open|closed"`); its label carries the number of applied facets; every facet set to a value renders a removable `chip` (`<facet label>: <option label>`) whose remove clears it; the field shows `searchShortPlaceholder` when set. From `lg` the selects sit on the toolbar row and the button and chips are hidden (CSS only for the layout; the placeholder switches after mount, so server and client markup match)
- Option search: a select with more than seven options renders a search field above its options and a `status` line when nothing matches
- Seeded: with `seedFromQuery`, on mount (client only) a facet takes the value of `?<id>=` in the URL when it is one of its options
- New tab: a story whose `target` is `_blank` links with `rel="noopener"`
- Empty: when no story matches, the grid and the load-more button give way to `empty-state`, whose action clears the search and every facet; it renders only when `emptyTitle` is set
- `data-last-row-sm` / `data-last-row-lg` mark the cards on the grid's last row so it drops its bottom rule
- Client mark: drawn at the mark row's height, at most `9rem` wide, keeping its aspect ratio; when the card is narrower than that (two columns at 200% zoom) the mark shrinks to the card's width (`min-w-0`) and stays start-aligned, so a mark of any size or aspect ratio never pushes the card past its column

## Accessibility

- Visible focus: every card shows an inset `focus-visible` ring; the field, selects and buttons own theirs.
- Keyboard map: `Tab` moves through the filter button (below `lg`), the search field, each select, the applied-filter chips, the cards and the load-more button; the selects own their keyboard map.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `search` landmark; the field is named by `searchAriaLabel` and each select trigger by its facet `label`; the list is named by `ariaLabel`; the filter button reports `aria-expanded` and controls the selects; each applied chip's remove button is named by the chip; each card link is named `linkLabel: client name`, followed by `(opens in a new tab)` when its `target` is `_blank`, its mark decorative (`alt=""`) and its read cue `aria-hidden`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every card is a full-cell link.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the external-link arrow does not mirror; its hover nudge moves toward the end edge (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

| Key                           | English source         | Override prop |
| ----------------------------- | ---------------------- | ------------- |
| `storyLibrary.search`         | `Search`               | —             |
| `storyLibrary.searchFacet`    | `Search {facet}`       | —             |
| `storyLibrary.noMatch`        | `No results found.`    | —             |
| `storyLibrary.filters`        | `Filters`              | `filterLabel` |
| `storyLibrary.filtersApplied` | `{label} ({count})`    | —             |
| `common.newTab`               | `(opens in a new tab)` | —             |

- Every other string arrives through props.
- Formatting: none.

## Responsive

- Container queries: none; the grid runs one column on phones, two from `sm`, three from `lg`.
- Narrow (< `lg`): the toolbar folds to the filter button and the search field; the selects stack inside the disclosure; applied facets wrap as chips.
- Touch: every card is a full-cell link; the button, field and selects are large.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a client mark shrinks to the card's width.

## Examples

### Default

```vue
<script setup>
  import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import StoryLibrary from '@aziontech/webkit/story-library'
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
        id: 'case-gpa',
        href: '/site/success-cases/gpa',
        client: { name: 'GPA', logo: gpaExtendedReversed },
        category: 'Retail',
        description:
          'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
        facets: { industry: ['Retail'], solution: ['Secure'] }
      },
      {
        id: 'case-axur',
        href: '/site/success-cases/axur',
        client: { name: 'Axur', logo: axurExtendedReversed },
        category: 'Tech',
        description:
          'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
        facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
      },
      {
        id: 'case-exame',
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
        id: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        id: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    search-placeholder="Search by company or story"
    search-aria-label="Search success stories"
    empty-title="No stories match these filters."
    empty-action-label="View all success stories"
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
        id: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        id: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    search-placeholder="Search by company or story"
    search-aria-label="Search success stories"
    empty-title="No stories match these filters."
    empty-action-label="View all success stories"
  />
</template>
```

### Paged

```vue
<script setup>
  import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import StoryLibrary from '@aziontech/webkit/story-library'
</script>

<template>
  <StoryLibrary
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    link-label="Read story"
    more-label="Load more"
    :page-size="2"
    :items="[
      {
        id: 'case-gpa',
        href: '/site/success-cases/gpa',
        client: { name: 'GPA', logo: gpaExtendedReversed },
        category: 'Retail',
        description:
          'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
        facets: { industry: ['Retail'], solution: ['Secure'] }
      },
      {
        id: 'case-axur',
        href: '/site/success-cases/axur',
        client: { name: 'Axur', logo: axurExtendedReversed },
        category: 'Tech',
        description:
          'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
        facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
      },
      {
        id: 'case-exame',
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
        id: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        id: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    search-placeholder="Search by company or story"
    search-short-placeholder="Search stories"
    search-aria-label="Search success stories"
    empty-title="No stories match these filters."
    empty-action-label="View all success stories"
  />
</template>
```
