---
name: button-highlight
category: actions
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4313-20621
  node_id: 4313:20500
checksum: 56f7cbc0511be227d09526cfd8e9afe75d39653bf5ce1009db0e2c9913c182eb
created: 2026-06-01
last_updated: 2026-06-01
---
# Button Highlight — Component Spec

## Purpose

Visually emphasized action trigger built on a brand-accent gradient. Use it to draw attention to a primary AI / highlight flow that needs to stand out from a regular `Button`. One visual treatment (the gradient); same prop surface as `Button` minus the `kind` axis.

## Usage

```vue
<script setup>
import ButtonHighlight from '@aziontech/webkit/button-highlight'
</script>

<template>
  <ButtonHighlight label="Ask Azion" icon="pi pi-sparkles" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `—` | yes | Visible label text. Required — use `IconButton` for icon-only controls. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | no | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | no | Shows loading state and disables activation. |
| `icon` | `string` | `''` | no | PrimeIcons class for the leading icon. |
| `href` | `string` | `''` | no | When set, renders as an anchor link. |
| `target` | `'_blank' \| '_self'` | `'_self'` | no | Link target when `href` is set. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fires on activation; suppressed when `disabled` or `loading`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-disabled` mirrors the `disabled` prop
- `data-loading` mirrors the `loading` prop
- `data-size` mirrors the `size` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| hover / focus state change | `transition-colors duration-fast-02 ease-productive-entrance` | semantic (110ms · productive-entrance) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (large) | `.text-button-lg` |
| typography (medium/small) | `.text-button-md` |
| text | `var(--text-default)` |
| text (disabled) | `var(--text-disabled)` |
| surface (disabled) | `var(--bg-disabled)` |
| backdrop overlay | `var(--bg-backdrop)` |
| gradient stop 1 | `var(--color-accent-900)` |
| gradient stop 2 | `var(--color-accent-100)` |
| gradient stop 3 | `var(--color-accent-600)` |
| border | `var(--secondary-mask)` |
| border width | `var(--border-width-default)` |
| shape | `var(--shape-button)` |
| spacing.x (large) | `var(--spacing-md)` |
| spacing.x (medium) | `var(--spacing-sm)` |
| spacing.x (small) | `var(--spacing-xs)` |
| gap | `var(--spacing-xs)` |
| ring | `var(--ring-color)` |
| ring offset surface | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses; `Enter` / `Space` activates.
- ARIA: `<button>` role by default; renders `<a>` when `href` is set with `aria-disabled` / `aria-busy` mirroring `disabled` / `loading`.
- Contrast: gradient passes ≥4.5:1 for the `--text-default` foreground due to the `--bg-backdrop` overlay; disabled state pairs `--bg-disabled` with `--text-disabled`.
- `motion-reduce:transition-none` on every transition class.
- Touch target ≥40×40 px at `size: 'large'`; smaller sizes are for dense toolbars and surface a larger hit area via the surrounding container.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value side-by-side.
- Loading
- Icon — composite story showcasing the highlight with a custom `icon`.
- Disabled

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
