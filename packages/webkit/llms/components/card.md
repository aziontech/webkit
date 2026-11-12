# Card

> Displays content or metadata in the UI. Lives at `packages/webkit/src/components/content/card/`.

- Import: `import Card from '@aziontech/webkit/card'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [card.json](https://github.com/aziontech/webkit/blob/main/.specs/card.json)

## When to use

- Group related console content into one bordered surface with a title header, a body and an optional footer, such as a settings block, a summary or a form section.
- Host a divided list edge to edge: set `:padded="false"` and put an `Item` list in the `content` slot.
- A centered single-card screen (sign-up, onboarding, a success page) that needs header, body and footer regions.
- A catalog tile for an integration, an extension or a plugin: set `kind="integration"` for the logo, the name, the vendor, a short description, badges, the installed state and one action.

## Do

- Put the body in the `content` slot. There is no `default` slot, so children passed without `#content` don't render.
- Use `title` for a plain heading (rendered as an `h2`). Use the `header` slot only when the header needs another layout: it replaces both the title and `header-action`.
- header-action` content stays hidden until the header is hovered or focused, so keep it to secondary actions and never make it the only way to reach a control.
- Set `:padded="false"` only when the content draws its own inset or needs flush dividers.
- The footer renders only when the `footer` slot has content; don't pass an empty template to reserve space.
- kind="integration"` lays the card out from props: `title`, `logo` (or the `logo` slot), `vendor`, `description`, `badges` and `installed`. The title becomes a link when `href` is set, otherwise a button that emits `select`, and it stretches over the whole card so the tile is one target. Put a single action (Install, Configure) in the `action` slot; it sits above the stretched target and stays reachable on its own.
- Keep the description to one or two sentences; the card clamps it to three lines.
- Show at most two badges (category, context, plan). The installed state is a prop, not a badge, so it reads the same everywhere.
- Integration cards sit under a section heading, so their title is an `h3`.

## Don’t

- The surface sits above the page as a modal or a side sheet → use `dialog` or `drawer`.
- It is one tier of a pricing comparison → use `card-pricing`.
- It is a framed cell or band of a marketing page → use `frame-box` or `card-grid`.
- It is a single row of title, description, media and actions → use `item`.
- It is one record of a resource list shown as cards, with selection and fields → use `cards` (with `useCollection`).
- It is a template tile in a gallery with no vendor, badge or install state → keep `kind="default"` with a `content` slot (see `platform/view/template-browser`).
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
| `title` | `string` | `''` | false | Heading rendered in the header when the `header` slot is empty; with `kind="integration"`, the item name. |
| `padded` | `boolean` | `true` | false | Pads the content region. Set `false` for flush, edge-to-edge content such as an `ItemList` with full-width dividers. |
| `kind` | `'default' \| 'integration'` | `'default'` | false | integration` lays the card out as a catalog tile from `title`, `logo`, `vendor`, `description`, `badges`, `installed` and the `action` slot. |
| `logo` | `string` | `''` | false | Integration kind: icon class for the logo mark. The `logo` slot takes an image instead. |
| `vendor` | `string` | `''` | false | Integration kind: who publishes the item, shown as "by {vendor}". |
| `description` | `string` | `''` | false | Integration kind: one or two sentences on what the item does. |
| `badges` | `CardBadge[]` | `[]` | false | Integration kind: small tags such as the category or the context (`{ label, severity? }`, severity defaults to `info`). |
| `installed` | `boolean` | `false` | false | Integration kind: shows the Installed tag. |
| `href` | `string` | `''` | false | Integration kind: the title links here; without it the title is a button that emits `select`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `event: MouseEvent` | Integration kind without `href`: the title (the whole tile) was activated. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `header` | — | Replaces the default header layout (title + header-action). |
| `header-action` | — | Actions aligned to the end of the default header; visible on header hover. |
| `content` | — | Main card body; with `kind="integration"` it renders under the description. |
| `footer` | — | Footer actions or metadata; omitted when empty. |
| `logo` | — | Integration kind: replaces the logo mark, for an `img` with an empty `alt`. |
| `action` | — | Integration kind: one action at the end of the tile, above the stretched title target. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Responsive: the content region is the `@container/card`, so `KeyValuePairs`, `Field orientation="responsive"` and any `@sm:`/`@md:` utility inside follow the card, not the window. A card used as a shrink-to-fit flex item must get an explicit width (`flex-1`, `w-full`, a grid track): inline-size containment gives the content no intrinsic width.
- Hover-free devices: the `header-action` slot stays visible where the pointer cannot hover (`@media (hover: none)`).
- Integration kind: `hover` shades the surface, `focus-visible` rings the whole tile (the ring sits on the stretched title target), `installed` adds the success Installed tag.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only; the logo sits at the start, the badges and the action at the end.
- Icons: the logo is not mirrored.
- Keyboard: no arrow-key navigation of its own.
- User data: the vendor and the title render in `<bdi>`.

## Internationalization

| Key              | English source | Override prop |
| ---------------- | -------------- | ------------- |
| `card.byVendor`  | by {vendor}    | —             |
| `card.installed` | Installed      | —             |

- Formatting: none.

## Responsive

- Container queries: the content region is `@container/card`; the integration layout does not change with width, the description wraps and clamps to three lines.
- Narrow (≤ 640 px or a narrow container): the badges wrap under the title row; the action stays at the end of its own row.
- Touch: the whole tile is the target; the action is a regular `Button`.
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
