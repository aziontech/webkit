import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import Stepper from '@aziontech/webkit/stepper'
import Switch from '@aziontech/webkit/switch'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Functions', href: '/functions' }, { label: 'Create Function' }]

const STEP_COPY = [
  {
    value: 'where-it-runs',
    title: 'Where it runs',
    description: 'A Rules Engine rule calls it, on the application it is instanced on.'
  },
  {
    value: 'code',
    title: 'Code',
    description: 'The function body, and the arguments it is called with.'
  },
  {
    value: 'settings',
    title: 'Settings',
    description: 'What the function is called, where it runs, and whether it is active.'
  },
  {
    value: 'review',
    title: 'Review',
    description: 'What will be created, and what it can do the moment it exists.'
  }
]

const railSteps = (current) => {
  const currentIndex = STEP_COPY.findIndex((step) => step.value === current)
  return STEP_COPY.map((step, index) => ({
    ...step,
    state: index < currentIndex ? 'complete' : 'upcoming',
    disabled: index > currentIndex
  }))
}

const ANSWERS = [
  { label: 'Name', api: 'name', text: 'my-function' },
  { label: 'Runtime', api: 'runtime', text: 'JavaScript' },
  { label: 'Execution environment', api: 'execution_environment', text: 'application' },
  { label: 'Arguments', api: 'default_args', text: '{}' },
  { label: 'Active', api: 'active', text: 'On' }
]

const CONSUMERS = [
  { by: 'application', path: 'via Function Instance', as: 'via' },
  { by: 'firewall', path: 'via Function Instance', as: 'via' },
  { by: 'function-instance', path: 'function', as: 'id', requires: 'functions' },
  { by: 'release', path: 'dependency', as: 'ver' }
]

const IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Message from '@aziontech/webkit/message'",
  "import Stepper from '@aziontech/webkit/stepper'",
  "import Switch from '@aziontech/webkit/switch'",
  "import Tag from '@aziontech/webkit/tag'"
]

const importsUsedBy = (template) =>
  IMPORTS.filter((line) => {
    const binding = line.match(/^import (\w+) from/)[1]
    return new RegExp(`<${binding}[\\s/>.]`).test(template)
  })

const components = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  CardBox,
  FieldRadioBlock,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  HelperText,
  Hint,
  IconButton,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Message,
  Stepper,
  'Stepper.Step': Stepper.Step,
  Switch,
  Tag
}

const HEADER = `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left>
    <IconButton icon="pi pi-chevron-left" aria-label="Back to Functions" kind="outlined" size="small" />
    <GlobalHeader.Brand>
      <a
        href="/home"
        aria-label="Azion home"
        class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
    <Breadcrumb :items="breadcrumb" />
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
    <button
      type="button"
      aria-label="Account settings"
      class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
    >
      <Avatar label="myemail@azion.com" size="medium" kind="square" />
    </button>
  </GlobalHeader.Right>
</GlobalHeader>`

const section = ({
  title,
  hint = '',
  body
}) => `<section class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="text-balance text-heading-xxs text-(--text-default)">${title}</h2>${
        hint ? `\n      <Hint text="${hint}" class="shrink-0" />` : ''
      }
    </div>
  </div>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
${indent(body, 2)}
  </div>
</section>`

const flushCard = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows, 3)}
    </Item.List>
  </template>
</CardBox>`

const page = ({
  step,
  position,
  primary,
  pane
}) => `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
${indent(HEADER)}

  <div class="flex min-h-0 flex-1">
    <aside class="hidden h-full w-64 shrink-0 overflow-auto border-r border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block">
      <Stepper v-model="current" aria-label="Create Function" class="h-full">
        <Stepper.Step
          v-for="entry in steps"
          :key="entry.value"
          :value="entry.value"
          :title="entry.title"
          :description="entry.value === current ? entry.description : ''"
          :state="entry.state"
          :disabled="entry.disabled"
        />
      </Stepper>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <main class="group/main animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto data-bleed:flex data-bleed:flex-col data-bleed:overflow-hidden">
        <form class="flex min-h-full flex-col group-data-[bleed]/main:min-h-0 group-data-[bleed]/main:flex-1" aria-label="${step.title}" novalidate @submit.prevent="commit">
          <div class="layout-form-create layout-boundary-inline flex flex-1 flex-col pt-(--layout-section-gap) pb-(--layout-section-gap)">
            <p class="pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">${position}</p>

            <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <h1 class="text-balance text-heading-xs text-(--text-default)">${step.title}</h1>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">${step.description}</p>
              </div>
            </header>

            <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-1 flex-col border-0 p-0">
              <legend class="sr-only">${step.title}</legend>
