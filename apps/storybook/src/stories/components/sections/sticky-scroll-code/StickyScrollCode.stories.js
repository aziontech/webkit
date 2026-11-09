import StickyScrollCode from '@aziontech/webkit/sections/sticky-scroll-code'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/sticky-scroll-code'

const IMPORT = "import StickyScrollCode from '@aziontech/webkit/sections/sticky-scroll-code'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('StickyScrollCode', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof StickyScrollCode>} */
const meta = {
  title: 'Components/Sections/StickyScrollCode',
  component: StickyScrollCode,
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
          "The developer-capabilities band of a product page: a large section title over a sticky stack whose claims scroll past a pinned media frame, the open claim showing its one-file code sample on the pixelate texture and its own button under its description. It is a page section — the site places it from a `{ _id: 'sticky-scroll-code', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `sticky-stack`, `texture-material`, `code-block` and `button`."
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
        'Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    items: {
      control: 'object',
      description:
        'The capabilities, in reading order; each is `{ title, description, code, action? }` where `code` is the one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the open item.',
      table: {
        category: 'props',
        type: { summary: 'StickyScrollCodeItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { StickyScrollCode },
  setup() {
    return { args }
  },
  template: '<StickyScrollCode v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof StickyScrollCode>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Web Apps page places it: five capabilities, from deploying with the CLI to querying metrics over GraphQL, each with a one-file sample and a docs button shown while it is open. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
