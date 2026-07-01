import Button from '@aziontech/webkit/button'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import { ref } from 'vue'

/** @type {import('@storybook/vue3').Meta<typeof FieldTextarea>} */
const meta = {
  title: 'Components/Inputs/FieldTextarea',
  component: FieldTextarea,
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
          'Form field for multi-line text input that composes `Label`, `Textarea`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a textarea needs a visible label or helper/error message — i.e. virtually every long-form field outside of inline editing. Acts as the canonical wrapper for `Textarea` in form contexts.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
          "import FieldTextarea from '@aziontech/webkit/field-textarea'",
          '',
          "const message = ref('')",
          '</script>',
          '',
          '<template>',
          '  <FieldTextarea',
          '    v-model="message"',
          '    label="Message"',
          '    placeholder="Write your message"',
          '    helper-text="Up to 500 characters."',
          '    required',
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
      description: 'Two-way bound value of the underlying `Textarea`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the `Textarea`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables the textarea and switches the helper to `kind="disabled"` (lock icon).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description:
        'Marks the textarea read-only; value is visible but not editable. Native pass-through.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the `Required` tag to the `Label` and sets native `required` + `aria-required` on the textarea.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Switches the helper to `kind="invalid"` and applies invalid border/ring tokens on the textarea.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description:
        'id for the native textarea; consumed by `Label` via `for` and by `aria-describedby` wiring.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    name: {
      control: 'text',
      description: 'HTML name for the underlying textarea (form + vee-validate integration).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Re-emitted from the underlying `Textarea` on every input event.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    label: 'Message',
    placeholder: 'Write your message',
    helperText: 'Up to 500 characters.',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldTextarea },
  setup() {
    return { args }
  },
  template: '<FieldTextarea v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextarea>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default field with label, textarea, and helper text.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextarea>} */
export const Required = {
  render: () => ({
    components: { FieldTextarea, Button },
    setup() {
      const value = ref('')
      const missing = ref(false)
      const loading = ref(false)

      const onSubmit = () => {
        if (loading.value) return
        missing.value = false
        loading.value = true
        setTimeout(() => {
          loading.value = false
          missing.value = !value.value
        }, 1200)
      }

      const onUpdate = (next) => {
        value.value = next
        if (next) missing.value = false
      }

      return { value, missing, loading, onSubmit, onUpdate }
    },
    template: `
      <div class="flex flex-col gap-4 w-[320px]">
        <FieldTextarea
          label="Message"
          placeholder="Write your message"
          :model-value="value"
          @update:model-value="onUpdate"
          :required="missing"
          :disabled="loading"
          :helper-text="missing ? 'This field is required.' : 'Tell us a bit about your request.'"
        />
        <Button label="Submit" size="medium" :loading="loading" @click="onSubmit" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Click **Submit** with the field empty: the button shows the loading spinner for ~1.2s (simulating an async call) and the textarea is locked. When loading finishes, the required check fires — the `Label` gets the Required tag, the textarea border turns warning, and the helper switches to the warning-tone "This field is required." copy. Typing any value clears the error.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextarea>} */
export const Invalid = {
  args: {
    invalid: true,
    label: 'Message',
    modelValue: 'Text filled',
    helperText: 'This value is not valid.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state — the helper switches to `kind="invalid"` (danger tokens) and the textarea gets the invalid border/ring plus `aria-invalid`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextarea>} */
export const Disabled = {
  args: {
    disabled: true,
    label: 'Message',
    modelValue: 'This message is locked.',
    helperText: 'This field is locked.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — the textarea is disabled, the helper switches to `kind="disabled"` (lock icon), and the label dims via inherited muted text token.'
      }
    }
  }
}
