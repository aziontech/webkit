# Article Index Resource Hub

> Every resource of a hub as one ruled list, with a headline and one searchable dropdown per facet (content type, category, industry) on one row that wraps when it runs out of room. Each resource is a row — its cover on the left, and on the right its overline, headline and a two-line deck centred in the row; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The facets combine; a load-more button closes the list. It is a page section — the site places it from a `{ _id: 'article-index-resource-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `select`, `input` and `button`; the facet selections and each dropdown's option search are local state.

- Import: `import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-index-resource-hub.json](https://github.com/aziontech/webkit/blob/main/.specs/article-index-resource-hub.json)

## When to use

- For a resource hub that mixes content types (e-books, posts, comparisons, stories), filtered by facet.

## Do

- Give every item a `facets` entry per facet `key` it can be filtered by; an item without one never matches a selection on that facet.
- Keep each facet's `options` to values some item carries.

## Don’t

- For the blog's list filtered by a category picker and a search field, with bylines → use `article-index-blog`.
- For the success-story library with a card grid → use `story-library`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [article-index-blog](article-index-blog.md) — the sibling listing with a category picker and a search field.
- [story-library](story-library.md) — the card-grid library with search and facets.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline beside the dropdowns, rendered as the band's `h2`. |
| `items` | `ArticleIndexResourceHubItem[]` | `[]` | false | The resources, in order; each is `{ key, href, image, meta, title, description, facets? }`. |
| `facets` | `ArticleIndexResourceHubFacet[]` | `[]` | false | The facet dropdowns, in order; each is `{ key, label, allLabel, options }`. |
| `rowLabel` | `string` | `''` | false | Read cue revealed at the end of a row under hover or focus. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the list; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of resources. |

## States

- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- Filtered: each facet keeps the resources whose `facets[key]` holds the selected value; its `allLabel` option keeps every one; the facets combine
- Empty: when no resource matches, the list and the load-more button are not rendered
- `data-kind="centered"` on the list: the copy is centred in the row

## Accessibility

- Visible focus: the headline link draws an inset ring over the whole row; the dropdowns and button own theirs.
- Keyboard map: `Tab` moves through each dropdown, each row and the load-more button; the dropdowns own their keyboard map.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `search` landmark; each dropdown trigger is named by its facet `label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`) and the read cue `aria-hidden`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.
- Reflow: from `sm` the facet dropdowns sit on one row that wraps (`flex-wrap`), so two or more `w-56` dropdowns never overflow a narrow box or a 200% zoom.

## Examples

### Default

```vue
<script setup>
  import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'
</script>

<template>
  <ArticleIndexResourceHub
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
