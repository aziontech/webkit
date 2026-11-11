# Doc Pagination

> The previous / next pair that closes a documentation page. Each side is a link carrying an eyebrow and the destination's title; a side with no neighbour leaves its half of the row empty, so the remaining link stays anchored to its own edge rather than drifting to the centre.

- Import: `import DocPagination from '@aziontech/webkit/doc-pagination'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-pagination.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-pagination.json)

## When to use

- At the foot of a page that sits in a reading order — a guide, a tutorial, a numbered series.
- Whenever "what do I read next" has a single obvious answer in each direction.

## Do

- Pass the destination's real title, not "Next page". The title is what tells the reader whether they want to go.
- Leave a side `null` at the ends of a series rather than looping around.
- Handle `navigate` when the app routes client-side; the anchor's `href` is what makes the link real for everyone else.

## Don’t

- To page through a data set — that is `Pagination`, which walks pages of rows and owns a page number. This links two neighbouring documents and knows nothing about a total.
- On a page with no reading order (a reference index, a landing page): a next link that points somewhere arbitrary is worse than none.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Pagination` — the data counterpart; numbered pages over a collection, not two named documents.
- DocOnThisPage` — navigation _within_ the page, where this is navigation _between_ pages.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `previous` | `DocPageLink \| null` | `null` | false | The page before this one. |
| `next` | `DocPageLink \| null` | `null` | false | The page after this one. |
| `previousLabel` | `string` | `''` | false | Eyebrow over the previous link. Empty uses the locale catalog (`Previous`). |
| `nextLabel` | `string` | `''` | false | Eyebrow over the next link. Empty uses the locale catalog (`Next`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `navigate` | `(event: MouseEvent, page: DocPageLink)` | Fired when either neighbour is activated; `page` is the side that was clicked. Event first, per `event-payloads.md`. |

## States

- Visual states: `default`, `hover` (the chevron travels outward), `focus-visible`
- One side absent renders an empty placeholder so the other stays edge-anchored; there is no `data-*` state, because the component holds none

## Accessibility

- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)` on each link.
- Keyboard map: `Tab` reaches each present side; `Enter` follows it. Nothing else — the component owns no keyboard model of its own.
- ARIA: the root is a `nav` labelled "Page navigation", so a screen reader announces it as a landmark distinct from the page's own nav. That name is **overridable** by passing `aria-label` — two nav landmarks may not share an accessible name (axe `landmark-unique`), so a page carrying two paginations must distinguish them. Each link's accessible name is its eyebrow plus the destination title; the chevrons are decorative (`aria-hidden`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: each side is a padded block, comfortably over 40×40 px.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next chevrons mirror (`rtl:-scale-x-100`) and their hover nudges point away from the label (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import DocPagination from '@aziontech/webkit/doc-pagination'
</script>

<template>
  <DocPagination
    :previous="{ title: 'Deploy an application', href: '/docs/deploy' }"
    :next="{ title: 'Bind a domain', href: '/docs/domains' }"
    @navigate="(event, page) => router.push(page.href)"
  />
</template>
```

### Ends

```vue
<script setup>
  import DocPagination from '@aziontech/webkit/doc-pagination'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <DocPagination
      aria-label="First page navigation"
      :next="{ title: 'Deploy an application', href: '/docs/deploy' }"
    />
    <DocPagination
      aria-label="Last page navigation"
      :previous="{ title: 'Bind a domain', href: '/docs/domains' }"
    />
  </div>
</template>
```
