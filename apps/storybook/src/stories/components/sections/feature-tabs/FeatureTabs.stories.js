import FeatureTabs from '@aziontech/webkit/sections/feature-tabs'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/feature-tabs'

const IMPORT = "import FeatureTabs from '@aziontech/webkit/sections/feature-tabs'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('FeatureTabs', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof FeatureTabs>} */
const meta = {
  title: 'Components/Sections/FeatureTabs',
  component: FeatureTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The feature walkthrough band of a product page: a left-aligned section title over up to three tabs on one side and the active tab's illustration on the other, closed by a small link under the frame. It is a page section — the site places it from a `{ _id: 'feature-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `media-tabs`, `illustration` and `mini-button`. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the left section title as its `h2`; the band renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    tabs: {
      control: 'object',
      description:
        'The features, in order, at most three; each is `{ title, description, illustration, illustrationLabel? }` where `illustration` is a registry name and `illustrationLabel` its accessible name.',
      table: {
        category: 'props',
        type: { summary: 'FeatureTabsTab[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'Small link under the frame; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'FeatureTabsAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { FeatureTabs },
  setup() {
    return { args }
  },
  template: '<FeatureTabs v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureTabs>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Functions page places it: Trace, Logs and Request path, each shown by its illustration, with the link under the frame. Edit the props in the Controls panel — a band with no tabs renders nothing at all.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
