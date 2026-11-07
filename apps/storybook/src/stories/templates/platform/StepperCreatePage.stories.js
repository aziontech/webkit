import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import Stepper from '@aziontech/webkit/stepper'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  creationHeader,
  declare,
  fieldRow,
  flushCard,
  HEADER_IMPORTS,
  headerComponents,
  itemComponents,
  pageHeading,
  section,
  stepRail
} from './_create-markup'

const components = {
  ...headerComponents({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton }),
  ...itemComponents(Item, ['List', 'Content', 'Title', 'Description', 'Actions']),
  Button,
  CardBox,
  FieldRadioBlock,
  FieldSwitchBlock,
  HelperText,
  InputText,
  Message,
  Stepper,
  'Stepper.Step': Stepper.Step,
  Tag,
  Textarea
}

const BREADCRUMB = [
  { label: 'Network Lists', href: '/network-lists' },
  { label: 'Create Network List' }
]

const FIREWALLS = [
  {
    value: 'edgeflow-production',
    label: 'edgeflow-production',
    description: 'edgeflow-site',
    ready: true
  },
  {
    value: 'edgeflow-staging',
    label: 'edgeflow-staging',
    description: 'edgeflow-site',
    ready: false
  },
  { value: 'api-hardening', label: 'api-hardening', description: 'legacy-api', ready: false },
  { value: 'checkout-shield', label: 'checkout-shield', description: 'ecommerce-v2', ready: false },
  { value: 'dev-sandbox', label: 'dev-sandbox', description: 'ddos', ready: false },
  { value: 'marketing-site', label: 'marketing-site', description: 'marketing-site', ready: false },
  { value: 'payments-api', label: 'payments-api', description: 'ecommerce-v2', ready: false },
  { value: 'partner-gateway', label: 'partner-gateway', description: 'legacy-api', ready: true },
  { value: 'admin-allowlist', label: 'admin-allowlist', description: 'status-page', ready: true },
  { value: 'media-delivery', label: 'media-delivery', description: 'blog-platform', ready: false },
  {
    value: 'edgeflow-canary',
    label: 'edgeflow-canary',
    description: 'edgeflow-docs',
    ready: false
  },
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
  { value: 'qa-sandbox', label: 'qa-sandbox', description: 'ddos', ready: false }
]

