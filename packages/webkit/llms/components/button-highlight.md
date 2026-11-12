# Button Highlight

> Visually emphasized action trigger built on a brand-accent gradient with a continuously rotating multicolor glow rim behind the surface (ported from the `azion-console-kit` Copilot button). Use it to draw attention to a primary AI / highlight flow that needs to stand out from a regular `Button`. One visual treatment (the gradient + glow); same prop surface as `Button` minus the `kind` axis.

- Import: `import ButtonHighlight from '@aziontech/webkit/button-highlight'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [button-highlight.json](https://github.com/aziontech/webkit/blob/main/.specs/button-highlight.json)

## When to use

- The single entry point to an AI assistant or highlight flow (for example "Ask Azion") that must stand out from the actions around it.
- A headline action in a header or marketing band where a primary `button` would blend in.

## Do

- Use at most one per view; the glow loses its meaning when it repeats.
- Keep the label short and verb-led, and pair it with a leading `icon` (for example `pi pi-sparkles`).
- It always renders `type="button"`; use `button` with `type="submit"` to submit a form.
- disabled` and `loading` both hide the glow, apply the disabled surface and suppress `click`.
- The glow stops under reduced motion, so never use it to convey state.

## Don’t

- A regular primary or secondary action → use `button`.
- An icon-only control → use `icon-button`.
- A default action with related alternatives in a menu → use `split-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — the default action control; adds `kind`, `iconPosition`, `animated`, `type` and a `prefix` slot that this component does not have.
- [icon-button](icon-button.md) — icon-only action when there is no room for a label.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `—` | true | Visible label text. Required — use `IconButton` for icon-only controls. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `icon` | `string` | `''` | false | PrimeIcons class for the leading icon. |
| `href` | `string` | `''` | false | When set, renders as an anchor link. |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when `href` is set. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | Fires on activation; suppressed when `disabled` or `loading`. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-disabled` mirrors the `disabled` prop
- `data-loading` mirrors the `loading` prop
- `data-size` mirrors the `size` prop

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter` / `Space` activates.
- ARIA: `<button>` role by default; renders `<a>` when `href` is set with `aria-disabled` / `aria-busy` mirroring `disabled` / `loading`.
- Contrast: gradient passes ≥4.5:1 for the `--color-base-white` foreground due to the `--bg-backdrop` overlay; disabled state pairs `--bg-disabled` with `--text-disabled`.
- `motion-reduce:transition-none` on every transition class.
- Touch target ≥40×40 px at `size: 'large'`; smaller sizes are for dense toolbars and surface a larger hit area via the surrounding container.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
</script>

<template>
  <ButtonHighlight
    size="large"
    label="Ask Azion"
    icon="pi pi-sparkles"
  />
</template>
```

### Sizes

```vue
<script setup>
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <ButtonHighlight
      size="small"
      label="Ask Azion"
      icon="pi pi-sparkles"
    />
    <ButtonHighlight
      size="medium"
      label="Ask Azion"
      icon="pi pi-sparkles"
    />
    <ButtonHighlight
      size="large"
      label="Ask Azion"
      icon="pi pi-sparkles"
    />
  </div>
</template>
```

### Loading

```vue
<script setup>
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
</script>

<template>
  <ButtonHighlight
    label="Ask Azion"
    icon="pi pi-sparkles"
    loading
  />
</template>
```