${indent(pane, 7)}
            </fieldset>
          </div>

          <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">${primary}</button>
        </form>
      </main>

      <footer class="shrink-0 border-t border-(--border-default) bg-(--bg-surface)">
        <div class="layout-form-create layout-boundary-inline flex items-center justify-between gap-(--spacing-sm) py-(--spacing-md)">
          <Button type="button" label="Cancel" kind="text" size="medium" />
          <div class="flex shrink-0 items-center gap-(--spacing-sm)">
            <Button type="button" label="Back" kind="outlined" size="medium" />
            <Button label="${primary}" kind="primary" size="medium" @click="commit" />
          </div>
        </div>
      </footer>
    </div>
  </div>
</div>`

const IDENTIFICATION = section({
  title: 'Identification',
  hint: 'The name the function is listed and selected by.',
  body: `${flushCard(`<Item>
  <Item.Content>
    <Item.Title>Name</Item.Title>
    <Item.Description>name</Item.Description>
  </Item.Content>
  <Item.Actions>
    <div class="layout-field-control">
      <InputText
        id="create-function-name"
        v-model="name"
        size="medium"
        placeholder="my-function"
        class="w-full"
        aria-label="Name"
        autocomplete="off"
        :required="!!nameError"
        :aria-describedby="nameError ? 'create-function-name-message' : undefined"
        @update:model-value="nameError = ''"
      />
    </div>
  </Item.Actions>
</Item>`)}
<HelperText v-if="nameError" id="create-function-name-message" kind="required" :label="nameError" />`
})

const RUNTIME = section({
  title: 'Runtime',
  body: flushCard(`<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>Runtime</Item.Title>
    <Item.Description>The runtime isn't editable after the function is created.</Item.Description>
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <InputText model-value="JavaScript" size="large" class="w-full" aria-label="Runtime" readonly disabled>
        <template #iconRight>
          <i class="pi pi-lock" aria-hidden="true" />
        </template>
      </InputText>
    </div>
  </Item.Actions>
</Item>`)
})

const EXECUTION_ENVIRONMENT = section({
  title: 'Execution environment',
  hint: 'Which product runs the function, each handing the code a different request.',
  body: flushCard(`<Item size="small" class="flex-col items-stretch gap-(--spacing-sm)">
  <Item.Content>
    <Item.Title>Runs on</Item.Title>
  </Item.Content>
  <Item.Actions class="w-full justify-start">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
        <legend class="sr-only">Execution environment</legend>
        <FieldRadioBlock
          v-model="executionEnvironment"
          value="application"
          name="execution-environment"
          label="Application"
          description="Runs on requests an application serves, after routing."
        />
        <FieldRadioBlock
          v-model="executionEnvironment"
          value="firewall"
          name="execution-environment"
          label="Firewall"
          description="Runs inside Firewall, before the request reaches an application, where a request can still be refused."
        />
      </fieldset>
    </div>
  </Item.Actions>
</Item>`)
})

const STATUS = section({
  title: 'Status',
  body: flushCard(`<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>Active</Item.Title>
    <Item.Description>An inactive function keeps its code and stops running.</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="active" aria-label="Active" />
  </Item.Actions>
</Item>`)
})

const SETTINGS_PANE = [IDENTIFICATION, RUNTIME, EXECUTION_ENVIRONMENT, STATUS].join('\n\n')

const WHAT_GETS_CREATED = section({
  title: 'What gets created',
  hint: 'Every value below is posted as the property named beside it.',
  body: flushCard(`<Item v-for="answer in answers" :key="answer.api">
  <Item.Content>
    <Item.Title>{{ answer.label }}</Item.Title>
    <Item.Description>{{ answer.api }}</Item.Description>
  </Item.Content>
  <Item.Actions>
    <span class="max-w-80 truncate text-label-sm text-(--text-default)">
      {{ answer.text }}
    </span>
  </Item.Actions>
</Item>`)
})

const WHERE_IT_RUNS = section({
  title: 'Where it runs',
  hint: 'A Rules Engine rule calls it, on the application it is instanced on.',
  body: `<CardBox :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
      <Message severity="success" size="small" label="Runs on my-app-vue." />
    </div>
  </template>
