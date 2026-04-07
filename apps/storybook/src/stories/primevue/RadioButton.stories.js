import RadioButton from '@aziontech/webkit/radiobutton'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean', description: 'Disables the radio button' }
  }
}

export const Default = {
  render: () => ({
    components: { RadioButton },
    setup() {
      const value = ref('option1')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" name="group" value="option1" />
          <label>Option 1</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" name="group" value="option2" />
          <label>Option 2</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" name="group" value="option3" />
          <label>Option 3</label>
        </div>
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { RadioButton },
    setup() {
      const value = ref('option1')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" name="group" value="option1" disabled />
          <label>Disabled selected</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" name="group" value="option2" disabled />
          <label>Disabled unselected</label>
        </div>
      </div>
    `
  })
}
