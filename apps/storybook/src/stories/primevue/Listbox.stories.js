import Listbox from '@aziontech/webkit/listbox'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  argTypes: {
    filter: { control: 'boolean', description: 'Shows a filter input' },
    multiple: { control: 'boolean', description: 'Allows multiple selection' },
    disabled: { control: 'boolean', description: 'Disables the component' }
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
    components: { Listbox },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `<Listbox v-model="value" :options="options" optionLabel="label" optionValue="value" />`
  })
}

export const WithFilter = {
  render: () => ({
    components: { Listbox },
    setup() {
      const value = ref(null)
      return { value, options: sampleOptions }
    },
    template: `<Listbox v-model="value" :options="options" optionLabel="label" optionValue="value" filter />`
  })
}

export const MultipleSelection = {
  render: () => ({
    components: { Listbox },
    setup() {
      const value = ref([])
      return { value, options: sampleOptions }
    },
    template: `<Listbox v-model="value" :options="options" optionLabel="label" optionValue="value" multiple />`
  })
}

export const Disabled = {
  render: () => ({
    components: { Listbox },
    setup() {
      const value = ref(1)
      return { value, options: sampleOptions }
    },
    template: `<Listbox v-model="value" :options="options" optionLabel="label" optionValue="value" disabled />`
  })
}
