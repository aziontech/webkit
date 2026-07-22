import Select from '@aziontech/webkit/select'
import { SelectContent, SelectGroup, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import Button from '@aziontech/webkit/button'
import InputText from '@aziontech/webkit/input-text'
import Tag from '@aziontech/webkit/tag'
import { computed, ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Select from '@aziontech/webkit/select'"

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string templates: Vue compiles
// `<Select.Trigger>` to `resolveComponent("Select.Trigger")`, an exact-name
// lookup (a bare `Select` registration does not satisfy it). In a real SFC the
// dotted tag resolves off the imported `Select` binding, so consumer code needs
// only `import Select` — these extra registrations are a Storybook-runtime concern.
const components = {
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Group': SelectGroup,
  'Select.Option': SelectOption,
  Button,
  InputText,
  Tag
}

/** @type {import('@storybook/vue3').Meta<typeof Select>} */
const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  subcomponents: { SelectTrigger, SelectContent, SelectGroup, SelectOption },
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
          'Select control for choosing one (`multiple={false}`) or many (`multiple={true}`) options from a list. The trigger field mirrors `InputText`\'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown is rendered via the native Popover API + CSS anchor positioning — no `@floating-ui` runtime. Each option carries a selection indicator, optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<Select.Content>`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description:
        'Two-way bound selection. Scalar (string or number) in single mode; an array in multi mode.',
      table: {
        category: 'props',
        type: { summary: 'string | number | unknown[]' },
        defaultValue: { summary: 'undefined' }
      }
    },
    multiple: {
      control: 'boolean',
      description:
        'Switches the component to multi-select: options toggle instead of replacing, and `modelValue` is an array.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    open: {
      control: 'boolean',
      description:
        'Controlled open state for the dropdown. Use with `v-model:open`; when omitted the component is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when the dropdown is uncontrolled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    placeholder: {
      control: 'text',
      description: 'Trigger placeholder shown when no option is selected.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Size token; affects trigger height (small 28px, medium 32px, large 40px) matching `InputText`.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger and prevents the dropdown from opening.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description:
        'Marks the field read-only: the current selection is visible but the dropdown cannot open.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required and sets `aria-required` on the trigger.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    displayValue: {
      control: false,
      description:
        'Custom formatter used by the trigger to render the selected label(s); receives the current `modelValue`.',
      table: {
        category: 'props',
        type: { summary: '(value: unknown) => string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    default: {
      control: false,
      description:
        'Composition slot; receives `<Select.Trigger>` and `<Select.Content>` (with the option tree inside it).',
      table: { category: 'slots', type: { summary: 'Select.Trigger + Select.Content' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Fires when an option is selected (single) or toggled (multi).',
      table: { category: 'events', type: { summary: 'string | number | unknown[]' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Fires when the dropdown opens or closes.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    multiple: false,
    size: 'medium',
    placeholder: 'Select an option',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    defaultOpen: false
  }
}

export default meta

const BASIC_OPTIONS = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
  { value: 'opt-4', label: 'Option 4' }
]

const OPTIONS_SNIPPET = `const options = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
  { value: 'opt-4', label: 'Option 4' }
]`

// Concrete, runnable snippet for the single-select arg-driven stories. The
// consumer form uses idiomatic `v-model`; the canvas (BasicTemplate) uses the
// explicit `:model-value` + `@update:model-value` so it can log to Actions.
const basicSnippet = ({ initial = "''", attrs = '' } = {}) =>
  toSfc(
    [IMPORT, "import { ref } from 'vue'", '', `const value = ref(${initial})`, OPTIONS_SNIPPET],
    `<Select v-model="value"${attrs ? ` ${attrs}` : ''} placeholder="Select an option">
  <Select.Trigger />
  <Select.Content>
    <Select.Option
      v-for="o in options"
      :key="o.value"
      :value="o.value"
    >{{ o.label }}</Select.Option>
  </Select.Content>
</Select>`
  )

// Reusable arg-driven render for single-select stories: Controls drive the
// canvas via `v-bind="args"`, a local ref keeps the field responsive, and
// onUpdate forwards to the Actions panel via `args['onUpdate:modelValue']`.
const BasicTemplate = (args) => ({
  components,
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
    const options = BASIC_OPTIONS
    return { args, value, onUpdate, options }
  },
  template: `
    <div class="w-[280px]">
      <Select v-bind="args" :model-value="value" @update:model-value="onUpdate">
        <Select.Trigger />
        <Select.Content>
          <Select.Option
            v-for="o in options"
            :key="o.value"
            :value="o.value"
          >{{ o.label }}</Select.Option>
        </Select.Content>
      </Select>
    </div>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Default = {
  args: { size: 'large' },
  render: BasicTemplate,
  parameters: {
    docs: {
      description: { story: 'Single-select with four flat options at large size.' },
      source: { code: basicSnippet({ attrs: 'size="large"' }) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-4 w-[280px]">
  <Select
    v-for="s in sizes"
    :key="s"
    v-model="value"
    :size="s"
    :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
  >
    <Select.Trigger />
    <Select.Content>
      <Select.Option
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</Select.Option>
    </Select.Content>
  </Select>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Sizes = {
  render: () => ({
    components,
    setup() {
      const value = ref('')
      const options = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' }
      ]
      const sizes = ['small', 'medium', 'large']
      return { value, options, sizes }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All three trigger sizes side by side, sharing one bound value.' },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import { ref } from 'vue'",
            '',
            "const value = ref('')",
            `const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' }
]`,
            "const sizes = ['small', 'medium', 'large']"
          ],
          SIZES_TEMPLATE
        )
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Multiple = {
  args: { multiple: true, modelValue: [] },
  render: BasicTemplate,
  parameters: {
    docs: {
      description: {
        story: 'Multi-select mode: options toggle on click and `modelValue` is an array.'
      },
      source: { code: basicSnippet({ initial: '[]', attrs: 'multiple' }) }
    }
  }
}

const GROUPS_TEMPLATE = `<div class="w-[280px]">
  <Select v-model="value" placeholder="Select an option">
    <Select.Trigger />
    <Select.Content>
      <Select.Group
        v-for="g in groups"
        :key="g.label"
        :label="g.label"
      >
        <Select.Option
          v-for="o in g.options"
          :key="o.value"
          :value="o.value"
        >{{ o.label }}</Select.Option>
      </Select.Group>
    </Select.Content>
  </Select>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const WithGroups = {
  render: () => ({
    components,
    setup() {
      const value = ref('')
      const groups = [
        {
          label: 'Group A',
          options: [
            { value: 'a-1', label: 'Option 1' },
            { value: 'a-2', label: 'Option 2' }
          ]
        },
        {
          label: 'Group B',
          options: [
            { value: 'b-1', label: 'Option 1' },
            { value: 'b-2', label: 'Option 2' }
          ]
        }
      ]
      return { value, groups }
    },
    template: GROUPS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: '`<Select.Group label="…">` renders an uppercase heading above each set of options.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import { ref } from 'vue'",
            '',
            "const value = ref('')",
            `const groups = [
  {
    label: 'Group A',
    options: [
      { value: 'a-1', label: 'Option 1' },
      { value: 'a-2', label: 'Option 2' }
    ]
  },
  {
    label: 'Group B',
    options: [
      { value: 'b-1', label: 'Option 1' },
      { value: 'b-2', label: 'Option 2' }
    ]
  }
]`
          ],
          GROUPS_TEMPLATE
        )
      }
    }
  }
}

const SEARCH_FOOTER_TEMPLATE = `<div class="w-[280px]">
  <Select v-model="value" placeholder="Select an option">
    <Select.Trigger />
    <Select.Content>
      <template #search>
        <InputText v-model="search" size="small" placeholder="Search">
          <template #iconLeft>
            <i class="pi pi-search" aria-hidden="true" />
          </template>
        </InputText>
      </template>
      <Select.Option
        v-for="o in filtered"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</Select.Option>
      <template #footer>
        <Button
          label="Create new item"
          icon="pi pi-plus-circle"
          kind="text"
          size="small"
          class="w-full"
          @click="onCreate"
        />
      </template>
    </Select.Content>
  </Select>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const WithSearchAndFooter = {
  render: () => ({
    components,
    setup() {
      const value = ref('')
      const search = ref('')
      const options = ref([...BASIC_OPTIONS])
      const filtered = computed(() => {
        const q = search.value.trim().toLowerCase()
        if (!q) return options.value
        return options.value.filter((o) => o.label.toLowerCase().includes(q))
      })
      const onCreate = () => {
        const label = search.value.trim()
        if (!label) return
        const next = { value: `opt-${options.value.length + 1}`, label }
        options.value = [...options.value, next]
        value.value = next.value
        search.value = ''
      }
      return { value, search, filtered, onCreate }
    },
    template: SEARCH_FOOTER_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The `#search` and `#footer` slots on `<Select.Content>` host a filter input and a "Create new" action; the option list scrolls between them.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import Button from '@aziontech/webkit/button'",
            "import InputText from '@aziontech/webkit/input-text'",
            "import { computed, ref } from 'vue'",
            '',
            "const value = ref('')",
            "const search = ref('')",
            `const options = ref([
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
  { value: 'opt-4', label: 'Option 4' }
])`,
            `const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return options.value
  return options.value.filter((o) => o.label.toLowerCase().includes(q))
})`,
            'const onCreate = () => {',
            '  const label = search.value.trim()',
            '  if (!label) return',
            '  const next = { value: `opt-${options.value.length + 1}`, label }',
            '  options.value = [...options.value, next]',
            '  value.value = next.value',
            "  search.value = ''",
            '}'
          ],
          SEARCH_FOOTER_TEMPLATE
        )
      }
    }
  }
}

