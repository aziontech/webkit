import { ref } from 'vue'

import Textarea from '@aziontech/webkit/textarea'

const CORE_IMPORT = "import Textarea from '@aziontech/webkit/textarea'"

const basicSource = ({ initial = "''", bind = '' } = {}) =>
  [
    '<script setup>',
    CORE_IMPORT,
    "import { ref } from 'vue'",
    '',
    `const value = ref(${initial})`,
    '</script>',
    '',
    '<template>',
    `  <Textarea v-model="value"${bind ? ' ' + bind : ''} />`,
    '</template>'
  ].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof Textarea>} */
const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          'Multi-line free-form text input. Renders a fixed-size (large) textarea with a vertical resize handle. Native textarea attributes (rows, maxlength, name, ...) flow through via attribute fallthrough. Supports optional `iconLeft` / `iconRight` slots — the textarea padding adjusts automatically so the text never sits under an icon. When `disabled`, the trailing slot is suppressed and a lock icon takes its place.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
          '</script>',
          '',
          '<template>',
          '  <Textarea v-model="value" placeholder="Write your message" />',
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
      control: 'text',
      description: 'Bound value (v-model).',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the field as read-only.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies invalid styling and sets aria-invalid.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required and sets aria-required.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the bound value changes.',
      table: { type: { summary: 'string' }, category: 'events' }
    },
    iconLeft: {
      control: false,
      description: 'Optional leading icon, rendered at top-left inside the field.',
      table: { type: { summary: 'slot' }, category: 'slots' }
    },
    iconRight: {
      control: false,
      description:
        'Optional trailing icon, rendered at top-right. Suppressed when `disabled` (lock icon takes over).',
      table: { type: { summary: 'slot' }, category: 'slots' }
    }
  }
}

export default meta

const Template = (args) => ({
  components: { Textarea },
  setup() {
    const value = ref(args.modelValue ?? '')
    return { args, value }
  },
  template: `
    <div class="max-w-sm">
      <Textarea v-model="value" v-bind="args" />
    </div>
  `
})

export const Default = {
  args: { placeholder: 'Write your message' },
  render: Template,
  parameters: {
    docs: {
      source: {
        code: basicSource({ bind: 'placeholder="Write your message"' })
      }
    }
  }
}

export const Disabled = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <Textarea v-model="value" placeholder="Placeholder" disabled />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: basicSource({ bind: 'placeholder="Placeholder" disabled' })
      }
    }
  }
}

export const Invalid = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('Text Filled')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <Textarea v-model="value" invalid />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: basicSource({ initial: "'Text Filled'", bind: 'invalid' })
      }
    }
  }
}

export const Required = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <Textarea v-model="value" required placeholder="Required field" />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: basicSource({ bind: 'required placeholder="Required field"' })
      }
    }
  }
}

export const WithIcons = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm flex flex-col gap-[var(--spacing-md)]">
        <Textarea v-model="value" placeholder="Leading icon">
          <template #iconLeft><i class="pi pi-pencil" /></template>
        </Textarea>
        <Textarea v-model="value" placeholder="Trailing icon">
          <template #iconRight><i class="pi pi-info-circle" /></template>
        </Textarea>
        <Textarea v-model="value" placeholder="Both icons">
          <template #iconLeft><i class="pi pi-pencil" /></template>
          <template #iconRight><i class="pi pi-info-circle" /></template>
        </Textarea>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
          '</script>',
          '',
          '<template>',
          '  <Textarea v-model="value" placeholder="Leading icon">',
          '    <template #iconLeft><i class="pi pi-pencil" /></template>',
          '  </Textarea>',
          '',
          '  <Textarea v-model="value" placeholder="Trailing icon">',
          '    <template #iconRight><i class="pi pi-info-circle" /></template>',
          '  </Textarea>',
          '',
          '  <Textarea v-model="value" placeholder="Both icons">',
          '    <template #iconLeft><i class="pi pi-pencil" /></template>',
          '    <template #iconRight><i class="pi pi-info-circle" /></template>',
          '  </Textarea>',
          '</template>'
        ].join('\n')
      }
    }
  }
}
