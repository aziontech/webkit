import { reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  DRAWER_NAMES,
  formDrawer,
  headingAction,
  itemRow,
  itemSection,
  optionSelect,
  pageHeading,
  panelFooter,
  resourceList,
  sectionLabel,
  withHelper
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'ItemGroups in a drawer' }]

const RUNTIMES = [
  { label: 'Node.js 20', value: 'node20' },
  { label: 'Python 3.12', value: 'python312' },
  { label: 'Go 1.22', value: 'go122' }
]

const REGIONS = [
  { label: 'US East (Washington)', value: 'us-east' },
  { label: 'South America (São Paulo)', value: 'sa-east' },
  { label: 'Europe (Frankfurt)', value: 'eu-west' }
]

const SERVICES = [
  { id: 'svc-1', name: 'checkout-api', runtime: 'node20' },
  { id: 'svc-2', name: 'image-resizer', runtime: 'go122' }
]

const BLANK = {
  name: '',
  description: '',
  runtime: '',
  region: 'us-east',
  active: true,
  logging: false
}

const NAMES = [...DRAWER_NAMES, 'CardBox', 'HelperText', 'InputText', 'Item', 'Select', 'Switch']

const labelIn = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''

const NAME_FIELD = withHelper(
  `<InputText
  v-model="form.name"
  size="large"
  :disabled="submitting"
  class="w-full font-code"
  aria-label="Name"
  placeholder="my-service"
  :required="!!errors.name && !form.name.trim()"
  :invalid="!!errors.name && !!form.name.trim()"
  :aria-describedby="errors.name ? 'service-name-error' : undefined"
  @update:model-value="errors.name = ''"
/>`,
  `<HelperText
  v-if="errors.name"
  id="service-name-error"
  :kind="form.name.trim() ? 'invalid' : 'required'"
  :label="errors.name"
/>`
)

const RUNTIME_FIELD = withHelper(
  optionSelect({
    model: 'form.runtime',
    options: 'runtimes',
    display: 'runtimeLabel',
    content: 'z-[1002]!',
    attrs: [
      ':disabled="submitting"',
      'class="w-full"',
      'placeholder="Select a runtime"',
      ':required="!!errors.runtime"'
    ],
    trigger: [
      'id="service-runtime"',
      'aria-label="Runtime"',
      ':aria-describedby="errors.runtime ? \'service-runtime-error\' : undefined"'
    ]
  }).replace(
    '  :display-value="runtimeLabel"\n>',
    '  :display-value="runtimeLabel"\n  @update:model-value="errors.runtime = \'\'"\n>'
  ),
  `<HelperText
  v-if="errors.runtime"
  id="service-runtime-error"
  kind="required"
  :label="errors.runtime"
/>`
)

const switchRow = (title, description, model) =>
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

const DRAWER = formDrawer({
  open: 'drawerOpen',
  size: 'large',
  label: 'Create Service',
  submit: 'submit',
  title: 'Create service',
  description: 'Define a service across grouped sections — all saved together.',
  legend: 'Create service',
  disabled: 'submitting',
  sections: [
    itemSection({
      heading: sectionLabel('General'),
      start: false,
      rows: [
        itemRow({
          title: 'Name',
          description: 'A unique identifier. Lower-case letters, numbers, and hyphen.',
          start: true,
          control: NAME_FIELD
        }),
        itemRow({
          title: 'Description',
          description: 'A short note about what this service does.',
          start: true,
          control: `<InputText
  v-model="form.description"
  size="large"
  :disabled="submitting"
  class="w-full"
  aria-label="Description"
  placeholder="Optional"
/>`
        })
      ]
    }),
    itemSection({
      heading: sectionLabel('Runtime'),
      start: false,
      rows: [
        itemRow({
          title: 'Runtime',
          description: 'The language the service runs on.',
          start: true,
          control: RUNTIME_FIELD
        }),
        itemRow({
          title: 'Region',
          description: 'Where the service is deployed.',
          start: true,
          control: optionSelect({
            model: 'form.region',
            options: 'regions',
            display: 'regionLabel',
            content: 'z-[1002]!',
            attrs: [':disabled="submitting"', 'class="w-full"'],
            trigger: ['id="service-region"', 'aria-label="Region"']
          })
        })
      ]
    }),
    itemSection({
      heading: sectionLabel('Options'),
      start: false,
      rows: [
        switchRow('Active', 'Start the service immediately after creation.', 'active'),
        switchRow('Request logging', 'Record incoming requests for this service.', 'logging')
      ]
    })
  ],
  footer: panelFooter({
    cancel: 'cancel',
    cancelDisabled: 'submitting',
    label: 'Create',
    loading: 'submitting'
  })
})