const TYPES = [
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

const LIST_FIELDS = {
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

const GENERAL_DESCRIPTION =
  'Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in Firewall rules.'

const SETTINGS_DESCRIPTION =
  'The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it.'

const VISIBLE = 6

const useCreateNetworkList =
  ({ step: initial, choice: chosen, unlocked: open, name }) =>
  () => {
    const current = ref(initial)
    const direction = ref(null)
    const choice = ref(chosen)
    const enableModule = ref(false)
    const query = ref('')
    const form = reactive({ name, type: 'asn', items: '' })
    const errors = reactive({})
    const unlocked = ref(open)

    const moduleMissing = computed(
      () => !!choice.value && !FIREWALLS.find((option) => option.value === choice.value)?.ready
    )

    const definitions = computed(() => [
      {
        value: 'where-it-runs',
        title: 'Where it runs',
        description: 'Select the Firewall whose rules match it. It needs Network Shield on.',
        heading: false,
        fields: []
      },
      ...(moduleMissing.value
        ? [
            {
              value: 'module',
              title: 'Network Shield',
              description: `Off on ${choice.value}.`,
              fields: []
            }
          ]
        : []),
      { value: 'general', title: 'General', description: GENERAL_DESCRIPTION, fields: ['name'] },
      {
        value: 'settings',
        title: 'List settings',
        description: SETTINGS_DESCRIPTION,
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
      definitions.value.map((entry, position) => ({
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

    const listField = computed(() => LIST_FIELDS[form.type])

    const matches = computed(() => {
      const term = query.value.trim().toLowerCase()
      if (!term) return FIREWALLS
      return FIREWALLS.filter((option) =>
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

    const validate = (fields) => {
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

    const choose = (option) => {
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

    return {
      breadcrumb: BREADCRUMB,
      types: TYPES,
      current,
      direction,
      choice,
      enableModule,
      query,
      form,
      errors,
      steps,
      step,
      index,
      isFirst,
      isLast,
      listField,
      matches,
      visible,
      hidden,
      goBack,
      choose,
      skip,
      onSearchEnter,
      commit
    }
  }

const scriptFor = ({ step, choice, unlocked, name }) => [
  ...HEADER_IMPORTS,
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Message from '@aziontech/webkit/message'",
  "import Stepper from '@aziontech/webkit/stepper'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Textarea from '@aziontech/webkit/textarea'",
  "import { computed, reactive, ref } from 'vue'",
  '',
  declare('breadcrumb', BREADCRUMB),
  declare('firewalls', FIREWALLS),
  declare('types', TYPES),
  declare('listFields', LIST_FIELDS),
  '',
  `const VISIBLE = ${VISIBLE}`,
  '',
  `const current = ref('${step}')`,
  'const direction = ref(null)',
  `const choice = ref('${choice}')`,
  'const enableModule = ref(false)',
  "const query = ref('')",
  `const form = reactive({ name: '${name}', type: 'asn', items: '' })`,
  'const errors = reactive({})',
  `const unlocked = ref(${declare('', unlocked).replace('const  = ', '')})`,
  '',
  'const moduleMissing = computed(',
  '  () => !!choice.value && !firewalls.find((option) => option.value === choice.value)?.ready',
  ')',
  '',
  'const definitions = computed(() => [',
  '  {',
  "    value: 'where-it-runs',",
  "    title: 'Where it runs',",
  "    description: 'Select the Firewall whose rules match it. It needs Network Shield on.',",
  '    heading: false,',
  '    fields: []',
  '  },',
  '  ...(moduleMissing.value',
  "    ? [{ value: 'module', title: 'Network Shield', description: 'Off on ' + choice.value + '.', fields: [] }]",
  '    : []),',
  '  {',
  "    value: 'general',",
  "    title: 'General',",
  `    description: '${GENERAL_DESCRIPTION}',`,
  "    fields: ['name']",
  '  },',
  '  {',
  "    value: 'settings',",
  "    title: 'List settings',",
  `    description: '${SETTINGS_DESCRIPTION}',`,
  "    fields: ['type', 'items']",
  '  }',
  '])',
  '',
  'const index = computed(() =>',
  '  Math.max(0, definitions.value.findIndex((entry) => entry.value === current.value))',
  ')',
  'const step = computed(() => definitions.value[index.value])',
  'const isFirst = computed(() => index.value === 0)',
  'const isLast = computed(() => index.value === definitions.value.length - 1)',
  '',
  'const steps = computed(() =>',
  '  definitions.value.map((entry, position) => ({',
  '    value: entry.value,',
  '    title: entry.title,',
  '    description: entry.description,',
  '    state: entry.fields.some((field) => errors[field])',
  "      ? 'error'",
  '      : position < index.value',
  "        ? 'complete'",
  "        : 'upcoming',",
  '    disabled: !unlocked.value.includes(entry.value)',
  '  }))',
  ')',
  '',
  'const listField = computed(() => listFields[form.type])',
  '',
  'const matches = computed(() => {',
  '  const term = query.value.trim().toLowerCase()',
  '  if (!term) return firewalls',
  '  return firewalls.filter((option) =>',
  '    [option.label, option.description].some((field) => field.toLowerCase().includes(term))',
  '  )',
  '})',
  'const visible = computed(() => {',
  '  const head = matches.value.slice(0, VISIBLE)',
  '  if (!choice.value || head.some((option) => option.value === choice.value)) return head',
  '  const picked = matches.value.find((option) => option.value === choice.value)',
  '  return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head',
  '})',
  'const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))',
  '',
  'const validate = (fields) => {',
  '  for (const field of fields) delete errors[field]',
  "  if (fields.includes('name') && !form.name.trim()) {",
  "    errors.name = { kind: 'required', message: 'This field is required.' }",
  '  }',
  "  if (fields.includes('items') && !form.items.trim()) {",
  "    errors.items = { kind: 'required', message: 'This field is required.' }",
  '  }',
  '  return fields.every((field) => !errors[field])',
  '}',
  '',
  'const goNext = () => {',
  '  if (!validate(step.value.fields)) return',
  '  const next = definitions.value[index.value + 1]',
  '  if (!next) return',
  '  if (!unlocked.value.includes(next.value)) unlocked.value.push(next.value)',
  "  direction.value = 'forward'",
  '  current.value = next.value',
  '}',
  '',
  'const goBack = () => {',
  '  const previous = definitions.value[index.value - 1]',
  '  if (!previous) return',
  "  direction.value = 'back'",
  '  current.value = previous.value',
  '}',
  '',
  'const choose = (option) => {',
  '  choice.value = option.value',
  '  enableModule.value = false',
  '  goNext()',
  '}',
  '',
  'const skip = () => {',
  "  choice.value = ''",
  '  enableModule.value = false',
  '  goNext()',
  '}',
  '',
  'const onSearchEnter = () => {',
  '  if (matches.value.length) choose(matches.value[0])',
  '}',
  '',
  'const commit = () => {',
  '  if (!isLast.value) {',
  '    goNext()',
  '    return',
  '  }',
  "  validate(['name', 'type', 'items'])",
  '}'
]

const HOST_ROW_CLASS =
  'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none data-selected:bg-(--bg-selected) motion-reduce:transition-none'

const WHERE_STEP = `<section
  v-if="current === 'where-it-runs'"
  data-wide
  class="mx-auto flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg) data-wide:max-w-(--container-md)"
  aria-labelledby="create-network-list-host-title"
>
  <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
    <span class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
      <i class="ai ai-network-lists text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
    </span>
    <h1 id="create-network-list-host-title" class="text-heading-xs text-(--text-default)">Create Network List</h1>
    <p class="text-body-sm text-(--text-muted)">Choose a firewall to continue</p>
  </header>

  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
    <InputText
      v-model="query"
      size="large"
      class="w-full"
      placeholder="Find firewall…"
      aria-label="Find firewall"
      autocomplete="off"
      @keydown.enter.prevent="onSearchEnter"
    />

    <div class="flex flex-col">
      <button
        v-for="option in visible"
        :key="option.value"
        type="button"
        :aria-pressed="choice === option.value"
        :data-selected="choice === option.value || null"
        class="${HOST_ROW_CLASS}"
        @click="choose(option)"
      >
        <i class="ai ai-edge-firewall shrink-0 text-body-md leading-none text-(--text-muted)" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
          {{ option.label }}
        </span>
        <Tag v-if="!option.ready" label="Network Shield off" severity="warning" size="small" />
        <i
          v-if="choice === option.value"
          class="pi pi-check shrink-0 text-body-sm leading-none text-(--text-default)"
          aria-hidden="true"
        />
      </button>

      <p v-if="hidden" class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
        {{ hidden }} more — type to narrow.
      </p>
      <p v-else-if="!matches.length" class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
        No firewall matches “{{ query.trim() }}”.
      </p>
    </div>
  </div>

  <div class="flex flex-col items-center gap-(--spacing-xxs)">
    <Button type="button" label="Create a firewall" kind="text" size="small" />
    <Button type="button" label="Continue without a firewall" kind="text" size="small" @click="skip" />
  </div>
</section>`

const MODULE_STEP = `<CardBox v-else-if="current === 'module'" :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
      <Message
        severity="warning"
        size="small"
        :label="'A network list is only read through \${network}, and ' + choice + ' has Network Shield off — so nothing reads this one until the module is on.'"
      />

      <FieldSwitchBlock
        v-model="enableModule"
        label="Turn on Network Shield"
        :description="'Sets modules.network_protection on the firewall ' + choice + ' when this network list is created.'"
      />

      <p class="text-body-sm text-(--text-muted)">
        Leaving it off still creates the network list — it simply is not read until someone turns Network Shield on.
      </p>
    </div>
  </template>
</CardBox>`

const fieldMessage = (field) =>
  `<HelperText v-if="errors.${field}" id="create-network-list-${field}-message" :kind="errors.${field}.kind" :label="errors.${field}.message" />`

const GENERAL_STEP = section({
  body: flushCard(
    fieldRow({
      title: 'Name',
      description: 'Give a unique and descriptive name to identify the network list.',
      control: `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  placeholder="office-ranges"
  autocomplete="off"
  :required="errors.name?.kind === 'required'"
  :aria-describedby="errors.name ? 'create-network-list-name-message' : undefined"
  @update:model-value="delete errors.name"
/>`,
      message: fieldMessage('name')
    })
  )
}).replace('<section class', `<section v-else-if="current === 'general'" class`)

const SETTINGS_STEP = section({
  body: flushCard(
    [
      fieldRow({
        title: 'Type',
        kind: 'wide',
        control: `<fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
  <legend class="sr-only">Type</legend>
  <FieldRadioBlock
    v-for="option in types"
    :key="option.value"
    v-model="form.type"
    :value="option.value"
    name="network-lists-type"
    :label="option.label"
    :description="option.description"
  />
</fieldset>`
      }),
      `<Item size="small" class="flex-col items-stretch gap-(--spacing-sm)">
  <Item.Content>
    <Item.Title>{{ listField.label }}</Item.Title>
    <Item.Description>{{ listField.helper }}</Item.Description>
  </Item.Content>
  <Item.Actions class="w-full justify-start">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <Textarea
        v-model="form.items"
        class="w-full"
        :rows="5"
        :aria-label="listField.label"
        :placeholder="listField.placeholder"
        :required="errors.items?.kind === 'required'"
        :aria-describedby="errors.items ? 'create-network-list-items-message' : undefined"
        @update:model-value="delete errors.items"
      />
      ${fieldMessage('items')}
    </div>
  </Item.Actions>
</Item>`
    ].join('\n')
  )
}).replace('<section class', `<section v-else class`)

const HEADING = pageHeading({
  title: '{{ step.title }}',
  description: '{{ step.description }}'
}).replace('<header class', '<header v-if="step.heading !== false" class')

const TEMPLATE = `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
${indent(creationHeader({ backLabel: 'Back to Network Lists' }), 1)}

  <div class="flex min-h-0 flex-1">
${indent(stepRail('Create Network List'), 2)}

    <form class="flex min-w-0 flex-1 flex-col" :aria-label="step.title" novalidate @submit.prevent="commit">
      <main
        :data-direction="direction"
        class="group/main data-[direction=forward]:[--page-enter-distance:calc(var(--layout-boundary-inline)*-1)] animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
      >
        <div class="flex min-h-full flex-col">
          <div class="layout-form-create layout-boundary-inline flex flex-1 flex-col pt-(--layout-section-gap) pb-(--layout-section-gap)">
            <p class="pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">
              Step {{ index + 1 }} of {{ steps.length }}
            </p>

${indent(HEADING, 6)}

            <fieldset
              class="mx-0 flex min-w-0 flex-1 flex-col border-0 p-0 data-headed:mt-(--layout-section-gap)"
              :data-headed="step.heading !== false || null"
            >
              <legend class="sr-only">{{ step.title }}</legend>
${indent(WHERE_STEP, 7)}

${indent(MODULE_STEP, 7)}

${indent(GENERAL_STEP, 7)}

${indent(SETTINGS_STEP, 7)}
            </fieldset>
          </div>
        </div>
      </main>

      <footer class="shrink-0 border-t border-(--border-default) bg-(--bg-surface)">
        <div class="layout-form-create layout-boundary-inline flex items-center justify-between gap-(--spacing-sm) py-(--spacing-md)">
          <Button type="button" label="Cancel" kind="text" size="medium" />
          <div class="flex shrink-0 items-center gap-(--spacing-sm)">
            <Button v-if="!isFirst" type="button" label="Back" kind="outlined" size="medium" @click="goBack" />
            <Button :label="isLast ? 'Create network list' : 'Next'" kind="primary" size="medium" type="submit" />
          </div>
        </div>
      </footer>
    </form>
  </div>
</div>`

const meta = {
  title: 'Templates/Platform/Shell/StepperCreatePage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The page a first-level resource is created on one step at a time: the creation header, a Stepper rail on the left that unlocks each step once it is reached and shows the description of the current one, a form column that opens with the step heading, and a footer bar with Cancel on the left and Back plus Next on the right, Next turning into the create action on the last step. Every create asks first where the resource runs: a centred chooser lists the hosts it can bind to, six at a time with a search, and tags the ones missing a module the resource needs; choosing one with that module off inserts a step that offers to turn it on. The ten generated create pages render it (Domains, Connectors, Custom Pages, Firewall, WAF Rules, Certificate Manager, Network Lists, Data Stream and Object Storage at `<module>/new`), each with its own field steps and an Advanced step when the endpoint has optional settings, and so does Create Function at `/functions/new`, whose Code step is the editor plotted in FunctionEditor. Built from `GlobalHeader`, `Stepper`, `InputText`, `Tag`, `CardBox`, `Message`, `FieldSwitchBlock`, `Item`, `FieldRadioBlock`, `Textarea`, `HelperText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: useCreateNetworkList(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const WhereItRuns = story(
  { step: 'where-it-runs', choice: '', unlocked: ['where-it-runs'], name: '' },
  'Create Network List opening on Where it runs: no step heading, the chooser lists the first six of fourteen firewalls and tags the ones with Network Shield off, and the footer carries only Cancel and Next. Choosing a firewall moves to the next step.'
)

export const ModuleOff = story(
  {
    step: 'module',
    choice: 'edgeflow-staging',
    unlocked: ['where-it-runs', 'module'],
    name: ''
  },
  'edgeflow-staging was chosen with Network Shield off, so a Network Shield step follows Where it runs: a warning Message, the FieldSwitchBlock that turns the module on with the list, and a note on what leaving it off means.'
)

export const ListSettings = story(
  {
    step: 'settings',
    choice: 'edgeflow-production',
    unlocked: ['where-it-runs', 'general', 'settings'],
    name: 'office-ranges'
  },
  'The last step of a list bound to edgeflow-production: the Type as wide FieldRadioBlock rows and the List Textarea whose label, placeholder and guidance follow the type, with Back and Create network list in the footer. Leaving the list empty flags it and marks the step red on the rail.'
)
