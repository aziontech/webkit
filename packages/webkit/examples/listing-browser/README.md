# ListingBrowser

The full listing that a ListingTable previews, with the controls to narrow it. A search field, one select per facet and one for the order sit on a single row; below them every row sits under its group, with a rule between groups. Below `lg` the controls stack.

It shares ListingTable's anatomy: overline column headers, one link per row named by its first column, and a list of items below `sm`. It adds a group row in the overline face over each group's rows. Careers uses it for its jobs list, grouped by department and narrowed by department and location.

The band is the `ListingBrowser` component from `@aziontech/webkit/listing-browser`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `InputText`, `Select`, `Table`, `EmptyState`, `Button` and, on phones, `Item`. Search, facets and order run in the browser over the rows the page carries.

## Stories

### Open Positions

The Careers jobs list at rest: every department and location, newest first, with Engineering and Security as the groups shown.

Example: [`site-open-positions.vue`](./site-open-positions.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `title` heads the listing; `anchor` gives the band an id for in-page links.
- `columns` are the columns left to right, each a `key`, a `label`, and an optional `grow` (1, 2 or 3) and `align` (`start` or `end`). The first column names the row and the second describes it on phones.
- `rows[]` are every row, each an `href`, its `values` keyed by column, the `group` it sits under, and its `facets` keyed by facet.
- `groups` lists the groups in order.
- `facets[]` are the selects, each a `key` that matches a row facet (and seeds it from `?<key>=`), a `label`, an `allLabel` and its `options` as `value` and `label`.
- `sorts[]` are the orders, the first the default, each a `value`, a `label` and the column `by` it sorts on (empty keeps the source order); `sortAriaLabel` names the order select.
- `search` is the field's `placeholder`, its `shortPlaceholder` below `lg`, and its `label`; `empty` is the `title`, `description` and `clearLabel` (the button that clears the search and every facet) shown when nothing matches.

Example:

Site JSON: [`site-open-positions.json`](./site-open-positions.json)
