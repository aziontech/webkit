import { ref, watch } from 'vue'

import InputPassword from '@aziontech/webkit/input-password'

/** @type {import('@storybook/vue3').Meta<typeof InputPassword>} */
const meta = {
  title: 'Components/Inputs/InputPassword',
  component: InputPassword,
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
          'Single-line password input for forms. Renders a bordered field with a built-in visibility toggle button on the trailing edge that flips the native `type` between `password` and `text`. Shares the visual language of `InputText` (same heights, borders, focus ring, disabled treatment). The component is the field only — labels, helper text, and strength meters live in the wrapping form-field layer.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import InputPassword from '@aziontech/webkit/input-password'",
          "import { ref } from 'vue'",
          '',
          "const password = ref('')",
          '</script>',
          '',
          '<template>',
          '  <InputPassword',
          '    v-model="password"',
          '    placeholder="Enter your password"',
          '    autocomplete="current-password"',
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
      description: 'Two-way bound value of the field.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    maxLength: {
      control: { type: 'number', min: 0 },
      description: 'Native `maxlength` — maximum number of characters allowed.',
      table: { category: 'props', type: { summary: 'number' } }
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables interaction and applies disabled tokens. The toggle button inherits the disabled state.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description:
        'Marks the field read-only; value is visible but not editable. Toggle button stays operable.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Marks the field as required; sets native `required` and `aria-required`. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies the invalid border + ring tokens and sets `aria-invalid`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    toggleable: {
      control: 'boolean',
      description:
        'When true, renders the visibility toggle button on the trailing edge of the field. When false, the field behaves as a plain password input with no toggle and the `iconRight` slot becomes available.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    autocomplete: {
      control: 'select',
      options: ['current-password', 'new-password', 'off'],
      description:
        'Native `autocomplete` hint for password managers. Use `new-password` for sign-up and password-change flows.',
      table: {
        category: 'props',
        type: { summary: "'current-password' | 'new-password' | 'off'" },
        defaultValue: { summary: "'current-password'" }
      }
    },
    iconLeft: { control: false, table: { category: 'slots', type: { summary: 'slot' } } },
    iconRight: { control: false, table: { category: 'slots', type: { summary: 'slot' } } },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted on native `input` event with the new value.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    placeholder: 'Enter your password',
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
  components: { InputPassword },
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
    '<InputPassword v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default empty password input with the visibility toggle enabled.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const Toggle = {
  render: (args) => ({
    components: { InputPassword },
    setup() {
      const withToggle = ref('')
      const withoutToggle = ref('')
      const log = (variant) => (next) => args['onUpdate:modelValue']?.({ variant, value: next })
      return { args, withToggle, withoutToggle, log }
    },
    template: `
      <div class="flex flex-col items-stretch gap-4 w-[280px]">
        <InputPassword v-bind="args" :toggleable="true" placeholder="Toggleable (default)" :model-value="withToggle" @update:model-value="log('toggleable')" />
        <InputPassword v-bind="args" :toggleable="false" placeholder="No toggle" :model-value="withoutToggle" @update:model-value="log('plain')" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`toggleable=true` (default) renders the visibility toggle button on the trailing edge; `toggleable=false` renders a plain password field and frees the `iconRight` slot.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const IconLeft = {
  render: (args) => ({
    components: { InputPassword },
    setup() {
      const value = ref('')
      const onUpdate = (next) => {
        value.value = next
        args['onUpdate:modelValue']?.(next)
      }
      return { args, value, onUpdate }
    },
    template: `
      <div class="flex flex-col items-stretch gap-4 w-[280px]">
        <InputPassword v-bind="args" placeholder="Enter your password" :model-value="value" @update:model-value="onUpdate">
          <template #iconLeft>
            <i class="pi pi-lock" />
          </template>
        </InputPassword>
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'Leading `iconLeft` slot — the only icon slot honored when `toggleable=true`.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const Filled = {
  args: { modelValue: 'super-secret-value' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Pre-populated `modelValue` shows the filled visual state and the masked rendering (driven by `:not(:placeholder-shown)`).'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const Invalid = {
  args: { invalid: true, modelValue: 'weak' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Invalid state — applies danger border/ring tokens and `aria-invalid`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const MaxLength = {
  args: { maxLength: 8, placeholder: 'Up to 8 characters', modelValue: '' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Hard character cap of 8 enforced by the native `maxlength` attribute.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputPassword>} */
export const Disabled = {
  args: { disabled: true, modelValue: 'disabled-value' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state — the toggle button inherits the disabled state.' } }
  }
}
