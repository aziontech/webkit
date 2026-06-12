---
name: skeleton
category: feedback
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-881&m=dev
  node_id: 479:881
checksum: 0b68386d979b310f1eaba6d93710eb8ee085c3a486c8632b3673dfe96b875cd7
created: 2026-06-09
last_updated: 2026-06-09
---

# Skeleton — Component Spec

## Purpose

Loading placeholder that reserves the space of content while it loads, reducing layout shift and signaling progress. Non-interactive and purely decorative: it renders a low-contrast surface block with a soft opacity pulse. Replaces the legacy PrimeVue wrapper at `packages/webkit/src/core/primevue/skeleton/` with a dependency-free webkit implementation.

Two shapes via `kind`: `shape` is a rounded rectangle the consumer sizes freely through `width`/`height` (a 1:1 size renders a square; a wide, short size renders a text line), and `circular` is a full circle. Figma variant mapping (frame `_Skeleton`, node `479:881`): `Shape=Rectangle` and `Shape=Text` → `kind="shape"`, `Shape=Circle` → `kind="circular"`.

## Usage

```vue
<script setup>
import Skeleton from '@aziontech/webkit/feedback/skeleton'
</script>

<template>
  <div aria-busy="true">
    <Skeleton kind="circular" width="48px" height="48px" />
    <Skeleton kind="shape" width="200px" height="16px" />
    <Skeleton kind="shape" width="240px" height="120px" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'shape' \| 'circular'` | `'shape'` | no | Visual shape variant; controls the border radius token. |
| `width` | `string` | `'100%'` | no | CSS width applied as inline style (e.g. `240px`, `100%`). |
| `height` | `string` | `'16px'` | no | CSS height applied as inline style (e.g. `120px`, `1rem`); use a 1:1 width/height for a square. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default` only — the component is non-interactive (no `hover`, `focus-visible`, `active`, `disabled`).
- `data-kind` mirrors the `kind` prop: `shape` | `circular`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| always while mounted (loading pulse) | `animate-pulse` — opacity pulse on the root | `pulse` from `primitives/animations/animate.js` (`pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`); exposed as the Tailwind `animate-pulse` utility — no new token | `motion-reduce:animate-none` (static placeholder) |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface | `var(--bg-surface-raised)` |
| shape (kind=shape) | `var(--shape-elements)` |
| shape (kind=circular) | `rounded-full` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--bg-surface-raised` exists in `theme/background.js` but is missing from DESIGN.md § Colors table | used as-is (resolves at runtime) | `TODO:` document in DESIGN.md § Colors |

## Accessibility (WCAG 2.1 AA)

- Not focusable and non-interactive: no visible-focus treatment, no keyboard map, no touch-target requirement.
- ARIA: root carries `aria-hidden="true"` (decorative placeholder). Consumers set `aria-busy="true"` on the region whose content is loading, and provide a text alternative (e.g. visually hidden "Loading…") at the region level.
- Contrast: exempt from text contrast (renders no text/icons); the surface is intentionally low-contrast.
- `motion-reduce:animate-none` disables the pulse for reduced-motion users; the static block remains.

## Stories (Storybook)

Canonical layout — matches `apps/storybook/src/stories/webkit/actions/button/Button.stories.js`. Composite stories render every variant side-by-side in a single frame.

- Default
- Types — composite story rendering every `kind` value side-by-side: `shape` (240×120 block and 200×16 text line) and `circular` (48×48).

(No `size`, `loading`, or `disabled` props → no Sizes/Loading/Disabled stories.)

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
