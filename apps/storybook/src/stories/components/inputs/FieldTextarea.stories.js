import { ref } from 'vue'

import FieldTextarea from '@aziontech/webkit/field-textarea'

const CORE_IMPORT = "import FieldTextarea from '@aziontech/webkit/field-textarea'"

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
    '  <FieldTextarea',
    '    v-model="value"',
    '    name="message"',
    '    label="Message"',
    ...(bind ? bind.split('\n').map((line) => `    ${line}`) : []),
    '  />',
    '</template>'
  ].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof FieldTextarea>} */
const meta = {
  title: 'Webkit/Inputs/Field Textarea',
  component: FieldTextarea,
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
          'Labeled multi-line text field — composes Label, Textarea, and HelperText into a single form-ready control. Sibling of FieldText; hosts Textarea (fixed large size, vertical resize, 80px min-height).',
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
          '  <FieldTextarea',
          '    v-model="value"',
          '    name="message"',
          '    label="Message"',
          '    placeholder="Write your message"',
          '    helperText="Up to 500 characters."',
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
      control: 'text',
      description: 'Two-way bound value of the underlying Textarea.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    name: {
      control: 'text',
      description: 'HTML name for the underlying textarea (form integration).',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the Label.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the Textarea.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    helperText: {
      control: 'text',
      description: 'Auxiliary helper text shown below the field.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and switches helper to kind=disabled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the field as read-only.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    required: {
      control: 'boolean',
      description: 'Adds the Required tag and sets aria-required.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    invalid: {
      control: 'boolean',
      description: 'Switches helper to kind=invalid and applies invalid border on the textarea.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'id for the native textarea.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the bound value changes.',
      table: { type: { summary: 'string' }, category: 'events' }
    }
  }
}

export default meta

const Template = (args) => ({
  components: { FieldTextarea },
  setup() {
    const value = ref(args.modelValue ?? '')
    return { args, value }
  },
  template: `
    <div class="max-w-sm">
      <FieldTextarea v-model="value" v-bind="args" />
    </div>
  `
})

export const Required = {
  args: {
    name: 'message',
    label: 'Message',
    placeholder: 'Write your message',
    helperText: 'This field is required.',
    required: true
  },
  render: Template,
  parameters: {
    docs: {
      source: {
        code: basicSource({
          bind: 'placeholder="Write your message"\nhelperText="This field is required."\nrequired'
        })
      }
    }
  }
}

export const Invalid = {
  args: {
    name: 'message',
    label: 'Message',
    modelValue: 'Text Filled',
    helperText: 'This value is not valid.',
    invalid: true
  },
  render: Template,
  parameters: {
    docs: {
      source: {
        code: basicSource({
          initial: "'Text Filled'",
          bind: 'helperText="This value is not valid."\ninvalid'
        })
      }
    }
  }
}
