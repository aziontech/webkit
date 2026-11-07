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

const FUNCTIONS = [
  { value: 'fn-auth', label: 'auth-handler' },
  { value: 'fn-img', label: 'image-optimizer' }
]

const RUNTIMES = [
  { value: 'azion-js', label: 'Azion Runtime (JavaScript)' },
  { value: 'node20', label: 'Node.js 20' }
]

const INSTANCES = [{ id: 'fi-1', name: 'auth-guard', functionId: 'fn-auth' }]

const CREATE_FUNCTION = '__create-function__'

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

const FUNCTION_FIELD = withHelper(
  `<Select
  :model-value="form.functionId"
  v-model:open="functionSelectOpen"
  size="large"
  :disabled="submitting"
  class="w-full"
  placeholder="Select a function"
  :required="!!errors.functionId"
  :display-value="functionLabel"
  @update:model-value="onFunctionModel"
>
  <Select.Trigger
    id="instance-function"
    aria-label="Edge Function"
    :aria-describedby="errors.functionId ? 'instance-function-error' : undefined"
  />
  <Select.Content class="z-[1002]!">
    <Select.Option
      v-for="fn in functions"
      :key="fn.value"
      :value="fn.value"
    >
      {{ fn.label }}
    </Select.Option>
    <template #footer>
      <Select.Option
        :value="CREATE_FUNCTION"
        icon="pi pi-plus-circle"
        class="w-full"
      >
        Create Function
      </Select.Option>
    </template>
  </Select.Content>
</Select>`,
  `<HelperText
  v-if="errors.functionId"
  id="instance-function-error"
  kind="required"
  :label="errors.functionId"
/>`
)

const RUNTIME_FIELD = withHelper(
  optionSelect({
    model: 'childForm.runtime',
    options: 'runtimes',
    display: 'runtimeLabel',
    content: 'z-[1004]!',
    attrs: [
      ':disabled="childSubmitting"',
      'class="w-full"',
      'placeholder="Select a runtime"',
      ':required="!!childErrors.runtime"'
    ],
    trigger: [
      'id="fn-runtime"',
      'aria-label="Runtime"',
      ':aria-describedby="childErrors.runtime ? \'fn-runtime-error\' : undefined"'
    ]
  }).replace(
    '  :display-value="runtimeLabel"\n>',
    '  :display-value="runtimeLabel"\n  @update:model-value="childErrors.runtime = \'\'"\n>'
  ),
  `<HelperText
  v-if="childErrors.runtime"
  id="fn-runtime-error"
  kind="required"
  :label="childErrors.runtime"
/>`
)

