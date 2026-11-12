# Stepper

> A vertical rail that names the steps of one task, says which step the reader is on, and carries the progress between them on the line that joins the dots. It is the left column of a multi-step surface — a create wizard, a guided setup — while the content of the current step fills the column beside it. It is **vertical only**, by design. The rail runs the full height of the surface so the connector between two dots is the thing that measures progress; a horizontal variant would be a different component with a different job (a compact progress ribbon), not a prop on this one.

- Import: `import StepperRoot from '@aziontech/webkit/stepper-root'`
- Compound import (dot notation, not tree-shakeable): `import Stepper from '@aziontech/webkit/stepper'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [stepper.json](https://github.com/aziontech/webkit/blob/main/.specs/stepper.json)

## When to use

- A task is split into ordered steps and only one is on screen at a time (a create wizard, a guided setup).
- The reader needs to see how many steps are left and go back to one they already answered.
- A step can fail validation, or sit in flight, and the rail has to say so without leaving the step.

## Do

- Give every step a title that names the decision (`Where it runs`), not the control (`Select`).
- Keep steps reachable backwards and closed forwards: mark a step `disabled` until the one before it is answered.
- Set `state="error"` only after the reader tried to advance — a step is not wrong while it is unanswered.
- One `Stepper` per surface. Two rails on one screen ask the reader which task they are in.
- The rail is navigation, not the form. Put the fields in the content column, never inside a step's slot.

## Don’t

- Numbered instructions inside a document, where every step is read at once → use `doc-steps` + `doc-step`.
- Progress with no discrete, nameable steps (a percentage, an upload) → use `progress`.
- Switching between peer views that are not ordered and have no completion → use `tabs`.
- A provisioning log that reports what a server is doing, rather than what the reader must answer → use `flow`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [doc-steps](doc-steps.md) — the same numbered-dot shape for prose; static, never current, never navigable.
- [tabs](tabs.md) — peer views with no order and no completion.
- [progress](progress.md) — continuous progress with no named steps.
- [flow](flow.md) — a machine's stages, reported rather than navigated.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the step rail. Empty uses the locale catalog (`Steps`). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `Stepper.Step` children, in the order they are numbered. |

## Sub-component imports

- `@aziontech/webkit/stepper-step`

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

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                            |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model` | `string` | `''`    | `update:modelValue` | The `value` of the step the reader is on, two-way through `defineModel`. A step whose `value` matches it derives `data-state="current"`; activating an enabled step writes its own `value` back. |

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

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves to each enabled step in order; `Enter` / `Space` activates the focused step and updates `v-model`. A `disabled` step is skipped by `Tab`. No roving tabindex — the rail is a list of links to steps, not a tablist.
- ARIA: the root is a `<nav>` with `aria-label` over an `<ol>`; each step is an `<li>` holding a `<button type="button">`. The current step's button carries `aria-current="step"`; a `loading` step carries `aria-busy="true"`; a disabled step is natively `disabled`. The dot glyph and the connector are `aria-hidden="true"`, and each button carries an `sr-only` word naming its state so the rail reads as more than a list of titles.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state
- `motion-reduce:transition-none` on every animated state
- Touch target ≥40×40 px — the step button is a full-width row at least 40px tall

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
