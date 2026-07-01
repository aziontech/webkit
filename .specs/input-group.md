---
name: input-group
category: inputs
structure: monolithic
status: implemented
spec_version: 3
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10802
  node_id: 3714:10802
checksum: 0ede3c42dbd778be429c8e91192d35cbc9b09f42154ae6a9ae6f064a2b6a74d7
created: 2026-07-01
last_updated: 2026-07-01
---

# InputGroup — Component Spec

## Purpose

Monolithic container that flanks an input primitive with optional `#left` and `#right` named slots, joined by vertical seams, and reflects validation state on its border. The middle input goes in the root's `default` slot; the two side regions are simple named slots on the root — the same shape as `input-text`'s `iconLeft` / `iconRight` and `input-number`'s `prefix` / `suffix`, so the API stays consistent with the sibling inputs. Distinct from `field-*` components: `InputGroup` styles the input's *edges*; `field-*` wraps label + helper text. The middle slot expects a raw `<input>` styled `bg-[var(--bg-surface)]`, `text-label-sm`, `text-[var(--text-default)]`, `placeholder:text-[var(--text-muted)]` — matches the group's own surface so the field blends with the root while the side slots stand out as darker `--bg-canvas` islands.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import InputGroup from '@aziontech/webkit/input-group'
const value = ref('')
</script>

<template>
  <InputGroup :invalid="false">
    <template #left>https://</template>
    <input
      v-model="value"
      placeholder="domain"
      class="w-full h-full bg-[var(--bg-surface)] border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)]"
    />
    <template #right>.com</template>
  </InputGroup>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `invalid` | `boolean` | `false` | no | Renders the error border and sets `aria-invalid="true"` on the root. |
| `required` | `boolean` | `false` | no | Renders the required (warning) border and sets `aria-required="true"` on the root. |
| `disabled` | `boolean` | `false` | no | Renders the disabled visual (muted fill, not-allowed cursor, no focus-within ring) and sets `aria-disabled="true"` on the root. Does not propagate to the middle `<input>` — the consumer is responsible for the inner input's own `disabled` attribute (mirrors how `FieldText` disables `InputText`). |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `left` | — | Optional left-side content (icon, static text, or a `<Button>`). When present, rendered inside a styled `<div>` (`bg-[var(--bg-canvas)]`, `px-[var(--spacing-md)]`, `text-label-sm`, `text-[color:var(--text-muted)]`, `border-r border-[color:var(--border-default)]`). |
| `default` | — | Middle content — a raw `<input>` element (or any input primitive). |
| `right` | — | Optional right-side content, same styling as `#left` but with `border-l` instead of `border-r`. |

## States

- Visual states on root: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`
- `data-invalid` mirrors the `invalid` prop; sets `aria-invalid="true"`
- `data-required` mirrors the `required` prop; sets `aria-required="true"`
- `data-disabled` mirrors the `disabled` prop; sets `aria-disabled="true"`
- Border semantics mirror `input-text` (independent, not compound):
  - `data-invalid` → `var(--danger-border)`
  - `data-required` → `var(--warning-border)`
- Hover (only when not focus-within, not invalid, not required, not disabled): `border-[var(--border-strong)]`
- Focus-within: 2-ring at `var(--ring-color)` with `var(--bg-canvas)` offset (suppressed when `data-disabled`)
- Disabled: `bg-[var(--bg-disabled)]`, `text-[var(--text-disabled)]`, `cursor-not-allowed`, hover ignored, focus-within ring suppressed

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus-within / invalid / required state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| root surface | `var(--bg-surface)` |
| root border (default) | `var(--border-default)` |
| root border (hover) | `var(--border-strong)` |
| root border (invalid) | `var(--danger-border)` |
| root border (required) | `var(--warning-border)` |
| root surface (disabled) | `var(--bg-disabled)` |
| root text (disabled) | `var(--text-disabled)` |
| root border width | `border` (Tailwind utility) |
| root shape | `var(--shape-elements)` |
| root height | `h-8` (Tailwind utility) |
| focus ring | `var(--ring-color)` |
| focus ring offset | `var(--bg-canvas)` |
| side slot surface | `var(--bg-canvas)` |
| side slot text | `var(--text-muted)` |
| side slot padding.x | `var(--spacing-md)` |
| side slot typography | `.text-label-sm` |
| left slot seam | `border-r border-[color:var(--border-default)]` |
| right slot seam | `border-l border-[color:var(--border-default)]` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the root shows a `focus-within` ring (`ring-2 ring-[var(--ring-color)] ring-offset-2 ring-offset-[var(--bg-canvas)]`) whenever any descendant (side-slot control or middle input) has focus. The middle input renders `focus:ring-0 outline-none` so the group's ring is the only visible focus indicator. Suppressed when `data-disabled` is present.
- Keyboard map: `Tab` moves through the side-slot interactive content (if any) and the middle input in DOM order. No custom keybindings on the group.
- ARIA: root uses `role="group"`; `aria-invalid` and `aria-required` reflect the props. The inner input keeps its own `aria-*` — the group does not duplicate.
- Contrast ≥4.5:1 for side-slot text against `var(--bg-canvas)`; ≥3:1 for the border in every state.
- Motion: color transitions on state changes are `duration-150 ease-out` and pair with `motion-reduce:transition-none`.
- Touch target ≥32×32 px for interactive side-slot content (matches root height `h-8`).

## Stories (Storybook)

- Default — root with a middle input, no side slots filled.
- WithSlotLeft — `#left` slot filled (e.g. `https://`).
- WithSlotRight — `#right` slot filled (e.g. `.com`).
- BothSlots — both `#left` and `#right` filled.
- WithIcon — `#left` filled with `<i class="pi pi-globe" aria-hidden="true" />`, showing how PrimeIcons inhabit the side slots at the same size as text content.
- Invalid — `invalid=true` (danger border).
- Required — `required=true` (warning border).
- Disabled — `disabled=true` (muted fill, not-allowed cursor, no focus ring).

Justification for eight stories (deviates from Default+Types+Sizes+state pattern): the component has no `kind` and no `size`, so `Types` and `Sizes` do not apply. Four slot-composition stories (Default, WithSlotLeft, WithSlotRight, BothSlots) document each named-slot position individually and combined. `WithIcon` demonstrates that side slots accept `<i>` icons at the same size/color as text content (parallel to `FieldText`'s Icons story). Three state stories exercise `Invalid`, `Required`, and `Disabled` — the visual signals the component can emit.

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
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
