import InputSwitch from '@aziontech/webkit/inputswitch'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/InputSwitch',
  component: InputSwitch,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean', description: 'Disables the switch' }
  }
}

export const Default = {
  render: () => ({
    components: { InputSwitch },
    setup() {
      const value = ref(false)
      return { value }
    },
    template: `
      <div class="flex items-center gap-2">
        <InputSwitch v-model="value" />
        <label>{{ value ? 'On' : 'Off' }}</label>
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { InputSwitch },
    setup() {
      const value = ref(true)
      return { value }
    },
    template: `
      <div class="flex items-center gap-2">
        <InputSwitch v-model="value" disabled />
        <label>Disabled</label>
      </div>
    `
  })
}
