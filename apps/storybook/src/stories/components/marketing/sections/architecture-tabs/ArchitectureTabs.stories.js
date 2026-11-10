import ArchitectureTabs from '@aziontech/webkit/architecture-tabs'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/architecture-tabs'

const IMPORT = "import ArchitectureTabs from '@aziontech/webkit/architecture-tabs'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('ArchitectureTabs', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof ArchitectureTabs>} */
const meta = {
  title: 'Components/Marketing/Sections/ArchitectureTabs',
  component: ArchitectureTabs,
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
          "The architecture band of a product page: a horizontal section title with one large button, over a row of up to five tabs whose active tab draws its named diagram the full width of the frame. It is a page section — the site places it from a `{ _id: 'architecture-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `media-tabs` and `diagram`. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence beside the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description:
        'Side of the diagram the tabs sit on: `top`, `bottom`, `left` or `right`; left and right hold up to three tabs.',
      table: {
        category: 'props',
        type: { summary: 'ArchitectureTabsPosition' },
        defaultValue: { summary: "'top'" }
      }
    },
    tabs: {
      control: 'object',
      description:
        'The architectures, in order; each is `{ value, title, description, diagram }` where `diagram` is the name of the diagram drawn while the tab is active.',
      table: {
        category: 'props',
        type: { summary: 'ArchitectureTabsTab[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'Large button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ArchitectureTabsAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ArchitectureTabs },
  setup() {
    return { args }
  },
  template: '<ArchitectureTabs v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof ArchitectureTabs>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the AI Gateway page places it: five routing architectures with the tabs at the bottom, each drawing its diagram. Edit the props in the Controls panel — move the tabs with `position`, or empty `tabs` to see the band render nothing.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
