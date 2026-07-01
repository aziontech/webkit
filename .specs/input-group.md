---
name: input-group
category: inputs
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10802
  node_id: 3714:10802
checksum: 793c77a1aead7abe65b9521b3c8eec6df432f2ffe5a3ee2fd98d57f12eb0aec8
created: 2026-07-01
last_updated: 2026-07-01
---

# InputGroup — Component Spec

## Purpose

Container that flanks an input primitive with optional addons on either side (icon, static text, button), joined by vertical dividers, and reflects validation state on its border. Composed as `<InputGroup>` (root) plus `<InputGroup.Addon>` sub-components on the left, right, or both — the middle input goes in the root's default slot. Distinct from `field-*` components: `InputGroup` styles the input's *edges*; `field-*` wraps label + helper text.

The root **provides** an injection key (`InputGroupContextKey`) that future revisions of `input-text` (and other input primitives) will `inject` to render borderless inside the group. Until that lands, the middle slot expects a raw `<input>` element styled with `w-full bg-transparent border-0 outline-none focus:ring-0 h-full px-[var(--spacing-md)] text-[color:var(--text-default)]` — this is the canonical middle-slot markup shown in Usage and stories.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import InputGroup from '@aziontech/webkit/input-group'
const value = ref('')
</script>

<template>
  <InputGroup :invalid="false">
    <InputGroup.Addon>https://</InputGroup.Addon>
    <input
      v-model="value"
      placeholder="domain"
      class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-[color:var(--text-default)]"
    />
    <InputGroup.Addon>.com</InputGroup.Addon>
  </InputGroup>
</template>
```

Tree-shaking alternative — standalone root + sub-component, no compound `Object.assign` pulled in:

```vue
<script setup>
import { ref } from 'vue'
import InputGroup from '@aziontech/webkit/input-group-root'
import InputGroupAddon from '@aziontech/webkit/input-group-addon'
const value = ref('')
</script>

<template>
  <InputGroup>
    <InputGroupAddon>https://</InputGroupAddon>
    <input
      v-model="value"
      placeholder="domain"
      class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-[color:var(--text-default)]"
    />
  </InputGroup>
</template>
```

## Sub-components

- `input-group-addon/input-group-addon.vue` — Left/right addon slot. Position is determined by source order relative to the middle input, not by a prop. Exposes a `default` slot (scope: none) for the addon content (icon, static text, or a `<Button>`). Renders with `bg-[var(--bg-canvas)]` surface distinct from the middle field, `px-[var(--spacing-md)]`, `text-label-sm`, `text-[color:var(--text-muted)]`. The vertical seam between an addon and its neighbour is drawn by a CSS pseudo-border on the addon itself (`[&:not(:last-child)]:border-r [&:not(:first-child)]:border-l border-[var(--border-default)]`) — no `<Divider>` element or v-node inspection needed.

Resulting layout:

```
packages/webkit/src/components/inputs/input-group/
├── input-group.vue
├── injection-key.ts                    (exports InputGroupContextKey symbol; future primitives inject to detect nesting)
├── index.ts                            (Object.assign(InputGroup, { Addon: InputGroupAddon }))
└── input-group-addon/
    └── input-group-addon.vue
```

Compound file (`index.ts`):

```ts
import InputGroup from './input-group.vue'
import InputGroupAddon from './input-group-addon/input-group-addon.vue'
export default Object.assign(InputGroup, { Addon: InputGroupAddon })
```

## Props

Root (`InputGroup`):

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `invalid` | `boolean` | `false` | no | Renders the error border. When `required` is also `true`, the border uses the warning color instead of danger. Also sets `aria-invalid="true"` on the root. |
| `required` | `boolean` | `false` | no | Semantic marker for a required field. Combined with `invalid=true`, switches the border color to warning. Sets `aria-required="true"` on the root. |

Sub-component (`InputGroup.Addon`) has no props.

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Middle content — a raw `<input>` element in source order, optionally flanked by `<InputGroup.Addon>` siblings. `InputGroup.Addon` itself exposes a `default` slot that receives the addon content (icon, static text, or a `<Button>`); it is documented in the Sub-components section, not here. |

## States

- Visual states on root: `default`, `hover`, `focus-within`, `invalid`, `required`
- `data-invalid` mirrors the `invalid` prop; sets `aria-invalid="true"`
- `data-required` mirrors the `required` prop; sets `aria-required="true"`
- Border semantics mirror `input-text` (independent, not compound):
  - `data-invalid` → `var(--danger-border)`
  - `data-required` → `var(--warning-border)`
- Hover (only when not focus-within and neither invalid nor required): `border-[var(--border-strong)]`
- Focus-within: 2-ring at `var(--ring-color)` with `var(--bg-canvas)` offset

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
| root border width | `border` (Tailwind utility) |
| root shape | `var(--shape-elements)` |
| root height | `h-8` (Tailwind utility) |
| focus ring | `var(--ring-color)` |
| focus ring offset | `var(--bg-canvas)` |
| addon surface | `var(--bg-canvas)` |
| addon text | `var(--text-muted)` |
| addon padding.x | `var(--spacing-md)` |
| addon typography | `.text-label-sm` |
| addon seam (vertical border) | `var(--border-default)` (as `border-r`/`border-l` on the addon) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the root shows a `focus-within` ring (`ring-2 ring-[var(--ring-color)] ring-offset-2 ring-offset-[var(--bg-canvas)]`) whenever any descendant (addon control or middle input) has focus. The middle input renders `focus:ring-0 outline-none` so the group's ring is the only visible focus indicator.
- Keyboard map: `Tab` moves through the addon interactive content (if any) and the middle input in DOM order. No custom keybindings on the group.
- ARIA: root uses `role="group"`; `aria-invalid` and `aria-required` reflect the props. The inner input keeps its own `aria-*` — the group does not duplicate.
- Contrast ≥4.5:1 for addon text against `var(--bg-canvas)`; ≥3:1 for the border in every state.
- Motion: color transitions on state changes are `duration-150 ease-out` and pair with `motion-reduce:transition-none`.
- Touch target ≥32×32 px for interactive addon content (matches root height `h-8`).

## Stories (Storybook)

- Default — root with a middle `<InputText>` and no addons.
- WithLeftAddon — one `<InputGroup.Addon>` before the input (e.g. `https://`).
- WithRightAddon — one `<InputGroup.Addon>` after the input (e.g. `.com`).
- BothAddons — an addon on each side.
- Invalid — `invalid=true`, no `required` (danger border).
- InvalidRequired — `invalid=true` and `required=true` (warning border).

Justification for six stories (deviates from Default+Types+Sizes+state pattern): the component has no `kind` and no `size`, so `Types` and `Sizes` do not apply. The four composition stories (Default, WithLeftAddon, WithRightAddon, BothAddons) document the sub-component's positional flexibility, which is the primary API surface. The two state stories exercise the two visually distinct border colors that hinge on the `invalid + required` combination — a non-obvious interaction that would otherwise be hidden.

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
