# Card

> Displays content or metadata in the UI. Lives at `packages/webkit/src/components/content/card/`.

- Import: `import Card from '@aziontech/webkit/card'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [card.json](https://github.com/aziontech/webkit/blob/main/.specs/card.json)

## When to use

- Group related console content into one bordered surface with a title header, a body and an optional footer, such as a settings block, a summary or a form section.
- Host a divided list edge to edge: set `:padded="false"` and put an `Item` list in the `content` slot.
- A centered single-card screen (sign-up, onboarding, a success page) that needs header, body and footer regions.

## Do

- Put the body in the `content` slot. There is no `default` slot, so children passed without `#content` don't render.
- Use `title` for a plain heading (rendered as an `h2`). Use the `header` slot only when the header needs another layout: it replaces both the title and `header-action`.
- header-action` content stays hidden until the header is hovered or focused, so keep it to secondary actions and never make it the only way to reach a control.
- Set `:padded="false"` only when the content draws its own inset or needs flush dividers.
- The footer renders only when the `footer` slot has content; don't pass an empty template to reserve space.

## Don’t

- The surface sits above the page as a modal or a side sheet → use `dialog` or `drawer`.
- It is one tier of a pricing comparison → use `card-pricing`.
- It is a framed cell or band of a marketing page → use `frame-box` or `card-grid`.
- It is a single row of title, description, media and actions → use `item`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [item](item.md) — rows inside the card; with `padded` set to false, an `Item` list runs its dividers to the card edges.
- [card-pricing](card-pricing.md) — pricing tier card with its own price hierarchy and action.
- [card-grid](card-grid.md) — responsive grid of cells for marketing pages.
- [panel](panel.md) — the layered shell behind overlays, not an in-page card.
- [empty-state](empty-state.md) — goes in the `content` slot when the card has no data yet.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Heading rendered in the header when the `header` slot is empty. |
| `padded` | `boolean` | `true` | false | Pads the content region. Set `false` for flush, edge-to-edge content such as an `ItemList` with full-width dividers. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `header` | — | Replaces the default header layout (title + header-action). |
| `header-action` | — | Actions aligned to the end of the default header; visible on header hover. |
| `content` | — | Main card body. |
| `footer` | — | Footer actions or metadata; omitted when empty. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Responsive: the content region is the `@container/card`, so `KeyValuePairs`, `Field orientation="responsive"` and any `@sm:`/`@md:` utility inside follow the card, not the window. A card used as a shrink-to-fit flex item must get an explicit width (`flex-1`, `w-full`, a grid track): inline-size containment gives the content no intrinsic width.
- Hover-free devices: the `header-action` slot stays visible where the pointer cannot hover (`@media (hover: none)`).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

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
    <template #content>
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
          icon="pi pi-chevron-right"
          aria-label="Expand"
          kind="outlined"
          size="small"
        />
      </div>
    </template>
    <template #content>
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
  import Card from '@aziontech/webkit/card'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Card
    title="Card Title"
    class="w-full max-w-[512px]"
  >
    <template #content>
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
            kind="outlined"
            size="small"
          />
          <Button
            label="Save"
            kind="outlined"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
```
