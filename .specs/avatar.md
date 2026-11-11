---
name: avatar
category: content
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-882
  node_id: 477:882
checksum: 8669bc99ef2a2d44394645ee3d2a869ad35f99a01318649faa12abe8c65c77b4
created: 2026-05-22
last_updated: 2026-11-11
---

# Avatar — Component Spec

## Purpose

Displays content or metadata in the UI. Lives at `packages/webkit/src/components/content/avatar/`.

## When to use

- Identify a person next to their name: comment threads, member lists, "Last modified" cells, quotes.
- The user entry in a header or account menu.

## When NOT to use

- The Azion logo → use `brand`.
- A count or short status → use `badge`.
- A loading placeholder → use `skeleton`.

## Related

- `badge` — overlay on an avatar to show a count.
- `quote` — composes an avatar for the speaker.
- `brand` — the product mark, not a person.

## Best practices

- Pass initials in `label` (`"JD"`); it keeps the first two characters, so a full name shows its first two letters, not initials.
- Set `alt` to the person's name ("Jane Doe"). With `src` it is the image's `alt`; without an image it names the initials or icon fallback (`role="img"`), so a screen reader hears "Jane Doe", not "JD". Without `alt` the name falls back to the initials, then "Avatar" for an image or "User avatar" for the icon.
- Content precedence is `src`, then `label`, then `icon` (default `pi pi-user`).
- `size` maps to 24 / 32 / 48 px with `medium` as the default; `kind` is `circle` (default) or `square`.

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
    icon="pi pi-users"
    kind="square"
    size="small"
  />
</template>
```

## Props

| Prop    | Type         | Default        | Required | JSDoc                                                                                                    |
| ------- | ------------ | -------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `src`   | `string`     | `undefined`    | false    | Image URL. When set, renders a photo and takes precedence over label and icon.                           |
| `alt`   | `string`     | `undefined`    | false    | Accessible name: the image's `alt` with `src`, and the name of the initials or icon fallback without it. |
| `label` | `string`     | `undefined`    | false    | Initials shown when no image (normalized to two uppercase characters).                                   |
| `icon`  | `string`     | `'pi pi-user'` | false    | Icon class for the fallback when no image or label (PrimeIcons class).                                   |
| `kind`  | `AvatarKind` | `'circle'`     | false    | Visual shape of the avatar container.                                                                    |
| `size`  | `AvatarSize` | `'medium'`     | false    | Size preset matching Figma sm / md / lg (24 / 32 / 48 px).                                               |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

_none_

## Tokens

| Region     | Token (DESIGN.md)       |
| ---------- | ----------------------- |
| typography | .text-body-sm           |
| surface    | `var(--bg-surface)`     |
| text       | `var(--text-default)`   |
| spacing    | `var(--spacing-3)`      |
| shape      | `var(--shape-elements)` |
| ring       | `var(--ring-color)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

- Default

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
