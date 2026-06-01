---
name: mini-button
category: actions
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3211-220
  node_id: 3211:220
checksum: 0aece9c0160c2aeb9b5e2a6113130750eb8d9f3d5845f654478366b1785d718e
created: 2026-06-01
last_updated: 2026-06-01
---

# Mini Button — Component Spec

## Purpose

Compact text action with an optional trailing external-link icon and a ghost hover surface. Use for secondary CTAs in dense layouts (cards, tables, toolbars) where a full `Button` is too heavy. Differs from `navigation/link` by using default body text color and a brand-colored icon.

## Usage

```vue
<script setup>
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <MiniButton
    label="Learn More"
    href="#"
    target="_blank"
  />
</template>
```

## Props

| Prop       | Type                  | Default                 | Required | JSDoc                                             |
| ---------- | --------------------- | ----------------------- | -------- | ------------------------------------------------- |
| `label`    | `string`              | `'Learn More'`          | no       | Visible label rendered inside the control.        |
| `size`     | `'large' \| 'medium'` | `'large'`               | no       | Size token; affects height, gap, and typography.  |
| `disabled` | `boolean`             | `false`                 | no       | Disables interaction and applies disabled tokens. |
| `showIcon` | `boolean`             | `true`                  | no       | When true, renders the trailing icon.             |
| `icon`     | `string`              | `'pi pi-external-link'` | no       | PrimeIcons class for the trailing icon.           |
| `href`     | `string`              | `'#'`                   | no       | Destination URL for the anchor.                   |
| `target`   | `'_blank' \| '_self'` | `'_self'`               | no       | Link target when navigating.                      |

## Events

| Event   | Payload      | Notes                                            |
| ------- | ------------ | ------------------------------------------------ |
| `click` | `MouseEvent` | Fires on activation; suppressed when `disabled`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- `data-size` mirrors the `size` prop

## Motion & Animations

| Trigger                     | Animation / Transition                                          | Token  | Reduced-motion fallback                |
| --------------------------- | --------------------------------------------------------------- | ------ | -------------------------------------- |
| hover / focus ghost surface | `transition-opacity duration-150 ease-out`                      | inline | `motion-reduce:transition-none`        |
| hover / focus ghost overlay | `before:transition-opacity before:duration-150 before:ease-out` | inline | `motion-reduce:before:transition-none` |

## Tokens

| Region               | Token (DESIGN.md)      |
| -------------------- | ---------------------- |
| typography (large)   | `.text-button-lg`      |
| typography (medium)  | `.text-button-md`      |
| text                 | `var(--text-default)`  |
| text (disabled)      | `var(--text-disabled)` |
| icon                 | `var(--primary)`       |
| ghost surface        | `var(--bg-hover)`      |
| ghost overlay        | `var(--bg-mask)`       |
| ghost active         | `var(--bg-active)`     |
| spacing.gap (large)  | `var(--spacing-xs)`    |
| spacing.gap (medium) | `var(--spacing-xxs)`   |
| spacing.ghost inset  | `var(--spacing-xs)`    |
| shape                | `var(--shape-button)`  |
| ring                 | `var(--ring-color)`    |
| ring offset surface  | `var(--bg-canvas)`     |

## Theme gaps

| Figma variable        | Temporary primitive        | Follow-up         |
| --------------------- | -------------------------- | ----------------- |
| `gap/button-md` (6px) | `var(--spacing-xxs)` (4px) | `TODO: tokenizar` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses; `Enter` activates.
- ARIA: `aria-disabled` and `tabindex="-1"` when disabled.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px at `size: 'large'`; medium is for dense layouts.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value side-by-side.

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
