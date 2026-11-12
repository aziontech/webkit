# Avatar

> Displays content or metadata in the UI. Lives at `packages/webkit/src/components/content/avatar/`.

- Import: `import Avatar from '@aziontech/webkit/avatar'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [avatar.json](https://github.com/aziontech/webkit/blob/main/.specs/avatar.json)

## When to use

- Identify a person next to their name: comment threads, member lists, "Last modified" cells, quotes.
- The user entry in a header or account menu.

## Do

- Pass initials in `label` (`"JD"`); it keeps the first two characters, so a full name shows its first two letters, not initials.
- Set `alt` to the person's name ("Jane Doe"). With `src` it is the image's `alt`; without an image it names the initials or icon fallback (`role="img"`), so a screen reader hears "Jane Doe", not "JD". Without `alt` the name falls back to the initials, then "Avatar" for an image or "User avatar" for the icon.
- Content precedence is `src`, then `label`, then `icon` (default `pi pi-user`).
- size` maps to 24 / 32 / 48 px with `medium` as the default; `kind` is `circle` (default) or `square`.

## Don’t

- The Azion logo → use `brand`.
- A count or short status → use `badge`.
- A loading placeholder → use `skeleton`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [badge](badge.md) — overlay on an avatar to show a count.
- [quote](quote.md) — composes an avatar for the speaker.
- [brand](brand.md) — the product mark, not a person.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | `undefined` | false | Image URL. When set, renders a photo and takes precedence over label and icon. |
| `alt` | `string` | `undefined` | false | Accessible name: the image's `alt` with `src`, and the name of the initials or icon fallback without it. |
| `label` | `string` | `undefined` | false | Initials shown when no image (normalized to two uppercase characters). |
| `icon` | `string` | `'pi pi-user'` | false | Icon class for the fallback when no image or label (PrimeIcons class). |
| `kind` | `AvatarKind` | `'circle'` | false | Visual shape of the avatar container. |
| `size` | `AvatarSize` | `'medium'` | false | Size preset matching Figma sm / md / lg (24 / 32 / 48 px). |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <Avatar
    label="AB"
    kind="circle"
    size="medium"
  />
</template>
```

### Types

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <div class="flex flex-col items-center gap-2">
      <Avatar
        kind="circle"
        label="AB"
        size="medium"
      />
      <span class="text-body-xs text-(--text-muted)">Circle</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Avatar
        kind="square"
        label="AB"
        size="medium"
      />
      <span class="text-body-xs text-(--text-muted)">Square</span>
    </div>
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <div class="flex flex-wrap items-end gap-4">
    <Avatar
      label="AB"
      size="small"
    />
    <Avatar
      label="AB"
      size="medium"
    />
    <Avatar
      label="AB"
      size="large"
    />
  </div>
</template>
```
