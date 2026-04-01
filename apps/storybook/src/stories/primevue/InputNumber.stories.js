import InputNumber from '@aziontech/webkit/inputnumber'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    disabled: { control: 'boolean', description: 'Disables the input' },
    showButtons: { control: 'boolean', description: 'Shows increment/decrement buttons' },
    min: { control: 'number', description: 'Minimum value' },
    max: { control: 'number', description: 'Maximum value' }
  }
}

export const Default = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const value = ref(0)
      return { value }
    },
    template: `<InputNumber v-model="value" placeholder="Enter number" />`
  })
}

export const WithButtons = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const value = ref(5)
      return { value }
    },
    template: `<InputNumber v-model="value" showButtons :min="0" :max="100" />`
  })
}

export const MinMax = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const value = ref(10)
      return { value }
    },
    template: `<InputNumber v-model="value" :min="0" :max="50" showButtons />`
  })
}

export const Disabled = {
  render: () => ({
    components: { InputNumber },
    setup() {
      const value = ref(42)
      return { value }
    },
    template: `<InputNumber v-model="value" disabled />`
  })
}
