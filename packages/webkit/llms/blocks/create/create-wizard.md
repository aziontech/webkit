# CreateWizard (`create/create-wizard`)

> The page a first-level resource is created on one step at a time, built on the `Wizard` component: the creation header, a page heading, then the Wizard with its step rail on the start side (completed steps reachable, later ones locked), the current step's heading and fields, and its footer with Cancel, Previous and Next, Next turning into the create action on the last step. Next validates the step it leaves and stays put with the message under the field when it fails; a Review step shows the create's loading state and confirms it in a toast. Every create asks first where the resource runs: a chooser lists the hosts it can bind to, six at a time with a search, and tags the ones missing a module the resource needs; choosing one with that module off inserts a step that offers to turn it on. Each resource brings its own field steps, plus an Advanced step when the endpoint has optional settings. CreateAndDeploy is the same frame for a resource that is bound to another and deployed in one act (a service that serves a project on a domain): Project, then Domain and deployment, ending on Create and deploy. Built from `Wizard`, `PageHeader`, `SettingsRow`, `AppHeader`, `Input`, `Tag`, `Card`, `Alert`, `Field` with `Switch`, `RadioGroup` (`variant="card"`), `Item`, `Textarea`, `FieldError` and `Button`.

- Surface: app
- Source: `blocks/create/create-wizard/create-wizard.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-wizard")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), `AppHeaderAccount`, [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfirmDialog](../../components/confirm-dialog.md), [Field](../../components/field.md), `FieldDescription`, `FieldError`, [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [PageHeader](../../components/page-header.md), [RadioGroup](../../components/radio-group.md), [RadioGroup](../../components/radio-group.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Skeleton](../../components/skeleton.md), [Subheader](../../components/subheader.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), `use-escape-to-cancel`, `use-shortcuts`, `use-unsaved-changes`, [Wizard](../../components/wizard.md), [Wizard](../../components/wizard.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`

## Asked as

multipage create; multi-step create page; stepper create; create wizard; step by step form; criação em etapas; formulário em etapas; review step; review and create; confirm before create; wizard review; summary before submit; revisar; etapa de revisão; revisão antes de criar; review before create; summary step; revisar antes de criar; provision wizard; create service wizard; two-step wizard; create and deploy; bind domain and deployment; create resource in steps; assistente de criação; criar serviço; asistente de creación; crear en pasos

The page a first-level resource is created on one step at a time. It is the `Wizard` component in a creation page: the user first says where the resource runs, then answers each step's fields in order, and only reaches the create action on the last step. The Wizard's rail shows how far they are and lets them return to any step already passed; if the host they chose lacks a module the resource needs, a step is inserted that offers to turn it on, so nothing is created that would silently never be read. The same frame creates a resource that must be bound and deployed in one act (CreateAndDeploy).

## When to use

- Use create-wizard when a first-level resource is created in ordered steps (a later answer changes what is asked); it is the Wizard component in a creation page.
- A first-level resource whose fields fall into groups that make sense one at a time (general, then type, then entries) and where a later group depends on an earlier answer.
- The resource must first bind to a host (a policy, an application) and that choice can change what is asked next.
- A resource that is useless until it is bound to another and deployed, such as a service that serves a project on a domain: use the CreateAndDeploy variant, whose last action creates and deploys.
- A code resource whose editor needs a whole step to itself.

## When not to use

- Everything fits on one screen without order: use `create/create-page`.
- The resource is created inside another one: use `create/create-drawer`.
- A new project from a code source (Git, a template, an upload): start at `create/create-hub` and deploy with `create/create-deploy-template`.
- Binding an existing or new resource inside a form step: use `create/create-resource-picker`.
- Deploying an existing package from inside a resource: use `create/create-deploy-drawer`.

## Building blocks

### A. Creation header — `AppHeader`, `IconButton`, `Brand`, `Breadcrumb`, `AppHeaderAccount` (required)

The `top-bar/top-bar-creation` header, with no sidebar: a back `IconButton` to the module, the `Brand` linking home, a `Breadcrumb` of the module and the create label, and the account `AppHeaderAccount`. The breadcrumb's last item repeats the create button's label exactly.

### B. Page heading — `PageHeader` (required)

`PageHeader size="small"` over the wizard, on the create measure (`layout-form-create`): the create label as the page's `h1` and one or two sentences on what the resource is and what the last step does. It stays the same on every step.

### C. Wizard — `Wizard`, `Wizard.Step` (required)

One `Wizard` labelled with the create label, `v-model` bound to the step index, `submit-label` set to the create label and `loading` bound to the create request. Each step is a `Wizard.Step` with a short noun title and a one-sentence description; the Wizard draws the rail (completed steps reachable, later ones locked), the step heading (`h2`), the "Step 2 of 4" line on a narrow box, and the footer: Cancel on the start side, Previous and Next on the end side, Next becoming the create action on the last step. A conditional step is a `Wizard.Step` with `v-if`; the Wizard numbers steps in the order they render. Validation runs in the `next` handler, which calls `preventDefault()` to keep the user on a failed step.

### D. Where it runs — `Input`, `Item`, `Tag`, `FieldError`, `Button` (required)

The first step: a large search `Input` and up to six host rows. Each row is a small `clickable` `Item` (a native `button`) with `aria-pressed`, which fills the chosen row; a host missing the module the resource needs carries a small warning `Tag`. Picking a row answers the step and moves on. A chosen host past the first six is kept visible. A count line tells how many more match, a no-match line replaces the rows, and two transparent small `Button`s offer to create a host or continue without one. Next with no answer stays and shows a `FieldDescription` asking for one.

### E. Module step — `Card`, `Alert`, `Field`, `Switch` (conditional)

Inserted only when the chosen host has the needed module off. A flush `Card` holds a small warning `Alert` that states the consequence, a horizontal `Field` choice card whose `Switch` turns the module on when the resource is created, and one muted line on what leaving it off means. Leaving it off is allowed.

### F. Field steps — `Card`, `Item`, `SettingsRow`, `Input`, `FieldError` (required)

Each step's fields are `SettingsRow`s in an `Item.List` inside a flush `Card`, the same anatomy as a single page create. A large `Input` takes an `aria-label` matching the row title. Next validates only the current step: an empty required field gets `:required` and a `FieldError` with the message, cleared as soon as the field is edited.

### G. Choice cards — `RadioGroup` (optional)

A choice that changes what follows, such as the list type, is a `SettingsRow variant="stacked"` holding a `RadioGroup` with `variant="card"`, each option a `RadioGroup.Item` with its label and `description`. Use it for three to five options that need a sentence each.

### H. Long entry — `Textarea`, `FieldError` (optional)

A stacked row with a five-row `Textarea` whose label, placeholder and guidance follow the choice above it. Its required message is a `FieldError` tied by `aria-describedby`.

### I. Review — `Subheader`, `Alert`, `Card`, `Item`, `Tag`, `Button` (required)

The last step, read-only: three bands under small `Subheader`s (Where it runs, What gets created, What can reference it), each with Edit back to its step; see Review step below.

### J. Create and deploy — `Card`, `Field`, `Input`, `Item`, `RadioGroup` (CreateAndDeploy)

Two steps, Project then Domain and deployment, with the last action reading "Create and deploy".

