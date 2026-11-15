# Article Index

> Every article or resource of a blog or a resource hub as one ruled list, with the controls to narrow it on one row. `filters` picks the filter bar: `category-search` draws a category picker and a search field (the blog), `facets` draws one dropdown per facet — content type, category, industry — that wraps when it runs out of room (a resource hub). Each entry is a row — its cover on the left, and on the right its overline, headline, a deck and, when it has them, its writers with the byline; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The filters combine; a facet dropdown with more than seven options gains an option search; a load-more button reveals the next page, and when nothing matches an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'article-index', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `toggle-group`, `select`, `input`, `avatar`, `empty-state` and `button`; the selected category, the search term, the facet selections, each dropdown's option search and the page count are local state. A row without a cover draws its client's mark in one flat ink that follows the theme.

- Import: `import ArticleIndex from '@aziontech/webkit/article-index'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-index.json](https://github.com/aziontech/webkit/blob/main/.specs/article-index.json)

## When to use

- Use ArticleIndex for the full filterable list of articles or resources; choose the filter bar with `filters`: `category-search` for the blog (category picker and search field), `facets` for a resource hub (one dropdown per facet).

## Do

- With `filters="category-search"`, list the articles newest first and file every article under at least one of `categories`; keep the category list short enough to scroll on one row.
- With `filters="facets"`, give every item a `facets` entry per facet `key` it can be filtered by (an item without one never matches a selection on that facet), and keep each facet's `options` to values some item carries.
- Set `empty` so a reader who filters everything away gets a way back; without it the list just disappears.
- Set `leading` to the number of entries a highlight band above already shows, so they are not listed twice until the reader filters.
- Leave `rowKind` unset to get the layout that fits the filter bar: `byline` for `category-search`, `centered` for `facets`.

## Don’t

- For a card grid of customer stories with search and facets → use `story-library`.
- For a filterable list of non-article rows (jobs) → use `listing-browser`.
- For a closing row of related articles → use `article-cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [article-highlight](article-highlight.md) — the band that opens the blog above this list.
- [story-library](story-library.md) — the card-grid library with search and facets.
- [listing-browser](listing-browser.md) — the filterable list of job rows.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline beside the controls, rendered as the band's `h2`; it also names the band. |
| `filters` | `ArticleIndexFilters` | `'category-search'` | false | Filter bar: `category-search` draws the category picker and the search field, `facets` draws one dropdown per facet. |
| `items` | `ArticleIndexItem[]` | `[]` | false | The entries, in order; each is `{ key, href, image?, mark?, meta, title, description?, authors?, byline?, categories?, facets?, external? }`. |
| `categories` | `string[]` | `[]` | false | Segments of the category picker after the show-all segment (`category-search`); the picker is omitted when empty. |
| `allLabel` | `string` | `''` | false | Label of the first category segment, which shows every category (`category-search`). |
| `categoryLabel` | `string` | `''` | false | Accessible name of the category picker (`category-search`). |
| `search` | `ArticleIndexSearch` | `undefined` | false | The search field's `placeholder` and accessible `label` (`category-search`); the field is omitted when absent. |
| `facets` | `ArticleIndexFacet[]` | `[]` | false | The facet dropdowns, in order (`facets`); each is `{ key, label, allLabel, options }`. |
| `rowLabel` | `string` | `''` | false | Read cue revealed at the end of a row under hover or focus. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the list; without it every match is listed and no button renders. |
| `pageSize` | `number` | `12` | false | Rows listed per page when `moreLabel` is set; the load-more button reveals the next page. |
| `leading` | `number` | `0` | false | Leading entries left out until a filter applies, because a band above already shows them. |
| `empty` | `ArticleIndexEmpty` | `undefined` | false | Copy of the state when nothing matches: `{ title, description?, action? }`; `action` labels a button that clears every filter. |
| `rowKind` | `ArticleIndexRowKind` | `undefined` | false | Row layout: `byline` pins the writers to the foot of the copy, `centered` centres the copy; unset, `byline` for `category-search` and `centered` for `facets`. |
| `categoryParam` | `string` | `''` | false | Name of a URL query parameter that preselects a category on load and scrolls the band into view (`category-search`); off when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. |

## States

- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- `data-filters` on the list mirrors `filters`; `category-search` clamps the deck to two lines in `text-body-sm`, `facets` sets it in full in `text-body-lg`
- Filtered (`category-search`): the selected category keeps the entries whose `categories` hold it, the show-all segment keeps every one; the search matches the title and the description; both combine
- Filtered (`facets`): each facet keeps the entries whose `facets[key]` holds the selected value; its `allLabel` option keeps every one; the facets combine
- Option search (`facets`): a dropdown whose `options` number more than seven renders a search field above its options; shorter lists render none
- Paged: with `moreLabel` set, the first `pageSize` matches render and the load-more button, shown while more remain, adds the next `pageSize`; changing a filter returns to the first page
- Leading: until a filter applies, the first `leading` entries are skipped
- Empty: when no entry matches, the list and the load-more button are not rendered; with `empty` set, an `EmptyState` (search icon) renders its title and description, and its `action` button clears every filter
- `data-kind` on the list mirrors the row layout: `byline` spreads the copy so the byline sits at the foot, `centered` centres it
- A row with no `image` draws its `mark` (the client's logo, flattened to one ink that inverts in the dark theme); an author with an `avatar` URL shows the photo, otherwise the initials
- An `external` row opens in a new tab (`target="_blank"`, `rel="noopener"`)
- `categoryParam` (`category-search`): on mount (client only) a query value that matches one of `categories` selects it and scrolls the band into view

## Accessibility

- Visible focus: the headline link draws an inset ring over the whole row; the picker, field, dropdowns and button own theirs.
- Keyboard map: `Tab` moves through the filter controls, each row and the load-more button; the category picker owns its arrow-key map and each dropdown owns its keyboard map.
- ARIA: the band is a `<section>` named by `title` (`aria-label`) when one is set, with the title as its `h2`; the toolbar is a `search` landmark; the category picker is a radio group named by `categoryLabel`, the field named by `search.label`, each dropdown trigger named by its facet `label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`), a client mark is named by the client, and the read cue `aria-hidden`; an `external` row appends the visually hidden `(opens in a new tab)` to its link; the empty state is a `status`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.

## Right-to-left

- Layout: logical utilities only (`border-e`, `ps-`/`pe-`); the cover cell sits at the inline start.
- Icons: the read cue's `ai-arrow-up-right` and the search glyph do not mirror; client marks never mirror.
- Keyboard: the category picker and the dropdowns own their keyboard maps under `rtl`.
- User data: none.

## Internationalization

| Key | English source | Override prop |
|---|---|---|
| `articleIndex.search` | `Search` | — |
| `articleIndex.searchFacet` | `Search {facet}` | — |
| `articleIndex.empty` | `No results found.` | — |
| `articleIndex.newTab` | `(opens in a new tab)` | — |

- Every other string (labels, placeholders, facet labels, the empty state's copy) arrives through props.
- Formatting: none; dates arrive pre-formatted in `meta`.

## Responsive

- Container queries: none; from `lg` the toolbar sits on one row and each row splits cover and copy 2:5.
- Narrow (≤ 640 px): the toolbar stacks; the category picker scrolls sideways at full label width, the facet dropdowns stack at full width; each row stacks its cover above the copy; the read cue is hidden.
- Touch: every row is a full-row link; the read cue is a hover/focus extra, never the only affordance.
- Reflow: no horizontal page scroll at 320 px and 200 % zoom; only the category picker scrolls inside its own box, and from `sm` the facet dropdowns wrap.

## Examples

### Default

```vue
<script setup>
  import ArticleIndex from '@aziontech/webkit/article-index'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndex
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

### Facets

```vue
<script setup>
  import ArticleIndex from '@aziontech/webkit/article-index'
</script>

<template>
  <ArticleIndex
    filters="facets"
    anchor="resources"
    title="Explore all resources"
    row-label="Read article"
    more-label="Load more"
    aria-label="Resources"
    :facets="[
      {
        key: 'contentType',
        label: 'Content type',
        allLabel: 'All content types',
        options: ['E-books', 'Blog', 'Comparisons']
      },
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: ['Financial', 'Retail', 'Tech']
      }
    ]"
    :items="[
      {
        key: 'security-applications-apis-ai-agents',
        href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
        image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
        meta: 'E-books • OCT 15, 2026',
        title: 'Security for applications, APIs, and AI agents',
        description:
          'Learn how to bring security policies into deployment, automate protection, and monitor traffic.',
        facets: { contentType: ['E-books'] }
      },
      {
        key: 'azion-mcp-servers-generally-available',
        href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
        image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg',
        meta: 'Blog • OCT 14, 2026',
        title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
        description: 'Azion MCP servers connect coding agents to the Azion documentation and API.',
        facets: { contentType: ['Blog'] }
      },
      {
        key: 'cloudflare-to-azion-alternative-guide',
        href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
        image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png',
        meta: 'Comparisons • OCT 3, 2026',
        title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
        description: 'Azion vs Cloudflare: the same platform on every plan.',
        facets: { contentType: ['Comparisons'] }
      }
    ]"
  />
</template>
```

### Empty

```vue
<script setup>
  import ArticleIndex from '@aziontech/webkit/article-index'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndex
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
