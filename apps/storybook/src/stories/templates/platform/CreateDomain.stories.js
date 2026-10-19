import Button from '@aziontech/webkit/button'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import FieldInputGroup from '@aziontech/webkit/field-input-group'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import FieldSelect from '@aziontech/webkit/field-select'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import Label from '@aziontech/webkit/label'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_forms-markup'

const DOMAIN_SUFFIX = '.azion.run'

const ADD_ENVIRONMENT = '__add-environment__'

const ENVIRONMENT_OPTIONS = [
  { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
  { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' },
  { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' }
]

const POLICY_LABELS = { single_version: 'Single', versioned_urls: 'Versioned' }

const CONNECTED_ENVIRONMENTS = ['Production', 'Stage']

const CERTIFICATE_OPTIONS = [
  { value: '', label: 'Azion (free)', subject: '' },
  { value: 'edgeflow.com wildcard', label: 'edgeflow.com wildcard', subject: '*.edgeflow.com' },
  { value: 'api.edgeflow.com', label: 'api.edgeflow.com', subject: 'api.edgeflow.com' },
  { value: 'staging wildcard', label: 'staging wildcard', subject: '*.staging.edgeflow.com' },
  { value: 'azion.design', label: 'azion.design', subject: 'azion.design' }
]

const EDITING_DOMAIN = {
  kind: 'own',
  domain: 'www.edgeflow.com',
  environment: 'Production',
  certificate: 'edgeflow.com wildcard'
}

const kindOptions = (resource) => [
  {
    value: 'free',
    label: 'Get a free Azion Domain',
    description: 'You can use a free azion.run domain.'
  },
  {
    value: 'own',
    label: 'Bring my own Domain',
    description: `Use your own DNS and point it to your Azion ${resource}.`
  }
]

const addDescription = (resource) =>
  `A domain is what puts an environment on this ${resource}. Say where it answers, and name the address.`

const EDIT_DESCRIPTION =
  'Change where it answers, the address, or the certificate it is served with.'

const freeDomainNote = (resource) =>
  `Your ${resource} is always accessible at an azion.run subdomain based on its name. Custom domains allow visitors to reach your project at your own domain.`

const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })

const covers = (subject, host) =>
  subject === host ||
  (subject.startsWith('*.') &&
    host.endsWith(subject.slice(1)) &&
    !host.slice(0, -(subject.length - 1)).includes('.'))

const certificateFor = (host) => {
  const covering = CERTIFICATE_OPTIONS.filter(
    (option) => option.subject && covers(option.subject, host)
  )
  return (covering.find((option) => option.subject === host) ?? covering[0])?.value ?? ''
}

const DRAWER_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import FieldInputGroup from '@aziontech/webkit/field-input-group'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Label from '@aziontech/webkit/label'",
  "import Message from '@aziontech/webkit/message'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'"
]

const DROPDOWN_IMPORTS = [
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'"
]

const VUE_IMPORT = "import { computed, reactive, ref, watch } from 'vue'"