- **Project.** The `create/create-resource-picker` band, copied from that block (the source of truth for the paged picker; change it there first): a flush `Card` titled Project, a lead sentence, a large fluid `ToggleGroup` of Existing project and New project, then either a searchable `Item` list paged five at a time with `Skeleton` rows and a Load more `Button`, or a Name `Field`. In New mode the project is configured in place: a Cache Settings `Card` whose policy `Switch`es open their fields, and an Add an origin `SettingsRow` whose `Switch` opens a `RadioGroup variant="card"` of origin types and the type's fields. Each opened field is required only while its switch is on.
- **Domain and deployment.** A read-back `Item` of the bound project with a transparent Change `Button` back to step one (the answer is kept); a Domain `Card` with a `ToggleGroup` of Free platform domain and Your own domain and a preview line of the address traffic arrives on; Environment as a `RadioGroup variant="card"` and Certificate as a `Select`; a Deployment `Card` with Create one or Use existing (the paged picker again); and a collapsed `SettingsGroup` titled Advanced holding only fields that have defaults.
- **After submit.** Create and deploy shows its loading state; the consumer then hands the column to `detail/detail-deployment-logs` (InCreateFlow) and ends on `create/create-deploy-success`.

### K. Leaving with typed work — `useUnsavedChanges`, `ConfirmDialog` (required)

The Wizard's Cancel and the header Back both leave the flow, so both ask first once the form or the chosen policy differs from what the flow opened with: `useUnsavedChanges(() => form)` tracks it, Cancel and Back `await guard.confirmLeave()` before the page emits `cancel`, and one `ConfirmDialog v-bind="guard.dialogProps"` asks "Unsaved changes" with Keep editing and Discard changes. A clean form leaves at once, with no dialog, and the browser's own prompt covers a reload or a tab close while dirty. In a router app pair it with `onBeforeRouteLeave(() => guard.confirmLeave())` so a link or the browser Back asks too. Escape runs the same Cancel path through `useEscapeToCancel(onCancel)`.

CreateAndDeploy does the same: Cancel and Back to Services ask once the project choice, the project's cache and origin settings or the domain and deployment fields differ from the opened page, and the page emits `cancel` only after a clean leave or Discard changes.

## Data

The block keeps the form as a local draft, validates each step and emits `submit` with the values; it sends no request. `CreateWizardPolicy`, `CreateWizardValues`, `CreateWizardSubmission` and `CreateWizardProps` are exported from `create-wizard.vue`, and `sample.ts` holds the sample policies the chooser lists when `policies` is left out. The page owns the request: it sets `loading` while it runs, and on failure sets `error`, which the block shows in an error toast with Retry; on success the page shows the toast and opens the list.

| Prop            | Type                          | What it does                                                                        |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| `policies`      | `CreateWizardPolicy[]`        | The policies Where it runs offers; `ready` says whether IP filtering is on in each. |
| `defaultStep`   | `CreateWizardStep`            | The step the wizard opens on; `where-it-runs` by default.                           |
| `defaultPolicy` | `string`                      | The policy already picked; empty, Where it runs waits for an answer.                |
| `defaultValues` | `Partial<CreateWizardValues>` | The Name, Type and List the form starts from.                                       |
| `loading`       | `boolean`                     | The create request is in flight; Create Access List spins and the wizard locks.     |
| `error`         | `string`                      | Why the request failed, the description of the error toast with Retry.              |

| Event    | Payload           | When                                                                                                             |
| -------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `submit` | `(event, values)` | Create Access List on a valid form, and Retry in the error toast; `values` adds the `policy` and `enableModule`. |
| `cancel` | `(event)`         | Cancel in the footer or the header Back, once the user confirms leaving a dirty form.                            |

To go live, render the block from a page that owns the policies and the request:

```vue
<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import CreateWizard, { type CreateWizardSubmission } from './create-wizard.vue'

  const { data: policies } = usePolicies()
  const { mutate, pending, error } = useCreateAccessList()
  const create = async (_event: MouseEvent, values: CreateWizardSubmission) => {
    await mutate(values)
    toast.success(`${values.name} created.`)
  }
</script>

<template>
  <CreateWizard
    :policies="policies ?? []"
    :loading="pending"
    :error="error ? 'The service did not answer. Check your connection and try again.' : ''"
    @submit="create"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Ask where the resource runs first, and insert the module step only when the chosen host needs it.
- Validate one step at a time in the `next` handler, and show the message under the field that failed.
- Keep Cancel apart from Previous and Next, on the opposite side; the Wizard footer does this.
- Keep the create action on the last step only; every step before it says Next.
- Keep the chosen host visible in the chooser even when it falls outside the first six.
- Label the final action with every act it performs: "Create and deploy" when it also deploys.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't build the rail, the step heading or the footer by hand; the `Wizard` owns them.
- Don't let the user skip ahead to steps not reached yet.
- Don't block the create when a module is off; warn, offer the switch and let the user go on.
- Don't repeat the step title as a second heading inside the card.
- Don't validate fields of later steps, or judge a field while it is being typed.
- Don't put a required field inside Advanced, or show both the existing list and the new fields at once.

## Copy

- **Title, breadcrumb and last submit:** the create label with the entity's capitalization, e.g. "Create Access List"; "Create and deploy" when the last step also deploys.
- **Step titles:** short nouns, e.g. "Where it runs", "General", "List settings", "Project", "Domain and deployment".
- **Step descriptions:** one sentence with a period, e.g. "Select the policy whose rules match it. It needs IP filtering on."
- **Chooser:** the search placeholder and `aria-label` name what is searched, e.g. "Search policies"; Next with no answer says "Select a policy, or continue without one."
- **Module tag:** the missing module and its state, e.g. "IP filtering off".
- **Module alert:** the consequence in one sentence, e.g. "acme-staging has IP filtering off, so no rule reads this list until the module is on."
- **Escape routes:** verb first, e.g. "Create a policy", "Continue without a policy".
- **Required message:** "This field is required.", or what to do, e.g. "Select the project this service serves, or create a new one."
- Follow `skills/webkit-microcopy`: "Select", never "Choose"; no em dash; no "simply".

## Accessibility

- **Escape on the page = Cancel.** `useEscapeToCancel(onCancel)` runs the same path as the Wizard's Cancel, in every step and in CreateAndDeploy: a clean form leaves at once, an edited one opens the Unsaved changes dialog. It stays inert while the create request is in flight, while an IME is composing, when another handler already used the key, while a menu, listbox, popover, tooltip or dialog is open (the open Select or DatePicker closes first, and Escape on the Unsaved changes dialog only keeps editing) and when focus is in a control that uses Escape itself (an open combobox, a search field). Edit and settings pages are places, not tasks: Escape stays inert there.
- **The page opens with the cursor in the first field of its step** (Search policies, the checked choice, or the Project choice in CreateAndDeploy).
- **⌘ Enter runs the Wizard's primary button (`Ctrl Enter` off Apple):** Next with the same step check, Create Access List or Create and deploy on the last step. It fires from any field, a textarea included, stays inert while the create request is in flight and is listed in the `?` dialog as Next step or the create action.
- The `Wizard` takes an `aria-label` naming the flow; locked rail steps cannot be focused or activated, and focus moves to the new step's heading on every step change.
- The page has one `h1` (the `PageHeader`); each step heading is an `h2` drawn by the Wizard.
- Host rows are native `button`s with `aria-pressed`; the chooser's search has an `aria-label` and Enter selects the first match.
- Choice cards are a `RadioGroup` named with `aria-label`; each `RadioGroup.Item` is labelled by its card.
- Required messages are tied to their control with `aria-describedby`; focus stays on the step after a failed Next.
- Step transitions honour reduced motion.

## States

- WhereItRuns: the first step (the default `defaultStep`); the chooser of policies with search, module tags and the two escape routes.
- ModuleOff: acme-staging was chosen with IP filtering off (`defaultStep="module"`, `defaultPolicy="acme-staging"`), so the IP filtering step shows the warning, the switch card and the note.
- ListSettings: the settings step (`defaultStep="settings"`, a `defaultPolicy` and a Name in `defaultValues`); Type as radio choice cards and the List textarea, with Previous and Next (Review follows). Next with an empty list stays and shows the message.
- Review: the last step (`defaultStep="review"` with a `defaultPolicy` and `defaultValues`), read-only, with the create action in the footer. Where it runs is one `Alert` whose severity says whether anything will read the resource; What gets created pairs each value with the property it is sent as and shows long lists as their first five `Tag`s and a count; What can reference it names the consumers. Each band that maps to a step has an outlined Edit (`aria-label` names the band) that jumps back to that step. Create re-validates every step and, on a failure, opens the first step with an error; on success it emits `submit`, `loading` spins it and `error` raises the error toast with Retry.
- CreateAndDeploy: Create Service on its Project step with the paged project list; Next is gated on the project, and step two ends on Create and deploy with its loading state. Cancel and Back to Services emit `cancel`, asking first once anything is answered.

## Review step

- Add a Review step when the create has three or more steps or binds the resource to something; skip it for a one-step create.
- Show values as they will be sent, with the property name under each, and never show secrets in clear.
- Put Edit on each band, and on a value whose step differs from its band's (Name, on General); after the edit, Next walks forward through the later steps, already filled, back to Review.
- Say plainly when nothing will read the resource yet (unbound, or a module off) with a warning `Alert`, not a disabled create.

## Related

- `Wizard` — the component this block is built on; see `skills/webkit-form`.
- `create/create-page` — the same job when the fields fit one screen.
- `create/create-hub` and `create/create-deploy-template` — a new project from Git, a template or an upload.
- `create/create-resource-picker` — the Existing or New band CreateAndDeploy binds its project with.
- `detail/detail-deployment-logs` — the build log Create and deploy hands the column to (InCreateFlow).
- `create/create-deploy-success` — the screen a create-and-deploy ends on.
- `edit/edit-function` — the editor a code resource can use as one step.
- `state/state-form-validation` — required and invalid states on Next.

## Steps

- where-it-runs
- module
- general
- settings
- review

## Variants

- `WhereItRuns` — primary (the code below)
- `ModuleOff` — acme-staging was chosen with IP filtering off, so an IP filtering step follows Where it runs: a warning Alert, the Switch choice card that turns the module on with the list, and a note on what leaving it off means.
- `ListSettings` — The settings step of a list bound to acme-production, before Review: the Type as wide RadioGroup choice cards and the List Textarea whose label, placeholder and guidance follow the type, with Previous and Next in the Wizard footer. Next with the list empty stays on the step and shows the required message under it.
- `Review` — The Review step that closes the create, after List settings: three bands under small `Subheader`s. Where it runs is one `Alert` (success when the policy is ready, warning when it is unbound or its module stays off) with Edit back to the chooser; What gets created lists each value beside the property it is sent as (Name with its own Edit back to General), the entries as `Tag`s with a count and and N more, with Edit back to List settings; What can reference it lists the consumers and the field that carries the reference. Create Access List shows its loading state and the result arrives as a toast; a value that fails on create sends the user back to its step with the message under the field.
- `CreateAndDeploy` — A resource that is useless until it is bound and deployed (Create Service): step one binds the project it serves, an existing one from the paged list or a new one configured in place (cache settings, origin); step two reads the project back with Change, then asks for the domain (a free platform-domain prefix or your own hostname, previewed as the address traffic arrives on), environment and certificate, the deployment the first release is cut against and a collapsed Advanced section. Next is gated on the project; the last action reads Create and deploy and shows its loading state, then the build logs (`detail/detail-deployment-logs#InCreateFlow`) and `create/create-deploy-success` follow.

