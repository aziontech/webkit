---
name: avatar-group
category: content
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: eb1ddc74ca63f82e0488c97648345bd103d0b6aad0077aeddacf397a9afb1f6e
created: 2026-11-14
last_updated: 2026-11-23
---

# AvatarGroup — Component Spec

## Purpose

Shows the people behind one thing as a row of overlapping avatars: the members of a team, the owners of a resource, who is viewing a page now. It shows up to `max` avatars, each named by its person, and counts the rest in a `+N` button that opens a list of their names. It draws its avatars with the same tokens as `avatar` but without importing it, and opens the list with the native popover, so the whole group stays under 5 KB gzip.

## When to use

- A table cell, card or header that names the people on something: team members, owners, reviewers, collaborators.
- A presence bar showing who else has the page open.

## When NOT to use

- One person → use `avatar` beside their name.
- The people are the content of the page (a members list you edit) → use a `table` or an `item` list.
- A count with no people behind it → use `badge`.
- A long list of things that are not people → use `overflow-count`.

## Related

- `avatar` — one person; the group draws each entry with the same shape, sizes and tokens.
- `overflow-count` — a `+N` chip for any list, with search and paging; the group's own `+N` list is lighter and names people only.
- `tooltip` — a styled hint; the group names each avatar with the native `title` instead, so it carries no overlay code.

## Best practices

- Pass the full name in `name` ("Jane Doe"): it is the accessible name, the pointer hint and the source of the initials ("JD"). Pass `label` only to override the initials, and `src` for a photo.
- Keep `max` small (3 to 5): the group is a glance, not a list. The `+N` button opens the full list of the rest.
- Order `items` by relevance (owner first, or most recent viewer first); the first `max` are the ones shown.
- Use `size="small"` in table cells, `medium` in cards and headers.
- Use `orientation="vertical"` only in a narrow side rail; the horizontal row is the default.
- Give the group an `aria-label` when "5 people" says less than the context ("Owners", "Viewing now").

## Usage

```vue
<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const team = [
    { name: 'Jane Doe', src: 'https://example.com/avatars/jane.jpg' },
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

## Props

| Prop          | Type                             | Default        | Required | JSDoc                                                                                                             |
| ------------- | -------------------------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `items`       | `AvatarGroupItem[]`              | `() => []`     | false    | The people, in display order: `{ name, src?, label? }`; `name` is the accessible name, the hint and the initials. |
| `max`         | `number`                         | `4`            | false    | Avatars shown before the rest collapse into the `+N` button; `0` shows every avatar.                              |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'`     | false    | Size of each avatar (24 / 32 / 48 px), the same steps as `Avatar`.                                                |
| `orientation` | `'horizontal' \| 'vertical'`     | `'horizontal'` | false    | Direction the avatars stack and overlap in.                                                                       |
| `ariaLabel`   | `string`                         | `''`           | false    | Accessible name of the group; empty uses the catalog count (`5 people`).                                          |

## Events

_none_

## Slots

_No slots._

## States

