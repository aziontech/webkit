# Avatar Group

> Shows the people behind one thing as a row of overlapping avatars: the members of a team, the owners of a resource, who is viewing a page now. It shows up to `max` avatars, each named by its person, and counts the rest in a `+N` button that opens a list of their names. It draws its avatars with the same tokens as `avatar` but without importing it, and opens the list with the native popover, so the whole group stays under 5 KB gzip.

- Import: `import AvatarGroup from '@aziontech/webkit/avatar-group'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [avatar-group.json](avatar-group.json)

## When to use

- A table cell, card or header that names the people on something: team members, owners, reviewers, collaborators.
- A presence bar showing who else has the page open.

## Do

- Pass the full name in `name` ("Jane Doe"): it is the accessible name, the pointer hint and the source of the initials ("JD"). Pass `label` only to override the initials, and `src` for a photo.
- Keep `max` small (3 to 5): the group is a glance, not a list. The `+N` button opens the full list of the rest.
- Order `items` by relevance (owner first, or most recent viewer first); the first `max` are the ones shown.
- Use `size="small"` in table cells, `medium` in cards and headers.
- Use `orientation="vertical"` only in a narrow side rail; the horizontal row is the default.
- Give the group an `aria-label` when "5 people" says less than the context ("Owners", "Viewing now").

## Don’t

- One person → use `avatar` beside their name.
- The people are the content of the page (a members list you edit) → use a `table` or an `item` list.
- A count with no people behind it → use `badge`.
- A long list of things that are not people → use `overflow-count`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [avatar](avatar.md) — one person; the group draws each entry with the same shape, sizes and tokens.
- [overflow-count](overflow-count.md) — a `+N` chip for any list, with search and paging; the group's own `+N` list is lighter and names people only.
- [tooltip](tooltip.md) — a styled hint; the group names each avatar with the native `title` instead, so it carries no overlay code.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `AvatarGroupItem[]` | `() => []` | false | The people, in display order: `{ name, src?, label? }`; `name` is the accessible name, the hint and the initials. |
| `max` | `number` | `4` | false | Avatars shown before the rest collapse into the `+N` button; `0` shows every avatar. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size of each avatar (24 / 32 / 48 px), the same steps as `Avatar`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | false | Direction the avatars stack and overlap in. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the group; empty uses the catalog count (`5 people`). |

## States

- Visual states: `default`; each avatar `hover` (raised above its neighbours, `z-1`); the `+N` button `hover`, `focus-visible`, and `data-state="open|closed"` while its list is shown.
- `data-orientation` on the root mirrors `orientation`: horizontal overlaps each avatar onto the previous one's end edge, vertical onto its bottom edge.
- `data-size` on the root mirrors `size` and sets the overlap: `var(--spacing-2xs)` for `small` and `medium`, `var(--spacing-xs)` for `large`, so the initials of each avatar stay readable under the next.
- Each avatar (`__avatar`) carries a `var(--bg-canvas)` ring so the overlap reads as separate circles on any surface. It shows the photo when `src` loads, else the initials from `label` or the first letters of the first and last words of `name` (one letter at `small`, where a 24px circle under the next one's overlap has room for one); a photo that fails to load falls back to the initials. The `+N` button carries a hidden hit area (`data-slot="touch-target"`) that grows its target to 44px on a coarse pointer without changing its drawn size.
- Overflow: when `max` is above 0 and `items` holds more than `max` people, the first `max` render and a `+N` button (`__overflow`) closes the stack. It toggles a native popover (`__list`) anchored below it that lists the names of the rest, scrolling past `var(--container-3xs)` of height. With `max` 0 or few enough items, no button renders.
- Empty: with no `items` the group renders nothing but its empty `group` root.

## Accessibility

- Visible focus: the avatars are not focusable; the `+N` button shows `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` reaches the `+N` button; `Enter` / `Space` opens and closes the list; `Tab` from the button moves into the list when it scrolls; `Esc` closes it and returns focus to the button; a click outside closes it.
- ARIA: the root is `role="group"` named by `ariaLabel` or the catalog count. Each avatar is named by `name` (the image `alt`, or `role="img"` with `aria-label`), so a screen reader hears every visible name; the `title` repeats it for pointer users. The `+N` button is named `2 more people`, carries `aria-expanded` and `aria-controls`, and the list is a `ul` named the same.
- Contrast ≥4.5:1 for the initials, the button and the names (`--text-default` on `--bg-surface-raised`); the separator ring is decorative.
- Touch target: the `+N` button is the size of an avatar (24 px at `small`, the floor); avatars are not interactive.

## Right-to-left

- Layout: logical utilities only (`-ms-`, `ms-`), so under `dir="rtl"` the first avatar sits at the right and each next one overlaps onto its left edge; the list opens below the button, aligned to its inline start.
- Icons: none.
- Keyboard: no horizontal arrow-key logic.
- User data: names are text in the accessible name, the hint and the list; no wrapper needed.
- Overflow count: the `+N` sits in a `dir="ltr"` span, so it never reads `N+`.

## Internationalization

| Key                  | English source                                | Override prop |
| -------------------- | --------------------------------------------- | ------------- |
| `avatarGroup.people` | `{count} person` / `{count} people` (plural)  | `ariaLabel`   |
| `avatarGroup.more`   | `{count} more person` / `{count} more people` | —             |

- Formatting: the plural form is chosen with `Intl.PluralRules` and the counts in the names are formatted with `Intl.NumberFormat`, in the provider's locale; the visible `+N` is the bare count; names come from the consumer.

## Responsive

- Container queries: none: the group is as wide as `max` avatars plus the button.
- Narrow (≤ 640 px or a narrow container): nothing changes; lower `max` for a narrow cell. The list sits in the top layer, so a clipping cell does not cut it, and it flips above or to the other side when it would leave the viewport.
- Touch: avatars are not interactive, so their hint is a pointer convenience (the names stay in the accessible name); the `+N` button is the touch target and lists the hidden names.
- Reflow: no horizontal scroll at 320 px and 200 % zoom for `max` ≤ 5 at `medium`.

## Examples

### Default

```vue
<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const team = [
    { name: 'Jane Doe' },
    { name: 'John Smith' },
    { name: 'Alex Morgan' },
    { name: 'Sam Lee' },
    { name: 'Priya Patel' }
  ]
</script>

<template>
  <AvatarGroup
    :items="team"
    :max="3"
    aria-label="Team members"
  />
</template>
```

### Sizes

```vue
<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const owners = [
    { name: 'Jane Doe' },
    { name: 'John Smith' },
    { name: 'Alex Morgan' },
    { name: 'Sam Lee' }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <AvatarGroup
      :items="owners"
      :max="3"
      size="small"
      aria-label="Owners, small"
    />
    <AvatarGroup
      :items="owners"
      :max="3"
      size="medium"
      aria-label="Owners, medium"
    />
    <AvatarGroup
      :items="owners"
      :max="3"
      size="large"
      aria-label="Owners, large"
    />
  </div>
</template>
```

### Overflow

```vue
<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const first = ['Jane', 'John', 'Alex', 'Sam', 'Priya', 'Maria', 'Chen', 'Omar']
  const last = ['Doe', 'Smith', 'Morgan', 'Lee', 'Patel']
  const team = first.flatMap((given) => last.map((family) => ({ name: `${given} ${family}` })))
</script>

<template>
  <AvatarGroup
    :items="team"
    :max="4"
    aria-label="Acme Inc. team"
  />
</template>
```
