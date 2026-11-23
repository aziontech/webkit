---
name: avatar
category: content
structure: monolithic
status: implemented
spec_version: 8
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-882
  node_id: 477:882
checksum: 32210c2a72335e9c9418e05257ce96447302f7d28c7b7215f5111c69af639c7b
created: 2026-05-22
last_updated: 2026-11-15
---

# Avatar — Component Spec

## Purpose

Identifies a person, an account or an organization with a small visual mark: their picture when there is one, otherwise their initials, a fallback icon or a generated pattern seeded by the name. It comes in a circle or a square at three sizes, so the same person reads the same way in a header, a list row or a comment thread.

## When to use

- Identify a person next to their name: comment threads, member lists, "Last modified" cells, quotes.
- The user entry in a header or account menu.
- The mark of an organization or account that has no logo: `pattern="marble"` draws a soft generated mark seeded by its name, the same for the same name everywhere (account switcher, create organization, onboarding).

## When NOT to use

- The Azion logo → use `brand`.
- A count or short status → use `badge`.
- A loading placeholder → use `skeleton`.

## Related

- `badge` — overlay on an avatar to show a count.
- `quote` — composes an avatar for the speaker.
- `brand` — the product mark, not a person.

## Best practices

- Pass the person's name or initials in `label` (`"Jane Doe"` or `"JD"`): a name of two or more words draws the first letter of its first and last words (`JD`) and keeps the whole name as the accessible name; a single word keeps its first two characters.
- Set `alt` to the person's name ("Jane Doe"). With `src` it is the image's `alt`; without an image it names the initials or icon fallback (`role="img"`), so a screen reader hears "Jane Doe", not "JD". Without `alt` the name falls back to the initials, then "Avatar" for an image or "User avatar" for the icon.
- Content precedence is `src`, then `pattern`, then `label`, then `icon` (default `az az-user`).
- For a generated mark, pass the full name in `label` (`"Acme Inc."`) with `pattern="marble"`: the name seeds the shapes, so one organization keeps one mark. Pass `colors` to pick its palette (three theme colors, such as an accent the person chose); do not inline your own generator or a data-URL image.
- `size` maps to 24 / 32 / 48 px with `medium` as the default; `variant` is `circle` (default) or `square`.

## Usage

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <Avatar label="JD" />
  <Avatar
    src="https://example.com/jane.jpg"
    alt="Jane Doe"
    size="large"
  />
  <Avatar
    icon="az az-users"
    variant="square"
    size="small"
  />
