# Article Index Blog

> Every article of the blog as one ruled list, with the controls to narrow it on one row: a category picker and a search field. Each article is a row — its cover on the left, and on the right its overline, headline, a two-line deck and its writers with the byline pinned to the foot; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The category and the search combine; a load-more button reveals the next page, and when nothing matches an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'article-index-blog', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `toggle-group`, `input`, `avatar`, `empty-state` and `button`; the selected category, the search term and the page count are local state. A row without a cover draws its client's mark in one flat ink that follows the theme.

- Import: `import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-index-blog.json](https://github.com/aziontech/webkit/blob/main/.specs/article-index-blog.json)

## When to use

- For the blog's full list of posts, filtered by category and searched by text.

## Do

- List the articles newest first; file every article under at least one of `categories`.
- Set `empty` so a reader who filters everything away gets a way back; without it the list just disappears.
- Set `leading` to the number of articles a highlight band above already shows, so they are not listed twice until the reader filters.
- Keep the category list short enough to scroll on one row: the picker keeps every label at its full width and the row scrolls sideways on a phone instead of squeezing the labels.

## Don’t

- For a resource hub filtered by facet dropdowns, with centred rows and no byline → use `article-index-resource-hub`.
- For a closing row of related articles → use `article-cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [article-index-resource-hub](article-index-resource-hub.md) — the sibling listing with facet dropdowns.
- [article-highlight](article-highlight.md) — the band that opens the blog above this list.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline beside the controls, rendered as the band's `h2`; it also names the band. |
| `items` | `ArticleIndexBlogItem[]` | `[]` | false | The articles, newest first; each is `{ key, href, image?, mark?, meta, title, description?, authors?, byline?, categories?, external? }`. |
| `categories` | `string[]` | `[]` | false | Segments of the category picker after the show-all segment; the picker is omitted when empty. |
| `allLabel` | `string` | `''` | false | Label of the first segment, which shows every category. |
| `categoryLabel` | `string` | `''` | false | Accessible name of the category picker. |
| `search` | `ArticleIndexBlogSearch` | `undefined` | false | The search field's `placeholder` and accessible `label`; the field is omitted when absent. |
| `rowLabel` | `string` | `''` | false | Read cue revealed at the end of a row under hover or focus. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the list; without it every match is listed and no button renders. |
| `pageSize` | `number` | `12` | false | Rows listed per page when `moreLabel` is set; the load-more button reveals the next page. |
| `leading` | `number` | `0` | false | Leading articles left out until a filter applies, because a band above already shows them. |
| `empty` | `ArticleIndexBlogEmpty` | `undefined` | false | Copy of the state when nothing matches: `{ title, description?, action? }`; `action` labels a button that clears every filter. |
| `rowKind` | `ArticleIndexBlogRowKind` | `'byline'` | false | Row layout: `byline` pins the writers to the foot of the copy, `centered` centres the copy. |
| `categoryParam` | `string` | `''` | false | Name of a URL query parameter that preselects a category on load and scrolls the band into view; off when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of articles. |

## States

- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- Filtered: the selected category keeps the articles whose `categories` hold it, the show-all segment keeps every one; the search matches the title and the description; both combine
- Paged: with `moreLabel` set, the first `pageSize` matches render and the load-more button, shown while more remain, adds the next `pageSize`; changing the category or the search returns to the first page
- Leading: until a category other than show-all or a search term applies, the first `leading` articles are skipped
- Empty: when no article matches, the list and the load-more button are not rendered; with `empty` set, an `EmptyState` (search icon) renders its title and description, and its `action` button clears the category and the search
- `data-kind` on the list mirrors `rowKind`: `byline` spreads the copy so the byline sits at the foot, `centered` centres it
- A row with no `image` draws its `mark` (the client's logo, flattened to one ink that inverts in the dark theme); an author with an `avatar` URL shows the photo, otherwise the initials
- An `external` row opens in a new tab (`target="_blank"`, `rel="noopener"`)
- `categoryParam`: on mount (client only) a query value that matches one of `categories` selects it and scrolls the band into view

## Accessibility

- Visible focus: the headline link draws an inset ring over the whole row; the picker, field and button own theirs.
- Keyboard map: `Tab` moves through the category picker, the search field, each row and the load-more button; the picker owns its arrow-key map.
- ARIA: the band is a `<section>` named by `title` (`aria-label`) when one is set, with the title as its `h2`; the toolbar is a `search` landmark; the picker is a radio group named by `categoryLabel`, the field named by `search.label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`), a client mark is named by the client, and the read cue `aria-hidden`; an `external` row appends the visually hidden `(opens in a new tab)` to its link; the empty state is a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.

