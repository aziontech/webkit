---
name: wizard
category: navigation
structure: composition
status: implemented
checksum: 2eabbad6ccebe14c3dd201c1a97a7fc5329ad000eee66d14331390482b61e050
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-11
---

# Wizard — Component Spec

## Purpose

A multi-step create flow in one surface. It puts the step rail on the start side, the current step's
header and fields in the content column, and a fixed footer with Cancel, Previous and Next. On the last
step, Next becomes the submit action. It owns the order, which steps can be reached and where focus
goes. The consumer owns the fields, the validation and the request.

It differs from its siblings by owning the **whole flow**. `stepper` is only the rail and leaves layout,
actions and gating to the caller. `tabs` switches between peer views that have no order and no
completion.

## When to use

- Creating a resource takes several ordered decisions, and showing them all at once would overwhelm the
  reader (a create page split into Configure → Settings → Review).
- The reader has to finish a step before moving on. Validation runs on Next and can stop the move.
- The flow needs a review step before the final submit, and earlier steps must stay reachable to fix
  an answer.

## When NOT to use

- A short form that fits one screen. A wizard adds clicks without adding clarity → use a plain form
  inside `drawer` or a create page.
- A confirmation or a single decision → use `dialog`.
- Peer views with no order and no completion → use `tabs`.
- A custom multi-step layout where the caller needs its own actions or a different arrangement → compose
  `stepper` + `stepper-step` directly.
- Numbered instructions inside documentation → use `doc-steps` + `doc-step`.

## Related

- `stepper` — the rail this component composes. Reach for it alone when the footer and gating must be
  your own.
- `tabs` — unordered peer views with no completion state.
- `dialog` — a single, short decision on an overlay.
- `drawer` — a single-step create or edit form beside the page.
- `message` — the inline error to show inside a step when Next is blocked.

## Best practices

- Keep step state in the consumer (refs or a form store). Only the active step renders its content, so a
  field that lives only in the DOM is lost when the reader leaves its step.
- Validate in the `next` handler and call `event.preventDefault()` synchronously to block the move. For
  async validation, prevent first, then set `activeStep` yourself once the check passes.
- Show why Next was blocked inside the step (an inline `message` or the field's `invalid` +
  `helperText`), never only by not moving.
- Give every step a title that names the decision (`Settings`, `Review`) and keep it short. The same
  title reads in the rail and in the step header.
- Make the last step a review of the answers when the resource is costly to change after creation, and
  set `submitLabel` to the verb the button does (`Create`, `Deploy`).
- Bind `loading` to the submit request. It disables Cancel, Previous and the rail, so the handler needs no
  guard of its own.
- Mark a step `optional` only when Next works with every field in it empty.
- Always pass `ariaLabel` naming the task (`Create edge application`). Without it, the root is an
  unnamed region.
- The wizard sets no page width. Place it inside the page's create container
  (`.layout-form-create`).

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Wizard from '@aziontech/webkit/wizard'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'

  const step = ref(0)
  const name = ref('')
  const saving = ref(false)

  const onNext = (event, current) => {
    if (current === 0 && !name.value) event.preventDefault()
  }

  const onCancel = () => {
    step.value = 0
  }
</script>

<template>
  <Wizard
    v-model:active-step="step"
    aria-label="Create resource"
    submit-label="Create"
    :loading="saving"
    @next="onNext"
    @submit="saving = true"
    @cancel="onCancel"
  >
    <Wizard.Step
      title="Configure"
      description="Name the resource and choose where it runs."
    >
      <Field required>
        <Field.Label>Name</Field.Label>
        <Input v-model="name" />
      </Field>
    </Wizard.Step>
    <Wizard.Step
      title="Settings"
      description="Fine-tune the defaults."
      optional
    >
      <p>Settings fields</p>
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      description="Check every answer before creating."
    >
      <p>Review summary</p>
    </Wizard.Step>
  </Wizard>
</template>
```

Tree-shaking alternative: import the standalone root and the sub-component from their own entries, so
the `Object.assign` compound is not pulled in:

```vue
<script setup>
  import Wizard from '@aziontech/webkit/wizard-root'
  import WizardStep from '@aziontech/webkit/wizard-step'