Each variant is the same screen in another state: `get_block("create/create-wizard", { variant })`, or the file under `blocks/create/create-wizard/variants/`.

## Code (`WhereItRuns`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import Wizard from '@aziontech/webkit/wizard'
  import { computed, reactive, ref, watch } from 'vue'

  import { listFields, types } from './lib/access-list'
  import PolicyPickerStep from './parts/policy-picker-step.vue'
  import ReviewStep from './parts/review-step.vue'
  import WizardFrame from './parts/wizard-frame.vue'
  import { samplePolicies } from './sample'
  import type {
    CreateWizardPolicy,
    CreateWizardStep,
    CreateWizardSubmission,
    CreateWizardValues
  } from './types'

  export type {
    CreateWizardListType,
    CreateWizardPolicy,
    CreateWizardStep,
    CreateWizardSubmission,
    CreateWizardValues
  } from './types'

  export interface CreateWizardProps {
    /** The policies to pick from. Left out, the sample renders. */
    policies?: CreateWizardPolicy[]
    /** The step the wizard opens on. */
    defaultStep?: CreateWizardStep
    /** The policy already picked; empty, Where it runs waits for an answer. */
    defaultPolicy?: string
    /** The values the form starts from. */
    defaultValues?: Partial<CreateWizardValues>
    /** The create request is in flight; the submit spins and the wizard locks. */
    loading?: boolean
    /** Why the create request failed, shown in an error toast with Retry. */
    error?: string
  }

  type FieldName = 'name' | 'type' | 'items'

  interface FieldProblem {
    type: 'helper' | 'invalid' | 'required'
    message: string
  }

  interface StepDefinition {
    value: string
    title: string
    description: string
    fields: FieldName[]
  }

  const props = withDefaults(defineProps<CreateWizardProps>(), {
    policies: undefined,
    defaultStep: 'where-it-runs',
    defaultPolicy: '',
    defaultValues: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: MouseEvent, values: CreateWizardSubmission]
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()

  const breadcrumb = [
    { label: 'Access Lists', href: '/access-lists' },
    { label: 'Create Access List' }
  ]
  const policies = computed<CreateWizardPolicy[]>(() => props.policies ?? samplePolicies)

  const current = ref<string>(props.defaultStep)
  const choice = ref(props.defaultPolicy)
  const enableModule = ref(false)
  const form = reactive<CreateWizardValues>({
    name: '',
    type: 'asn',
    items: '',
    ...props.defaultValues
  })
  const errors = reactive<Partial<Record<FieldName, FieldProblem>>>({})
  const answered = ref(choice.value !== '')
  const whereMissing = ref(false)

  const moduleMissing = computed(
    () => !!choice.value && !policies.value.find((option) => option.value === choice.value)?.ready
  )

  const definitions = computed((): StepDefinition[] => [
    {
      value: 'where-it-runs',
      title: 'Where it runs',
      description: 'Select the policy whose rules match it. It needs IP filtering on.',
      fields: []
    },
    ...(moduleMissing.value
      ? [
          {
            value: 'module',
            title: 'IP filtering',
            description: 'Off on ' + choice.value + '.',
            fields: []
          }
        ]
      : []),
    {
      value: 'general',
      title: 'General',
      description:
        'Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules.',
      fields: ['name']
    },
    {
      value: 'settings',
      title: 'List settings',
      description:
        'The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it.',
      fields: ['type', 'items']
    },
    {
      value: 'review',
      title: 'Review',
      description: 'Check what is created and where it runs. Edit any part, then create the list.',
      fields: []
    }
  ])

  const index = computed(() =>
    Math.max(
      0,
      definitions.value.findIndex((entry) => entry.value === current.value)
    )
  )
  const stepIndex = computed({
    get: () => index.value,
    set: (position: number) => {
      const next = definitions.value[position]
      if (next) current.value = next.value
    }
  })

  const byValue = (value: string) =>
    definitions.value.find((entry) => entry.value === value) ?? definitions.value[0]

  const listField = computed(() => listFields[form.type])

  const validate = (fields: FieldName[]) => {
    for (const field of fields) delete errors[field]
    if (fields.includes('name') && !form.name.trim()) {
      errors.name = { type: 'required', message: 'This field is required.' }
    }
    if (fields.includes('items') && !form.items.trim()) {
      errors.items = { type: 'required', message: 'This field is required.' }
    }
    return fields.every((field) => !errors[field])
  }

  const answer = (value: string) => {
    choice.value = value
    answered.value = true
    enableModule.value = false
    whereMissing.value = false
    stepIndex.value = 1
  }

  const entries = computed(() =>
    Array.from(
      new Set(
        form.items
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      )
    )
  )
  const typeLabel = computed(() => types.find((option) => option.value === form.type)?.label)
  const editStep = (value: string) => {
    current.value = value
  }

  const onNext = (event: MouseEvent, position: number) => {
    const entry = definitions.value[position]
    if (entry?.value === 'where-it-runs' && !answered.value) {
      whereMissing.value = true
      event.preventDefault()
      return
    }
    if (entry && !validate(entry.fields)) event.preventDefault()
  }

  const commit = (event: MouseEvent) => {
    if (props.loading) return
    if (!validate(['name', 'type', 'items'])) {
      const failed = definitions.value.find((entry) => entry.fields.some((field) => errors[field]))
      if (failed) editStep(failed.value)
      return
    }
    emit('submit', event, {
      name: form.name.trim(),
      type: form.type,
      items: entries.value.join('\n'),
      policy: choice.value,
      enableModule: moduleMissing.value && enableModule.value
    })
  }

  const guard = useUnsavedChanges(
    () => ({ form, choice: choice.value, enableModule: enableModule.value }),
    {
      enabled: () => !props.loading
    }
  )

  watch(
    () => props.error,
    (message) => {
      if (!message) return
      toast.error(`Could not create ${form.name.trim() || 'the access list'}.`, {
        description: message,
        action: { label: 'Retry', onClick: (event: MouseEvent) => commit(event) }
      })
    },
    { immediate: true }
  )
</script>

<template>
  <WizardFrame
    v-model="stepIndex"
    back-label="Back to Access Lists"
    :breadcrumb="breadcrumb"
    title="Create Access List"
    description="An access list groups IP addresses, countries or ASNs that policy rules match on. Answer each step, review, then create it."
    submit-label="Create Access List"
    :shortcut-label="stepIndex === definitions.length - 1 ? 'Create access list' : 'Next step'"
    :loading="loading"
    :guard="guard"
    @next="onNext"
    @submit="commit"
    @cancel="(event: MouseEvent | KeyboardEvent) => emit('cancel', event)"
  >
    <Wizard.Step
      title="Where it runs"
      :description="byValue('where-it-runs').description"
    >
      <PolicyPickerStep
        :policies="policies"
        :choice="choice"
        :missing="whereMissing"
        @answer="answer"
      />
    </Wizard.Step>
    <Wizard.Step
      v-if="moduleMissing"
      title="IP filtering"
      :description="'Off on ' + choice + '.'"
    >
      <Card :padded="false">
        <template #default>
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <Alert
              severity="warning"
              size="small"
              :label="
                'An access list is only read by policy rules, and ' +
                choice +
                ' has IP filtering off, so nothing reads this one until the module is on.'
              "
            />

            <Field.Label>
              <Field orientation="horizontal">
                <Switch v-model="enableModule" />
                <Field.Content>
                  <Field.Title> Turn on IP filtering </Field.Title>
                  <Field.Description>
                    {{
                      'Sets modules.ip_filtering on the policy ' +
                      choice +
                      ' when this access list is created.'
                    }}
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>

            <p class="text-body-sm text-(--text-muted)">
              Leaving it off still creates the access list. It is not read until someone turns IP
              filtering on.
            </p>
          </div>
        </template>
      </Card>
    </Wizard.Step>
    <Wizard.Step
      title="General"
      :description="byValue('general').description"
    >
      <section
        class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  title="Name"
                  description="Give a unique and descriptive name to identify the access list."
                >
                  <Input
                    v-model="form.name"
                    size="large"
                    class="w-full"
                    aria-label="Name"
                    placeholder="office-ranges"
                    autocomplete="off"
                    required
                    :invalid="errors.name?.type === 'required'"
                    :aria-describedby="errors.name ? 'create-access-list-name-message' : undefined"
                    @update:model-value="delete errors.name"
                  />
                  <FieldError
                    v-if="errors.name"
                    id="create-access-list-name-message"
                    >{{ errors.name.message }}</FieldError
                  >
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </div>
      </section>
    </Wizard.Step>
    <Wizard.Step
      title="List settings"
      :description="byValue('settings').description"
    >
      <section
        class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  title="Type"
                  variant="stacked"
                >
                  <RadioGroup
                    v-model="form.type"
                    variant="card"
                    class="w-full"
                    name="access-lists-type"
                    aria-label="Type"
                  >
                    <RadioGroup.Item
                      v-for="option in types"
                      :key="option.value"
                      :value="option.value"
                      :description="option.description"
                      >{{ option.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                </SettingsRow>
                <SettingsRow
                  :title="listField.label"
                  :description="listField.helper"
                  variant="stacked"
                >
                  <Textarea
                    v-model="form.items"
                    class="w-full"
                    :rows="5"
                    :aria-label="listField.label"
                    :placeholder="listField.placeholder"
                    required
                    :invalid="errors.items?.type === 'required'"
                    :aria-describedby="
                      errors.items ? 'create-access-list-items-message' : undefined
                    "
                    @update:model-value="delete errors.items"
                  />
                  <FieldError
                    v-if="errors.items"
                    id="create-access-list-items-message"
                    >{{ errors.items.message }}</FieldError
                  >
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </div>
      </section>
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      :description="byValue('review').description"
    >
      <ReviewStep
        :name="form.name"
        :type-label="typeLabel ?? ''"
        :list-label="listField.label"
        :entries="entries"
        :choice="choice"
        :module-missing="moduleMissing"
        :enable-module="enableModule"
        @edit="editStep"
      />
    </Wizard.Step>
  </WizardFrame>
</template>
```

## `sample.ts`

```ts
import type { CreateWizardPolicy } from './create-wizard.vue'
import type {
  ServiceWizardCachePolicy,
  ServiceWizardOption,
  ServiceWizardOriginField,
  ServiceWizardOriginType
} from './lib/service-wizard'

export const samplePolicies: CreateWizardPolicy[] = [
  { value: 'acme-production', label: 'acme-production', description: 'acme-site', ready: true },
  { value: 'acme-staging', label: 'acme-staging', description: 'acme-site', ready: false },
  { value: 'api-hardening', label: 'api-hardening', description: 'legacy-api', ready: false },
  {
    value: 'checkout-shield',
    label: 'checkout-shield',
    description: 'ecommerce-v2',
    ready: false
  },
  { value: 'dev-sandbox', label: 'dev-sandbox', description: 'internal', ready: false },
  {
    value: 'marketing-site',
    label: 'marketing-site',
    description: 'marketing-site',
    ready: false
  },
  { value: 'payments-api', label: 'payments-api', description: 'ecommerce-v2', ready: false },
  { value: 'partner-gateway', label: 'partner-gateway', description: 'legacy-api', ready: true },
  { value: 'admin-allowlist', label: 'admin-allowlist', description: 'status-page', ready: true },
  {
    value: 'media-delivery',
    label: 'media-delivery',
    description: 'blog-platform',
    ready: false
  },
  { value: 'acme-canary', label: 'acme-canary', description: 'acme-docs', ready: false },
  {
    value: 'search-api-shield',
    label: 'search-api-shield',
    description: 'ecommerce-storefront',
    ready: false
  },
  {
    value: 'legacy-storefront',
    label: 'legacy-storefront',
    description: 'ecommerce-storefront',
    ready: false
  },
  { value: 'qa-sandbox', label: 'qa-sandbox', description: 'internal', ready: false }
]

export const projectModes = [
  { label: 'Existing project', value: 'existing' },
  { label: 'New project', value: 'new' }
]
export const projects: ServiceWizardOption[] = [
  { value: 'web-app', label: 'web-app', description: 'Astro · acme/web-app' },
  {
    value: 'black-friday-2025',
    label: 'black-friday-2025',
    description: 'Next.js · acme/black-friday-2025'
  },
  {
    value: 'black-friday-2026',
    label: 'black-friday-2026',
    description: 'Next.js · acme/black-friday-2026'
  },
  { value: 'docs-site', label: 'docs-site', description: 'Astro · acme/docs-site' },
  { value: 'docs-next', label: 'docs-next', description: 'Next.js · acme/docs-next' },
  { value: 'vue-sample', label: 'vue-sample', description: 'Vue · jane-doe/vue-sample' },
  { value: 'hello-world', label: 'hello-world', description: 'JavaScript · acme/hello-world' },
  { value: 'company-site', label: 'company-site', description: 'HTML · acme/company-site' },
  { value: 'company-docs', label: 'company-docs', description: 'HTML · acme/company-docs' },
  { value: 'analytics-pro', label: 'analytics-pro', description: 'Next.js · acme/analytics-pro' },
  { value: 'analytics-api', label: 'analytics-api', description: 'Next.js · acme/analytics-api' },
  {
    value: 'react-dashboard',
    label: 'react-dashboard',
    description: 'React · acme/react-dashboard'
  },
  { value: 'docs-portal', label: 'docs-portal', description: 'Vue · acme/docs-portal' },
  { value: 'ecommerce-v2', label: 'ecommerce-v2', description: 'Nuxt · acme/ecommerce-v2' },
  {
    value: 'ecommerce-storefront',
    label: 'ecommerce-storefront',
    description: 'Nuxt · acme/ecommerce-storefront'
  },
  {
    value: 'marketing-site',
    label: 'marketing-site',
    description: 'Astro · acme/marketing-site'
  },
  { value: 'blog-platform', label: 'blog-platform', description: 'Astro · acme/blog-platform' },
  { value: 'status-page', label: 'status-page', description: 'Svelte · acme/status-page' },
  { value: 'mobile-app', label: 'mobile-app', description: 'Svelte · acme/mobile-app' }
]
export const cachePolicies: ServiceWizardCachePolicy[] = [
  {
    value: 'images',
    label: 'Image caching',
    description:
      'Caches images for a long TTL and ignores the query string, so one object serves every variation of the same file.',
    fields: [
      {
        name: 'extensions',
        label: 'Extension matches',
        placeholder: 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff',
        required: true,
        description:
          'Comma-separated. The policy applies to requests whose path ends in one of them.'
      }
    ]
  },
  {
    value: 'files-optimization',
    label: 'File optimization',
    description:
      'Caches static assets and compresses them on the way out. The template carries the TTLs and the cache key.',
    fields: []
  }
]
export const originTypes = [
  { value: 'http', label: 'HTTP', description: 'An origin server, reached by host name.' },
  {
    value: 'storage',
    label: 'Storage',
    description: 'A storage location in this workspace, read by name and prefix.'
  },
  {
    value: 'live-ingest',
    label: 'Live Ingest',
    description: 'A region a live stream is ingested from.'
  }
]
export const originFieldsByType: Record<ServiceWizardOriginType, ServiceWizardOriginField[]> = {
  http: [
    {
      kind: 'text',
      name: 'address',
      label: 'Origin address',
      placeholder: 'origin.example.com',
      required: true,
      description: 'The host the project fetches from. No scheme.'
    },
    {
      kind: 'text',
      name: 'path',
      label: 'Path',
      placeholder: '/',
      description: 'Prefixed to the request path before it reaches the origin.'
    },
    {
      kind: 'text',
      name: 'uriPrefix',
      label: 'Apply when $uri starts with',
      placeholder: '/api',
      description: 'Leave it empty to send every request to this origin.'
    }
  ],
  storage: [
    {
      kind: 'select',
      name: 'location',
      label: 'Location',
      options: [
        { value: 'static-assets', label: 'static-assets' },
        { value: 'media-prod', label: 'media-prod' },
        { value: 'user-uploads', label: 'user-uploads' }
      ],
      required: true,
      description: 'A storage location in this workspace.'
    },
    {
      kind: 'text',
      name: 'prefix',
      label: 'Prefix',
      placeholder: 'assets/',
      description: 'The folder inside the location the origin reads from.'
    }
  ],
  'live-ingest': [
    {
      kind: 'select',
      name: 'region',
      label: 'Region',
      options: [
        { value: 'br-east-1', label: 'br-east-1, South America' },
        { value: 'us-east-1', label: 'us-east-1, North America' }
      ],
      required: true,
      description: 'Where the stream is ingested. Select the one closest to the broadcaster.'
    }
  ]
}
export const domainTypes = [
  { label: 'Free platform domain', value: 'platform' },
  { label: 'Your own domain', value: 'own' }
]
export const deploymentModes = [
  { label: 'Create one', value: 'auto' },
  { label: 'Use existing', value: 'existing' }
]
export const environments = [
  {
    value: 'Production',
    label: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.'
  },
  {
    value: 'Preview',
    label: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
  }
]
export const certificates: ServiceWizardOption[] = [
  { value: 'lets_encrypt', label: 'Let’s Encrypt' },
  { value: 'shared_san', label: 'Shared SAN' },
  { value: 'own', label: 'A certificate you upload' }
]
export const tlsVersions: ServiceWizardOption[] = [
  { value: 'tls_1_0', label: 'TLS 1.0' },
  { value: 'tls_1_1', label: 'TLS 1.1' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_3', label: 'TLS 1.3' }
]
export const errorPages: ServiceWizardOption[] = [
  { value: 'Rate limited', label: 'Rate limited' },
  { value: 'Blocked by firewall', label: 'Blocked by firewall' },
  { value: 'Branded 404', label: 'Branded 404' },
  { value: 'Server error', label: 'Server error' },
  { value: 'Maintenance window', label: 'Maintenance window' }
]
export const deployments: ServiceWizardOption[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'The platform’s own deployment. Versions keep the resource IDs they shipped with.'
  },
  { value: 's1', label: 'storefront-prod', description: 'Storefront traffic for production.' },
  { value: 's2', label: 'acme-storefront', description: 'Acme storefront, production traffic.' },
  {
    value: 's5',
    label: 'analytics-canary',
    description: 'Canary slice of the analytics project.'
  },
  { value: 's6', label: 'auth-service-prod', description: 'Authored in this workspace.' },
  { value: 's7', label: 'marketing-site-prod', description: 'Authored in this workspace.' },
  { value: 's9', label: 'internal-tools-dev', description: 'Authored in this workspace.' },
  { value: 's10', label: 'blog-platform-stage', description: 'Authored in this workspace.' },
  { value: 's11', label: 'web-app-prod', description: 'Production traffic for the web app.' },
  {
    value: 's12',
    label: 'web-app-preview',
    description: 'Per-version preview URLs for the web app.'
  },
  { value: 's13', label: 'web-app-stage', description: 'Stage rehearsals for the web app.' },
  {
    value: 's14',
    label: 'campaign-landing-prod',
    description: 'Production traffic for the seasonal campaign page.'
  },
  {
    value: 's15',
    label: 'campaign-landing-preview',
    description: 'Per-version preview URLs for the seasonal campaign page.'
  },
  {
    value: 's16',
    label: 'docs-site-prod',
    description: 'Production traffic for the documentation site.'
  },
  {
    value: 's17',
    label: 'docs-site-preview',
    description: 'Per-version preview URLs for the documentation site.'
  },
  {
    value: 'ws-1020655',
    label: 'service-01',
    description: 'Created with the service-01 service for Production.'
  },
  {
    value: 'ws-1020655-preview',
    label: 'service-01-preview',
    description: 'Created with the service-01 service for Preview.'
  },
  {
    value: 'ws-1020828',
    label: 'service-02',
    description: 'Created with the service-02 service for Production.'
  },
  {
    value: 'ws-1020828-preview',
    label: 'service-02-preview',
    description: 'Created with the service-02 service for Preview.'
  },
  {
    value: 'ws-1021001',
    label: 'service-03',
    description: 'Created with the service-03 service for Production.'
  },
  {
    value: 'ws-1021001-preview',
    label: 'service-03-preview',
    description: 'Created with the service-03 service for Preview.'
  },
  {
    value: 'ws-1021174',
    label: 'service-04',
    description: 'Created with the service-04 service for Production.'
  },
  {
    value: 'ws-1021174-preview',
    label: 'service-04-preview',
    description: 'Created with the service-04 service for Preview.'
  },
  {
    value: 'ws-1021347',
    label: 'service-05',
    description: 'Created with the service-05 service for Production.'
  },
  {
    value: 'ws-1021347-preview',
    label: 'service-05-preview',
    description: 'Created with the service-05 service for Preview.'
  },
  {
    value: 'ws-1021520',
    label: 'service-06',
    description: 'Created with the service-06 service for Production.'
  },
  {
    value: 'ws-1021520-preview',
    label: 'service-06-preview',
    description: 'Created with the service-06 service for Preview.'
  },
  {
    value: 'ws-1021693',
    label: 'service-07',
    description: 'Created with the service-07 service for Production.'
  },
  {
    value: 'ws-1021693-preview',
    label: 'service-07-preview',
    description: 'Created with the service-07 service for Preview.'
  },
  {
    value: 'ws-1021866',
    label: 'service-08',
    description: 'Created with the service-08 service for Production.'
  },
  {
    value: 'ws-1021866-preview',
    label: 'service-08-preview',
    description: 'Created with the service-08 service for Preview.'
  },
  {
    value: 'ws-1022039',
    label: 'service-09',
    description: 'Created with the service-09 service for Production.'
  },
  {
    value: 'ws-1022039-preview',
    label: 'service-09-preview',
    description: 'Created with the service-09 service for Preview.'
  },
  {
    value: 'ws-1022212',
    label: 'service-10',
    description: 'Created with the service-10 service for Production.'
  },
  {
    value: 'ws-1022212-preview',
    label: 'service-10-preview',
    description: 'Created with the service-10 service for Preview.'
  },
  {
    value: 'ws-1022385',
    label: 'service-11',
    description: 'Created with the service-11 service for Production.'
  },
  {
    value: 'ws-1022385-preview',
    label: 'service-11-preview',
    description: 'Created with the service-11 service for Preview.'
  },
  {
    value: 'ws-1022558',
    label: 'service-12',
    description: 'Created with the service-12 service for Production.'
  },
  {
    value: 'ws-1022558-preview',
    label: 'service-12-preview',
    description: 'Created with the service-12 service for Preview.'
  },
  {
    value: 'ws-1022731',
    label: 'service-13',
    description: 'Created with the service-13 service for Production.'
  },
  {
    value: 'ws-1022731-preview',
    label: 'service-13-preview',
    description: 'Created with the service-13 service for Preview.'
  },
  {
    value: 'ws-1022904',
    label: 'service-14',
    description: 'Created with the service-14 service for Production.'
  },
  {
    value: 'ws-1022904-preview',
    label: 'service-14-preview',
    description: 'Created with the service-14 service for Preview.'
  },
  {
    value: 'ws-1023077',
    label: 'service-15',
    description: 'Created with the service-15 service for Production.'
  },
  {
    value: 'ws-1023077-preview',
    label: 'service-15-preview',
    description: 'Created with the service-15 service for Preview.'
  },
  {
    value: 'ws-1023250',
    label: 'service-16',
    description: 'Created with the service-16 service for Production.'
  },
  {
    value: 'ws-1023250-preview',
    label: 'service-16-preview',
    description: 'Created with the service-16 service for Preview.'
  },
  {
    value: 'ws-1023423',
    label: 'service-17',
    description: 'Created with the service-17 service for Production.'
  },
  {
    value: 'ws-1023423-preview',
    label: 'service-17-preview',
    description: 'Created with the service-17 service for Preview.'
  },
  {
    value: 'ws-1023596',
    label: 'service-18',
    description: 'Created with the service-18 service for Production.'
  },
  {
    value: 'ws-1023596-preview',
    label: 'service-18-preview',
    description: 'Created with the service-18 service for Preview.'
  },
  {
    value: 'ws-1023769',
    label: 'service-19',
    description: 'Created with the service-19 service for Production.'
  },
  {
    value: 'ws-1023769-preview',
    label: 'service-19-preview',
    description: 'Created with the service-19 service for Preview.'
  },
  {
    value: 'ws-1023942',
    label: 'service-20',
    description: 'Created with the service-20 service for Production.'
  },
  {
    value: 'ws-1023942-preview',
    label: 'service-20-preview',
    description: 'Created with the service-20 service for Preview.'
  }
]
export const platformDomainSuffix = '.example.com'
```

## `lib/access-list.ts`

```ts
import type { CreateWizardListType } from '../types'

export interface ListField {
  label: string
  placeholder: string
  helper: string
}

export const types = [
  {
    value: 'asn',
    label: 'ASN',
    description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
  },
  {
    value: 'ip_cidr',
    label: 'IP/CIDR',
    description:
      'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
  },
  {
    value: 'countries',
    label: 'Countries',
    description: 'Group traffic by country, for location-based rules.'
  }
]
export const listFields: Record<CreateWizardListType, ListField> = {
  asn: {
    label: 'List',
    placeholder: '13335\n53331',
    helper:
      'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.'
  },
  ip_cidr: {
    label: 'List',
    placeholder: '192.0.2.10\n198.51.100.24\n203.0.113.7 #comment',
    helper:
      'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.'
  },
  countries: {
    label: 'Countries',
    placeholder: 'US\nCA',
    helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as US.'
  }
}

export const PREVIEW = 5

export const consumers = [
  {
    by: 'Policy rules',
    path: 'rules[].criteria[].argument',
    as: 'Network list'
  },
  {
    by: 'Rule sets',
    path: 'rule_sets[].match.network_list',
    as: 'Network list'
  }
]
```

## `lib/service-wizard.ts`

```ts
import type { SelectOptionItem } from '@aziontech/webkit/select'

export interface ServiceWizardOption extends SelectOptionItem {
  description?: string
}
export type ServiceWizardCachePolicyId = 'images' | 'files-optimization'
export interface ServiceWizardCacheField {
  name: string
  label: string
  placeholder: string
  required: boolean
  description: string
}
export interface ServiceWizardCachePolicy {
  value: ServiceWizardCachePolicyId
  label: string
  description: string
  fields: ServiceWizardCacheField[]
}
export type ServiceWizardOriginType = 'http' | 'storage' | 'live-ingest'
export interface ServiceWizardOriginTextField {
  kind: 'text'
  name: string
  label: string
  placeholder: string
  required?: boolean
  description: string
}
export interface ServiceWizardOriginSelectField {
  kind: 'select'
  name: string
  label: string
  options: ServiceWizardOption[]
  required?: boolean
  description: string
}
export type ServiceWizardOriginField = ServiceWizardOriginTextField | ServiceWizardOriginSelectField
export interface ServiceWizardPickerInitial {
  chosen?: string
  message?: string
  loading?: boolean
}
export interface ServiceWizardScratch {
  cache: Record<ServiceWizardCachePolicyId, { enabled: boolean; values: Record<string, string> }>
  origin: { enabled: boolean; type: ServiceWizardOriginType; values: Record<string, string> }
}

/** A searchable, paged list of options, as the project and deployment pickers hold it. */
export interface ServiceWizardPicker {
  query: string
  chosen: string
  message: string
  loading: boolean
  paged: boolean
  matches: ServiceWizardOption[]
  visible: ServiceWizardOption[]
  remaining: number
  nextBatch: number
  summary: string
  loadMore: () => void
}

export const wireWidths = ['62%', '48%', '70%', '54%', '44%']
export const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

export const labelFor = (options: ServiceWizardOption[]) => (value: string) =>
  options.find((option) => option.value === value)?.label ?? ''

/** The domain and deployment answers of the Create Service wizard. */
export interface ServiceWizardForm {
  domainType: string
  domainPrefix: string
  domainHost: string
  name: string
  environment: string
  certificate: string
  deploymentMode: string
  minimumTlsVersion: string
  errorPage: string
  allowPlatformDomain: boolean
  active: boolean
}

/** The names the service, its deployment and its domain get. */
export interface ServiceWizardNames {
  service: string
  deployment: string
  domain: string
}

/** What a picker's summary line is computed from. */
export interface PickerSummaryInput {
  noun: string
  total: number
  query: string
  loading: boolean
  matches: number
  visible: number
  remaining: number
  nextBatch: number
}

export function pickerSummary(input: PickerSummaryInput): string {
  const { noun, total, query, loading, matches, visible, remaining, nextBatch } = input
  if (loading) return 'Loading ' + nextBatch + ' more ' + noun + 's'
  if (query.trim() && !matches) return 'No ' + noun + ' matches ' + query
  if (remaining) return visible + ' of ' + matches + ' ' + noun + 's'
  return query.trim() ? matches + ' of ' + total + ' ' + noun + 's' : total + ' ' + noun + 's'
}

export function filterOptions(
  options: ServiceWizardOption[],
  query: string
): ServiceWizardOption[] {
  const text = query.trim().toLowerCase()
  if (!text) return options
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(text) ||
      String(option.description ?? '')
        .toLowerCase()
        .includes(text)
  )
}
```

## `parts/discard-dialog.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { UseUnsavedChangesReturn } from '@aziontech/webkit/use-unsaved-changes'

  export interface DiscardDialogProps {
    /** The unsaved-changes guard whose leave dialog this renders. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  defineProps<DiscardDialogProps>()
</script>

<template>
  <ConfirmDialog v-bind="guard.dialogProps.value">
    <template #actions>
      <Button
        :label="guard.labels.value.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="guard.labels.value.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
```

## `parts/policy-picker-step.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import type { CreateWizardPolicy } from '../types'

  export interface PolicyPickerStepProps {
    /** The policies the list can run in. */
    policies: CreateWizardPolicy[]
    /** The policy picked, empty for none. */
    choice: string
    /** Next was pressed with no answer: the step says to pick one. */
    missing?: boolean
  }

  const props = withDefaults(defineProps<PolicyPickerStepProps>(), { missing: false })

  const emit = defineEmits<{
    /** A policy was picked, or Continue without a policy pressed (an empty value). */
    answer: [value: string]
  }>()

  const VISIBLE = 6

  const query = ref('')

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return props.policies
    return props.policies.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!props.choice || head.some((option) => option.value === props.choice)) return head
    const picked = matches.value.find((option) => option.value === props.choice)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const choose = (option: CreateWizardPolicy) => emit('answer', option.value)

  const skip = () => emit('answer', '')

  const onSearchEnter = () => {
    if (matches.value.length) choose(matches.value[0])
  }
</script>

<template>
  <section class="mx-auto flex w-full max-w-(--container-md) flex-col gap-(--spacing-lg)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <Input
        v-model="query"
        size="large"
        class="w-full"
        placeholder="Search policies"
        aria-label="Search policies"
        autocomplete="off"
        @keydown.enter.prevent="onSearchEnter"
      />

      <div class="flex flex-col">
        <Item
          v-for="option in visible"
          :key="option.value"
          size="small"
          clickable
          :aria-pressed="choice === option.value"
          @click="choose(option)"
        >
          <Item.Media>
            <i
              class="az az-shield text-body-md leading-none text-(--text-muted)"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ option.label }}</Item.Title>
          </Item.Content>
          <Item.Actions>
            <Tag
              v-if="!option.ready"
              label="IP filtering off"
              severity="warning"
              size="small"
            />
            <i
              v-if="choice === option.value"
              class="az az-check text-body-sm leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </Item.Actions>
        </Item>

        <p
          v-if="hidden"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          {{ hidden }} more. Type to narrow the list.
        </p>
        <p
          v-else-if="!matches.length"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          No policy matches “{{ query.trim() }}”.
        </p>
      </div>
      <FieldError v-if="missing">Select a policy, or continue without one.</FieldError>
    </div>

    <div class="flex flex-col items-center gap-(--spacing-2xs)">
      <Button
        type="button"
        label="Create a policy"
        variant="ghost"
        size="small"
      />
      <Button
        type="button"
        label="Continue without a policy"
        variant="ghost"
        size="small"
        @click="skip"
      />
    </div>
  </section>
