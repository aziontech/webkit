import { reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  CREATION_NAMES,
  creationPage,
  itemRow,
  itemSection,
  patternComponents,
  patternImports,
  radioBlocks,
  sectionHeading,
  simulation,
  stickyFooter,
  vueImport,
  withHelper
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'Error validation' }]

const CATALOG = [
  { value: 'origin-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
  { value: 'origin-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
  { value: 'origin-assets', label: 'assets-storage', kind: 'Storage' }
]

const PROTOCOL_USAGE_OPTIONS = [
  {
    value: 'http',
    label: 'HTTP support',
    description: 'Use only the HTTP protocol. Choose from the available HTTP ports.'
  },
  {
    value: 'https',
    label: 'HTTP and HTTPS support',
    description:
      'Use both HTTP and HTTPS protocols. Choose from the available HTTP and HTTPS ports.'
  },
  {
    value: 'http3',
    label: 'HTTP/3 support',
    description:
      'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
  }
]

const HTTP_PORT_OPTIONS = [
  { label: '80 (Default)', value: '80' },
  { label: '8080', value: '8080' },
  { label: '8008', value: '8008' }
]

const FORM = {
  name: 'checkout-web',
  protocolUsage: 'https',
  httpPorts: ['80'],
  compression: true,
  rateLimiting: false,
  imageOptimization: false,
  secondaryCache: false,
  originId: 'origin-web-prod',
  hostHeader: '${host}',
  browserMaxTtl: 0,
  cacheMaxTtl: 60,
  debugRules: false
}

const NO_ERRORS = { name: '', httpPorts: '', originId: '', hostHeader: '' }

const ORIGIN_ERROR =
  'Origin "web-origin-prod" no longer exists — another user deleted it while you were filling in this form, so the service wasn\'t created. Nothing else was lost: reload the origin list and select another one.'

const ALL = CATALOG.map((origin) => origin.value)
const SURVIVING = ALL.filter((value) => value !== 'origin-web-prod')

const SCENARIOS = {
  inSync: {
    serverOrigins: ALL,
    origins: CATALOG,
    originId: 'origin-web-prod',
    errors: NO_ERRORS,
    originError: '',
    deletedByOtherUser: '',
    reloadingOrigins: false
  },
  rejected: {
    serverOrigins: SURVIVING,
    origins: CATALOG,
    originId: 'origin-web-prod',
    errors: { ...NO_ERRORS, originId: 'This origin no longer exists.' },
    originError: ORIGIN_ERROR,
    deletedByOtherUser: 'web-origin-prod',
    reloadingOrigins: false
  },
  reloading: {
    serverOrigins: SURVIVING,
    origins: CATALOG,
    originId: 'origin-web-prod',
    errors: { ...NO_ERRORS, originId: 'This origin no longer exists.' },
    originError: ORIGIN_ERROR,
    deletedByOtherUser: 'web-origin-prod',
    reloadingOrigins: true
  },
  reloaded: {
    serverOrigins: SURVIVING,
    origins: CATALOG.filter((origin) => origin.value !== 'origin-web-prod'),
    originId: '',
    errors: { ...NO_ERRORS, originId: 'Select an origin to continue.' },
    originError: '',
    deletedByOtherUser: 'web-origin-prod',
    reloadingOrigins: false
  }
}

const NAMES = [
  ...CREATION_NAMES,
  'Button',
  'CardBox',
  'FieldRadioBlock',
  'HelperText',
  'InputNumber',
  'InputText',
  'Item',
  'Message',
  'MultiSelect',
  'Select',
  'Skeleton',
  'Switch',
  'Tag'
]

const setupFor = (scenario) => () => {
  const serverOrigins = ref([...scenario.serverOrigins])
  const origins = ref([...scenario.origins])
  const originLabel = (value) =>
    origins.value.find((origin) => origin.value === value)?.label ?? ''
  const portsLabel = (values) =>
    (values ?? [])
      .map((value) => HTTP_PORT_OPTIONS.find((option) => option.value === value)?.label ?? value)
      .join(', ')
  const form = reactive({ ...structuredClone(FORM), originId: scenario.originId })
  const errors = reactive({ ...scenario.errors })
  const originError = ref(scenario.originError)
  const submitting = ref(false)
  const reloadingOrigins = ref(scenario.reloadingOrigins)
  const deletedByOtherUser = ref(scenario.deletedByOtherUser)

  const simulateDelete = () => {
    const target =
      origins.value.find((origin) => origin.value === form.originId) ??
      origins.value[0]
    if (!target) return
    serverOrigins.value = serverOrigins.value.filter((value) => value !== target.value)
    deletedByOtherUser.value = target.label
  }

  const resetScenario = () => {
    serverOrigins.value = CATALOG.map((origin) => origin.value)
    origins.value = [...CATALOG]
    deletedByOtherUser.value = ''
    form.name = 'checkout-web'
    form.originId = 'origin-web-prod'
    form.hostHeader = '${host}'
    originError.value = ''
    errors.name = ''
    errors.httpPorts = ''
    errors.originId = ''
    errors.hostHeader = ''
  }

  const reloadOrigins = () => {
    if (reloadingOrigins.value) return
    reloadingOrigins.value = true
    setTimeout(() => {
      origins.value = CATALOG.filter((origin) =>
        serverOrigins.value.includes(origin.value)
      )
      if (!serverOrigins.value.includes(form.originId)) {
        form.originId = ''
        errors.originId = 'Select an origin to continue.'
      }
      originError.value = ''
      reloadingOrigins.value = false
    }, 800)
  }

  const onOriginChange = () => {
    errors.originId = ''
    originError.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.originId = form.originId ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.originId && !errors.hostHeader
  }

  const submit = () => {
    if (submitting.value || reloadingOrigins.value) return
    originError.value = ''
    if (!validate()) return
    if (!serverOrigins.value.includes(form.originId)) {
      originError.value = `Origin "${originLabel(form.originId)}" no longer exists — another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
      errors.originId = 'This origin no longer exists.'
    }
  }

  return {
    breadcrumb: BREADCRUMB,
    origins,
    originLabel,
    protocolUsageOptions: PROTOCOL_USAGE_OPTIONS,
    httpPortOptions: HTTP_PORT_OPTIONS,
    portsLabel,
    form,
    errors,
    originError,
    submitting,
    reloadingOrigins,
    deletedByOtherUser,
    simulateDelete,
    resetScenario,
    reloadOrigins,
    onOriginChange,
    submit
  }
}

const LOGIC = `const originLabel = (value) =>
  origins.value.find((origin) => origin.value === value)?.label ?? ''

const portsLabel = (values) =>
  (values ?? [])
    .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
    .join(', ')

const simulateDelete = () => {
  const target =
    origins.value.find((origin) => origin.value === form.originId) ??
    origins.value[0]
  if (!target) return
  serverOrigins.value = serverOrigins.value.filter((value) => value !== target.value)
  deletedByOtherUser.value = target.label
}

const resetScenario = () => {
  serverOrigins.value = catalog.map((origin) => origin.value)
  origins.value = [...catalog]
  deletedByOtherUser.value = ''
  form.name = 'checkout-web'
  form.originId = 'origin-web-prod'
  form.hostHeader = '\${host}'
  originError.value = ''
  errors.name = ''
  errors.httpPorts = ''
  errors.originId = ''
  errors.hostHeader = ''
}

const reloadOrigins = () => {
  if (reloadingOrigins.value) return
  reloadingOrigins.value = true
  setTimeout(() => {
    origins.value = catalog.filter((origin) =>
      serverOrigins.value.includes(origin.value)
    )
    if (!serverOrigins.value.includes(form.originId)) {
      form.originId = ''
      errors.originId = 'Select an origin to continue.'
    }
    originError.value = ''
    reloadingOrigins.value = false
  }, 800)
}

const onOriginChange = () => {
  errors.originId = ''
  originError.value = ''
}

const validate = () => {
  errors.name = form.name.trim() ? '' : 'This field is required.'
  errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
  errors.originId = form.originId ? '' : 'This field is required.'
  errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
  return !errors.name && !errors.httpPorts && !errors.originId && !errors.hostHeader
}

const submit = () => {
  if (submitting.value || reloadingOrigins.value) return
  originError.value = ''
  if (!validate()) return
  if (!serverOrigins.value.includes(form.originId)) {
    originError.value = \`Origin "\${originLabel(form.originId)}" no longer exists — another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.\`
    errors.originId = 'This origin no longer exists.'
  }
}`.split('\n')

const scriptFor = (scenario) => [
  ...patternImports(NAMES),
  vueImport(['reactive', 'ref']),
  '',
  declare('breadcrumb', BREADCRUMB),
  '',
  declare('catalog', CATALOG),
  declare('protocolUsageOptions', PROTOCOL_USAGE_OPTIONS),
  declare('httpPortOptions', HTTP_PORT_OPTIONS),
  '',
  declare('serverOrigins', scenario.serverOrigins, 'ref'),
  declare('origins', scenario.origins, 'ref'),
  declare('form', { ...FORM, originId: scenario.originId }, 'reactive'),
  declare('errors', scenario.errors, 'reactive'),
  declare('originError', scenario.originError, 'ref'),
  'const submitting = ref(false)',
  `const reloadingOrigins = ref(${scenario.reloadingOrigins})`,
  declare('deletedByOtherUser', scenario.deletedByOtherUser, 'ref'),
  '',
  ...LOGIC
]

const SIMULATION = simulation({
  extra: '',
  label: 'Simulation — the other user',
  tag: `<Tag
  :label="deletedByOtherUser ? \`Deleted server-side: \${deletedByOtherUser}\` : 'Server in sync'"
  :severity="deletedByOtherUser ? 'danger' : 'success'"
  size="medium"
/>`,
  copy: `You are User 1: the service below is filled in and already linked to an origin,
four sections down. Have User 2 delete that origin through the API — nothing will
tell you, your copy of the list just goes stale. Then press Save, and watch the form
take you to the one section that needs you.`,
  actions: `<Button
  label="User 2 deletes the linked origin"
  kind="outlined"
  size="medium"
  icon="pi pi-trash"
  :disabled="!!deletedByOtherUser || submitting"
  @click="simulateDelete"
/>
<Button
  label="Reset scenario"
  kind="text"
  size="medium"
  :disabled="submitting"
  @click="resetScenario"
/>`
})

const NAME_FIELD = withHelper(
  `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  placeholder="My Service"
  :required="!!errors.name"
  :aria-describedby="errors.name ? 'ev-name-error' : undefined"
  :disabled="submitting"
  @update:model-value="errors.name = ''"
/>`,
  `<HelperText
  v-if="errors.name"
  id="ev-name-error"
  kind="required"
  :label="errors.name"
/>`
)

const HTTP_PORTS = withHelper(
  `<MultiSelect
  v-model="form.httpPorts"
  size="large"
  class="w-full"
  placeholder="Select ports"
  :required="!!errors.httpPorts"
  :display-value="portsLabel"
  :disabled="submitting"
  @update:model-value="errors.httpPorts = ''"
>
  <MultiSelect.Trigger
    id="ev-httpPorts"
    aria-label="HTTP ports"
    :aria-describedby="errors.httpPorts ? 'ev-httpPorts-error' : undefined"
  />
  <MultiSelect.Content>
    <MultiSelect.Option
      v-for="option in httpPortOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </MultiSelect.Option>
  </MultiSelect.Content>
</MultiSelect>`,
  `<HelperText
  v-if="errors.httpPorts"
  id="ev-httpPorts-error"
  kind="required"
  :label="errors.httpPorts"
/>`
)

const moduleRow = (title, description, model) =>
  itemRow({
    title,
    description,
    compact: true,
    control: `<Switch
  v-model="form.${model}"
  aria-label="${title}"
  :disabled="submitting"
/>`
  })

const ORIGIN_MESSAGE = `<Transition
  enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
  enter-from-class="translate-y-2 opacity-0"
  enter-to-class="translate-y-0 opacity-100"
  leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
  leave-from-class="translate-y-0 opacity-100"
  leave-to-class="-translate-y-2 opacity-0"
>
  <div v-if="originError">
    <Message
      severity="danger"
      :label="originError"
    >
      <template #action>
        <Button
          label="Reload origins"
          kind="secondary"
          size="medium"
          :loading="reloadingOrigins"
          @click="reloadOrigins"
        />
      </template>
    </Message>
  </div>
</Transition>`

const ORIGIN_FIELD = `<div class="flex w-full flex-col gap-(--spacing-xs)">
  <Skeleton
    v-if="reloadingOrigins"
    kind="shape"
    width="100%"
    height="40px"
    aria-label="Loading origins"
  />
  <template v-else>
    <Select
      v-model="form.originId"
      size="large"
      class="w-full"
      placeholder="Select an origin"
      :display-value="originLabel"
      :required="!!errors.originId && !form.originId"
      :invalid="!!errors.originId && !!form.originId"
      :disabled="submitting"
      @update:model-value="onOriginChange"
    >
      <Select.Trigger
        id="ev-origin"
        aria-label="Origin"
        :aria-describedby="errors.originId ? 'ev-origin-error' : undefined"
      />
      <Select.Content>
        <Select.Option
          v-for="origin in origins"
          :key="origin.value"
          :value="origin.value"
        >
          {{ origin.label }}
        </Select.Option>
      </Select.Content>
    </Select>
    <HelperText
      v-if="errors.originId"
      id="ev-origin-error"
      :kind="form.originId ? 'invalid' : 'required'"
      :label="errors.originId"
    />
  </template>
</div>`

const HOST_HEADER_FIELD = withHelper(
  `<InputText
  v-model="form.hostHeader"
  size="large"
  class="w-full"
  aria-label="Host header"
  :required="!!errors.hostHeader"
  :aria-describedby="errors.hostHeader ? 'ev-hostHeader-error' : undefined"
  :disabled="submitting"
  @update:model-value="errors.hostHeader = ''"
/>`,
  `<HelperText
  v-if="errors.hostHeader"
  id="ev-hostHeader-error"
  kind="required"
  :label="errors.hostHeader"
/>`
)

const ttlInput = (model, label) => `<InputNumber
  v-model="${model}"
  size="large"
  class="w-full"
  :min="0"
  :disabled="submitting"
  aria-label="${label}"
/>`

const SECTIONS = [
  itemSection({
    heading: sectionHeading('General'),
    start: false,
    rows: [
      itemRow({
        title: 'Name',
        description: 'Give a unique and descriptive name to identify the service.',
        control: NAME_FIELD
      })
    ]
  }),
  itemSection({
    heading: sectionHeading('Delivery Settings'),
    rows: [
      itemRow({
        title: 'Protocol Usage',
        start: true,
        control: radioBlocks({
          legend: 'Protocol Usage',
          options: 'protocolUsageOptions',
          model: 'form.protocolUsage',
          name: 'protocolUsage',
          prefix: 'ev',
          disabled: 'submitting'
        })
      }),
      itemRow({
        title: 'HTTP ports',
        description: 'The ports the service listens on for HTTP traffic.',
        control: HTTP_PORTS
      })
    ]
  }),
  itemSection({
    heading: sectionHeading('Features'),
    rows: [
      moduleRow(
        'Compression',
        'Compress responses with gzip or Brotli before they are sent.',
        'compression'
      ),
      moduleRow(
        'Rate limiting',
        'Limit how many requests a single client can send per minute.',
        'rateLimiting'
      ),
      moduleRow(
        'Image optimization',
        'Resize, crop, and convert images on the fly through URL parameters.',
        'imageOptimization'
      ),
      moduleRow(
        'Secondary cache',
        'Add a second caching layer to reduce requests to the origin.',
        'secondaryCache'
      )
    ]
  }),
  itemSection({
    heading: sectionHeading('Origin', ORIGIN_MESSAGE),
    rows: [
      itemRow({
        title: 'Origin',
        description:
          'The origin that serves this service’s content. Origins are shared across the account, so anyone on it can change one.',
        control: ORIGIN_FIELD
      }),
      itemRow({
        title: 'Host header',
        description: 'Identify a virtualhost sent in the Host header to the origin.',
        control: HOST_HEADER_FIELD
      })
    ]
  }),
  itemSection({
    heading: sectionHeading('Cache expiration policies'),
    rows: [
      itemRow({
        title: 'Browser Maximum TTL (seconds)',
        description: 'How long browsers may keep a cached response.',
        control: ttlInput('form.browserMaxTtl', 'Browser maximum TTL in seconds')
      }),
      itemRow({
        title: 'Cache Maximum TTL (seconds)',
        description:
          'How long the cache may keep a response. A secondary cache requires a TTL of at least 3 seconds.',
        control: ttlInput('form.cacheMaxTtl', 'Cache maximum TTL in seconds')
      })
    ]
  }),
  itemSection({
    heading: sectionHeading('Debug Rules'),
    rows: [
      itemRow({
        title: 'Active',
        description:
          'Rules that were successfully executed will be listed in the request logs and in the trace of each event.',
        compact: true,
        control: `<Switch
  v-model="form.debugRules"
  aria-label="Active"
  :disabled="submitting"
/>`
      })
    ]
  })
]

const TEMPLATE = creationPage({
  backLabel: 'Back to Forms',
  main: `<main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
  <form
    class="flex min-h-full flex-col"
    aria-label="Create Service"
    novalidate
    @submit.prevent="submit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
${indent(SIMULATION, 3)}

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Create service</legend>

${indent(SECTIONS.join('\n\n'), 4)}
      </fieldset>
    </div>

${indent(
  stickyFooter({
    zIndex: true,
    cancelDisabled: 'submitting',
    loading: 'submitting',
    extra: [':disabled="reloadingOrigins"'],
    submit: 'type="submit"'
  }),
  2
)}
  </form>
</main>`
})

const components = patternComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/ServerValidation',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Where a rejected save renders: a Create Service page whose linked origin is deleted by another user while the form is open. The API rejects the save with a field-scoped error, so it lands as a danger `Message` under the Origin section heading, the section that owns the broken reference, carrying Reload origins, while the Origin select takes the invalid state. Never a toast, never a validation summary. A dashed simulation panel above the form plays the other user. Same page anatomy as the in-page create form (CreateFormPage): the creation header, section headings over flush `CardBox` groups of `Item` rows, and a sticky footer, here raised with `z-10`. Built from `GlobalHeader`, `IconButton`, `Breadcrumb`, `Avatar`, `Tag`, `CardBox`, `Item`, `InputText`, `MultiSelect`, `Select`, `FieldRadioBlock`, `Switch`, `InputNumber`, `Skeleton`, `Message`, `HelperText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const InSync = {
  render: () => ({ components, setup: setupFor(SCENARIOS.inSync), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Before anything goes wrong: the form is filled in and linked to web-origin-prod, the simulation reads Server in sync, and Save would go through.'
      },
      source: { code: toSfc(scriptFor(SCENARIOS.inSync), TEMPLATE) }
    }
  }
}

export const Rejected = {
  render: () => ({ components, setup: setupFor(SCENARIOS.rejected), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'User 2 deleted web-origin-prod and Save was pressed: the danger Message opens under the Origin heading with Reload origins, and the Origin select reads This origin no longer exists.'
      },
      source: { code: toSfc(scriptFor(SCENARIOS.rejected), TEMPLATE) }
    }
  }
}

export const Reloading = {
  render: () => ({ components, setup: setupFor(SCENARIOS.reloading), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Reload origins in flight: its button shows the loading state, the Origin select gives way to a Skeleton, and Save is disabled until the list is back.'
      },
      source: { code: toSfc(scriptFor(SCENARIOS.reloading), TEMPLATE) }
    }
  }
}

export const Reloaded = {
  render: () => ({ components, setup: setupFor(SCENARIOS.reloaded), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The list is reloaded without the deleted origin: the Message closes, the select is cleared and flagged required with Select an origin to continue.'
      },
      source: { code: toSfc(scriptFor(SCENARIOS.reloaded), TEMPLATE) }
    }
  }
}
