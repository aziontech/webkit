import { ref } from 'vue'
import InputNumber from '@aziontech/webkit/input-number'

const CORE_IMPORT = "import InputNumber from '@aziontech/webkit/input-number'"

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
        component: [
          'Numeric input field with optional increment/decrement spinner buttons. Use when the value is strictly numeric (counts, quantities, ports, thresholds, currency without formatting).',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          'const value = ref(1)',
          '</script>',
          '',
          '<template>',
          '  <InputNumber v-model="value" :min="0" :max="100" :step="1" placeholder="Quantity" />',
          '</template>',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true
      },
      canvas: {
        sourceState: 'shown'
      }
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
    prefix: { control: false, table: { category: 'slots' } },
    suffix: { control: false, table: { category: 'slots' } },
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

const basicSource = ({ initial = '0', bind = '' } = {}) =>
  [
    '<script setup>',
    CORE_IMPORT,
    "import { ref } from 'vue'",
    '',
    `const value = ref(${initial})`,
    '</script>',
    '',
    '<template>',
    `  <InputNumber v-model="value"${bind ? ' ' + bind : ''} />`,
    '</template>'
  ].join('\n')

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Default = {
  args: { placeholder: 'Quantity', modelValue: 1, min: 0, max: 100, step: 1 },
  render: (args) => ({
    components: { InputNumber },
    setup() {
      const value = ref(args.modelValue ?? 0)
      return { args, value }
    },
    template: `
      <div class="w-[20rem]">
        <InputNumber v-bind="args" :model-value="value" @update:model-value="(v) => (value = v)" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: 'Default numeric input at medium size with a placeholder.' },
      source: {
        code: basicSource({
          initial: '1',
          bind: ':min="0" :max="100" :step="1" placeholder="Quantity"'
        })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Sizes = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const small = ref(1)
      const medium = ref(10)
      const large = ref(100)
      return { small, medium, large }
    },
    template: `
      <div class="flex w-[20rem] flex-col gap-[var(--spacing-md)]">
        <InputNumber :model-value="small" size="small" :min="0" :max="9" :step="1" @update:model-value="(v) => (small = v)" />
        <InputNumber :model-value="medium" size="medium" :min="0" :max="99" :step="5" @update:model-value="(v) => (medium = v)" />
        <InputNumber :model-value="large" size="large" :min="0" :max="1000" :step="50" @update:model-value="(v) => (large = v)" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All size variants stacked vertically. Each input has its own `ref`, its own bounds (`min`/`max`), and its own step.'
      },
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          'const small = ref(1)',
          'const medium = ref(10)',
          'const large = ref(100)',
          '</script>',
          '',
          '<template>',
          '  <InputNumber v-model="small" size="small" :min="0" :max="9" :step="1" />',
          '  <InputNumber v-model="medium" size="medium" :min="0" :max="99" :step="5" />',
          '  <InputNumber v-model="large" size="large" :min="0" :max="1000" :step="50" />',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Disabled = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const value = ref(42)
      return { value }
    },
    template: `
      <div class="w-[20rem]">
        <InputNumber :model-value="value" disabled @update:model-value="(v) => (value = v)" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: 'Disabled state — interaction (typing, spinner, arrow keys) is fully blocked.' },
      source: { code: basicSource({ initial: '42', bind: 'disabled' }) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputNumber>} */
export const Invalid = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const value = ref(99)
      return { value }
    },
    template: `
      <div class="w-[20rem]">
        <InputNumber :model-value="value" invalid required @update:model-value="(v) => (value = v)" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: 'Invalid state with the danger border applied. Interaction still works.' },
      source: { code: basicSource({ initial: '99', bind: 'invalid required' }) }
    }
  }
}
