# Mini Button

> Compact text action with an optional trailing external-link icon and a ghost hover surface. Use for secondary CTAs in dense layouts (cards, tables, toolbars) where a full `Button` is too heavy. Differs from `navigation/link` by using default body text color and a brand-colored icon.

- Import: `import MiniButton from '@aziontech/webkit/mini-button'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [mini-button.json](https://github.com/aziontech/webkit/blob/main/.specs/mini-button.json)

## When to use

- A short secondary CTA ("Learn more") inside a card, feature tile or table where a full `button` is too heavy.
- A marketing link that reads in body text color with a brand-colored icon.

## Do

- Always set `href`; the default `'#'` is a placeholder and the control always renders as an anchor.
- Replace the `'Learn more'` default `label` with text that says where the link goes.
- Keep the default `pi pi-external-link` icon for off-site targets with `target="_blank"` (`rel="noopener noreferrer"` is added for you); set `showIcon` to false otherwise.
- Only `large` and `medium` sizes exist.

## Don’t

- A standalone navigation link in product UI (a domain, a repository, a docs page) → use `link`.
- The main action of a section → use `button`.
- A link inside a sentence → use a plain anchor with the text-link class.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [link](link.md) — same anatomy (label, trailing icon, ghost hover) in link color, with a `small` size; the default for standalone links.
- [button](button.md) — full action control with kinds, loading and a button element.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible label rendered inside the control. Empty uses the locale catalog (`Learn more`). |
| `size` | `'large' \| 'medium'` | `'large'` | false | Size token; affects height, gap, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `showIcon` | `boolean` | `true` | false | When true, renders the trailing icon. |
| `icon` | `string` | `'pi pi-external-link'` | false | PrimeIcons class for the trailing icon. |
| `href` | `string` | `'#'` | false | Destination URL for the anchor. |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when navigating. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | Fires on activation; suppressed when `disabled`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- `data-size` mirrors the `size` prop

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter` activates.
- ARIA: `aria-disabled` and `tabindex="-1"` when disabled.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px at `size: 'large'`; medium is for dense layouts.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <MiniButton
    size="large"
    label="Learn more"
    href="#"
  />
</template>
```

### Sizes

```vue
<script setup>
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <MiniButton
      size="medium"
      label="Learn more"
      href="#"
    />
    <MiniButton
      size="large"
      label="Learn more"
      href="#"
    />
  </div>
</template>
```
