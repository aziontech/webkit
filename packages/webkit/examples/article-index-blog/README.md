# ArticleIndexBlog

Every article of the Blog as one list, with a category picker and a search field on one row.

Every article is a ruled row: its cover on the left; on the right its overline, headline, a two-line deck and the writers pinned to the foot. Each row is one link, named by its headline, and from `lg` up a "Read article" cue rises into its end on hover or keyboard focus. The controls combine, and when nothing matches the list and its button are left out. Below `lg` the controls stack and the cover sits over the copy.

The list is the `ArticleIndexBlog` component from `@aziontech/webkit/article-index-blog`; it composes `SectionModule`, `FrameBox`, `ToggleGroup`, `Input`, `Avatar` and `Button`. The selection and the search are local state. The Resource Hub list is `ArticleIndexResourceHub` (`@aziontech/webkit/article-index-resource-hub`).

## Examples

### All Articles

The Blog page's list at rest: All articles selected and no search, with the category picker and the search field, rows with the writers pinned to the foot, and the button into the next page.

Example: [`site-all-articles.vue`](./site-all-articles.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `anchor` is the band id for in-page links.
- `items[]` are the articles, newest first. Each is a `key`, an `href`, an `image`, a `meta` overline, a `title`, a `description`, its `authors` (each a `name`), a `byline`, and the `categories` it is filed under.
- `categories` are the segments of the category picker, `allLabel` the segment that shows every category, and `categoryLabel` its accessible name.
- `search` sets the field's `placeholder` and `label`.
- `rowLabel` is the cue revealed on a row under hover or focus, and `moreLabel` the button into the next page.
- `ariaLabel` names the list for assistive tech.

Example:

Site JSON: [`site-all-articles.json`](./site-all-articles.json)