## Right-to-left

- Layout: logical utilities only (`border-e`, `ps-`/`pe-`); the cover cell sits at the inline start.
- Icons: the read cue's `pi-arrow-up-right` and the search glyph do not mirror; client marks never mirror.
- Keyboard: the category picker owns its arrow-key map under `rtl`.
- User data: none.

## Internationalization

| Key | English source | Override prop |
|---|---|---|
| `articleIndex.newTab` | `(opens in a new tab)` | — |

- Every other string (labels, placeholders, the empty state's copy) arrives through props.
- Formatting: none; dates arrive pre-formatted in `meta`.

## Responsive

- Container queries: none; from `lg` the toolbar sits on one row and each row splits cover and copy 2:5.
- Narrow (≤ 640 px): the toolbar stacks, the category picker scrolls sideways at full label width, and each row stacks its cover above the copy; the read cue is hidden.
- Touch: every row is a full-row link; the read cue is a hover/focus extra, never the only affordance.
- Reflow: no horizontal page scroll at 320 px; only the category picker scrolls inside its own box.

## Examples

### Default

```vue
<script setup>
  import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndexBlog
    anchor="posts"
    all-label="All articles"
    category-label="Category"
    row-label="Read article"
    more-label="Load more"
    aria-label="Articles"
    :categories="['Developers', 'Security', 'Company news', 'Serverless']"
    :search="{ placeholder: 'Search articles', label: 'Search articles' }"
    :items="[
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: placeholderImage,
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description:
          'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
        authors: [{ name: 'Patrick Menoti' }],
        byline: 'Patrick Menoti · 9 min read',
        categories: ['Developers']
      },
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        image: placeholderImage,
        meta: 'Serverless • SEP 23, 2026',
        title: 'How Do You Reduce AI Agent Latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
        authors: [{ name: 'Marilia Bafutto Costa' }],
        byline: 'Marilia Bafutto Costa · 8 min read',
        categories: ['Serverless']
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        image: placeholderImage,
        meta: 'Security • SEP 22, 2026',
        title: 'Best Cloudflare Alternatives and Competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
        authors: [{ name: 'Vitor Eltz' }],
        byline: 'Vitor Eltz · 13 min read',
        categories: ['Security']
      }
    ]"
  />
</template>
```

### Empty

```vue
<script setup>
  import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndexBlog
    anchor="posts"
    title="All articles"
    all-label="All articles"
    category-label="Category"
    row-label="Read article"
    more-label="Load more"
    aria-label="Articles"
    :categories="['Developers', 'Security']"
    :search="{ placeholder: 'Search articles', label: 'Search articles' }"
    :empty="{
      title: 'No articles match these filters',
      description: 'Try another category or a shorter search.',
      action: 'View all articles'
    }"
    :items="[
      {
        key: 'ship-a-site-in-two-commands',
        href: '/blog/ship-a-site-in-two-commands',
        image: placeholderImage,
        meta: 'Developers • SEP 25, 2026',
        title: 'Ship a Site in Two Commands',
        description: 'From a template to a live URL with one command to start and one to deploy.',
        authors: [{ name: 'Jane Doe' }],
        byline: 'Jane Doe · 9 min read',
        categories: ['Developers']
      }
    ]"
  />
</template>
```
