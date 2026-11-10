import FieldSelect from '@aziontech/webkit/field-select'
import FieldSwitch from '@aziontech/webkit/field-switch'
import FieldText from '@aziontech/webkit/field-text'
import Alert from '@aziontech/webkit/alert'
import Wizard, { WizardStep } from '@aziontech/webkit/wizard'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Wizard from '@aziontech/webkit/wizard'"
const FIELD_TEXT_IMPORT = "import FieldText from '@aziontech/webkit/field-text'"
const FIELD_SELECT_IMPORT = "import FieldSelect from '@aziontech/webkit/field-select'"
const MESSAGE_IMPORT = "import Alert from '@aziontech/webkit/alert'"
const FIELD_SWITCH_IMPORT = "import FieldSwitch from '@aziontech/webkit/field-switch'"
const VUE_IMPORT = "import { ref } from 'vue'"

const components = {
  Wizard,
  Alert,
  'Wizard.Step': WizardStep,
  FieldText,
  FieldSelect,
  FieldSwitch
}

const REGIONS = [
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'europe', label: 'Europe' }
]

const ENVIRONMENTS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' }
]

const BEHAVIORS = [
  { value: 'deliver', label: 'Deliver' },
  { value: 'redirect', label: 'Redirect' },
  { value: 'deny', label: 'Deny' }
]

const REGIONS_SCRIPT = `const regions = [
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'europe', label: 'Europe' }
]`

const ENVIRONMENTS_SCRIPT = `const environments = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' }
]`

const BEHAVIORS_SCRIPT = `const behaviors = [
  { value: 'deliver', label: 'Deliver' },
  { value: 'redirect', label: 'Redirect' },
  { value: 'deny', label: 'Deny' }
]`

const LABEL_OF_SCRIPT = `const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label ?? 'Not set'`

const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label ?? 'Not set'

const createFlowState = (initialStep) => ({
  step: ref(initialStep),
  name: ref('storefront-api'),
  region: ref('south-america'),
  environment: ref('production'),
  logging: ref(true),
  path: ref('/api/*'),
  behavior: ref('deliver'),
  regions: REGIONS,
  environments: ENVIRONMENTS,
  behaviors: BEHAVIORS,
  labelOf
})

const flowScript = (initialStep) => [
  IMPORT,
  FIELD_TEXT_IMPORT,
  FIELD_SELECT_IMPORT,
  FIELD_SWITCH_IMPORT,
  VUE_IMPORT,
  '',
  `const step = ref(${initialStep})`,
  "const name = ref('storefront-api')",
  "const region = ref('south-america')",
  "const environment = ref('production')",
  'const logging = ref(true)',
  "const path = ref('/api/*')",
  "const behavior = ref('deliver')",
  '',
  REGIONS_SCRIPT,
  ENVIRONMENTS_SCRIPT,
  BEHAVIORS_SCRIPT,
  LABEL_OF_SCRIPT
]

const FLOW_STEPS = `
  <Wizard.Step title="Configure" description="Name the resource and choose where it runs.">
    <div class="flex flex-col gap-(--spacing-md)">
      <FieldText v-model="name" label="Name" required />
      <FieldSelect v-model="region" label="Region" :options="regions" />
    </div>
  </Wizard.Step>
  <Wizard.Step title="Settings" description="Fine-tune the defaults.">
    <div class="flex flex-col gap-(--spacing-md)">
      <FieldSelect v-model="environment" label="Environment" :options="environments" />
      <FieldSwitch
        v-model="logging"
        label="Enable logging"
        description="Keep a record of every request this resource handles."
      />
    </div>
  </Wizard.Step>
  <Wizard.Step title="Rules" description="Decide what happens to matching requests.">
    <div class="flex flex-col gap-(--spacing-md)">
      <FieldText
        v-model="path"
        label="Path pattern"
        helper-text="Requests whose path matches this pattern follow the behavior below."
      />
      <FieldSelect v-model="behavior" label="Behavior" :options="behaviors" />
    </div>
  </Wizard.Step>
  <Wizard.Step title="Review" description="Check every answer before creating.">
    <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
      <dt class="text-(--text-muted)">Name</dt>
      <dd class="text-(--text-default)">{{ name }}</dd>
      <dt class="text-(--text-muted)">Region</dt>
      <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
      <dt class="text-(--text-muted)">Environment</dt>
      <dd class="text-(--text-default)">{{ labelOf(environments, environment) }}</dd>
      <dt class="text-(--text-muted)">Logging</dt>
      <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
      <dt class="text-(--text-muted)">Path pattern</dt>
      <dd class="text-(--text-default)">{{ path }}</dd>
      <dt class="text-(--text-muted)">Behavior</dt>
      <dd class="text-(--text-default)">{{ labelOf(behaviors, behavior) }}</dd>
    </dl>
  </Wizard.Step>`

