import Button from '@aziontech/webkit/button'
import Tag from '@aziontech/webkit/tag'
import MultiSelect from '@aziontech/webkit/multi-select'
import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
import MultiSelectContent from '@aziontech/webkit/multi-select-content'
import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
import MultiSelectOption from '@aziontech/webkit/multi-select-option'
import InputText from '@aziontech/webkit/input-text'
import { computed, ref } from 'vue'

const components = {
  Button,
  Tag,
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectOption,
  InputText
}

const CORE_IMPORTS = [
  "import MultiSelect from '@aziontech/webkit/multi-select'",
  "import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'",
  "import MultiSelectContent from '@aziontech/webkit/multi-select-content'",
  "import MultiSelectGroup from '@aziontech/webkit/multi-select-group'",
  "import MultiSelectOption from '@aziontech/webkit/multi-select-option'"
].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof MultiSelect>} */
const meta = {
  title: 'Components/Inputs/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          "Select control specialised for choosing many options from a list. The trigger field mirrors `InputText`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a MultiSelect sits next to other form fields without visual drift. The dropdown is rendered via the native Popover API + CSS anchor positioning — no `@floating-ui` runtime. Every option row carries a checkbox indicator (the `Checkbox` webkit component), optionally a leading slot/icon and a trailing tag. Search and \"Create new\" footer are exposed as slots on `<MultiSelectContent>`. Unlike `Select` (which toggles between single and multi via a `multiple` prop), MultiSelect is multi-only: `modelValue` is always an array and the indicator is always a checkbox.",
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import MultiSelect from '@aziontech/webkit/multi-select'",
          "import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'",
          "import MultiSelectContent from '@aziontech/webkit/multi-select-content'",
          "import MultiSelectGroup from '@aziontech/webkit/multi-select-group'",
          "import MultiSelectOption from '@aziontech/webkit/multi-select-option'",
          '',
          'const value = defineModel({ default: () => [] })',
          '</script>',
          '',
          '<template>',
          '  <MultiSelect v-model="value" size="medium" placeholder="Select options">',
          '    <MultiSelectTrigger />',
          '    <MultiSelectContent>',
          '      <MultiSelectGroup label="Group A">',
          '        <MultiSelectOption value="opt-1">Option 1</MultiSelectOption>',
          '        <MultiSelectOption value="opt-2">Option 2</MultiSelectOption>',
          '      </MultiSelectGroup>',
          '      <MultiSelectGroup label="Group B">',
          '        <MultiSelectOption value="opt-3" icon="pi pi-heart">Option 3</MultiSelectOption>',
          '      </MultiSelectGroup>',
          '    </MultiSelectContent>',
          '  </MultiSelect>',
          '</template>',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    modelValue: { control: 'object', table: { category: 'props' } },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    placeholder: { control: 'text', table: { category: 'props' } },
    disabled: { control: 'boolean', table: { category: 'props' } },
    readonly: { control: 'boolean', table: { category: 'props' } },
    required: { control: 'boolean', table: { category: 'props' } },
    invalid: { control: 'boolean', table: { category: 'props' } },
    defaultOpen: { control: 'boolean', table: { category: 'props' } },
    displayValue: { control: false, table: { category: 'props' } },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected values change.',
      table: { category: 'events' }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the dropdown opens or closes.',
      table: { category: 'events' }
    }
  },
  args: {
    size: 'medium',
    placeholder: 'Select options',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const BASIC_OPTIONS = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
  { value: 'opt-4', label: 'Option 4' }
]

const BASIC_OPTIONS_SNIPPET = [
  'const options = [',
  "  { value: 'opt-1', label: 'Option 1' },",
  "  { value: 'opt-2', label: 'Option 2' },",
  "  { value: 'opt-3', label: 'Option 3' },",
  "  { value: 'opt-4', label: 'Option 4' }",
  ']'
].join('\n')

const basicSource = ({
  initial = '[]',
  extraImports = null,
  bind = '',
  extraSetup = null
} = {}) => {
  const lines = ['<script setup>', CORE_IMPORTS, "import { ref } from 'vue'"]
  if (extraImports) lines.push(extraImports)
  lines.push('', `const value = ref(${initial})`, BASIC_OPTIONS_SNIPPET)
  if (extraSetup) lines.push(extraSetup)
  lines.push(
    '</script>',
    '',
    '<template>',
    `  <MultiSelect v-model="value" placeholder="Select options"${bind ? ' ' + bind : ''}>`,
    '    <MultiSelectTrigger />',
    '    <MultiSelectContent>',
    '      <MultiSelectOption',
    '        v-for="o in options"',
    '        :key="o.value"',
    '        :value="o.value"',
    '      >{{ o.label }}</MultiSelectOption>',
    '    </MultiSelectContent>',
    '  </MultiSelect>',
    '</template>'
  )
  return lines.join('\n')
}

