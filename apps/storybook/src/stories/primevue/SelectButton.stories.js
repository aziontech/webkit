import SelectButton from '@aziontech/webkit/selectbutton'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/SelectButton',
  component: SelectButton,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean', description: 'Allows multiple selection' },
    disabled: { control: 'boolean', description: 'Disables the component' }
  }
}

const sampleOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 }
]

export const Default = {
  render: () => ({
    components: { SelectButton },
    setup() {
      const value = ref(1)
      return { value, options: sampleOptions }
    },
    template: `<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" />`
  })
}

export const Multiple = {
  render: () => ({
    components: { SelectButton },
    setup() {
      const value = ref([1, 2])
      return { value, options: sampleOptions }
    },
    template: `<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" multiple />`
  })
}

export const Disabled = {
  render: () => ({
    components: { SelectButton },
    setup() {
      const value = ref(1)
      return { value, options: sampleOptions }
    },
    template: `<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" disabled />`
  })
}
