# SubjectLibrary

A library of subjects in a divider grid. Each subject is one card with its name, what it covers, and a list of its article links.

A call to action closes the grid and spans its last two cells, so the grid has no empty cell at any breakpoint. The Learning Center renders it.

The band is the `SubjectLibrary` component from `@aziontech/webkit/subject-library`; it composes `SectionModule`, `FrameBox`, `CardGrid`, `CallToAction` and `Button`.

## Examples

### Default

The first four Learning Center subjects with their articles, and the closing call to action in the grid's last two cells.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `anchor` gives the band an id for in-page links.
- `subjects[]` are the cards, each a `slug` (the card's id), a `title`, a `description` and its `articles` as `label` and `href` links. A subject without a title or a linked article is skipped.
- `closing` is the call to action across the last two cells: `eyebrow`, `title`, `titleMuted`, `description`, a `primaryAction` and a `secondaryAction`, each a `label`, an `href` and `trailing` for the chevron. Leave it out and the grid ends on the last subject.

Example:

Site JSON: [`site-default.json`](./site-default.json)
