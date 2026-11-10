---
name: stepper
category: navigation
structure: composition
status: implemented
spec_version: 1
checksum: de38c8f218df6bb708fd8b86415dfc9e9d6001b13f9abcc4125f876f9fde0088
created: 2026-09-22
last_updated: 2026-09-22
---

# Stepper — Component Spec

## Purpose

A vertical rail that names the steps of one task, says which step the reader is on, and carries the
progress between them on the line that joins the dots. It is the left column of a multi-step surface —
a create wizard, a guided setup — while the content of the current step fills the column beside it.

It is **vertical only**, by design. The rail runs the full height of the surface so the connector
between two dots is the thing that measures progress; a horizontal variant would be a different
component with a different job (a compact progress ribbon), not a prop on this one.

## When to use

- A task is split into ordered steps and only one is on screen at a time (a create wizard, a guided setup).
- The reader needs to see how many steps are left and go back to one they already answered.
- A step can fail validation, or sit in flight, and the rail has to say so without leaving the step.

## When NOT to use

- Numbered instructions inside a document, where every step is read at once → use `doc-steps` + `doc-step`.
- Progress with no discrete, nameable steps (a percentage, an upload) → use `progress-bar`.
- Switching between peer views that are not ordered and have no completion → use `tab-view`.
- A provisioning log that reports what a server is doing, rather than what the reader must answer → use `flow`.

## Related

- `doc-steps` — the same numbered-dot shape for prose; static, never current, never navigable.
- `tab-view` — peer views with no order and no completion.
- `progress-bar` — continuous progress with no named steps.
- `flow` — a machine's stages, reported rather than navigated.

## Best practices

- Give every step a title that names the decision (`Where it runs`), not the control (`Select`).
- Keep steps reachable backwards and closed forwards: mark a step `disabled` until the one before it is answered.
- Set `state="error"` only after the reader tried to advance — a step is not wrong while it is unanswered.
- One `Stepper` per surface. Two rails on one screen ask the reader which task they are in.
- The rail is navigation, not the form. Put the fields in the content column, never inside a step's slot.

## Usage

```vue
<script setup>
  import Stepper from '@aziontech/webkit/stepper'
  import { ref } from 'vue'

  const step = ref('host')
</script>

<template>
  <Stepper
    v-model="step"
    aria-label="Create network list"
  >
    <Stepper.Step
      value="host"
      title="Where it runs"
      description="The firewall that reads this list."
      state="complete"
    />
    <Stepper.Step
      value="configure"
      title="Configure"
      description="Name it and add the addresses."
    />
    <Stepper.Step
      value="review"
      title="Review"
      disabled
    />
  </Stepper>
</template>
```

## Sub-components

The root ships a **compound API**: an `index.ts` (beside `stepper.vue`) attaches the sub-component to the root so `<Stepper.Step>` resolves from one import; the standalone imports remain the tree-shaking path. The rail has no open/closed state, so there is no `Trigger` / `Content` — the anatomy name is `Step`, which is what the thing is. Numbering and the current step flow through `provide`/`inject` (`injection-key.ts`), so the consumer wires nothing: a step reads its own ordinal from its registration order and its `current` from the root's `v-model`.

- `stepper-step/stepper-step.vue` — One dot, its title and description, and the connector down to the step below it. Registers itself with the root on mount and reads back both its ordinal and whether it is the last step (the last renders no connector). Renders an `<li>` holding a `<button type="button">` that sets the root's `v-model` to its own `value`.
  - Props: `value?: string` (default `''` — identity of this step; matches the root's `v-model` when it is the current one), `title?: string` (default `''` — what this step asks, in the reader's words), `description?: string` (default `''` — one line under the title saying what the step decides), `state?: 'upcoming' | 'complete' | 'error' | 'loading'` (default `'upcoming'` — what the owner knows about this step; `current` is derived from the root and is never set here), `disabled?: boolean` (default `false` — the step cannot be reached yet; not focusable and not clickable).
  - Slot: `default` — optional body under the description, inside the rail.

Resulting layout (no per-component `package.json`; the root `packages/webkit/package.json#exports` resolves every path, and `.d.ts` is generated at publish time):

```
packages/webkit/src/components/navigation/stepper/
├── stepper.vue                   (root; owns the model, provides the registry)
├── stepper.test.ts
├── index.ts                      (compound: attaches Step to the root)
├── injection-key.ts              (shared StepperContext)
├── composables/
│   └── use-stepper-context.ts    (injects; throws outside a Stepper)
└── stepper-step/
    └── stepper-step.vue
```

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the folder only):

```jsonc
"./stepper": "./src/components/navigation/stepper/index.ts",
"./stepper-root": "./src/components/navigation/stepper/stepper.vue",
"./stepper-step": "./src/components/navigation/stepper/stepper-step/stepper-step.vue"
```

## Props

