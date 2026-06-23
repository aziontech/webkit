import { ref } from 'vue'
import Dropdown from '@aziontech/webkit/inputs/dropdown'

const sampleOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
  { label: 'Option 5', value: 5 }
]

const groupedOptions = [
  {
    label: 'Group A',
    items: [
      { label: 'A1', value: 'a1' },
      { label: 'A2', value: 'a2' }
    ]
  },
  {
    label: 'Group B',
    items: [
      { label: 'B1', value: 'b1' },
      { label: 'B2', value: 'b2' }
    ]
  }
]

export default {
 title: 'Components/Inputs/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    filter: { control: 'boolean', description: 'Shows a filter input' },
    loading: { control: 'boolean', description: 'Shows loading indicator' },
    disabled: { control: 'boolean', description: 'Disables the component' },
    showClear: { control: 'boolean', description: 'Shows a clear button' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    invalid: { control: 'boolean', description: 'Invalid state' }
  }
}

export const Default = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `
      <div class="max-w-sm">
        <Dropdown
          v-model="value"
          :options="options"
          option-label="label"
          option-value="value"
          placeholder="Select an option"
        />
      </div>
    `
  })
}

export const WithFilter = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `
      <div class="max-w-sm">
        <Dropdown
          v-model="value"
          :options="options"
          option-label="label"
          option-value="value"
          placeholder="Search..."
          filter
          auto-filter-focus
        />
      </div>
    `
  })
}

export const WithClear = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(2)
      return { value, options: sampleOptions }
    },
    template: `
      <div class="max-w-sm">
        <Dropdown
          v-model="value"
          :options="options"
          option-label="label"
          option-value="value"
          placeholder="Select an option"
          show-clear
        />
      </div>
    `
  })
}

export const Loading = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `
      <div class="max-w-sm">
        <Dropdown
          v-model="value"
          :options="options"
          option-label="label"
          option-value="value"
          placeholder="Loading..."
          loading
        />
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(2)
      return { value, options: sampleOptions }
    },
    template: `
      <div class="max-w-sm">
        <Dropdown
          v-model="value"
          :options="options"
          option-label="label"
          option-value="value"
          disabled
        />
      </div>
    `
  })
}

export const Grouped = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: groupedOptions }
    },
    template: `
      <div class="max-w-sm">
        <Dropdown
          v-model="value"
          :options="options"
          option-group-label="label"
          option-group-children="items"
          option-label="label"
          option-value="value"
          placeholder="Select from group"
        />
      </div>
    `
  })
}

export const Sizes = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const small = ref(null)
      const medium = ref(null)
      const large = ref(null)
      return { small, medium, large, options: sampleOptions }
    },
    template: `
      <div class="flex max-w-sm flex-col gap-4">
        <Dropdown v-model="small" :options="options" option-label="label" option-value="value" size="small" placeholder="Small" />
        <Dropdown v-model="medium" :options="options" option-label="label" option-value="value" size="medium" placeholder="Medium" />
        <Dropdown v-model="large" :options="options" option-label="label" option-value="value" size="large" placeholder="Large" />
      </div>
    `
  })
}
