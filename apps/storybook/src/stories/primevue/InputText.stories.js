import InputText from '@aziontech/webkit/inputtext'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    disabled: { control: 'boolean', description: 'Disables the input' },
    readonly: { control: 'boolean', description: 'Makes the input readonly' }
  }
}

export const Default = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<InputText v-model="value" placeholder="Enter text" />`
  })
}

export const Disabled = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('Disabled value')
      return { value }
    },
    template: `<InputText v-model="value" disabled />`
  })
}

export const Readonly = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('Readonly value')
      return { value }
    },
    template: `<InputText v-model="value" readonly />`
  })
}
