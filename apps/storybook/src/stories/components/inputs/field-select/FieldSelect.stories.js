import FieldSelect from '@aziontech/webkit/field-select'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldSelect from '@aziontech/webkit/field-select'"
const VUE_IMPORT = "import { ref } from 'vue'"

const REGION_OPTIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' }
]

const OPTIONS_LITERAL = `[
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' }
]`

/** @type {import('@storybook/vue3').Meta<typeof FieldSelect>} */
const meta = {
  title: 'Components/Inputs/FieldSelect',
  component: FieldSelect,
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
          'Form field wrapper for `Select` that composes `Label`, `Select`, and `HelperText` into a single vertical stack with consistent spacing. Options are supplied via a data prop (`options: { value, label }[]`).'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Two-way bound selection. Scalar in single mode; an array in multi mode.',
      table: {
        category: 'props',
        type: { summary: 'string | number | unknown[]' },
        defaultValue: { summary: 'undefined' }
      }
    },
    options: {
      control: 'object',
      description: 'Options rendered inside the dropdown.',
      table: {
        category: 'props',
        type: { summary: 'Array<{ value: unknown; label: string; disabled?: boolean }>' },
        defaultValue: { summary: '[]' }
      }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown on the trigger when nothing is selected.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted (except when `disabled`).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Size forwarded to the `Select` trigger. Heights: small=28px, medium=32px, large=40px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    multiple: {
      control: 'boolean',
      description: 'Switches the component to multi-select; `modelValue` becomes an array.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select and switches the helper to `kind="disabled"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the select read-only.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description: 'Adds the `Required` tag and sets `aria-required` on the trigger.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description: 'Switches the helper to `kind="invalid"` and applies invalid tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description: 'id for the trigger. Auto-generated when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Re-emitted from the underlying `Select` on every selection change.',
      table: { category: 'events', type: { summary: '(value: string | number | unknown[]) => void' } }
    }
  },
  args: {
    modelValue: '',
    options: REGION_OPTIONS,
    label: 'Region',
    placeholder: 'Choose a region',
    helperText: 'Choose the closest region for lowest latency.',
    size: 'medium',
    multiple: false,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldSelect },
  setup() {
    const value = ref(args.modelValue ?? (args.multiple ? [] : ''))
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? (args.multiple ? [] : '')
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: '<FieldSelect v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_MARKUP = `<FieldSelect v-model="region" label="Region" placeholder="Choose a region" helper-text="Choose the closest region for lowest latency." :options="options" />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSelect>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default field with label, select, and helper text.' },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', "const region = ref('')", `const options = ${OPTIONS_LITERAL}`],
          DEFAULT_MARKUP
        )
      }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-6 w-[320px]">
  <FieldSelect v-model="small" size="small" label="Region (small)" placeholder="Choose a region" :options="options" helper-text="Small size — 28px trigger height." />
  <FieldSelect v-model="medium" size="medium" label="Region (medium)" placeholder="Choose a region" :options="options" helper-text="Medium size — 32px trigger height." />
  <FieldSelect v-model="large" size="large" label="Region (large)" placeholder="Choose a region" :options="options" helper-text="Large size — 40px trigger height." />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSelect>} */
export const Sizes = {
  render: () => ({
    components: { FieldSelect },
    setup() {
      const small = ref('')
      const medium = ref('')
      const large = ref('')
      return { small, medium, large, options: REGION_OPTIONS }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'All three size variants side by side.'
      },
      source: {
        code: toSfc(
          [
            VUE_IMPORT,
            IMPORT,
            '',
            "const small = ref('')",
            "const medium = ref('')",
            "const large = ref('')",
            `const options = ${OPTIONS_LITERAL}`
          ],
          SIZES_TEMPLATE
        )
      }
    }
  }
}

const REQUIRED_MARKUP = `<FieldSelect v-model="region" label="Region" placeholder="Choose a region" helper-text="This field is required." :options="options" required />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSelect>} */
export const Required = {
  args: { required: true, label: 'Region', helperText: 'This field is required.' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Required state — the `Label` shows the Required tag and the trigger receives `aria-required`.' },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', "const region = ref('')", `const options = ${OPTIONS_LITERAL}`],
          REQUIRED_MARKUP
        )
      }
    }
  }
}

const INVALID_MARKUP = `<FieldSelect v-model="region" label="Region" placeholder="Choose a region" helper-text="Pick a valid region." :options="options" invalid />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSelect>} */
export const Invalid = {
  args: { invalid: true, label: 'Region', helperText: 'Pick a valid region.' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Invalid state — the helper adopts danger tokens and the trigger gets `aria-invalid`.' },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', "const region = ref('')", `const options = ${OPTIONS_LITERAL}`],
          INVALID_MARKUP
        )
      }
    }
  }
}

const DISABLED_MARKUP = `<FieldSelect v-model="region" label="Region" placeholder="Choose a region" helper-text="This field is locked." :options="options" disabled />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSelect>} */
export const Disabled = {
  args: {
    disabled: true,
    label: 'Region',
    modelValue: 'us-east-1',
    helperText: 'This field is locked.'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled state — trigger disabled, helper switches to `kind="disabled"`.' },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', "const region = ref('us-east-1')", `const options = ${OPTIONS_LITERAL}`],
          DISABLED_MARKUP
        )
      }
    }
  }
}

const MULTIPLE_MARKUP = `<FieldSelect v-model="regions" label="Regions" placeholder="Choose regions" helper-text="Select every region." :options="options" multiple />`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldSelect>} */
export const Multiple = {
  args: {
    multiple: true,
    label: 'Regions',
    placeholder: 'Choose regions',
    helperText: 'Select every region.',
    modelValue: []
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Multi-select — `modelValue` becomes an array and the trigger displays joined labels.' },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', 'const regions = ref([])', `const options = ${OPTIONS_LITERAL}`],
          MULTIPLE_MARKUP
        )
      }
    }
  }
}
