# MultipageCreate (`platform/create/multipage-create`)

> The page a first-level resource is created on one step at a time: the creation header, a Stepper rail on the left that unlocks each step once it is reached and shows the description of the current one, a form column that opens with the step heading, and a footer bar with Cancel on the left and Back plus Next on the right, Next turning into the create action on the last step. Every create asks first where the resource runs: a centred chooser lists the hosts it can bind to, six at a time with a search, and tags the ones missing a module the resource needs; choosing one with that module off inserts a step that offers to turn it on. Each resource brings its own field steps, plus an Advanced step when the endpoint has optional settings, and a code resource can make one step the editor plotted in CodeWorkspace. Built from `PageHeader`, `SettingRow`, `GlobalHeader`, `Stepper`, `Input`, `Tag`, `Card`, `Alert`, `Field` choice cards with `Switch` and `RadioButton`, `Item`, `Textarea`, `HelperText` and `Button`.

- Surface: product
- Source: `blocks/platform/create/multipage-create/multipage-create.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/multipage-create")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [RadioButton](../../../components/radio-button.md), [SaveBar](../../../components/save-bar.md), [SectionHeader](../../../components/section-header.md), [SettingRow](../../../components/setting-row.md), [Stepper](../../../components/stepper.md), `type`, [Switch](../../../components/switch.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`

## Asked as

multipage create; multi-step create page; stepper create; create wizard; step by step form; criação em etapas; formulário em etapas; review step; review and create; confirm before create; wizard review; summary before submit; revisar; etapa de revisão; revisão antes de criar; review before create; summary step; revisar antes de criar

The page a first-level resource is created on one step at a time. The user first says where the resource runs, then answers each step's fields in order, and only reaches the create action on the last step. A rail on the left shows how far they are and lets them return to any step already reached; if the host they chose lacks a module the resource needs, a step is inserted that offers to turn it on, so nothing is created that would silently never be read.

## When to use

- A first-level resource whose fields fall into groups that make sense one at a time (general, then type, then entries) and where a later group depends on an earlier answer.
- The resource must first bind to a host (a policy, an application) and that choice can change what is asked next.
- A code resource whose editor needs a whole step to itself.

## When not to use

- Everything fits on one screen without order: use `platform/create/single-page-create`.
- The resource is created inside another one: use `platform/create/create-in-drawer`.
- The flow provisions a service, binds a project and deploys: use `platform/create/provision-wizard`.
- The flow starts from a code source (Git, CLI, template): use `platform/create/source-wizard`.
- Binding an existing or new resource inside a form step: use `platform/create/resource-picker`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`GlobalHeader` with no sidebar: a back `IconButton` to the module, the `Brand` linking home, a `Breadcrumb` of the module and the create label, and the account `Avatar`. The breadcrumb's last item repeats the create button's label exactly.

### B. Step rail — `Stepper` (required)

A `Stepper` in an aside on the left, `v-model` bound to the current step and labelled with the create label. Each `Stepper.Step` has a title, a `state` (`complete`, `upcoming` or `error`) and is `disabled` until it has been reached. Only the current step shows its description. A step whose fields failed validation turns to `error` so the rail points at it. On a phone the rail gives way to a "Step 2 of 4" line over the heading.

### C. Step heading — `PageHeader` (required)

`PageHeader size="small"` titled with the step's name and described with the step's sentence. The Where it runs step has no `PageHeader`; it carries its own centred heading instead.

### D. Where it runs — `Input`, `Item`, `Tag`, `Button` (required)

A centred chooser: an icon, the create label as the page's `h1`, one line of instruction, a large search `Input` and up to six host rows. Each row is a small `Item` rendered `as-child` on a native `button` with `aria-pressed` and `data-selected`; a host missing the module the resource needs carries a small warning `Tag`. A chosen host past the first six is kept visible. Picking a row advances to the next step, so this step has no Next. A count line tells how many more match, a no-match line replaces the rows, and two transparent small `Button`s offer to create a host or continue without one.

### E. Module step — `Card`, `Alert`, `Field`, `Switch` (conditional)

Inserted only when the chosen host has the needed module off. A flush `Card` holds a small warning `Alert` that states the consequence, a horizontal `Field` choice card whose `Switch` turns the module on when the resource is created, and one muted line on what leaving it off means. Leaving it off is allowed.

