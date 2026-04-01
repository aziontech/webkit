import Chips from '@aziontech/webkit/chips'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Chips',
  component: Chips,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    max: { control: 'number', description: 'Maximum number of entries' },
    disabled: { control: 'boolean', description: 'Disables the component' }
  }
}

export const Default = {
  render: () => ({
    components: { Chips },
    setup() {
      const value = ref([])
      return { value }
    },
    template: `<Chips v-model="value" placeholder="Add tags" />`
  })
}

export const WithMax = {
  render: () => ({
    components: { Chips },
    setup() {
      const value = ref(['Tag 1', 'Tag 2'])
      return { value }
    },
    template: `<Chips v-model="value" :max="5" placeholder="Max 5 tags" />`
  })
}

export const Disabled = {
  render: () => ({
    components: { Chips },
    setup() {
      const value = ref(['Tag 1', 'Tag 2'])
      return { value }
    },
    template: `<Chips v-model="value" disabled />`
  })
}
