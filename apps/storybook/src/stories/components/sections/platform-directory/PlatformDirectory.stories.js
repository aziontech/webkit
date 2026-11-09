import PlatformDirectory from '@aziontech/webkit/sections/platform-directory'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/platform-directory'

const IMPORT = "import PlatformDirectory from '@aziontech/webkit/sections/platform-directory'"

/** @type {import('@storybook/vue3').Meta<typeof PlatformDirectory>} */
const meta = {
  title: 'Components/Sections/PlatformDirectory',
  component: PlatformDirectory,
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
          "A directory of Azion's products under a section title: one column per product group (Build, Store, Secure, Observe), each row an icon, a product name and one line about it, linking to that product. It is a page section — the site places it from a `{ _id: 'platform-directory', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box` and `column-navigation` rather than owning any anatomy of its own."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description:
        'Headline over the directory, rendered by the section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: "Accessible name of the directory's navigation landmark.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    groups: {
      control: 'object',
      description:
        'The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty.',
      table: {
        category: 'props',
        type: { summary: 'PlatformDirectoryGroup[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { PlatformDirectory },
  setup() {
    return { args }
  },
  template: '<PlatformDirectory v-bind="args" />'
})

const DEFAULT_MARKUP = `<PlatformDirectory
  title="Everything you need to build and run applications"
  aria-label="Azion products"
  :groups="[
    {
      title: 'Build',
      items: [
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run code globally with no cold starts',
          href: '/products/functions'
        },
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Run models close to the user',
          href: 'https://www.azion.com/en/products/ai-inference/'
        }
      ]
    },
    {
      title: 'Store',
      items: [
        {
          icon: 'ai ai-edge-kv',
          title: 'KV Store',
          description: 'Store key-value data with low latency',
          href: 'https://www.azion.com/en/products/kv-store/'
        }
      ]
    },
    {
      title: 'Secure',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'WAF',
          description: 'Block common attacks close to traffic',
          href: 'https://www.azion.com/en/products/web-application-firewall/'
        }
      ]
    },
    {
      title: 'Observe',
      items: [
        {
          icon: 'ai ai-real-time-metrics',
          title: 'Real-Time Metrics',
          description: 'Watch traffic, errors and latency as they happen',
          href: 'https://www.azion.com/en/products/real-time-metrics/'
        }
      ]
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof PlatformDirectory>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The directory as Home places it: the section title over four product groups, framed with corner marks. Edit the props in the Controls panel — items without a title or a link are skipped, and a band with no linked item renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
