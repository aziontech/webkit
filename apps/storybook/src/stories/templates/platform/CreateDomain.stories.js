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
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import Label from '@aziontech/webkit/label'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Select from '@aziontech/webkit/select'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare, DRAWER_SHELL_IMPORTS, drawerShell, fieldStack, section } from './_forms-markup'

const DOMAIN_SUFFIX = '.azion.run'

const ADD_ENVIRONMENT = '__add-environment__'

const CREATE_ENVIRONMENT = '__create-environment__'

const ENVIRONMENT_OPTIONS = [
  { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
  { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' },
  { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' }
]

const POLICY_LABELS = { single_version: 'Single', versioned_urls: 'Versioned' }

const WORKLOAD_ENVIRONMENTS = ['Production', 'Preview']

const CERTIFICATE_OPTIONS = [
  { value: '', label: 'Azion (free)', subject: '' },
  { value: 'cert-8801', label: 'edgeflow.com wildcard', subject: '*.edgeflow.com' },
  { value: 'cert-8803', label: 'api.edgeflow.com', subject: 'api.edgeflow.com' },
  { value: 'cert-8805', label: 'staging wildcard', subject: '*.staging.edgeflow.com' },
  { value: 'cert-8802', label: 'azion.design', subject: 'azion.design' }
]

const EDITING_DOMAIN = {
  kind: 'own',
  domain: 'www.edgeflow.com',
  environment: 'Production',
  certificate: 'cert-8801'
}

const KIND_OPTIONS = [
  {
    value: 'free',
    label: 'Get a free Azion Domain',
    description: 'You can use a free azion.run domain.'
  },
  {
    value: 'own',
    label: 'Bring my own Domain',
    description: 'Use your own DNS and point it to your Azion workload.'
  }
]

const ADD_DESCRIPTION =
  'A domain is what puts an environment on this workload. Say where it answers, and name the address.'

const EDIT_DESCRIPTION =
  'Change where it answers, the address, or the certificate it is served with.'

const FREE_DOMAIN_NOTE =
  'Your workload is always accessible at an azion.run subdomain based on its name. Custom domains allow visitors to reach your project at your own domain.'

const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })

const subjectCovers = (subject, host) => {
  const pattern = subject.toLowerCase()
  if (!pattern) return false
  if (pattern === host) return true
  if (!pattern.startsWith('*.')) return false
  const parent = pattern.slice(2)
  return host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
}

const certificateForDomain = (host) => {
  const name = host.trim().toLowerCase()
  if (!name) return ''
  const candidates = CERTIFICATE_OPTIONS.filter((option) => subjectCovers(option.subject, name))
  const exact = candidates.find((option) => option.subject.toLowerCase() === name)
  return (exact ?? candidates[0])?.value ?? ''
}

const DRAWER_IMPORTS = [
  ...DRAWER_SHELL_IMPORTS.filter((line) => !line.includes('drawer-trigger')),
  "import FieldInputGroup from '@aziontech/webkit/field-input-group'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Label from '@aziontech/webkit/label'",
  "import Message from '@aziontech/webkit/message'",
  "import Select from '@aziontech/webkit/select'"
]

const DROPDOWN_IMPORTS = [
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'"
]

const VUE_IMPORT = "import { computed, reactive, ref, watch } from 'vue'"

const formScript = ({ editing }) => [
  'const open = ref(false)',
  'const submitting = ref(false)',
  'const environmentSelectOpen = ref(false)',
  `const certificateTouched = ref(${editing ? 'true' : 'false'})`,
  '',
  `const CREATE_ENVIRONMENT = '${CREATE_ENVIRONMENT}'`,
  declare('environmentOptions', ENVIRONMENT_OPTIONS),
  declare('policyLabels', POLICY_LABELS),
  declare('workloadEnvironments', WORKLOAD_ENVIRONMENTS),
  declare('certificateOptions', CERTIFICATE_OPTIONS),
  declare('kindOptions', KIND_OPTIONS),
  ...(editing ? [declare('editingDomain', EDITING_DOMAIN)] : []),
  '',
  "const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })",
  `const form = reactive(${editing ? '{ ...editingDomain }' : 'blankForm()'})`,
  "const errors = reactive({ domain: '', environment: '' })",
  '',
  'const environmentLabel = (value) =>',
  "  environmentOptions.find((option) => option.value === value)?.label ?? ''",
  'const certificateLabel = (value) =>',
  "  certificateOptions.find((option) => option.value === value)?.label ?? ''",
  '',
  'const subjectCovers = (subject, host) => {',
  '  const pattern = subject.toLowerCase()',
  '  if (!pattern) return false',
  '  if (pattern === host) return true',
  "  if (!pattern.startsWith('*.')) return false",
  '  const parent = pattern.slice(2)',
  "  return host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1",
  '}',
  '',
  'const certificateForDomain = (host) => {',
  '  const name = host.trim().toLowerCase()',
  "  if (!name) return ''",
  '  const candidates = certificateOptions.filter((option) => subjectCovers(option.subject, name))',
  '  const exact = candidates.find((option) => option.subject.toLowerCase() === name)',
  "  return (exact ?? candidates[0])?.value ?? ''",
  '}',
  '',
  'watch(open, (isOpen) => {',
  '  if (!isOpen) return',
  "  Object.assign(errors, { domain: '', environment: '' })",
  '  submitting.value = false',
  `  Object.assign(form, ${editing ? '{ ...editingDomain }' : 'blankForm()'})`,
  `  certificateTouched.value = ${editing ? 'true' : 'false'}`,
  '})',
  '',
  'const fullDomain = computed(() => {',
  '  const name = form.domain.trim()',
  "  if (!name) return ''",
  `  return form.kind === 'free' ? \`\${name}${DOMAIN_SUFFIX}\` : name`,
  '})',
  '',
  'watch(',
  '  () => [fullDomain.value, form.kind],',
  '  ([host, kind]) => {',
  "    if (kind === 'free') {",
  "      form.certificate = ''",
  '      return',
  '    }',
  '    if (certificateTouched.value) return',
  '    form.certificate = certificateForDomain(host)',
  '  },',
  '  { immediate: true }',
  ')',
  '',
  'const onCertificate = (value) => {',
  '  certificateTouched.value = true',
  '  form.certificate = value',
  '}',
  '',
  'const certificateHint = computed(() => {',
  '  if (!form.certificate) {',
  "    return 'Served by the free Azion certificate, issued and renewed by the platform.'",
  '  }',
  '  const name = certificateLabel(form.certificate)',
  '  return certificateTouched.value',
  '    ? `Served with ${name}.`',
  '    : `${name} already covers this address, so it is selected. Change it if another one should serve it.`',
  '})',
  '',
  'const chosen = computed(() =>',
  '  environmentOptions.find((option) => option.value === form.environment)',
  ')',
  '',
  'const joinsWorkload = computed(',
  '  () => Boolean(form.environment) && !workloadEnvironments.includes(form.environment)',
  ')',
  '',
  'const environmentHint = computed(() => {',
  "  if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'",
  '  const policy = policyLabels[chosen.value.deploymentPolicy]',
  '  return joinsWorkload.value',
  "    ? `This workload doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`",
  '    : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`',
  '})',
  '',
  'const onEnvironmentModel = (value) => {',
  '  if (value === CREATE_ENVIRONMENT) {',
  '    environmentSelectOpen.value = false',
  '    return',
  '  }',
  '  form.environment = value',
  "  errors.environment = ''",
  '}',
  '',
  'const validate = () => {',
  "  errors.domain = form.domain.trim() ? '' : 'This field is required.'",
  "  errors.environment = form.environment ? '' : 'This field is required.'",
  '  return !errors.domain && !errors.environment',
  '}',
  '',
  'const submit = () => {',
  '  if (submitting.value) return',
  '  if (!validate()) return',
  '  submitting.value = true',
  '  setTimeout(() => {',
  '    submitting.value = false',
  '    open.value = false',
  '  }, 600)',
  '}'
]

const formState = ({ editing }) => {
  const open = ref(false)
  const submitting = ref(false)
  const environmentSelectOpen = ref(false)
  const certificateTouched = ref(Boolean(editing))
  const form = reactive(editing ? { ...editing } : blankForm())
  const errors = reactive({ domain: '', environment: '' })
  const environmentLabel = (value) =>
    ENVIRONMENT_OPTIONS.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value) =>
    CERTIFICATE_OPTIONS.find((option) => option.value === value)?.label ?? ''
  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(errors, { domain: '', environment: '' })
    submitting.value = false
    Object.assign(form, editing ? { ...editing } : blankForm())
    certificateTouched.value = Boolean(editing)
  })
  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}${DOMAIN_SUFFIX}` : name
  })
  watch(
    () => [fullDomain.value, form.kind],
    ([host, kind]) => {
      if (kind === 'free') {
        form.certificate = ''
        return
      }
      if (certificateTouched.value) return
      form.certificate = certificateForDomain(host)
    },
    { immediate: true }
  )
  const onCertificate = (value) => {
    certificateTouched.value = true
    form.certificate = value
  }
  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free Azion certificate, issued and renewed by the platform.'
    }
    const name = certificateLabel(form.certificate)
    return certificateTouched.value
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })
  const chosen = computed(() =>
    ENVIRONMENT_OPTIONS.find((option) => option.value === form.environment)
  )
  const joinsWorkload = computed(
    () => Boolean(form.environment) && !WORKLOAD_ENVIRONMENTS.includes(form.environment)
  )
  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = POLICY_LABELS[chosen.value.deploymentPolicy]
    return joinsWorkload.value
      ? `This workload doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      :`${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })
  const onEnvironmentModel = (value) => {
    if (value === CREATE_ENVIRONMENT) {
      environmentSelectOpen.value = false
      return
    }
    form.environment = value
    errors.environment = ''
  }
  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    errors.environment = form.environment ? '' : 'This field is required.'
    return !errors.domain && !errors.environment
  }
  const submit = () => {
    if (submitting.value) return
    if (!validate()) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 600)
  }
  return {
    open,
    submitting,
    environmentSelectOpen,
    CREATE_ENVIRONMENT,
    environmentOptions: ENVIRONMENT_OPTIONS,
    workloadEnvironments: WORKLOAD_ENVIRONMENTS,
    certificateOptions: CERTIFICATE_OPTIONS,
    kindOptions: KIND_OPTIONS,
    form,
    errors,
    environmentLabel,
    certificateLabel,
    onCertificate,
    certificateHint,
    environmentHint,
    onEnvironmentModel,
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
  HelperText,
  Hint,
  IconButton,
  Label,
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Tooltip
}

const ENVIRONMENT_SELECT = `<Select
  v-model:open="environmentSelectOpen"
  :model-value="form.environment"
  size="large"
  class="w-full"
  placeholder="Select an environment"
  :disabled="submitting"
  :invalid="!!errors.environment"
  :display-value="environmentLabel"
  @update:model-value="onEnvironmentModel"