</script>
```

## Sub-components

The root ships a **compound API**. An `index.ts` beside `wizard.vue` attaches the sub-component to the
root, so `<Wizard.Step>` resolves from one import. The standalone imports remain the tree-shaking path.
The wizard has no open/closed state, so it has no `Trigger` / `Content`. The anatomy name is `Step`,
because that is what the part is.

Shared state flows through `provide`/`inject` (`injection-key.ts` +
`composables/use-wizard-context.ts`), so the consumer wires nothing. The root provides a context with
the ordered step registry, the active index, the total, `loading`, and the functions `register`,
`attach` and `unregister`. `useWizardContext()` throws a clear error when a `Wizard.Step` is rendered
outside a `<Wizard>`. Steps are ordered by document position (the same `compareDocumentPosition`
approach `stepper` uses), not by mount order, so a step inserted later still numbers correctly.

The root composes, and does not re-implement:

- `Stepper` + `Stepper.Step` (`@aziontech/webkit/stepper`) for the rail. The root renders one
  `Stepper.Step` per registered `Wizard.Step` and passes:
  - `value` = `String(index)`.
  - `title` = the step's `title`.
  - `state` = `'complete'` for every step before the active one, otherwise `'upcoming'`. The rail
    derives `current` itself.
  - `disabled` = `true` for every step after the active one, and for every step while `loading`.

  An `optional` step shows the word `Optional` in the `Stepper.Step` default slot. The rail's `v-model`
  is the active index as a string, and a rail activation writes `Number(value)` back to `activeStep`.

- `Button` (`@aziontech/webkit/button`) for the three footer actions, all at the house default size
  (`large`, 40px):
  - Cancel is `kind="transparent"`, at the start of the footer.
  - Previous is `kind="secondary"`, at the end. It is not rendered (`v-if`, not hidden) on step 1.
  - Next is `kind="primary"`, at the end. On the last step its label becomes `submitLabel`, it emits
    `submit` instead of `next`, and it carries `loading`.

- `wizard-step/wizard-step.vue` — one step: its header and its content. It registers itself with the
  root on mount and reads back its zero-based index, the total, and whether it is the active step. It
  always renders its own root (a `<div role="group">` labelled by its heading), so document-order
  registration works. When inactive, that root is `hidden` and its content is not mounted (`v-if`).
  When active, it renders:
  - The header: the counter `Step {n} of {N}` as an overline paragraph with an id from `useId()`.
  - The title as an `<h2 tabindex="-1">` with `aria-describedby` pointing at the counter, followed by
    `Optional` when `optional` is set.
  - The `description` paragraph, only when non-empty.
  - Below the header, the default slot inside a `<Transition>` that fades it in.
  - When it becomes active after the initial render, it moves focus to its heading.
  - Props: `title?: string` (default `''` — what this step decides, in the reader's words; shown in the
    rail and as the step heading), `description?: string` (default `''` — one line under the heading
    saying what the step is for; omitted when empty), `optional?: boolean` (default `false` — marks the
    step as skippable: shows `Optional` beside the title in the rail and in the header).
  - Slot: `default` — the step's content (fields, review summary).
  - `data-testid` fallback: `navigation-wizard-step` (consumer `data-testid` wins).

Resulting layout (no per-component `package.json`; the root `packages/webkit/package.json#exports`
resolves every path, and `.d.ts` is generated at publish time):

```
packages/webkit/src/components/navigation/wizard/
├── wizard.vue                   (root; owns the model, provides the registry, renders rail + footer)
├── wizard.test.ts
├── index.ts                     (compound: attaches Step to the root)
├── injection-key.ts             (shared WizardContext)
├── composables/
│   └── use-wizard-context.ts    (injects; throws outside a Wizard)
└── wizard-step/
    └── wizard-step.vue
```

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the
folder only):

```jsonc
"./wizard": "./src/components/navigation/wizard/index.ts",
"./wizard-root": "./src/components/navigation/wizard/wizard.vue",
"./wizard-step": "./src/components/navigation/wizard/wizard-step/wizard-step.vue"
```

## Props

| Prop          | Type      | Default | Required | JSDoc                                                                                                                         |
| ------------- | --------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `submitLabel` | `string`  | `''`    | false    | Label of the primary action on the last step, where Next becomes the submit action. Empty uses the locale catalog (`Create`). |
| `loading`     | `boolean` | `false` | false    | Submit in progress: the primary action shows its loading state, and Cancel, Previous and every rail step are disabled.        |
| `ariaLabel`   | `string`  | `''`    | false    | Accessible name for the wizard region. Name the task, for example Create edge application.                                    |

## v-model

