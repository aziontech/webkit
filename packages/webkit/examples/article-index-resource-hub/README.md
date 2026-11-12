# ArticleIndexResourceHub

Every resource of the Resource Hub as one list, with a headline beside one dropdown per facet.

Every resource is a ruled row: its cover on the left; on the right its overline, headline and a two-line deck, centred, with no byline. Each row is one link, named by its headline, and from `lg` up a "Read article" cue rises into its end on hover or keyboard focus. The dropdowns combine, and when nothing matches the list and its button are left out. Below `lg` the controls stack and the cover sits over the copy.

The list is the `ArticleIndexResourceHub` component from `@aziontech/webkit/article-index-resource-hub`; it composes `SectionModule`, `FrameBox`, `Select`, `Input` and `Button`. The selections are local state. The Blog list is `ArticleIndexBlog` (`@aziontech/webkit/article-index-blog`).

## Examples

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
