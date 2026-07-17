import Button from '@aziontech/webkit/button'
import InputText from '@aziontech/webkit/input-text'
import Tag from '@aziontech/webkit/tag'
import MultiSelect from '@aziontech/webkit/multi-select'
import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
import MultiSelectContent from '@aziontech/webkit/multi-select-content'
import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
import MultiSelectOption from '@aziontech/webkit/multi-select-option'
import { computed, ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const components = {
  Button,
  InputText,
  Tag,
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectOption
}

// Import lines shared by the "Show code" snippets. Each story appends the
// vue import plus its own reactive setup lines, then the template body.
const BASE_IMPORTS = [
  "import MultiSelect from '@aziontech/webkit/multi-select'",
  "import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'",
  "import MultiSelectContent from '@aziontech/webkit/multi-select-content'",
  "import MultiSelectOption from '@aziontech/webkit/multi-select-option'"
]

const GROUP_IMPORTS = [
  "import MultiSelect from '@aziontech/webkit/multi-select'",
  "import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'",
  "import MultiSelectContent from '@aziontech/webkit/multi-select-content'",
  "import MultiSelectGroup from '@aziontech/webkit/multi-select-group'",
  "import MultiSelectOption from '@aziontech/webkit/multi-select-option'"
]

const BASIC_OPTIONS = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
  { value: 'opt-4', label: 'Option 4' }
]

const BASIC_OPTIONS_LINES = [
  'const options = [',
  "  { value: 'opt-1', label: 'Option 1' },",
  "  { value: 'opt-2', label: 'Option 2' },",
  "  { value: 'opt-3', label: 'Option 3' },",
  "  { value: 'opt-4', label: 'Option 4' }",
  ']'
]

/** @type {import('@storybook/vue3').Meta<typeof MultiSelect>} */
const meta = {
  title: 'Components/Inputs/MultiSelect',
  component: MultiSelect,
  subcomponents: {
    MultiSelectTrigger,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectOption
  },
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
          'Multi-select control for choosing several options from a list. The trigger mirrors InputText size and state visuals, while the dropdown is composed from MultiSelectTrigger, MultiSelectContent, MultiSelectGroup, and MultiSelectOption. Selection is always an array and every option row carries a checkbox indicator.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'object',
      description:
        'Two-way bound selection. Always an array; each item is the value of a selected option.',
      table: { category: 'props', type: { summary: 'unknown[]' }, defaultValue: { summary: '[]' } }
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state for the dropdown. Use with v-model:open.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    placeholder: {
      control: 'text',
      description: 'Trigger placeholder shown when no option is selected.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; affects trigger height.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger and prevents opening.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description:
        'Marks the field read-only; the selection is visible but the dropdown cannot open.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required; sets aria-required on the trigger.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies the invalid border + ring tokens and sets aria-invalid on the trigger.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    displayValue: {
      control: false,
      description: 'Custom formatter for the trigger label; receives the current modelValue array.',
      table: { category: 'props', type: { summary: '(value: unknown[]) => string' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected values change.',
      table: { category: 'events', type: { summary: 'unknown[]' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the dropdown opens or closes.',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    default: {
      control: false,
      description:
        'Composition slot; place the MultiSelectTrigger and MultiSelectContent (with its option tree) here.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    size: 'medium',
    placeholder: 'Select options',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    defaultOpen: false
  }
}

export default meta

// Stateful, arg-driven template: Controls drive the canvas, a local ref keeps the
// selection reactive, and every change is forwarded to the Actions panel.
const Template = (args) => ({
  components,
  setup() {
    const value = ref(Array.isArray(args.modelValue) ? [...args.modelValue] : [])
    watch(
      () => args.modelValue,
      (next) => {
        value.value = Array.isArray(next) ? [...next] : []
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
    <div style="width: 280px;">
      <MultiSelect v-bind="args" :model-value="value" @update:model-value="onUpdate">
        <MultiSelectTrigger />
        <MultiSelectContent>
          <MultiSelectOption
            v-for="o in options"
            :key="o.value"
            :value="o.value"
          >{{ o.label }}</MultiSelectOption>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  `
})

const DEFAULT_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Default = {
  args: { modelValue: ['opt-1'] },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Multi-select over a flat option list; one option is pre-selected through v-model.'
      },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import { ref } from 'vue'",
            '',
            "const value = ref(['opt-1'])",
            ...BASIC_OPTIONS_LINES
          ],
          DEFAULT_MARKUP
        )
      }
    }
  }
}

const SIZES_MARKUP = `<div class="flex flex-col gap-4" style="width: 280px;">
  <MultiSelect
    v-for="s in sizes"
    :key="s"
    v-model="value"
    :size="s"
    :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
  >
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Sizes = {
  render: () => ({
    components,
    setup() {
      const value = ref([])
      const options = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' }
      ]
      const sizes = ['small', 'medium', 'large']
      return { value, options, sizes }
    },
    template: SIZES_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'The three trigger sizes (small, medium, large) matching InputText.' },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import { ref } from 'vue'",
            '',
            'const value = ref([])',
            'const options = [',
            "  { value: 'a', label: 'Option A' },",
            "  { value: 'b', label: 'Option B' }",
            ']',
            "const sizes = ['small', 'medium', 'large']"
          ],
          SIZES_MARKUP
        )
      }
    }
  }
}

const GROUPS_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectGroup
        v-for="g in groups"
        :key="g.label"
        :label="g.label"
      >
        <MultiSelectOption
          v-for="o in g.options"
          :key="o.value"
          :value="o.value"
        >{{ o.label }}</MultiSelectOption>
      </MultiSelectGroup>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const WithGroups = {
  render: () => ({
    components,
    setup() {
      const value = ref([])
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
    template: GROUPS_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Options organised into labelled sections via MultiSelectGroup.' },
      source: {
        code: toSfc(
          [
            ...GROUP_IMPORTS,
            "import { ref } from 'vue'",
            '',
            'const value = ref([])',
            'const groups = [',
            '  {',
            "    label: 'Group A',",
            '    options: [',
            "      { value: 'a-1', label: 'Option 1' },",
            "      { value: 'a-2', label: 'Option 2' }",
            '    ]',
            '  },',
            '  {',
            "    label: 'Group B',",
            '    options: [',
            "      { value: 'b-1', label: 'Option 1' },",
            "      { value: 'b-2', label: 'Option 2' }",
            '    ]',
            '  }',
            ']'
          ],
          GROUPS_MARKUP
        )
      }
    }
  }
}

const SEARCH_FOOTER_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <template #search>
        <InputText v-model="search" size="small" placeholder="Search">
          <template #iconLeft>
            <i class="pi pi-search" aria-hidden="true" />
          </template>
        </InputText>
      </template>
      <MultiSelectOption
        v-for="o in filtered"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
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
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const WithSearchAndFooter = {
  render: () => ({
    components,
    setup() {
      const value = ref([])
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
        value.value = [...value.value, next.value]
        search.value = ''
      }
      return { value, search, filtered, onCreate }
    },
    template: SEARCH_FOOTER_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The search and footer slots on MultiSelectContent: a filterable list with a footer action that appends a new option.'
      },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import Button from '@aziontech/webkit/button'",
            "import InputText from '@aziontech/webkit/input-text'",
            "import { computed, ref } from 'vue'",
            '',
            'const value = ref([])',
            "const search = ref('')",
            'const options = ref([',
            "  { value: 'opt-1', label: 'Option 1' },",
            "  { value: 'opt-2', label: 'Option 2' },",
            "  { value: 'opt-3', label: 'Option 3' },",
            "  { value: 'opt-4', label: 'Option 4' }",
            '])',
            'const filtered = computed(() => {',
            '  const q = search.value.trim().toLowerCase()',
            '  if (!q) return options.value',
            '  return options.value.filter((o) => o.label.toLowerCase().includes(q))',
            '})',
            'const onCreate = () => {',
            '  const label = search.value.trim()',
            '  if (!label) return',
            '  const next = { value: `opt-${options.value.length + 1}`, label }',
            '  options.value = [...options.value, next]',
            '  value.value = [...value.value, next.value]',
            "  search.value = ''",
            '}'
          ],
          SEARCH_FOOTER_MARKUP
        )
      }
    }
  }
}

