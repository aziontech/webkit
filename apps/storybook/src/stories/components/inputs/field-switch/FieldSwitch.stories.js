import { ref, watch } from 'vue'

import FieldSwitch from '@aziontech/webkit/field-switch'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldSwitch from '@aziontech/webkit/field-switch'"
const REF_IMPORT = "import { ref } from 'vue'"

/** @type {import('@storybook/vue3').Meta<typeof FieldSwitch>} */
const meta = {
  title: 'Components/Inputs/FieldSwitch',
  component: FieldSwitch,
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
          'Inline boolean toggle with the switch on the leading edge, a label, an optional description, and an optional helper badge shown when disabled.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    label: {
      control: 'text',
      description: 'Primary label text.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Secondary description.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    helperText: {
      control: 'text',
      description: 'Helper badge text shown when disabled.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    required: {
      control: 'boolean',
      description: 'Adds the Required tag to the label and sets aria-required on the switch.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    modelValue: false,
    label: 'Switch label',
    description: 'Switch description',
    helperText: '',
    required: false,
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldSwitch },
  setup() {
    const value = ref(args.modelValue ?? false)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? false
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: '<FieldSwitch v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_BODY =
  '<FieldSwitch v-model="value" label="Switch label" description="Switch description" />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSwitch>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default switch with a label and description, toggled off.' },
      source: { code: toSfc([IMPORT, REF_IMPORT, '', 'const value = ref(false)'], DEFAULT_BODY) }
    }
  }
}

const STATES_TEMPLATE = `<div class="flex max-w-xs flex-col gap-[var(--spacing-3)]">
  <FieldSwitch v-model="off" label="Switch label" description="Switch description" />
  <FieldSwitch v-model="on" label="Switch label" description="Switch description" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSwitch>} */
export const States = {
  render: () => ({
    components: { FieldSwitch },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: STATES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Unchecked and checked switches side by side.' },
      source: {
        code: toSfc(
          [IMPORT, REF_IMPORT, '', 'const off = ref(false)', 'const on = ref(true)'],
          STATES_TEMPLATE
        )
      }
    }
  }
}

const REQUIRED_BODY =
  '<FieldSwitch v-model="value" label="Enable notifications" description="Required to proceed." required />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSwitch>} */
export const Required = {
  args: {
    modelValue: false,
    label: 'Enable notifications',
    description: 'Required to proceed.',
    required: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'When `required` is `true`, the label shows the Required indicator and the switch receives `aria-required="true"`.'
      },
      source: { code: toSfc([IMPORT, REF_IMPORT, '', 'const value = ref(false)'], REQUIRED_BODY) }
    }
  }
}

const DISABLED_BODY =
  '<FieldSwitch v-model="value" label="Switch label" description="Switch description" helper-text="Helper Text" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSwitch>} */
export const Disabled = {
  args: {
    modelValue: true,
    helperText: 'Helper Text',
    disabled: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state; the helper badge appears alongside the label when `helperText` is set.'
      },
      source: { code: toSfc([IMPORT, REF_IMPORT, '', 'const value = ref(true)'], DISABLED_BODY) }
    }
  }
}