### F. Field steps — `Card`, `Item`, `SettingRow`, `Input`, `HelperText` (required)

Each step's fields are `SettingRow`s in an `Item.List` inside a flush `Card`, the same anatomy as a single page create. A large `Input` takes an `aria-label` matching the row title. Next validates only the current step: an empty required field gets `:required` and a `HelperText` with the message, cleared as soon as the field is edited.

### G. Choice cards — `Field`, `RadioButton` (optional)

A choice that changes what follows, such as the list type, is a `SettingRow kind="stacked"` holding a `fieldset` of wide horizontal `Field` cards, each a `RadioButton` with `Field.Title` and `Field.Description`. Use it for three to five options that need a sentence each.

### H. Long entry — `Textarea`, `HelperText` (optional)

A stacked row with a five-row `Textarea` whose label, placeholder and guidance follow the choice above it. Its required message is a `HelperText` tied by `aria-describedby`.

### I. Footer — `SaveBar` (required)

`SaveBar kind="plain"` fixed under the form, on the create measure (a wrapper sets `--layout-measure-form` to `--layout-measure-form-create`, since the bar takes no classes of its own): transparent Cancel in its `#leading` slot, on the left; outlined Back (hidden on the first step) and the primary submit in `#actions`, on the right, all medium `Button`s. The submit reads Next and becomes the create label on the last step. It is the form's only `type="submit"`, so Enter advances.

## Do

- Ask where the resource runs first, and insert the module step only when the chosen host needs it.
- Validate one step at a time on Next, and mark a failed step `error` on the rail.
- Unlock a step on the rail only once it has been reached, and let the user jump back to any unlocked step.
- Keep Cancel apart from Back and Next, on the opposite side.
- Keep the create action on the last step only; every step before it says Next.
- Keep the chosen host visible in the chooser even when it falls outside the first six.

## Don't

- Don't let the rail skip ahead to steps not reached yet.
- Don't put a Next button on a step answered by a click; picking the host is the answer.
- Don't block the create when a module is off; warn, offer the switch and let the user go on.
- Don't repeat the step title as a second heading inside the card.
- Don't validate fields of later steps, or judge a field while it is being typed.
- Don't use more than one step for fields that only make sense together.

## Copy

- **Title, breadcrumb and last submit:** the create label with the entity's capitalization, e.g. "Create Access List".
- **Step titles:** short nouns, e.g. "Where it runs", "General", "List settings".
- **Step descriptions:** one sentence with a period, e.g. "Select the policy whose rules match it. It needs IP filtering on."
- **Chooser:** instruction with "Select", e.g. "Select a policy to continue"; the search placeholder and `aria-label` name what is searched, e.g. "Search policies".
- **Module tag:** the missing module and its state, e.g. "IP filtering off".
- **Module alert:** the consequence in one sentence, e.g. "acme-staging has IP filtering off, so no rule reads this list until the module is on."
- **Escape routes:** verb first, e.g. "Create a policy", "Continue without a policy".
- **Required message:** "This field is required."
- Follow `skills/webkit-microcopy`: "Select", never "Choose"; no em dash; no "simply".

## Accessibility

- The `Stepper` has an `aria-label` naming the flow; disabled steps cannot be focused or activated.
- The `form` takes the current step's title as its `aria-label`; a `fieldset` with a visually hidden `legend` repeats it.
- Host rows are native `button`s with `aria-pressed`; the chooser's search has an `aria-label` and Enter selects the first match.
- Choice cards sit in a `fieldset` with a `legend`; each `RadioButton` is labelled by its card.
- Required messages are tied to their control with `aria-describedby`; focus stays on the step after a failed Next.
- Step transitions honour reduced motion.

## States

- WhereItRuns: the first step; the centred chooser of policies with search, module tags and the two escape routes.
- ModuleOff: acme-staging was chosen with IP filtering off, so the IP filtering step shows the warning, the switch card and the note.
- ListSettings: the settings step; Type as radio choice cards and the List textarea. An empty list marks the step red on the rail.
- Review: the last step, read-only, with the create action in the footer. Where it runs is one `Alert` whose severity says whether anything will read the resource; What gets created pairs each value with the property it is sent as and shows long lists as their first five `Tag`s and a count; What can reference it names the consumers. Each band that maps to a step has an outlined Edit (`aria-label` names the band) that jumps back to that step. Create re-validates every step and, on a failure, opens the first step with an error.

