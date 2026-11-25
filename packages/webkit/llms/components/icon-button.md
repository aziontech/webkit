# Icon Button

> A square control that triggers an action with a glyph and no visible text: close, refresh, delete, more. It shares the variants, sizes and loading state of `Button`, takes its accessible name from `aria-label`, can swap between two icons in place, and renders as an anchor when `href` is set.

- Import: `import IconButton from '@aziontech/webkit/icon-button'`
- Category: action · Surface: app · Structure: monolithic
- API as JSON: [icon-button.json](icon-button.json)

## When to use

- Compact actions in toolbars, table rows, card headers and overlay close controls where the glyph is widely understood (close, refresh, delete, more).
- Swapping between two icons in place (copy to check, show to hide), with `iconTransition` animating the change.
- An icon-only link: set `href` and it renders as an anchor.

## Do

- Always name it with the kebab attribute `aria-label="Delete domain"` (`:aria-label` when the name changes, `aria-labelledby` when visible text already names it). Describe the action ("Delete domain"), not the glyph ("Trash"). Write `aria-label`, never the camelCase `ariaLabel` attribute: Vue maps the kebab attribute onto the `ariaLabel` prop, and it is the form every other attribute takes in a template.
- The `ariaLabel` prop is optional in the types on purpose: vue-tsc does not camelize `aria-*` attributes onto props, so a required `ariaLabel` made the obvious `aria-label="…"` fail to type-check in a fresh create-vue app. The lint rule `webkit/require-accessible-name` keeps the name required instead: it flags an `IconButton` with neither `aria-label` nor `aria-labelledby`.
- Wrap it in `tooltip` when the glyph is not self-evident, so pointer users see the name screen readers hear.
- Use `variant="ghost"` in dense rows and toolbars; keep `primary` for a lone emphasized action.
- Set `iconTransition` only when `icon` changes at runtime; with a static icon it adds nothing.
- Use `iconClass` for glyph-level tweaks instead of styling the root.

## Don’t

- The action needs a visible label → use `button`.
- Copying a value to the clipboard → use `copy-button`, which already wires the icon swap, the tooltip and the `copy` event.
- Choosing one of a few mutually exclusive options → use `toggle-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — labelled counterpart; sizes line up and its `text` variant matches `ghost` here.
- [copy-button](copy-button.md) — IconButton plus Tooltip with the clipboard write built in.
- [tooltip](tooltip.md) — wrap an IconButton to show its name on hover and focus.
- [split-button](split-button.md) — uses an IconButton as its chevron menu toggle.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `icon` | `string` | `—` | true | Azion icon class for the leading/trailing icon. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the icon-only control, written as the `aria-label` attribute. Empty only when `aria-labelledby` names the button; then no `aria-label` renders. |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | false | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `href` | `string` | `''` | false | When set to a safe URL, renders as a link (`<a>`); an unsafe URL is ignored, and a `download` attribute keeps `blob:` / `data:` (see Accessibility). |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when `href` is set. |
| `iconTransition` | `boolean` | `false` | false | Animates icon swaps with enter/leave transitions. |
| `iconClass` | `string` | `''` | false | Extra classes applied to the icon glyph. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | false | Native button type. `submit` lets an icon-only control submit its form (a search submit, a chat send); `disabled` and `loading` still block it. Ignored when `href` is set. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | — |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop (or a focusable-disabled `aria-disabled`); `data-loading` the `loading` prop; `data-inert` is set while disabled or loading
- While inert, a `ghost` or `outline` button drops its fill and frame and only its glyph takes `--text-disabled`, so an unavailable toolbar control is never louder than the enabled controls beside it; `primary`, `secondary` and `danger` take `--bg-disabled`
- Focusable disabled: an `aria-disabled="true"` attribute (with `disabled` false) keeps the control in the tab order but makes it inert: `data-disabled` and `data-inert` are set, it takes the disabled look and a click emits nothing. Use it for a control whose availability changes while focus moves past it (the carousel step controls), so the tab order stays fixed
- `data-variant` mirrors `variant` and `data-size` mirrors `size` on the root; the variant utilities switch on them (no class presets)
- `IconButtonType` is exported beside `IconButtonVariant`, `IconButtonSize` and `IconButtonTarget`
- Touch: the drawn size is unchanged (28/32/40 px); on a coarse pointer an invisible `[data-slot=touch-target]` span extends the hit area to at least 44 × 44 px.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states; the icon swap also starts from `scale-100` under reduced motion.
- Accessible name: `aria-label` (static or bound) or `aria-labelledby` is mandatory; `webkit/require-accessible-name` flags an IconButton with neither, and an empty name renders no `aria-label` attribute.
- Touch target ≥40×40 px where the control is interactive.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): stays a native button (with `download`, `blob:` and `data:` are kept).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

- No built-in strings: the accessible name comes from the consumer (`aria-label`).

## Responsive

- The drawn size is fixed by `size` (28 / 32 / 40 px); on a coarse pointer the touch-target span grows the hit area to 44 px.
- No hover-only affordance: the accessible name is the label, and a tooltip, when used, opens on focus too.

## Examples

### Default

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <IconButton
    variant="primary"
    size="large"
    icon="az az-plus"
    aria-label="Add"
  />
</template>
```

### Variants

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <IconButton
      variant="primary"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="secondary"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="outline"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="ghost"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="danger"
      icon="az az-trash"
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
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <IconButton
      size="small"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      size="medium"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      size="large"
      icon="az az-plus"
      aria-label="Add"
    />
  </div>
</template>
```