const formScript = ({ resource, editing }) => [
  'const open = ref(false)',
  'const submitted = ref(false)',
  'const certificateTouched = ref(false)',
  '',
  `const domainSuffix = '${DOMAIN_SUFFIX}'`,
  declare('environmentOptions', ENVIRONMENT_OPTIONS),
  declare('policyLabels', POLICY_LABELS),
  declare('connectedEnvironments', CONNECTED_ENVIRONMENTS),
  declare('certificateOptions', CERTIFICATE_OPTIONS),
  declare('kindOptions', kindOptions(resource)),
  ...(editing ? [declare('editingDomain', EDITING_DOMAIN)] : []),
  '',
  "const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })",
  'const form = reactive(blankForm())',
  '',
  'const missing = (value) => submitted.value && !value.trim()',
  'const covers = (subject, host) =>',
  '  subject === host ||',
  "  (subject.startsWith('*.') &&",
  '    host.endsWith(subject.slice(1)) &&',
  "    !host.slice(0, -(subject.length - 1)).includes('.'))",
  'const certificateFor = (host) => {',
  '  const covering = certificateOptions.filter((option) => option.subject && covers(option.subject, host))',
  "  return (covering.find((option) => option.subject === host) ?? covering[0])?.value ?? ''",
  '}',
  '',
  'const fullDomain = computed(() => {',
  '  const name = form.domain.trim()',
  "  if (!name) return ''",
  "  return form.kind === 'free' ? name + domainSuffix : name",
  '})',
  '',
  'const chosen = computed(() => environmentOptions.find((option) => option.value === form.environment))',
  'const environmentHint = computed(() => {',
  "  if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'",
  '  const policy = policyLabels[chosen.value.deploymentPolicy]',
  '  return connectedEnvironments.includes(chosen.value.value)',
  "    ? chosen.value.label + ' publishes with the Deployment Settings set to ' + policy + '.'",
  `    : "This ${resource} doesn't publish into " + chosen.value.label + ' yet. Adding this domain connects it, served by the Deployment Settings set to ' + policy + '.'`,
  '})',
  '',
  'const certificateHint = computed(() => {',
  "  if (!form.certificate) return 'Served by the free Azion certificate, issued and renewed by the platform.'",
  '  return certificateTouched.value',
  "    ? 'Served with ' + form.certificate + '.'",
  "    : form.certificate + ' already covers this address, so it is selected. Change it if another one should serve it.'",
  '})',
  '',
  'watch(',
  '  () => [fullDomain.value, form.kind],',
  '  ([host, kind]) => {',
  "    if (kind === 'free') {",
  "      form.certificate = ''",
  '      return',
  '    }',
  '    if (!certificateTouched.value) form.certificate = certificateFor(host.toLowerCase())',
  '  },',
  '  { immediate: true }',
  ')',
  '',
  ...(editing
    ? [
        'watch(open, (isOpen) => {',
        '  submitted.value = false',
        '  certificateTouched.value = isOpen',
        '  Object.assign(form, isOpen ? { ...editingDomain } : blankForm())',
        '})'
      ]
    : [
        'watch(open, () => {',
        '  submitted.value = false',
        '  certificateTouched.value = false',
        '  Object.assign(form, blankForm())',
        '})'
      ]),
  '',
  'const onCertificate = (value) => {',
  '  certificateTouched.value = true',
  '  form.certificate = value',
  '}',
  '',
  'const submit = () => {',
  '  submitted.value = true',
  '  if (form.domain.trim() && form.environment) open.value = false',
  '}'
]

const formState = ({ resource, editing }) => {
  const open = ref(false)
  const submitted = ref(false)
  const certificateTouched = ref(false)
  const form = reactive(blankForm())
  const missing = (value) => submitted.value && !value.trim()
  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? name + DOMAIN_SUFFIX : name
  })
  const chosen = computed(() =>
    ENVIRONMENT_OPTIONS.find((option) => option.value === form.environment)
  )
  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = POLICY_LABELS[chosen.value.deploymentPolicy]
    return CONNECTED_ENVIRONMENTS.includes(chosen.value.value)
      ? `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
      : `This ${resource} doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
  })
  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free Azion certificate, issued and renewed by the platform.'
    }
    return certificateTouched.value
      ? `Served with ${form.certificate}.`
      : `${form.certificate} already covers this address, so it is selected. Change it if another one should serve it.`
  })
  watch(
    () => [fullDomain.value, form.kind],
    ([host, kind]) => {
      if (kind === 'free') {
        form.certificate = ''
        return
      }
      if (!certificateTouched.value) form.certificate = certificateFor(host.toLowerCase())
    },
    { immediate: true }
  )
  watch(open, (isOpen) => {
    submitted.value = false
    certificateTouched.value = Boolean(editing) && isOpen
    Object.assign(form, editing && isOpen ? { ...editing } : blankForm())
  })
  const onCertificate = (value) => {
    certificateTouched.value = true
    form.certificate = value
  }
  const submit = () => {
    submitted.value = true
    if (form.domain.trim() && form.environment) open.value = false
  }
  return {
    open,
    form,
    missing,
    environmentOptions: ENVIRONMENT_OPTIONS,
    connectedEnvironments: CONNECTED_ENVIRONMENTS,
    certificateOptions: CERTIFICATE_OPTIONS,
    kindOptions: kindOptions(resource),
    environmentHint,
    certificateHint,
    onCertificate,
    submit
  }
}

const components = {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DropdownGroup,
  DropdownOption,
  DropdownRoot,
  DropdownTrigger,
  FieldInputGroup,
  FieldRadioBlock,
  FieldSelect,
  Hint,
  IconButton,
  Label,
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Tooltip
}

const section = (title, hint, body) => `<section class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
    <h2 class="text-balance text-heading-xxs text-(--text-default)">${title}</h2>
    <Hint text="${hint}" />
  </div>
${indent(body)}
</section>`

