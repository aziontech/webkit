import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldText from '@aziontech/webkit/field-text'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Stepper from '@aziontech/webkit/stepper'
import { computed, nextTick, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  declare,
  HEADER_IMPORTS,
  headerComponents,
  iconTile,
  itemComponents,
  useWizardRail,
  WIZARD_RAIL_SCRIPT,
  wizardPage
} from './_create-markup'

const BREADCRUMB = [
  { label: 'Applications', href: '/applications' },
  { label: 'Create Application' }
]

const WIZARD_STEPS = [
  { id: 'where', label: 'Where it runs', description: 'Select or create a Workload.' },
  { id: 'method', label: 'Select a method' },
  { id: 'source', label: 'Select a source' },
  { id: 'configure', label: 'Create and deploy' }
]

const WORKLOADS = [
  ...Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0')
    return {
      value: `workload_${number}`,
      label: `workload_${number}`,
      description: `my-workload-${index + 1}.azion.run`
    }
  }),
  { value: 'azion-com-prod', label: 'azion-com-prod', description: 'www.azion.com' },
  { value: 'azion-com-br-prod', label: 'azion-com-br-prod', description: 'www.azion.com.br' },
  {
    value: 'azion-stage-preview',
    label: 'azion-stage-preview',
    description: '*-preview.azion.run'
  },
  { value: 'campaign-landing', label: 'campaign-landing', description: 'campaign.azion.com' },
  { value: 'docs-azion', label: 'docs-azion', description: 'docs.azion.com' }
]

const METHODS = [
  {
    id: 'git',
    icon: 'ai ai-github',
    title: 'Import from Git',
    description:
      'Deploy from a repository you already have. Connect the Git account that owns it and select the repository to import.'
  },
  {
    id: 'cli',
    icon: 'ai ai-azion-cli',
    title: 'Sync with Azion CLI',
    description:
      'Create the application now and push to it from your own terminal. Azion links the local project, builds it with your framework preset, and keeps azion.json in sync. No repository required.'
  },
  {
    id: 'template',
    icon: 'pi pi-objects-column',
    title: 'Start from a template',
    description:
      'Clone a framework starter already wired to build and deploy on Azion. Next, Astro, Vue, Nuxt, and more.'
  }
]

const VISIBLE = 6

const useCreateApplication = (state) => () => {
  const stepIndex = ref(state.stepIndex)
  const { steps, current, goBack } = useWizardRail(WIZARD_STEPS, stepIndex)

  const workload = ref(state.workload)
  const whereAnswered = ref(state.stepIndex > 0)
  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameField = ref(null)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return WORKLOADS
    return WORKLOADS.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!workload.value || head.some((option) => option.value === workload.value)) return head
    const picked = matches.value.find((option) => option.value === workload.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const answerWhere = () => {
    whereAnswered.value = true
    stepIndex.value = 1
  }

  const choose = (option) => {
    workload.value = option.value
    answerWhere()
  }

  const skip = () => {
    workload.value = ''
    answerWhere()
  }

  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameField.value?.focus?.())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    creating.value = false
    workload.value = name
    answerWhere()
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0])
      return
    }
    startCreating()
  }

  const nextLabel = computed(() => {
    if (stepIndex.value === 1) return ''
    if (stepIndex.value === 0) return whereAnswered.value ? 'Next' : ''
    return 'Next'
  })

  const advance = () => {
    if (stepIndex.value === 0 && whereAnswered.value) stepIndex.value = 1
  }

  return {
    breadcrumb: BREADCRUMB,
    methods: METHODS,
    stepIndex,
    steps,
    current,
    goBack,
    workload,
    query,
    creating,
    newName,
    nameField,
    matches,
    visible,
    hidden,
    choose,
    skip,
    startCreating,
    cancelCreating,
    confirmCreating,
    onSearchEnter,
    nextLabel,
    advance
  }
}

