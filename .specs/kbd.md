---
name: kbd
category: content
structure: monolithic
status: implemented
spec_version: 1
checksum: a33b777d8c2a30dfa9725287ae39ff44aac0c1fdbff2a8bf862a0761089a9710
created: 2026-07-23
last_updated: 2026-07-23
---
# Kbd — Component Spec

## Purpose

Kbd renders keyboard input — a single key or a shortcut combination — as a compact, non-interactive keycap. It reads like a real key: a bordered surface with a thicker bottom edge for depth. Modifier keys are passed as boolean props (`meta`, `shift`, `alt`, `ctrl`) and rendered with the correct OS-aware glyph (⌘ on macOS, Ctrl elsewhere), so consumers never hardcode platform symbols. Use it for shortcut hints in prose, menus, and control suffixes (e.g. the ⌘K hint in `command-menu`).

## When to use

- Show a keyboard shortcut or a single key inline (a ⌘K hint on a search button, an `Esc` hint in a dialog, `/` to focus search).
- Present a modifier combination whose glyph should adapt to the user's OS.

## When NOT to use

- The token is a status/category label, not a key → use `tag` or `badge`.
- You need an interactive control that fires on click → use `button` / `icon-button`; Kbd is a presentational hint only.

## Related

- `command-menu` — consumes Kbd for its per-item shortcut hints and its ⌘K trigger affordance.
- `badge` — compact non-interactive indicator for counts/status; Kbd is specifically for keyboard keys.

## Best practices

- Keep the default slot to a single key or glyph (`K`, `7`, `Enter`, `Esc`, `/`); avoid lowercase words or sentences.
- Pass modifiers as boolean props rather than hardcoding `⌘`/`⇧` so the glyph adapts to the OS.
- Place surrounding punctuation outside the element, not inside the keycap.

## Usage

```vue
<script setup>
import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <Kbd meta>K</Kbd>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `meta` | `boolean` | `false` | no | Prepend the meta/command modifier glyph (⌘ on macOS, Ctrl elsewhere). |
| `ctrl` | `boolean` | `false` | no | Prepend the Control modifier glyph (⌃ on macOS, Ctrl elsewhere). |
| `shift` | `boolean` | `false` | no | Prepend the Shift modifier glyph (⇧). |
| `alt` | `boolean` | `false` | no | Prepend the Alt/Option modifier glyph (⌥ on macOS, Alt elsewhere). |
| `size` | `'small' \| 'medium'` | `'medium'` | no | Size token; `small` is a denser keycap for menus, command bars, and table cells. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The single key or glyph rendered after any modifier glyphs (`K`, `Enter`, `Esc`). |

## States

Kbd is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-size` mirrors the `size` prop (`small` | `medium`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (medium) | `.text-label-md` + `leading-none` |
| typography (small) | `.text-label-sm` + `leading-none` |
| surface | `var(--bg-surface)` |
| label | `var(--text-default)` |
| border (keycap outline + thicker bottom edge) | `var(--border-default)` |
| shape | `var(--shape-elements)` |
| spacing (medium) | `var(--spacing-xs)` horizontal padding |
| spacing (small) | `var(--spacing-xs)` horizontal padding |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — Kbd is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Kbd is a presentational hint and exposes no interactive affordance.
- ARIA: the root is the native `<kbd>` element so assistive tech announces it as keyboard input; modifier glyphs render as text so a combination like ⌘K is announced in reading order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-default)` on `var(--bg-surface)` is theme-guaranteed in both light and dark.
- `motion-reduce:*`: not applicable — Kbd is static (no motion).
- Touch target: not applicable — Kbd is non-interactive.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value side-by-side.
- Combinations — composite story rendering representative shortcuts (single key, `meta` + key, `meta` + `shift` + key, a named key like `Esc`). Justified addition: the modifier props (`meta`/`ctrl`/`shift`/`alt`) are the component's primary feature and compose along multiple boolean axes at once — there is no single `kind` axis, so a composite that shows real combinations (and the OS-aware glyphs) is the only way to document the core behavior.

<!-- Types story omitted: Kbd has no `kind` axis. Loading/Disabled omitted: Kbd declares neither prop and is non-interactive. -->

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
