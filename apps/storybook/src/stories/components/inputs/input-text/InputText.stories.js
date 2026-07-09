import { ref, watch } from 'vue'

import Button from '@aziontech/webkit/button'
import InputText from '@aziontech/webkit/input-text'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import InputText from '@aziontech/webkit/input-text'"

/** @type {import('@storybook/vue3').Meta<typeof InputText>} */
const meta = {
  title: 'Components/Inputs/InputText',
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
        component:
          'Single-line text input for forms and inline editing. Renders a bordered field with optional leading/trailing icon slots. Visual states (hover, focus, filled) are driven by native CSS pseudo-classes, not props. The component is the field only — labels, helper text, and error messages live in the wrapping form-field layer.'
      },
      canvas: { sourceState: 'shown' }
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
      options: ['text', 'email', 'number'],
      description:
        'Native input type. Restricted to single-line variants the field treats identically.',
      table: {
        category: 'props',
        type: { summary: "'text' | 'email' | 'number'" },
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
    iconLeft: {
      control: false,
      description: 'Leading icon rendered inside the field, before the input.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    iconRight: {
      control: false,
      description: 'Trailing icon rendered inside the field, after the input.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
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

const DEFAULT_MARKUP = '<InputText v-model="value" placeholder="Type something" />'
const DEFAULT_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', "const value = ref('')"]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default empty input at medium size.' },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col items-stretch gap-4 w-[280px]">
  <InputText v-model="small" size="small" placeholder="Small (28px)" />
  <InputText v-model="medium" size="medium" placeholder="Medium (32px)" />
  <InputText v-model="large" size="large" placeholder="Large (40px)" />
</div>`
const SIZES_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  "const small = ref('')",
  "const medium = ref('')",
  "const large = ref('')"
]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Sizes = {
  render: () => ({
    components: { InputText },
    setup() {
      const small = ref('')
      const medium = ref('')
      const large = ref('')
      return { small, medium, large }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All size variants side by side.' },
      source: { code: toSfc(SIZES_SCRIPT, SIZES_TEMPLATE) }
    }
  }
}

const ICONS_TEMPLATE = `<div class="flex flex-col items-stretch gap-4 w-[280px]">
  <InputText v-model="leading" placeholder="Leading icon">
    <template #iconLeft>
      <i class="pi pi-globe" />
    </template>
  </InputText>
  <InputText v-model="trailing" placeholder="Trailing icon">
    <template #iconRight>
      <i class="pi pi-search" />
    </template>
  </InputText>
  <InputText v-model="both" placeholder="Both icons">
    <template #iconLeft>
      <i class="pi pi-globe" />
    </template>
    <template #iconRight>
      <i class="pi pi-search" />
    </template>
  </InputText>
</div>`
const ICONS_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  "const leading = ref('')",
  "const trailing = ref('')",
  "const both = ref('')"
]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Icons = {
  render: () => ({
    components: { InputText },
    setup() {
      const leading = ref('')
      const trailing = ref('')
      const both = ref('')
      return { leading, trailing, both }
    },
    template: ICONS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'The `iconLeft` slot, the `iconRight` slot, and both combined.'
      },
      source: { code: toSfc(ICONS_SCRIPT, ICONS_TEMPLATE) }
    }
  }
}

const FILLED_MARKUP = '<InputText v-model="value" placeholder="Type something" />'
const FILLED_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  "const value = ref('Example value')"
]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Filled = {
  args: { modelValue: 'Example value' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Pre-populated value to show the filled visual state (driven by `:not(:placeholder-shown)`).'
      },
      source: { code: toSfc(FILLED_SCRIPT, FILLED_MARKUP) }
    }
  }
}

const INVALID_MARKUP = '<InputText v-model="value" placeholder="Type something" invalid />'
const INVALID_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  "const value = ref('invalid value')"
]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Invalid = {
  args: { invalid: true, modelValue: 'invalid value' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Invalid state — applies danger border/ring tokens and `aria-invalid`.'
      },
      source: { code: toSfc(INVALID_SCRIPT, INVALID_MARKUP) }
    }
  }
}

const EMAIL_TEMPLATE = `<div class="flex items-start gap-2 w-[320px]">
  <InputText
    type="email"
    placeholder="you@example.com"
    :model-value="value"
    :invalid="invalid"
    @update:model-value="onUpdate"
  />
  <Button label="Submit" size="medium" @click="validate" />
</div>`
const EMAIL_SCRIPT = [
  IMPORT,
  "import Button from '@aziontech/webkit/button'",
  "import { ref } from 'vue'",
  '',
  "const value = ref('')",
  'const invalid = ref(false)',
  '',
  'const onUpdate = (next) => {',
  '  value.value = next',
  '  if (invalid.value) invalid.value = false',
  '}',
  '',
  'const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/',
  'const validate = () => {',
  '  invalid.value = !EMAIL_RE.test(value.value.trim())',
  '}'
]

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
      return { value, invalid, onUpdate, validate }
    },
    template: EMAIL_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Native `type="email"`. Click **Submit** to validate the value — it flips to the `invalid` state when the value is not a valid email, and clears on the next keystroke.'
      },
      source: { code: toSfc(EMAIL_SCRIPT, EMAIL_TEMPLATE) }
    }
  }
}

const MAXLENGTH_MARKUP =
  '<InputText v-model="value" placeholder="Up to 10 characters" :max-length="10" />'
const MAXLENGTH_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', "const value = ref('')"]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const MaxLength = {
  args: { maxLength: 10, placeholder: 'Up to 10 characters', modelValue: '' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Hard character cap of 10 enforced by the native `maxlength` attribute.'
      },
      source: { code: toSfc(MAXLENGTH_SCRIPT, MAXLENGTH_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = '<InputText v-model="value" placeholder="Type something" disabled />'
const DISABLED_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  "const value = ref('Disabled value')"
]

/** @type {import('@storybook/vue3').StoryObj<typeof InputText>} */
export const Disabled = {
  args: { disabled: true, modelValue: 'Disabled value' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled state.' },
      source: { code: toSfc(DISABLED_SCRIPT, DISABLED_MARKUP) }
    }
  }
}
