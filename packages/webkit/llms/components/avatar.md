# Avatar

> Identifies a person, an account or an organization with a small visual mark: their picture when there is one, otherwise their initials, a fallback icon or a generated pattern seeded by the name. It comes in a circle or a square at three sizes, so the same person reads the same way in a header, a list row or a comment thread.

- Import: `import Avatar from '@aziontech/webkit/avatar'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [avatar.json](avatar.json)

## When to use

- Identify a person next to their name: comment threads, member lists, "Last modified" cells, quotes.
- The user entry in a header or account menu.
- The mark of an organization or account that has no logo: `pattern="marble"` draws a soft generated mark seeded by its name, the same for the same name everywhere (account switcher, create organization, onboarding).

## Do

- Pass the person's name or initials in `label` (`"Jane Doe"` or `"JD"`): a name of two or more words draws the first letter of its first and last words (`JD`) and keeps the whole name as the accessible name; a single word keeps its first two characters.
- Set `alt` to the person's name ("Jane Doe"). With `src` it is the image's `alt`; without an image it names the initials or icon fallback (`role="img"`), so a screen reader hears "Jane Doe", not "JD". Without `alt` the name falls back to the initials, then "Avatar" for an image or "User avatar" for the icon.
- Content precedence is `src`, then `pattern`, then `label`, then `icon` (default `az az-user`).
- For a generated mark, pass the full name in `label` (`"Acme Inc."`) with `pattern="marble"`: the name seeds the shapes, so one organization keeps one mark. Pass `colors` to pick its palette (three theme colors, such as an accent the person chose); do not inline your own generator or a data-URL image.
- `size` maps to 24 / 32 / 48 px with `medium` as the default; `variant` is `circle` (default) or `square`.

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
| `src` | `string` | `''` | false | Image URL. When set, renders a photo and takes precedence over label and icon. |
| `alt` | `string` | `''` | false | Accessible name: the image's `alt` with `src`, and the name of the initials or icon fallback without it. |
| `label` | `string` | `''` | false | Name or initials shown when no image: the first letters of the first and last words, or the first two characters of one word, uppercased. |
| `icon` | `string` | `'az az-user'` | false | Icon class for the fallback when no image or label (Azion icon class). |
| `variant` | `AvatarVariant` | `'circle'` | false | Visual shape of the avatar container. |
| `size` | `AvatarSize` | `'medium'` | false | Size preset matching Figma sm / md / lg (24 / 32 / 48 px). |
| `pattern` | `AvatarPattern` | `undefined` | false | Generated fallback drawn when there is no image: `marble` blends three soft shapes seeded by `label` (or `alt`). |
| `colors` | `string[]` | `['var(--primary)', 'var(--warning)', 'var(--brand-blue)']` | false | CSS colors the generated pattern paints with, in order; theme tokens such as `var(--primary)`. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Content: `image` (`src`), `pattern` (`pattern` set, no `src`), `label` (initials), `icon`. `data-pattern` mirrors `pattern` on the root while the pattern renders.
- Root attributes: `data-variant` and `data-size` mirror the props; `data-content` names the content that renders (`image`, `pattern`, `label`, `icon`). Variants are styled from these attributes.
- Image error: when `src` fails to load, the avatar falls back to the next content in the precedence (`pattern`, `label`, `icon`) instead of a broken image; a new `src` tries the image again. An image that already failed before hydration is detected on mount.
- Attributes: every consumer attribute (`id`, `title`, `aria-*`, `style`, listeners) lands on the root.
- Marble: three layers seeded by a 32-bit string hash of `label` (falling back to `alt`): a filled square, then two blurred shapes translated, rotated and scaled by the seed, the last blended with `overlay`. Each layer takes the color at `(seed + layer) % colors.length`. The same seed and colors always draw the same mark, on the server and in the browser.

## Accessibility

- Visible focus: none; the avatar is not focusable. A parent control (account menu trigger) owns focus.
- Keyboard map: none.
- ARIA: with `src` the `img` carries `alt`; without it the root is `role="img"` with `aria-label` (see Internationalization), and the initials, icon or pattern inside are presentational (`aria-hidden` on the icon and the pattern SVG).
- Contrast ≥4.5:1 for the initials on `var(--bg-surface-raised)`; the generated pattern is decorative and carries no text.

## Right-to-left

- Layout: none; the avatar is a square box with centred content.
- Icons: the fallback icon and the generated pattern are not mirrored (the pattern is a mark, not a direction).
- Keyboard: none; the avatar is not interactive.
- User data: the initials and the name in the accessible name come from the consumer; no wrapper is needed for a two-character label.

## Internationalization

| Key                    | English source | Override prop |
| ---------------------- | -------------- | ------------- |
| `avatar.imageAlt`      | Avatar         | `alt`         |
| `avatar.fallbackLabel` | User avatar    | `alt`         |

- Formatting: none. With `pattern`, the accessible name is `alt`, then the full `label`, then `avatar.fallbackLabel`.

## Responsive

- Container queries: none: fixed size (24 / 32 / 48 px from `size`).
- Narrow (≤ 640 px or a narrow container): nothing changes; the avatar does not shrink (`shrink-0`).
- Touch: not interactive; a parent control owns the target size.
- Reflow: fixed size, no horizontal scroll.

## Examples

### Default

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <Avatar
    label="AB"
    variant="circle"
    size="medium"
  />
</template>
```

### Variants

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <div class="flex flex-col items-center gap-2">
      <Avatar
        variant="circle"
        label="AB"
        size="medium"
      />
      <span class="text-body-xs text-(--text-muted)">Circle</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Avatar
        variant="square"
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
