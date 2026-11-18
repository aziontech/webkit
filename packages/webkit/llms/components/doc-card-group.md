# Doc Card Group

> The framed, responsive grid a `DocCard` set sits in. The group is the frame, not each card: `RegistrationFrame` draws the perimeter and the four corner registration marks once around the whole set, the grid keeps 1px gaps, and every cell paints a 1px ring into them — so two neighbours share one hairline, an incomplete last row stays simply empty, and the set reads as one object the reader scans across rather than as loose tiles. `columns` names the widest column count; the grid always steps down toward one column on a phone unless a set of tiny cells opts into two with `mobileColumns`.

- Import: `import DocCardGroup from '@aziontech/webkit/doc-card-group'`
- Category: docs · Surface: docs · Structure: monolithic
- API as JSON: [doc-card-group.json](doc-card-group.json)

## When to use

- Around every `DocCard` set — a card outside a group has no frame and no cell ring.
- The fan-out at the top of a landing or section-index page: product tiles, a framework grid, a "what you can build" band.

## Do

- Pick `columns` for the widest screen and let the breakpoints do the rest; do not wrap the group in another grid.
- Leave `mobileColumns` at 1 unless every cell is a mark plus one word — a card with copy needs the whole phone width.
- Let an incomplete last row be empty; do not stretch the last card to fill it.
- Inside a `module` with `padded` off, place the group directly in the body: the header's bottom rule and the column's side rules become the group's top and sides, the group drops its own top and side rules and top corner marks, and the cells' rings land on those rules. The group's bottom rule closes the module, so the module after it passes `divided` as `false` — every seam stays one hairline.

## Don’t

- When each entry needs a full-measure sentence to be understood — use `DocItem` rows, one column, instead of cells.
- As a general-purpose layout grid for application screens; it is documentation chrome, tied to the `DocProse` ladder.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `DocCard` — the cell this frames; the group draws the perimeter and the cells paint the internal rules.
- `RegistrationFrame` — the layout primitive that draws the frame and the corner registration marks.
- `DocProse` — the contract around it; `data-doc-block` puts the group on the block rung of the prose ladder.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columns` | `1 \| 2 \| 3 \| 4` | `2` | false | Column count at the large breakpoint. A Markdown `CardGroup cols` attribute maps here (through DocMarkdown). |
| `mobileColumns` | `1 \| 2` | `1` | false | Column count on a phone. Two only pays when the cells are a mark plus a word. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `DocCard` children. |

## States

- Visual states: `default` (the component is not interactive and holds no state)
- `data-columns` and `data-mobile-columns` mirror `columns` and `mobileColumns`; Tailwind data-variants switch the grid's column count on them at the `sm` and `lg` breakpoints
- `data-doc-block` is the `DocProse` contract (the group takes the block rung of the ladder)

## Accessibility

- Visible focus: the group is not focusable; a linked `DocCard` inside it carries its own inset focus ring.
- Keyboard map: none of its own — `Tab` moves through the linked cards in DOM order, which follows the grid's reading order.
- ARIA: no role is added; the group is pure layout, so assistive tech reads the cards as a plain sequence of links.
- Contrast: the frame and the hairline rules are decorative; every readable surface belongs to the cells, which own their contrast.
- Touch target: not applicable; the component itself is not interactive.

## Examples

### Default

```vue
<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
</script>

<template>
  <DocCardGroup :columns="2">
    <DocCard
      title="Start from a template"
      icon="az az-layout-grid"
      href="#templates"
    >
      Ready-made projects that go live in a few clicks. No local tooling.
    </DocCard>
    <DocCard
      title="Import from GitHub"
      icon="az az-github"
      href="#github"
    >
      Connect a repository and let Azion build it on every push.
    </DocCard>
  </DocCardGroup>
</template>
```

### Columns

```vue
<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
</script>

<template>
  <DocCardGroup :columns="3">
    <DocCard
      title="Start from a template"
      icon="az az-layout-grid"
      href="#templates"
    >
      Ready-made projects that go live in a few clicks. No local tooling.
    </DocCard>
    <DocCard
      title="Import from GitHub"
      icon="az az-github"
      href="#github"
    >
      Connect a repository and let Azion build it on every push.
    </DocCard>
    <DocCard
      title="Deploy with the CLI"
      icon="az az-desktop"
      href="#cli"
    >
      Ship the project already open in your editor.
    </DocCard>
  </DocCardGroup>
</template>
```
