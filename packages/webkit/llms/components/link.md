# Link

> Helps users move between views or sections. Migrated from the existing implementation at `packages/webkit/src/components/navigation/link/`. Design source: [Webkit — Link](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578) (`Size` × `State` variants; hover handled in CSS).

- Import: `import Link from '@aziontech/webkit/link'`
- Category: navigation · Surface: product · Structure: monolithic
- API as JSON: [link.json](https://github.com/aziontech/webkit/blob/main/.specs/link.json)

## When to use

- A standalone navigation link: a domain, a repository, a docs page, "View all".
- An in-console navigation action ("Add custom domain") with `showIcon` set to false.

## Do

- Always set `href` and a `label` that names the destination; the defaults (`'#'`, `'Learn more'`) are placeholders.
- Keep the default `pi pi-external-link` icon for off-site targets with `target="_blank"` (`rel="noopener noreferrer"` is added for you); turn `showIcon` off for in-app destinations.
- Match `size` to the controls around it; heights follow `button` (40 / 32 / 28 px).
- disabled` drops it from the tab order and suppresses `click`; hide a link that can never be followed instead.

## Don’t

- A link inside a sentence → use a plain anchor with the text-link class.
- An action that changes something instead of navigating → use `button`.
- A compact marketing CTA with a brand-colored icon inside a card → use `mini-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [mini-button](mini-button.md) — same anatomy in default text color with a brand-colored icon; `large` and `medium` only.
- [button](button.md) — set `href` when a link must look like a button.
- [breadcrumb](breadcrumb.md) — a trail of links for hierarchical location.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible label rendered inside the link. Empty uses the locale catalog (`Learn more`). |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height and typography (large 40px, medium 32px, small 28px), matching Button. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `showIcon` | `boolean` | `true` | false | When true, renders the trailing icon. |
| `icon` | `string` | `'pi pi-external-link'` | false | PrimeIcons class for the trailing icon. |
| `href` | `string` | `'#'` | false | Destination URL for the anchor. |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when navigating. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `hover` and `focus-visible` underline the label (`underline-offset-4`); there is no surface behind the link
- `data-disabled` mirrors the `disabled` prop

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter` activates.
- ARIA: `aria-disabled` and `tabindex="-1"` when disabled.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: a URL printed as the link text is the consumer's; wrap it in `dir="ltr"` when it sits inside right-to-left prose.

## Examples

### Default

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <Link
    label="Learn more"
    size="large"
    href="#"
  />
</template>
```

### Sizes

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Link
      size="large"
      label="Learn more"
    />
    <Link
      size="medium"
      label="Learn more"
    />
    <Link
      size="small"
      label="Learn more"
    />
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <Link
    label="Learn more"
    disabled
  />
</template>
```
