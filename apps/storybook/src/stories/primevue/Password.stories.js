import Password from '@aziontech/webkit/password'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Password',
  component: Password,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    feedback: { control: 'boolean', description: 'Shows strength feedback' },
    toggleMask: { control: 'boolean', description: 'Shows toggle mask icon' },
    disabled: { control: 'boolean', description: 'Disables the input' }
  }
}

export const Default = {
  render: () => ({
    components: { Password },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Password v-model="value" placeholder="Enter password" />`
  })
}

export const WithFeedback = {
  render: () => ({
    components: { Password },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Password v-model="value" placeholder="Enter password" :feedback="true" toggleMask />`
  })
}

export const ToggleMask = {
  render: () => ({
    components: { Password },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Password v-model="value" placeholder="Enter password" toggleMask :feedback="false" />`
  })
}

export const Disabled = {
  render: () => ({
    components: { Password },
    setup() {
      const value = ref('secret')
      return { value }
    },
    template: `<Password v-model="value" disabled :feedback="false" />`
  })
}
