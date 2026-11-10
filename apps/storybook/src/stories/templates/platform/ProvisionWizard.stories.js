import Avatar from '@aziontech/webkit/avatar'
import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
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
  collapsibleSection,
  declare,
  fieldStack,
  HEADER_IMPORTS,
  headerComponents,
  iconTile,
  itemComponents,
  PICKER_SCRIPT,
  pickerList,
  PROJECT_MODES,
  PROJECT_OPTIONS,
  projectBindingCard,
  usePicker,
  useWizardRail,
  WIRE_SUB_WIDTHS,
  WIRE_WIDTHS,
  WIZARD_RAIL_SCRIPT,
  wizardPage
} from './_create-markup'

const BREADCRUMB = [{ label: 'Services', href: '/services' }, { label: 'Create Service' }]

const WIZARD_STEPS = [
  { id: 'project', label: 'Project' },
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

const ORIGIN_TYPES = [
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

const ORIGIN_FIELDS = {
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

const DOMAIN_TYPES = [
  { label: 'Free platform domain', value: 'platform' },
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
  { value: 'lets_encrypt', label: 'Let’s Encrypt (issued and renewed automatically)' },
  { value: 'shared_san', label: 'Shared (SAN)' },
  { value: 'own', label: 'A certificate you upload' }
]

const TLS_VERSIONS = [
  { value: 'tls_1_0', label: 'TLS 1.0' },
  { value: 'tls_1_1', label: 'TLS 1.1' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_3', label: 'TLS 1.3' }
]

const ERROR_PAGES = [
  { value: 'Rate limited', label: 'Rate limited' },
  { value: 'Blocked by firewall', label: 'Blocked by firewall' },
  { value: 'Branded 404', label: 'Branded 404' },
  { value: 'Server error', label: 'Server error' },
  { value: 'Maintenance window', label: 'Maintenance window' }
]

const NAMED_DEPLOYMENTS = [
  {
    value: 'default',
    label: 'Default',
    description: 'The platform’s own deployment. Versions keep the resource IDs they shipped with.'
  },
  { value: 's1', label: 'shop-storefront', description: 'Storefront traffic for production.' },
  {
    value: 's2',
    label: 'acme-storefront',
    description: 'Acme storefront, production traffic.'
  },
  {
    value: 's5',
    label: 'analytics-canary',
    description: 'Canary slice of the analytics project.'
  },
  { value: 's6', label: 'auth-service-prod', description: 'Authored in this workspace.' },
  { value: 's7', label: 'marketing-site-prod', description: 'Authored in this workspace.' },
  { value: 's9', label: 'internal-tools-dev', description: 'Authored in this workspace.' },
  { value: 's10', label: 'blog-platform-stage', description: 'Authored in this workspace.' },
  {
    value: 's11',
    label: 'web-app-prod',
    description: 'Production traffic for the web app.'
  },
  {
    value: 's12',
    label: 'web-app-preview',
    description: 'Per-version preview URLs for the web app.'
  },
  {
    value: 's13',
    label: 'web-app-stage',
    description: 'Stage rehearsals for the web app.'
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
    label: 'docs-site-prod',
    description: 'Production traffic for the documentation site.'
  },
  {
    value: 's17',
    label: 'docs-site-preview',
    description: 'Per-version preview URLs for the documentation site.'
  }
]

const SERVICE_DEPLOYMENTS = Array.from({ length: 20 }, (_, index) => {
  const service = `service-${String(index + 1).padStart(2, '0')}`
  const id = `ws-${1020655 + index * 173}`
  return [
    {
      value: id,
      label: service,
      description: `Created with the ${service} service for Production.`
    },
    {
      value: `${id}-preview`,
      label: `${service}-preview`,
      description: `Created with the ${service} service for Preview.`
    }
  ]
}).flat()

const DEPLOYMENTS = [...NAMED_DEPLOYMENTS, ...SERVICE_DEPLOYMENTS]

const PLATFORM_DOMAIN_SUFFIX = '.example.com'

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
  origin: { enabled: false, type: 'http', values: {} }
})

const useCreateService = (state) => () => {
  const stepIndex = ref(state.stepIndex)
  const { steps, current, goBack } = useWizardRail(WIZARD_STEPS, stepIndex)

  const projectMode = ref(state.mode)
  const projectName = ref('')
  const projectPicker = usePicker(PROJECT_OPTIONS, 'project', {
    chosen: state.project
  })
  const deploymentPicker = usePicker(DEPLOYMENTS, 'deployment')
  const scratch = reactive(scratchSeed())

  const form = reactive({
    domainType: 'platform',
    domainPrefix: state.domainPrefix,
    domainHost: '',
    name: '',
    environment: 'Production',
    certificate: 'shared_san',
    deploymentMode: 'auto',
    minimumTlsVersion: 'tls_1_2',
    errorPage: '',
    allowPlatformDomain: true,
    active: true
  })
  const errors = reactive({})
  const advancedOpen = ref(false)

  const names = computed(() => {
    const input = slug(form.domainType === 'own' ? form.name : form.domainPrefix)
    return {
      service: input,
      deployment: input ? `${input}-deployment` : '',
      domain:
        form.domainType === 'own'
          ? form.domainHost.trim().toLowerCase() ||
            (input ? `${input}${PLATFORM_DOMAIN_SUFFIX}` : '')
          : input
            ? `${input}${PLATFORM_DOMAIN_SUFFIX}`
            : ''
    }
  })

  const boundName = computed(() =>
    projectMode.value === 'new' ? projectName.value.trim() : projectPicker.chosen
  )

  const projectSummary = computed(() => {
    if (!boundName.value) return 'Not chosen yet. Pick one, or create it with the service.'
    if (projectMode.value !== 'new') {
      return 'Serving its latest ready version. The domain answers with this.'
    }
    return 'Created with the service and built before the release is cut.'
  })

  const originFields = computed(() => ORIGIN_FIELDS[scratch.origin.type])

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    projectPicker.message = ''
    deploymentPicker.message = ''
    if (stepIndex.value === 0) {
      if (!boundName.value) {
        projectPicker.message =
          projectMode.value === 'new'
            ? 'Name the project, or select one that already exists.'
            : 'Select the project this service serves, or create a new one.'
      }
      if (projectMode.value === 'new') {
        if (scratch.cache.images.enabled && !scratch.cache.images.values.extensions?.trim()) {
          errors['cache.images.extensions'] = 'This field is required.'
        }
        if (scratch.origin.enabled) {
          for (const field of originFields.value) {
            if (field.required && !String(scratch.origin.values[field.name] ?? '').trim()) {
              errors[`origin.${field.name}`] = 'This field is required.'
            }
          }
        }
      }
      return !projectPicker.message && Object.keys(errors).length === 0
    }
    if (form.domainType === 'own') {
      if (!form.domainHost.trim())
        errors.domainHost = 'Enter the hostname that points at this service.'
      if (!form.name.trim()) errors.name = 'Name the service.'
    } else if (!form.domainPrefix.trim()) {
      errors.domainPrefix = 'Enter the prefix for the platform domain.'
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
    projectModes: PROJECT_MODES,
    cachePolicies: CACHE_POLICIES,
    originTypes: ORIGIN_TYPES,
    domainTypes: DOMAIN_TYPES,
    deploymentModes: DEPLOYMENT_MODES,
    environments: ENVIRONMENTS,
    certificates: CERTIFICATES,
    tlsVersions: TLS_VERSIONS,
    errorPages: ERROR_PAGES,
    wireWidths: WIRE_WIDTHS,
    wireSubWidths: WIRE_SUB_WIDTHS,
    platformDomainSuffix: PLATFORM_DOMAIN_SUFFIX,
    stepIndex,
    steps,
    current,
    goBack,
    projectMode,
    projectName,
    projectPicker,
    deploymentPicker,
    scratch,
    form,
    errors,
    advancedOpen,
    names,
    boundName,
    projectSummary,
    originFields,
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
  declare('projectModes', PROJECT_MODES),
  declare('projects', PROJECT_OPTIONS),
  declare('cachePolicies', CACHE_POLICIES),
  declare('originTypes', ORIGIN_TYPES),
  declare('originFieldsByType', ORIGIN_FIELDS),
  declare('domainTypes', DOMAIN_TYPES),
  declare('deploymentModes', DEPLOYMENT_MODES),
  declare('environments', ENVIRONMENTS),
  declare('certificates', CERTIFICATES),
  declare('tlsVersions', TLS_VERSIONS),
  declare('errorPages', ERROR_PAGES),
  declare('deployments', DEPLOYMENTS),
  `const platformDomainSuffix = '${PLATFORM_DOMAIN_SUFFIX}'`,
  ...PICKER_SCRIPT,
  '',
  `const stepIndex = ref(${state.stepIndex})`,
  ...WIZARD_RAIL_SCRIPT,
  '',
  `const projectMode = ref('${state.mode}')`,
  "const projectName = ref('')",
  `const projectPicker = usePicker(projects, 'project', { chosen: '${state.project}' })`,
  "const deploymentPicker = usePicker(deployments, 'deployment')",
  `const scratch = reactive(${declare('', scratchSeed()).replace('const  = ', '')})`,
  '',
  'const form = reactive({',
  "  domainType: 'platform',",
  `  domainPrefix: '${state.domainPrefix}',`,
  "  domainHost: '',",
  "  name: '',",
  "  environment: 'Production',",
  "  certificate: 'shared_san',",
  "  deploymentMode: 'auto',",
  "  minimumTlsVersion: 'tls_1_2',",
  "  errorPage: '',",
  '  allowPlatformDomain: true,',
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
  '    service: input,',
  "    deployment: input ? input + '-deployment' : '',",
  '    domain:',
  "      form.domainType === 'own'",
  "        ? form.domainHost.trim().toLowerCase() || (input ? input + platformDomainSuffix : '')",
  '        : input',
  '          ? input + platformDomainSuffix',
  "          : ''",
  '  }',
  '})',
  '',
  'const boundName = computed(() =>',
  "  projectMode.value === 'new' ? projectName.value.trim() : projectPicker.chosen",
  ')',
  '',
  'const projectSummary = computed(() => {',
  "  if (!boundName.value) return 'Not chosen yet. Pick one, or create it with the service.'",
  "  if (projectMode.value !== 'new') {",
  "    return 'Serving its latest ready version. The domain answers with this.'",
  '  }',
  "  return 'Created with the service and built before the release is cut.'",
  '})',
  '',
  'const originFields = computed(() => originFieldsByType[scratch.origin.type])',
  '',
  "const labelFor = (options) => (value) => options.find((option) => option.value === value)?.label ?? ''",
  '',
  'const validate = () => {',
  '  Object.keys(errors).forEach((key) => delete errors[key])',
  "  projectPicker.message = ''",
  "  deploymentPicker.message = ''",
  '  if (stepIndex.value === 0) {',
  '    if (!boundName.value) {',
  '      projectPicker.message =',
  "        projectMode.value === 'new'",
  "          ? 'Name the project, or select one that already exists.'",
  "          : 'Select the project this service serves, or create a new one.'",
  '    }',
  "    if (projectMode.value === 'new') {",
  '      if (scratch.cache.images.enabled && !scratch.cache.images.values.extensions?.trim()) {',
  "        errors['cache.images.extensions'] = 'This field is required.'",
  '      }',
  '      if (scratch.origin.enabled) {',
  '        for (const field of originFields.value) {',
  "          if (field.required && !String(scratch.origin.values[field.name] ?? '').trim()) {",
  "            errors['origin.' + field.name] = 'This field is required.'",
  '          }',
  '        }',
  '      }',
  '    }',
  '    return !projectPicker.message && Object.keys(errors).length === 0',
  '  }',
  "  if (form.domainType === 'own') {",
  "    if (!form.domainHost.trim()) errors.domainHost = 'Enter the hostname that points at this service.'",
  "    if (!form.name.trim()) errors.name = 'Name the service.'",
  '  } else if (!form.domainPrefix.trim()) {',
  "    errors.domainPrefix = 'Enter the prefix for the platform domain.'",
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
  ...headerComponents({ Avatar, Breadcrumb, GlobalHeader, IconButton }),
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

const PROJECT_LAYER = `<div v-if="projectMode === 'new'" class="flex min-w-0 flex-col gap-(--layout-section-gap)">
  <CardBox title="Cache Settings" :padded="false">
    <template #content>
      <Item.List>
        <Item v-for="policy in cachePolicies" :key="policy.value" size="small">
          <div class="flex w-full flex-col items-stretch">
            <div class="flex w-full items-center gap-(--spacing-md)">
              <Item.Content>
                <Item.Title>{{ policy.label }}</Item.Title>
                <Item.Description>{{ policy.description }}</Item.Description>
              </Item.Content>
              <Item.Actions>
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
            <Item.Title>Add an origin</Item.Title>
            <Item.Description>
              Where the project fetches from when the cache does not already hold the answer. Add one now, or bind one later.
            </Item.Description>
          </Item.Content>
          <Item.Actions>
            <Switch v-model="scratch.origin.enabled" aria-label="Add an origin" />
          </Item.Actions>
        </Item>
      </Item.List>

      <div :data-open="scratch.origin.enabled || null" class="${EXPAND_CLASS}">
        <div class="min-w-0 overflow-hidden" :inert="!scratch.origin.enabled">
          <div class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)">
            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <p id="origin-type-label" class="text-label-sm text-(--text-default)">Type</p>
              <BoxGridSelection
                v-model="scratch.origin.type"
                :items="originTypes"
                aria-labelledby="origin-type-label"
                aria-describedby="origin-type-help"
              />
              <HelperText
                id="origin-type-help"
                kind="helper"
                label="Decides what the origin is addressed by: a host, a storage location, or a region."
              />
            </div>

            <template v-for="field in originFields" :key="field.name">
${indent(
  [
    `<div
  v-if="field.kind === 'select'"
  :data-field-invalid="!!errors['origin.' + field.name] || null"
  class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
>
  <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
    <Label :for="'origin-' + field.name" :required="!!errors['origin.' + field.name]">
      {{ field.label }}
    </Label>
  </div>
  <Select
    v-model="scratch.origin.values[field.name]"
    size="large"
    class="w-full"
    :display-value="labelFor(field.options)"
    :required="!!errors['origin.' + field.name]"
    :placeholder="'Select a ' + field.label.toLowerCase()"
  >
    <Select.Trigger
      :id="'origin-' + field.name"
      :aria-label="field.label"
      :aria-describedby="'origin-' + field.name + '-helper'"
    />
    <Select.Content>
      <Select.Option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </Select.Option>
    </Select.Content>
  </Select>
  <HelperText :id="'origin-' + field.name + '-helper'" :kind="errors['origin.' + field.name] ? 'required' : 'helper'">
    {{ errors['origin.' + field.name] || field.description }}
  </HelperText>
</div>`,
    scratchText({
      id: "'origin-' + field.name",
      model: 'scratch.origin.values[field.name]',
      error: "errors['origin.' + field.name]",
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

const PROJECT_STEP = `<div v-if="stepIndex === 0" class="flex min-w-0 flex-col gap-(--layout-section-gap)">
${indent(projectBindingCard({ mode: 'projectMode', name: 'projectName', picker: 'projectPicker' }), 1)}

${indent(PROJECT_LAYER, 1)}
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
  {{ platformDomainSuffix }}
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
      'Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen. It also names the service and its deployment.',
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
        'A full hostname, like www.example.com. Add its DNS record once the service exists. The run does not wait on it.',
      model: 'form.domainHost',
      error: 'errors.domainHost',
      placeholder: 'www.example.com'
    }),
    requiredStack({
      id: 'service-name',
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
        The service is created as
        <span class="text-(--text-default)">{{ names.service || 'unnamed' }}</span>. Add more domains to it once it exists.
      </p>
    </div>
  </template>
</CardBox>`

const sectionGap = (markup) => `<div class="mt-(--layout-section-gap)">
${indent(markup, 1)}
</div>`

const ENVIRONMENT_CARD = sectionGap(`<CardBox title="Environment and certificate">
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
/>`
  }),
  3
)}

      <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
${indent(
  selectStack({
    id: 'certificate',
    label: 'Certificate',
    hint: 'One certificate per service, not per domain on it.',
    model: 'form.certificate',
    options: 'certificates'
  }),
  4
)}
      </div>
    </div>
  </template>
</CardBox>`)

const DEPLOYMENT_CARD = sectionGap(`<CardBox :padded="false" title="Deployment">
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
${indent(iconTile('pi pi-cloud-upload'), 6)}
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ names.deployment || 'Named from the domain' }}</Item.Title>
            <Item.Description>
              Created with the service, on the default settings. Change them from Deployments once it exists.
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.List>
    </div>

    <div v-else class="min-w-0 pt-(--spacing-md)">
${indent(pickerList({ picker: 'deploymentPicker', noun: 'deployment', icon: 'pi pi-cloud-upload' }), 3)}
    </div>
  </template>
</CardBox>`)

const ADVANCED = collapsibleSection({
  title: 'Advanced',
  icon: 'pi pi-cog',
  hint: "Every field here already carries the endpoint's own default, and all of them can be changed once the service exists.",
  regionId: 'create-service-advanced',
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
    id: 'error-page',
    label: 'Error page',
    description: 'Optional. Without one, the service falls back to the default pages.',
    model: 'form.errorPage',
    options: 'errorPages',
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
          <Item.Title>Allow the platform domain</Item.Title>
          <Item.Description>
            Serve traffic on the provisioned
            {{ names.service ? names.service + platformDomainSuffix : 'platform domain' }}
            alongside your own. Turn it off once your own domain answers instead.
          </Item.Description>
        </Item.Content>
        <Item.Actions>
          <Switch v-model="form.allowPlatformDomain" aria-label="Allow the platform domain" />
        </Item.Actions>
      </Item>
      <Item size="small">
        <Item.Content>
          <Item.Title>Active</Item.Title>
          <Item.Description>
            When disabled, the service is created but does not serve traffic.
          </Item.Description>
        </Item.Content>
        <Item.Actions>
          <Switch v-model="form.active" aria-label="Active" />
        </Item.Actions>
      </Item>
    </Item.List>
  </template>
</CardBox>`
})

const BINDING_STEP = `<template v-else>
  <div class="mb-(--layout-section-gap)">
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item size="small">
            <Item.Media>
  ${indent(iconTile('pi pi-box'), 6)}
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ boundName || 'No project' }}</Item.Title>
              <Item.Description>{{ projectSummary }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button type="button" label="Change" kind="text" size="small" @click="stepIndex = 0" />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>
  </div>

  <div class="flex min-w-0 flex-col">
${indent([DOMAIN_CARD, ENVIRONMENT_CARD, DEPLOYMENT_CARD, ADVANCED].join('\n\n'), 2)}
  </div>
</template>`

const TEMPLATE = wizardPage({
  title: 'Create Service',
  titleId: 'create-service-title',
  description:
    'A service is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both.',
  backLabel: 'Back to Services',
  body: `${PROJECT_STEP}\n\n${BINDING_STEP}`
})

const meta = {
  title: 'Templates/Platform/Creation/ProvisionWizard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A two-step creation wizard that provisions a resource and binds it to another: the creation header, a Stepper rail that only lets you go back, a page heading over the form column, and a footer that fades in over the canvas with Back and the primary action, Next and then Create and deploy. Step one binds the project the service serves, either an existing one from the paged list (ResourcePicker) or a new one whose cache settings and origin are set right there. Step two reads the chosen project back with a Change button, then asks for the domain (a free platform-domain prefix or your own hostname, previewed as the address traffic arrives on), the environment and certificate, the deployment the first release is cut against, and an Advanced disclosure. Submitting runs the provisioning log plotted in DeploymentFlow and ends on DeploySuccess. Built from `GlobalHeader`, `Stepper`, `CardBox`, `SegmentedButton`, `FieldText`, `FieldSelect`, `Label`, `InputText`, `HelperText`, `Item`, `Skeleton`, `Switch`, `BoxGridSelection`, `Select`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'provision wizard',
        'create service wizard',
        'two-step wizard',
        'stepper form',
        'bind domain and deployment',
        'create and deploy',
        'multi-step create',
        'assistente de criação',
        'assistente em etapas',
        'criar serviço'
      ],
      skills: ['webkit-create-surface', 'webkit-form', 'webkit-errors'],
      steps: ['project', 'domain-and-deployment']
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: useCreateService(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const Project = story(
  { stepIndex: 0, mode: 'existing', project: '', domainPrefix: '' },
  'The first step: the Project card on Existing project with nothing selected yet, and only Next in the footer. Next with no selection flags the list.'
)

export const NewProject = story(
  { stepIndex: 0, mode: 'new', project: '', domainPrefix: '' },
  'New project: the Name field replaces the list and the project is configured in place, with the Cache Settings switches and the Add an origin switch, each opening its own fields.'
)

export const DomainAndDeployment = story(
  { stepIndex: 1, mode: 'existing', project: 'web-app', domainPrefix: 'my-first-app' },
  'The second step with web-app bound: the read-back row with Change, the Domain card on a free platform domain previewing https://my-first-app.example.com, Environment and certificate, the Deployment card creating one, the collapsed Advanced section, and Back plus Create and deploy.'
)
