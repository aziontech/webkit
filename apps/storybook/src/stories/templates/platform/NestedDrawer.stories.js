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

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'Nested drawer' }]

const SERVICES = [
  { value: 'svc-auth', label: 'auth-handler' },
  { value: 'svc-img', label: 'image-optimizer' }
]

const RUNTIMES = [
  { value: 'node20', label: 'Node.js 20' },
  { value: 'python312', label: 'Python 3.12' }
]

const INSTANCES = [{ id: 'inst-1', name: 'auth-guard', serviceId: 'svc-auth' }]

const CREATE_SERVICE = '__create-service__'

const NAMES = [...DRAWER_NAMES, 'CardBox', 'HelperText', 'InputText', 'Item', 'Select']

const nameField = ({ model, error, id, placeholder, disabled }) =>
  withHelper(
    `<InputText
  v-model="${model}"
  size="large"
  :disabled="${disabled}"
  class="w-full"
  aria-label="Name"
  placeholder="${placeholder}"
  :required="!!${error} && !${model}.trim()"
  :invalid="!!${error} && !!${model}.trim()"
  :aria-describedby="${error} ? '${id}' : undefined"
  @update:model-value="${error} = ''"
/>`,
    `<HelperText
  v-if="${error}"
  id="${id}"
  :kind="${model}.trim() ? 'invalid' : 'required'"
  :label="${error}"
/>`
  )

const SERVICE_FIELD = withHelper(
  `<Select
  :model-value="form.serviceId"
  v-model:open="serviceSelectOpen"
  size="large"
  :disabled="submitting"
  class="w-full"
  placeholder="Select a service"
  :required="!!errors.serviceId"
  :display-value="serviceLabel"
  @update:model-value="onServiceModel"
>
  <Select.Trigger
    id="instance-service"
    aria-label="Service"
    :aria-describedby="errors.serviceId ? 'instance-service-error' : undefined"
  />
  <Select.Content>
    <Select.Option
      v-for="service in services"
      :key="service.value"
      :value="service.value"
    >
      {{ service.label }}
    </Select.Option>
    <template #footer>
      <Select.Option
        :value="CREATE_SERVICE"
        icon="pi pi-plus-circle"
        class="w-full"
      >
        Create Service
      </Select.Option>
    </template>
  </Select.Content>
</Select>`,
  `<HelperText
  v-if="errors.serviceId"
  id="instance-service-error"
  kind="required"
  :label="errors.serviceId"
/>`
)

const RUNTIME_FIELD = withHelper(
  optionSelect({
    model: 'childForm.runtime',
    options: 'runtimes',
    display: 'runtimeLabel',
    attrs: [
      ':disabled="childSubmitting"',
      'class="w-full"',
      'placeholder="Select a runtime"',
      ':required="!!childErrors.runtime"'
    ],
    trigger: [
      'id="svc-runtime"',
      'aria-label="Runtime"',
      ':aria-describedby="childErrors.runtime ? \'svc-runtime-error\' : undefined"'
    ]
  }).replace(
    '  :display-value="runtimeLabel"\n>',
    '  :display-value="runtimeLabel"\n  @update:model-value="childErrors.runtime = \'\'"\n>'
  ),
  `<HelperText
  v-if="childErrors.runtime"
  id="svc-runtime-error"
  kind="required"
  :label="childErrors.runtime"
/>`
)

const PARENT = formDrawer({
  open: 'parentOpen',
  size: 'large',
  label: 'Add Instance',
  submit: 'submitParent',
  title: 'Add Instance',
  description:
    'Instantiate a service in this project — pick an existing service or create a new one inline.',
  legend: 'Create instance',
  disabled: 'submitting',
  sections: [
    itemSection({
      heading: sectionLabel('General'),
      start: false,
      rows: [
        itemRow({
          title: 'Name',
          description: 'Give a unique and descriptive name to identify the instance.',
          control: nameField({
            model: 'form.name',
            error: 'errors.name',
            id: 'instance-name-error',
            placeholder: 'my-instance',
            disabled: 'submitting'
          })
        })
      ]
    }),
    itemSection({
      heading: sectionLabel('Service'),
      start: false,
      rows: [
        itemRow({
          title: 'Service',
          description: 'Pick the service to instantiate, or create a new one.',
          control: SERVICE_FIELD
        })
      ]
    })
  ],
  footer: panelFooter({
    cancel: 'cancelParent',
    cancelDisabled: 'submitting',
    label: 'Save',
    loading: 'submitting'
  })
})

