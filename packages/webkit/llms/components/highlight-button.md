# Highlight Button

> Visually emphasized action trigger built on a brand-accent gradient with a continuously rotating multicolor glow rim behind the surface (ported from the `azion-console-kit` Copilot button). Use it to draw attention to a primary AI / highlight flow that needs to stand out from a regular `Button`. One visual treatment (the gradient + glow); same prop surface as `Button` minus the `variant` axis.

- Import: `import HighlightButton from '@aziontech/webkit/highlight-button'`
- Category: action · Surface: app · Structure: monolithic
- API as JSON: [highlight-button.json](highlight-button.json)

## When to use

- Use HighlightButton only for the one AI entry point on a screen (Copilot); every other action is Button.
- The single entry point to an AI assistant or highlight flow (for example "Ask Azion") that must stand out from the actions around it.
- A headline action in a header or marketing band where a primary `button` would blend in.

## Do

- Use at most one per view; the glow loses its meaning when it repeats.
- Keep the label short and verb-led, and pair it with a leading `icon` (for example `az az-sparkles`).
- It always renders `type="button"`; use `button` with `type="submit"` to submit a form.
- `disabled` and `loading` both hide the glow, apply the disabled surface and suppress `click`.
- The glow turns once on mount and then rests, and it never moves under reduced motion, so never use it to convey state.

## Don’t

- A regular primary or secondary action → use `button`.
- An icon-only control → use `icon-button`.
- A default action with related alternatives in a menu → use `split-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — the default action control; adds `variant`, `iconPosition`, `animated`, `type` and a `leading` slot that this component does not have.
- [icon-button](icon-button.md) — icon-only action when there is no room for a label.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `—` | true | Visible label text. Required — use `IconButton` for icon-only controls. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `icon` | `string` | `''` | false | Azion icon class for the leading icon. |
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
- Pause, Stop, Hide (WCAG 2.2.2): the glow turns once and stops by itself after 4.2 seconds, resting on the static glow; `motion-reduce:animate-none` keeps it still from the start.
- Touch target ≥40×40 px at `size: 'large'`; smaller sizes are for dense toolbars and surface a larger hit area via the surrounding container.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

- No built-in strings: the label is consumer copy.

## Responsive

- The control never wraps its label; drawn heights are 28 / 32 / 40 px. The glow needs `overflow-hidden` on the root, which also clips a touch-target extension, so prefer `size="large"` (40 px) on touch-first surfaces.
- Consumer attributes (`id`, `aria-*`, `name`, `form`, `class`) land on the anchor or button (`v-bind="$attrs"`); the class is not merged with tailwind-merge, which keeps the entry near the Button budget.

## Examples

### Default

```vue
<script setup>
  import HighlightButton from '@aziontech/webkit/highlight-button'
</script>

<template>
  <HighlightButton
    size="large"
    label="Ask Azion"
    icon="az az-sparkles"
  />
</template>
```

### Sizes

```vue
<script setup>
  import HighlightButton from '@aziontech/webkit/highlight-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <HighlightButton
      size="small"
      label="Ask Azion"
      icon="az az-sparkles"
    />
    <HighlightButton
      size="medium"
      label="Ask Azion"
      icon="az az-sparkles"
    />
    <HighlightButton
      size="large"
      label="Ask Azion"
      icon="az az-sparkles"
    />
  </div>
</template>
```

### Loading

```vue
<script setup>
  import HighlightButton from '@aziontech/webkit/highlight-button'
</script>

<template>
  <HighlightButton
    label="Ask Azion"
    icon="az az-sparkles"
    loading
  />
</template>
```
