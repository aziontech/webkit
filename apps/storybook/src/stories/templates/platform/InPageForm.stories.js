import { computed, reactive, ref } from 'vue'

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
  sectionLabel,
  stickyFooter,
  vueImport,
  withHelper
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'In Page create' }]

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

const HTTPS_PORT_OPTIONS = [
  { label: '443 (Default)', value: '443' },
  { label: '8443', value: '8443' }
]

const PROTOCOL_POLICY_OPTIONS = [
  { value: 'preserve', label: 'Preserve HTTP/HTTPS' },
  { value: 'http', label: 'Enforce HTTP' },
  { value: 'https', label: 'Enforce HTTPS' }
]

const BROWSER_CACHE_OPTIONS = [
  { value: 'override', label: 'Override cache settings' },
  {
    value: 'honor',
    label: 'Honor cache policies',
    description:
      'Honor cache policies from the origin or define a new maximum cache TTL for browsers.'
  }
]

const EDGE_CACHE_OPTIONS = [
  { value: 'override', label: 'Override cache settings' },
  {
    value: 'honor',
    label: 'Honor cache policies',
    description:
      "Honor cache policies from the origin or define a new maximum cache TTL for the edge. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
  }
]

const FORM = {
  name: '',
  protocolUsage: 'http',
  httpPorts: ['80'],
  httpsPorts: ['443'],
  protocolPolicy: 'preserve',
  address: '',
  hostHeader: '${host}',
  browserCache: 'override',
  browserMaxTtl: 0,
  edgeCache: 'override',
  edgeMaxTtl: 60,
  debugRules: false
}

const NO_ERRORS = { name: '', httpPorts: '', address: '', hostHeader: '' }

const SUBMITTED_ERRORS = {
  name: 'This field is required.',
  httpPorts: '',
  address: 'This field is required.',
  hostHeader: ''
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
  'MultiSelect',
  'Switch'
]

const portsLabel = (list) => (values) =>
  (values ?? [])
    .map((value) => list.find((option) => option.value === value)?.label ?? value)
    .join(', ')

const setupFor = (initialErrors) => () => {
  const form = reactive(structuredClone(FORM))
  const errors = reactive({ ...initialErrors })
  const submitting = ref(false)
  const httpsEnabled = computed(() => form.protocolUsage !== 'http')
  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.address = form.address.trim() ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader
  }
  return {
    breadcrumb: BREADCRUMB,
    protocolUsageOptions: PROTOCOL_USAGE_OPTIONS,
    httpPortOptions: HTTP_PORT_OPTIONS,
    httpsPortOptions: HTTPS_PORT_OPTIONS,
    protocolPolicyOptions: PROTOCOL_POLICY_OPTIONS,
    browserCacheOptions: BROWSER_CACHE_OPTIONS,
    edgeCacheOptions: EDGE_CACHE_OPTIONS,
    portsLabel,
    form,
    errors,
    submitting,
    httpsEnabled,
    submit: () => validate()
  }
}

const scriptFor = (initialErrors) => [
  ...patternImports(NAMES),
  vueImport(['computed', 'reactive', 'ref']),
  '',
  declare('breadcrumb', BREADCRUMB),
  '',
  declare('protocolUsageOptions', PROTOCOL_USAGE_OPTIONS),
  declare('httpPortOptions', HTTP_PORT_OPTIONS),
  declare('httpsPortOptions', HTTPS_PORT_OPTIONS),
  declare('protocolPolicyOptions', PROTOCOL_POLICY_OPTIONS),
  declare('browserCacheOptions', BROWSER_CACHE_OPTIONS),
  declare('edgeCacheOptions', EDGE_CACHE_OPTIONS),
  '',
  'const portsLabel = (list) => (values) =>',
  '  (values ?? [])',
  '    .map((value) => list.find((option) => option.value === value)?.label ?? value)',
  "    .join(', ')",
  '',
  declare('form', FORM, 'reactive'),
  "const httpsEnabled = computed(() => form.protocolUsage !== 'http')",
  declare('errors', initialErrors, 'reactive'),
  'const submitting = ref(false)',
  '',
  'const validate = () => {',
  "  errors.name = form.name.trim() ? '' : 'This field is required.'",
  "  errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'",
  "  errors.address = form.address.trim() ? '' : 'This field is required.'",
  "  errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'",
  '  return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader',
  '}',
  '',
  'const submit = () => validate()'
]

const requiredText = ({ model, label, id, error, placeholder = '' }) =>
  withHelper(
    `<InputText
  v-model="${model}"
  size="large"
  class="w-full"
  aria-label="${label}"${placeholder ? `\n  placeholder="${placeholder}"` : ''}
  :required="!!${error}"
  :aria-describedby="${error} ? '${id}' : undefined"
  @update:model-value="${error} = ''"
/>`,
    `<HelperText
  v-if="${error}"
  id="${id}"
  kind="required"
  :label="${error}"
/>`
  )

const HTTP_PORTS = withHelper(
  `<MultiSelect
  v-model="form.httpPorts"
  size="large"
  class="w-full"
  placeholder="Select ports"
  :required="!!errors.httpPorts"
  :display-value="portsLabel(httpPortOptions)"
  @update:model-value="errors.httpPorts = ''"
>
  <MultiSelect.Trigger
    id="app-httpPorts"
    aria-label="HTTP ports"
    :aria-describedby="errors.httpPorts ? 'app-httpPorts-error' : undefined"
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
  id="app-httpPorts-error"
  kind="required"
  :label="errors.httpPorts"
/>`
)

