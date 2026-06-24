import { ref } from 'vue'
import InputText from '@aziontech/webkit/input-text'

const sizes = ['small', 'medium', 'large']

export default {
 title: 'Components/Inputs/Input Text',
  component: InputText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    type: { control: 'text', description: 'HTML input type' },
    size: { control: 'select', options: sizes, description: 'Input size' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    readonly: { control: 'boolean', description: 'Readonly state' },
    invalid: { control: 'boolean', description: 'Invalid state' }
  }
}

export const Default = {
  args: {
    placeholder: 'Enter text',
    size: 'medium',
    disabled: false,
    readonly: false,
    invalid: false
  },
  render: (args) => ({
    components: { InputText },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div class="max-w-sm">
        <InputText v-model="value" v-bind="args" />
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('Disabled value')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <InputText v-model="value" disabled />
      </div>
    `
  })
}

export const Readonly = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('Readonly value')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <InputText v-model="value" readonly />
      </div>
    `
  })
}

export const Invalid = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('Invalid value')
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <InputText v-model="value" invalid placeholder="Invalid input" />
      </div>
    `
  })
}

export const Sizes = {
  render: () => ({
    components: { InputText },
    setup() {
      const small = ref('')
      const medium = ref('')
      const large = ref('')
      return { small, medium, large }
    },
    template: `
      <div class="flex max-w-sm flex-col gap-4">
        <InputText v-model="small" size="small" placeholder="Small size" />
        <InputText v-model="medium" size="medium" placeholder="Medium size" />
        <InputText v-model="large" size="large" placeholder="Large size" />
      </div>
    `
  })
}
