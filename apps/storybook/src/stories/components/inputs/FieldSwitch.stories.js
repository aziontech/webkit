import { ref } from 'vue'

import FieldSwitch from '@aziontech/webkit/field-switch'

const CORE_IMPORT = "import FieldSwitch from '@aziontech/webkit/field-switch'"

const basicSource = ({ initial = 'false', bind = '' } = {}) =>
  [
    '<script setup>',
    CORE_IMPORT,
    "import { ref } from 'vue'",
    '',
    `const value = ref(${initial})`,
    '</script>',
    '',
    '<template>',
    `  <FieldSwitch v-model="value"${bind ? ' ' + bind : ''} />`,
    '</template>'
  ].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof FieldSwitch>} */
const meta = {
 title: 'Components/Inputs/Field Switch',
  component: FieldSwitch,
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
        component: [
          'Inline boolean toggle with switch on the leading edge, label, optional description, and optional disabled helper badge.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          'const value = ref(false)',
          '</script>',
          '',
          '<template>',
          '  <FieldSwitch',
          '    v-model="value"',
          '    label="Switch label"',
          '    description="Switch description"',
          '  />',
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
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: { type: { summary: 'boolean' }, category: 'props' }
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
    required: {
      control: 'boolean',
      description:
        'Adds the Required tag to the Label and sets aria-required on the switch.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { type: { summary: 'boolean' }, category: 'events' }
    }
  },
  args: {
    modelValue: false,
    label: 'Switch label',
    description: 'Switch description',
    helperText: '',
    disabled: false
  }
}

export default meta

export const Default = {
  render: (args) => ({
    components: { FieldSwitch },
    setup() {
      const model = ref(args.modelValue)
      return { args, model }
    },
    template: `
      <FieldSwitch
        v-bind="args"
        v-model="model"
      />
    `
  }),
  parameters: {
    docs: {
      source: {
        code: basicSource({
          bind: 'label="Switch label" description="Switch description"'
        })
      }
    }
  }
}

export const States = {
  render: () => ({
    components: { FieldSwitch },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: `
      <div class="flex max-w-xs flex-col gap-[var(--spacing-3)]">
        <FieldSwitch
          v-model="off"
          label="Switch label"
          description="Switch description"
        />
        <FieldSwitch
          v-model="on"
          label="Switch label"
          description="Switch description"
        />
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
          'const off = ref(false)',
          'const on = ref(true)',
          '</script>',
          '',
          '<template>',
          '  <FieldSwitch',
          '    v-model="off"',
          '    label="Switch label"',
          '    description="Switch description"',
          '  />',
          '  <FieldSwitch',
          '    v-model="on"',
          '    label="Switch label"',
          '    description="Switch description"',
          '  />',
          '</template>'
        ].join('\n')
      }
    }
  }
}

export const Required = {
  args: {
    modelValue: false,
    label: 'Enable notifications',
    description: 'Required to proceed.',
    required: true
  },
  render: (args) => ({
    components: { FieldSwitch },
    setup() {
      const model = ref(args.modelValue)
      return { args, model }
    },
    template: `
      <FieldSwitch
        v-bind="args"
        v-model="model"
      />
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When `required` is `true`, the Label shows the `*(Required)` indicator and the switch receives `aria-required="true"`.'
      },
      source: {
        code: basicSource({
          bind: 'label="Enable notifications" description="Required to proceed." required'
        })
      }
    }
  }
}

export const Disabled = {
  args: {
    modelValue: true,
    helperText: 'Helper Text',
    disabled: true
  },
  render: (args) => ({
    components: { FieldSwitch },
    setup() {
      const model = ref(args.modelValue)
      return { args, model }
    },
    template: `
      <FieldSwitch
        v-bind="args"
        v-model="model"
      />
    `
  }),
  parameters: {
    docs: {
      source: {
        code: basicSource({
          initial: 'true',
          bind: 'label="Switch label" description="Switch description" helperText="Helper Text" disabled'
        })
      }
    }
  }
}
