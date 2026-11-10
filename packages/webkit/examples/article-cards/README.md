# ArticleCards

A titled row of three article cards on one hairline grid with no gutter, stacking to one column on mobile. Each card is a single link: a 16:9 media cell, then the headline, the deck, and a `date • read time` overline pinned to the foot.

The media cell holds the article's cover. When the article has no cover, it holds the client's mark, drawn in one flat ink that follows the theme. On hover the card lifts to the raised surface and the media scales up slightly. The band closes every blog post with its related articles and every success story with its related stories.

The band is the `ArticleCards` component from `@aziontech/webkit/article-cards`; it composes `SectionModule`, `SectionTitle`, `FrameBox` and `CardGrid` (`CardGrid.Cell`). `kind` places the heading: `left` (an article's closing row) or `centered` (a landing-page band). Every variant uses the one `_id`, `article-cards`.

## Stories

### Related Articles

The blog post's closing band: three related posts, each with its cover image.

Example: [`site-related-articles.vue`](./site-related-articles.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `kind` is `left`, and `title` is the band heading, set at the left.
- `items[]` are the cards, each a `key`, an `href`, a `title`, a `description` and a `meta` overline (date and read time), plus an `image` cover or, when there is none, a client `mark` with its `name` and `logo`.
- `ariaLabel` names the grid for assistive tech.

Example:

Site JSON: [`site-related-articles.json`](./site-related-articles.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Related Success Cases

The Magalu story's closing band: the next three Retail stories in the library's order, Netshoes, Renner and GPA. A story has no cover, so each card draws its client's mark.

Example: [`site-related-success-cases.vue`](./site-related-success-cases.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `kind` is `left`, and `title` is the band heading, set at the left.
- `items[]` are the cards, each a `key`, an `href`, a `title`, a `description` and a `meta` overline (date and read time), plus an `image` cover or, when there is none, a client `mark` with its `name` and `logo`. Success stories have no cover, so each card carries its `mark`.
- `ariaLabel` names the grid for assistive tech.

Example:

Site JSON: [`site-related-success-cases.json`](./site-related-success-cases.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Centered

The title centred and balanced over the cards under an overline, as a landing-page band instead of an article's closing row (Under attack).

Example: [`site-centered.vue`](./site-centered.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `kind` is `centered`: the heading is centred over the cards.
- `eyebrow` and `title` make the heading.
- `items[]` are the cards, each a `key`, an `href`, a `title`, a `description` and a `meta` overline (date and read time), plus an `image` cover or, when there is none, a client `mark` with its `name` and `logo`.
- `ariaLabel` names the grid for assistive tech.

Example:

Site JSON: [`site-centered.json`](./site-centered.json)