const OPTION_EXTRAS_TEMPLATE = `<div class="w-[280px]">
  <Select v-model="value" placeholder="Select an option">
    <Select.Trigger />
    <Select.Content>
      <Select.Option
        v-for="o in options"
        :key="o.value"
        :value="o.value"
        :icon="o.icon"
      >
        <template v-if="o.leftIcon" #left>
          <i :class="o.leftIcon" aria-hidden="true" />
        </template>
        {{ o.label }}
        <template v-if="o.tag" #tag>
          <Tag :label="o.tag" severity="info" size="small" />
        </template>
      </Select.Option>
    </Select.Content>
  </Select>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const WithOptionExtras = {
  render: () => ({
    components,
    setup() {
      const value = ref('')
      const options = [
        { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
        { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
        { value: 'tag', label: 'With tag', tag: 'Label' }
      ]
      return { value, options }
    },
    template: OPTION_EXTRAS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Per-option affordances on `<Select.Option>`: the `icon` prop, the `#left` slot, and the trailing `#tag` slot.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import Tag from '@aziontech/webkit/tag'",
            "import { ref } from 'vue'",
            '',
            "const value = ref('')",
            `const options = [
  { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
  { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
  { value: 'tag', label: 'With tag', tag: 'Label' }
]`
          ],
          OPTION_EXTRAS_TEMPLATE
        )
      }
    }
  }
}

