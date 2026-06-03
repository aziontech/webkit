import SegmentedButton from '@aziontech/webkit/segmented-button'
import { ref, watch } from 'vue'

const defaultOptions = [
  { label: 'Label', value: 'option-1' },
  { label: 'Label', value: 'option-2' },
  { label: 'Label', value: 'option-3' },
  { label: 'Label', value: 'option-4' },
  { label: 'Label', value: 'option-5' }
]

const disabledOptions = [
  { label: 'Label', value: 'option-1' },
  { label: 'Label', value: 'option-2', disabled: true },
  { label: 'Label', value: 'option-3' },
  { label: 'Label', value: 'option-4' }
]

/** @type {import('@storybook/vue3').Meta<typeof SegmentedButton>} */
const meta = {
  title: 'Webkit/Actions/SegmentedButton',
  component: SegmentedButton,
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
          'Mutually exclusive segmented control for switching between related options. Supports keyboard navigation, disabled segments with a lock affordance, and an animated selection indicator.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected option value.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    options: {
      control: 'object',
      description: 'Segment choices with `{ label, value, disabled? }`.',
      table: { category: 'props', type: { summary: 'SegmentedButtonOption[]' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name when no visible group label is associated.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial selection when `v-model` is not set.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    onChange: {
      action: 'change',
      description: 'Emitted after the selected value changes.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: 'option-1',
    options: defaultOptions,
    ariaLabel: 'Segmented options'
  }
}

export default meta

const Template = (args) => ({
  components: { SegmentedButton },
  setup() {
    const { onChange, 'onUpdate:modelValue': onUpdateModelValue, modelValue, ...props } = args
    const value = ref(modelValue)

    watch(
      () => args.modelValue,
      (nextValue) => {
        value.value = nextValue
      }
    )

    return { props, value, onChange, onUpdateModelValue }
  },
  template:
    '<SegmentedButton v-bind="props" v-model="value" @change="onChange" @update:model-value="onUpdateModelValue" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof SegmentedButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Five generic options with the first selected.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof SegmentedButton>} */
export const WithDisabledOption = {
  args: {
    modelValue: 'option-1',
    options: disabledOptions
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Four options with one disabled segment showing the lock affordance.'
      }
    }
  }
}