</template>
```

## Props

| Prop      | Type            | Default                                                     | Required | JSDoc                                                                                                            |
| --------- | --------------- | ----------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `src`     | `string`        | `''`                                                        | false    | Image URL. When set, renders a photo and takes precedence over label and icon.                                   |
| `alt`     | `string`        | `''`                                                        | false    | Accessible name: the image's `alt` with `src`, and the name of the initials or icon fallback without it.         |
| `label`   | `string`        | `''`                                                        | false    | Name or initials shown when no image: the first letters of the first and last words, or the first two characters of one word, uppercased. |
| `icon`    | `string`        | `'az az-user'`                                              | false    | Icon class for the fallback when no image or label (Azion icon class).                                           |
| `variant` | `AvatarVariant` | `'circle'`                                                  | false    | Visual shape of the avatar container.                                                                            |
| `size`    | `AvatarSize`    | `'medium'`                                                  | false    | Size preset matching Figma sm / md / lg (24 / 32 / 48 px).                                                       |
| `pattern` | `AvatarPattern` | `undefined`                                                 | false    | Generated fallback drawn when there is no image: `marble` blends three soft shapes seeded by `label` (or `alt`). |
| `colors`  | `string[]`      | `['var(--primary)', 'var(--warning)', 'var(--brand-blue)']` | false    | CSS colors the generated pattern paints with, in order; theme tokens such as `var(--primary)`.                   |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Content: `image` (`src`), `pattern` (`pattern` set, no `src`), `label` (initials), `icon`. `data-pattern` mirrors `pattern` on the root while the pattern renders.
- Root attributes: `data-variant` and `data-size` mirror the props; `data-content` names the content that renders (`image`, `pattern`, `label`, `icon`). Variants are styled from these attributes.
- Image error: when `src` fails to load, the avatar falls back to the next content in the precedence (`pattern`, `label`, `icon`) instead of a broken image; a new `src` tries the image again. An image that already failed before hydration is detected on mount.
- Attributes: every consumer attribute (`id`, `title`, `aria-*`, `style`, listeners) lands on the root.
- Marble: three layers seeded by a 32-bit string hash of `label` (falling back to `alt`): a filled square, then two blurred shapes translated, rotated and scaled by the seed, the last blended with `overlay`. Each layer takes the color at `(seed + layer) % colors.length`. The same seed and colors always draw the same mark, on the server and in the browser.

## Motion & Animations

_none_

## Tokens

| Region                   | Token (DESIGN.md)                                         |
| ------------------------ | --------------------------------------------------------- |
| typography               | .text-body-sm                                             |
| surface                  | `var(--bg-surface)`                                       |
| text                     | `var(--text-default)`                                     |
| spacing                  | `var(--spacing-3)`                                        |
| shape                    | `var(--shape-control)`                                    |
| ring                     | `var(--ring-color)`                                       |
| pattern colors (default) | `var(--primary)` · `var(--warning)` · `var(--brand-blue)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: none; the avatar is not focusable. A parent control (account menu trigger) owns focus.
- Keyboard map: none.
- ARIA: with `src` the `img` carries `alt`; without it the root is `role="img"` with `aria-label` (see Internationalization), and the initials, icon or pattern inside are presentational (`aria-hidden` on the icon and the pattern SVG).
- Contrast ≥4.5:1 for the initials on `var(--bg-surface-raised)`; the generated pattern is decorative and carries no text.

## Internationalization

| Key                    | English source | Override prop |
| ---------------------- | -------------- | ------------- |
| `avatar.imageAlt`      | Avatar         | `alt`         |
| `avatar.fallbackLabel` | User avatar    | `alt`         |

- Formatting: none. With `pattern`, the accessible name is `alt`, then the full `label`, then `avatar.fallbackLabel`.

## Right-to-left

- Layout: none; the avatar is a square box with centred content.
- Icons: the fallback icon and the generated pattern are not mirrored (the pattern is a mark, not a direction).
- Keyboard: none; the avatar is not interactive.
- User data: the initials and the name in the accessible name come from the consumer; no wrapper is needed for a two-character label.

## Responsive

- Container queries: none: fixed size (24 / 32 / 48 px from `size`).
- Narrow (≤ 640 px or a narrow container): nothing changes; the avatar does not shrink (`shrink-0`).
- Touch: not interactive; a parent control owns the target size.
- Reflow: fixed size, no horizontal scroll.

## Performance

- Bundle budget: 12 KB gzip for the initial chunk of `./avatar` (it carries the locale lookup) in `.size-limit.json`.
- Runtime budget: none: static; the pattern is a three-layer inline SVG computed once per `label` and `colors` change.
- Heavy parts: the marble drawing loads in its own async chunk the first time an avatar sets `pattern`, so an avatar without a pattern pays nothing for it. Server rendering resolves the chunk before it writes the HTML, so hydration finds the same SVG; on a client-only render the avatar's surface shows until the chunk arrives.

## Examples

- Default
- Types — every `variant` side by side.
- Sizes — every `size` side by side.
- Fallbacks — the content precedence: photo, initials, icon.
- VariantGrid — shapes and sizes across the content modes.
- Pattern — generated marble marks for organizations with no logo, one per name and palette; justified because `pattern` replaces the initials with a different content mode.

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
