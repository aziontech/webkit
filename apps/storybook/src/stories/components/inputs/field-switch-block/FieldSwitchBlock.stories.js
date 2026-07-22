import { ref, watch } from 'vue'

import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'

import { toSfc } from '../../../_shared/story-source'

/** @type {import('@storybook/vue3').Meta<typeof FieldSwitchBlock>} */
const meta = {
  title: 'Components/Inputs/FieldSwitchBlock',
  component: FieldSwitchBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
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
          'Card-style boolean toggle with switch, label, description, and optional disabled helper badge inside a bordered block.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    label: {
      control: 'text',
      description: 'Primary label text.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    description: {
      control: 'text',
      description: 'Secondary description.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    helperText: {
      control: 'text',
      description: 'Helper badge text shown when disabled.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { type: { summary: 'boolean' }, category: 'events' }
    }
  },
  args: {
    modelValue: false,
    disabled: false,
    label: 'Switch label',
    description: 'Switch description',
    helperText: ''
  }
}

export default meta

const Template = (args) => ({
  components: { FieldSwitchBlock },
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
  template: '<FieldSwitchBlock v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_SCRIPT = [
  "import { ref } from 'vue'",
  "import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'",
  '',
  'const enabled = ref(false)'
]

const DEFAULT_MARKUP = `<FieldSwitchBlock
  v-model="enabled"
  label="Switch label"
  description="Switch description"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSwitchBlock>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive switch block seeded off. Toggle the control to see the highlighted checked state.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_SCRIPT = [
  "import { ref } from 'vue'",
  "import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'",
  '',
  'const enabled = ref(true)'
]

const DISABLED_MARKUP = `<FieldSwitchBlock
  v-model="enabled"
  label="Switch label"
  description="Switch description"
  helper-text="Helper Text"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSwitchBlock>} */
export const Disabled = {
  args: { modelValue: true, disabled: true, helperText: 'Helper Text' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state with a lock helper badge that surfaces why the toggle cannot be changed.'
      },
      source: { code: toSfc(DISABLED_SCRIPT, DISABLED_MARKUP) }
    }
  }
}
