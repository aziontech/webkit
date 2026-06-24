import { ref, watch } from 'vue'

import Button from '@aziontech/webkit/button'
import InputText from '@aziontech/webkit/inputs/input-text'

/** @type {import('@storybook/vue3').Meta<typeof InputText>} */
const meta = {
  title: 'Webkit/Inputs/InputText',
  component: InputText,
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
          'Single-line text input for forms and inline editing. Renders a bordered field with optional leading/trailing icon slots. Visual states (hover, focus, filled) are driven by native CSS pseudo-classes, not props. The component is the field only — labels, helper text, and error messages live in the wrapping form-field layer.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
          "import InputText from '@aziontech/webkit/inputs/input-text'",
          '',
          "const value = ref('')",
          '</script>',
          '',
          '<template>',
          '  <InputText v-model="value" placeholder="Type something" />',
          '',
          '  <InputText v-model="value" placeholder="example.com">',
          '    <template #iconLeft>',
          '      <i class="pi pi-globe" />',
          '    </template>',
          '  </InputText>',
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
    type: {
      control: 'select',
      options: ['text', 'email'],
      description:
        'Native input type. Restricted to plain-text variants the field treats identically.',
      table: {
        category: 'props',
        type: { summary: "'text' | 'email'" },
        defaultValue: { summary: "'text'" }
      }
    },
    maxLength: {
      control: { type: 'number', min: 0 },
      description: 'Native `maxlength` — maximum number of characters allowed.',
      table: { category: 'props', type: { summary: 'number' } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Size token; affects height only — padding and typography are constant. Heights: small=28px, medium=32px, large=40px.',
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
      description:
        'Marks the field read-only; value is visible but not editable. Native pass-through.',
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
    placeholder: 'Type something',
    type: 'text',
    maxLength: undefined,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { InputText },
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
  template: '<InputText v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default empty input at medium size.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Sizes = {
  render: (args) => ({
    components: { InputText },
    setup() {
      const small = ref('')
      const medium = ref('')
      const large = ref('')
      const log = (size) => (next) => args['onUpdate:modelValue']?.({ size, value: next })
      return { args, small, medium, large, log }
    },
    template: `
      <div class="flex flex-col items-stretch gap-4 w-[280px]">
        <InputText v-bind="args" size="small" placeholder="Small (28px)" :model-value="small" @update:model-value="log('small')" />
        <InputText v-bind="args" size="medium" placeholder="Medium (32px)" :model-value="medium" @update:model-value="log('medium')" />
        <InputText v-bind="args" size="large" placeholder="Large (40px)" :model-value="large" @update:model-value="log('large')" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All size variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Icons = {
  render: (args) => ({
    components: { InputText },
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
        <InputText v-bind="args" placeholder="Type your domain" :model-value="value" @update:model-value="onUpdate">
          <template #iconLeft>
            <i class="pi pi-globe" />
          </template>
        </InputText>
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'Leading icon slot with a descriptive placeholder.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Filled = {
  args: { modelValue: 'Example value' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Pre-populated value to show the filled visual state (driven by `:not(:placeholder-shown)`).'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Invalid = {
  args: { invalid: true, modelValue: 'invalid value' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Invalid state — applies danger border/ring tokens and `aria-invalid`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Email = {
  render: (args) => ({
    components: { InputText, Button },
    setup() {
      const value = ref('')
      const invalid = ref(false)
      const onUpdate = (next) => {
        value.value = next
        if (invalid.value) invalid.value = false
        args['onUpdate:modelValue']?.(next)
      }
      const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const validate = () => {
        invalid.value = !EMAIL_RE.test(value.value.trim())
      }
      return { args, value, invalid, onUpdate, validate }
    },
    template: `
      <div class="flex items-start gap-2 w-[320px]">
        <InputText
          v-bind="args"
          type="email"
          placeholder="you@example.com"
          :model-value="value"
          :invalid="invalid"
          @update:model-value="onUpdate"
        />
        <Button label="Submit" size="medium" @click="validate" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Native `type="email"`. Click **Validate** to check the value — flips to the `invalid` state when the value is not a valid email; clears on the next keystroke.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const MaxLength = {
  args: { maxLength: 10, placeholder: 'Up to 10 characters', modelValue: '' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Hard character cap of 10 enforced by the native `maxlength` attribute.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Disabled = {
  args: { disabled: true, modelValue: 'Disabled value' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state.' } }
  }
}

