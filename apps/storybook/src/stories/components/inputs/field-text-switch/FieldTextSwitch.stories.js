import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldTextSwitch from '@aziontech/webkit/field-text-switch'"

/** @type {import('@storybook/vue3').Meta<typeof FieldTextSwitch>} */
const meta = {
  title: 'Components/Inputs/FieldTextSwitch',
  component: FieldTextSwitch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Form field wrapper that composes `Label`, an `InputGroup` (holding an internal `<input>` on the left and a `<Switch>` as the trailing addon on the right), and `HelperText`. The switch owns the field's on/off state: when `enabled` is `false`, the internal text input is automatically inert regardless of `disabled`. `v-model` binds the text value; `v-model:enabled` binds the switch state."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Two-way bound value of the internal `<input>`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    enabled: {
      control: 'boolean',
      description:
        'Two-way bound state of the trailing `Switch`. When `false`, the internal `<input>` becomes inert but the switch stays operable.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the internal `<input>`.',
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
      description:
        'Disables the whole field (input + switch); switches helper to `kind="disabled"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the internal input read-only; value is visible but not editable.',
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
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Re-emitted from the internal `<input>` on every input event.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    'onUpdate:enabled': {
      action: 'update:enabled',
      description: 'Re-emitted from the trailing `Switch` on toggle.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    modelValue: 'mysite.com',
    enabled: true,
    label: 'Custom domain',
    placeholder: 'mysite.com',
    helperText: 'Only used while the feature is enabled.',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

// Controls-driven template with local refs seeded from args, so clicking the
// switch and typing actually update the visible state (Storybook does not
// write args back automatically for update:* events).
const Template = (args) => ({
  components: { FieldTextSwitch },
  setup() {
    const value = ref(args.modelValue)
    const enabled = ref(args.enabled)
    return { args, value, enabled }
  },
  template: `
    <div class="w-[360px]">
      <FieldTextSwitch
        v-bind="args"
        v-model="value"
        v-model:enabled="enabled"
      />
    </div>
  `
})

const DEFAULT_MARKUP = `<FieldTextSwitch
  v-model="value"
  v-model:enabled="enabled"
  label="Custom domain"
  placeholder="mysite.com"
  helper-text="Only used while the feature is enabled."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextSwitch>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Label + internal input + trailing switch + helper text. Toggle the switch to lock/unlock the text input.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SWITCH_OFF_MARKUP = `<FieldTextSwitch
  v-model="value"
  v-model:enabled="enabled"
  label="Custom domain"
  placeholder="mysite.com"
  helper-text="Toggle the switch to enable this field."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextSwitch>} */
export const SwitchOff = {
  render: () => ({
    components: { FieldTextSwitch },
    setup() {
      const value = ref('mysite.com')
      const enabled = ref(false)
      return { value, enabled }
    },
    template: `
      <div class="w-[360px]">
        <FieldTextSwitch
          v-model="value"
          v-model:enabled="enabled"
          label="Custom domain"
          placeholder="mysite.com"
          helper-text="Toggle the switch to enable this field."
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`enabled=false`: the text input is rendered as `disabled` (native + tokens) while the switch stays focusable. Toggle the switch to re-enable typing.'
      },
      source: { code: toSfc(IMPORT, SWITCH_OFF_MARKUP) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextSwitch>} */
export const Required = {
  args: {
    required: true,
    modelValue: '',
    helperText: 'This field is required.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          '`required=true`: Label shows the Required tag, InputGroup border turns warning, and the internal `<input>` receives native `required` + `aria-required`.'
      }
    }
  }
}

const INVALID_MARKUP = `<FieldTextSwitch
  v-model="value"
  v-model:enabled="enabled"
  label="Custom domain"
  model-value="not a domain"
  helper-text="Enter a valid domain (letters, digits, hyphens)."
  invalid
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextSwitch>} */
export const Invalid = {
  args: {
    invalid: true,
    modelValue: 'not a domain',
    enabled: true,
    helperText: 'Enter a valid domain (letters, digits, hyphens).'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state — helper switches to `kind="invalid"` (danger tokens) and the InputGroup border turns danger.'
      },
      source: { code: toSfc(IMPORT, INVALID_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<FieldTextSwitch
  v-model="value"
  v-model:enabled="enabled"
  label="Custom domain"
  model-value="mysite.com"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTextSwitch>} */
export const Disabled = {
  args: {
    disabled: true,
    modelValue: 'mysite.com',
    enabled: true,
    helperText: ''
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          '`disabled=true` locks the whole field: input, switch, and helper. Helper falls back to `"This field is locked."` with the lock icon (`kind="disabled"`).'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}
