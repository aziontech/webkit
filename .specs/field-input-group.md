---
name: field-input-group
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10802
  node_id: 3714:10802
checksum: 6e03ff3fb8fdf3f005031bc583ef44c78b670d4f95304248730cae0846a69c76
created: 2026-07-01
last_updated: 2026-07-01
---

# FieldInputGroup — Component Spec

## Purpose

Form field wrapper around `InputGroup` that composes `Label`, `InputGroup` (with its own middle `<input>` rendered internally), and `HelperText` into a single vertical stack with consistent spacing. Mirrors `FieldText`'s API and template shape verbatim, except the underlying primitive is `InputGroup` (fixed height, no `size` prop, side slots for icons/text) instead of `InputText`. Use it whenever a text input surrounded by prefix/suffix content needs a visible label or helper/error message.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldInputGroup from '@aziontech/webkit/field-input-group'

const domain = ref('')
</script>

<template>
  <FieldInputGroup
    v-model="domain"
    label="Website"
    placeholder="mysite"
    helper-text="Enter the domain without the scheme."
    required
  >
    <template #left>https://</template>
    <template #right>.com</template>
  </FieldInputGroup>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `''` | no | Two-way bound value of the internal `<input>`. |
| `label` | `string` | `''` | no | Text rendered inside the `Label`. When empty, the label row is omitted. |
| `placeholder` | `string` | `''` | no | Placeholder forwarded to the internal `<input>`. |
| `helperText` | `string` | `''` | no | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted **except** when `disabled` is true — in that case the component falls back to a default disabled message so the lock icon always has matching copy. |
| `disabled` | `boolean` | `false` | no | Disables the input and the `InputGroup` chrome, and switches the helper to `kind="disabled"` (lock icon). |
| `readonly` | `boolean` | `false` | no | Marks the internal input read-only; value is visible but not editable. Native pass-through. |
| `required` | `boolean` | `false` | no | Adds the Required tag to the `Label`, sets `required` on `InputGroup`, and sets native `required` + `aria-required` on the internal `<input>`. |
| `invalid` | `boolean` | `false` | no | Sets `invalid` on `InputGroup` (danger border) and switches the helper to `kind="invalid"`. Also sets `aria-invalid` on the internal `<input>`. |
| `inputId` | `string` | `''` | no | `id` for the internal `<input>`; consumed by `Label` via `for` and by `aria-describedby` wiring. Auto-generated via Vue's `useId()` when empty. |
| `name` | `string` | `''` | no | HTML `name` for the internal `<input>` (form + vee-validate integration). |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `[value: string]` | Re-emitted from the internal `<input>` on native `input` event. Enables `v-model`. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `left` | — | Forwarded verbatim to `InputGroup`'s `#left`. Optional prefix content (icon, static text, or a small control). |
| `right` | — | Forwarded verbatim to `InputGroup`'s `#right`. Optional suffix content. |

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- On the field wrapper root: `data-disabled`, `data-invalid`, `data-required` mirror the props (for test/query targeting).
- `HelperText.kind` computed by precedence: `disabled > invalid > required > 'helper'`.
- When `disabled` is set and `helperText` is empty, the helper defaults to `'This field is locked.'` (parity with `FieldText`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| stack gap (vertical) | `var(--spacing-xs)` |
| internal input surface | `var(--bg-surface)` |
| internal input text | `var(--text-default)` |
| internal input placeholder | `var(--text-muted)` |
| internal input padding.x | `var(--spacing-md)` |
| internal input typography | `.text-label-sm` |

Border / focus / hover / invalid / required / disabled tokens are owned by the nested `InputGroup`.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to `InputGroup` (focus-within ring on the group root). The internal `<input>` renders `focus:ring-0 outline-none` so only the group ring shows.
- Keyboard map: `Tab` moves through any interactive side-slot content and then the internal `<input>`, in DOM order.
- ARIA: internal `<input>` receives `aria-invalid`, `aria-required`, and `aria-describedby` pointing at the `HelperText` id when helper text is present or `disabled` forces the fallback. `Label` is linked via `for=<inputId>`.
- Contrast ≥4.5:1 for label / input text / helper text against their surfaces.
- Motion: state color transitions come from `InputGroup` (`duration-150 ease-out`, `motion-reduce:transition-none`).
- Touch target ≥32×32 px (matches the fixed `h-8` `InputGroup` root).

## Stories (Storybook)

- Default — value + label + placeholder + helperText, no side slots filled.
- WithSlots — `#left` (`https://`) and `#right` (`.com`) filled.
- Required — `required=true`, reactive validation flow (label shows Required tag, invalid switches on empty submission).
- Invalid — `invalid=true` with a message in `helperText`.
- Disabled — `disabled=true`, helper falls back to the disabled copy.
- Icons — PrimeIcons in both side slots (`pi pi-globe` left, `pi pi-times` right).

Justification for six stories (deviates from Default+Types+Sizes+state pattern): the component has no `kind` and no `size`, so `Types` and `Sizes` do not apply. `Default`, `WithSlots`, and `Icons` document the composition API (label + helper + side slots). `Required`, `Invalid`, `Disabled` exercise the three state signals the wrapper propagates.

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
