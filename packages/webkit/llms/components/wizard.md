# Wizard

> A multi-step create flow in one surface. It puts the step rail on the start side, the current step's header and fields in the content column, and a fixed footer with Cancel, Previous and Next. On the last step, Next becomes the submit action. It owns the order, which steps can be reached and where focus goes. The consumer owns the fields, the validation and the request. It differs from its siblings by owning the **whole flow**. `stepper` is only the rail and leaves layout, actions and gating to the caller. `tabs` switches between peer views that have no order and no completion.

- Import: `import WizardRoot from '@aziontech/webkit/wizard-root'`
- Compound import (dot notation, not tree-shakeable): `import Wizard from '@aziontech/webkit/wizard'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [wizard.json](https://github.com/aziontech/webkit/blob/main/.specs/wizard.json)

## When to use

- Creating a resource takes several ordered decisions, and showing them all at once would overwhelm the
- The reader has to finish a step before moving on. Validation runs on Next and can stop the move.
- The flow needs a review step before the final submit, and earlier steps must stay reachable to fix

## Do

- Keep step state in the consumer (refs or a form store). Only the active step renders its content, so a
- Validate in the `next` handler and call `event.preventDefault()` synchronously to block the move. For
- Show why Next was blocked inside the step (an inline `message` or the field's `invalid` +
- Give every step a title that names the decision (`Settings`, `Review`) and keep it short. The same
- Make the last step a review of the answers when the resource is costly to change after creation, and
- Bind `loading` to the submit request. It disables Cancel, Previous and the rail, so the handler needs no
- Mark a step `optional` only when Next works with every field in it empty.
- Always pass `ariaLabel` naming the task (`Create edge application`). Without it, the root is an
- The wizard sets no page width. Place it inside the page's create container

## Don’t

- A short form that fits one screen. A wizard adds clicks without adding clarity → use a plain form
- A confirmation or a single decision → use `dialog`.
- Peer views with no order and no completion → use `tabs`.
- A custom multi-step layout where the caller needs its own actions or a different arrangement → compose
- Numbered instructions inside documentation → use `doc-steps` + `doc-step`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [stepper](stepper.md) — the rail this component composes. Reach for it alone when the footer and gating must be
- [tabs](tabs.md) — unordered peer views with no completion state.
- [dialog](dialog.md) — a single, short decision on an overlay.
- [drawer](drawer.md) — a single-step create or edit form beside the page.
- message` — the inline error to show inside a step when Next is blocked.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `submitLabel` | `string` | `''` | false | Label of the primary action on the last step, where Next becomes the submit action. Empty uses the locale catalog (`Create`). |
| `loading` | `boolean` | `false` | false | Submit in progress: the primary action shows its loading state, and Cancel, Previous and every rail step are disabled. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the wizard region. Name the task, for example Create edge application. |
| `activeStep` | `number` | `0` | false | Two-way value (`v-model:activeStep`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `next` | `(event: MouseEvent, step: number)` | Fired when Next is activated on any step but the last, **before** the wizard advances. `step` is the zero-based index of the step being left, which is the one to validate. Cancelable: if a handler calls `event.preventDefault()` synchronously, the wizard stays on `step`. Otherwise it writes `step + 1` to `activeStep`. Not fired by Previous or by rail jumps, which only go back. |
| `submit` | `(event: MouseEvent)` | Fired when the primary action is activated on the last step. The wizard changes no state. The consumer starts the request and binds `loading`. Not fired while `loading`. |
| `cancel` | `(event: MouseEvent)` | Fired when Cancel is activated. The wizard changes no state, and the consumer decides where to go. Not fired while `loading`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `Wizard.Step` children, in the order they are numbered and navigated. |

## Sub-component imports

- `@aziontech/webkit/wizard-step`

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

## v-model

| Model                | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                                       |
| -------------------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:activeStep` | `number` | `0`     | `update:activeStep` | Zero-based index of the step on screen, two-way through `defineModel('activeStep', { default: 0 })`. Written by Next (after an un-prevented `next`), by Previous (index − 1) and by a rail jump to an earlier step. Rendering clamps an out-of-range value to `0 … N − 1` without emitting. |

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

| State        | Trigger                               | Renders                                                                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| first step   | `activeStep === 0`                    | Previous is not rendered. The footer shows Cancel at the start and Next at the end.                                                                                                                                                                                                                                                            |
| middle step  | `0 < activeStep < N − 1`              | Cancel, Previous and Next.                                                                                                                                                                                                                                                                                                                     |
| last step    | `activeStep === N − 1`                | The primary action reads `submitLabel` and emits `submit`.                                                                                                                                                                                                                                                                                     |
| single step  | `N === 1`                             | Previous is not rendered, and the primary action is the submit action from the start.                                                                                                                                                                                                                                                          |
| loading      | `loading`                             | The primary `Button` gets `loading` (spinner + `aria-busy`, click suppressed). Cancel and Previous are `disabled`, and every `Stepper.Step` is `disabled`.                                                                                                                                                                                     |
| next blocked | `next` handler calls `preventDefault` | The wizard stays on the step. The consumer renders the reason inside the step's slot.                                                                                                                                                                                                                                                          |
| narrow box   | wizard box under `@2xl`               | The rail is not displayed (`@max-2xl/wizard:hidden`). The root shows its own `Step n of N` progress line (`wizard.stepOf`, `aria-live="polite"`, `data-testid="<testid>__progress"`) at the top of the content column in place of the step header's overline, which hides at that width; the step title follows it and the footer stays below. |

Layout from `@2xl` of the wizard's own box (`@container/wizard`, so a wizard in a drawer or split view follows that box): a row with the rail column (`@2xl/wizard:w-(--container-3xs) @2xl/wizard:shrink-0`) on the start
side and the content column (`min-w-0 flex-1`) beside it. The content column stacks the active step,
then the footer. The footer is a row with Cancel at the start and Previous + Next grouped at the end,
separated from the content by a top border.

- Server render and hydration: steps register from their own setup, after the root has rendered, so until mount the root does not use the step count. The step shown, `data-active-step` and Previous follow the requested `activeStep` (clamped at 0), and the primary action reads Next; on mount the index is clamped to the registered steps and the last step reads the submit label. The server HTML and the first client render therefore match.

## Accessibility

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
  - The narrow-box progress line is a polite live region (`aria-live="polite"`, `aria-atomic="true"`):
    when the rail is hidden, a step change is also announced as `Step n of N` after the heading. At
    `@2xl` and wider the line is `display: none`, so the live region is silent and the rail carries
    the progress. The initial render announces nothing (the region only reads changes).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled actions while `loading`
- `motion-reduce:transition-none` on the step-content transition; the composed parts carry their own
- Touch target ≥40×40 px: the footer buttons are `large` (40px), and the rail steps are full-width rows
  at least 40px tall (owned by `Stepper.Step`)

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: no horizontal arrow-key logic.
- User data: step titles are the consumer's text; the "Step n of N" line comes from the locale catalog.

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Wizard from '@aziontech/webkit/wizard'
  import { ref } from 'vue'

  const step = ref(0)
  const name = ref('storefront-api')
  const region = ref('south-america')
  const environment = ref('production')
  const logging = ref(true)
  const path = ref('/api/*')
  const behavior = ref('deliver')

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' }
  ]
  const environments = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' }
  ]
  const behaviors = [
    { value: 'deliver', label: 'Deliver' },
    { value: 'redirect', label: 'Redirect' },
    { value: 'deny', label: 'Deny' }
  ]
  const labelOf = (options, value) =>
    options.find((option) => option.value === value)?.label ?? 'Not set'
</script>

<template>
  <Wizard
    v-model:active-step="step"
    aria-label="Create resource"
    submit-label="Create"
  >
    <Wizard.Step
      title="Configure"
      description="Name the resource and choose where it runs."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field required>
          <Field.Label> Name </Field.Label>
          <Input v-model="name" />
        </Field>
        <Field>
          <Field.Label> Region </Field.Label>
          <Select v-model="region">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in regions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Settings"
      description="Fine-tune the defaults."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field>
          <Field.Label> Environment </Field.Label>
          <Select v-model="environment">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in environments"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <Switch v-model="logging" />
          <Field.Content>
            <Field.Label> Enable logging </Field.Label>
            <Field.Description>
              Keep a record of every request this resource handles.
            </Field.Description>
          </Field.Content>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Rules"
      description="Decide what happens to matching requests."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field>
          <Field.Label> Path pattern </Field.Label>
          <Input v-model="path" />
          <Field.Description>
            Requests whose path matches this pattern follow the behavior below.
          </Field.Description>
        </Field>
        <Field>
          <Field.Label> Behavior </Field.Label>
          <Select v-model="behavior">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in behaviors"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      description="Check every answer before creating."
    >
      <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
        <dt class="text-(--text-muted)">Name</dt>
        <dd class="text-(--text-default)">{{ name }}</dd>
        <dt class="text-(--text-muted)">Region</dt>
        <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
        <dt class="text-(--text-muted)">Environment</dt>
        <dd class="text-(--text-default)">{{ labelOf(environments, environment) }}</dd>
        <dt class="text-(--text-muted)">Logging</dt>
        <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
        <dt class="text-(--text-muted)">Path pattern</dt>
        <dd class="text-(--text-default)">{{ path }}</dd>
        <dt class="text-(--text-muted)">Behavior</dt>
        <dd class="text-(--text-default)">{{ labelOf(behaviors, behavior) }}</dd>
      </dl>
    </Wizard.Step>
  </Wizard>
</template>
```

### Optional

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Wizard from '@aziontech/webkit/wizard'
  import { ref } from 'vue'

  const step = ref(0)
  const name = ref('storefront-api')
  const region = ref('south-america')
  const logging = ref(true)

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' }
  ]
  const labelOf = (options, value) =>
    options.find((option) => option.value === value)?.label ?? 'Not set'