const meta = {
  title: 'Components/Primitives/Navigation/Wizard',
  component: Wizard,
  subcomponents: { WizardStep },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A multi-step create flow in one surface: the step rail on the start side, the current step's header and fields in the content column, and a footer with Cancel, Previous and Next, where Next becomes the submit action on the last step. The wizard owns the order, which steps can be reached and where focus goes; the consumer owns the fields, the validation and the request. Reach for Stepper alone when the footer and gating must be your own, and Tabs for peer views with no order."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    submitLabel: {
      control: 'text',
      description:
        'Label of the primary action on the last step, where Next becomes the submit action.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Create'" }
      }
    },
    loading: {
      control: 'boolean',
      description:
        'Submit in progress: the primary action shows its loading state, and Cancel, Previous and every rail step are disabled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the wizard region. Name the task, for example Create edge application.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    activeStep: {
      control: 'number',
      description: 'v-model:activeStep — zero-based index of the step on screen.',
      table: { category: 'v-model', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    onNext: {
      action: 'next',
      description:
        'Next was activated on any step but the last, before the wizard advances. Call event.preventDefault() to stay on the step.',
      table: { category: 'events', type: { summary: '(event: MouseEvent, step: number)' } }
    },
    onSubmit: {
      action: 'submit',
      description: 'The primary action was activated on the last step. Not fired while loading.',
      table: { category: 'events', type: { summary: '(event: MouseEvent)' } }
    },
    onCancel: {
      action: 'cancel',
      description: 'Cancel was activated. Not fired while loading.',
      table: { category: 'events', type: { summary: '(event: MouseEvent)' } }
    },
    'onUpdate:activeStep': {
      action: 'update:activeStep',
      description: 'The active step changed through Next, Previous or a rail jump.',
      table: { category: 'events', type: { summary: '(value: number)' } }
    },
    default: {
      control: false,
      description: 'The Wizard.Step children, in the order they are numbered and navigated.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    submitLabel: 'Create',
    loading: false,
    ariaLabel: 'Create resource',
    activeStep: 0
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    const state = createFlowState(args.activeStep ?? 0)
    watch(
      () => args.activeStep,
      (next) => {
        state.step.value = next ?? 0
      }
    )
    return { args, ...state }
  },
  template: `<div class="max-w-(--container-3xl)">
<Wizard v-bind="args" v-model:active-step="step">${FLOW_STEPS}
</Wizard>
</div>`
})

const DEFAULT_MARKUP = `<Wizard v-model:active-step="step" aria-label="Create resource" submit-label="Create">${FLOW_STEPS}
</Wizard>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A four-step flow that creates a generic resource. Next advances, Previous goes back, and the rail jumps to any earlier step; on Review the primary action reads the submit label.'
      },
      source: { code: toSfc(flowScript(0), DEFAULT_MARKUP) }
    }
  }
}

const OPTIONAL_TEMPLATE = `<Wizard v-model:active-step="step" aria-label="Create resource" submit-label="Create">
  <Wizard.Step title="Configure" description="Name the resource and choose where it runs.">
    <div class="flex flex-col gap-(--spacing-md)">
      <FieldText v-model="name" label="Name" required />
      <FieldSelect v-model="region" label="Region" :options="regions" />
    </div>
  </Wizard.Step>
  <Wizard.Step title="Settings" description="Fine-tune the defaults, or skip to keep them." optional>
    <FieldSwitch
      v-model="logging"
      label="Enable logging"
      description="Keep a record of every request this resource handles."
    />
  </Wizard.Step>
  <Wizard.Step title="Review" description="Check every answer before creating.">
    <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
      <dt class="text-(--text-muted)">Name</dt>
      <dd class="text-(--text-default)">{{ name }}</dd>
      <dt class="text-(--text-muted)">Region</dt>
      <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
      <dt class="text-(--text-muted)">Logging</dt>
      <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
    </dl>
  </Wizard.Step>
