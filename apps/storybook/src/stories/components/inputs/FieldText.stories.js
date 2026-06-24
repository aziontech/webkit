import Button from '@aziontech/webkit/button'
import FieldText from '@aziontech/webkit/inputs/field-text'
import { ref } from 'vue'

/** @type {import('@storybook/vue3').Meta<typeof FieldText>} */
const meta = {
  title: 'Webkit/Inputs/FieldText',
  component: FieldText,
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
          'Form field for free-text input that composes `Label`, `InputText`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a text input needs a visible label or helper/error message — i.e. virtually every form field outside of inline editing. Acts as the canonical wrapper for `InputText` in form contexts.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
          "import FieldText from '@aziontech/webkit/inputs/field-text'",
          '',
          "const email = ref('')",
          '</script>',
          '',
          '<template>',
          '  <FieldText',
          '    v-model="email"',
          '    label="Email"',
          '    placeholder="you@example.com"',
          `    helper-text="We'll never share your email."`,
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
      description: 'Two-way bound value of the underlying `InputText`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the `InputText`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Size forwarded to the `InputText`. Heights: small=28px, medium=32px, large=40px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables the input and switches the helper to `kind="disabled"` (lock icon).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description:
        'Marks the input read-only; value is visible but not editable. Native pass-through.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the `Required` tag to the `Label` and sets native `required` + `aria-required` on the input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Switches the helper to `kind="invalid"` and applies invalid border/ring tokens on the input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description:
        'id for the native input; consumed by `Label` via `for` and by `aria-describedby` wiring.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    name: {
      control: 'text',
      description: 'HTML name for the underlying input (form + vee-validate integration).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    iconLeft: { control: false, table: { category: 'slots', type: { summary: 'slot' } } },
    iconRight: { control: false, table: { category: 'slots', type: { summary: 'slot' } } },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Re-emitted from the underlying `InputText` on every input event.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email.",
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldText },
  setup() {
    return { args }
  },
  template: '<FieldText v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default field with label, input, and helper text.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Sizes = {
  render: () => ({
    components: { FieldText },
    template: `
      <div class="flex flex-col gap-6 w-[320px]">
        <FieldText
          size="small"
          label="Email (small)"
          placeholder="you@example.com"
          helper-text="Small size — 28px input height."
        />
        <FieldText
          size="medium"
          label="Email (medium)"
          placeholder="you@example.com"
          helper-text="Medium size — 32px input height."
        />
        <FieldText
          size="large"
          label="Email (large)"
          placeholder="you@example.com"
          helper-text="Large size — 40px input height."
        />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All three size variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Required = {
  render: () => ({
    components: { FieldText, Button },
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
        <FieldText
          label="Email"
          placeholder="you@example.com"
          :model-value="value"
          @update:model-value="onUpdate"
          :required="missing"
          :disabled="loading"
          :helper-text="missing ? 'This field is required.' : 'We need this to contact you.'"
        />
        <Button label="Submit" size="medium" :loading="loading" @click="onSubmit" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Click **Submit** with the field empty: the button shows the loading spinner for ~1.2s (simulating an async call) and the input is locked. When loading finishes, the required check fires — the `Label` gets the Required tag, the input border turns warning, and the helper switches to the warning-tone "This field is required." copy. Typing any value clears the error.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Invalid = {
  args: {
    invalid: true,
    label: 'Email',
    modelValue: 'not-an-email',
    helperText: 'Enter a valid email address.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state — the helper switches to `kind="invalid"` (danger tokens) and the input gets the invalid border/ring plus `aria-invalid`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Disabled = {
  args: {
    disabled: true,
    label: 'Email',
    modelValue: 'locked@example.com',
    helperText: 'This field is locked.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — the input is disabled, the helper switches to `kind="disabled"` (lock icon), and the label dims via inherited muted text token.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Icons = {
  render: (args) => ({
    components: { FieldText },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-col gap-6 w-[320px]">
        <FieldText label="With leading icon" placeholder="example.com">
          <template #iconLeft>
            <i class="pi pi-globe" />
          </template>
        </FieldText>
        <FieldText label="With trailing icon" placeholder="example.com">
          <template #iconRight>
            <i class="pi pi-times" />
          </template>
        </FieldText>
        <FieldText label="With both icons" placeholder="example.com">
          <template #iconLeft>
            <i class="pi pi-globe" />
          </template>
          <template #iconRight>
            <i class="pi pi-times" />
          </template>
        </FieldText>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`#iconLeft` and `#iconRight` slots are forwarded to the underlying `InputText`, alone and combined.'
      }
    }
  }
}