| Prop        | Type     | Default   | Required | JSDoc                              |
| ----------- | -------- | --------- | -------- | ---------------------------------- |
| `ariaLabel` | `string` | `'Steps'` | false    | Accessible name for the step rail. |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                            |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model` | `string` | `''`    | `update:modelValue` | The `value` of the step the reader is on, two-way through `defineModel`. A step whose `value` matches it derives `data-state="current"`; activating an enabled step writes its own `value` back. |

## Events

_No plain events — activation flows through `v-model`._

## Slots

| Slot      | Scope | Notes                                                        |
| --------- | ----- | ------------------------------------------------------------ |
| `default` | —     | The `Stepper.Step` children, in the order they are numbered. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values on `Stepper.Step`, in precedence order: `error` | `loading` | `current` | `complete` | `upcoming`
- `data-current` on the root mirrors `modelValue`
- `data-disabled` mirrors the `disabled` prop
- `data-orientation`: `vertical`

The five dot states, and what each one renders:

| `data-state` | When                                | Dot                                                         | Connector below      |
| ------------ | ----------------------------------- | ----------------------------------------------------------- | -------------------- |
| `upcoming`   | not reached, nothing known          | outlined, muted, shows its number                           | muted track          |
| `current`    | `value` equals the root's `v-model` | outlined in `--secondary` with a filled inner disc          | muted track          |
| `complete`   | the owner set `state="complete"`    | filled `--secondary`, `pi pi-check` glyph                   | filled `--secondary` |
| `error`      | the owner set `state="error"`       | filled `--danger`, `pi pi-exclamation-triangle` glyph       | muted track          |
| `loading`    | the owner set `state="loading"`     | outlined in `--secondary`, `Spinner` in place of the number | muted track          |

`error` and `loading` outrank `current`: a step that is both on screen and wrong must say it is wrong.
`current` outranks `complete`, so returning to an answered step shows where the reader is rather than
what they already did.

Two fixed measures hold the rail together. The title sits in a band the height of the dot, so a step
with no description reads as centred against its dot rather than hanging above it; and the connector
keeps a minimum segment the height of a dot, so the fill a completed step draws is always visible
even when the row carries nothing but its title.

## Motion & Animations

| Trigger                        | Animation / Transition                                                                                                                                | Token (see `.claude/docs/DESIGN.md` § Animations)                                                                      | Reduced-motion fallback                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| step becomes `complete`        | connector fill `scale-y` 0 → 1 from `origin-top`, `transition-[scale]`                                                                                | inline · `duration-moderate-02` · `ease-productive-entrance`                                                           | `motion-reduce:transition-none`        |
| step becomes `current`         | inner disc `scale` 0 → 1, `transition-[scale]`                                                                                                        | inline · `duration-fast-02` · `ease-productive-entrance`                                                               | `motion-reduce:transition-none`        |
| any dot state change           | `transition-colors` on the dot, the title and the connector track                                                                                     | inline · `duration-fast-02` · `ease-productive-entrance`                                                               | `motion-reduce:transition-none`        |
| step is `loading`              | `Spinner` component                                                                                                                                   | component                                                                                                              | `aria-hidden="true"` on the glyph slot |
| `description` appears / leaves | `<Transition>` on a single-row grid: `grid-template-rows` `0fr` → `1fr` with `opacity` `0` → `1`, the text clipped by the inner `overflow-hidden` row | inline · enter `duration-moderate-01` · `ease-productive-entrance` / leave `duration-fast-02` · `ease-productive-exit` | `motion-reduce:transition-none`        |

## Tokens

| Region                                  | Token (DESIGN.md)           |
| --------------------------------------- | --------------------------- |
| typography (step title)                 | `.text-label-md`            |
| typography (step description)           | `.text-body-sm`             |
| typography (dot number)                 | `.text-label-sm`            |
| dot surface (upcoming, current)         | `var(--bg-surface)`         |
| dot surface (complete)                  | `var(--secondary)`          |
| dot ink (complete)                      | `var(--secondary-contrast)` |
| dot surface (error)                     | `var(--danger)`             |
| dot ink (error)                         | `var(--danger-contrast)`    |
| dot border (error)                      | `var(--danger-border)`      |
| dot border (upcoming)                   | `var(--border-default)`     |
| dot border (current, complete, loading) | `var(--secondary)`          |
| connector track                         | `var(--border-default)`     |
| connector fill                          | `var(--secondary)`          |
| title ink (current, complete)           | `var(--text-default)`       |
| title ink (upcoming)                    | `var(--text-muted)`         |
| description ink                         | `var(--text-muted)`         |
| disabled ink                            | `var(--text-disabled)`      |
| hover surface                           | `var(--bg-hover)`           |
| shape (dot)                             | `var(--radius-full)`        |
| shape (row)                             | `var(--shape-elements)`     |
| spacing.x                               | `var(--spacing-sm)`         |
| spacing.y                               | `var(--spacing-xs)`         |
| ring                                    | `var(--ring-color)`         |
| ring offset                             | `var(--bg-canvas)`          |

## Theme gaps

| Figma variable                         | Temporary primitive                                                                                   | Follow-up                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| — (documentation gap, not a token gap) | `var(--radius-full)` — ships in the theme as `9999px` and is what `doc-step` already uses for its dot | `TODO: document --radius-full in DESIGN.md § Shape; there is no --shape-* alias for a full circle` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves to each enabled step in order; `Enter` / `Space` activates the focused step and updates `v-model`. A `disabled` step is skipped by `Tab`. No roving tabindex — the rail is a list of links to steps, not a tablist.
- ARIA: the root is a `<nav>` with `aria-label` over an `<ol>`; each step is an `<li>` holding a `<button type="button">`. The current step's button carries `aria-current="step"`; a `loading` step carries `aria-busy="true"`; a disabled step is natively `disabled`. The dot glyph and the connector are `aria-hidden="true"`, and each button carries an `sr-only` word naming its state so the rail reads as more than a list of titles.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state
- `motion-reduce:transition-none` on every animated state
- Touch target ≥40×40 px — the step button is a full-width row at least 40px tall

## Stories (Storybook)

- Default — a four-step rail with one complete step, one current, two upcoming.
- States — composite story rendering every `state` value plus `current` side-by-side in one frame. `state` is this component's multi-option axis, so it takes the composite slot that `Types` takes on a component with a `kind`.
- Disabled — the rail with the steps after the current one closed, which is how a wizard actually renders.

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
