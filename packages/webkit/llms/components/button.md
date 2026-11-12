# Button

> Interactive control for user actions. Lives at `packages/webkit/src/components/actions/button/`.

- Import: `import Button from '@aziontech/webkit/button'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [button.json](https://github.com/aziontech/webkit/blob/main/.specs/button.json)

## When to use

- Trigger an action that needs a visible text label: in a form, dialog footer, toolbar or page header.
- Mark the main action of a view with `kind="primary"` and the lesser ones with `secondary`, `outlined` or `transparent`.
- Submit or reset a form with `type="submit"` / `type="reset"`.
- A call to action that navigates: set `href` (and `target`) and it renders as an anchor with the same look.

## Do

- Keep one `kind="primary"` per view or region; use `danger` only for destructive actions.
- Set `loading` while the action resolves: it swaps the icon for a spinner, sets `aria-busy` and suppresses `click`, so the handler needs no extra guard.
- Use `iconPosition="leading"` for a glyph that names the action and `"trailing"` for one that points where it goes; add `animated` only on marketing CTAs with a trailing icon.
- Put brand or product marks in the `prefix` slot; `icon` takes a PrimeIcons class.
- label` is required and is the accessible name; never pass an empty string to get an icon-only control.

## Don’t

- The control is icon-only → use `icon-button`.
- One default action with related alternatives in an attached menu → use `split-button`.
- A standalone navigation link with a trailing icon and a ghost hover → use `link`.
- The single AI or highlight entry point that must stand out from every other action → use `button-highlight`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [icon-button](icon-button.md) — icon-only counterpart with the same sizes and a required `ariaLabel`; its `transparent` kind matches this one.
- [split-button](split-button.md) — joins a Button to a chevron menu of related actions.
- [button-highlight](button-highlight.md) — the same prop surface without `kind`, drawn with the brand gradient and a rotating glow rim.
- [mini-button](mini-button.md) — compact text action with a brand-colored trailing icon for dense cards and tables.
- [toggle-group](toggle-group.md) — a group of mutually exclusive options, not a single action.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `—` | true | Visible label text. Use `IconButton` for icon-only controls. |
| `kind` | `'primary' \| 'secondary' \| 'outlined' \| 'transparent' \| 'danger'` | `'primary'` | false | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `icon` | `string` | `''` | false | PrimeIcons class for the icon drawn beside the label. |
| `iconPosition` | `'leading' \| 'trailing'` | `'leading'` | false | Which side of the label the icon sits on. `leading` is a glyph that names the action; `trailing` is a glyph that points at where it goes. |
| `animated` | `boolean` | `false` | false | Nudges a trailing icon along its axis on hover. Off by default; marketing CTAs opt in. |
| `href` | `string` | `''` | false | When set, renders as a link (`<a>`). |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when `href` is set. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | false | Native button type. `submit` lets the control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | — |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `prefix` | — | A mark drawn before the label, ahead of a leading `icon`. It stays first when `iconPosition="trailing"`, so a brand mark and a trailing chevron can share one control. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- With `type="submit"`, `disabled` (native) and `loading` (the click is cancelled) both stop the form from submitting, including implicit submission on `Enter`
- Touch: the drawn size is unchanged (28/32/40 px, all above the 24 px minimum); on a coarse pointer an invisible `[data-slot=touch-target]` span extends the hit area to at least 44 × 44 px around the button.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Forced colors: the filled kinds (primary, secondary, danger) have no border of their own, so under `forced-colors: active` every button draws a 1px `ButtonBorder` edge (`GrayText` when disabled); outside forced colors nothing changes.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Motion: the hover nudge of an `icon-position="right"` arrow moves toward the end (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button
    kind="primary"
    size="large"
    label="Button"
  />
</template>
```

### Types

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Button
      kind="primary"
      label="Button"
    />
    <Button
      kind="secondary"
      label="Button"
    />
    <Button
      kind="outlined"
      label="Button"
    />
    <Button
      kind="transparent"
      label="Button"
    />
    <Button
      kind="danger"
      label="Button"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Button
      size="small"
      label="Button"
    />
    <Button
      size="medium"
      label="Button"
    />
    <Button
      size="large"
      label="Button"
    />
  </div>
</template>
```
