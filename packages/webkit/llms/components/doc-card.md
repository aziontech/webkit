# Doc Card

> One cell of the grid a documentation page scans across: a leading glyph, an optional eyebrow, the title, the copy, and an optional call-to-action row at the foot. It renders as an anchor when it has an `href` and as a plain block when it does not, so a card is either a destination or a statement — never a dead link.

- Import: `import DocCard from '@aziontech/webkit/doc-card'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-card.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-card.json)

## When to use

- A grid of peer destinations: "what you can build", the product tiles a landing section opens with.
- A set of short, scannable entries whose titles carry most of the meaning.

## Do

- Keep the title to a noun phrase and let the copy carry the verb.
- Use `eyebrow` only when the title alone does not say who or when; it is not a category label.
- Set `link-label` when the card should close on an explicit call to action; otherwise the whole tile being the link is enough.

## Don’t

- When each entry needs a sentence to be understood — use `DocItem` rows, one column, so every description is read at the page's own measure instead of squeezed into a cell.
- For a single call to action at the end of a page — that is a button, not a card.
- For an application surface — use `Card`, which is the console's carded surface.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocCardGroup` — the frame and grid this is a cell of; a card outside one has no cell ring.
- DocItem` — the row counterpart. A card claims a whole tile; a row claims one line.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Card heading. |
| `eyebrow` | `string` | `''` | false | Small muted line above the title — who makes the thing, when the title does not say. |
| `icon` | `string` | `''` | false | PrimeIcons class for the leading glyph. Ignored when the `icon` slot is filled. |
| `href` | `string` | `''` | false | Destination; when set the whole card becomes the link. |
| `target` | `'_self' \| '_blank'` | `'_self'` | false | Where the link opens. |
| `label` | `string` | `''` | false | Fallback copy when the default slot is empty. |
| `linkLabel` | `string` | `''` | false | Call-to-action text; when set the card closes on a link row. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Card copy. |
| `icon` | — | The leading mark, when a font glyph will not do. Replaces `icon`. |

## States

- Visual states: `default`, `hover` and `focus-visible` — the last two only when the card is a link
- The root element switches on data, not on an `as` prop: an anchor when `href` is set, a plain block otherwise
- `data-doc-chrome` is the `DocProse` contract (prose rules stop at the card's edge)

## Accessibility

- Visible focus: a linked card takes `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the anchor root.
- Keyboard map: `Tab` reaches a linked card; `Enter` follows it. A card with no `href` is not focusable and not announced as interactive.
- ARIA: the accessible name is the card's own title text — the anchor wraps the content, so nothing is duplicated into an `aria-label`. The glyph is decorative (`aria-hidden`).
- A card that leaves the documentation (absolute URL, `mailto:`, or explicit `target="_blank"`) carries `rel="noreferrer"` and swaps the chevron for a diagonal arrow, so the destination change is visible and not colour-only.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the whole tile is the hit area, comfortably over 40×40 px.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the chevron mirrors; the external-link arrow does not, but its hover nudge moves toward the end edge (`rtl:group-hover:-translate-x-0.5`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
</script>

<template>
  <DocCard
    title="Edge Application"
    icon="pi pi-server"
    href="/docs/edge-application"
    link-label="Read the guide"
  >
    Serve and cache your application at the edge, close to the people using it.
  </DocCard>
</template>
```

### Variants

```vue
<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
</script>

<template>
  <div class="grid gap-(--spacing-md) sm:grid-cols-2">
    <DocCard
      title="Edge Application"
      icon="pi pi-server"
      href="/docs/edge-application"
      link-label="Read the guide"
    >
      The plain shape: a glyph, a title, copy and a call to action.
    </DocCard>
    <DocCard
      eyebrow="Azion CLI"
      title="Deploy from your terminal"
      icon="pi pi-desktop"
      href="/docs/cli"
    >
      An overline says who or when, for a title that does not carry it.
    </DocCard>
    <DocCard
      title="Community templates"
      href="https://github.com/aziontech"
      target="_blank"
      link-label="Browse on GitHub"
    >
      A card that leaves the documentation trades the chevron for a diagonal arrow.
    </DocCard>
    <DocCard title="Not a destination">
      With no href the root is a plain block, so it is neither focusable nor announced as a link.
    </DocCard>
  </div>
</template>
```