const ENVIRONMENT_FIELD = `<FieldSelect
  v-model="form.environment"
  label="Environment"
  input-id="domain-environment"
  size="large"
  placeholder="Select an environment"
  :options="environmentOptions"
  :required="missing(form.environment)"
  :helper-text="missing(form.environment) ? 'This field is required.' : environmentHint"
/>`

const domainFields = (resource) => `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
    <Label id="domain-source-label">Domain source</Label>
    <div role="radiogroup" aria-labelledby="domain-source-label" class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <FieldRadioBlock
        v-for="option in kindOptions"
        :key="option.value"
        v-model="form.kind"
        :value="option.value"
        name="domain-kind"
        :input-id="'domain-kind-' + option.value"
        :label="option.label"
        :description="option.description"
      />
    </div>
  </div>

  <FieldInputGroup
    v-model="form.domain"
    label="Domain"
    input-id="domain-name"
    placeholder="my-workload"
    :required="missing(form.domain)"
    :helper-text="missing(form.domain) ? 'This field is required.' : ''"
  >
    <template v-if="form.kind === 'free'" #right>${DOMAIN_SUFFIX}</template>
  </FieldInputGroup>

  <FieldSelect
    v-if="form.kind === 'own'"
    :model-value="form.certificate"
    label="Certificate"
    input-id="domain-certificate"
    size="large"
    :options="certificateOptions"
    :helper-text="certificateHint"
    @update:model-value="onCertificate"
  />

  <Message severity="info" label="${freeDomainNote(resource)}" />
</div>`

const drawer = ({
  resource,
  title,
  description,
  save
}) => `<Drawer v-model:open="open" side="right" size="medium">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form class="flex min-h-0 flex-1 flex-col" aria-label="${title}" novalidate @submit.prevent="submit">
        <PanelHeader>
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>${title}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              ${description}
            </p>
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0">
            <legend class="sr-only">${title}</legend>
${indent(section('Environment', 'Where the domain answers.', ENVIRONMENT_FIELD), 6)}

${indent(
  section(
    'Domain',
    'The address this workload answers on, where it comes from, and the certificate it is served with.',
    domainFields(resource)
  ),
  6
)}
          </fieldset>
        </PanelContent>

        <PanelFooter>
          <div class="ml-auto flex items-center gap-(--spacing-sm)">
            <Button label="${save}" kind="primary" size="medium" @click="submit" />
          </div>
          <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">${save}</button>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const ADD_DOMAIN_BUTTON = `<Button label="Add Domain" kind="outlined" size="medium" icon="pi pi-plus" @click="open = true" />`

const ROW_ACTIONS = `<DropdownRoot placement="bottom-end" @select="(event, value) => onRowAction(value)">
  <DropdownTrigger>
    <Tooltip text="Row actions">
      <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Actions for www.edgeflow.com" />
    </Tooltip>
  </DropdownTrigger>
  <DropdownGroup>
    <DropdownOption value="edit" label="Edit">
      <template #left><i class="pi pi-pencil" aria-hidden="true" /></template>
    </DropdownOption>
  </DropdownGroup>
  <DropdownGroup>
    <DropdownOption value="delete" label="Delete">
      <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
    </DropdownOption>
  </DropdownGroup>
</DropdownRoot>`

const ENVIRONMENT_MENU = `<Tooltip text="Select an environment to see its deployment and settings, or add another one">
  <DropdownRoot placement="bottom-end" @select="(event, value) => onSelect(value)">
    <DropdownTrigger>
      <span
        class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
      >
        <i class="ai ai-layers shrink-0 text-(--text-muted)" aria-hidden="true" />
        <span class="truncate">{{ selectedEnvironment }}</span>
        <i class="pi pi-chevron-down shrink-0 text-(--text-muted)" aria-hidden="true" />
      </span>
    </DropdownTrigger>
    <DropdownGroup label="Environments">
      <DropdownOption
        v-for="name in connectedEnvironments"
        :key="name"
        :value="name"
        :label="name"
        :selected="name === selectedEnvironment"
      />
    </DropdownGroup>
    <DropdownGroup>
      <DropdownOption :value="ADD_ENVIRONMENT" label="Add Environment">
        <template #left><i class="pi pi-plus" aria-hidden="true" /></template>
      </DropdownOption>
    </DropdownGroup>
  </DropdownRoot>
