import PasswordRequirements from '@aziontech/webkit/password-requirements'

import Example0 from '../../../../../../../packages/webkit/examples/password-requirements/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/password-requirements/default.vue?raw'

/** @type {import('@storybook/vue3').Meta<typeof PasswordRequirements>} */
const meta = {
  title: 'Components/Primitives/Inputs/PasswordRequirements',
  component: PasswordRequirements,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Live checklist of password rules under a `PasswordInput`; each chip turns to the success tone as the typed value satisfies it.'
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
          'Under a `PasswordInput` in a `Field`: each chip turns to the success tone as the typed password meets its rule.'
      },
      source: { code: source0 }
    }
  }
}
