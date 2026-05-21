import { ref } from 'vue'
import InputSwitch from '@aziontech/webkit/inputs/input-switch'

export default {
  title: 'Webkit/Inputs/Input Switch',
  component: InputSwitch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    disabled: { control: 'boolean', description: 'Disabled state' }
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
      <label class="inline-flex items-center gap-2 text-[var(--text-default)]">
        <InputSwitch v-model="value" input-id="webkit-switch-default" />
        {{ value ? 'On' : 'Off' }}
      </label>
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
      <label class="inline-flex items-center gap-2 text-[var(--text-default)]">
        <InputSwitch v-model="value" disabled input-id="webkit-switch-disabled" />
        Disabled on
      </label>
    `
  })
}

export const OnOff = {
  render: () => ({
    components: { InputSwitch },
    setup() {
      const enabled = ref(true)
      return { enabled }
    },
    template: `
      <div class="flex flex-col gap-4 text-[var(--text-default)]">
        <label class="inline-flex items-center gap-2">
          <InputSwitch v-model="enabled" input-id="webkit-switch-on-off" />
          Notifications {{ enabled ? 'enabled' : 'disabled' }}
        </label>
      </div>
    `
  })
}
