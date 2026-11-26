# ArticleIndexSection

Every article of the Blog, or every resource of the Resource Hub, as one list, with the controls to narrow it on one row. `filters` picks the controls: `category-search` (the default) draws a category picker and a search field, `facets` draws a headline beside one dropdown per facet.

Every entry is a ruled row: its cover on the left; on the right its overline, headline and deck, and the writers pinned to the foot when it has them. With `category-search` the rows use the byline layout and a two-line deck; with `facets` they centre their copy. Each row is one link, named by its headline, and from `lg` up a "Read article" cue rises into its end on hover or keyboard focus. The controls combine, and when nothing matches the list and its button are left out. Below `lg` the controls stack and the cover sits over the copy.

The list is the `ArticleIndexSection` component from `@aziontech/webkit/article-index-section`; it composes `Module`, `RegistrationFrame`, `ToggleGroup`, `Select`, `Input`, `Avatar` and `Button`. The selections and the search are local state. For a card grid of customer stories use `StoryIndexSection`; for job rows use `ListingIndexSection`.

## Examples

### All Articles

The Blog page's list at rest: All articles selected and no search, with the category picker and the search field, rows with the writers pinned to the foot, and the button into the next page.

Example: [`site-all-articles.vue`](./site-all-articles.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `anchor` is the band id for in-page links.
- `items[]` are the articles, newest first. Each is an `id`, an `href`, an `image`, a `meta` overline, a `title`, a `description`, its `authors` (each a `name`), a `byline`, and the `categories` it is filed under.
- `categories` are the segments of the category picker, `allLabel` the segment that shows every category, and `categoryAriaLabel` its accessible name.
- `searchPlaceholder` and `searchAriaLabel` set the field's placeholder and accessible name.
- `rowLabel` is the cue revealed on a row under hover or focus, and `moreLabel` the button into the next page.
- `ariaLabel` names the list for assistive tech.

Example:

Site JSON: [`site-all-articles.json`](./site-all-articles.json)

### Resource Hub

The Resource Hub's list: a headline beside three facet dropdowns (content type, category, industry), with rows that centre their copy, each a cover, its type and date, its headline and its deck.

Example: [`site-resource-hub.vue`](./site-resource-hub.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `filters` is `facets`, for one dropdown per facet.
- `anchor` is the band id for in-page links, and `title` the headline beside the filters.
- `items[]` are the resources. Each is an `id`, an `href`, an `image`, a `meta` overline, a `title` and a `description`, with `facets` holding its value for each dropdown.
- `facets[]` are the dropdowns, each an `id`, a `label`, an `allLabel` and its `options`.
- `rowLabel` is the cue revealed on a row under hover or focus, and `moreLabel` the button into the next page.
- `ariaLabel` names the list for assistive tech.

Example:

Site JSON: [`site-resource-hub.json`](./site-resource-hub.json)
