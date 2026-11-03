import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
import FieldText from '@aziontech/webkit/field-text'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'"
const FIELD_TEXT_IMPORT = "import FieldText from '@aziontech/webkit/field-text'"

/** @type {import('@storybook/vue3').Meta<typeof FieldPhoneNumber>} */
const meta = {
  title: 'Components/Primitives/Inputs/FieldPhoneNumber',
  component: FieldPhoneNumber,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Form field for international phone-number entry that composes `Label`, `InputGroup` (with a leading dial-code `Select` and a middle masked `<input>`), and `HelperText` into a single vertical stack. The number field follows the selected country: its mask, and the lengths it accepts — a country may allow several, like a Brazilian landline (10 digits) and mobile (11). Two v-models carry `modelValue` (national digits only) and `country` (ISO 3166-1 alpha-2 code); `update:phone` reports the full E.164 number and whether it is complete.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description:
        'Two-way bound national number as digits only (no dial code, no mask characters).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    country: {
      control: 'text',
      description: 'Two-way bound ISO 3166-1 alpha-2 code of the selected country.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    countries: {
      control: false,
      description:
        'Countries offered by the dial-code Select. `mask` is a list when a country allows several lengths. Falls back to the built-in list.',
      table: { category: 'props', type: { summary: 'Country[]' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description:
        "Placeholder forwarded to the internal input. Falls back to the country's mask when empty.",
      table: { category: 'props', type: { summary: 'string' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted (except when `disabled` — fallback copy is shown).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Size forwarded to the `InputGroup` and the dial-code `Select` trigger. Heights: small=28px, medium=32px, large=40px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' }
      }
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables the dial-code Select and the internal input; switches helper to `kind="disabled"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the internal input read-only; dial-code Select is also disabled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the Required tag to Label, propagates `required` to InputGroup and native input.',
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
    searchPlaceholder: {
      control: 'text',
      description:
        'Placeholder of the search box that filters the dial-code list. Typing on the closed trigger opens the list with the search already filled.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'Search country' }
      }
    },
    searchEmptyLabel: {
      control: 'text',
      description: 'Shown in the dial-code list when no country matches the search.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'No country found' }
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the typed digits change; value is digits-only.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    'onUpdate:country': {
      action: 'update:country',
      description: 'Emitted when the user picks a different country.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    'onUpdate:phone': {
      action: 'update:phone',
      description:
        'Emitted on mount and whenever the digits or country change, with the full E.164 `number` and whether it is `complete`.',
      table: {
        category: 'events',
        type: {
          summary:
            '{ country: string; dialCode: string; digits: string; number: string; complete: boolean }'
        }
      }
    }
  },
  args: {
    modelValue: '',
    country: 'BR',
    label: 'Phone',
    placeholder: '',
    helperText: "We'll use this to send the verification code.",
    size: 'medium',
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

const SIZES_MARKUP = `<div class="flex flex-col gap-4 w-[480px]">
  <div class="grid grid-cols-2 gap-4">
    <FieldText label="Company" size="small" />
    <FieldPhoneNumber label="Phone" size="small" />
  </div>
  <div class="grid grid-cols-2 gap-4">
    <FieldText label="Company" size="medium" />
    <FieldPhoneNumber label="Phone" size="medium" />
  </div>
  <div class="grid grid-cols-2 gap-4">
    <FieldText label="Company" size="large" />
    <FieldPhoneNumber label="Phone" size="large" />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Sizes = {
  render: () => ({
    components: { FieldPhoneNumber, FieldText },
    template: SIZES_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All three sizes, each beside a `FieldText` of the same size: the group and the dial-code trigger take the same height as the sibling field.'
      },
      source: { code: toSfc([IMPORT, FIELD_TEXT_IMPORT], SIZES_MARKUP) }
    }
  }
}

const COUNTRIES_MARKUP = `<div class="flex flex-col gap-4 w-[360px]">
  <FieldPhoneNumber label="BR mobile" model-value="11999999999" country="BR" />
  <FieldPhoneNumber label="BR landline" model-value="1133334444" country="BR" />
  <FieldPhoneNumber label="US phone" model-value="5555550123" country="US" />
  <FieldPhoneNumber label="UK phone" model-value="7911123456" country="GB" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Countries = {
  render: () => ({
    components: { FieldPhoneNumber },
    template: `
      <div class="flex flex-col gap-4 w-[360px]">
        <FieldPhoneNumber label="BR mobile" model-value="11999999999" country="BR" />
        <FieldPhoneNumber label="BR landline" model-value="1133334444" country="BR" />
        <FieldPhoneNumber label="US phone" model-value="5555550123" country="US" />
        <FieldPhoneNumber label="UK phone" model-value="7911123456" country="GB" />
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Brazil allows two lengths, so its mask follows the digits: 11 read as a mobile `(##) #####-####`, 10 as a landline `(##) ####-####`. US and UK each allow one: `(###) ###-####`, `#### ######`.'
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
  helper-text="Managed by your organization."
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldPhoneNumber>} */
export const Disabled = {
  args: {
    disabled: true,
    modelValue: '11999999999',
    helperText: 'Managed by your organization.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled — `InputGroup` goes muted and the dial-code Select and internal input are both disabled. The helper copy is the **caller's**: a supplied `helper-text` renders with the lock icon, and with none the row is absent."
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
