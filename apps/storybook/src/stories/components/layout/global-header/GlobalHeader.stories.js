import GlobalHeader from '@aziontech/webkit/global-header'
import Default from '@aziontech/webkit/svg/azion/default'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import Default from '@aziontech/webkit/svg/azion/default'"
]

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string template: Vue compiles
// `<GlobalHeader.Left>` to `resolveComponent("GlobalHeader.Left")`, an exact-name
// lookup (a bare `GlobalHeader` registration does not satisfy it). In a real SFC
// the dotted tag resolves off the imported `GlobalHeader` binding, so consumer
// code needs only `import GlobalHeader` — these extra registrations are a
// Storybook-runtime concern.
const components = {
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  Default
}

/** @type {import('@storybook/vue3').Meta<typeof GlobalHeader>} */
const meta = {
  title: 'Components/Layout/GlobalHeader',
  component: GlobalHeader,
  subcomponents: {
    'GlobalHeader.Left': GlobalHeader.Left,
    'GlobalHeader.Middle': GlobalHeader.Middle,
    'GlobalHeader.Right': GlobalHeader.Right,
    'GlobalHeader.Brand': GlobalHeader.Brand
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
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
          'Application chrome for the top menubar: a fixed-height bar with composable start, center, and end regions plus a dedicated brand slot for Azion logo variants.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the header landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Global header'" },
        category: 'props'
      }
    },
    default: {
      control: false,
      description:
        'Compose the header regions: Container (or Left + Brand), Middle/Nav, and Right sub-components.',
      table: { type: { summary: '—' }, category: 'slots' }
    }
  },
  args: {
    ariaLabel: 'Global header'
  }
}

export default meta

// The three regions plus the branded start cluster, authored once so the live
// canvas (Template) and the "Show code" snippet (DEFAULT_MARKUP) never drift.
const HEADER_REGIONS = `  <GlobalHeader.Left>
    <GlobalHeader.Brand>
      <a href="/" aria-label="Azion home">
        <Default />
      </a>
    </GlobalHeader.Brand>
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right />`

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `<GlobalHeader v-bind="args">
${HEADER_REGIONS}
</GlobalHeader>`
})

const DEFAULT_MARKUP = `<GlobalHeader aria-label="Global header">
${HEADER_REGIONS}
</GlobalHeader>`

/** @type {import('@storybook/vue3').StoryObj<typeof GlobalHeader>} */
export const DefaultHeader = {
  name: 'Default',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The shell composed with the Azion logo in the brand slot at the start region, leaving the center and end regions ready for consumer content.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