| Model                | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                                       |
| -------------------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:activeStep` | `number` | `0`     | `update:activeStep` | Zero-based index of the step on screen, two-way through `defineModel('activeStep', { default: 0 })`. Written by Next (after an un-prevented `next`), by Previous (index − 1) and by a rail jump to an earlier step. Rendering clamps an out-of-range value to `0 … N − 1` without emitting. |

## Events

| Event    | Payload                             | Notes                                                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `next`   | `(event: MouseEvent, step: number)` | Fired when Next is activated on any step but the last, **before** the wizard advances. `step` is the zero-based index of the step being left, which is the one to validate. Cancelable: if a handler calls `event.preventDefault()` synchronously, the wizard stays on `step`. Otherwise it writes `step + 1` to `activeStep`. Not fired by Previous or by rail jumps, which only go back. |
| `submit` | `(event: MouseEvent)`               | Fired when the primary action is activated on the last step. The wizard changes no state. The consumer starts the request and binds `loading`. Not fired while `loading`.                                                                                                                                                                                                                  |
| `cancel` | `(event: MouseEvent)`               | Fired when Cancel is activated. The wizard changes no state, and the consumer decides where to go. Not fired while `loading`.                                                                                                                                                                                                                                                              |

## Slots

| Slot      | Scope | Notes                                                                     |
| --------- | ----- | ------------------------------------------------------------------------- |
| `default` | —     | The `Wizard.Step` children, in the order they are numbered and navigated. |

## States

- Visual states: `default`, `loading`. Interactive states (`hover`, `focus-visible`, `active`,
  `disabled`) belong to the composed `Button` and `Stepper.Step`, not to the wizard's own elements.
- `data-loading` on the root mirrors `loading`.
- `data-active-step` on the root mirrors the clamped `activeStep`.
- `data-active` on `Wizard.Step` is present only on the step on screen.
- `data-optional` on `Wizard.Step` mirrors `optional`.
- Rail step statuses come from `Stepper.Step`. Every step before the active one is `complete`, the
  active one is `current` (derived by the rail), and every step after it is `upcoming` + `disabled`.
- No `data-state`: the wizard has no open/closed state.

State matrix:

| State        | Trigger                               | Renders                                                                                                                                                                     |
| ------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| first step   | `activeStep === 0`                    | Previous is not rendered. The footer shows Cancel at the start and Next at the end.                                                                                         |
| middle step  | `0 < activeStep < N − 1`              | Cancel, Previous and Next.                                                                                                                                                  |
| last step    | `activeStep === N − 1`                | The primary action reads `submitLabel` and emits `submit`.                                                                                                                  |
| single step  | `N === 1`                             | Previous is not rendered, and the primary action is the submit action from the start.                                                                                       |
| loading      | `loading`                             | The primary `Button` gets `loading` (spinner + `aria-busy`, click suppressed). Cancel and Previous are `disabled`, and every `Stepper.Step` is `disabled`.                  |
| next blocked | `next` handler calls `preventDefault` | The wizard stays on the step. The consumer renders the reason inside the step's slot.                                                                                       |
| below `md`   | viewport under the `md` breakpoint    | The rail is not displayed (`max-md:hidden`). The step header's `Step n of N` overline and title act as the compact progress line above the content. The footer stays below. |

Layout at `md` and up: a row with the rail column (`md:w-(--container-3xs) md:shrink-0`) on the start
side and the content column (`min-w-0 flex-1`) beside it. The content column stacks the active step,
then the footer. The footer is a row with Cancel at the start and Previous + Next grouped at the end,
separated from the content by a top border.

## Motion & Animations

| Trigger                    | Animation / Transition                                                                                                                                                                                    | Token (see `.claude/docs/DESIGN.md` § Animations)                             | Reduced-motion fallback                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------- |
| active step content enters | Vue `<Transition>` in `wizard-step.vue`: enter-from `opacity-0`, enter-active `transition-opacity`. There is no leave transition: the outgoing step's content unmounts at once, so two steps never stack. | inline · `duration-moderate-01` · `ease-productive-entrance` (catalog tokens) | `motion-reduce:transition-none` (instant swap) |
| rail status change         | owned by the composed `Stepper` (connector fill, disc, colors). The wizard adds no classes.                                                                                                               | component                                                                     | handled inside `Stepper`                       |
| submit in progress         | owned by the composed `Button` (`loading` spinner)                                                                                                                                                        | component                                                                     | handled inside `Button` (`aria-hidden` glyph)  |

## Tokens

| Region                                    | Token (DESIGN.md)       |
| ----------------------------------------- | ----------------------- |
| typography (step counter)                 | `.text-overline-xs`     |
| typography (step heading)                 | `.text-heading-sm`      |
| typography (step description)             | `.text-body-sm`         |
| typography (Optional, header)             | `.text-body-sm`         |
| typography (Optional, rail)               | `.text-body-xs`         |
| counter ink                               | `var(--text-muted)`     |
| heading ink                               | `var(--text-default)`   |
| description ink                           | `var(--text-muted)`     |
| Optional ink                              | `var(--text-muted)`     |
| footer divider                            | `var(--border-default)` |
| rail column width (md+)                   | `var(--container-3xs)`  |
| spacing (rail ↔ content, md+)             | `var(--spacing-xxl)`    |
| spacing (counter ↔ heading ↔ description) | `var(--spacing-xxs)`    |
| spacing (header ↔ step content)           | `var(--spacing-lg)`     |
| spacing (step content ↔ footer)           | `var(--spacing-xl)`     |
| spacing (footer top padding)              | `var(--spacing-md)`     |
| spacing (between footer buttons)          | `var(--spacing-xs)`     |
| spacing (title ↔ Optional)                | `var(--spacing-xs)`     |
| ring (composed controls)                  | `var(--ring-color)`     |
| ring offset (composed controls)           | `var(--bg-canvas)`      |

## Theme gaps

| Figma variable                                      | Temporary primitive                                                                                                                                                                                                                   | Follow-up                                                                                                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| — (no Figma frame; authored from the brief, Mode B) | —                                                                                                                                                                                                                                     | `TODO: link a Figma frame and a .figma.ts Code Connect mapping once the design exists`                                                                                                         |
| — (copy gap, not a token gap)                       | Fixed English strings: `Cancel`, `Previous`, `Next`, `Step {n} of {N}`, `Optional`. Only the submit label is a prop (`submitLabel`).                                                                                                  | `TODO: open question — add label props (cancelLabel, previousLabel, nextLabel) or adopt a package i18n strategy before approval; not added here because the brief did not state them`          |
| — (behavior open question)                          | Rail jumps go **backward only**. Steps after the active one are disabled even when visited before, so every forward move passes through the cancelable `next` gate.                                                                   | `TODO: open question — Cloudscape allows forward jumps to visited steps; supporting that needs the rail to expose an activation event so the jump can fire next, which Stepper does not today` |
| — (behavior open question)                          | The step heading is a fixed `<h2>`.                                                                                                                                                                                                   | `TODO: open question — a heading-level prop if the wizard sits under a page h1 plus section h2`                                                                                                |
| — (behavior open question)                          | A blocked `next` does not set the rail step to `state="error"`. The error shows only inside the step.                                                                                                                                 | `TODO: open question — expose a per-step error flag (for example on Wizard.Step) so the rail can mirror it`                                                                                    |
| — (documentation gap)                               | The Constraints block cites `packages/theme/src/tokens/semantic/animations.js`, which does not exist in this tree. The catalog lives in `primitives/animations/animate.js`. The wizard uses no keyframe utility, so it is unaffected. | `TODO: align the template's Constraints path with the real catalog location (template-wide change, separate PR)`                                                                               |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every focusable control is a composed `Button` or `Stepper.Step` and carries their
  ring: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2
