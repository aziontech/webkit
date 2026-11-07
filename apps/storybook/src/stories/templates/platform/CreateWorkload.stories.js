import Avatar from '@aziontech/webkit/avatar'
import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Label from '@aziontech/webkit/label'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Select from '@aziontech/webkit/select'
import Skeleton from '@aziontech/webkit/skeleton'
import Stepper from '@aziontech/webkit/stepper'
import Switch from '@aziontech/webkit/switch'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLICATION_MODES,
  APPLICATION_OPTIONS,
  applicationBindingCard,
  collapsibleSection,
  declare,
  fieldStack,
  HEADER_IMPORTS,
  headerComponents,
  iconTile,
  itemComponents,
  PICKER_SCRIPT,
  pickerList,
  usePicker,
  useWizardRail,
  WIRE_SUB_WIDTHS,
  WIRE_WIDTHS,
  WIZARD_RAIL_SCRIPT,
  wizardPage
} from './_create-markup'

const BREADCRUMB = [{ label: 'Workloads', href: '/workloads' }, { label: 'Create Workload' }]

const WIZARD_STEPS = [
  { id: 'application', label: 'Application' },
  { id: 'binding', label: 'Domain and deployment' }
]

const CACHE_POLICIES = [
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

const CONNECTOR_TYPES = [
  { value: 'http', label: 'HTTP', description: 'An origin server, reached by host name.' },
  {
    value: 'storage',
    label: 'Object Storage',
    description: 'A bucket in this workspace, read by name and prefix.'
  },
  {
    value: 'live-ingest',
    label: 'Live Ingest',
    description: 'An Azion region a live stream is ingested from.'
  }
]

const CONNECTOR_FIELDS = {
  http: [
    {
      kind: 'text',
      name: 'address',
      label: 'Origin address',
      placeholder: 'origin.example.com',
      required: true,
      description: 'The host the application fetches from. No scheme.'
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
      description: 'Leave it empty to send every request to this connector.'
    }
  ],
  storage: [
    {
      kind: 'select',
      name: 'bucket',
      label: 'Bucket',
      options: [
        { value: 'webkit-storybook-dev', label: 'webkit-storybook-dev' },
        { value: 'azion-assets-prod', label: 'azion-assets-prod' },
        { value: 'user-uploads', label: 'user-uploads' }
      ],
      required: true,
      description: 'An Object Storage bucket in this workspace.'
    },
    {
      kind: 'text',
      name: 'prefix',
      label: 'Prefix',
      placeholder: 'assets/',
      description: 'The folder inside the bucket the connector reads from.'
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

const DOMAIN_TYPES = [
  { label: 'Free Azion domain', value: 'azion' },
  { label: 'Your own domain', value: 'own' }
]

const DEPLOYMENT_MODES = [
  { label: 'Create one', value: 'auto' },
  { label: 'Use existing', value: 'existing' }
]

const ENVIRONMENTS = [
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

const CERTIFICATES = [
  { value: 'lets_encrypt', label: "Let's Encrypt (issued and renewed by Azion)" },
  { value: 'azion_san', label: 'Azion (SAN)' },
  { value: 'own', label: 'A certificate from Certificate Manager' }
]

const TLS_VERSIONS = [
  { value: 'tls_1_0', label: 'TLS 1.0' },
  { value: 'tls_1_1', label: 'TLS 1.1' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_3', label: 'TLS 1.3' }
]

const CUSTOM_PAGES = [
  { value: 'Rate limited', label: 'Rate limited' },
  { value: 'Blocked by firewall', label: 'Blocked by firewall' },
  { value: 'Branded 404', label: 'Branded 404' },
  { value: 'Server error', label: 'Server error' },
  { value: 'Maintenance window', label: 'Maintenance window' }
]

const NAMED_DEPLOYMENTS = [
  {
    value: 'azion-default',
    label: 'Azion Default',
    description: 'The platform’s own deployment. Versions keep the resource IDs they shipped with.'
  },
  { value: 's1', label: 'magalu-storefront', description: 'Storefront traffic for production.' },
  {
    value: 's2',
    label: 'azion-storefront',
    description: 'Azion-run storefront, production traffic.'
  },
  {
    value: 's5',
    label: 'analytics-canary',
    description: 'Canary slice of the analytics application.'
  },
  { value: 's6', label: 'auth-service-prod', description: 'Authored in this workspace.' },
  { value: 's7', label: 'marketing-site-prod', description: 'Authored in this workspace.' },
  { value: 's9', label: 'internal-tools-dev', description: 'Authored in this workspace.' },
  { value: 's10', label: 'blog-platform-stage', description: 'Authored in this workspace.' },
  {
    value: 's11',
    label: 'azion-site-prod',
    description: 'Production traffic for the Azion site.'
  },
  {
    value: 's12',
    label: 'azion-site-preview',
    description: 'Per-version preview URLs for the Azion site.'
  },
  {
    value: 's13',
    label: 'azion-site-stage',
    description: 'Stage rehearsals for the Azion site.'
  },
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
    label: 'azion-docs-prod',
    description: 'Production traffic for the documentation site.'
  },
  {
    value: 's17',
    label: 'azion-docs-preview',
    description: 'Per-version preview URLs for the documentation site.'
  }
]

const WORKLOAD_DEPLOYMENTS = Array.from({ length: 20 }, (_, index) => {
  const workload = `workload_${String(index + 1).padStart(2, '0')}`
  const id = `ws-${1020655 + index * 173}`
  return [
    {
      value: id,
      label: workload,
      description: `Created with the ${workload} workload for Production.`
    },
    {
      value: `${id}-preview`,
      label: `${workload}-preview`,
      description: `Created with the ${workload} workload for Preview.`
    }
  ]
}).flat()

const DEPLOYMENTS = [...NAMED_DEPLOYMENTS, ...WORKLOAD_DEPLOYMENTS]

const AZION_DOMAIN_SUFFIX = '.azion.run'

const slug = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const scratchSeed = () => ({
  cache: {
    images: {
      enabled: false,
      values: { extensions: 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff' }
    },
    'files-optimization': { enabled: false, values: {} }
  },
  connector: { enabled: false, type: 'http', values: {} }
})

const useCreateWorkload = (state) => () => {
  const stepIndex = ref(state.stepIndex)
  const { steps, current, goBack } = useWizardRail(WIZARD_STEPS, stepIndex)

  const applicationMode = ref(state.mode)
  const applicationName = ref('')
  const applicationPicker = usePicker(APPLICATION_OPTIONS, 'application', {
    chosen: state.application
  })
  const deploymentPicker = usePicker(DEPLOYMENTS, 'deployment')
  const scratch = reactive(scratchSeed())

  const form = reactive({
    domainType: 'azion',
    domainPrefix: state.domainPrefix,
    domainHost: '',
    name: '',
    environment: 'Production',
    certificate: 'azion_san',
    deploymentMode: 'auto',
    minimumTlsVersion: 'tls_1_2',
    customPage: '',
    allowAzionDomain: true,
    active: true
  })
  const errors = reactive({})
  const advancedOpen = ref(false)

  const names = computed(() => {
    const input = slug(form.domainType === 'own' ? form.name : form.domainPrefix)
    return {
      workload: input,
      deployment: input ? `${input}-deployment` : '',
      domain:
        form.domainType === 'own'
          ? form.domainHost.trim().toLowerCase() || (input ? `${input}${AZION_DOMAIN_SUFFIX}` : '')
          : input
            ? `${input}${AZION_DOMAIN_SUFFIX}`
            : ''
    }
  })

  const boundName = computed(() =>
    applicationMode.value === 'new' ? applicationName.value.trim() : applicationPicker.chosen
  )

  const applicationSummary = computed(() => {
    if (!boundName.value) return 'Not chosen yet. Pick one, or create it with the workload.'
    if (applicationMode.value !== 'new') {
      return 'Serving its latest ready version. The domain answers with this.'
    }
    return 'Created with the workload and built before the release is cut.'
  })

  const connectorFields = computed(() => CONNECTOR_FIELDS[scratch.connector.type])

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    applicationPicker.message = ''
    deploymentPicker.message = ''
    if (stepIndex.value === 0) {
      if (!boundName.value) {
        applicationPicker.message =
          applicationMode.value === 'new'
            ? 'Name the application, or select one that already exists.'
            : 'Select the application this workload serves, or create a new one.'
      }
      if (applicationMode.value === 'new') {
        if (scratch.cache.images.enabled && !scratch.cache.images.values.extensions?.trim()) {
          errors['cache.images.extensions'] = 'This field is required.'
        }
        if (scratch.connector.enabled) {
          for (const field of connectorFields.value) {
            if (field.required && !String(scratch.connector.values[field.name] ?? '').trim()) {
              errors[`connector.${field.name}`] = 'This field is required.'
            }
          }
        }
      }
      return !applicationPicker.message && Object.keys(errors).length === 0
    }
    if (form.domainType === 'own') {
      if (!form.domainHost.trim())
        errors.domainHost = 'Enter the hostname that points at this workload.'
      if (!form.name.trim()) errors.name = 'Name the workload.'
    } else if (!form.domainPrefix.trim()) {
      errors.domainPrefix = 'Enter the prefix for the Azion domain.'
    }
    if (form.deploymentMode === 'existing' && !deploymentPicker.chosen) {
      deploymentPicker.message = 'Select the deployment the first release lands in.'
    }
    return Object.keys(errors).length === 0 && !deploymentPicker.message
  }

  const advance = () => {
    if (!validate()) return
    if (stepIndex.value < WIZARD_STEPS.length - 1) stepIndex.value += 1
  }

  const nextLabel = computed(() =>
    stepIndex.value === WIZARD_STEPS.length - 1 ? 'Create and deploy' : 'Next'
  )

  return {
    breadcrumb: BREADCRUMB,
    applicationModes: APPLICATION_MODES,
    cachePolicies: CACHE_POLICIES,
    connectorTypes: CONNECTOR_TYPES,
    domainTypes: DOMAIN_TYPES,
    deploymentModes: DEPLOYMENT_MODES,
    environments: ENVIRONMENTS,
    certificates: CERTIFICATES,
    tlsVersions: TLS_VERSIONS,
    customPages: CUSTOM_PAGES,
    wireWidths: WIRE_WIDTHS,
    wireSubWidths: WIRE_SUB_WIDTHS,
    azionDomainSuffix: AZION_DOMAIN_SUFFIX,
    stepIndex,
    steps,
    current,
    goBack,
    applicationMode,
    applicationName,
    applicationPicker,
    deploymentPicker,
    scratch,
    form,
    errors,
    advancedOpen,
    names,
    boundName,
    applicationSummary,
    connectorFields,
    labelFor,
    advance,
    nextLabel
  }
}

const scriptFor = (state) => [
  ...HEADER_IMPORTS,
  "import BoxGridSelection from '@aziontech/webkit/box-grid-selection'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Label from '@aziontech/webkit/label'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Select from '@aziontech/webkit/select'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import Stepper from '@aziontech/webkit/stepper'",
  "import Switch from '@aziontech/webkit/switch'",
  "import { computed, reactive, ref } from 'vue'",
  '',
  declare('breadcrumb', BREADCRUMB),
  declare('wizardSteps', WIZARD_STEPS),
  declare('applicationModes', APPLICATION_MODES),
  declare('applications', APPLICATION_OPTIONS),
  declare('cachePolicies', CACHE_POLICIES),
  declare('connectorTypes', CONNECTOR_TYPES),
  declare('connectorFieldsByType', CONNECTOR_FIELDS),
  declare('domainTypes', DOMAIN_TYPES),
  declare('deploymentModes', DEPLOYMENT_MODES),
  declare('environments', ENVIRONMENTS),
  declare('certificates', CERTIFICATES),
  declare('tlsVersions', TLS_VERSIONS),
  declare('customPages', CUSTOM_PAGES),
  declare('deployments', DEPLOYMENTS),
  `const azionDomainSuffix = '${AZION_DOMAIN_SUFFIX}'`,
  ...PICKER_SCRIPT,
  '',
  `const stepIndex = ref(${state.stepIndex})`,
  ...WIZARD_RAIL_SCRIPT,
  '',
  `const applicationMode = ref('${state.mode}')`,
  "const applicationName = ref('')",
  `const applicationPicker = usePicker(applications, 'application', { chosen: '${state.application}' })`,
  "const deploymentPicker = usePicker(deployments, 'deployment')",
  `const scratch = reactive(${declare('', scratchSeed()).replace('const  = ', '')})`,
  '',
  'const form = reactive({',
  "  domainType: 'azion',",
  `  domainPrefix: '${state.domainPrefix}',`,
  "  domainHost: '',",
  "  name: '',",
  "  environment: 'Production',",
  "  certificate: 'azion_san',",
  "  deploymentMode: 'auto',",
  "  minimumTlsVersion: 'tls_1_2',",
  "  customPage: '',",
  '  allowAzionDomain: true,',
  '  active: true',
  '})',
  'const errors = reactive({})',
  'const advancedOpen = ref(false)',
  '',
  'const slug = (value) =>',
  "  String(value ?? '')",
  '    .trim()',
  '    .toLowerCase()',
  "    .replace(/[^a-z0-9-]+/g, '-')",
  "    .replace(/^-+|-+$/g, '')",
  '',
  'const names = computed(() => {',
  "  const input = slug(form.domainType === 'own' ? form.name : form.domainPrefix)",
  '  return {',
  '    workload: input,',
  "    deployment: input ? input + '-deployment' : '',",
  '    domain:',
  "      form.domainType === 'own'",
  "        ? form.domainHost.trim().toLowerCase() || (input ? input + azionDomainSuffix : '')",
  '        : input',
  '          ? input + azionDomainSuffix',
  "          : ''",
  '  }',
  '})',
  '',
  'const boundName = computed(() =>',
  "  applicationMode.value === 'new' ? applicationName.value.trim() : applicationPicker.chosen",
  ')',
  '',
  'const applicationSummary = computed(() => {',
  "  if (!boundName.value) return 'Not chosen yet. Pick one, or create it with the workload.'",
  "  if (applicationMode.value !== 'new') {",
  "    return 'Serving its latest ready version. The domain answers with this.'",
  '  }',
  "  return 'Created with the workload and built before the release is cut.'",
  '})',
  '',
  'const connectorFields = computed(() => connectorFieldsByType[scratch.connector.type])',
  '',
  "const labelFor = (options) => (value) => options.find((option) => option.value === value)?.label ?? ''",
  '',
  'const validate = () => {',
  '  Object.keys(errors).forEach((key) => delete errors[key])',
  "  applicationPicker.message = ''",
  "  deploymentPicker.message = ''",
  '  if (stepIndex.value === 0) {',
  '    if (!boundName.value) {',
  '      applicationPicker.message =',
  "        applicationMode.value === 'new'",
  "          ? 'Name the application, or select one that already exists.'",
  "          : 'Select the application this workload serves, or create a new one.'",
  '    }',
  "    if (applicationMode.value === 'new') {",
  '      if (scratch.cache.images.enabled && !scratch.cache.images.values.extensions?.trim()) {',
  "        errors['cache.images.extensions'] = 'This field is required.'",
  '      }',
  '      if (scratch.connector.enabled) {',
  '        for (const field of connectorFields.value) {',
  "          if (field.required && !String(scratch.connector.values[field.name] ?? '').trim()) {",
  "            errors['connector.' + field.name] = 'This field is required.'",
  '          }',
  '        }',
  '      }',
  '    }',
  '    return !applicationPicker.message && Object.keys(errors).length === 0',
  '  }',
  "  if (form.domainType === 'own') {",
  "    if (!form.domainHost.trim()) errors.domainHost = 'Enter the hostname that points at this workload.'",
  "    if (!form.name.trim()) errors.name = 'Name the workload.'",
  '  } else if (!form.domainPrefix.trim()) {',
  "    errors.domainPrefix = 'Enter the prefix for the Azion domain.'",
  '  }',
  "  if (form.deploymentMode === 'existing' && !deploymentPicker.chosen) {",
  "    deploymentPicker.message = 'Select the deployment the first release lands in.'",
  '  }',
  '  return Object.keys(errors).length === 0 && !deploymentPicker.message',
  '}',
  '',
  'const advance = () => {',
  '  if (!validate()) return',
  '  if (stepIndex.value < wizardSteps.length - 1) stepIndex.value += 1',
  '}',
  '',
  "const nextLabel = computed(() => (stepIndex.value === wizardSteps.length - 1 ? 'Create and deploy' : 'Next'))"
]

const components = {
  ...headerComponents({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton }),
  ...itemComponents(Item),
  BoxGridSelection,
  Button,
  CardBox,
  FieldSelect,
  FieldText,
  HelperText,
  Hint,
  InputText,
  Label,
  SegmentedButton,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Skeleton,
  Stepper,
  'Stepper.Step': Stepper.Step,
  Switch
}

const EXPAND_CLASS =
  'grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none'

const scratchText = ({ id, model, error, when = '' }) => `<FieldText${when ? `\n  ${when}` : ''}
  :input-id="${id}"
  v-model="${model}"
  :label="field.label"
  size="large"
  :placeholder="field.placeholder"
  :required="!!${error}"
  :helper-text="${error} || field.description"
/>`

const APPLICATION_LAYER = `<div v-if="applicationMode === 'new'" class="flex min-w-0 flex-col gap-(--layout-section-gap)">
  <CardBox title="Cache Settings" :padded="false">
    <template #content>
      <Item.List>
        <Item v-for="policy in cachePolicies" :key="policy.value" size="small" class="flex-col items-stretch gap-0">
          <div class="flex w-full items-center gap-(--spacing-md)">
            <Item.Content>
              <Item.Title>{{ policy.label }}</Item.Title>
              <Item.Description>{{ policy.description }}</Item.Description>
            </Item.Content>
            <Item.Actions class="justify-end">
              <Switch v-model="scratch.cache[policy.value].enabled" :aria-label="policy.label" />
            </Item.Actions>
          </div>

          <div v-if="policy.fields.length" :data-open="scratch.cache[policy.value].enabled || null" class="${EXPAND_CLASS}">
            <div class="min-w-0 overflow-hidden" :inert="!scratch.cache[policy.value].enabled">
              <div class="flex flex-col gap-(--spacing-lg) pt-(--spacing-md)">
                <template v-for="field in policy.fields" :key="field.name">
${indent(
  scratchText({
    id: "'cache-' + policy.value + '-' + field.name",
    model: 'scratch.cache[policy.value].values[field.name]',
    error: "errors['cache.' + policy.value + '.' + field.name]"
  }),
  9
)}
                </template>
              </div>
            </div>
          </div>
        </Item>
      </Item.List>
    </template>
  </CardBox>

  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Content>
            <Item.Title>Add a connector</Item.Title>
            <Item.Description>
              Where the application fetches from when the cache does not already hold the answer. Add one now, or bind one later.
            </Item.Description>
          </Item.Content>
          <Item.Actions class="justify-end">
            <Switch v-model="scratch.connector.enabled" aria-label="Add a connector" />
          </Item.Actions>
        </Item>
      </Item.List>

      <div :data-open="scratch.connector.enabled || null" class="${EXPAND_CLASS}">
        <div class="min-w-0 overflow-hidden" :inert="!scratch.connector.enabled">
          <div class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)">
            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <p id="connector-type-label" class="text-label-sm text-(--text-default)">Type</p>
              <BoxGridSelection
                v-model="scratch.connector.type"
                :items="connectorTypes"
                aria-labelledby="connector-type-label"
                aria-describedby="connector-type-help"
                class="[&>*]:grow [&>*]:basis-(--container-3xs)"
              />
              <HelperText
                id="connector-type-help"
                kind="helper"
                label="Decides what the connector is addressed by: a host, a bucket, or a region."
              />
            </div>

            <template v-for="field in connectorFields" :key="field.name">
${indent(
  [
    `<div
  v-if="field.kind === 'select'"
  :data-field-invalid="!!errors['connector.' + field.name] || null"
  class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
>
  <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
    <Label :for="'connector-' + field.name" :required="!!errors['connector.' + field.name]">
      {{ field.label }}
    </Label>
  </div>
  <Select
    v-model="scratch.connector.values[field.name]"
    size="large"
    class="w-full"
    :display-value="labelFor(field.options)"
    :required="!!errors['connector.' + field.name]"
    :placeholder="'Select a ' + field.label.toLowerCase()"
  >
    <Select.Trigger
      :id="'connector-' + field.name"
      :aria-label="field.label"
      :aria-describedby="'connector-' + field.name + '-helper'"
    />
    <Select.Content>
      <Select.Option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </Select.Option>
    </Select.Content>
  </Select>
  <HelperText :id="'connector-' + field.name + '-helper'" :kind="errors['connector.' + field.name] ? 'required' : 'helper'">
    {{ errors['connector.' + field.name] || field.description }}
  </HelperText>
</div>`,
    scratchText({
      id: "'connector-' + field.name",
      model: 'scratch.connector.values[field.name]',
      error: "errors['connector.' + field.name]",
      when: 'v-else'
    })
  ].join('\n'),
  6
)}
            </template>
          </div>
        </div>
      </div>
    </template>
  </CardBox>
</div>`

const APPLICATION_STEP = `<div v-if="stepIndex === 0" class="flex min-w-0 flex-col gap-(--layout-section-gap)">
${indent(applicationBindingCard({ mode: 'applicationMode', name: 'applicationName', picker: 'applicationPicker' }), 1)}

${indent(APPLICATION_LAYER, 1)}
</div>`

const selectStack = ({ id, label, hint, model, options }) =>
  fieldStack({
    id,
    label,
    hint,
    control: `<Select
  v-model="${model}"
  size="large"
  class="w-full"
  :display-value="labelFor(${options})"
>
  <Select.Trigger id="${id}" aria-label="${label}" />
  <Select.Content>
    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`
  })

const requiredStack = ({
  id,
  label,
  description,
  model,
  error,
  placeholder,
  suffix = false,
  when = ''
}) =>
  fieldStack({
    id,
    label,
    description,
    required: true,
    message: error,
    model,
    placeholder,
    when,
    iconRight: suffix
      ? `<span class="whitespace-nowrap text-label-sm text-(--text-muted)" aria-hidden="true">
  {{ azionDomainSuffix }}
</span>`
      : ''
  })

const DOMAIN_CARD = `<CardBox :padded="false" title="Domain">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
      <SegmentedButton v-model="form.domainType" :options="domainTypes" size="large" fluid aria-label="Where the domain comes from" />

${indent(
  requiredStack({
    id: 'domain-prefix',
    label: 'Domain prefix',
    description:
      'Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen. It also names the workload and its deployment.',
    model: 'form.domainPrefix',
    error: 'errors.domainPrefix',
    placeholder: 'my-first-app',
    suffix: true,
    when: "form.domainType !== 'own'"
  }),
  3
)}

      <template v-else>
${indent(
  [
    requiredStack({
      id: 'domain-host',
      label: 'Domain',
      description:
        'A full hostname, like www.example.com. Add its DNS record once the workload exists. The run does not wait on it.',
      model: 'form.domainHost',
      error: 'errors.domainHost',
      placeholder: 'www.example.com'
    }),
    requiredStack({
      id: 'workload-name',
      label: 'Name',
      description:
        'Lowercase letters, numbers and hyphens. It also names the deployment created for it.',
      model: 'form.name',
      error: 'errors.name',
      placeholder: 'my-first-app'
    })
  ].join('\n\n'),
  4
)}
      </template>
    </div>

    <div class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-md)">
      <p class="text-label-sm text-(--text-default)">Traffic arrives on</p>
      <div
        :data-empty="!names.domain || null"
        class="flex min-h-10 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) data-[empty]:border-dashed"
      >
        <i class="pi pi-globe shrink-0 text-(--text-muted)" aria-hidden="true" />
        <span v-if="names.domain" class="min-w-0 truncate text-label-sm text-(--text-default)">
          https://{{ names.domain }}
        </span>
        <span v-else class="text-label-sm text-(--text-muted)">
          {{ form.domainType !== 'own' ? 'Type a prefix to see the domain.' : 'Type a hostname to see the address.' }}
        </span>
      </div>
      <p class="text-label-sm text-(--text-muted)">
        The workload is created as
        <span class="text-(--text-default)">{{ names.workload || 'unnamed' }}</span>. Add more domains to it once it exists.
      </p>
    </div>
  </template>
</CardBox>`

const ENVIRONMENT_CARD = `<CardBox title="Environment and certificate" class="mt-(--layout-section-gap)">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg)">
${indent(
  fieldStack({
    id: 'environment',
    group: true,
    label: 'Environment',
    hint: 'Which environment this binding lands on.',
    description: 'The domain answers on the environment it is bound to.',
    control: `<BoxGridSelection
  v-model="form.environment"
  :items="environments"
  aria-labelledby="environment-label"
  aria-describedby="environment-helper"
  class="[&>*]:grow [&>*]:basis-(--container-3xs)"
/>`
  }),
  3
)}

      <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
${indent(
  selectStack({
    id: 'certificate',
    label: 'Certificate',
    hint: 'One certificate per workload, not per domain on it.',
    model: 'form.certificate',
    options: 'certificates'
  }),
  4
)}
      </div>
    </div>
  </template>
</CardBox>`

const DEPLOYMENT_CARD = `<CardBox :padded="false" title="Deployment" class="mt-(--layout-section-gap)">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
      <p class="text-body-sm text-(--text-muted)">
        The deployment settings the first release is cut against — what it binds, and how versions are promoted into it.
      </p>

      <SegmentedButton v-model="form.deploymentMode" :options="deploymentModes" size="large" fluid aria-label="Where the deployment comes from" />
    </div>

    <div v-if="form.deploymentMode !== 'existing'" class="mt-(--spacing-md) border-t border-(--border-default) p-(--spacing-md)">
      <Item.List>
        <Item size="small">
          <Item.Media>
${indent(iconTile('ai ai-deploy-pillar'), 6)}
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ names.deployment || 'Named from the domain' }}</Item.Title>
            <Item.Description>
              Created with the workload, on Azion's default settings. Change them from Deployments once it exists.
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.List>
    </div>

    <div v-else class="min-w-0 pt-(--spacing-md)">
${indent(pickerList({ picker: 'deploymentPicker', noun: 'deployment', icon: 'ai ai-deploy-pillar' }), 3)}
    </div>
  </template>
</CardBox>`

const ADVANCED = collapsibleSection({
  title: 'Advanced',
  icon: 'pi pi-cog',
  hint: "Every field here already carries the endpoint's own default, and all of them can be changed once the workload exists.",
  regionId: 'create-workload-advanced',
  open: 'advancedOpen',
  body: `<CardBox :padded="false">
  <template #content>
    <div class="p-(--spacing-md)">
${indent(
  selectStack({
    id: 'minimum-tls-version',
    label: 'Minimum TLS version',
    hint: 'Connections negotiating below this version are refused.',
    model: 'form.minimumTlsVersion',
    options: 'tlsVersions'
  }),
  3
)}
    </div>

    <div class="border-t border-(--border-default) p-(--spacing-md)">
${indent(
  fieldStack({
    field: 'FieldSelect',
    id: 'custom-page',
    label: 'Custom page',
    description: "Optional. Without one, the workload falls back to Azion's own pages.",
    model: 'form.customPage',
    options: 'customPages',
    placeholder: 'Not bound'
  }),
  3
)}
    </div>

    <h3 class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)">
      Behavior
    </h3>
    <Item.List>
      <Item size="small">
        <Item.Content>
          <Item.Title>Allow the Azion domain</Item.Title>
          <Item.Description>
            Serve traffic on the provisioned
            {{ names.workload ? names.workload + azionDomainSuffix : 'Azion domain' }}
            alongside your own. Turn it off once your own domain answers instead.
          </Item.Description>
        </Item.Content>
        <Item.Actions class="justify-end">
          <Switch v-model="form.allowAzionDomain" aria-label="Allow the Azion domain" />
        </Item.Actions>
      </Item>
      <Item size="small">
        <Item.Content>
          <Item.Title>Active</Item.Title>
          <Item.Description>
            When disabled, the workload is created but does not serve traffic.
          </Item.Description>
        </Item.Content>
        <Item.Actions class="justify-end">
          <Switch v-model="form.active" aria-label="Active" />
        </Item.Actions>
      </Item>
    </Item.List>
  </template>
</CardBox>`
})

const BINDING_STEP = `<template v-else>
  <CardBox :padded="false" class="mb-(--layout-section-gap)">
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Media>
${indent(iconTile('ai ai-edge-application'), 6)}
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ boundName || 'No application' }}</Item.Title>
            <Item.Description>{{ applicationSummary }}</Item.Description>
          </Item.Content>
          <Item.Actions>
            <Button type="button" label="Change" kind="text" size="small" @click="stepIndex = 0" />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </CardBox>

  <div class="flex min-w-0 flex-col">
${indent([DOMAIN_CARD, ENVIRONMENT_CARD, DEPLOYMENT_CARD, ADVANCED].join('\n\n'), 2)}
  </div>
</template>`

const TEMPLATE = wizardPage({
  title: 'Create Workload',
  titleId: 'create-workload-title',
  description:
    'A workload is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both.',
  backLabel: 'Back to Workloads',
  body: `${APPLICATION_STEP}\n\n${BINDING_STEP}`
})

const meta = {
  title: 'Templates/Platform/Creation/CreateWorkload',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Create Workload at `/workloads/new`, the two-step wizard that provisions a workload: the creation header, a Stepper rail that only lets you go back, a page heading over the form column, and a footer that fades in over the canvas with Back and the primary action, Next and then Create and deploy. Step one binds the application, either an existing one from the paged list or a new one whose cache settings and connector are set right there. Step two reads the chosen application back with a Change button, then asks for the domain (a free azion.run prefix or your own hostname, previewed as the address traffic arrives on), the environment and certificate, the deployment the first release is cut against, and an Advanced disclosure. Submitting runs the provisioning log plotted in DeploymentFlow and ends on DeploySuccess. Built from `GlobalHeader`, `Stepper`, `CardBox`, `SegmentedButton`, `FieldText`, `FieldSelect`, `Label`, `InputText`, `HelperText`, `Item`, `Skeleton`, `Switch`, `BoxGridSelection`, `Select`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: useCreateWorkload(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const Application = story(
  { stepIndex: 0, mode: 'existing', application: '', domainPrefix: '' },
  'The first step: the Application card on Existing application with nothing selected yet, and only Next in the footer. Next with no selection flags the list.'
)

export const NewApplication = story(
  { stepIndex: 0, mode: 'new', application: '', domainPrefix: '' },
  'New application: the Name field replaces the list and the application is configured in place, with the Cache Settings switches and the Add a connector switch, each opening its own fields.'
)

export const DomainAndDeployment = story(
  { stepIndex: 1, mode: 'existing', application: 'azion-site', domainPrefix: 'my-first-app' },
  'The second step with azion-site bound: the read-back row with Change, the Domain card on a free Azion domain previewing https://my-first-app.azion.run, Environment and certificate, the Deployment card creating one, the collapsed Advanced section, and Back plus Create and deploy.'
)