const scriptFor = (state) => [
  ...HEADER_IMPORTS,
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Stepper from '@aziontech/webkit/stepper'",
  "import { computed, nextTick, ref } from 'vue'",
  '',
  declare('breadcrumb', BREADCRUMB),
  declare('wizardSteps', WIZARD_STEPS),
  declare('workloads', WORKLOADS),
  declare('methods', METHODS),
  `const VISIBLE = ${VISIBLE}`,
  '',
  `const stepIndex = ref(${state.stepIndex})`,
  ...WIZARD_RAIL_SCRIPT,
  '',
  `const workload = ref('${state.workload}')`,
  `const whereAnswered = ref(${state.stepIndex > 0})`,
  "const query = ref('')",
  'const creating = ref(false)',
  "const newName = ref('')",
  'const nameField = ref(null)',
  '',
  'const matches = computed(() => {',
  '  const term = query.value.trim().toLowerCase()',
  '  if (!term) return workloads',
  '  return workloads.filter((option) =>',
  '    [option.label, option.description].some((field) => field.toLowerCase().includes(term))',
  '  )',
  '})',
  'const visible = computed(() => {',
  '  const head = matches.value.slice(0, VISIBLE)',
  '  if (!workload.value || head.some((option) => option.value === workload.value)) return head',
  '  const picked = matches.value.find((option) => option.value === workload.value)',
  '  return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head',
  '})',
  'const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))',
  '',
  'const answerWhere = () => {',
  '  whereAnswered.value = true',
  '  stepIndex.value = 1',
  '}',
  '',
  'const choose = (option) => {',
  '  workload.value = option.value',
  '  answerWhere()',
  '}',
  '',
  'const skip = () => {',
  "  workload.value = ''",
  '  answerWhere()',
  '}',
  '',
  'const startCreating = () => {',
  '  newName.value = query.value.trim()',
  '  creating.value = true',
  '  nextTick(() => nameField.value?.focus?.())',
  '}',
  '',
  'const cancelCreating = () => {',
  '  creating.value = false',
  "  newName.value = ''",
  '}',
  '',
  'const confirmCreating = () => {',
  '  const name = newName.value.trim()',
  '  if (!name) return',
  '  creating.value = false',
  '  workload.value = name',
  '  answerWhere()',
  '}',
  '',
  'const onSearchEnter = () => {',
  '  if (matches.value.length) {',
  '    choose(matches.value[0])',
  '    return',
  '  }',
  '  startCreating()',
  '}',
  '',
  'const nextLabel = computed(() => {',
  "  if (stepIndex.value === 1) return ''",
  "  if (stepIndex.value === 0) return whereAnswered.value ? 'Next' : ''",
  "  return 'Next'",
  '})',
  '',
  'const advance = () => {',
  '  if (stepIndex.value === 0 && whereAnswered.value) stepIndex.value = 1',
  '}'
]

const components = {
  ...headerComponents({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton }),
  ...itemComponents(Item),
  Button,
  CardBox,
  FieldText,
  InputText,
  Stepper,
  'Stepper.Step': Stepper.Step
}

const ROW_CLASS =
  'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none data-selected:bg-(--bg-selected) motion-reduce:transition-none'

const CREATE_ROW_CLASS =
  'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none motion-reduce:transition-none'

