---
name: input-group
category: inputs
structure: composition
status: approved
spec_version: 4
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10802
  node_id: 3714:10802
checksum: a084ea5340b76e0a5664fd895a69ce39d6b1679fa243ba3dd7a4c14b9af913bc
created: 2026-07-01
last_updated: 2026-07-06
---

# InputGroup — Component Spec

## Purpose

Composition container that joins an input primitive with any number of adjacent controls (buttons, selects, static addons) into a single visual field — the webkit analogue of PrimeVue's `InputGroup`. The root only orchestrates: it draws the outer border, the `focus-within` ring, and applies inline Tailwind child-selectors so the first child rounds only on the left, the last only on the right, and internal borders collapse between siblings. Everything else is a **child**: the middle input is a raw `<input>` in the root's `default` slot; sibling controls (`<Button>`, `<Select>`, `<InputText>`, or an `<InputGroup.Addon>` for static text like `https://` / `.com` / `R$`) are dropped in directly alongside it. This is a breaking change from v3: the `#left` and `#right` named slots are gone — their static-text role moves to `<InputGroup.Addon>`, and their interactive role is served by placing the real component (`Button`, `Select`) as a direct child. Consumers therefore never wrap `Button`/`Select` in an inner `<div>` — the root's child selectors do that job.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  // Compound — leads the docs, dot-notation
  import InputGroup from '@aziontech/webkit/input-group'
  import Button from '@aziontech/webkit/button'
  import Select from '@aziontech/webkit/select'

  const url = ref('')
  const amount = ref('')
  const currency = ref('BRL')
</script>

<template>
  <!-- Static addons flanking a middle input -->
  <InputGroup>
    <InputGroup.Addon>https://</InputGroup.Addon>
    <input
      v-model="url"
      placeholder="domain"
      class="w-full h-full bg-[var(--bg-surface)] border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)]"
    />
    <InputGroup.Addon>.com</InputGroup.Addon>
  </InputGroup>

  <!-- Select on the left, input on the right -->
  <InputGroup>
    <Select
      v-model="currency"
      placeholder="BRL"
    />
    <input
      v-model="amount"
      placeholder="0.00"
      class="w-full h-full bg-[var(--bg-surface)] border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)]"
    />
  </InputGroup>

  <!-- Input + trailing Button -->
  <InputGroup :invalid="false">
    <input
      v-model="url"
      placeholder="search"
      class="w-full h-full bg-[var(--bg-surface)] border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)]"
    />
    <Button
      label="Search"
      kind="primary"
    />
  </InputGroup>
</template>
```

Standalone (tree-shakeable) imports — for consumers who want only the root or a specific sub-component:

```vue
<script setup>
  import InputGroup from '@aziontech/webkit/input-group-root'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
</script>
```

## Sub-components

Folder layout:

```
packages/webkit/src/components/inputs/input-group/
├── input-group.vue                      # root
├── input-group-addon/
│   └── input-group-addon.vue            # <InputGroup.Addon>
└── index.ts                             # compound wire-up (Object.assign)
```

Public members of the compound:

| Member | Attached name | Standalone export | Purpose |
|---|---|---|---|
| Root | — (the compound itself) | `@aziontech/webkit/input-group-root` | The container. Orchestrates borders, seams, focus ring, and states. |
| `<InputGroup.Addon>` | `Addon` | `@aziontech/webkit/input-group-addon` | Static-content island (icon, text like `https://`, `.com`, `R$`) rendered with the darker `--bg-canvas` fill and muted text. |

## Props

Root props:

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `invalid` | `boolean` | `false` | no | Renders the error border and sets `aria-invalid="true"` on the root. |
| `required` | `boolean` | `false` | no | Renders the required (warning) border and sets `aria-required="true"` on the root. |
| `disabled` | `boolean` | `false` | no | Renders the disabled visual (muted fill, not-allowed cursor, no focus-within ring) and sets `aria-disabled="true"` on the root. Does not propagate to the child controls — each child is responsible for its own `disabled` attribute (mirrors how `FieldText` disables `InputText`). |