</script>

<template>
  <Wizard
    v-model:active-step="step"
    aria-label="Create resource"
    submit-label="Create"
  >
    <Wizard.Step
      title="Configure"
      description="Name the resource and choose where it runs."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field required>
          <Field.Label> Name </Field.Label>
          <Input v-model="name" />
        </Field>
        <Field>
          <Field.Label> Region </Field.Label>
          <Select v-model="region">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in regions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Settings"
      description="Fine-tune the defaults, or skip to keep them."
      optional
    >
      <Field orientation="horizontal">
        <Switch v-model="logging" />
        <Field.Content>
          <Field.Label> Enable logging </Field.Label>
          <Field.Description>
            Keep a record of every request this resource handles.
          </Field.Description>
        </Field.Content>
      </Field>
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      description="Check every answer before creating."
    >
      <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
        <dt class="text-(--text-muted)">Name</dt>
        <dd class="text-(--text-default)">{{ name }}</dd>
        <dt class="text-(--text-muted)">Region</dt>
        <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
        <dt class="text-(--text-muted)">Logging</dt>
        <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
      </dl>
    </Wizard.Step>
  </Wizard>
</template>
```

### Loading

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Wizard from '@aziontech/webkit/wizard'
  import { ref } from 'vue'

  const step = ref(3)
  const name = ref('storefront-api')
  const region = ref('south-america')
  const environment = ref('production')
  const logging = ref(true)
  const path = ref('/api/*')
  const behavior = ref('deliver')

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' }
  ]
  const environments = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' }
  ]
  const behaviors = [
    { value: 'deliver', label: 'Deliver' },
    { value: 'redirect', label: 'Redirect' },
    { value: 'deny', label: 'Deny' }
  ]
  const labelOf = (options, value) =>
    options.find((option) => option.value === value)?.label ?? 'Not set'
</script>

<template>
  <Wizard
    v-model:active-step="step"
    aria-label="Create resource"
    submit-label="Create"
    loading
  >
    <Wizard.Step
      title="Configure"
      description="Name the resource and choose where it runs."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field required>
          <Field.Label> Name </Field.Label>
          <Input v-model="name" />
        </Field>
        <Field>
          <Field.Label> Region </Field.Label>
          <Select v-model="region">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in regions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Settings"
      description="Fine-tune the defaults."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field>
          <Field.Label> Environment </Field.Label>
          <Select v-model="environment">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in environments"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <Switch v-model="logging" />
          <Field.Content>
            <Field.Label> Enable logging </Field.Label>
            <Field.Description>
              Keep a record of every request this resource handles.
            </Field.Description>
          </Field.Content>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Rules"
      description="Decide what happens to matching requests."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field>
          <Field.Label> Path pattern </Field.Label>
          <Input v-model="path" />
          <Field.Description>
            Requests whose path matches this pattern follow the behavior below.
          </Field.Description>
        </Field>
        <Field>
          <Field.Label> Behavior </Field.Label>
          <Select v-model="behavior">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in behaviors"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      description="Check every answer before creating."
    >
      <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
        <dt class="text-(--text-muted)">Name</dt>
        <dd class="text-(--text-default)">{{ name }}</dd>
        <dt class="text-(--text-muted)">Region</dt>
        <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
        <dt class="text-(--text-muted)">Environment</dt>
        <dd class="text-(--text-default)">{{ labelOf(environments, environment) }}</dd>
        <dt class="text-(--text-muted)">Logging</dt>
        <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
        <dt class="text-(--text-muted)">Path pattern</dt>
        <dd class="text-(--text-default)">{{ path }}</dd>
        <dt class="text-(--text-muted)">Behavior</dt>
        <dd class="text-(--text-default)">{{ labelOf(behaviors, behavior) }}</dd>
      </dl>
    </Wizard.Step>
  </Wizard>
</template>
```