const BasicTemplate = (args) => ({
  components,
  setup() {
    const value = ref(Array.isArray(args.modelValue) ? [...args.modelValue] : [])
    const options = ref(BASIC_OPTIONS)
    return { args, value, options }
  },
  template: `
    <div style="width: 280px;">
      <MultiSelect v-bind="args" v-model="value">
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

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Default = {
  args: {
    modelValue: ['opt-1']
  },

  render: BasicTemplate,

  parameters: {
    docs: {
      source: {
        code: basicSource({ initial: "['opt-1']" })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Sizes = {
  render: (args) => ({
    components,
    setup() {
      const value = ref([])
      const options = ref([
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' }
      ])
      const sizes = ['small', 'medium', 'large']
      return { args, value, options, sizes }
    },
    template: `
      <div class="flex flex-col gap-4" style="width: 280px;">
        <MultiSelect
          v-for="s in sizes"
          :key="s"
          v-bind="args"
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
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORTS,
          "import { ref } from 'vue'",
          '',
          'const value = ref([])',
          'const options = [',
          "  { value: 'a', label: 'Option A' },",
          "  { value: 'b', label: 'Option B' }",
          ']',
          "const sizes = ['small', 'medium', 'large']",
          '</script>',
          '',
          '<template>',
          '  <MultiSelect',
          '    v-for="s in sizes"',
          '    :key="s"',
          '    v-model="value"',
          '    :size="s"',
          '    :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"',
          '  >',
          '    <MultiSelectTrigger />',
          '    <MultiSelectContent>',
          '      <MultiSelectOption',
          '        v-for="o in options"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</MultiSelectOption>',
          '    </MultiSelectContent>',
          '  </MultiSelect>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const WithGroups = {
  render: (args) => ({
    components,
    setup() {
      const value = ref([])
      const groups = ref([
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
      ])
      return { args, value, groups }
    },
    template: `
      <div style="width: 280px;">
        <MultiSelect v-bind="args" v-model="value">
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
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORTS,
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
          ']',
          '</script>',
          '',
          '<template>',
          '  <MultiSelect v-model="value">',
          '    <MultiSelectTrigger />',
          '    <MultiSelectContent>',
          '      <MultiSelectGroup',
          '        v-for="g in groups"',
          '        :key="g.label"',
          '        :label="g.label"',
          '      >',
          '        <MultiSelectOption',
          '          v-for="o in g.options"',
          '          :key="o.value"',
          '          :value="o.value"',
          '        >{{ o.label }}</MultiSelectOption>',
          '      </MultiSelectGroup>',
          '    </MultiSelectContent>',
          '  </MultiSelect>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const WithSearchAndFooter = {
  render: (args) => ({
    components,
    setup() {
      const search = ref('')
      const options = ref(BASIC_OPTIONS)
      const filtered = computed(() => {
        const q = search.value.trim().toLowerCase()
        if (!q) return options.value
        return options.value.filter((o) => o.label.toLowerCase().includes(q))
      })
      const value = ref([])
      const onCreate = () => {
        const label = search.value.trim()
        args.onCreate?.(label)
        if (!label) return
        const next = { value: `opt-${options.value.length + 1}`, label }
        options.value = [...options.value, next]
        value.value = [...value.value, next.value]
        search.value = ''
      }
      return { args, value, search, filtered, onCreate }
    },
    template: `
      <div style="width: 280px;">
        <MultiSelect v-bind="args" v-model="value">
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
      </div>
    `
  }),

  argTypes: {
    onCreate: {
      action: 'create',
      description: 'Fired when the footer Button is clicked.',
      table: { category: 'events' }
    }
  },

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORTS,
          "import Button from '@aziontech/webkit/button'",
          "import InputText from '@aziontech/webkit/input-text'",
          "import { computed, ref } from 'vue'",
          '',
          "const emit = defineEmits(['create'])",
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
          "  emit('create', label)",
          '  if (!label) return',
          '  const next = { value: `opt-${options.value.length + 1}`, label }',
          '  options.value = [...options.value, next]',
          '  value.value = [...value.value, next.value]',
          "  search.value = ''",
          '}',
          '</script>',
          '',
          '<template>',
          '  <MultiSelect v-model="value">',
          '    <MultiSelectTrigger />',
          '    <MultiSelectContent>',
          '      <template #search>',
          '        <InputText v-model="search" size="small" placeholder="Search">',
          '          <template #iconLeft>',
          '            <i class="pi pi-search" aria-hidden="true" />',
          '          </template>',
          '        </InputText>',
          '      </template>',
          '      <MultiSelectOption',
          '        v-for="o in filtered"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</MultiSelectOption>',
          '      <template #footer>',
          '        <Button',
          '          label="Create new item"',
          '          icon="pi pi-plus-circle"',
          '          kind="text"',
          '          size="small"',
          '          class="w-full"',
          '          @click="onCreate"',
          '        />',
          '      </template>',
          '    </MultiSelectContent>',
          '  </MultiSelect>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const WithOptionExtras = {
  render: (args) => ({
    components,
    setup() {
      const value = ref([])
      const options = ref([
        { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
        { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
        { value: 'tag', label: 'With tag', tag: 'Label' }
      ])
      return { args, value, options }
    },
    template: `
      <div style="width: 280px;">
        <MultiSelect v-bind="args" v-model="value">
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
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORTS,
          "import Tag from '@aziontech/webkit/tag'",
          "import { ref } from 'vue'",
          '',
          'const value = ref([])',
          'const options = [',
          "  { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },",
          "  { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },",
          "  { value: 'tag', label: 'With tag', tag: 'Label' }",
          ']',
          '</script>',
          '',
          '<template>',
          '  <MultiSelect v-model="value">',
          '    <MultiSelectTrigger />',
          '    <MultiSelectContent>',
          '      <MultiSelectOption',
          '        v-for="o in options"',
          '        :key="o.value"',
          '        :value="o.value"',
          '        :icon="o.icon"',
          '      >',
          '        <template v-if="o.leftIcon" #left>',
          '          <i :class="o.leftIcon" aria-hidden="true" />',
          '        </template>',
          '        {{ o.label }}',
          '        <template v-if="o.tag" #tag>',
          '          <Tag :label="o.tag" severity="info" size="small" />',
          '        </template>',
          '      </MultiSelectOption>',
          '    </MultiSelectContent>',
          '  </MultiSelect>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const LongList = {
  render: (args) => ({
    components,
    setup() {
      const value = ref([])
      const options = ref(
        Array.from({ length: 40 }, (_, i) => ({
          value: `opt-${i + 1}`,
          label: `Option ${i + 1}`
        }))
      )
      return { args, value, options }
    },
    template: `
      <div style="width: 280px;">
        <MultiSelect v-bind="args" v-model="value" placeholder="Pick several">
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
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORTS,
          "import { ref } from 'vue'",
          '',
          'const value = ref([])',
          'const options = Array.from({ length: 40 }, (_, i) => ({',
          '  value: `opt-${i + 1}`,',
          '  label: `Option ${i + 1}`',
          '}))',
          '</script>',
          '',
          '<template>',
          '  <MultiSelect v-model="value" placeholder="Pick several">',
          '    <MultiSelectTrigger />',
          '    <MultiSelectContent>',
          '      <MultiSelectOption',
          '        v-for="o in options"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</MultiSelectOption>',
          '    </MultiSelectContent>',
          '  </MultiSelect>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Filled = {
  args: { modelValue: ['opt-1', 'opt-3'] },
  render: BasicTemplate,

  parameters: {
    docs: {
      source: {
        code: basicSource({ initial: "['opt-1', 'opt-3']" })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Invalid = {
  render: (args) => ({
    components,
    setup() {
      const value = ref([])
      const options = ref(BASIC_OPTIONS)
      const invalid = computed(() => value.value.length === 0)
      return { args, value, options, invalid }
    },
    template: `
      <div style="width: 280px;">
        <MultiSelect v-bind="args" v-model="value" :invalid="invalid" placeholder="Select options">
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
  }),

  parameters: {
    docs: {
      source: {
        code: basicSource({
          extraImports: "import { computed } from 'vue'",
          extraSetup: 'const invalid = computed(() => value.value.length === 0)',
          bind: ':invalid="invalid"'
        })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MultiSelect>} */
export const Disabled = {
  args: { disabled: true },
  render: BasicTemplate,

  parameters: {
    docs: {
      source: {
        code: basicSource({ bind: 'disabled' })
      }
    }
  }
}
