import FieldText from '@aziontech/webkit/field-text'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldText from '@aziontech/webkit/field-text'"
const VUE_IMPORT = "import { ref } from 'vue'"

/** @type {import('@storybook/vue3').Meta<typeof FieldText>} */
const meta = {
  title: 'Components/Primitives/Inputs/FieldText',
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
        component:
          'Form field for free-text input that composes `Label`, `InputText`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a text input needs a visible label or helper/error message — i.e. virtually every form field outside of inline editing. Acts as the canonical wrapper for `InputText` in form contexts.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Two-way bound value of the underlying `InputText`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the `InputText`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'number'],
      description:
        'Native input type, forwarded to the `<input>` through `InputText`. Use `email` for e-mail fields so mobile keyboards and autofill recognise them.',
      table: {
        category: 'props',
        type: { summary: "'text' | 'email' | 'number'" },
        defaultValue: { summary: "'text'" }
      }
    },
    autocomplete: {
      control: 'text',
      description:
        'Native `autocomplete` token, applied on the `<input>` (e.g. `username` on a sign-in e-mail, `email` on a sign-up or newsletter e-mail). Omitted when unset.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: 'undefined' } }
    },
    spellcheck: {
      control: 'boolean',
      description:
        'Native `spellcheck` on the `<input>`. Set `false` for slugs, IDs and domains. Omitted when unset, so the browser keeps its default.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'undefined' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted (except when `disabled`, where a default locked message is shown).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
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
      description: 'Disables the input and switches the helper to `kind="disabled"` (lock icon).',
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
        'id for the native input; consumed by `Label` via `for` and by `aria-describedby` wiring. Auto-generated when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    name: {
      control: 'text',
      description: 'HTML name for the underlying input (form + vee-validate integration).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    iconLeft: {
      control: false,
      description: 'Forwarded to the underlying `InputText#iconLeft` slot.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    iconRight: {
      control: false,
      description: 'Forwarded to the underlying `InputText#iconRight` slot.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Re-emitted from the underlying `InputText` on every input event.',
      table: { category: 'events', type: { summary: '(value: string) => void' } }
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
  template: '<FieldText v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_MARKUP = `<FieldText v-model="email" label="Email" placeholder="you@example.com" helper-text="We'll never share your email." />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default field with label, input, and helper text.' },
      source: { code: toSfc([VUE_IMPORT, IMPORT, '', "const email = ref('')"], DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-6 w-[320px]">
  <FieldText
    v-model="small"
    size="small"
    label="Email (small)"
    placeholder="you@example.com"
    helper-text="Small size — 28px input height."
  />
  <FieldText
    v-model="medium"
    size="medium"
    label="Email (medium)"
    placeholder="you@example.com"
    helper-text="Medium size — 32px input height."
  />
  <FieldText
    v-model="large"
    size="large"
    label="Email (large)"
    placeholder="you@example.com"
    helper-text="Large size — 40px input height."
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Sizes = {
  render: () => ({
    components: { FieldText },
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
      description: {
        story:
          'All three size variants side by side (small 28px, medium 32px, large 40px input height).'
      },
      source: {
        code: toSfc(
          [
            VUE_IMPORT,
            IMPORT,
            '',
            "const small = ref('')",
            "const medium = ref('')",
            "const large = ref('')"
          ],
          SIZES_TEMPLATE
        )
      }
    }
  }
}

const REQUIRED_MARKUP = `<FieldText v-model="email" label="Email" placeholder="you@example.com" helper-text="This field is required." required />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Required = {
  args: { required: true, label: 'Email', helperText: 'This field is required.' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Required state — the `Label` shows the Required tag, the input receives native `required` + `aria-required`, and the helper adopts the warning tone.'
      },
      source: { code: toSfc([VUE_IMPORT, IMPORT, '', "const email = ref('')"], REQUIRED_MARKUP) }
    }
  }
}

const INVALID_MARKUP = `<FieldText v-model="email" label="Email" placeholder="you@example.com" helper-text="Enter a valid email address." invalid />`

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
      },
      source: {
        code: toSfc([VUE_IMPORT, IMPORT, '', "const email = ref('not-an-email')"], INVALID_MARKUP)
      }
    }
  }
}

const DISABLED_MARKUP = `<FieldText v-model="email" label="Email" placeholder="you@example.com" helper-text="This field is locked." disabled />`

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
          'Disabled state — the input is disabled, the helper switches to `kind="disabled"` (lock icon), and the label dims via the inherited muted text token.'
      },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', "const email = ref('locked@example.com')"],
          DISABLED_MARKUP
        )
      }
    }
  }
}

const ICONS_TEMPLATE = `<div class="flex flex-col gap-6 w-[320px]">
  <FieldText v-model="leading" label="With leading icon" placeholder="example.com">
    <template #iconLeft>
      <i class="pi pi-globe" />
    </template>
  </FieldText>
  <FieldText v-model="trailing" label="With trailing icon" placeholder="example.com">
    <template #iconRight>
      <i class="pi pi-times" />
    </template>
  </FieldText>
  <FieldText v-model="both" label="With both icons" placeholder="example.com">
    <template #iconLeft>
      <i class="pi pi-globe" />
    </template>
    <template #iconRight>
      <i class="pi pi-times" />
    </template>
  </FieldText>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Icons = {
  render: () => ({
    components: { FieldText },
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
        story:
          '`#iconLeft` and `#iconRight` slots are forwarded to the underlying `InputText`, shown with a leading icon, a trailing icon, and both.'
      },
      source: {
        code: toSfc(
          [
            VUE_IMPORT,
            IMPORT,
            '',
            "const leading = ref('')",
            "const trailing = ref('')",
            "const both = ref('')"
          ],
          ICONS_TEMPLATE
        )
      }
    }
  }
}

const LOGIN_MARKUP = `<FieldText
  v-model="email"
  label="Email"
  type="email"
  autocomplete="username"
  :spellcheck="false"
  name="email"
  placeholder="you@example.com"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldText>} */
export const Login = {
  render: () => ({
    components: { FieldText },
    setup() {
      const email = ref('')
      return { email }
    },
    template: LOGIN_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The e-mail field of a sign-in form. `type="email"`, `autocomplete="username"` and `spellcheck="false"` land on the `<input>`, so the browser and password managers recognise the login field.'
      },
      source: { code: toSfc([VUE_IMPORT, IMPORT, '', "const email = ref('')"], LOGIN_MARKUP) }
    }
  }
}
