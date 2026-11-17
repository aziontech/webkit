# Card

> Use Card for one bordered box of related content in product UI; for a collection of records shown as cards use CardList, for a catalog tile use IntegrationCard, and for the frame of a dashboard chart use ChartCard. A bordered surface that groups related content under a title, with a header, a body and an optional footer the consumer composes. It holds a settings block, a summary or a form section.

- Import: `import Card from '@aziontech/webkit/card'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [card.json](card.json)

## When to use

- Group related console content into one bordered surface with a title header, a body and an optional footer, such as a settings block, a summary or a form section.
- Host a divided list edge to edge: set `:padded="false"` and put an `Item` list in the body.
- A centered single-card screen (sign-up, onboarding, a success page) that needs header, body and footer regions.

## Do

- Put the body in the default slot.
- Use `title` for a plain heading (rendered as an `h2`). Use the `header` slot only when the header needs another layout: it replaces both the title and `header-actions`.
- `header-actions` content stays hidden until the header is hovered or focused, so keep it to secondary actions and never make it the only way to reach a control.
- Set `:padded="false"` only when the content draws its own inset or needs flush dividers.
- The footer renders only when the `footer` slot has content; don't pass an empty template to reserve space.

## Don’t

- The surface sits above the page as a modal or a side sheet → use `dialog` or `drawer`.
- It is one tier of a pricing comparison → use `pricing-card`.
- It is a framed cell or band of a marketing page → use `registration-frame` or `card-grid`.
- It is a single row of title, description, media and actions → use `item`.
- It is one record of a resource list shown as cards, with selection and fields → use `card-list` (with `useCollection`).
- It is a catalog tile for an integration, an extension or a plugin (logo, vendor, badges, installed state) → use `integration-card`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [item](item.md) — rows inside the card; with `padded` set to false, an `Item` list runs its dividers to the card edges.
- [integration-card](integration-card.md) — the catalog tile, split out of Card in 6.0.
- [pricing-card](pricing-card.md) — pricing tier card with its own price hierarchy and action.
- [card-grid](card-grid.md) — responsive grid of cells for marketing pages.
- [panel](panel.md) — the layered shell behind overlays, not an in-page card.
- [empty-state](empty-state.md) — goes in the default slot when the card has no data yet.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Heading rendered in the header when the `header` slot is empty. |
| `padded` | `boolean` | `true` | false | Pads the content region. Set `false` for flush, edge-to-edge content such as an `ItemList` with full-width dividers. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `header` | — | Replaces the default header layout (title + header-actions). |
| `header-actions` | — | Actions aligned to the end of the default header; visible on header hover. |
| `default` | — | Main card body: children passed without a slot name. |
| `footer` | — | Footer actions or metadata; omitted when empty. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Responsive: the content region is the `@container/card`, so `KeyValueList`, `Field orientation="responsive"` and any `@sm:`/`@md:` utility inside follow the card, not the window. A card used as a shrink-to-fit flex item must get an explicit width (`flex-1`, `w-full`, a grid track): inline-size containment gives the content no intrinsic width.
- Hover-free devices: the `header-actions` slot stays visible where the pointer cannot hover (`@media (hover: none)`).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only; the header actions sit at the end.
- Icons: none of its own.
- Keyboard: no arrow-key navigation of its own.
- User data: the title and the slots are consumer content.

## Internationalization

- Strings: none; every text is consumer content (`title` and the slots).
- Formatting: none.

## Responsive

- Container queries: the content region is `@container/card`, so content inside follows the card's width.
- Narrow (≤ 640 px or a narrow container): the header keeps the title and the actions on one row; the content reflows.
- Touch: the `header-actions` slot stays visible on hover-free devices.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Card Title"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        Card body content. Place forms, tables, or any markup in the content slot.
      </p>
    </template>
  </Card>
</template>
```

### Header

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Card class="w-full max-w-[512px]">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-label-md text-(--text-default)">Card Title</h2>
        <IconButton
          icon="az az-chevron-right"
          aria-label="Expand"
          variant="outline"
          size="small"
        />
      </div>
    </template>
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        An action rendered in the header slot stays visible, aligned to the end of the header.
      </p>
    </template>
  </Card>
</template>
```

### Footer

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Card Title"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        The footer bar renders only when the footer slot is filled.
      </p>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <span class="text-body-xs text-(--text-muted)">
          <a
            href="/docs"
            class="text-link"
            >Check documentation:</a
          >
        </span>
        <div class="flex gap-(--spacing-sm)">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
          />
          <Button
            label="Save"
            variant="outline"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
```
