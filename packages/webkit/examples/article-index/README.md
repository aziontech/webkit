# ArticleIndex

Every article of a listing as one list, with the controls to narrow it on one row. The Blog narrows its list with a category picker and a search field; the Resource Hub with a headline beside one dropdown per facet.

Every article is a ruled row: its cover on the left; on the right its overline, headline, a two-line deck and, on the Blog, the writers pinned to the foot. The Resource Hub's rows have no byline and centre their copy. Each row is one link, named by its headline, and from `lg` up a "Read article" cue rises into its end on hover or keyboard focus. The controls combine, and when nothing matches the list and its button are left out. Below `lg` the controls stack and the cover sits over the copy.

The two listings take different data, so they are two components. The Blog list is the `ArticleIndexBlog` component from `@aziontech/webkit/article-index-blog`; it composes `SectionModule`, `FrameBox`, `SegmentedButton`, `InputText`, `Avatar` and `Button`. The Resource Hub list is the `ArticleIndexResourceHub` component from `@aziontech/webkit/article-index-resource-hub`; it composes `SectionModule`, `FrameBox`, `Select`, `InputText` and `Button`. The selections and the search are local state in each.

## Stories

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

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Resource Hub

The Resource Hub's list: a headline beside three facet dropdowns (content type, category, industry), with rows that centre their copy, each a cover, its type and date, its headline and its deck.

Example: [`site-resource-hub.vue`](./site-resource-hub.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `anchor` is the band id for in-page links, and `title` the headline beside the filters.
- `items[]` are the resources. Each is a `key`, an `href`, an `image`, a `meta` overline, a `title` and a `description`, with `facets` holding its value for each dropdown.
- `facets[]` are the dropdowns, each a `key`, a `label`, an `allLabel` and its `options`.
- `rowLabel` is the cue revealed on a row under hover or focus, and `moreLabel` the button into the next page.
- `ariaLabel` names the list for assistive tech.

Example:

Site JSON: [`site-resource-hub.json`](./site-resource-hub.json)
