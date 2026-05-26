import AzionDefault from '@aziontech/webkit/svg/azion/default'
import GlobalHeader from '@aziontech/webkit/layout/global-header'

/** @type {import('@storybook/vue3').Meta<typeof GlobalHeader>} */
const meta = {
  title: 'Webkit/Layout/GlobalHeader',
  component: GlobalHeader,
  subcomponents: {
    GlobalHeaderLeft: GlobalHeader.Left,
    GlobalHeaderMiddle: GlobalHeader.Middle,
    GlobalHeaderRight: GlobalHeader.Right,
    GlobalHeaderBrand: GlobalHeader.Brand
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'landmark-one-main', enabled: false }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Application chrome for the top menubar with composable start, center, and end regions plus a dedicated brand slot for Azion logo variants.'
      }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the header landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Global header' },
        category: 'props'
      }
    }
  },
  args: {
    ariaLabel: 'Global header'
  }
}

export default meta

const Template = (args) => ({
  components: {
    GlobalHeader,
    GlobalHeaderLeft: GlobalHeader.Left,
    GlobalHeaderMiddle: GlobalHeader.Middle,
    GlobalHeaderRight: GlobalHeader.Right,
    GlobalHeaderBrand: GlobalHeader.Brand,
    AzionDefault
  },
  setup() {
    return { args }
  },
  template: `
    <GlobalHeader v-bind="args">
      <GlobalHeaderLeft>
        <GlobalHeaderBrand>
          <a href="/" aria-label="Azion home">
            <AzionDefault />
          </a>
        </GlobalHeaderBrand>
      </GlobalHeaderLeft>
      <GlobalHeaderMiddle />
      <GlobalHeaderRight />
    </GlobalHeader>
  `
})

export const Default = {
  render: Template
}