</Tooltip>`

const VARIANTS = {
  addDomain: {
    resource: 'workload',
    editing: null,
    title: 'Add Domain',
    save: 'Add Domain',
    trigger: ADD_DOMAIN_BUTTON,
    imports: [],
    script: [],
    setup: () => ({})
  },
  addEnvironment: {
    resource: 'workload',
    editing: null,
    title: 'Add Environment',
    save: 'Add Environment',
    trigger: ENVIRONMENT_MENU,
    imports: [...DROPDOWN_IMPORTS, "import Tooltip from '@aziontech/webkit/tooltip'"],
    script: [
      `const ADD_ENVIRONMENT = '${ADD_ENVIRONMENT}'`,
      "const selectedEnvironment = ref('Production')",
      'const onSelect = (value) => {',
      '  if (value === ADD_ENVIRONMENT) {',
      '    open.value = true',
      '    return',
      '  }',
      '  selectedEnvironment.value = value',
      '}'
    ],
    setup: (state) => {
      const selectedEnvironment = ref('Production')
      const onSelect = (value) => {
        if (value === ADD_ENVIRONMENT) {
          state.open.value = true
          return
        }
        selectedEnvironment.value = value
      }
      return { ADD_ENVIRONMENT, selectedEnvironment, onSelect }
    }
  },
  editDomain: {
    resource: 'workload',
    editing: EDITING_DOMAIN,
    title: 'Edit Domain',
    save: 'Save Domain',
    trigger: ROW_ACTIONS,
    imports: [
      ...DROPDOWN_IMPORTS,
      "import IconButton from '@aziontech/webkit/icon-button'",
      "import Tooltip from '@aziontech/webkit/tooltip'"
    ],
    script: ['const onRowAction = (value) => {', "  if (value === 'edit') open.value = true", '}'],
    setup: (state) => ({
      onRowAction: (value) => {
        if (value === 'edit') state.open.value = true
      }
    })
  },
  inApplication: {
    resource: 'application',
    editing: null,
    title: 'Add Domain',
    save: 'Add Domain',
    trigger: ADD_DOMAIN_BUTTON,
    imports: [],
    script: [],
    setup: () => ({})
  }
}

const sortImports = (lines) =>
  [...new Set(lines)].sort((left, right) => {
    const name = (line) => line.split(' ')[1]
    return name(left).localeCompare(name(right))
  })

const templateFor = (variant) =>
  `${variant.trigger}\n\n${drawer({
    resource: variant.resource,
    title: variant.title,
    description: variant.editing ? EDIT_DESCRIPTION : addDescription(variant.resource),
    save: variant.save
  })}`

const scriptFor = (variant) => [
  ...sortImports([...DRAWER_IMPORTS, ...variant.imports]),
  VUE_IMPORT,
  '',
  ...formScript(variant),
  ...(variant.script.length ? ['', ...variant.script] : [])
]

const story = (variant, text) => {
  const template = templateFor(variant)
  return {
    render: () => ({
      components,
      setup: () => {
        const state = formState(variant)
        return { ...state, ...variant.setup(state) }
      },
      template
    }),
    parameters: {
      controls: { disable: true },
      docs: {
        description: { story: text },
        source: { code: toSfc(scriptFor(variant), template) }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Forms/CreateDomain',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Add Domain drawer, the pattern form every create drawer in the console follows: a panel header with the title and a one-line description, an Environment section and a Domain section each titled with a Hint, and one primary action in the footer that flags empty required fields only after it is pressed. It opens from Add Domain under Domains on the Workload Settings and Application Settings pages, from a domain row menu to edit it, and from Add Environment in the workload summary environment menu. Choosing Bring my own Domain drops the azion.run addon and reveals the Certificate select, preselecting a certificate that already covers the address. Built from `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FieldSelect`, `FieldInputGroup` with its addon slot, `FieldRadioBlock` under a `Label`, `Hint`, `Message` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  VARIANTS.addDomain,
  'Closed until the Add Domain button under a workload domains card opens it: a free azion.run address by default, with Environment and Domain flagged as required only after Add Domain is pressed empty.'
)

export const AddEnvironment = story(
  VARIANTS.addEnvironment,
  'The same form opened from Add Environment in the workload summary environment menu, titled and saved as Add Environment.'
)

export const EditDomain = story(
  VARIANTS.editDomain,
  'Edit from a domain row menu: the drawer opens on www.edgeflow.com as a domain of its own, so the Certificate select shows with edgeflow.com wildcard and the footer saves the domain.'
)

export const InApplication = story(
  VARIANTS.inApplication,
  'Opened from Add Domain on the Application Settings page, where the copy speaks of the application instead of the workload.'
)
