import { ref, watch } from 'vue'

import Checkbox from '@aziontech/webkit/checkbox'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Checkbox from '@aziontech/webkit/checkbox'"

/** @type {import('@storybook/vue3').Meta<typeof Checkbox>} */
const meta = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
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
          'Control only — the square checkbox input with no label or description. Pair with an external label or use FieldCheckbox / FieldCheckboxBlock for built-in text.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Two-way bound value. Boolean in `binary` mode, scalar or array otherwise.',
      table: {
        category: 'props',
        type: { summary: 'unknown' },
        defaultValue: { summary: 'undefined' }
      }
    },
    value: {
      control: false,
      description:
        'Identifier for this checkbox in non-binary mode. Compared against `modelValue`.',
      table: {
        category: 'props',
        type: { summary: 'unknown' },
        defaultValue: { summary: 'undefined' }
      }
    },
    binary: {
      control: 'boolean',
      description:
        'When true, the checkbox toggles `modelValue` as a boolean (no `value` pairing).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Renders the indeterminate visual (horizontal bar). Does not affect `modelValue`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the field read-only; value is visible but cannot change via interaction.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description: 'Forwarded to the inner input id for label association.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    name: {
      control: 'text',
      description: 'HTML name for form submission.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    tabindex: {
      control: 'number',
      description: 'Forwarded to the inner input tabindex.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the value changes.',
      table: { category: 'events', type: { summary: 'unknown' } }
    }
  },
  args: {
    modelValue: false,
    binary: true,
    indeterminate: false,
    disabled: false,
    readonly: false,
    inputId: 'webkit-checkbox',
    name: '',
    tabindex: 0
  }
}

export default meta

const Template = (args) => ({
  components: { Checkbox },
  setup() {
    const value = ref(args.modelValue ?? false)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? false
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template:
    '<Checkbox v-bind="args" :model-value="value" @update:model-value="onUpdate" aria-label="Toggle option" />'
})

const DEFAULT_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', 'const checked = ref(false)']
const DEFAULT_MARKUP =
  '<Checkbox v-model="checked" binary input-id="webkit-checkbox" aria-label="Toggle option" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Checkbox>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Binary control only — associate copy via an external label or FieldCheckbox.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const INDETERMINATE_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', 'const checked = ref(false)']
const INDETERMINATE_MARKUP =
  '<Checkbox v-model="checked" binary indeterminate input-id="webkit-checkbox-indeterminate" aria-label="Toggle option" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Checkbox>} */
export const Indeterminate = {
  args: { indeterminate: true, inputId: 'webkit-checkbox-indeterminate' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Tri-state visual. The parent owns the indeterminate logic (typical pattern: a "select all" header when some rows are selected). Sets `aria-checked="mixed"` and the native input.indeterminate DOM property.'
      },
      source: { code: toSfc(INDETERMINATE_SCRIPT, INDETERMINATE_MARKUP) }
    }
  }
}

const DISABLED_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const checked = ref(true)',
  'const unchecked = ref(false)'
]
const DISABLED_TEMPLATE = `<div class="flex items-center gap-[var(--spacing-4)]">
  <Checkbox v-model="checked" binary disabled input-id="webkit-checkbox-disabled-on" aria-label="Disabled checked" />
  <Checkbox v-model="unchecked" binary disabled input-id="webkit-checkbox-disabled-off" aria-label="Disabled unchecked" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Checkbox>} */
export const Disabled = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const checked = ref(true)
      const unchecked = ref(false)
      return { checked, unchecked }
    },
    template: DISABLED_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Disabled checked and unchecked controls without label chrome.'
      },
      source: { code: toSfc(DISABLED_SCRIPT, DISABLED_TEMPLATE) }
    }
  }
}