</Wizard>`

export const Optional = {
  render: (args) => ({
    components,
    setup: () => ({ args, ...createFlowState(0) }),
    template: `<div class="max-w-(--container-3xl)">${OPTIONAL_TEMPLATE.replace('<Wizard ', '<Wizard v-bind="args" ')}</div>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The middle step is optional: the rail and the step header both show Optional beside its title, and Next moves past it without asking for anything.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            FIELD_TEXT_IMPORT,
            FIELD_SELECT_IMPORT,
            FIELD_SWITCH_IMPORT,
            VUE_IMPORT,
            '',
            'const step = ref(0)',
            "const name = ref('storefront-api')",
            "const region = ref('south-america')",
            'const logging = ref(true)',
            '',
            REGIONS_SCRIPT,
            LABEL_OF_SCRIPT
          ],
          OPTIONAL_TEMPLATE
        )
      }
    }
  }
}

const LOADING_MARKUP = `<Wizard v-model:active-step="step" aria-label="Create resource" submit-label="Create" loading>${FLOW_STEPS}
</Wizard>`

export const Loading = {
  args: { loading: true, activeStep: 3 },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Parked on the last step while the request runs: the submit action shows its spinner, and Cancel, Previous and every rail step are disabled.'
      },
      source: { code: toSfc(flowScript(3), LOADING_MARKUP) }
    }
  }
}

const VALIDATION_TEMPLATE = `<Wizard v-model:active-step="step" aria-label="Create resource" submit-label="Create" @next="onNext">
  <Wizard.Step title="Name and region" description="Name the resource and choose where it runs.">
    <div class="flex flex-col gap-(--spacing-md)">
      <Alert v-if="nameMissing" severity="danger" label="Enter a name to continue." />
      <FieldText v-model="name" label="Name" required :invalid="nameMissing" />
      <FieldSelect v-model="region" label="Region" :options="regions" />
    </div>
  </Wizard.Step>
  <Wizard.Step title="Configuration" description="Choose the environment it serves.">
    <FieldSelect v-model="environment" label="Environment" :options="environments" />
  </Wizard.Step>
  <Wizard.Step title="Review" description="Check every answer before creating.">
    <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
      <dt class="text-(--text-muted)">Name</dt>
      <dd class="text-(--text-default)">{{ name }}</dd>
      <dt class="text-(--text-muted)">Region</dt>
      <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
      <dt class="text-(--text-muted)">Environment</dt>
      <dd class="text-(--text-default)">{{ labelOf(environments, environment) }}</dd>
    </dl>
  </Wizard.Step>
</Wizard>`

const VALIDATION_HANDLER = `const onNext = (event, current) => {
  nameMissing.value = current === 0 && !name.value.trim()
  if (nameMissing.value) event.preventDefault()
}`

export const Validation = {
  render: (args) => ({
    components,
    setup() {
      const step = ref(0)
      const name = ref('')
      const region = ref('south-america')
      const environment = ref('production')
      const nameMissing = ref(false)
      const onNext = (event, current) => {
        nameMissing.value = current === 0 && !name.value.trim()
        if (nameMissing.value) event.preventDefault()
      }
      return {
        args,
        step,
        name,
        region,
        environment,
        nameMissing,
        onNext,
        regions: REGIONS,
        environments: ENVIRONMENTS,
        labelOf
      }
    },
    template: `<div class="max-w-(--container-3xl)">${VALIDATION_TEMPLATE.replace('<Wizard ', '<Wizard v-bind="args" ')}</div>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The first step requires a name. The next handler calls event.preventDefault() while the field is empty, so the wizard stays on the step and an inline danger Alert says what to fix.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            MESSAGE_IMPORT,
            FIELD_TEXT_IMPORT,
            FIELD_SELECT_IMPORT,
            VUE_IMPORT,
            '',
            'const step = ref(0)',
            "const name = ref('')",
            "const region = ref('south-america')",
            "const environment = ref('production')",
            'const nameMissing = ref(false)',
            '',
            REGIONS_SCRIPT,
            ENVIRONMENTS_SCRIPT,
            LABEL_OF_SCRIPT,
            '',
            VALIDATION_HANDLER
          ],
          VALIDATION_TEMPLATE
        )
      }
    }
  }
}
