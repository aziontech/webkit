import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'"

/** @type {import('@storybook/vue3').Meta<typeof FieldPhoneNumber>} */
const meta = {
  title: 'Components/Inputs/FieldPhoneNumber',
  component: FieldPhoneNumber,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Form field for international phone-number entry that composes `Label`, `InputGroup` (with a leading dial-code `Select` and a middle masked `<input>`), and `HelperText` into a single vertical stack. Emits two v-models: `modelValue` (national digits only) and `country` (ISO 3166-1 alpha-2 code) that drives the mask and dial code shown.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Two-way bound national number as digits only (no dial code, no mask characters).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    country: {
      control: 'text',
      description: 'Two-way bound ISO 3166-1 alpha-2 code of the selected country.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    countries: {
      control: false,
      description: 'Countries offered by the dial-code Select. Falls back to the built-in list.',
      table: { category: 'props', type: { summary: 'Country[]' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: "Placeholder forwarded to the internal input. Falls back to the country's mask when empty.",
      table: { category: 'props', type: { summary: 'string' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted (except when `disabled` — fallback copy is shown).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dial-code Select and the internal input; switches helper to `kind="disabled"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the internal input read-only; dial-code Select is also disabled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description: 'Adds the Required tag to Label, propagates `required` to InputGroup and native input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Sets `invalid` on InputGroup and switches helper to `kind="invalid"`. Also sets `aria-invalid` on the internal input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description: 'id for the internal input; auto-generated via `useId()` when empty.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    name: {
      control: 'text',
      description: 'HTML name for the internal input (form + vee-validate integration).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted on every input event; value is digits-only.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    'onUpdate:country': {
      action: 'update:country',
      description: 'Emitted when the user picks a different country.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    country: 'BR',
    label: 'Phone',
    placeholder: '',
    helperText: "We'll use this to send the verification code.",
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldPhoneNumber },
  setup() {
    const value = ref(args.modelValue)
    const country = ref(args.country)
    return { args, value, country }
  },
  template: `
    <div class="w-[360px]">
      <FieldPhoneNumber
        v-bind="args"
        v-model="value"
        v-model:country="country"
      />
    </div>
  `
})

const DEFAULT_MARKUP = `<FieldPhoneNumber
  v-model="phone"
  v-model:country="country"
  label="Phone"
  helper-text="We'll use this to send the verification code."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Label + `InputGroup` with dial-code Select and masked input + helper text. Country defaults to `BR` (`+55`), mask is `(##) #####-####`.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const COUNTRIES_MARKUP = `<div class="flex flex-col gap-4 w-[360px]">
  <FieldPhoneNumber label="BR phone" model-value="11999999999" :country="'BR'" />
  <FieldPhoneNumber label="US phone" model-value="5555550123" :country="'US'" />
  <FieldPhoneNumber label="UK phone" model-value="7911123456" :country="'GB'" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Countries = {
  render: () => ({
    components: { FieldPhoneNumber },
    template: `
      <div class="flex flex-col gap-4 w-[360px]">
        <FieldPhoneNumber label="BR phone" model-value="11999999999" country="BR" helper-text="" />
        <FieldPhoneNumber label="US phone" model-value="5555550123" country="US" helper-text="" />
        <FieldPhoneNumber label="UK phone" model-value="7911123456" country="GB" helper-text="" />
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Three countries side-by-side (BR / US / GB) with the same value shape. The mask switches per country: `(##) #####-####`, `(###) ###-####`, `#### ######`.'
      },
      source: { code: toSfc(IMPORT, COUNTRIES_MARKUP) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Required = {
  args: { required: true, helperText: 'This field is required.' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Required — `Label` shows the Required tag, `InputGroup` renders the warning border, and the internal input gets native `required` + `aria-required`.'
      }
    }
  }
}

const INVALID_MARKUP = `<FieldPhoneNumber
  v-model="phone"
  v-model:country="country"
  label="Phone"
  model-value="119"
  helper-text="Enter a valid phone number."
  invalid
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Invalid = {
  args: {
    invalid: true,
    modelValue: '119',
    helperText: 'Enter a valid phone number.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Invalid — helper switches to `kind="invalid"` (danger tokens) and the `InputGroup` border turns danger; the input gets `aria-invalid`.'
      },
      source: { code: toSfc(IMPORT, INVALID_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<FieldPhoneNumber
  v-model="phone"
  v-model:country="country"
  label="Phone"
  model-value="11999999999"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Disabled = {
  args: {
    disabled: true,
    modelValue: '11999999999',
    helperText: ''
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled — helper falls back to "This field is locked." with the lock icon, `InputGroup` goes muted, dial-code Select and internal input are both disabled.'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}

const READONLY_MARKUP = `<FieldPhoneNumber
  v-model="phone"
  v-model:country="country"
  label="Phone"
  model-value="11999999999"
  readonly
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Readonly = {
  args: {
    readonly: true,
    modelValue: '11999999999',
    helperText: 'Contact support to change your phone number.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Read-only — value is visible but neither the number nor the dial code can change. The dial-code Select is disabled alongside the input.'
      },
      source: { code: toSfc(IMPORT, READONLY_MARKUP) }
    }
  }
}