</CardBox>`
})

const WHAT_CAN_REFERENCE_IT = section({
  title: 'What can reference it',
  hint: 'Read off the v6 dependency matrix: every consumer of this resource, and the field or rule that carries the reference.',
  body: flushCard(`<Item v-for="(row, index) in consumers" :key="row.by + '-' + index">
  <Item.Content>
    <Item.Title>{{ row.by }}</Item.Title>
    <Item.Description>{{ row.path }}</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Tag v-if="row.requires" :label="'modules.' + row.requires" severity="warning" size="small" />
    <Tag :label="row.as" size="small" />
  </Item.Actions>
</Item>`)
})

const REVIEW_PANE = `<div class="flex flex-col">
${indent([WHAT_GETS_CREATED, WHERE_IT_RUNS, WHAT_CAN_REFERENCE_IT].join('\n\n'))}
</div>`

const SETTINGS_TEMPLATE = page({
  step: STEP_COPY[2],
  position: 'Step 3 of 4',
  primary: 'Next',
  pane: SETTINGS_PANE
})

const REVIEW_TEMPLATE = page({
  step: STEP_COPY[3],
  position: 'Step 4 of 4',
  primary: 'Create function',
  pane: REVIEW_PANE
})

const scriptFor = ({ current, template, state }) => [
  ...importsUsedBy(template),
  "import { ref } from 'vue'",
  '',
  declare('breadcrumb', BREADCRUMB),
  declare('steps', railSteps(current)),
  '',
  `const current = ref('${current}')`,
  ...state
]

const SETTINGS_STATE = [
  "const name = ref('')",
  "const nameError = ref('')",
  "const executionEnvironment = ref('application')",
  'const active = ref(true)',
  '',
  'const commit = () => {',
  "  nameError.value = name.value.trim() ? '' : 'This field is required.'",
  "  if (nameError.value) document.getElementById('create-function-name')?.focus()",
  '}'
]

const REVIEW_STATE = [
  declare('answers', ANSWERS),
  declare('consumers', CONSUMERS),
  '',
  'const commit = () => {}'
]

const meta = {
  title: 'Templates/Platform/Shell/StepperCreatePage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The stepped create page: its own creation header, a full-height rail on the left holding the vertical Stepper (hidden below md, where a "Step n of N" line takes its place above the heading), the current step as a page heading over its sections, and a footer with Cancel on the left and Back plus Next, or the save label on the last step, on the right. Create Function runs on it, through Where it runs, Code, Settings and Review. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `Stepper`, `Hint`, `CardBox`, `Item`, `InputText`, `HelperText`, `FieldRadioBlock`, `Switch`, `Message`, `Tag` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SettingsStep = {
  render: () => ({
    components,
    setup: () => {
      const name = ref('')
      const nameError = ref('')
      const commit = () => {
        nameError.value = name.value.trim() ? '' : 'This field is required.'
        if (nameError.value) globalThis.document.getElementById('create-function-name')?.focus()
      }
      return {
        breadcrumb: BREADCRUMB,
        steps: railSteps('settings'),
        current: ref('settings'),
        name,
        nameError,
        executionEnvironment: ref('application'),
        active: ref(true),
        commit
      }
    },
    template: SETTINGS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Create Function on Settings, step three of four: Where it runs and Code read complete, Review is still locked, and Next flags an empty Name as required.'
      },
      source: {
        code: toSfc(
          scriptFor({ current: 'settings', template: SETTINGS_TEMPLATE, state: SETTINGS_STATE }),
          SETTINGS_TEMPLATE
        )
      }
    }
  }
}

export const ReviewStep = {
  render: () => ({
    components,
    setup: () => ({
      breadcrumb: BREADCRUMB,
      steps: railSteps('review'),
      current: ref('review'),
      answers: ANSWERS,
      consumers: CONSUMERS,
      commit: () => {}
    }),
    template: REVIEW_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Create Function on Review, the last step: every earlier step reads complete, the pane reads back what gets created, where it runs and what can reference it, and the primary action becomes Create function.'
      },
      source: {
        code: toSfc(
          scriptFor({ current: 'review', template: REVIEW_TEMPLATE, state: REVIEW_STATE }),
          REVIEW_TEMPLATE
        )
      }
    }
  }
}