focus-visible:ring-offset-(--bg-canvas)`. The step heading is a programmatic focus target
  (`tabindex="-1"`), not a control, so it is out of the Tab order and draws no ring.
- Keyboard map:
  - `Tab` order: the enabled rail steps (those before the active one), then the step content, then the
    footer (Cancel, Previous, Next/submit).
  - `Enter` / `Space` on an earlier rail step jumps back to it.
  - `Enter` / `Space` on a footer button activates it.
  - Disabled rail steps and actions are skipped by `Tab`.
  - On every step change after the initial render, focus moves to the new step's heading, so the screen
    reader announces the title and the counter. The initial render does not steal focus.
  - No `Escape` binding: the wizard is not an overlay.
- ARIA:
  - The root is a `<section>` with `aria-label` from `ariaLabel` (omitted when empty).
  - The rail is the `Stepper` `<nav aria-label="Steps">`, with `aria-current="step"` on the active step.
  - Each `Wizard.Step` is a `role="group"` with `aria-labelledby` pointing at its heading. The heading
    has `aria-describedby` pointing at the `Step n of N` counter (ids from `useId()`).
  - Inactive steps are `hidden`, so they are out of the accessibility tree.
  - While `loading`, the primary `Button` sets `aria-busy`, and the other actions are natively
    `disabled`.
  - No extra `aria-live` region: the focus move announces the step, and a live region would read it
    twice.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled actions while `loading`
- `motion-reduce:transition-none` on the step-content transition; the composed parts carry their own
- Touch target ≥40×40 px: the footer buttons are `large` (40px), and the rail steps are full-width rows
  at least 40px tall (owned by `Stepper.Step`)

## Stories (Storybook)

- Default — a four-step flow creating a generic resource (Configure → Settings → Rules → Review), with
  the steps' content as plain fields. Controls drive `submitLabel`, `loading` and `ariaLabel`.
- Optional — a three-step flow whose middle step is `optional`. Justified beyond the canonical set
  because `optional` is a `Wizard.Step` prop, which the root's Controls cannot show, and it changes
  both the rail and the header.
- Loading — the flow parked on its last step with `loading` set: the submit action shows its spinner,
  and Cancel, Previous and the rail are disabled.
- Validation — a flow whose first step has a required name field. The `next` handler calls
  `event.preventDefault()` while the field is empty and shows an inline `Alert` (`severity="danger"`)
  inside the step. Justified beyond the canonical set because cancelable `next` is this component's
  documented gating contract, and it only shows through a handler.

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