const PARENT = formDrawer({
  open: 'parentOpen',
  size: 'large',
  label: 'Add Functions Instance',
  submit: 'submitParent',
  title: 'Add Functions Instance',
  description:
    'Instantiate an edge function on this application — pick an existing function or create a new one inline.',
  legend: 'Create functions instance',
  disabled: 'submitting',
  sections: [
    itemSection({
      heading: sectionLabel('General'),
      start: false,
      rows: [
        itemRow({
          title: 'Name',
          description: 'Give a unique and descriptive name to identify the instance.',
          start: true,
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
      heading: sectionLabel('Function'),
      start: false,
      rows: [
        itemRow({
          title: 'Edge Function',
          description: 'Pick the function to instantiate, or create a new one.',
          start: true,
          control: FUNCTION_FIELD
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
  layer: { overlay: 'z-[1002]', content: 'z-[1003]' },
  label: 'Create Function',
  submit: 'submitChild',
  title: 'Create function',
  description:
    'Create a function to instantiate — it becomes available in the selector when saved.',
  legend: 'Create function',
  disabled: 'childSubmitting',
  sections: [
    itemSection({
      heading: sectionLabel('General'),
      start: false,
      rows: [
        itemRow({
          title: 'Name',
          description: 'A unique name for the function.',
          start: true,
          control: nameField({
            model: 'childForm.name',
            error: 'childErrors.name',
            id: 'fn-name-error',
            placeholder: 'my-function',
            disabled: 'childSubmitting'
          })
        }),
        itemRow({
          title: 'Runtime',
          description: 'The language the function runs on.',
          start: true,
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
    title: 'Functions Instances',
    description:
      'Create a resource whose Select needs a related resource that may not exist yet — the quick-add opens a second drawer, then selects the new resource back into the parent. Each drawer is its own scoped save.',
    actions: headingAction({
      label: 'Add Functions Instance',
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
    meta: 'functionLabel(instance.functionId)'
  })
)}
</main>

${PARENT}

${CHILD}`
})

const setup = () => {
  let nextId = 0
  const uid = () => (nextId += 1)
  const functions = ref(FUNCTIONS.map((fn) => ({ ...fn })))
  const functionLabel = (value) => functions.value.find((fn) => fn.value === value)?.label ?? ''
  const runtimeLabel = (value) => RUNTIMES.find((r) => r.value === value)?.label ?? ''
  const instances = ref(INSTANCES.map((instance) => ({ ...instance })))

  const parentOpen = ref(false)
  const form = reactive({ name: '', functionId: '' })
  const errors = reactive({ name: '', functionId: '' })
  const submitting = ref(false)
  const functionSelectOpen = ref(false)

  const childOpen = ref(false)
  const childForm = reactive({ name: '', runtime: '' })
  const childErrors = reactive({ name: '', runtime: '' })
  const childSubmitting = ref(false)

  const onFunctionModel = (value) => {
    if (value === CREATE_FUNCTION) {
      functionSelectOpen.value = false
      childOpen.value = true
      return
    }
    form.functionId = value
    errors.functionId = ''
  }

  watch(parentOpen, (open) => {
    if (!open) return
    form.name = ''
    form.functionId = ''
    errors.name = ''
    errors.functionId = ''
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
    errors.functionId = form.functionId ? '' : 'Select a function.'
    if (errors.name || errors.functionId) return
    instances.value = [
      { id: `fi-${uid()}`, name: form.name.trim(), functionId: form.functionId },
      ...instances.value
    ]
    parentOpen.value = false
  }

  const submitChild = () => {
    childErrors.name = childForm.name.trim() ? '' : 'Name is required.'
    childErrors.runtime = childForm.runtime ? '' : 'Runtime is required.'
    if (childErrors.name || childErrors.runtime) return
    const value = `fn-${uid()}`
    functions.value = [{ value, label: childForm.name.trim() }, ...functions.value]
    form.functionId = value
    errors.functionId = ''
    childOpen.value = false
  }

  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      functions,
      functionLabel,
      runtimes: RUNTIMES,
      runtimeLabel,
      instances,
      parentOpen,
      form,
      errors,
      submitting,
      CREATE_FUNCTION,
      functionSelectOpen,
      onFunctionModel,
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
    declare('functions', FUNCTIONS, 'ref'),
    "const functionLabel = (value) => functions.value.find((fn) => fn.value === value)?.label ?? ''",
    '',
    declare('runtimes', RUNTIMES),
    "const runtimeLabel = (value) => runtimes.find((r) => r.value === value)?.label ?? ''",
    '',
    declare('instances', INSTANCES, 'ref'),
    '',
    ...`const parentOpen = ref(false)
const form = reactive({ name: '', functionId: '' })
const errors = reactive({ name: '', functionId: '' })
const submitting = ref(false)

const CREATE_FUNCTION = '${CREATE_FUNCTION}'
const functionSelectOpen = ref(false)

const childOpen = ref(false)
const childForm = reactive({ name: '', runtime: '' })
const childErrors = reactive({ name: '', runtime: '' })
const childSubmitting = ref(false)

const onFunctionModel = (value) => {
  if (value === CREATE_FUNCTION) {
    functionSelectOpen.value = false
    childOpen.value = true
    return
  }
  form.functionId = value
  errors.functionId = ''
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
  form.functionId = ''
  errors.name = ''
  errors.functionId = ''
})

const submitParent = () => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  errors.functionId = form.functionId ? '' : 'Select a function.'
  if (errors.name || errors.functionId) return
  instances.value = [
    { id: \`fi-\${uid()}\`, name: form.name.trim(), functionId: form.functionId },
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
  const value = \`fn-\${uid()}\`
  functions.value = [{ value, label: childForm.name.trim() }, ...functions.value]
  form.functionId = value
  errors.functionId = ''
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
          'A create drawer whose select needs a related resource that may not exist yet, from the forms lab (Nested drawer, `/forms/nested-drawer`): the list page opens a large Add Functions Instance drawer, and the Create Function option pinned to the foot of its Edge Function select opens a second, medium drawer stacked above it on raised layers. Saving the child adds the new function and selects it back into the parent. Each drawer is its own scoped save, and each clears its fields and errors when it opens, so its content stays in place while it closes. Built from the platform shell, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `CardBox`, `Item`, `InputText`, `Select` and `HelperText`.'
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
          'The Functions Instances list with both drawers closed: Add Functions Instance opens the parent, and Create Function in its select opens the child over it.'
      },
      source: { code: toSfc(SCRIPT, TEMPLATE) }
    }
  }
}
