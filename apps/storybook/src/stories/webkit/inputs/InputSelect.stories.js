import InputSelect from '@aziontech/webkit/inputs/input-select'
import InputSelectContent from '@aziontech/webkit/inputs/input-select-content'
import InputSelectGroup from '@aziontech/webkit/inputs/input-select-group'
import InputSelectOption from '@aziontech/webkit/inputs/input-select-option'
import InputSelectTrigger from '@aziontech/webkit/inputs/input-select-trigger'
import InputText from '@aziontech/webkit/inputs/input-text'
import { computed, ref } from 'vue'

const components = {
  InputSelect,
  InputSelectTrigger,
  InputSelectContent,
  InputSelectGroup,
  InputSelectOption,
  InputText
}

/** @type {import('@storybook/vue3').Meta<typeof InputSelect>} */
const meta = {
  title: 'Webkit/Inputs/InputSelect',
  component: InputSelect,
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
          "Select control for choosing one (`multiple={false}`) or many (`multiple={true}`) options from a list. The trigger field mirrors `InputText`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown is rendered via the native Popover API + CSS anchor positioning — no `@floating-ui` runtime. Each option carries a radio indicator in single mode or a checkbox indicator in multi mode, optionally a leading slot/icon and a trailing tag. Search and \"Create new\" footer are exposed as slots on `<InputSelectContent>`.",
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import InputSelect from '@aziontech/webkit/inputs/input-select'",
          "import InputSelectTrigger from '@aziontech/webkit/inputs/input-select-trigger'",
          "import InputSelectContent from '@aziontech/webkit/inputs/input-select-content'",
          "import InputSelectGroup from '@aziontech/webkit/inputs/input-select-group'",
          "import InputSelectOption from '@aziontech/webkit/inputs/input-select-option'",
          '',
          "const value = defineModel({ default: '' })",
          '</script>',
          '',
          '<template>',
          '  <InputSelect v-model="value" size="medium" placeholder="Select an option">',
          '    <InputSelectTrigger />',
          '    <InputSelectContent>',
          '      <InputSelectGroup label="Group A">',
          '        <InputSelectOption value="opt-1">Option 1</InputSelectOption>',
          '        <InputSelectOption value="opt-2">Option 2</InputSelectOption>',
          '      </InputSelectGroup>',
          '    </InputSelectContent>',
          '  </InputSelect>',
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

const BasicTemplate = (args) => ({
  components,
  setup() {
    const value = ref(args.modelValue ?? (args.multiple ? [] : ''))
    return { args, value }
  },
  template: `
    <div style="width: 280px;">
      <InputSelect v-bind="args" v-model="value">
        <InputSelectTrigger />
        <InputSelectContent>
          <InputSelectOption value="opt-1">Option 1</InputSelectOption>
          <InputSelectOption value="opt-2">Option 2</InputSelectOption>
          <InputSelectOption value="opt-3">Option 3</InputSelectOption>
          <InputSelectOption value="opt-4">Option 4</InputSelectOption>
        </InputSelectContent>
      </InputSelect>
    </div>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Default = {
  args: {
    size: 'large'
  },

  render: BasicTemplate
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Sizes = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div class="flex flex-col gap-4" style="width: 280px;">
        <InputSelect v-bind="args" v-model="value" size="small" placeholder="Small">
          <InputSelectTrigger />
          <InputSelectContent>
            <InputSelectOption value="a">Option A</InputSelectOption>
            <InputSelectOption value="b">Option B</InputSelectOption>
          </InputSelectContent>
        </InputSelect>
        <InputSelect v-bind="args" v-model="value" size="medium" placeholder="Medium">
          <InputSelectTrigger />
          <InputSelectContent>
            <InputSelectOption value="a">Option A</InputSelectOption>
            <InputSelectOption value="b">Option B</InputSelectOption>
          </InputSelectContent>
        </InputSelect>
        <InputSelect v-bind="args" v-model="value" size="large" placeholder="Large">
          <InputSelectTrigger />
          <InputSelectContent>
            <InputSelectOption value="a">Option A</InputSelectOption>
            <InputSelectOption value="b">Option B</InputSelectOption>
          </InputSelectContent>
        </InputSelect>
      </div>
    `
  })
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Single = {
  args: { multiple: false },
  render: BasicTemplate
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Multiple = {
  args: { multiple: true, modelValue: [] },
  render: BasicTemplate
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const WithGroups = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="width: 280px;">
        <InputSelect v-bind="args" v-model="value">
          <InputSelectTrigger />
          <InputSelectContent>
            <InputSelectGroup label="Group A">
              <InputSelectOption value="a-1">Option 1</InputSelectOption>
              <InputSelectOption value="a-2">Option 2</InputSelectOption>
            </InputSelectGroup>
            <InputSelectGroup label="Group B">
              <InputSelectOption value="b-1">Option 1</InputSelectOption>
              <InputSelectOption value="b-2">Option 2</InputSelectOption>
            </InputSelectGroup>
          </InputSelectContent>
        </InputSelect>
      </div>
    `
  })
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const WithSearchAndFooter = {
  render: (args) => ({
    components,
    setup() {
      const search = ref('')
      const options = [
        { value: 'opt-1', label: 'Option 1' },
        { value: 'opt-2', label: 'Option 2' },
        { value: 'opt-3', label: 'Option 3' },
        { value: 'opt-4', label: 'Option 4' }
      ]
      const filtered = computed(() => {
        const q = search.value.trim().toLowerCase()
        if (!q) return options
        return options.filter((o) => o.label.toLowerCase().includes(q))
      })
      const value = ref('')
      return { args, value, search, filtered }
    },
    template: `
      <div style="width: 280px;">
        <InputSelect v-bind="args" v-model="value">
          <InputSelectTrigger />
          <InputSelectContent>
            <template #search>
              <InputText v-model="search" size="small" placeholder="Search">
                <template #iconLeft>
                  <i class="pi pi-search" aria-hidden="true" />
                </template>
              </InputText>
            </template>
            <InputSelectOption
              v-for="o in filtered"
              :key="o.value"
              :value="o.value"
            >{{ o.label }}</InputSelectOption>
            <template #footer>
              <button type="button" class="flex w-full items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)] hover:bg-[var(--bg-hover)]">
                <i class="pi pi-plus-circle" aria-hidden="true" />
                Create new item
              </button>
            </template>
          </InputSelectContent>
        </InputSelect>
      </div>
    `
  })
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const WithOptionExtras = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="width: 280px;">
        <InputSelect v-bind="args" v-model="value">
          <InputSelectTrigger />
          <InputSelectContent>
            <InputSelectOption value="heart" icon="pi pi-heart">With icon</InputSelectOption>
            <InputSelectOption value="left">
              <template #left>
                <i class="pi pi-star" aria-hidden="true" />
              </template>
              With left slot
            </InputSelectOption>
            <InputSelectOption value="tag">
              With tag
              <template #tag>
                <span class="rounded-[var(--shape-elements)] bg-[var(--info)] px-[var(--spacing-xxs)] text-tag-sm text-[var(--info-contrast)]">Label</span>
              </template>
            </InputSelectOption>
          </InputSelectContent>
        </InputSelect>
      </div>
    `
  })
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Filled = {
  args: { modelValue: 'opt-1' },
  render: BasicTemplate
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Invalid = {
  render: (args) => ({
    components,
    setup() {
      const value = ref('')
      const invalid = computed(() => !value.value)
      return { args, value, invalid }
    },
    template: `
      <div style="width: 280px;">
        <InputSelect v-bind="args" v-model="value" :invalid="invalid" placeholder="Select an option">
          <InputSelectTrigger />
          <InputSelectContent>
            <InputSelectOption value="opt-1">Option 1</InputSelectOption>
            <InputSelectOption value="opt-2">Option 2</InputSelectOption>
            <InputSelectOption value="opt-3">Option 3</InputSelectOption>
            <InputSelectOption value="opt-4">Option 4</InputSelectOption>
          </InputSelectContent>
        </InputSelect>
      </div>
    `
  })
}

/** @type {import('@storybook/vue3').StoryObj<typeof InputSelect>} */
export const Disabled = {
  args: { disabled: true },
  render: BasicTemplate
}