## Review step

- Add a Review step when the create has three or more steps or binds the resource to something; skip it for a one-step create.
- Show values as they will be sent, with the property name under each, and never show secrets in clear.
- Put Edit on each band, not on each value; after the edit, Next walks forward through the later steps, already filled, back to Review.
- Say plainly when nothing will read the resource yet (unbound, or a module off) with a warning `Alert`, not a disabled create.

## Related

- `platform/create/single-page-create` — the same job when the fields fit one screen.
- `platform/create/source-wizard` — a step wizard that starts from a code source and deploys.
- `platform/create/provision-wizard` — a two-step wizard that binds a project and deploys.
- `platform/edit/code-editor` — the editor a code resource can use as one step.
- `platform/states/form-validation` — required and invalid states on Next.
- `Stepper` — the step rail; see `skills/webkit-form`.

## Steps

- where-it-runs
- module
- settings

## Variants

- `WhereItRuns` — primary (the code below)
- `ModuleOff` — acme-staging was chosen with IP filtering off, so an IP filtering step follows Where it runs: a warning Alert, the Switch choice card that turns the module on with the list, and a note on what leaving it off means.
- `ListSettings` — The last step of a list bound to acme-production: the Type as wide RadioButton choice cards and the List Textarea whose label, placeholder and guidance follow the type, with Back and Create access list in the footer. Leaving the list empty flags it and marks the step red on the rail.
- `Review` — The Review step that closes the create, after List settings: three bands under small `SectionHeader`s. Where it runs is one `Alert` (success when the policy is ready, warning when it is unbound or its module stays off) with Edit back to the chooser; What gets created lists each value beside the property it is sent as, the entries as `Tag`s with a count and and N more, with Edit back to List settings; What can reference it lists the consumers and the field that carries the reference. Create Access List shows its loading state and the result arrives as a toast; a value that fails on create sends the user back to its step, marked red on the rail.

Each variant is the same screen in another state: `get_pattern("platform/create/multipage-create", { variant })`, or the file under `blocks/platform/create/multipage-create/variants/`.

## Code (`WhereItRuns`)

