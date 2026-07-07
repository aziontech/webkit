import Label from '@aziontech/webkit/label'

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
          { id: 'label', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          '```vue',
          '<script setup>',
          "import Label from '@aziontech/webkit/label'",
          "import InputText from '@aziontech/webkit/input-text'",
          '</script>',
          '',
          '<template>',
          '  <Label for="email" label="Email" required />',
          '  <InputText id="email" />',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    label: {
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
    label: 'Label',
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