- Visual states: `default`; each avatar `hover` (raised above its neighbours, `z-1`); the `+N` button `hover`, `focus-visible`, and `data-state="open|closed"` while its list is shown.
- `data-orientation` on the root mirrors `orientation`: horizontal overlaps each avatar onto the previous one's end edge, vertical onto its bottom edge.
- `data-size` on the root mirrors `size` and sets the overlap: `var(--spacing-2xs)` for `small` and `medium`, `var(--spacing-xs)` for `large`, so the initials of each avatar stay readable under the next.
- Each avatar (`__avatar`) carries a `var(--bg-canvas)` ring so the overlap reads as separate circles on any surface. It shows the photo when `src` loads, else the initials from `label` or the first letters of the first and last words of `name` (one letter at `small`, where a 24px circle under the next one's overlap has room for one); a photo that fails to load falls back to the initials. The `+N` button carries a hidden hit area (`data-slot="touch-target"`) that grows its target to 44px on a coarse pointer without changing its drawn size.
- Overflow: when `max` is above 0 and `items` holds more than `max` people, the first `max` render and a `+N` button (`__overflow`) closes the stack. It toggles a native popover (`__list`) anchored below it that lists the names of the rest, scrolling past `var(--container-3xs)` of height. With `max` 0 or few enough items, no button renders.
- Empty: with no `items` the group renders nothing but its empty `group` root.

## Motion & Animations

| Trigger                    | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| `+N` button hover or focus | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                     | Token (DESIGN.md)                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| avatar and button surface  | `var(--bg-surface-raised)`                                                                      |
| initials and button text   | `.text-label-sm`, `.text-label-md` (large), `var(--text-default)`                               |
| initials and button border | `var(--border-default)`                                                                         |
| separator ring             | `var(--bg-canvas)`, 2 px                                                                        |
| overlap (small, medium)    | `var(--spacing-2xs)` negative inline-start / block-start margin                                 |
| overlap (large)            | `var(--spacing-xs)` negative inline-start / block-start margin                                  |
| button hover               | `var(--bg-hover)`                                                                               |
| focus ring                 | `var(--ring-color)`, offset `var(--bg-canvas)`                                                  |
| list surface               | `var(--bg-surface-raised)`, `var(--border-default)`, `var(--shape-control)`, `var(--shadow-sm)` |
| list spacing and text      | `var(--spacing-2xs)` gap, `var(--spacing-xs)` padding, `.text-body-sm`                          |
| list height                | `var(--container-3xs)` max                                                                      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the avatars are not focusable; the `+N` button shows `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` reaches the `+N` button; `Enter` / `Space` opens and closes the list; `Tab` from the button moves into the list when it scrolls; `Esc` closes it and returns focus to the button; a click outside closes it.
- ARIA: the root is `role="group"` named by `ariaLabel` or the catalog count. Each avatar is named by `name` (the image `alt`, or `role="img"` with `aria-label`), so a screen reader hears every visible name; the `title` repeats it for pointer users. The `+N` button is named `2 more people`, carries `aria-expanded` and `aria-controls`, and the list is a `ul` named the same.
- Contrast ≥4.5:1 for the initials, the button and the names (`--text-default` on `--bg-surface-raised`); the separator ring is decorative.
- Touch target: the `+N` button is the size of an avatar (24 px at `small`, the floor); avatars are not interactive.

## Internationalization

| Key                  | English source                                | Override prop |
| -------------------- | --------------------------------------------- | ------------- |
| `avatarGroup.people` | `{count} person` / `{count} people` (plural)  | `ariaLabel`   |
| `avatarGroup.more`   | `{count} more person` / `{count} more people` | —             |

- Formatting: the plural form is chosen with `Intl.PluralRules` and the counts in the names are formatted with `Intl.NumberFormat`, in the provider's locale; the visible `+N` is the bare count; names come from the consumer.

## Right-to-left

- Layout: logical utilities only (`-ms-`, `ms-`), so under `dir="rtl"` the first avatar sits at the right and each next one overlaps onto its left edge; the list opens below the button, aligned to its inline start.
- Icons: none.
- Keyboard: no horizontal arrow-key logic.
- User data: names are text in the accessible name, the hint and the list; no wrapper needed.
- Overflow count: the `+N` sits in a `dir="ltr"` span, so it never reads `N+`.

## Responsive

- Container queries: none: the group is as wide as `max` avatars plus the button.
- Narrow (≤ 640 px or a narrow container): nothing changes; lower `max` for a narrow cell. The list sits in the top layer, so a clipping cell does not cut it, and it flips above or to the other side when it would leave the viewport.
- Touch: avatars are not interactive, so their hint is a pointer convenience (the names stay in the accessible name); the `+N` button is the touch target and lists the hidden names.
- Reflow: no horizontal scroll at 320 px and 200 % zoom for `max` ≤ 5 at `medium`.

## Performance

- Bundle budget: 3 KB gzip (2.81 KB measured) for `avatar-group` in `.size-limit.json`; it imports neither `avatar` (whose class merging carries `tailwind-merge`) nor an overlay component.
- Runtime budget: 1,000 people render `max` avatars, one button and, only while the list is open, one list item per hidden name.
- Heavy parts: none.

## Examples

- Default — five people, three shown and a `+2` button.
- Sizes — every `size` side by side.
- Overflow — a 40-person team: four avatars and a `+36` button whose list scrolls; justified because the list is the group's second half and only shows at scale.
- Vertical — `orientation="vertical"` in a narrow rail; justified because the vertical stack is a distinct layout of the same prop.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