>
  <Select.Trigger id="domain-environment" aria-describedby="domain-environment-helper" />
  <Select.Content>
    <Select.Option v-for="option in environmentOptions" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
    <template #footer>
      <Select.Option :value="CREATE_ENVIRONMENT" class="w-full">
        Create Environment
      </Select.Option>
    </template>
  </Select.Content>
</Select>`

const ENVIRONMENT_FIELD = fieldStack({
  label: 'Environment',
  id: 'domain-environment',
  required: '!!errors.environment',
  description: '{{ environmentHint }}',
  message: 'errors.environment',
  control: ENVIRONMENT_SELECT
})

const DOMAIN_SOURCE_FIELD = `<div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
  <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
    <Label id="domain-source-label">Domain source</Label>
  </div>
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
      :disabled="submitting"
    />
  </div>
</div>`

const DOMAIN_FIELD = fieldStack({
  component: 'FieldInputGroup',
  label: 'Domain',
  id: 'domain-name',
  message: 'errors.domain',
  attrs: `v-model="form.domain"
placeholder="my-workload"
:disabled="submitting"
@update:model-value="errors.domain = ''"`,
  slots: `<template v-if="form.kind === 'free'" #right>${DOMAIN_SUFFIX}</template>`
})

const CERTIFICATE_FIELD = `<template v-if="form.kind === 'own'">
${indent(
  fieldStack({
    label: 'Certificate',
    id: 'domain-certificate',
    description: '{{ certificateHint }}',
    control: `<Select
  :model-value="form.certificate"
  size="large"
  class="w-full"
  :disabled="submitting"
  :display-value="certificateLabel"
  @update:model-value="onCertificate"