```vue
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Alert from '@aziontech/webkit/alert'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Stepper from '@aziontech/webkit/stepper'
  import type { StepperStepState } from '@aziontech/webkit/stepper-step'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref } from 'vue'

  type ListType = 'asn' | 'ip_cidr' | 'countries'
  type FieldName = 'name' | 'type' | 'items'
  type Direction = 'forward' | 'back'

  interface PolicyOption {
    value: string
    label: string
    description: string
    ready: boolean
  }

  interface ListField {
    label: string
    placeholder: string
    helper: string
  }

  interface FieldError {
    kind: HelperTextKind
    message: string
  }

  interface StepDefinition {
    value: string
    title: string
    description: string
    heading?: boolean
    fields: FieldName[]
  }

  interface StepItem {
    value: string
    title: string
    description: string
    state: StepperStepState
    disabled: boolean
  }

  const breadcrumb = [
    { label: 'Access Lists', href: '/access-lists' },
    { label: 'Create Access List' }
  ]
  const policies: PolicyOption[] = [
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
  const types = [
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
  const listFields: Record<ListType, ListField> = {
    asn: {
      label: 'List',
      placeholder: '13335\n53331',
      helper:
        'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.'
    },
    ip_cidr: {
      label: 'List',
      placeholder: '185.241.208.232\n194.26.192.64\n171.25.193.25 #comment',
      helper:
        'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.'
    },
    countries: {
      label: 'Countries',
      placeholder: 'BR\nUS',
      helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as BR.'
    }
  }

  const VISIBLE = 6

  const current = ref('where-it-runs')
  const direction = ref<Direction | null>(null)
  const choice = ref('')
  const enableModule = ref(false)
  const query = ref('')
  const form = reactive<{ name: string; type: ListType; items: string }>({
    name: '',
    type: 'asn',
    items: ''
  })
  const errors = reactive<Partial<Record<FieldName, FieldError>>>({})
  const unlocked = ref(['where-it-runs'])

  const moduleMissing = computed(
    () => !!choice.value && !policies.find((option) => option.value === choice.value)?.ready
  )

  const definitions = computed((): StepDefinition[] => [
    {
      value: 'where-it-runs',
      title: 'Where it runs',
      description: 'Select the policy whose rules match it. It needs IP filtering on.',
      heading: false,
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
    }
  ])

  const index = computed(() =>
    Math.max(
      0,
      definitions.value.findIndex((entry) => entry.value === current.value)
    )
  )
  const step = computed(() => definitions.value[index.value])
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === definitions.value.length - 1)

  const steps = computed(() =>
    definitions.value.map((entry, position): StepItem => ({
      value: entry.value,
      title: entry.title,
      description: entry.description,
      state: entry.fields.some((field) => errors[field])
        ? 'error'
        : position < index.value
          ? 'complete'
          : 'upcoming',
      disabled: !unlocked.value.includes(entry.value)
    }))
  )

  const listField = computed(() => listFields[form.type])

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return policies
    return policies.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!choice.value || head.some((option) => option.value === choice.value)) return head
    const picked = matches.value.find((option) => option.value === choice.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const validate = (fields: FieldName[]) => {
    for (const field of fields) delete errors[field]
    if (fields.includes('name') && !form.name.trim()) {
      errors.name = { kind: 'required', message: 'This field is required.' }
    }
    if (fields.includes('items') && !form.items.trim()) {
      errors.items = { kind: 'required', message: 'This field is required.' }
    }
    return fields.every((field) => !errors[field])
  }

  const goNext = () => {
    if (!validate(step.value.fields)) return
    const next = definitions.value[index.value + 1]
    if (!next) return
    if (!unlocked.value.includes(next.value)) unlocked.value.push(next.value)
    direction.value = 'forward'
    current.value = next.value
  }

  const goBack = () => {
    const previous = definitions.value[index.value - 1]
    if (!previous) return
    direction.value = 'back'
    current.value = previous.value
  }

  const choose = (option: PolicyOption) => {
    choice.value = option.value
    enableModule.value = false
    goNext()
  }

  const skip = () => {
    choice.value = ''
    enableModule.value = false
    goNext()
  }

  const onSearchEnter = () => {
    if (matches.value.length) choose(matches.value[0])
  }

  const commit = () => {
    if (!isLast.value) {
      goNext()
      return
    }
    validate(['name', 'type', 'items'])
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Access Lists"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <div class="flex min-h-0 flex-1">
      <aside
        class="hidden h-full w-64 shrink-0 overflow-auto border-e border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
      >
        <div class="flex h-full">
          <Stepper
            v-model="current"
            aria-label="Create Access List"
            class="w-full"
          >
            <Stepper.Step
              v-for="entry in steps"
              :key="entry.value"
              :value="entry.value"
              :title="entry.title"
              :description="entry.value === current ? entry.description : ''"
              :state="entry.state"
              :disabled="entry.disabled"
            />
          </Stepper>
        </div>
      </aside>

      <form
        class="flex min-w-0 flex-1 flex-col"
        :aria-label="step.title"
        novalidate
        @submit.prevent="commit"
      >
        <main
          :data-direction="direction"
          class="group/main data-[direction=forward]:[--page-enter-distance:calc(var(--layout-boundary-inline)*-1)] animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
        >
          <div class="flex min-h-full flex-col">
            <div
              class="layout-form-create layout-boundary-inline flex flex-1 flex-col pt-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <p class="pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">
                Step {{ index + 1 }} of {{ steps.length }}
              </p>

              <PageHeader
                v-if="step.heading !== false"
                :title="step.title"
                :description="step.description"
                size="small"
              />

              <fieldset
                class="mx-0 flex min-w-0 flex-1 flex-col border-0 p-0 data-headed:mt-(--layout-section-gap)"
                :data-headed="step.heading !== false || null"
              >
                <legend class="sr-only">{{ step.title }}</legend>
                <section
                  v-if="current === 'where-it-runs'"
                  data-wide
                  class="mx-auto flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg) data-wide:max-w-(--container-md)"
                  aria-labelledby="create-access-list-host-title"
                >
                  <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
                    <span
                      class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <i
                        class="pi pi-list text-body-lg leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                    <h1
                      id="create-access-list-host-title"
                      class="text-heading-xs text-(--text-default)"
                    >
                      Create Access List
                    </h1>
                    <p class="text-body-sm text-(--text-muted)">Select a policy to continue</p>
                  </header>

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
                        as-child
                        size="small"
                      >
                        <button
                          type="button"
                          class="w-full text-start data-[selected]:bg-(--bg-selected)"
                          :aria-pressed="choice === option.value"
                          :data-selected="choice === option.value || null"
                          @click="choose(option)"
                        >
                          <Item.Media>
                            <i
                              class="pi pi-shield text-body-md leading-none text-(--text-muted)"
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
                              class="pi pi-check text-body-sm leading-none text-(--text-default)"
                              aria-hidden="true"
                            />
                          </Item.Actions>
                        </button>
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
                  </div>

                  <div class="flex flex-col items-center gap-(--spacing-xxs)">
                    <Button
                      type="button"
                      label="Create a policy"
                      kind="transparent"
                      size="small"
                    />
                    <Button
                      type="button"
                      label="Continue without a policy"
                      kind="transparent"
                      size="small"
                      @click="skip"
                    />
                  </div>
                </section>

                <Card
                  v-else-if="current === 'module'"
                  :padded="false"
                >
                  <template #content>
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
                        Leaving it off still creates the access list. It is not read until someone
                        turns IP filtering on.
                      </p>
                    </div>
                  </template>
                </Card>

                <section
                  v-else-if="current === 'general'"
                  class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                    <Card :padded="false">
                      <template #content>
                        <Item.List>
                          <SettingRow
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
                              :required="errors.name?.kind === 'required'"
                              :aria-describedby="
                                errors.name ? 'create-access-list-name-message' : undefined
                              "
                              @update:model-value="delete errors.name"
                            />
                            <HelperText
                              v-if="errors.name"
                              id="create-access-list-name-message"
                              :kind="errors.name.kind"
                              :label="errors.name.message"
                            />
                          </SettingRow>
                        </Item.List>
                      </template>
                    </Card>
                  </div>
                </section>

                <section
                  v-else
                  class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                    <Card :padded="false">
                      <template #content>
                        <Item.List>
                          <SettingRow
                            title="Type"
                            kind="stacked"
                          >
                            <fieldset
                              class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                            >
                              <legend class="sr-only">Type</legend>
                              <Field.Label
                                v-for="option in types"
                                :key="option.value"
                              >
                                <Field orientation="horizontal">
                                  <RadioButton
                                    v-model="form.type"
                                    :value="option.value"
                                    name="access-lists-type"
                                  />
                                  <Field.Content>
                                    <Field.Title>
                                      {{ option.label }}
                                    </Field.Title>
                                    <Field.Description v-if="option.description">
                                      {{ option.description }}
                                    </Field.Description>
                                  </Field.Content>
                                </Field>
                              </Field.Label>
                            </fieldset>
                          </SettingRow>
                          <SettingRow
                            :title="listField.label"
                            :description="listField.helper"
                            kind="stacked"
                          >
                            <Textarea
                              v-model="form.items"
                              class="w-full"
                              :rows="5"
                              :aria-label="listField.label"
                              :placeholder="listField.placeholder"
                              :required="errors.items?.kind === 'required'"
                              :aria-describedby="
                                errors.items ? 'create-access-list-items-message' : undefined
                              "
                              @update:model-value="delete errors.items"
                            />
                            <HelperText
                              v-if="errors.items"
                              id="create-access-list-items-message"
                              :kind="errors.items.kind"
                              :label="errors.items.message"
                            />
                          </SettingRow>
                        </Item.List>
                      </template>
                    </Card>
                  </div>
                </section>
              </fieldset>
            </div>
          </div>
        </main>

        <div class="shrink-0 [--layout-measure-form:var(--layout-measure-form-create)]">
          <SaveBar kind="plain">
            <template #leading>
              <Button
                type="button"
                label="Cancel"
                kind="transparent"
                size="medium"
              />
            </template>
            <template #actions>
              <Button
                v-if="!isFirst"
                type="button"
                label="Back"
                kind="outlined"
                size="medium"
                @click="goBack"
              />
              <Button
                :label="isLast ? 'Create Access List' : 'Next'"
                kind="primary"
                size="medium"
                type="submit"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </div>
  </div>
</template>
```
