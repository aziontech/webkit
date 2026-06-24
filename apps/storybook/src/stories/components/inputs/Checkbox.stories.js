import { ref, watch } from 'vue'

import Checkbox from '@aziontech/webkit/checkbox'

/** @type {import('@storybook/vue3').Meta<typeof Checkbox>} */
const meta = {
 title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          'Square checkbox control only — the box, the native input, and the check glyph, with no label or description chrome. Use it when you compose your own label, or reach for `FieldCheckbox` / `FieldCheckboxBlock` when you want built-in text. Supports a single boolean (`binary`) or collecting a `value` into an array model.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
          "import Checkbox from '@aziontech/webkit/inputs/checkbox'",
          '',
          'const accepted = ref(false)',
          '</script>',
          '',
          '<template>',
          '  <label class="inline-flex items-center gap-[var(--spacing-2)]">',
          '    <Checkbox v-model="accepted" binary input-id="accept-terms" />',
          '    Accept terms',
          '  </label>',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Bound value: a boolean in binary mode, otherwise the array/value the control reflects.',
      table: { type: { summary: 'unknown' }, category: 'props' }
    },
    value: {
      control: false,
      description: "This checkbox's value, added to or removed from the model array when not binary.",
      table: { type: { summary: 'unknown' }, category: 'props' }
    },
    binary: {
      control: 'boolean',
      description: 'Toggles a single boolean instead of collecting value into an array.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    readonly: {
      control: 'boolean',
      description: 'Prevents changes while the control stays focusable.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'Forwarded to the native input id; pair with an external label for attribute.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    name: {
      control: 'text',
      description: 'HTML name for form submission.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    tabindex: {
      control: 'number',
      description: 'Tab order for the native input.',
      table: { type: { summary: 'number' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted on toggle; payload is the next boolean (binary) or the updated value array.',
      table: { type: { summary: 'unknown' }, category: 'events' }
    }
  },
  args: {
    binary: true,
    disabled: false,
    readonly: false
  }
}

export default meta

const Template = (args) => ({
  components: { Checkbox },
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
  template: '<Checkbox v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Checkbox>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Binary control only — associate copy via an external label or FieldCheckbox.' } }
  }
}

export const Disabled = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args }
    },
    template: `
      <div class="flex items-center gap-[var(--spacing-4)]">
        <Checkbox v-bind="args" :model-value="true" disabled aria-label="Disabled checked" />
        <Checkbox v-bind="args" :model-value="false" disabled aria-label="Disabled unchecked" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'Disabled control in both checked and unchecked states.' } }
  }
}