const CHILD = formDrawer({
  open: 'childOpen',
  size: 'medium',
  label: 'Create Service',
  submit: 'submitChild',
  title: 'Create service',
  description: 'Create a service to instantiate — it becomes available in the selector when saved.',
  legend: 'Create service',
  disabled: 'childSubmitting',
  sections: [
    itemSection({
      heading: sectionLabel('General'),
      start: false,
      rows: [
        itemRow({
          title: 'Name',
          description: 'A unique name for the service.',
          control: nameField({
            model: 'childForm.name',
            error: 'childErrors.name',
            id: 'svc-name-error',
            placeholder: 'my-service',
            disabled: 'childSubmitting'
          })
        }),
        itemRow({
          title: 'Runtime',
          description: 'The language the service runs on.',
          control: RUNTIME_FIELD
        })
      ]
    })
  ],
  footer: panelFooter({
    cancel: 'cancelChild',
    cancelDisabled: 'childSubmitting',
    label: 'Save',
    loading: 'childSubmitting'
  })
})

const TEMPLATE = consolePage({
  main: `<main class="flex h-full flex-col">
${indent(
  pageHeading({
    title: 'Instances',
    description:
      'Create a resource whose Select needs a related resource that may not exist yet — the quick-add opens a second drawer, then selects the new resource back into the parent. Each drawer is its own scoped save.',
    actions: headingAction({
      label: 'Add Instance',
      icon: 'pi pi-plus',
      click: 'openParent'
    })
  })
)}

${indent(
  resourceList({
    items: 'instances',
    item: 'instance',
    name: 'instance.name',
    meta: 'serviceLabel(instance.serviceId)'
  })
)}
</main>

${PARENT}

${CHILD}`
})

const setup = () => {
  let nextId = 0
  const uid = () => (nextId += 1)
  const services = ref(SERVICES.map((service) => ({ ...service })))
  const serviceLabel = (value) =>
    services.value.find((service) => service.value === value)?.label ?? ''
  const runtimeLabel = (value) => RUNTIMES.find((r) => r.value === value)?.label ?? ''
  const instances = ref(INSTANCES.map((instance) => ({ ...instance })))

  const parentOpen = ref(false)
  const form = reactive({ name: '', serviceId: '' })
  const errors = reactive({ name: '', serviceId: '' })
  const submitting = ref(false)
  const serviceSelectOpen = ref(false)

  const childOpen = ref(false)
  const childForm = reactive({ name: '', runtime: '' })
  const childErrors = reactive({ name: '', runtime: '' })
  const childSubmitting = ref(false)

  const onServiceModel = (value) => {
    if (value === CREATE_SERVICE) {
      serviceSelectOpen.value = false
      childOpen.value = true
      return
    }
    form.serviceId = value
    errors.serviceId = ''
  }

  watch(parentOpen, (open) => {
    if (!open) return
    form.name = ''
    form.serviceId = ''
    errors.name = ''
    errors.serviceId = ''
  })

  watch(childOpen, (open) => {
    if (!open) return
    childForm.name = ''
    childForm.runtime = ''
    childErrors.name = ''
    childErrors.runtime = ''
  })

  const submitParent = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.serviceId = form.serviceId ? '' : 'Select a service.'
    if (errors.name || errors.serviceId) return
    instances.value = [
      { id: `inst-${uid()}`, name: form.name.trim(), serviceId: form.serviceId },
      ...instances.value
    ]
    parentOpen.value = false
  }

  const submitChild = () => {
    childErrors.name = childForm.name.trim() ? '' : 'Name is required.'
    childErrors.runtime = childForm.runtime ? '' : 'Runtime is required.'
    if (childErrors.name || childErrors.runtime) return
    const value = `svc-${uid()}`
    services.value = [{ value, label: childForm.name.trim() }, ...services.value]
    form.serviceId = value
    errors.serviceId = ''
    childOpen.value = false
  }

  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      services,
      serviceLabel,
      runtimes: RUNTIMES,
      runtimeLabel,
      instances,
      parentOpen,
      form,
      errors,
      submitting,
      CREATE_SERVICE,
      serviceSelectOpen,
      onServiceModel,
      openParent: () => {
        parentOpen.value = true
      },
      cancelParent: () => {
        parentOpen.value = false
      },
      submitParent,
      childOpen,
      childForm,
      childErrors,
      childSubmitting,
      cancelChild: () => {
        childOpen.value = false
      },
      submitChild
    }
  })
}

