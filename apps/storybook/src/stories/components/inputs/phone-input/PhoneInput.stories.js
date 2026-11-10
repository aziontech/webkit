import PhoneInput from '@aziontech/webkit/phone-input'

import Example0 from '../../../../../../../packages/webkit/examples/phone-input/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/phone-input/default.vue?raw'

/** @type {import('@storybook/vue3').Meta<typeof PhoneInput>} */
const meta = {
  title: 'Components/Primitives/Inputs/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'International phone control: a searchable dial-code `Select` and a masked `tel` input in one `InputGroup`. Wrap it in a `Field` for the label and description.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'Inside a `Field`: the label targets the tel input, the dial-code select filters as you type, and `update:phone` hands over the E.164 number and whether it is complete.'
      },
      source: { code: source0 }
    }
  }
}
