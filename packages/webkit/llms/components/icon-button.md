# Icon Button

> Interactive control for user actions. Lives at `packages/webkit/src/components/actions/icon-button/`.

- Import: `import IconButton from '@aziontech/webkit/icon-button'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [icon-button.json](https://github.com/aziontech/webkit/blob/main/.specs/icon-button.json)

## When to use

- Compact actions in toolbars, table rows, card headers and overlay close controls where the glyph is widely understood (close, refresh, delete, more).
- Swapping between two icons in place (copy to check, show to hide), with `iconTransition` animating the change.
- An icon-only link: set `href` and it renders as an anchor.

## Do

- ariaLabel` is required and is the only accessible name; describe the action ("Delete domain"), not the glyph ("Trash").
- Wrap it in `tooltip` when the glyph is not self-evident, so pointer users see the name screen readers hear.
- Use `kind="transparent"` in dense rows and toolbars; keep `primary` for a lone emphasized action.
- Set `iconTransition` only when `icon` changes at runtime; with a static icon it adds nothing.
- Use `iconClass` for glyph-level tweaks instead of styling the root.

## Don’t

- The action needs a visible label → use `button`.
- Copying a value to the clipboard → use `copy-button`, which already wires the icon swap, the tooltip and the `copy` event.
- Choosing one of a few mutually exclusive options → use `toggle-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — labelled counterpart; sizes line up and its `text` kind matches `transparent` here.
- [copy-button](copy-button.md) — IconButton plus Tooltip with the clipboard write built in.
- [tooltip](tooltip.md) — wrap an IconButton to show its name on hover and focus.
- [split-button](split-button.md) — uses an IconButton as its chevron menu toggle.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `icon` | `string` | `—` | true | PrimeIcons class for the leading/trailing icon. |
| `ariaLabel` | `string` | `—` | true | Accessible name for icon-only controls. |
| `kind` | `'primary' \| 'secondary' \| 'outlined' \| 'transparent' \| 'danger'` | `'primary'` | false | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `href` | `string` | `''` | false | When set, renders as a link (`<a>`). |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when `href` is set. |
| `iconTransition` | `boolean` | `false` | false | Animates icon swaps with enter/leave transitions. |
| `iconClass` | `string` | `''` | false | Extra classes applied to the icon glyph. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- Touch: the drawn size is unchanged (28/32/40 px); on a coarse pointer an invisible `[data-slot=touch-target]` span extends the hit area to at least 44 × 44 px.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <IconButton
    kind="primary"
    size="large"
    icon="pi pi-plus"
    aria-label="Add"
  />
</template>
```

### Types

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <IconButton
      kind="primary"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="secondary"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="outlined"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="transparent"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="danger"
      icon="pi pi-trash"
      aria-label="Delete"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <IconButton
      size="small"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      size="medium"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      size="large"
      icon="pi pi-plus"
      aria-label="Add"
    />
  </div>
</template>
```