const SCRIPT = consoleScript({
  breadcrumb: BREADCRUMB,
  names: NAMES,
  vue: ['reactive', 'ref', 'watch'],
  body: [
    'let nextId = 0',
    'const uid = () => (nextId += 1)',
    '',
    declare('services', SERVICES, 'ref'),
    "const serviceLabel = (value) => services.value.find((service) => service.value === value)?.label ?? ''",
    '',
    declare('runtimes', RUNTIMES),
    "const runtimeLabel = (value) => runtimes.find((r) => r.value === value)?.label ?? ''",
    '',
    declare('instances', INSTANCES, 'ref'),
    '',
    ...`const parentOpen = ref(false)
const form = reactive({ name: '', serviceId: '' })
const errors = reactive({ name: '', serviceId: '' })
const submitting = ref(false)

const CREATE_SERVICE = '${CREATE_SERVICE}'
const serviceSelectOpen = ref(false)

const childOpen = ref(false)
const childForm = reactive({ name: '', runtime: '' })
const childErrors = reactive({ name: '', runtime: '' })
const childSubmitting = ref(false)

const onServiceModel = (value) => {
  if (value === CREATE_SERVICE) {
    serviceSelectOpen.value = false
    childOpen.value = true
    return
  }
  form.serviceId = value
  errors.serviceId = ''
}

const openParent = () => {
  parentOpen.value = true
}
const cancelParent = () => {
  parentOpen.value = false
}

watch(parentOpen, (open) => {
  if (!open) return
  form.name = ''
  form.serviceId = ''
  errors.name = ''
  errors.serviceId = ''
})

const submitParent = () => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  errors.serviceId = form.serviceId ? '' : 'Select a service.'
  if (errors.name || errors.serviceId) return
  instances.value = [
    { id: \`inst-\${uid()}\`, name: form.name.trim(), serviceId: form.serviceId },
    ...instances.value
  ]
  parentOpen.value = false
}

const cancelChild = () => {
  childOpen.value = false
}

watch(childOpen, (open) => {
  if (!open) return
  childForm.name = ''
  childForm.runtime = ''
  childErrors.name = ''
  childErrors.runtime = ''
})

const submitChild = () => {
  childErrors.name = childForm.name.trim() ? '' : 'Name is required.'
  childErrors.runtime = childForm.runtime ? '' : 'Runtime is required.'
  if (childErrors.name || childErrors.runtime) return
  const value = \`svc-\${uid()}\`
  services.value = [{ value, label: childForm.name.trim() }, ...services.value]
  form.serviceId = value
  errors.serviceId = ''
  childOpen.value = false
}`.split('\n')
  ]
})

const meta = {
  title: 'Templates/Platform/Forms/NestedDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A create drawer whose select needs a related resource that may not exist yet: the list page opens a large Add Instance drawer, and the Create Service option pinned to the foot of its Service select opens a second, medium drawer stacked above it on raised layers. Saving the child adds the new service and selects it back into the parent. Each drawer is its own scoped save, and each clears its fields and errors when it opens, so its content stays in place while it closes. Built from the platform shell, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `CardBox`, `Item`, `InputText`, `Select` and `HelperText`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'nested drawer',
        'stacked drawers',
        'drawer on drawer',
        'create related resource',
        'create option in select',
        'child form',
        'gaveta aninhada',
        'gavetas empilhadas',
        'criar recurso relacionado'
      ],
      skills: ['webkit-create-surface', 'webkit-form', 'webkit-errors']
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
          'The Instances list with both drawers closed: Add Instance opens the parent, and Create Service in its select opens the child over it.'
      },
      source: { code: toSfc(SCRIPT, TEMPLATE) }
    }
  }
}
