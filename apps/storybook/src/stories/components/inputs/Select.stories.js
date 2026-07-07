import Button from '@aziontech/webkit/button'
import Tag from '@aziontech/webkit/tag'
import Select, {
  SelectContent,
  SelectGroup,
  SelectOption,
  SelectTrigger
} from '@aziontech/webkit/select'
import InputText from '@aziontech/webkit/input-text'
import { computed, ref } from 'vue'

const components = {
  Button,
  Tag,
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectOption,
  InputText
}

const CORE_IMPORT = "import Select from '@aziontech/webkit/select'"

/** @type {import('@storybook/vue3').Meta<typeof Select>} */
const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
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
          "Select control for choosing one (`multiple={false}`) or many (`multiple={true}`) options from a list. The trigger field mirrors `InputText`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown is rendered via the native Popover API + CSS anchor positioning — no `@floating-ui` runtime. Each option carries a radio indicator in single mode or a checkbox indicator in multi mode, optionally a leading slot/icon and a trailing tag. Search and \"Create new\" footer are exposed as slots on `<Select.Content>`.",
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
          'const options = [',
          "  { value: 'opt-1', label: 'Option 1' },",
          "  { value: 'opt-2', label: 'Option 2' },",
          "  { value: 'opt-3', label: 'Option 3' },",
          "  { value: 'opt-4', label: 'Option 4' }",
          ']',
          '</script>',
          '',
          '<template>',
          '  <Select v-model="value" size="medium" placeholder="Select an option">',
          '    <Select.Trigger />',
          '    <Select.Content>',
          '      <Select.Option',
          '        v-for="o in options"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</Select.Option>',
          '    </Select.Content>',
          '  </Select>',
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
    modelValue: { control: 'text', table: { category: 'props' } },
    multiple: {
      control: 'boolean',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
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
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events' }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the dropdown opens or closes.',
      table: { category: 'events' }
    }
  },
  args: {
    multiple: false,
    size: 'medium',
    placeholder: 'Select an option',
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
  initial = "''",
  extraImports = null,
  bind = '',
  extraSetup = null
} = {}) => {
  const lines = ['<script setup>', CORE_IMPORT, "import { ref } from 'vue'"]
  if (extraImports) lines.push(extraImports)
  lines.push('', `const value = ref(${initial})`, BASIC_OPTIONS_SNIPPET)
  if (extraSetup) lines.push(extraSetup)
  lines.push(
    '</script>',
    '',
    '<template>',
    `  <Select v-model="value" placeholder="Select an option"${bind ? ' ' + bind : ''}>`,
    '    <Select.Trigger />',
    '    <Select.Content>',
    '      <Select.Option',
    '        v-for="o in options"',
    '        :key="o.value"',
    '        :value="o.value"',
    '      >{{ o.label }}</Select.Option>',
    '    </Select.Content>',
    '  </Select>',
    '</template>'
  )
  return lines.join('\n')
}