>
  <Select.Trigger id="domain-certificate" aria-describedby="domain-certificate-helper" />
  <Select.Content>
    <Select.Option v-for="option in certificateOptions" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`
  })
)}
</template>`

const DRAWER_BODY = `${section({
  title: 'Environment',
  hint: 'Where the domain answers.',
  body: ENVIRONMENT_FIELD
})}

${section({
  title: 'Domain',
  hint: 'The address this workload answers on, where it comes from, and the certificate it is served with.',
  body: `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(
  [
    DOMAIN_SOURCE_FIELD,
    DOMAIN_FIELD,
    CERTIFICATE_FIELD,
    `<Message severity="info" label="${FREE_DOMAIN_NOTE}" />`
  ].join('\n\n')
)}
</div>`
})}`

const ADD_DOMAIN_BUTTON = `<Button type="button" label="Add Domain" kind="outlined" size="medium" icon="pi pi-plus" @click="open = true" />`

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
        v-for="name in workloadEnvironments"
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
    editing: null,
    title: 'Add Domain',
    save: 'Add Domain',
    trigger: ADD_DOMAIN_BUTTON,
    imports: [],
    script: [],
    setup: () => ({})
  },
  addEnvironment: {
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
  }
}

const sortImports = (lines) =>
  [...new Set(lines)].sort((left, right) => {
    const name = (line) => line.split(' ')[1]
    return name(left).localeCompare(name(right))
  })

