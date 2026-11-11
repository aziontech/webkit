# Tooltip

> Surfaces a short hint anchored to a trigger element when the user hovers, focuses, or long-presses it. Use for icon-only buttons, abbreviations, or any control whose meaning is not obvious from its label alone. **Not** for rich content or interactive children — use `overlay/popover` instead.

- Import: `import Tooltip from '@aziontech/webkit/tooltip'`
- Category: overlay · Surface: product · Structure: monolithic
- API as JSON: [tooltip.json](https://github.com/aziontech/webkit/blob/main/.specs/tooltip.json)

## When to use

- Naming an icon-only control on hover and focus.
- Revealing the full text of a truncated label, or expanding an abbreviation.
- One short, plain-text hint that the user can do without.

## Do

- Wrap a focusable element. The tooltip opens on the wrapper's `focusin`, and the wrapper itself is not focusable.
- Keep `text` to a few words. It renders as plain text, with no markup.
- The tooltip describes its trigger (`aria-describedby`) but does not name it. Icon-only triggers still need their own accessible name.
- Use `disabled` to suppress the tooltip. An empty `text` also blocks opening, but it reads as a bug.
- Keep the default `delay` (200 ms) unless a dense toolbar needs a longer one.

## Don’t

- The content has links, buttons or more than one line of structure → use `popover`.
- An info glyph beside a field label or column header → use `hint`.
- A glossed term inside documentation prose → use `doc-tooltip`.
- Guidance or errors the user needs to complete a field → use `helper-text`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [popover](popover.md) — click-opened, interactive, with a header, body and footer.
- [hint](hint.md) — the focusable info glyph that renders a `Tooltip` for you.
- [doc-tooltip](doc-tooltip.md) — inline glossed term for docs pages.
- [icon-button](icon-button.md) — the most common trigger; it still needs its own `ariaLabel`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | `—` | true | Plain text shown inside the tooltip. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left' \| 'auto'` | `'top'` | false | Anchor side relative to the trigger; `auto` picks the side with room. |
| `delay` | `number` | `200` | false | Hover-open delay in milliseconds. |
| `disabled` | `boolean` | `false` | false | Disables tooltip activation. |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `boolean` | v-model:open. Fires on open and close. |
| `show` | `void` | Emitted right after the open transition starts. |
| `hide` | `void` | Emitted right after the close transition starts. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The trigger element. Tooltip anchors to its bounding box. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-state` values: `open` | `closed`
- `data-disabled` mirrors the `disabled` prop
- `data-placement`: `top` | `right` | `bottom` | `left`
- `data-anchored` on the panel once its opening position has landed — the flag that lets a re-anchor animate while the entrance stays the open animation

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the trigger wrapper.
- Keyboard map: `Tab` focuses the trigger → tooltip opens; `Escape` closes; tooltip never traps focus.
- ARIA: `role="tooltip"` on the panel; the slotted control references the panel via `aria-describedby` (merged into a WebKit `Button` / `IconButton` or native control at render, otherwise forwarded onto the first focusable element in the slot after mount; on the wrapper only when the slot has none). The wrapper itself has no `role` and no tab stop. `aria-hidden="true"` when `data-state="closed"`.
- Contrast ≥4.5:1 — text against surface verified in both light and dark modes.
- `motion-reduce:animate-none` on the panel; reduced-motion users get instant show/hide.
- Touch target ≥40×40 px on the trigger (the consumer's responsibility — flag in docs).
- Teleported content: the teleported `role="tooltip"` panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Tooltip
    text="This is a Tooltip"
    placement="top"
  >
    <Button
      label="Hover me"
      kind="outlined"
      size="medium"
    />
  </Tooltip>
</template>
```

### Placements

```vue
<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-(--spacing-8) p-(--spacing-8)">
    <Tooltip
      text="top placement"
      placement="top"
    >
      <IconButton
        icon="pi pi-arrow-up"
        aria-label="top placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      text="right placement"
      placement="right"
    >
      <IconButton
        icon="pi pi-arrow-right"
        aria-label="right placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      text="bottom placement"
      placement="bottom"
    >
      <IconButton
        icon="pi pi-arrow-down"
        aria-label="bottom placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      text="left placement"
      placement="left"
    >
      <IconButton
        icon="pi pi-arrow-left"
        aria-label="left placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
  </div>
</template>
```

### AutoPlacement

```vue
<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="relative h-[28rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All four triggers use <code>placement="auto"</code>.<br />
      Each tooltip resolves to the side with the most available space.
    </p>

    <div class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-up"
          aria-label="top-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute bottom-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-down"
          aria-label="bottom-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute start-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-left"
          aria-label="left-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute end-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-right"
          aria-label="right-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>
  </div>
</template>
```
