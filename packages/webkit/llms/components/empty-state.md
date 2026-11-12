# Empty State

> Centered placeholder shown when a resource list or section has no content yet. Stacks an optional standardized adornment, a title, an optional description, and a consumer-composed actions area (buttons + documentation link) to guide the user toward a first action. The adornment is a standardized, size-scaled featured-icon tile driven by the `icon` prop; the consumer may instead supply custom content via the `icon` slot, or omit both for no adornment. Unlike `Alert`, which is an inline severity banner, `EmptyState` is a full-region zero-data state and renders either inside a bordered surface card or on a plain transparent background.

- Import: `import EmptyState from '@aziontech/webkit/empty-state'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [empty-state.json](https://github.com/aziontech/webkit/blob/main/.specs/empty-state.json)

## When to use

- A list, table or section that has no items yet, with a first action that fills it.
- A search or filter that returned nothing, with an action to clear it.

## Do

- title` is required. Say what is missing ("No domains yet"), not that something went wrong.
- Keep the `actions` slot to one primary action, plus an optional documentation link.
- Use the `icon` prop for the standard featured-icon tile. Use the `icon` slot only for custom art, and omit both when the context already explains the state.
- Use `bordered` when the block sits directly on the page. Leave it off inside a card or panel that already has a border, and use `size="small"` there.

## Don’t

- The data is still loading → use `skeleton`.
- An inline warning or error about content that is present → use `message`.
- The empty body of a data-driven `table` → use the `table` `empty` slot, which already renders this block by default.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [skeleton](skeleton.md) — the loading placeholder shown before the empty state is known.
- message` — inline severity banner, not a zero-data block.
- [table](table.md) — renders an empty-state block in its `empty` slot.
- [button](button.md) — the usual content of the `actions` slot.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | Primary heading announcing the empty resource. |
| `description` | `string` | `''` | false | Supporting body copy below the title. |
| `icon` | `string` | `''` | false | PrimeIcons/Azion icon class for the standardized adornment (e.g. `pi pi-inbox`). When set, renders a size-scaled featured-icon tile; when empty and the `icon` slot is unused, no adornment renders. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token (subset — only `small` and `medium`; no `large`). Scales the whole block on one harmonic ramp — the adornment size, the title and description typography, the surrounding padding, and the gaps between adornment, text, and actions all step up together. |
| `bordered` | `boolean` | `false` | false | When true, wraps the content in a dashed-bordered surface card; otherwise renders on a transparent background. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `icon` | — | Custom adornment centered above the title, rendered inside an `aria-hidden` container. Overrides the `icon` prop's featured-icon tile. When neither this slot nor the `icon` prop is provided, no adornment renders. |
| `actions` | — | Action area below the description; consumer composes buttons and the documentation link. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop
- `data-bordered` mirrors the `bordered` prop
- Responsive: the root is the `@container/empty-state`; below `@xs` of its box (a narrow panel, a phone) the actions stretch to the full width.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses the consumer-supplied controls in the `actions` slot in DOM order; the region itself is non-interactive.
- ARIA: root uses `role="status"` so assistive tech announces the empty-data message; the `icon` slot container is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import EmptyState from '@aziontech/webkit/empty-state'
  import Button from '@aziontech/webkit/button'
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <EmptyState
    title="No resource yet"
    description="Get started by creating your first resource."
    icon="pi pi-inbox"
  >
    <template #actions>
      <div class="flex gap-(--spacing-3)">
        <Button
          kind="secondary"
          label="Secondary Item"
        />
        <Button
          kind="outlined"
          label="Create Item"
        />
      </div>
      <MiniButton
        label="Docs"
        icon="pi pi-arrow-right"
        size="medium"
        href="#"
      />
    </template>
  </EmptyState>
</template>
```

### Sizes

```vue
<script setup>
  import EmptyState from '@aziontech/webkit/empty-state'
  import Button from '@aziontech/webkit/button'
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xl)">
    <EmptyState
      v-for="size in ['small', 'medium']"
      :key="size"
      :size="size"
      title="No resource yet"
      description="Get started by creating your first resource."
      icon="pi pi-inbox"
    >
      <template #actions>
        <div class="flex gap-(--spacing-3)">
          <Button
            kind="secondary"
            label="Secondary Item"
          />
          <Button
            kind="outlined"
            label="Create Item"
          />
        </div>
        <MiniButton
          label="Docs"
          icon="pi pi-arrow-right"
          size="medium"
          href="#"
        />
      </template>
    </EmptyState>
  </div>
</template>
```

### Icon

```vue
<script setup>
  import EmptyState from '@aziontech/webkit/empty-state'
  import Button from '@aziontech/webkit/button'
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <EmptyState
    title="No resource yet"
    description="Get started by creating your first resource."
    icon="pi pi-inbox"
  >
    <template #actions>
      <div class="flex gap-(--spacing-3)">
        <Button
          kind="secondary"
          label="Secondary Item"
        />
        <Button
          kind="outlined"
          label="Create Item"
        />
      </div>
      <MiniButton
        label="Docs"
        icon="pi pi-arrow-right"
        size="medium"
        href="#"
      />
    </template>
  </EmptyState>
</template>
```
