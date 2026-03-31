import Textarea from '@aziontech/webkit/textarea'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    rows: { control: 'number', description: 'Number of rows' },
    cols: { control: 'number', description: 'Number of columns' },
    autoResize: { control: 'boolean', description: 'Auto resize based on content' },
    disabled: { control: 'boolean', description: 'Disables the textarea' }
  }
}

export const Default = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Textarea v-model="value" rows="5" cols="30" placeholder="Enter text" />`
  })
}

export const AutoResize = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Textarea v-model="value" autoResize rows="3" placeholder="Auto resize" />`
  })
}

export const Disabled = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('Disabled content')
      return { value }
    },
    template: `<Textarea v-model="value" rows="3" disabled />`
  })
}
