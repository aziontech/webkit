import Checkbox from '@aziontech/webkit/checkbox'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    binary: { control: 'boolean', description: 'Binary mode (true/false)' },
    disabled: { control: 'boolean', description: 'Disables the checkbox' }
  }
}

export const Default = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)
      return { value }
    },
    template: `
      <div class="flex items-center gap-2">
        <Checkbox v-model="value" binary />
        <label>Accept terms</label>
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const value = ref(true)
      return { value }
    },
    template: `
      <div class="flex items-center gap-2">
        <Checkbox v-model="value" binary disabled />
        <label>Disabled checked</label>
      </div>
    `
  })
}