const OPTION_EXTRAS_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
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
      </MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const WithOptionExtras = {
  render: () => ({
    components,
    setup() {
      const value = ref([])
      const options = [
        { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
        { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
        { value: 'tag', label: 'With tag', tag: 'Label' }
      ]
      return { value, options }
    },
    template: OPTION_EXTRAS_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Per-option extras on MultiSelectOption: a leading icon, a custom left slot, and a trailing tag.'
      },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import Tag from '@aziontech/webkit/tag'",
            "import { ref } from 'vue'",
            '',
            'const value = ref([])',
            'const options = [',
            "  { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },",
            "  { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },",
            "  { value: 'tag', label: 'With tag', tag: 'Label' }",
            ']'
          ],
          OPTION_EXTRAS_MARKUP
        )
      }
    }
  }
}

const LONG_LIST_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Pick several">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const LongList = {
  render: () => ({
    components,
    setup() {
      const value = ref([])
      const options = Array.from({ length: 40 }, (_, i) => ({
        value: `opt-${i + 1}`,
        label: `Option ${i + 1}`
      }))
      return { value, options }
    },
    template: LONG_LIST_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'A long option list; the panel scrolls internally once it exceeds its max height.'
      },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import { ref } from 'vue'",
            '',
            'const value = ref([])',
            'const options = Array.from({ length: 40 }, (_, i) => ({',
            '  value: `opt-${i + 1}`,',
            '  label: `Option ${i + 1}`',
            '}))'
          ],
          LONG_LIST_MARKUP
        )
      }
    }
  }
}

const FILLED_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Filled = {
  args: { modelValue: ['opt-1', 'opt-3'] },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Pre-populated selection showing the filled trigger label and the checked indicators.'
      },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import { ref } from 'vue'",
            '',
            "const value = ref(['opt-1', 'opt-3'])",
            ...BASIC_OPTIONS_LINES
          ],
          FILLED_MARKUP
        )
      }
    }
  }
}

const INVALID_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options" invalid>
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Invalid = {
  args: { invalid: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Invalid state applying the danger border and ring tokens.' },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import { ref } from 'vue'",
            '',
            'const value = ref([])',
            ...BASIC_OPTIONS_LINES
          ],
          INVALID_MARKUP
        )
      }
    }
  }
}

const DISABLED_MARKUP = `<div style="width: 280px;">
  <MultiSelect v-model="value" placeholder="Select options" disabled>
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
      >{{ o.label }}</MultiSelectOption>
    </MultiSelectContent>
  </MultiSelect>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled trigger; the dropdown cannot open.' },
      source: {
        code: toSfc(
          [
            ...BASE_IMPORTS,
            "import { ref } from 'vue'",
            '',
            'const value = ref([])',
            ...BASIC_OPTIONS_LINES
          ],
          DISABLED_MARKUP
        )
      }
    }
  }
}
