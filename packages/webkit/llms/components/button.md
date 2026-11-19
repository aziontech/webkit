# Button

> The labelled control that triggers an action. `variant` ranks the action in its view (one `primary`, the rest `secondary`, `outline`, `ghost`, `danger` for a destructive one, or `link` for an action that reads as a link), `size` fits it to its context, and `loading` and `disabled` cover the states in between. With `href` it renders an anchor that looks the same, so a call to action that navigates needs no second component.

- Import: `import Button from '@aziontech/webkit/button'`
- Category: action · Surface: app · Structure: monolithic
- API as JSON: [button.json](button.json)

## When to use

- Use Button `variant="link"` when the text runs an action (no navigation) but should read like a link.
- Trigger an action that needs a visible text label: in a form, dialog footer, toolbar or page header.
- Mark the main action of a view with `variant="primary"` and the lesser ones with `secondary`, `outline` or `ghost`.
- Submit or reset a form with `type="submit"` / `type="reset"`.
- A call to action that navigates: set `href` (and `target`) and it renders as an anchor with the same look.
- An action that reads as a link — inline in a table cell or a summary (`Connect Git Repository`, `3 rules`, `Resources pending deletion`) — and opens a drawer, a picker or a flow instead of a URL: `variant="link"`. It is still a `<button>`, so keyboard and screen readers get an action.

## Do

- Keep one `variant="primary"` per view or region; use `danger` only for destructive actions.
- `variant="link"` has no box: no height, padding or surface, `text-body-sm` in the link colour, underlined on hover. `size` does not apply to it; place it where body text sits (a cell, a summary line, under a section).
- Set `loading` while the action resolves: it swaps the icon for a spinner, sets `aria-busy` and suppresses `click`, so the handler needs no extra guard.
- Use `iconPosition="leading"` for a glyph that names the action and `"trailing"` for one that points where it goes; add `animated` only on marketing CTAs with a trailing icon.
- Put brand or product marks in the `leading` slot; `icon` takes an Azion icon class.
- `label` is required and is the accessible name; never pass an empty string to get an icon-only control.

## Don’t

- The control is icon-only → use `icon-button`.
- One default action with related alternatives in an attached menu → use `split-button`.
- A standalone navigation link with a trailing icon and a ghost hover → use `link`.
- Link-looking text that goes to a URL in a table cell → `TableCellLink`; a `variant="link"` Button is for an action with no destination.
- A hand-written `<button class="text-(--text-link) …">` → use `variant="link"`.
- The single AI or highlight entry point that must stand out from every other action → use `highlight-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [icon-button](icon-button.md) — icon-only counterpart with the same sizes and a required `ariaLabel`; its `ghost` variant matches this one.
- [split-button](split-button.md) — joins a Button to a chevron menu of related actions.
- [highlight-button](highlight-button.md) — the same prop surface without `variant`, drawn with the brand gradient and a rotating glow rim.
- [link](link.md) — a text link that navigates to a page, resource or URL.
- [toggle-group](toggle-group.md) — a group of mutually exclusive options, not a single action.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible label text, the fallback of the default slot (pass one or the other). Use `IconButton` for icon-only controls. |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'link'` | `'primary'` | false | Visual variant. `link` draws an inline text action in the link colour, with no box. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `icon` | `string` | `''` | false | Azion icon class for the icon drawn beside the label. |
| `iconPosition` | `'leading' \| 'trailing'` | `'leading'` | false | Which side of the label the icon sits on. `leading` is a glyph that names the action; `trailing` is a glyph that points at where it goes. |
| `animated` | `boolean` | `false` | false | Nudges a trailing icon along its axis on hover. Off by default; marketing CTAs opt in. |
| `href` | `string` | `''` | false | When set to a safe URL, renders as a link (`<a>`); an unsafe URL is ignored, and a `download` attribute keeps `blob:` / `data:` (see Accessibility). |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when `href` is set. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | false | Native button type. `submit` lets the control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | — |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The visible label, as shadcn and Radix take children; falls back to `label`. Plain text keeps the button's typography. |
| `leading` | — | A mark drawn before the label, ahead of a leading `icon`. It stays first when `iconPosition="trailing"`, so a brand mark and a trailing chevron can share one control. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop; `data-loading` the `loading` prop; `data-inert` is set while disabled or loading
- `data-size` mirrors `size`; every variant, size and inert utility switches on these `data-*` attributes in one flat class (no class presets in script)
- `data-variant` mirrors `variant`; with `variant="link"` the button has no box (no height, padding, surface or state layer), the label is `text-body-sm` in `var(--text-link)` turning `var(--text-link-hover)` and underlined on hover, and `size` is ignored; disabled and loading drop it to `var(--text-disabled)`; under forced colors it reads as `LinkText` with no border.
- With `type="submit"`, `disabled` (native) and `loading` (the click is cancelled) both stop the form from submitting, including implicit submission on `Enter`
- Touch: the drawn size is unchanged (28/32/40 px, all above the 24 px minimum); on a coarse pointer an invisible `[data-slot=touch-target]` span extends the hit area to at least 44 × 44 px around the button.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Forced colors: the filled variants (primary, secondary, danger) have no border of their own, so under `forced-colors: active` every button draws a 1px `ButtonBorder` edge (`GrayText` when disabled); outside forced colors nothing changes.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): stays a native button (with `download`, `blob:` and `data:` are kept).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Motion: the hover nudge of an `icon-position="right"` arrow moves toward the end (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

- No built-in strings: the label (and an `aria-label` when given) are consumer copy.

## Responsive

- The button never wraps its label (`whitespace-nowrap`); in a container narrower than the label the button shrinks and the `label` ends in an ellipsis (a default-slot label truncates only when it brings its own truncating element). Keep labels short, or let the layout stack buttons on narrow screens.
- Touch: drawn heights are 28 / 32 / 40 px; a `[data-slot=touch-target]` span extends the hit area to 44 px on a coarse pointer.
- No hover-only affordance: every state reads without hover.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button
    variant="primary"
    size="large"
    label="Button"
  />
</template>
```

### Variants

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Button
      variant="primary"
      label="Button"
    />
    <Button
      variant="secondary"
      label="Button"
    />
    <Button
      variant="outline"
      label="Button"
    />
    <Button
      variant="ghost"
      label="Button"
    />
    <Button
      variant="danger"
      label="Button"
    />
    <Button
      variant="link"
      label="Link button"
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
