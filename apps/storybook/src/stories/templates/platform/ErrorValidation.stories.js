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
  { value: 'conn-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
  { value: 'conn-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
  { value: 'conn-assets', label: 'assets-bucket', kind: 'Object Storage' }
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
  applicationAccelerator: true,
  edgeFunctions: false,
  imageProcessor: false,
  tieredCache: false,
  connectorId: 'conn-web-prod',
  hostHeader: '${host}',
  browserMaxTtl: 0,
  edgeMaxTtl: 60,
  debugRules: false
}

const NO_ERRORS = { name: '', httpPorts: '', connectorId: '', hostHeader: '' }

const ORIGIN_ERROR =
  'Connector "web-origin-prod" no longer exists — another user deleted it while you were filling in this form, so the Application wasn\'t created. Nothing else was lost: reload the connector list and select another one.'

const ALL = CATALOG.map((connector) => connector.value)
const SURVIVING = ALL.filter((value) => value !== 'conn-web-prod')

const SCENARIOS = {
  inSync: {
    serverConnectors: ALL,
    connectors: CATALOG,
    connectorId: 'conn-web-prod',
    errors: NO_ERRORS,
    originError: '',
    deletedByOtherUser: '',
    reloadingConnectors: false
  },
  rejected: {
    serverConnectors: SURVIVING,
    connectors: CATALOG,
    connectorId: 'conn-web-prod',
    errors: { ...NO_ERRORS, connectorId: 'This connector no longer exists.' },
    originError: ORIGIN_ERROR,
    deletedByOtherUser: 'web-origin-prod',
    reloadingConnectors: false
  },
  reloading: {
    serverConnectors: SURVIVING,
    connectors: CATALOG,
    connectorId: 'conn-web-prod',
    errors: { ...NO_ERRORS, connectorId: 'This connector no longer exists.' },
    originError: ORIGIN_ERROR,
    deletedByOtherUser: 'web-origin-prod',
    reloadingConnectors: true
  },
  reloaded: {
    serverConnectors: SURVIVING,
    connectors: CATALOG.filter((connector) => connector.value !== 'conn-web-prod'),
    connectorId: '',
    errors: { ...NO_ERRORS, connectorId: 'Select a connector to continue.' },
    originError: '',
    deletedByOtherUser: 'web-origin-prod',
    reloadingConnectors: false
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
  const serverConnectors = ref([...scenario.serverConnectors])
  const connectors = ref([...scenario.connectors])
  const connectorLabel = (value) =>
    connectors.value.find((connector) => connector.value === value)?.label ?? ''
  const portsLabel = (values) =>
    (values ?? [])
      .map((value) => HTTP_PORT_OPTIONS.find((option) => option.value === value)?.label ?? value)
      .join(', ')
  const form = reactive({ ...structuredClone(FORM), connectorId: scenario.connectorId })
  const errors = reactive({ ...scenario.errors })
  const originError = ref(scenario.originError)
  const submitting = ref(false)
  const reloadingConnectors = ref(scenario.reloadingConnectors)
  const deletedByOtherUser = ref(scenario.deletedByOtherUser)

  const simulateDelete = () => {
    const target =
      connectors.value.find((connector) => connector.value === form.connectorId) ??
      connectors.value[0]
    if (!target) return
    serverConnectors.value = serverConnectors.value.filter((value) => value !== target.value)
    deletedByOtherUser.value = target.label
  }

  const resetScenario = () => {
    serverConnectors.value = CATALOG.map((connector) => connector.value)
    connectors.value = [...CATALOG]
    deletedByOtherUser.value = ''
    form.name = 'checkout-web'
    form.connectorId = 'conn-web-prod'
    form.hostHeader = '${host}'
    originError.value = ''
    errors.name = ''
    errors.httpPorts = ''
    errors.connectorId = ''
    errors.hostHeader = ''
  }

  const reloadConnectors = () => {
    if (reloadingConnectors.value) return
    reloadingConnectors.value = true
    setTimeout(() => {
      connectors.value = CATALOG.filter((connector) =>
        serverConnectors.value.includes(connector.value)
      )
      if (!serverConnectors.value.includes(form.connectorId)) {
        form.connectorId = ''
        errors.connectorId = 'Select a connector to continue.'
      }
      originError.value = ''
      reloadingConnectors.value = false
    }, 800)
  }

  const onConnectorChange = () => {
    errors.connectorId = ''
    originError.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.connectorId = form.connectorId ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.connectorId && !errors.hostHeader
  }

  const submit = () => {
    if (submitting.value || reloadingConnectors.value) return
    originError.value = ''
    if (!validate()) return
    if (!serverConnectors.value.includes(form.connectorId)) {
      originError.value = `Connector "${connectorLabel(form.connectorId)}" no longer exists — another user deleted it while you were filling in this form, so the Application wasn't created. Nothing else was lost: reload the connector list and select another one.`
      errors.connectorId = 'This connector no longer exists.'
    }
  }

  return {
    breadcrumb: BREADCRUMB,
    connectors,
    connectorLabel,
    protocolUsageOptions: PROTOCOL_USAGE_OPTIONS,
    httpPortOptions: HTTP_PORT_OPTIONS,
    portsLabel,
    form,
    errors,
    originError,
    submitting,
    reloadingConnectors,
    deletedByOtherUser,
    simulateDelete,
    resetScenario,
    reloadConnectors,
    onConnectorChange,
    submit
  }
}

const LOGIC = `const connectorLabel = (value) =>
  connectors.value.find((connector) => connector.value === value)?.label ?? ''

const portsLabel = (values) =>
  (values ?? [])
    .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
    .join(', ')

const simulateDelete = () => {
  const target =
    connectors.value.find((connector) => connector.value === form.connectorId) ??
    connectors.value[0]
  if (!target) return
  serverConnectors.value = serverConnectors.value.filter((value) => value !== target.value)
  deletedByOtherUser.value = target.label
}

const resetScenario = () => {
  serverConnectors.value = catalog.map((connector) => connector.value)
  connectors.value = [...catalog]
  deletedByOtherUser.value = ''
  form.name = 'checkout-web'
  form.connectorId = 'conn-web-prod'
  form.hostHeader = '\${host}'
  originError.value = ''
  errors.name = ''
  errors.httpPorts = ''
  errors.connectorId = ''
  errors.hostHeader = ''
}

const reloadConnectors = () => {
  if (reloadingConnectors.value) return
  reloadingConnectors.value = true
  setTimeout(() => {
    connectors.value = catalog.filter((connector) =>
      serverConnectors.value.includes(connector.value)
    )
    if (!serverConnectors.value.includes(form.connectorId)) {
      form.connectorId = ''
      errors.connectorId = 'Select a connector to continue.'
    }
    originError.value = ''
    reloadingConnectors.value = false
  }, 800)
}

const onConnectorChange = () => {
  errors.connectorId = ''
  originError.value = ''
}

const validate = () => {
  errors.name = form.name.trim() ? '' : 'This field is required.'
  errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
  errors.connectorId = form.connectorId ? '' : 'This field is required.'
  errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
  return !errors.name && !errors.httpPorts && !errors.connectorId && !errors.hostHeader
}

const submit = () => {
  if (submitting.value || reloadingConnectors.value) return
  originError.value = ''
  if (!validate()) return
  if (!serverConnectors.value.includes(form.connectorId)) {
    originError.value = \`Connector "\${connectorLabel(form.connectorId)}" no longer exists — another user deleted it while you were filling in this form, so the Application wasn't created. Nothing else was lost: reload the connector list and select another one.\`
    errors.connectorId = 'This connector no longer exists.'
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
  declare('serverConnectors', scenario.serverConnectors, 'ref'),
  declare('connectors', scenario.connectors, 'ref'),
  declare('form', { ...FORM, connectorId: scenario.connectorId }, 'reactive'),
  declare('errors', scenario.errors, 'reactive'),
  declare('originError', scenario.originError, 'ref'),
  'const submitting = ref(false)',
  `const reloadingConnectors = ref(${scenario.reloadingConnectors})`,
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
  copy: `You are User 1: the Application below is filled in and already linked to a Connector,
four sections down. Have User 2 delete that Connector through the API — nothing will
tell you, your copy of the list just goes stale. Then press Save, and watch the form
take you to the one section that needs you.`,
  actions: `<Button
  label="User 2 deletes the linked Connector"
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
  placeholder="My Application"
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
          label="Reload connectors"
          kind="secondary"
          size="medium"
          :loading="reloadingConnectors"
          @click="reloadConnectors"
        />
      </template>
    </Message>
  </div>
</Transition>`

const CONNECTOR_FIELD = `<div class="flex w-full flex-col gap-(--spacing-xs)">
  <Skeleton
    v-if="reloadingConnectors"
    kind="shape"
    width="100%"
    height="40px"
    aria-label="Loading connectors"
  />
  <template v-else>
    <Select
      v-model="form.connectorId"
      size="large"
      class="w-full"
      placeholder="Select a connector"
      :display-value="connectorLabel"
      :required="!!errors.connectorId && !form.connectorId"
      :invalid="!!errors.connectorId && !!form.connectorId"
      :disabled="submitting"
      @update:model-value="onConnectorChange"
    >
      <Select.Trigger
        id="ev-connector"
        aria-label="Connector"
        :aria-describedby="errors.connectorId ? 'ev-connector-error' : undefined"
      />
      <Select.Content>
        <Select.Option
          v-for="connector in connectors"
          :key="connector.value"
          :value="connector.value"
        >
          {{ connector.label }}
        </Select.Option>
      </Select.Content>
    </Select>
    <HelperText
      v-if="errors.connectorId"
      id="ev-connector-error"
      :kind="form.connectorId ? 'invalid' : 'required'"
      :label="errors.connectorId"
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
        description: 'Give a unique and descriptive name to identify the Application.',
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
        description: 'The ports the Application listens on for HTTP traffic.',
        control: HTTP_PORTS
      })
    ]
  }),
  itemSection({
    heading: sectionHeading('Modules'),
    rows: [
      moduleRow(
        'Application Accelerator',
        'Optimize the delivery of dynamic content and enable advanced caching rules.',
        'applicationAccelerator'
      ),
      moduleRow(
        'Edge Functions',
        'Run serverless functions at the edge, closer to your users.',
        'edgeFunctions'
      ),
      moduleRow(
        'Image Processor',
        'Resize, crop, and convert images on the fly through URL parameters.',
        'imageProcessor'
      ),
      moduleRow(
        'Tiered Cache',
        'Add a second caching layer to reduce requests to the origin.',
        'tieredCache'
      )
    ]
  }),
  itemSection({
    heading: sectionHeading('Origin', ORIGIN_MESSAGE),
    rows: [
      itemRow({
        title: 'Connector',
        description:
          "The Edge Connector that serves this Application's content. Lives in the Connectors module, so anyone on the account can change it.",
        control: CONNECTOR_FIELD
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
        title: 'Edge Maximum TTL (seconds)',
        description:
          'How long the edge may keep a cached response. Tiered Cache requires a TTL of at least 3 seconds.',
        control: ttlInput('form.edgeMaxTtl', 'Edge maximum TTL in seconds')
      })
    ]
  }),
  itemSection({
    heading: sectionHeading('Debug Rules'),
    rows: [
      itemRow({
        title: 'Active',
        description:
          'Rules that were successfully executed will be shown under the $traceback field in Data Streaming and Real-Time Events or the $stacktrace variable in GraphQL.',
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
    aria-label="Create Application"
    novalidate
    @submit.prevent="submit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
${indent(SIMULATION, 3)}

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Create application</legend>

${indent(SECTIONS.join('\n\n'), 4)}
      </fieldset>
    </div>

${indent(
  stickyFooter({
    zIndex: true,
    cancelDisabled: 'submitting',
    loading: 'submitting',
    extra: [':disabled="reloadingConnectors"'],
    submit: 'type="submit"'
  }),
  2
)}
  </form>
</main>`
})

const components = patternComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/ErrorValidation',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Where a rejected save renders, from the forms lab (Error validation, `/forms/error-validation`): a Create Application page whose linked Connector is deleted by another user while the form is open. The API rejects the save with a field-scoped error, so it lands as a danger `Message` under the Origin section heading, the section that owns the broken reference, carrying Reload connectors, while the Connector select takes the invalid state. Never a toast, never a validation summary. A dashed simulation panel above the form plays the other user. Same page anatomy as In Page create: the creation header, section headings over flush `CardBox` groups of `Item` rows, and a sticky footer, here raised with `z-10`. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `Tag`, `CardBox`, `Item`, `InputText`, `MultiSelect`, `Select`, `FieldRadioBlock`, `Switch`, `InputNumber`, `Skeleton`, `Message`, `HelperText` and `Button`.'
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
          'User 2 deleted web-origin-prod and Save was pressed: the danger Message opens under the Origin heading with Reload connectors, and the Connector select reads This connector no longer exists.'
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
          'Reload connectors in flight: its button shows the loading state, the Connector select gives way to a Skeleton, and Save is disabled until the list is back.'
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
          'The list is reloaded without the deleted connector: the Message closes, the select is cleared and flagged required with Select a connector to continue.'
      },
      source: { code: toSfc(scriptFor(SCENARIOS.reloaded), TEMPLATE) }
    }
  }
}
