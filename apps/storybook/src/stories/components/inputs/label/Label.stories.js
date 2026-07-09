import Label from '@aziontech/webkit/label'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Label from '@aziontech/webkit/label'"

/** @type {import('@storybook/vue3').Meta<typeof Label>} */
const meta = {
  title: 'Components/Inputs/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Form-field label that pairs descriptive text with an optional required indicator. Renders a native HTML label element so consumers can associate it with an input via the standard `for` attribute.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    required: {
      control: 'boolean',
      description: 'Appends an inline required indicator (`* (Required)`) next to the label text.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    default: {
      control: false,
      description: 'Label text; falls back to the `value` prop when empty.',
      table: { category: 'slots', type: { summary: 'slot' } }
    }
  },
  args: {
    value: 'Label',
    required: false
  }
}

export default meta

const Template = (args) => ({
  components: { Label },
  setup() {
    return { args }
  },
  template: '<Label v-bind="args" />'
})

const DEFAULT_MARKUP = '<Label value="Label" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Label>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default label without the required indicator.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const REQUIRED_MARKUP = '<Label value="Label" required />'

/** @type {import('@storybook/vue3').StoryObj<typeof Label>} */
export const Required = {
  args: { required: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Required label — appends the inline `* (Required)` indicator.' },
      source: { code: toSfc(IMPORT, REQUIRED_MARKUP) }
    }
  }
}
