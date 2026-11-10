import FieldTime from '@aziontech/webkit/field-time'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldTime from '@aziontech/webkit/field-time'"
const VUE_IMPORT = "import { ref } from 'vue'"

/** @type {import('@storybook/vue3').Meta<typeof FieldTime>} */
const meta = {
  title: 'Components/Primitives/Inputs/FieldTime',
  component: FieldTime,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Form field for entering a time of day in 24-hour notation (`HH:mm` or `HH:mm:ss`). It stacks `Label`, `InputText`, and `HelperText` the same way `FieldText` does, and adds a masked text input: the user types digits, the field inserts the `:` separators, and it checks hours (00–23), minutes and seconds (00–59). It is a masked text input, not a native `type="time"`, so the control looks and behaves the same in every browser. Use it for schedules, maintenance windows, cron-style start times, and any clock time with no date.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description:
        'Two-way bound masked text, exactly as the field shows it: empty, partial while typing, or complete as `HH:mm` / `HH:mm:ss`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    format: {
      control: 'select',
      options: ['hh:mm', 'hh:mm:ss'],
      description:
        'Time format, always 24-hour. Drives the mask, the input `maxlength`, the placeholder fallback, and the format hint.',
      table: {
        category: 'props',
        type: { summary: "'hh:mm' | 'hh:mm:ss'" },
        defaultValue: { summary: "'hh:mm'" }
      }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder forwarded to the `InputText`. When empty, it falls back to the format in upper case (`HH:MM` or `HH:MM:SS`).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    helperText: {
      control: 'text',
      description:
        'Text rendered inside `HelperText`. When empty, the helper row shows the format hint ("24-hour, HH:MM"); a non-empty value replaces it.',
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
        'Marks the input read-only: the value is visible, focusable, and copyable, but not editable.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the `Required` tag to the `Label` and sets native `required` and `aria-required` on the input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Forces the invalid state. The field also turns invalid on its own when the time is out of range or left incomplete on blur.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description:
        'id for the native input; consumed by `Label` via `for` and by the `aria-describedby` wiring. Generated with `useId()` when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    name: {
      control: 'text',
      description: 'HTML name for the underlying input (form and vee-validate integration).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted with the masked text on every input event that changes it.',
      table: { category: 'events', type: { summary: '(value: string) => void' } }
    }
  },
  args: {
    modelValue: '',
    format: 'hh:mm',
    label: 'Start time',
    placeholder: '',
    helperText: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldTime },
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
  template: '<FieldTime v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_MARKUP = '<FieldTime v-model="startTime" label="Start time" />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTime>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Empty `hh:mm` field: the placeholder falls back to `HH:MM` and the helper row shows the built-in format hint.'
      },
      source: {
        code: toSfc([VUE_IMPORT, IMPORT, '', "const startTime = ref('')"], DEFAULT_MARKUP)
      }
    }
  }
}

const WITH_SECONDS_MARKUP =
  '<FieldTime v-model="triggerTime" format="hh:mm:ss" label="Start time" />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTime>} */
export const WithSeconds = {
  name: 'With seconds',
  args: { format: 'hh:mm:ss', modelValue: '14:05:30' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          '`format="hh:mm:ss"` adds a seconds segment: the mask takes six digits, the placeholder falls back to `HH:MM:SS`, and the hint matches.'
      },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', "const triggerTime = ref('14:05:30')"],
          WITH_SECONDS_MARKUP
        )
      }
    }
  }
}

const INVALID_MARKUP = '<FieldTime v-model="startTime" label="Start time" />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTime>} */
export const Invalid = {
  args: { modelValue: '25:70' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'An out-of-range value (`25:70`) triggers the field’s own format error: the danger border, `aria-invalid`, and the format hint in invalid tone. No `invalid` prop is needed.'
      },
      source: {
        code: toSfc([VUE_IMPORT, IMPORT, '', "const startTime = ref('25:70')"], INVALID_MARKUP)
      }
    }
  }
}

const DISABLED_MARKUP = '<FieldTime v-model="startTime" label="Start time" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof FieldTime>} */
export const Disabled = {
  args: { disabled: true, modelValue: '09:30' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state: the input is disabled and the helper switches to `kind="disabled"` with the lock icon next to the format hint.'
      },
      source: {
        code: toSfc([VUE_IMPORT, IMPORT, '', "const startTime = ref('09:30')"], DISABLED_MARKUP)
      }
    }
  }
}
