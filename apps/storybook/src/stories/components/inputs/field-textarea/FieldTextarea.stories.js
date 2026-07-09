import { ref } from 'vue'

import Button from '@aziontech/webkit/button'
import FieldTextarea from '@aziontech/webkit/field-textarea'

import { toSfc } from '../../../_shared/story-source'

const CORE_IMPORT = "import FieldTextarea from '@aziontech/webkit/field-textarea'"
const IMPORTS = [CORE_IMPORT, "import { ref } from 'vue'"]

const withRef = (body, { initial = "''" } = {}) =>
  toSfc(IMPORTS, [`const value = ref(${initial})`, '', body].join('\n'))

/** @type {import('@storybook/vue3').Meta<typeof FieldTextarea>} */
const meta = {
  title: 'Components/Inputs/FieldTextarea',
  component: FieldTextarea,
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
        component:
          'Form field for multi-line text input that composes `Label`, `Textarea`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a textarea needs a visible label or helper/error message — i.e. virtually every long-form field outside of inline editing. Acts as the canonical wrapper for `Textarea` in form contexts.'
      },
      canvas: { sourceState: 'shown' }
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
        'Disables the underlying textarea and prepends a lock icon to the helper text row.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    readonly: {
      control: 'boolean',
      description:
        'Marks the textarea read-only; the value is visible but not editable. Native pass-through.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the `Required` tag to the `Label`, sets native `required` + `aria-required` on the textarea, and switches the helper to the warning tone.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    invalid: {
      control: 'boolean',
      description:
        'Applies invalid border tokens on the textarea (danger tone), sets `aria-invalid`, and switches the helper text to the danger tone.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    resizable: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both', 'none'],
      description:
        'Forwarded to the underlying `Textarea`; controls which axes the user can drag to resize the field.',
      table: {
        category: 'props',
        type: { summary: "'vertical' | 'horizontal' | 'both' | 'none'" },
        defaultValue: { summary: "'vertical'" }
      }
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
    invalid: false,
    resizable: 'vertical'
  }
}

export default meta

const Template = (args) => ({
  components: { FieldTextarea },
  setup: () => ({ args }),
  template: '<FieldTextarea v-bind="args" />'
})

const DEFAULT_MARKUP = `<FieldTextarea
  v-model="value"
  label="Message"
  placeholder="Write your message"
  helper-text="Up to 500 characters."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextarea>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default field with label, textarea, and helper text.' },
      source: { code: withRef(DEFAULT_MARKUP) }
    }
  }
}

const REQUIRED_MARKUP = `<FieldTextarea
  v-model="value"
  label="Message"
  placeholder="Write your message"
  helper-text="This field is required."
  required
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextarea>} */
export const Required = {
  render: () => ({
    components: { FieldTextarea, Button },
    setup() {
      const value = ref('')
      // Start with the required indicator visible so the state is documented at rest, not only after submit.
      const missing = ref(true)
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
          'The required indicator is on by default so the state is visible without interaction. Click **Submit** with the field empty: the button shows the loading spinner for ~1.2s (simulating an async call) and the textarea is locked; when loading finishes, the required check re-fires — the `Label` keeps the Required tag, the textarea border stays warning, and the helper reads "This field is required." Typing any value clears the state.'
      },
      controls: { disable: true },
      source: { code: withRef(REQUIRED_MARKUP) }
    }
  }
}

const INVALID_MARKUP = `<FieldTextarea
  v-model="value"
  label="Message"
  helper-text="This value is not valid."
  invalid
/>`

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
          'Invalid state — the helper switches to danger tokens and the textarea gets the invalid border plus `aria-invalid`.'
      },
      source: { code: withRef(INVALID_MARKUP, { initial: "'Text filled'" }) }
    }
  }
}

const DISABLED_MARKUP = `<FieldTextarea
  v-model="value"
  label="Message"
  helper-text="This field is locked."
  disabled
/>`

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
          'Disabled state — the textarea is disabled, a lock icon appears in the helper row, and the label dims via the muted text token.'
      },
      source: { code: withRef(DISABLED_MARKUP, { initial: "'This message is locked.'" }) }
    }
  }
}