const WHERE_STEP = `<section
  v-if="stepIndex === 0"
  data-wide
  class="mx-auto flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg) data-wide:max-w-(--container-md)"
  aria-labelledby="create-application-host-title"
>
  <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
    <span class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
      <i class="ai ai-edge-application text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
    </span>
    <h1 id="create-application-host-title" class="text-heading-xs text-(--text-default)">Create Application</h1>
    <p class="text-body-sm text-(--text-muted)">Choose a workload to continue</p>
  </header>

  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
    <InputText
      v-model="query"
      size="large"
      class="w-full"
      placeholder="Find workload…"
      aria-label="Find workload"
      autocomplete="off"
      @keydown.enter.prevent="onSearchEnter"
    />

    <div
      v-if="creating"
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
    >
      <FieldText
        ref="nameField"
        input-id="create-application-new-workload"
        v-model="newName"
        label="New workload"
        size="large"
        placeholder="my-workload"
        @keydown.enter.prevent="confirmCreating"
      />
      <div class="flex items-center justify-end gap-(--spacing-sm)">
        <Button type="button" label="Back" kind="text" size="medium" @click="cancelCreating" />
        <Button type="button" label="Continue" kind="primary" size="medium" :disabled="!newName.trim()" @click="confirmCreating" />
      </div>
    </div>

    <div v-else class="flex flex-col">
      <button
        v-for="option in visible"
        :key="option.value"
        type="button"
        :aria-pressed="workload === option.value"
        :data-selected="workload === option.value || null"
        class="${ROW_CLASS}"
        @click="choose(option)"
      >
        <i class="ai ai-workloads shrink-0 text-body-md leading-none text-(--text-muted)" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
          {{ option.label }}
        </span>
        <i
          v-if="workload === option.value"
          class="pi pi-check shrink-0 text-body-sm leading-none text-(--text-default)"
          aria-hidden="true"
        />
      </button>

      <p v-if="hidden" class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
        {{ hidden }} more — type to narrow.
      </p>
      <p v-else-if="!matches.length" class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
        No workload matches “{{ query.trim() }}”.
      </p>

      <button type="button" class="${CREATE_ROW_CLASS}" @click="startCreating">
        <i class="pi pi-plus shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
          Create Workload
        </span>
      </button>
    </div>
  </div>

  <div class="flex flex-col items-center gap-(--spacing-xxs)">
    <Button type="button" label="Continue without a workload" kind="text" size="small" @click="skip" />
  </div>
</section>`

const METHOD_STEP = `<CardBox v-else :padded="false" title="How do you want to start?">
  <template #content>
    <Item.List>
      <Item v-for="method in methods" :key="method.id" as-child size="small">
        <button type="button" class="w-full text-left">
          <Item.Media>
${indent(iconTile('method.icon').replace('class="method.icon ', ':class="method.icon" class="'), 6)}
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ method.title }}</Item.Title>
            <Item.Description>{{ method.description }}</Item.Description>
          </Item.Content>
          <Item.Actions>
            <i class="pi pi-chevron-right text-(--text-muted)" aria-hidden="true" />
          </Item.Actions>
        </button>
      </Item>
    </Item.List>
  </template>
</CardBox>`

const TEMPLATE = wizardPage({
  title: 'Create Application',
  titleId: 'create-application-title',
  description:
    'An application is the code Azion runs, and the configuration it runs with. Select where the code comes from and name it. The last step creates it and deploys it to the workload you selected.',
  backLabel: 'Back to Applications',
  heading: 'stepIndex !== 0',
  body: `${WHERE_STEP}\n\n${METHOD_STEP}`
})

const meta = {
  title: 'Templates/Platform/Creation/CreateApplication',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Create Application at `/applications/new`, the wizard that creates an application and deploys it: the creation header, a Stepper rail that only lets you go back, the form column, and a footer with Back and the primary action that disappears while a step is answered by a click. It opens on Where it runs, a centred chooser of the workload the application deploys to, six at a time with a search, an inline Create Workload row and a way to continue without one; then a card of three methods (Import from Git, Sync with Azion CLI, Start from a template), each of which declares the remaining steps on the rail. The source, repository, target and configure steps of each method, and the provisioning and success screens (DeploymentFlow and DeploySuccess), are not plotted here. Built from `GlobalHeader`, `Stepper`, `InputText`, `FieldText`, `Button`, `CardBox` and `Item`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: useCreateApplication(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const WhereItRuns = story(
  { stepIndex: 0, workload: '' },
  'The first step: no page heading and no footer, the chooser lists six of twenty-five workloads, a Create Workload row opens an inline name field, and choosing a workload moves straight to the method.'
)

export const Method = story(
  { stepIndex: 1, workload: 'workload_01' },
  'workload_01 chosen: the page heading appears over How do you want to start?, a flush card of the three methods with a chevron each, and only Back in the footer, since picking a method is the answer.'
)
