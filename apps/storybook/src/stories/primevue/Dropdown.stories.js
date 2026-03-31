import Dropdown from '@aziontech/webkit/dropdown'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    filter: { control: 'boolean', description: 'Shows a filter input' },
    editable: { control: 'boolean', description: 'Allows free text input' },
    loading: { control: 'boolean', description: 'Shows loading indicator' },
    disabled: { control: 'boolean', description: 'Disables the component' },
    showClear: { control: 'boolean', description: 'Shows a clear icon' }
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
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `<Dropdown v-model="value" :options="options" optionLabel="label" optionValue="value" placeholder="Select an option" />`
  })
}

export const WithFilter = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `<Dropdown v-model="value" :options="options" optionLabel="label" optionValue="value" placeholder="Search..." filter />`
  })
}

export const Editable = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `<Dropdown v-model="value" :options="options" optionLabel="label" optionValue="value" placeholder="Type or select" editable />`
  })
}

export const Loading = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `<Dropdown v-model="value" :options="options" optionLabel="label" optionValue="value" placeholder="Loading..." loading />`
  })
}

export const Disabled = {
  render: () => ({
    components: { Dropdown },
    setup() {
      const value = ref(2)
      return { value, options: sampleOptions }
    },
    template: `<Dropdown v-model="value" :options="options" optionLabel="label" optionValue="value" disabled />`
  })
}