</template>
```

## `parts/review-step.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Subheader from '@aziontech/webkit/subheader'
  import Tag from '@aziontech/webkit/tag'

  import { consumers, PREVIEW } from '../lib/access-list'

  export interface ReviewStepProps {
    /** The list name. */
    name: string
    /** The label of the list type. */
    typeLabel: string
    /** The label of the entries field of that type. */
    listLabel: string
    /** The entries, without duplicates. */
    entries: string[]
    /** The policy picked, empty for none. */
    choice: string
    /** The picked policy has IP filtering off. */
    moduleMissing?: boolean
    /** IP filtering is turned on with the list. */
    enableModule?: boolean
  }

  withDefaults(defineProps<ReviewStepProps>(), { moduleMissing: false, enableModule: false })

  const emit = defineEmits<{
    /** Edit was pressed on a section; carries the step to go back to. */
    edit: [step: string]
  }>()
</script>

<template>
  <section class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <Subheader
        title="Where it runs"
        size="small"
      >
        <template #actions>
          <Button
            type="button"
            label="Edit"
            variant="outline"
            size="small"
            aria-label="Edit where it runs"
            @click="emit('edit', 'where-it-runs')"
          />
        </template>
      </Subheader>
      <Alert
        key="alert-1"
        v-if="!choice"
        severity="warning"
      >
        Bound to no policy. The list is created, but no rule can match on it until a policy uses it.
      </Alert>
      <Alert
        key="alert-2"
        v-else-if="moduleMissing && !enableModule"
        severity="warning"
      >
        IP filtering is off on {{ choice }}, so no rule reads this list until it is on.
      </Alert>
      <Alert
        key="alert-3"
        severity="success"
      >
        Runs on {{ choice }}.
      </Alert>
    </section>

    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <Subheader
        title="What gets created"
        description="Each value is sent as the property named under it."
        size="small"
      >
        <template #actions>
          <Button
            type="button"
            label="Edit"
            variant="outline"
            size="small"
            aria-label="Edit list settings"
            @click="emit('edit', 'settings')"
          />
        </template>
      </Subheader>
      <Card :padded="false">
        <template #default>
          <Item.List>
            <Item>
              <Item.Content>
                <Item.Title>Name</Item.Title>
                <Item.Description>name</Item.Description>
              </Item.Content>
              <Item.Actions>
                <span class="max-w-80 truncate text-label-sm text-(--text-default)">{{
                  name
                }}</span>
                <Button
                  type="button"
                  label="Edit"
                  variant="ghost"
                  size="small"
                  aria-label="Edit name"
                  @click="emit('edit', 'general')"
                />
              </Item.Actions>
            </Item>
            <Item>
              <Item.Content>
                <Item.Title>Type</Item.Title>
                <Item.Description>type</Item.Description>
              </Item.Content>
              <Item.Actions>
                <span class="text-label-sm text-(--text-default)">{{ typeLabel }}</span>
              </Item.Actions>
            </Item>
            <Item>
              <Item.Content>
                <Item.Title>{{ listLabel }}</Item.Title>
                <Item.Description>items</Item.Description>
                <ul
                  class="m-0 mt-(--spacing-xs) flex list-none flex-wrap gap-(--spacing-2xs) p-0"
                  :aria-label="`${entries.length} entries`"
                >
                  <li
                    v-for="entry in entries.slice(0, PREVIEW)"
                    :key="entry"
                  >
                    <Tag
                      :label="entry"
                      severity="neutral"
                      size="small"
                    />
                  </li>
                  <li
                    v-if="entries.length > PREVIEW"
                    class="text-label-sm text-(--text-muted)"
                  >
                    and {{ entries.length - PREVIEW }} more
                  </li>
                </ul>
              </Item.Content>
              <Item.Actions>
                <span class="text-label-sm text-(--text-default)"
                  >{{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }}</span
                >
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </Card>
    </section>

    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <Subheader
        title="What can reference it"
        description="Everything that can point at this list once it exists, and the field that carries the reference."
        size="small"
      />
      <Card :padded="false">
        <template #default>
          <Item.List>
            <Item
              v-for="row in consumers"
              :key="row.by"
            >
              <Item.Content>
                <Item.Title>{{ row.by }}</Item.Title>
                <Item.Description>{{ row.path }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Tag
                  :label="row.as"
                  severity="neutral"
                  size="small"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </Card>
    </section>
  </section>
</template>
```

## `parts/wizard-frame.vue`

```ts
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import type { UseUnsavedChangesReturn } from '@aziontech/webkit/use-unsaved-changes'
  import Wizard from '@aziontech/webkit/wizard-root'
  import { type ComponentPublicInstance, onMounted, ref } from 'vue'

  import DiscardDialog from './discard-dialog.vue'

  export interface WizardFrameProps {
    /** Name of the back control, read by screen readers. */
    backLabel: string
    /** The trail beside the brand: the module, then the page title. */
    breadcrumb: BreadcrumbItemData[]
    /** Page title and wizard name. */
    title: string
    /** The line under the title. */
    description: string
    /** Label of the submit button on the last step. */
    submitLabel: string
    /** Name of the Cmd+Enter shortcut in the shortcut list. */
    shortcutLabel: string
    /** The request is in flight: the wizard locks. */
    loading?: boolean
    /** The unsaved-changes guard; Back, Cancel and Escape ask before leaving a changed draft. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'confirmLeave' | 'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  const props = withDefaults(defineProps<WizardFrameProps>(), { loading: false })

  const emit = defineEmits<{
    next: [event: MouseEvent, position: number]
    submit: [event: MouseEvent]
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()

  /** The step the wizard is on. */
  const stepIndex = defineModel<number>({ required: true })

  defineSlots<{
    /** The steps of the wizard. */
    default(): unknown
  }>()

  const onCancel = async (event: MouseEvent | KeyboardEvent) => {
    if (await props.guard.confirmLeave()) emit('cancel', event)
  }

  useEscapeToCancel(onCancel, { enabled: () => !props.loading })

  const wizardEl = ref<ComponentPublicInstance | null>(null)

  const FIELD_SELECTOR =
    'input:not([type="hidden"]), textarea, select, [role="combobox"], [role="radio"][tabindex="0"]'

  const wizardRoot = () => (wizardEl.value?.$el as HTMLElement | undefined) ?? null

  const focusFirstField = () => {
    const root = wizardRoot()
    const field = root?.querySelector<HTMLElement>(FIELD_SELECTOR)
    const checked =
      field instanceof HTMLInputElement && field.type === 'radio'
        ? root?.querySelector<HTMLElement>(`input[name="${CSS.escape(field.name)}"]:checked`)
        : null
    ;(checked ?? field)?.focus()
  }

  useShortcuts({
    keys: 'meta+enter',
    label: () => props.shortcutLabel,
    group: 'Page',
    element: wizardRoot,
    when: () => !props.loading,
    handler: () =>
      [...(wizardRoot()?.querySelectorAll<HTMLButtonElement>('button') ?? [])].pop()?.click()
  })

  onMounted(focusFirstField)
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          :aria-label="backLabel"
          variant="outline"
          size="small"
          @click="onCancel"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <AppHeaderAccount
          name="name@example.com"
          aria-label="Account settings"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <div
        class="layout-form-create layout-boundary-inline flex flex-col gap-(--layout-section-gap) py-(--layout-section-gap)"
      >
        <PageHeader
          :title="title"
          :description="description"
          size="small"
        />

        <Wizard
          ref="wizardEl"
          v-model="stepIndex"
          :aria-label="title"
          :submit-label="submitLabel"
          :loading="loading"
          @next="(event: MouseEvent, position: number) => emit('next', event, position)"
          @submit="(event: MouseEvent) => emit('submit', event)"
          @cancel="onCancel"
        >
          <slot />
        </Wizard>
      </div>
    </main>
    <DiscardDialog
      :guard="guard"
      data-testid="unsaved-changes-dialog"
    />
  </div>
</template>
```

## `types.ts`

```ts
/** The kind of entry an access list holds. */
export type CreateWizardListType = 'asn' | 'ip_cidr' | 'countries'

/** A policy the list can run on. */
export interface CreateWizardPolicy {
  /** The policy key. */
  value: string
  /** The policy name. */
  label: string
  /** The application it protects. */
  description: string
  /** Whether IP filtering is already on in it. */
  ready: boolean
}

/** The values of the Create Access List form. */
export interface CreateWizardValues {
  /** The list name. */
  name: string
  /** The kind of entry the list holds. */
  type: CreateWizardListType
  /** The entries, one per line. */
  items: string
}

/** What submit sends: the form values and where the list runs. */
export interface CreateWizardSubmission extends CreateWizardValues {
  /** The policy it runs on; empty when skipped. */
  policy: string
  /** Whether IP filtering is turned on in that policy as part of the create. */
  enableModule: boolean
}

/** A step of the wizard. */
export type CreateWizardStep = 'where-it-runs' | 'module' | 'general' | 'settings' | 'review'
```
