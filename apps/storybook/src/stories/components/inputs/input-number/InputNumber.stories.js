import { ref, watch } from 'vue'
import InputNumber from '@aziontech/webkit/input-number'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import InputNumber from '@aziontech/webkit/input-number'"

/** @type {import('@storybook/vue3').Meta<typeof InputNumber>} */
const meta = {
  title: 'Components/Inputs/InputNumber',
  component: InputNumber,
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
          'Numeric input field with optional increment/decrement spinner buttons. Use when the value is strictly numeric (counts, quantities, ports, thresholds, currency without formatting).'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'number',
      description: 'v-model value (always numeric; cleared input falls back to `min ?? 0`).',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    placeholder: {
      control: 'text',
      description: 'Text shown when the input is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; affects height, padding, and typography.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the field as read-only; spinner buttons are inert.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies the invalid border/ring tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required for assistive tech.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value; spinner stops at this bound.',
      table: { category: 'props', type: { summary: 'number' } }
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value; spinner stops at this bound.',
      table: { category: 'props', type: { summary: 'number' } }
    },
    step: {
      control: 'number',
      description: 'Increment used by the spinner buttons and arrow keys.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1' } }
    },
    showButtons: {
      control: 'boolean',
      description: 'Renders the chevron-up/chevron-down spinner controls.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    prefix: {
      control: false,
      description: 'Content rendered before the input (e.g. `R$`).',
      table: { category: 'slots' }
    },
    suffix: {
      control: false,
      description: 'Content rendered after the input, before the spinner buttons (e.g. `%`).',
      table: { category: 'slots' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted on every value change (typing or spinner).',
      table: { category: 'events', type: { summary: 'number' } }
    },
    onChange: {
      action: 'change',
      description: 'Emitted when the user commits the value (blur or Enter).',
      table: { category: 'events', type: { summary: 'number' } }
    }
  },
  args: {
    modelValue: 0,
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    step: 1,
    showButtons: true
  }
}

export default meta

const Template = (args) => ({
  components: { InputNumber },
  setup() {
    const value = ref(args.modelValue ?? 0)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? 0
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: `
    <div class="w-[20rem]">
      <InputNumber v-bind="args" :model-value="value" @update:model-value="onUpdate" />
    </div>
  `
})

const DEFAULT_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', 'const value = ref(1)']
const DEFAULT_MARKUP = `<div class="w-[20rem]">
  <InputNumber v-model="value" :min="0" :max="100" :step="1" placeholder="Quantity" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Default = {
  args: { modelValue: 1, placeholder: 'Quantity', min: 0, max: 100, step: 1 },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default numeric input at medium size with a placeholder.' },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const small = ref(1)',
  'const medium = ref(10)',
  'const large = ref(100)'
]
const SIZES_MARKUP = `<div class="flex w-[20rem] flex-col gap-[var(--spacing-md)]">
  <InputNumber v-model="small" size="small" :min="0" :max="9" :step="1" />
  <InputNumber v-model="medium" size="medium" :min="0" :max="99" :step="5" />
  <InputNumber v-model="large" size="large" :min="0" :max="1000" :step="50" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Sizes = {
  render: (args) => ({
    components: { InputNumber },
    setup() {
      const small = ref(1)
      const medium = ref(10)
      const large = ref(100)
      const log = (next) => args['onUpdate:modelValue']?.(next)
      return { small, medium, large, log }
    },
    template: `
      <div class="flex w-[20rem] flex-col gap-[var(--spacing-md)]">
        <InputNumber v-model="small" size="small" :min="0" :max="9" :step="1" @update:model-value="log" />
        <InputNumber v-model="medium" size="medium" :min="0" :max="99" :step="5" @update:model-value="log" />
        <InputNumber v-model="large" size="large" :min="0" :max="1000" :step="50" @update:model-value="log" />
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All size variants stacked vertically. Each input has its own `ref`, its own bounds (`min`/`max`), and its own step.'
      },
      source: { code: toSfc(SIZES_SCRIPT, SIZES_MARKUP) }
    }
  }
}

const DISABLED_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', 'const value = ref(42)']
const DISABLED_MARKUP = `<div class="w-[20rem]">
  <InputNumber v-model="value" disabled />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Disabled = {
  args: { modelValue: 42, disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state — interaction (typing, spinner, arrow keys) is fully blocked.'
      },
      source: { code: toSfc(DISABLED_SCRIPT, DISABLED_MARKUP) }
    }
  }
}

const INVALID_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', 'const value = ref(99)']
const INVALID_MARKUP = `<div class="w-[20rem]">
  <InputNumber v-model="value" invalid required />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Invalid = {
  args: { modelValue: 99, invalid: true, required: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Invalid state with the danger border applied. Interaction still works.'
      },
      source: { code: toSfc(INVALID_SCRIPT, INVALID_MARKUP) }
    }
  }
}
