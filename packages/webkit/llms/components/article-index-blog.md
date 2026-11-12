# Article Index Blog

> Every article of the blog as one ruled list, with the controls to narrow it on one row: a category picker and a search field. Each article is a row — its cover on the left, and on the right its overline, headline, a two-line deck and its writers with the byline pinned to the foot; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The category and the search combine; a load-more button closes the list. It is a page section — the site places it from a `{ _id: 'article-index-blog', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `toggle-group`, `input`, `avatar` and `button`; the selected category and the search term are local state.

- Import: `import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-index-blog.json](https://github.com/aziontech/webkit/blob/main/.specs/article-index-blog.json)

## When to use

- For the blog's full list of posts, filtered by category and searched by text.

## Do

- List the articles newest first; file every article under at least one of `categories`.
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
| `items` | `ArticleIndexBlogItem[]` | `[]` | false | The articles, newest first; each is `{ key, href, image, meta, title, description, authors?, byline?, categories? }`. |
| `categories` | `string[]` | `[]` | false | Segments of the category picker after the show-all segment; the picker is omitted when empty. |
| `allLabel` | `string` | `''` | false | Label of the first segment, which shows every category. |
| `categoryLabel` | `string` | `''` | false | Accessible name of the category picker. |
| `search` | `ArticleIndexBlogSearch` | `undefined` | false | The search field's `placeholder` and accessible `label`; the field is omitted when absent. |
| `rowLabel` | `string` | `''` | false | Read cue revealed at the end of a row under hover or focus. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the list; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of articles. |

## States

- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- Filtered: the selected category keeps the articles whose `categories` hold it, the show-all segment keeps every one; the search matches the title and the description; both combine
- Empty: when no article matches, the list and the load-more button are not rendered
- `data-kind="byline"` on the list: the copy is spread so the byline sits at the foot

## Accessibility

- Visible focus: the headline link draws an inset ring over the whole row; the picker, field and button own theirs.
- Keyboard map: `Tab` moves through the category picker, the search field, each row and the load-more button; the picker owns its arrow-key map.
- ARIA: the band is a `<section>` (unnamed, no header); the toolbar is a `search` landmark; the picker is a radio group named by `categoryLabel`, the field named by `search.label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`) and the read cue `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.

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