const templateFor = (variant) =>
  `${variant.trigger}\n\n${drawerShell({
    title: variant.title,
    description: variant.editing ? EDIT_DESCRIPTION : ADD_DESCRIPTION,
    saveLabel: variant.save,
    body: DRAWER_BODY
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
          'The Add Domain drawer of a workload, built on the console resource drawer: a panel header with the title and a one-line description, an Environment section and a Domain section each titled with a Hint, and one submit button in the footer that flags empty required fields only after it is pressed. It opens from Add Domain under Domains on the Workload Settings tab, from a domain row menu to edit it, and from Add Environment in the workload summary environment menu. The Environment select lists every environment, says when choosing one connects it to the workload, and ends in a Create Environment option. Choosing Bring my own Domain drops the azion.run addon and reveals the Certificate select, preselecting a certificate that already covers the address. Built from `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FieldInputGroup`, `Label` and `HelperText` around `Select`, `FieldRadioBlock`, `Hint`, `Message` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  VARIANTS.addDomain,
  'Closed until the Add Domain button under a workload Domains card opens it: a free azion.run address by default, with Environment and Domain flagged as required only after Add Domain is pressed empty, and every field reset each time the drawer opens.'
)

export const AddEnvironment = story(
  VARIANTS.addEnvironment,
  'The same form opened from Add Environment in the workload summary environment menu, titled and saved as Add Environment.'
)

export const EditDomain = story(
  VARIANTS.editDomain,
  'Edit from a domain row menu: the drawer opens on www.edgeflow.com as a domain of its own, so the Certificate select shows with edgeflow.com wildcard and the footer saves the domain.'
)
