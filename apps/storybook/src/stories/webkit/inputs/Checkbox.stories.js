import { ref } from 'vue'
import Checkbox from '@aziontech/webkit/inputs/checkbox'

export default {
  title: 'Webkit/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    binary: { control: 'boolean', description: 'Binary mode (true/false)' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    readonly: { control: 'boolean', description: 'Readonly state' }
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
      <label class="inline-flex items-center gap-2 text-[var(--text-default)]">
        <Checkbox v-model="value" binary input-id="webkit-checkbox-default" />
        Accept terms
      </label>
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
      <label class="inline-flex items-center gap-2 text-[var(--text-default)]">
        <Checkbox v-model="value" binary disabled input-id="webkit-checkbox-disabled" />
        Disabled checked
      </label>
    `
  })
}

export const Binary = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)
      return { value }
    },
    template: `
      <div class="flex flex-col gap-3 text-[var(--text-default)]">
        <label class="inline-flex items-center gap-2">
          <Checkbox v-model="value" binary input-id="webkit-checkbox-binary" />
          {{ value ? 'Checked' : 'Unchecked' }}
        </label>
      </div>
    `
  })
}
