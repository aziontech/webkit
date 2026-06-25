import Button from '@aziontech/webkit/button'
import FieldPassword from '@aziontech/webkit/field-password'
import { ref, watch } from 'vue'

/** @type {import('@storybook/vue3').Meta<typeof FieldPassword>} */
const meta = {
  title: 'Webkit/Inputs/FieldPassword',
  component: FieldPassword,
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
          'Form field for password input that composes `Label`, `InputPassword`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a password input needs a visible label or helper/error message — login, sign-up, and password-change forms. Acts as the canonical wrapper for `InputPassword` in form contexts, mirroring the `FieldText` pattern.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
          "import FieldPassword from '@aziontech/webkit/field-password'",
          '',
          "const password = ref('')",
          '</script>',
          '',
          '<template>',
          '  <FieldPassword',
          '    v-model="password"',
          '    label="Password"',
          '    placeholder="Enter your password"',
          '    helper-text="At least 8 characters."',
          '    autocomplete="new-password"',
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
      description: 'Two-way bound value of the underlying `InputPassword`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the `InputPassword`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    maxLength: {
      control: { type: 'number', min: 0 },
      description: 'Native `maxlength` forwarded to the `InputPassword`.',
      table: { category: 'props', type: { summary: 'number' } }
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
    toggleable: {
      control: 'boolean',
      description:
        'Forwards to `InputPassword`. When true, renders the visibility toggle on the trailing edge; when false, the field behaves as a plain password input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    autocomplete: {
      control: 'select',
      options: ['current-password', 'new-password', 'off'],
      description:
        'Forwarded to the `InputPassword` for password-manager hints. Use `new-password` for sign-up and password-change flows.',
      table: {
        category: 'props',
        type: { summary: "'current-password' | 'new-password' | 'off'" },
        defaultValue: { summary: "'current-password'" }
      }
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
      description: 'Re-emitted from the underlying `InputPassword` on every input event.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'At least 8 characters.',
    maxLength: undefined,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    toggleable: true,
    autocomplete: 'current-password'
  }
}

export default meta

const Template = (args) => ({
  components: { FieldPassword },
  setup() {
    const value = ref(args.modelValue ?? '')
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? ''
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template:
    '<FieldPassword v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPassword>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default field with label, password input, and helper text.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPassword>} */
export const Required = {
  render: () => ({
    components: { FieldPassword, Button },
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
        <FieldPassword
          label="Password"
          placeholder="Enter your password"
          autocomplete="new-password"
          :model-value="value"
          @update:model-value="onUpdate"
          :required="missing"
          :disabled="loading"
          :helper-text="missing ? 'This field is required.' : 'At least 8 characters.'"
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

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPassword>} */
export const Invalid = {
  args: {
    invalid: true,
    label: 'Password',
    modelValue: 'weak',
    helperText: 'Password must be at least 8 characters.'
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

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPassword>} */
export const Disabled = {
  args: {
    disabled: true,
    label: 'Password',
    modelValue: 'locked-value',
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

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPassword>} */
export const Toggle = {
  render: () => ({
    components: { FieldPassword },
    setup() {
      const withToggle = ref('hunter2')
      const withoutToggle = ref('hunter2')
      return { withToggle, withoutToggle }
    },
    template: `
      <div class="flex flex-col gap-6 w-[320px]">
        <FieldPassword
          label="With toggle (default)"
          placeholder="Enter your password"
          helper-text="Click the eye icon to reveal the value."
          :toggleable="true"
          :model-value="withToggle"
          @update:model-value="(v) => (withToggle = v)"
        />
        <FieldPassword
          label="Without toggle"
          placeholder="Enter your password"
          helper-text="Plain password field, no visibility toggle."
          :toggleable="false"
          :model-value="withoutToggle"
          @update:model-value="(v) => (withoutToggle = v)"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`toggleable=true` (default) renders the visibility toggle button; `toggleable=false` renders a plain password field — the prop is forwarded to the underlying `InputPassword`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPassword>} */
export const Icons = {
  render: () => ({
    components: { FieldPassword },
    template: `
      <div class="flex flex-col gap-6 w-[320px]">
        <FieldPassword label="With leading icon" placeholder="Enter your password">
          <template #iconLeft>
            <i class="pi pi-lock" />
          </template>
        </FieldPassword>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`#iconLeft` slot is forwarded to the underlying `InputPassword`. `#iconRight` is only honored when `toggleable=false` — the visibility toggle occupies that position by default.'
      }
    }
  }
}
