import MultiSelect from '@aziontech/webkit/multiselect'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    filter: { control: 'boolean', description: 'Shows a filter input' },
    display: { control: 'select', options: ['comma', 'chip'], description: 'Display mode for selected items' },
    disabled: { control: 'boolean', description: 'Disables the component' },
    loading: { control: 'boolean', description: 'Shows loading indicator' }
  }
}

const sampleOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
  { label: 'Option 5', value: 5 }
]

export const Default = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const value = ref([])
      return { value, options: sampleOptions }
    },
    template: `<MultiSelect v-model="value" :options="options" optionLabel="label" optionValue="value" placeholder="Select options" />`
  })
}

export const WithFilter = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const value = ref([])
      return { value, options: sampleOptions }
    },
    template: `<MultiSelect v-model="value" :options="options" optionLabel="label" optionValue="value" placeholder="Search..." filter />`
  })
}

export const ChipDisplay = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const value = ref([1, 3])
      return { value, options: sampleOptions }
    },
    template: `<MultiSelect v-model="value" :options="options" optionLabel="label" optionValue="value" display="chip" placeholder="Select" />`
  })
}

export const Disabled = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const value = ref([1])
      return { value, options: sampleOptions }
    },
    template: `<MultiSelect v-model="value" :options="options" optionLabel="label" optionValue="value" disabled />`
  })
}
