---
name: link
category: navigation
structure: monolithic
status: implemented
spec_version: 2
checksum: 1de6b4b99aa20e4bf4196fc89409cec794ba4f7456db90299564a55c872edafd
created: 2026-05-22
last_updated: 2026-11-09
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578
  node_id: 3548:578
---
# Link — Component Spec

## Purpose

Helps users move between views or sections. Migrated from the existing implementation at `packages/webkit/src/components/navigation/link/`. Design source: [Webkit — Link](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578) (`Size` × `State` variants; hover/active handled in CSS).

## When to use

- A standalone navigation link: a domain, a repository, a docs page, "View all".
- An in-console navigation action ("Add custom domain") with `showIcon` set to false.

## When NOT to use

- A link inside a sentence → use a plain anchor with the text-link class.
- An action that changes something instead of navigating → use `button`.
- A compact marketing CTA with a brand-colored icon inside a card → use `mini-button`.

## Related

- `mini-button` — same anatomy in default text color with a brand-colored icon; `large` and `medium` only.
- `button` — set `href` when a link must look like a button.
- `breadcrumb` — a trail of links for hierarchical location.

## Best practices

- Always set `href` and a `label` that names the destination; the defaults (`'#'`, `'Learn More'`) are placeholders.
- Keep the default `pi pi-external-link` icon for off-site targets with `target="_blank"` (`rel="noopener noreferrer"` is added for you); turn `showIcon` off for in-app destinations.
- Match `size` to the controls around it; heights follow `button` (40 / 32 / 28 px).
- `disabled` drops it from the tab order and suppresses `click`; hide a link that can never be followed instead.

## Usage

```vue
<script setup>
import Link from '@aziontech/webkit/link'
</script>

<template>
  <Link label="View documentation" href="https://www.azion.com/en/documentation/" target="_blank" />
  <Link label="Add custom domain" href="/domains/create" size="medium" :show-icon="false" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `'Learn More'` | false | Visible label rendered inside the link. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height and typography (large 40px, medium 32px, small 28px), matching Button. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `showIcon` | `boolean` | `true` | false | When true, renders the trailing icon. |
| `icon` | `string` | `'pi pi-external-link'` | false | PrimeIcons class for the trailing icon. |
| `href` | `string` | `'#'` | false | Destination URL for the anchor. |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when navigating. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | .text-button-lg / .text-button-md |
| surface | `var(--bg-surface-raised)` |
| text | `var(--text-link)` |
| spacing | `var(--spacing-xs)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter` activates.
- ARIA: `aria-disabled` and `tabindex="-1"` when disabled.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Sizes
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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
