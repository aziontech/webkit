import { ref } from 'vue'
import RadioButton from '@aziontech/webkit/inputs/radio-button'

export default {
  title: 'Webkit/Inputs/Radio Button',
  component: RadioButton,
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
    components: { RadioButton },
    setup() {
      const value = ref('option1')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-2 text-[var(--text-default)]">
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-group" value="option1" input-id="webkit-radio-1" />
          Option 1
        </label>
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-group" value="option2" input-id="webkit-radio-2" />
          Option 2
        </label>
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-group" value="option3" input-id="webkit-radio-3" />
          Option 3
        </label>
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
      <div class="flex flex-col gap-2 text-[var(--text-default)]">
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-disabled" value="option1" disabled input-id="webkit-radio-disabled-1" />
          Disabled selected
        </label>
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-disabled" value="option2" disabled input-id="webkit-radio-disabled-2" />
          Disabled unselected
        </label>
      </div>
    `
  })
}

export const RadioGroup = {
  render: () => ({
    components: { RadioButton },
    setup() {
      const value = ref('a')
      return { value }
    },
    template: `
      <fieldset class="flex flex-col gap-2 border-0 p-0 text-[var(--text-default)]">
        <legend class="mb-2 text-body-sm font-semibold">Choose one</legend>
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-fieldset" value="a" input-id="webkit-radio-a" />
          Option A
        </label>
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-fieldset" value="b" input-id="webkit-radio-b" />
          Option B
        </label>
        <label class="inline-flex items-center gap-2">
          <RadioButton v-model="value" name="webkit-radio-fieldset" value="c" input-id="webkit-radio-c" />
          Option C
        </label>
        <p class="mt-2 text-body-sm text-[var(--text-muted)]">Selected: {{ value }}</p>
      </fieldset>
    `
  })
}