const BasicTemplate = (args) => ({
  components,
  setup() {
    const value = ref(args.modelValue ?? (args.multiple ? [] : ''))
    const options = ref(BASIC_OPTIONS)
    return { args, value, options }
  },
  template: `
    <div style="width: 280px;">
      <Select v-bind="args" v-model="value">
        <SelectTrigger />
        <SelectContent>
          <SelectOption
            v-for="o in options"
            :key="o.value"
            :value="o.value"
          >{{ o.label }}</SelectOption>
        </SelectContent>
      </Select>
    </div>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Default = {
  args: {
    size: 'large'
  },

  render: BasicTemplate,

  parameters: {
    docs: {
      source: {
        code: basicSource({ bind: 'size="large"' })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Sizes = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      const options = ref([
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' }
      ])
      const sizes = ['small', 'medium', 'large']
      return { args, value, options, sizes }
    },
    template: `
      <div class="flex flex-col gap-4" style="width: 280px;">
        <Select
          v-for="s in sizes"
          :key="s"
          v-bind="args"
          v-model="value"
          :size="s"
          :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
        >
          <SelectTrigger />
          <SelectContent>
            <SelectOption
              v-for="o in options"
              :key="o.value"
              :value="o.value"
            >{{ o.label }}</SelectOption>
          </SelectContent>
        </Select>
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
          'const options = [',
          "  { value: 'a', label: 'Option A' },",
          "  { value: 'b', label: 'Option B' }",
          ']',
          "const sizes = ['small', 'medium', 'large']",
          '</script>',
          '',
          '<template>',
          '  <Select',
          '    v-for="s in sizes"',
          '    :key="s"',
          '    v-model="value"',
          '    :size="s"',
          '    :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"',
          '  >',
          '    <Select.Trigger />',
          '    <Select.Content>',
          '      <Select.Option',
          '        v-for="o in options"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</Select.Option>',
          '    </Select.Content>',
          '  </Select>',
          '</template>'
        ].join('\n')
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
      source: {
        code: basicSource({ initial: '[]', bind: 'multiple' })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const WithGroups = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
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
        <Select v-bind="args" v-model="value">
          <SelectTrigger />
          <SelectContent>
            <SelectGroup
              v-for="g in groups"
              :key="g.label"
              :label="g.label"
            >
              <SelectOption
                v-for="o in g.options"
                :key="o.value"
                :value="o.value"
              >{{ o.label }}</SelectOption>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
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
          '  <Select v-model="value">',
          '    <Select.Trigger />',
          '    <Select.Content>',
          '      <Select.Group',
          '        v-for="g in groups"',
          '        :key="g.label"',
          '        :label="g.label"',
          '      >',
          '        <Select.Option',
          '          v-for="o in g.options"',
          '          :key="o.value"',
          '          :value="o.value"',
          '        >{{ o.label }}</Select.Option>',
          '      </Select.Group>',
          '    </Select.Content>',
          '  </Select>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
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
      const value = ref('')
      const onCreate = () => {
        const label = search.value.trim()
        args.onCreate?.(label)
        if (!label) return
        const next = { value: `opt-${options.value.length + 1}`, label }
        options.value = [...options.value, next]
        value.value = next.value
        search.value = ''
      }
      return { args, value, search, filtered, onCreate }
    },
    template: `
      <div style="width: 280px;">
        <Select v-bind="args" v-model="value">
          <SelectTrigger />
          <SelectContent>
            <template #search>
              <InputText v-model="search" size="small" placeholder="Search">
                <template #iconLeft>
                  <i class="pi pi-search" aria-hidden="true" />
                </template>
              </InputText>
            </template>
            <SelectOption
              v-for="o in filtered"
              :key="o.value"
              :value="o.value"
            >{{ o.label }}</SelectOption>
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
          </SelectContent>
        </Select>
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
          CORE_IMPORT,
          "import Button from '@aziontech/webkit/button'",
          "import InputText from '@aziontech/webkit/input-text'",
          "import { computed, ref } from 'vue'",
          '',
          'const emit = defineEmits([\'create\'])',
          '',
          "const value = ref('')",
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
          '  value.value = next.value',
          "  search.value = ''",
          '}',
          '</script>',
          '',
          '<template>',
          '  <Select v-model="value">',
          '    <Select.Trigger />',
          '    <Select.Content>',
          '      <template #search>',
          '        <InputText v-model="search" size="small" placeholder="Search">',
          '          <template #iconLeft>',
          '            <i class="pi pi-search" aria-hidden="true" />',
          '          </template>',
          '        </InputText>',
          '      </template>',
          '      <Select.Option',
          '        v-for="o in filtered"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</Select.Option>',
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
          '    </Select.Content>',
          '  </Select>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const WithOptionExtras = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      const options = ref([
        { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
        { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
        { value: 'tag', label: 'With tag', tag: 'Label' }
      ])
      return { args, value, options }
    },
    template: `
      <div style="width: 280px;">
        <Select v-bind="args" v-model="value">
          <SelectTrigger />
          <SelectContent>
            <SelectOption
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
            </SelectOption>
          </SelectContent>
        </Select>
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import Tag from '@aziontech/webkit/tag'",
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
          'const options = [',
          "  { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },",
          "  { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },",
          "  { value: 'tag', label: 'With tag', tag: 'Label' }",
          ']',
          '</script>',
          '',
          '<template>',
          '  <Select v-model="value">',
          '    <Select.Trigger />',
          '    <Select.Content>',
          '      <Select.Option',
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
          '      </Select.Option>',
          '    </Select.Content>',
          '  </Select>',
          '</template>'
        ].join('\n')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const LongList = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
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
        <Select v-bind="args" v-model="value" placeholder="Pick one of many">
          <SelectTrigger />
          <SelectContent>
            <SelectOption
              v-for="o in options"
              :key="o.value"
              :value="o.value"
            >{{ o.label }}</SelectOption>
          </SelectContent>
        </Select>
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: [
          '<script setup>',
          CORE_IMPORT,
          "import { ref } from 'vue'",
          '',
          "const value = ref('')",
          'const options = Array.from({ length: 40 }, (_, i) => ({',
          '  value: `opt-${i + 1}`,',
          '  label: `Option ${i + 1}`',
          '}))',
          '</script>',
          '',
          '<template>',
          '  <Select v-model="value" placeholder="Pick one of many">',
          '    <Select.Trigger />',
          '    <Select.Content>',
          '      <Select.Option',
          '        v-for="o in options"',
          '        :key="o.value"',
          '        :value="o.value"',
          '      >{{ o.label }}</Select.Option>',
          '    </Select.Content>',
          '  </Select>',
          '</template>'
        ].join('\n')
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
      source: {
        code: basicSource({ initial: "'opt-1'" })
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Select>} */
export const Invalid = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      const options = ref(BASIC_OPTIONS)
      const invalid = computed(() => !value.value)
      return { args, value, options, invalid }
    },
    template: `
      <div style="width: 280px;">
        <Select v-bind="args" v-model="value" :invalid="invalid" placeholder="Select an option">
          <SelectTrigger />
          <SelectContent>
            <SelectOption
              v-for="o in options"
              :key="o.value"
              :value="o.value"
            >{{ o.label }}</SelectOption>
          </SelectContent>
        </Select>
      </div>
    `
  }),

  parameters: {
    docs: {
      source: {
        code: basicSource({
          extraImports: "import { computed } from 'vue'",
          extraSetup: 'const invalid = computed(() => !value.value)',
          bind: ':invalid="invalid"'
        })
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
      source: {
        code: basicSource({ bind: 'disabled' })
      }
    }
  }
}
