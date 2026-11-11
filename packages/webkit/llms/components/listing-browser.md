# Listing Browser

> The full, browsable listing of a page such as the Careers jobs list: a headline over a toolbar (a search field, one select per facet and one for the order) and every row under its group, as a table from the small breakpoint up and as a list of items below it, with an empty state when nothing matches. Search, facets and order are local state over the rows the page carries; a facet is seeded from `?<key>=` in the URL when the value is one the page offers. It is a page section — the site places it from a `{ _id: 'listing-browser', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box`, `input`, `select`, `table`, `item`, `empty-state` and `button` rather than owning any anatomy of its own.

- Import: `import ListingBrowser from '@aziontech/webkit/listing-browser'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [listing-browser.json](https://github.com/aziontech/webkit/blob/main/.specs/listing-browser.json)

## When to use

- For a listing a reader narrows by text and by a few facets, such as open positions grouped by department.
- When every row links to its own page and the listing fits in the page JSON.

## Do

- Name the first column after what the row is (`Role`); it is the row's link, and the second column describes the row on phones.
- Give every row the facet values it carries under the facet's `key`, so the selects narrow it.
- Keep `groups` in the order the reader scans; rows of a group not listed there are not shown.
- Make the first entry of `sorts` the order the page is authored in, with an empty `by`.

## Don’t

- For a short, unfiltered preview of the same rows → use `listing-table`.
- For a data table with sorting, selection and pagination inside the product → use `table`.
- For a grid of linked topic cards → use `subject-library`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — the composed rows and cells the listing renders from the small breakpoint up.
- [item](item.md) — the list rows the listing renders below the small breakpoint.
- [empty-state](empty-state.md) — the state shown when the search and facets match nothing.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page `id` of the band, the target of a `#hash` link. |
| `title` | `string` | `''` | false | Headline over the listing, rendered by the section title as its `h2` and naming the band. |
| `columns` | `ListingBrowserColumn[]` | `[]` | false | The columns, left to right; each is `{ key, label, grow?, align? }`. The first names the row and links it, the second describes it on phones. |
| `rows` | `ListingBrowserRow[]` | `[]` | false | Every row, in source order; each is `{ href, group, values, facets }` where `values` and `facets` are keyed by column and facet. |
| `groups` | `string[]` | `[]` | false | The groups the rows are listed under, in order; a group with no matching row is not shown. |
| `facets` | `ListingBrowserFacet[]` | `[]` | false | The facet selects; each is `{ key, label, allLabel, options }` where `key` matches a row facet and seeds it from `?key=` in the URL, and every option is `{ value, label }`. |
| `sorts` | `ListingBrowserSort[]` | `[]` | false | The orders, the first the default; each is `{ value, label, by? }` where `by` is the column it sorts on and an empty `by` keeps the source order. |
| `sortAriaLabel` | `string` | `''` | false | Accessible name of the order select. |
| `search` | `ListingBrowserSearch` | `undefined` | false | The search field; `{ placeholder, shortPlaceholder, label }` where `shortPlaceholder` is used below the large breakpoint and `label` names the field. Omitted when absent. |
| `empty` | `ListingBrowserEmpty` | `undefined` | false | The state shown when nothing matches; `{ title, description, clearLabel }` where `clearLabel` is the button that clears the search and every facet. Omitted when absent. |

## States

- Visual states: `default`, `filtered`, `empty`
- Filtered: the search matches a row when any of its values contains the query, ignoring case; every facet set to a value keeps only the rows carrying it; the order select sorts on its column or keeps the source order
- Empty: when the search and facets match no row, `empty-state` replaces the table and the list, and its button clears the search and every facet; without `empty`, nothing is shown in their place
- Seeded: on mount a facet takes the value of `?<key>=` in the URL when it is one of its options
- Absent: when `rows` is empty the band renders nothing — not the header, not the toolbar
- The table renders from the small breakpoint up, the list below it; the toolbar stacks below the large breakpoint, where the search field shows `shortPlaceholder`
- Server render and hydration: the large-breakpoint check runs only after mount, so the server HTML and the first client render both use `shortPlaceholder` and match; the full placeholder applies on mount.

## Accessibility

- Visible focus: owned by the composed `input`, `select` and `button`; each row link draws `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the row it stretches over.
- Keyboard map: `Tab` moves through the search field, the selects and the row links in reading order; a select opens on `Enter`, `Space` or `ArrowDown`, moves with the arrows and closes on `Escape` (all `select`'s own); `Enter` follows a row link.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `role="search"` region; the search field is named by `search.label`, each facet select by its `label` and the order select by `sortAriaLabel`; each group is an `h3`; the table is `table`'s `role="table"`, and the phone list is `item`'s `role="list"` of `role="listitem"` rows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): row links and group headings `var(--text-default)`, headers and meta `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the field, select and button transitions belong to the composed components, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the search field, selects and empty-state button are large; each row link stretches over its whole row.

## Examples

### Default

```vue
<script setup>
  import ListingBrowser from '@aziontech/webkit/listing-browser'
</script>

<template>
  <ListingBrowser
    title="Open positions"
    :columns="[
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ]"
    :rows="[
      {
        href: '/careers/software-engineer-go',
        group: 'Engineering',
        values: {
          role: 'Software Engineer (Go)',
          team: 'Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        },
        facets: { area: ['Engineering'], location: ['Porto Alegre'] }
      },
      {
        href: '/careers/grc-analyst',
        group: 'Security',
        values: {
          role: 'GRC Analyst (Governance, Risk & Compliance)',
          team: 'Compliance and Corporate IT · Porto Alegre / São Paulo',
          type: 'Hybrid · Full-time'
        },
        facets: { area: ['Security'], location: ['Porto Alegre', 'São Paulo'] }
      }
    ]"
    :groups="['Engineering', 'Security']"
    :facets="[
      {
        key: 'area',
        label: 'Department',
        allLabel: 'All departments',
        options: [
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Security', label: 'Security' }
        ]
      },
      {
        key: 'location',
        label: 'Location',
        allLabel: 'All locations',
        options: [
          { value: 'São Paulo', label: 'São Paulo, Brazil' },
          { value: 'Porto Alegre', label: 'Porto Alegre, Brazil' }
        ]
      }
    ]"
    :sorts="[
      { value: 'newest', label: 'Newest posted', by: '' },
      { value: 'title', label: 'Title (A–Z)', by: 'role' }
    ]"
    sort-aria-label="Sort positions"
    :search="{
      placeholder: 'Search by title, team, or location',
      shortPlaceholder: 'Search positions',
      label: 'Search positions'
    }"
    :empty="{
      title: 'Nothing here yet',
      description: 'No open positions match your search.',
      clearLabel: 'View all open positions'
    }"
  />
</template>
```
