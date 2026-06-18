import Label from '@aziontech/webkit/inputs/label'

/** @type {import('@storybook/vue3').Meta<typeof Label>} */
const meta = {
  title: 'Webkit/Inputs/Label',
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
          { id: 'label', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          'Form-field label that pairs descriptive text with an optional `Required` badge. Renders a native `<label>` element so consumers can associate it with any input via the standard `for` attribute. Use it above (or beside) any input control in the `inputs` category to communicate the field name and whether it must be filled.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Label from '@aziontech/webkit/inputs/label'",
          "import InputText from '@aziontech/webkit/inputs/input-text'",
          '</script>',
          '',
          '<template>',
          '  <Label for="email" value="Email" required />',
          '  <InputText id="email" />',
          '</template>',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: 'undefined' } }
    },
    required: {
      control: 'boolean',
      description: 'Appends a `Required` tag next to the label text.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
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
    return { props: args }
  },
  template: '<Label v-bind="props" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Label>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default label without the required indicator.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Label>} */
export const Required = {
  args: { required: true },
  render: Template,
  parameters: {
    docs: { description: { story: 'Required label — appends the `Required` tag.' } }
  }
}