`InputGroup.Addon` props: _none_ — the sub-component is a pure presentational span whose content is the default slot. `v-bind="$attrs"` on its root lets the consumer pass `data-testid`, `aria-hidden`, `class` (merged via `cn`), etc.

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | On the **root**: the full row of children in visual order — any mix of `<InputGroup.Addon>`, `<Button>`, `<Select>`, `<InputText>`, raw `<input>`. Order in the template is the order rendered left-to-right. On **`<InputGroup.Addon>`**: the addon content — text (`https://`, `.com`, `R$`), a PrimeIcons `<i>`, or any small inline node; kept short by convention (long content breaks the fixed row height). |

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
- Child seams (applied by the root via Tailwind child selectors):
  - `[&>*:first-child]:rounded-l-[var(--shape-elements)]` and `[&>*:not(:first-child)]:rounded-l-none`
  - `[&>*:last-child]:rounded-r-[var(--shape-elements)]` and `[&>*:not(:last-child)]:rounded-r-none`
  - `[&>*:not(:last-child)]:border-r-[color:var(--border-default)] [&>*:not(:last-child)]:border-r` — a single vertical seam between adjacent children, drawn on the left child so child components keep their own left border intact
  - Child components' own outer borders remain — the root's outer border sits on top, so double lines are avoided by the child selector removing the *inner-facing* border only

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
| child seam | `border-r border-[color:var(--border-default)]` (applied via `[&>*:not(:last-child)]:border-r`) |
| addon surface | `var(--bg-canvas)` |
| addon text | `var(--text-muted)` |
| addon padding.x | `var(--spacing-md)` |
| addon typography | `.text-label-sm` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the root shows a `focus-within` ring (`ring-2 ring-[var(--ring-color)] ring-offset-2 ring-offset-[var(--bg-canvas)]`) whenever any descendant (any child control or the middle input) has focus. The middle input renders `focus:ring-0 outline-none` so the group's ring is the only visible focus indicator. Suppressed when `data-disabled` is present. Child components (`Button`, `Select`) retain their own focus behavior internally but the group's ring is visually authoritative.
- Keyboard map: `Tab` moves through the children in DOM order. No custom keybindings on the group.
- ARIA: root uses `role="group"`; `aria-invalid` and `aria-required` reflect the props. Each child keeps its own `aria-*` — the group does not duplicate.
- `<InputGroup.Addon>` is decorative-by-default; when its content is not conveyed elsewhere the consumer should annotate it (`aria-hidden="true"` for pure decoration, or a visible-only label the middle input references via `aria-describedby`).
- Contrast ≥4.5:1 for addon text against `var(--bg-canvas)`; ≥3:1 for the border in every state.
- Motion: color transitions on state changes are `duration-150 ease-out` and pair with `motion-reduce:transition-none`.
- Touch target ≥32×32 px for interactive children (matches root height `h-8`).

## Stories (Storybook)

- Default — root with a middle input, no addons or extra children.
- WithAddonLeft — `<InputGroup.Addon>https://</InputGroup.Addon>` + middle input.
- WithAddonRight — middle input + `<InputGroup.Addon>.com</InputGroup.Addon>`.
- BothAddons — addon + input + addon.
- WithButton — middle input + trailing `<Button label="Search" />`.
- WithSelect — leading `<Select placeholder="BRL" />` + middle input.
- WithAll — addon + `<Select>` + input + `<Button>` (four children).
- Invalid — `invalid=true` (danger border).
- Required — `required=true` (warning border, always visible).
- Disabled — `disabled=true` (muted fill, not-allowed cursor, no focus ring).

Justification for ten stories (deviates from Default+Types+Sizes+state pattern): the component has no `kind` and no `size`, so `Types` and `Sizes` do not apply. Four addon-composition stories (Default, WithAddonLeft, WithAddonRight, BothAddons) document the static-content path. Three integration stories (WithButton, WithSelect, WithAll) prove Button/Select-as-children — the whole point of v4. Three state stories exercise `Invalid`, `Required`, and `Disabled` — the visual signals the component can emit.

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
