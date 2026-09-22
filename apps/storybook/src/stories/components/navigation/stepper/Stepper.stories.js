import Stepper from '@aziontech/webkit/stepper'
import StepperStep from '@aziontech/webkit/stepper-step'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = ["import Stepper from '@aziontech/webkit/stepper'"]

/** @type {import('@storybook/vue3').Meta<typeof Stepper>} */
const meta = {
  title: 'Components/Navigation/Stepper',
  component: Stepper,
  subcomponents: { StepperStep },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'A vertical rail that names the steps of one task, says which step the reader is on, and carries the progress between them on the line that joins the dots. It is the left column of a multi-step surface — a create wizard, a guided setup — while the content of the current step fills the column beside it. The rail is vertical by design. Numbering and the current step flow through context, so each step declares only its own `value`, `title`, `description` and `state`; activating an enabled step writes that `value` back through `v-model`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'The `value` of the step the reader is on (`v-model`).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the step rail.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Steps'" }
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when an enabled step is activated, carrying that step’s `value`.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    default: {
      control: false,
      description: 'The step children, in the order they are numbered.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    ariaLabel: 'Create network list',
    modelValue: 'configure'
  }
}

export default meta

const DEFAULT_TEMPLATE = `
  <Stepper
    v-bind="args"
    :model-value="step"
    class="w-full max-w-[20rem]"
    @update:model-value="onUpdate"
  >
    <Stepper.Step
      value="host"
      title="Where it runs"
      description="The firewall that reads this list."
      state="complete"
    />
    <Stepper.Step
      value="configure"
      title="Configure"
      description="Name it and add the addresses."
    />
    <Stepper.Step
      value="review"
      title="Review"
      description="Check it before it goes live."
    />
    <Stepper.Step
      value="deploy"
      title="Deploy"
      description="Push it to the edge."
    />
  </Stepper>
`

const Template = (args) => ({
  components: { Stepper, 'Stepper.Step': StepperStep },
  setup() {
    const step = ref(args.modelValue ?? '')
    watch(
      () => args.modelValue,
      (next) => {
        step.value = next ?? ''
      }
    )
    const onUpdate = (next) => {
      step.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, step, onUpdate }
  },
  template: DEFAULT_TEMPLATE
})

const DEFAULT_SOURCE = `<Stepper
  v-model="step"
  aria-label="Create network list"
  class="w-full max-w-[20rem]"
>
  <Stepper.Step
    value="host"
    title="Where it runs"
    description="The firewall that reads this list."
    state="complete"
  />
  <Stepper.Step
    value="configure"
    title="Configure"
    description="Name it and add the addresses."
  />
  <Stepper.Step
    value="review"
    title="Review"
    description="Check it before it goes live."
  />
  <Stepper.Step
    value="deploy"
    title="Deploy"
    description="Push it to the edge."
  />
</Stepper>`

/** @type {import('@storybook/vue3').StoryObj<typeof Stepper>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A four-step rail: the first step answered, the second on screen, the last two still ahead. Clicking an enabled step writes its `value` back through `v-model`, so the current marker follows the reader.'
      },
      source: {
        code: toSfc(
          [...IMPORTS, "import { ref } from 'vue'", '', "const step = ref('configure')"],
          DEFAULT_SOURCE
        )
      }
    }
  }
}

const STATES_TEMPLATE = `<Stepper
  aria-label="Step states"
  model-value="current"
  class="w-full max-w-[20rem]"
>
  <Stepper.Step
    value="complete"
    title="Complete"
    description="The owner marked this step answered."
    state="complete"
  />
  <Stepper.Step
    value="current"
    title="Current"
    description="Its value matches the rail's v-model."
  />
  <Stepper.Step
    value="error"
    title="Error"
    description="The owner marked this step wrong."
    state="error"
  />
  <Stepper.Step
    value="loading"
    title="Loading"
    description="The owner marked this step in flight."
    state="loading"
  />
  <Stepper.Step
    value="upcoming"
    title="Upcoming"
    description="Not reached yet, nothing known about it."
    state="upcoming"
  />
</Stepper>`

/** @type {import('@storybook/vue3').StoryObj<typeof StepperStep>} */
export const States = {
  render: () => ({
    components: { Stepper, 'Stepper.Step': StepperStep },
    template: STATES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every `state` a step can carry, plus the `current` one the rail derives from `v-model`, in a single frame. `error` and `loading` outrank `current`, so a step that is both on screen and wrong still says it is wrong; `current` outranks `complete`, so returning to an answered step shows where the reader is. Only a `complete` step fills the connector below it.'
      },
      source: { code: toSfc(IMPORTS, STATES_TEMPLATE) }
    }
  }
}

const DISABLED_TEMPLATE = `<Stepper
  v-model="step"
  aria-label="Create network list"
  class="w-full max-w-[20rem]"
>
  <Stepper.Step
    value="host"
    title="Where it runs"
    description="The firewall that reads this list."
    state="complete"
  />
  <Stepper.Step
    value="configure"
    title="Configure"
    description="Name it and add the addresses."
  />
  <Stepper.Step
    value="review"
    title="Review"
    description="Check it before it goes live."
    disabled
  />
  <Stepper.Step
    value="deploy"
    title="Deploy"
    description="Push it to the edge."
    disabled
  />
</Stepper>`

/** @type {import('@storybook/vue3').StoryObj<typeof StepperStep>} */
export const Disabled = {
  render: () => ({
    components: { Stepper, 'Stepper.Step': StepperStep },
    setup() {
      const step = ref('configure')
      return { step }
    },
    template: DISABLED_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'How a wizard actually renders the rail: reachable backwards, closed forwards. The answered step and the current one stay clickable, while every step after the current one is `disabled` — skipped by `Tab`, not clickable, and inked as unavailable.'
      },
      source: {
        code: toSfc(
          [...IMPORTS, "import { ref } from 'vue'", '', "const step = ref('configure')"],
          DISABLED_TEMPLATE
        )
      }
    }
  }
}
