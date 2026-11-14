# Article Index Resource Hub

> Every resource of a hub as one ruled list, with a headline and one dropdown per facet (content type, category, industry) on one row that wraps when it runs out of room. Each resource is a row — its cover on the left, and on the right its overline, headline and a two-line deck centred in the row; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The facets combine; a dropdown with more than seven options gains an option search; a load-more button reveals the next page, and when nothing matches an empty state offers to clear every facet. It is a page section — the site places it from a `{ _id: 'article-index-resource-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `select`, `input`, `empty-state` and `button`; the facet selections, each dropdown's option search and the page count are local state. A row without a cover draws its client's mark in one flat ink that follows the theme.

- Import: `import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-index-resource-hub.json](https://github.com/aziontech/webkit/blob/main/.specs/article-index-resource-hub.json)

## When to use

- For a resource hub that mixes content types (e-books, posts, comparisons, stories), filtered by facet.

## Do

- Give every item a `facets` entry per facet `key` it can be filtered by; an item without one never matches a selection on that facet.
- Keep each facet's `options` to values some item carries.
- Set `empty` so a reader who filters everything away gets a way back; without it the list just disappears.

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
| `items` | `ArticleIndexResourceHubItem[]` | `[]` | false | The resources, in order; each is `{ key, href, image?, mark?, meta, title, description?, facets?, external? }`. |
| `facets` | `ArticleIndexResourceHubFacet[]` | `[]` | false | The facet dropdowns, in order; each is `{ key, label, allLabel, options }`. |
| `rowLabel` | `string` | `''` | false | Read cue revealed at the end of a row under hover or focus. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the list; without it every match is listed and no button renders. |
| `pageSize` | `number` | `12` | false | Rows listed per page when `moreLabel` is set; the load-more button reveals the next page. |
| `leading` | `number` | `0` | false | Leading resources left out until a facet applies, because a band above already shows them. |
| `empty` | `ArticleIndexResourceHubEmpty` | `undefined` | false | Copy of the state when nothing matches: `{ title, description?, action? }`; `action` labels a button that resets every facet. |
| `rowKind` | `ArticleIndexResourceHubRowKind` | `'centered'` | false | Row layout: `centered` centres the copy, `byline` spreads it to the foot of the row. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of resources. |

## States

- Each row's deck shows in full in `text-body-lg`, never clamped, as on azion.com's Resource Hub
- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- Filtered: each facet keeps the resources whose `facets[key]` holds the selected value; its `allLabel` option keeps every one; the facets combine
- Option search: a dropdown whose `options` number more than seven renders a search field above its options; shorter lists render none
- Paged: with `moreLabel` set, the first `pageSize` matches render and the load-more button, shown while more remain, adds the next `pageSize`; changing a facet returns to the first page
- Leading: until a facet is set to a value other than its `allLabel`, the first `leading` resources are skipped
- Empty: when no resource matches, the list and the load-more button are not rendered; with `empty` set, an `EmptyState` (search icon) renders its title and description, and its `action` button resets every facet
- `data-kind` on the list mirrors `rowKind`: `centered` centres the copy in the row, `byline` spreads it
- A row with no `image` draws its `mark` (the client's logo, flattened to one ink that inverts in the dark theme); a row with no `description` renders no deck
- An `external` row opens in a new tab (`target="_blank"`, `rel="noopener"`)

## Accessibility

- Visible focus: the headline link draws an inset ring over the whole row; the dropdowns and button own theirs.
- Keyboard map: `Tab` moves through each dropdown, each row and the load-more button; the dropdowns own their keyboard map.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `search` landmark; each dropdown trigger is named by its facet `label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`), a client mark is named by the client, and the read cue `aria-hidden`; an `external` row appends the visually hidden `(opens in a new tab)` to its link; the empty state is a `status`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.
- Reflow: from `sm` the facet dropdowns sit on one row that wraps (`flex-wrap`), so two or more `w-56` dropdowns never overflow a narrow box or a 200% zoom.

## Right-to-left

- Layout: logical utilities only (`border-e`, `ps-`/`pe-`); the cover cell sits at the inline start.
- Icons: the read cue's `pi-arrow-up-right` and the search glyph do not mirror; client marks never mirror.
- Keyboard: the dropdowns own their keyboard map under `rtl`.
- User data: none.

## Internationalization

| Key | English source | Override prop |
|---|---|---|
| `articleIndex.search` | `Search` | — |
| `articleIndex.searchFacet` | `Search {facet}` | — |
| `articleIndex.empty` | `No results found.` | — |
| `articleIndex.newTab` | `(opens in a new tab)` | — |

- Every other string (facet labels, the empty state's copy) arrives through props.
- Formatting: none; dates arrive pre-formatted in `meta`.

## Responsive

- Container queries: none; from `lg` the toolbar sits on one row and each row splits cover and copy 2:5.
- Narrow (≤ 640 px): the dropdowns stack at full width and each row stacks its cover above the copy; the read cue is hidden.
- Touch: every row is a full-row link; the read cue is a hover/focus extra, never the only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; from `sm` the dropdowns wrap.

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

### Empty

```vue
<script setup>
  import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleIndexResourceHub
    anchor="resources"
    title="Explore all resources"
    row-label="Read article"
    more-label="Load more"
    aria-label="Resources"
    :empty="{
      title: 'No resources match these filters',
      description: 'Try another content type or industry.',
      action: 'View all resources'
    }"
    :facets="[
      {
        key: 'contentType',
        label: 'Content type',
        allLabel: 'All content types',
        options: ['E-books', 'Blog']
      },
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: ['Retail', 'Tech']
      }
    ]"
    :items="[
      {
        key: 'storefront-performance',
        href: '/resources/storefront-performance',
        image: placeholderImage,
        meta: 'E-books • OCT 15, 2026',
        title: 'Storefront Performance for Retail Teams',
        description: 'Cut page weight and keep checkout fast during peak traffic.',
        facets: { contentType: ['E-books'], industry: ['Retail'] }
      },
      {
        key: 'netshoes-blocks-threats',
        href: 'https://example.com/stories/netshoes',
        mark: { name: 'Netshoes', logo: netshoesExtendedReversed },
        meta: 'Blog • OCT 3, 2026',
        title: 'Netshoes Blocks Threats on Its Storefront',
        description: 'How a retail team kept checkout fast while blocking attacks.',
        facets: { contentType: ['Blog'], industry: ['Retail'] },
        external: true
      }
    ]"
  />
</template>
```