const HTTPS_PORTS = `<MultiSelect
  v-model="form.httpsPorts"
  size="large"
  class="w-full"
  placeholder="443 (Default)"
  :disabled="!httpsEnabled"
  :display-value="portsLabel(httpsPortOptions)"
>
  <MultiSelect.Trigger aria-label="HTTPS ports" />
  <MultiSelect.Content>
    <MultiSelect.Option
      v-for="option in httpsPortOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </MultiSelect.Option>
  </MultiSelect.Content>
</MultiSelect>`

const ttlInput = (model, label) => `<InputNumber
  v-model="${model}"
  size="large"
  class="w-full"
  :min="0"
  aria-label="${label}"
/>`

const SECTIONS = [
  itemSection({
    heading: sectionLabel('General'),
    start: false,
    rows: [
      itemRow({
        title: 'Name',
        description: 'Give a unique and descriptive name to identify the Application.',
        control: requiredText({
          model: 'form.name',
          label: 'Name',
          id: 'app-name-error',
          error: 'errors.name',
          placeholder: 'My Application'
        })
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Delivery Settings'),
    rows: [
      itemRow({
        title: 'Protocol Usage',
        start: true,
        control: radioBlocks({
          legend: 'Protocol Usage',
          options: 'protocolUsageOptions',
          model: 'form.protocolUsage',
          name: 'protocolUsage',
          prefix: 'app'
        })
      }),
      itemRow({ title: 'HTTP ports', control: HTTP_PORTS }),
      itemRow({
        title: 'HTTPS ports',
        description: 'Applies when the Application serves HTTPS traffic.',
        control: HTTPS_PORTS
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Origins'),
    rows: [
      itemRow({
        title: 'Origin Type',
        description: "The origin type is pre-defined and can't be customized.",
        control: `<InputText
  model-value="Single Origin"
  size="large"
  class="w-full"
  aria-label="Origin Type"
  readonly
/>`
      }),
      itemRow({
        title: 'Protocol Policy',
        description: 'Select the protocol usage between the edge nodes and the origin.',
        start: true,
        control: radioBlocks({
          legend: 'Protocol Policy',
          options: 'protocolPolicyOptions',
          model: 'form.protocolPolicy',
          name: 'protocolPolicy',
          prefix: 'app',
          description: false
        })
      }),
      itemRow({
        title: 'Address',
        description: 'Define an origin for the content in FQDN format or an IPv4/IPv6 address.',
        control: requiredText({
          model: 'form.address',
          label: 'Address',
          id: 'app-address-error',
          error: 'errors.address',
          placeholder: 'example.com'
        })
      }),
      itemRow({
        title: 'Host header',
        description: 'Identify a virtualhost sent in the Host header to the origin.',
        control: requiredText({
          model: 'form.hostHeader',
          label: 'Host header',
          id: 'app-hostHeader-error',
          error: 'errors.hostHeader'
        })
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Cache Expiration Policies'),
    rows: [
      itemRow({
        title: 'Browser Cache Settings',
        start: true,
        control: radioBlocks({
          legend: 'Browser Cache Settings',
          options: 'browserCacheOptions',
          model: 'form.browserCache',
          name: 'browserCache',
          prefix: 'app'
        })
      }),
      itemRow({
        title: 'Maximum TTL (seconds)',
        control: ttlInput('form.browserMaxTtl', 'Browser maximum TTL in seconds')
      }),
      itemRow({
        title: 'Cache Settings',
        start: true,
        control: radioBlocks({
          legend: 'Cache Settings',
          options: 'edgeCacheOptions',
          model: 'form.edgeCache',
          name: 'edgeCache',
          prefix: 'app'
        })
      }),
      itemRow({
        title: 'Maximum TTL (seconds)',
        description:
          'Enable Application Accelerator in the Main Settings tab to use values lower than 60 seconds. Tiered Cache requires cache TTL to be equal to or greater than 3 seconds.',
        control: ttlInput('form.edgeMaxTtl', 'Edge maximum TTL in seconds')
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Debug Rules'),
    rows: [
      itemRow({
        title: 'Active',
        description:
          'Rules that were successfully executed will be shown under the $traceback field in Data Streaming and Real-Time Events or the $stacktrace variable in GraphQL.',
        compact: true,
        control: `<Switch
  v-model="form.debugRules"
  aria-label="Active"
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
      <fieldset
        class="mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Create application</legend>

${indent(SECTIONS.join('\n\n'), 4)}
      </fieldset>
    </div>

${indent(stickyFooter({ cancelDisabled: 'submitting', loading: 'submitting', submit: '@click="submit"' }), 2)}
  </form>
</main>`
})

const components = patternComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/InPageForm',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The long module create as its own page, Approach A of the forms lab (In Page create, `/forms/in-page`): the creation header with the back button and no sidebar, then the form column as section-titled groups of `Item` rows, each group a small heading over a flush `CardBox`, and one full-bleed sticky footer with Cancel and Save. Create Application is the example, in five groups: General, Delivery Settings, Origins, Cache Expiration Policies and Debug Rules. Required fields flag only after Save is pressed, and each error clears as soon as its field is edited. The footer carries no z-index, as the sample renders it. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `CardBox`, `Item`, `InputText`, `MultiSelect`, `FieldRadioBlock`, `InputNumber`, `Switch`, `HelperText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupFor(NO_ERRORS), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The page as it opens: Name and Address empty, HTTP port 80 preselected, HTTPS ports disabled until a protocol with HTTPS is chosen, and the host header prefilled with ${host}.'
      },
      source: { code: toSfc(scriptFor(NO_ERRORS), TEMPLATE) }
    }
  }
}

export const Submitted = {
  render: () => ({ components, setup: setupFor(SUBMITTED_ERRORS), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'After Save on the empty form: Name and Address carry the required state with This field is required. under them, and typing into either clears its own error.'
      },
      source: { code: toSfc(scriptFor(SUBMITTED_ERRORS), TEMPLATE) }
    }
  }
}