const LONG_LIST_TEMPLATE = `<div class="w-[280px]">
  <Select v-model="value" placeholder="Pick one of many">
    <Select.Trigger />
    <Select.Content>
      <Select.Option
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</Select.Option>
    </Select.Content>
  </Select>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const LongList = {
  render: () => ({
    components,
    setup() {
      const value = ref('')
      const options = Array.from({ length: 40 }, (_, i) => ({
        value: `opt-${i + 1}`,
        label: `Option ${i + 1}`
      }))
      return { value, options }
    },
    template: LONG_LIST_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'A long option list; the panel caps its height and scrolls internally.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import { ref } from 'vue'",
            '',
            "const value = ref('')",
            'const options = Array.from({ length: 40 }, (_, i) => ({',
            '  value: `opt-${i + 1}`,',
            '  label: `Option ${i + 1}`',
            '}))'
          ],
          LONG_LIST_TEMPLATE
        )
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Filled = {
  args: { modelValue: 'opt-1' },
  render: BasicTemplate,
  parameters: {
    docs: {
      description: { story: 'Pre-selected value shows the filled trigger treatment.' },
      source: { code: basicSnippet({ initial: "'opt-1'" }) }
    }
  }
}

const INVALID_TEMPLATE = `<div class="w-[280px]">
  <Select v-model="value" :invalid="invalid" placeholder="Select an option">
    <Select.Trigger />
    <Select.Content>
      <Select.Option
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</Select.Option>
    </Select.Content>
  </Select>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Invalid = {
  render: () => ({
    components,
    setup() {
      const value = ref('')
      const options = BASIC_OPTIONS
      const invalid = computed(() => !value.value)
      return { value, options, invalid }
    },
    template: INVALID_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Invalid state (danger border + ring); it clears once a value is selected.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import { computed, ref } from 'vue'",
            '',
            "const value = ref('')",
            OPTIONS_SNIPPET,
            'const invalid = computed(() => !value.value)'
          ],
          INVALID_TEMPLATE
        )
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Disabled = {
  args: { disabled: true },
  render: BasicTemplate,
  parameters: {
    docs: {
      description: { story: 'Disabled trigger; the dropdown cannot open.' },
      source: { code: basicSnippet({ attrs: 'disabled' }) }
    }
  }
}