const TEMPLATE = consolePage({
  main: `<main class="flex h-full flex-col">
${indent(
  pageHeading({
    title: 'Services',
    description:
      'Drawer create whose body is several section-titled ItemGroup sections: the settings layout, in context, with one scoped save.',
    actions: headingAction({ label: 'Create Service', icon: 'pi pi-plus', click: 'openCreate' })
  })
)}

${indent(
  resourceList({
    items: 'services',
    item: 'service',
    name: 'service.name',
    meta: 'runtimeLabel(service.runtime)'
  })
)}
</main>

${DRAWER}`
})

const NAME_PATTERN = /^[a-z0-9-]+$/

const setup = () => {
  const services = ref(SERVICES.map((service) => ({ ...service })))
  const drawerOpen = ref(false)
  const form = reactive({ ...BLANK })
  const errors = reactive({ name: '', runtime: '' })
  const submitting = ref(false)

  watch(drawerOpen, (open) => {
    if (!open) return
    Object.assign(form, BLANK)
    errors.name = ''
    errors.runtime = ''
  })

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'Name is required.'
    else if (!NAME_PATTERN.test(name))
      errors.name = 'Use lower-case letters, numbers, and hyphen only.'
    else errors.name = ''
    errors.runtime = form.runtime ? '' : 'Runtime is required.'
    return !errors.name && !errors.runtime
  }

  const submit = () => {
    if (!validate()) return
    services.value = [
      { id: `svc-${Date.now()}`, name: form.name.trim(), runtime: form.runtime },
      ...services.value
    ]
    drawerOpen.value = false
  }

  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      runtimes: RUNTIMES,
      runtimeLabel: labelIn(RUNTIMES),
      regions: REGIONS,
      regionLabel: labelIn(REGIONS),
      services,
      drawerOpen,
      form,
      errors,
      submitting,
      openCreate: () => {
        drawerOpen.value = true
      },
      cancel: () => {
        drawerOpen.value = false
      },
      submit
    }
  })
}

const SCRIPT = consoleScript({
  breadcrumb: BREADCRUMB,
  names: NAMES,
  vue: ['reactive', 'ref', 'watch'],
  body: [
    declare('runtimes', RUNTIMES),
    "const runtimeLabel = (value) => runtimes.find((option) => option.value === value)?.label ?? ''",
    declare('regions', REGIONS),
    "const regionLabel = (value) => regions.find((option) => option.value === value)?.label ?? ''",
    '',
    declare('services', SERVICES, 'ref'),
    '',
    'const drawerOpen = ref(false)',
    declare('blankForm', BLANK),
    'const form = reactive({ ...blankForm })',
    "const errors = reactive({ name: '', runtime: '' })",
    'const submitting = ref(false)',
    '',
    ...`const openCreate = () => {
  drawerOpen.value = true
}

watch(drawerOpen, (open) => {
  if (!open) return
  Object.assign(form, blankForm)
  errors.name = ''
  errors.runtime = ''
})

const NAME_PATTERN = /^[a-z0-9-]+$/

const validate = () => {
  const name = form.name.trim()
  if (!name) errors.name = 'Name is required.'
  else if (!NAME_PATTERN.test(name))
    errors.name = 'Use lower-case letters, numbers, and hyphen only.'
  else errors.name = ''
  errors.runtime = form.runtime ? '' : 'Runtime is required.'
  return !errors.name && !errors.runtime
}

const cancel = () => {
  drawerOpen.value = false
}

const submit = () => {
  if (!validate()) return
  services.value = [
    { id: \`svc-\${Date.now()}\`, name: form.name.trim(), runtime: form.runtime },
    ...services.value
  ]
  drawerOpen.value = false
}`.split('\n')
  ]
})

const meta = {
  title: 'Templates/Platform/Forms/DrawerItemGroups',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'An in-context create whose body is the settings layout, from the forms lab (ItemGroups in a drawer, `/forms/drawer-itemgroups`): a list page whose heading action opens a large right-side drawer, and inside it section-titled groups of `Item` rows, each a small heading over a flush `CardBox`, saved together by the one Create in the footer. Create service is the example, with General, Runtime and Options. The drawer clears its fields and errors each time it opens, so its content stays in place while it closes. Name and Runtime flag only after Create is pressed. Built from the platform shell, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `CardBox`, `Item`, `InputText`, `Select`, `Switch` and `HelperText`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components: consoleComponents(NAMES), setup, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Services list with the drawer closed: Create Service opens it, and a valid Create adds the new service to the top of the list.'
      },
      source: { code: toSfc(SCRIPT, TEMPLATE) }
    }
  }
}
