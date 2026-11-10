import ResourceGrid from '@aziontech/webkit/sections/resource-grid'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/resource-grid'

const IMPORT = "import ResourceGrid from '@aziontech/webkit/sections/resource-grid'"

/** @type {import('@storybook/vue3').Meta<typeof ResourceGrid>} */
const meta = {
  title: 'Components/Sections/ResourceGrid',
  component: ResourceGrid,
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
          "A band that points readers to further reading on solution pages: an overline, a headline and a short lead with an optional button sit beside a two-column frame grid of linked resource cards, each a title and one sentence. A card whose link leaves the site opens in a new tab; past four cards the grid scrolls inside a fading scroll area. It is a page section — the site places it from a `{ _id: 'resource-grid', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split`, `card-grid`, `topic`, `scroll-area` and `button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description: 'Headline of the band, which also names its region and the scroll area.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Lead sentence beside the grid.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    items: {
      control: 'object',
      description:
        'The resource cards, in order; each is `{ title, description?, href }`, and a card with no title is skipped.',
      table: {
        category: 'props',
        type: { summary: 'ResourceGridItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description: 'Button under the copy; dropped when its label or link is missing.',
      table: {
        category: 'props',
        type: { summary: 'ResourceGridAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ResourceGrid },
  setup() {
    return { args }
  },
  template: '<ResourceGrid v-bind="args" />'
})

const DEFAULT_MARKUP = `<ResourceGrid
  eyebrow="Go Deeper"
  title="Guides and Resources"
  description="Documentation, articles, and customer stories on building secure, compliant financial applications on a distributed architecture."
  :items="[
    { title: 'New to Azion? Start here', description: 'A guide to your first steps with Azion.', href: '/docs' },
    { title: 'Learning Center', description: 'Practical knowledge to speed up, secure, and scale applications.', href: '/learning' },
    {
      title: 'How Technology Can Help You Comply with Regulations for Fintech',
      description: 'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
      href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
    },
    {
      title: 'How Justa is evolving its technology to meet modern digital demands',
      description: 'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
      href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
    }
  ]"
  :primary-action="{
    label: 'See all guides',
    href: 'https://www.azion.com/en/documentation/products/guides/',
    trailing: true,
    target: '_blank'
  }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ResourceGrid>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Financial Services band: four cards fill the grid beside the copy and its button. Edit the props in the Controls panel — add more than four items and the grid scrolls; a card with no title is skipped.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SCROLLABLE_TEMPLATE = `<ResourceGrid
  eyebrow="Go Deeper"
  title="Guides and Resources"
  description="Documentation and articles on building, securing, and scaling modern applications on a distributed architecture."
  :items="[
    { title: 'New to Azion? Start here', description: 'A guide to your first steps with Azion.', href: '/docs' },
    { title: 'Learning Center', description: 'Practical knowledge to speed up, secure, and scale applications.', href: '/learning' },
    { title: 'Build modern applications with Functions', description: 'Create serverless functions that run close to users.', href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/' },
    { title: 'SQL Database for modern applications', description: 'Build data-driven applications with SQL Database on a distributed architecture.', href: 'https://www.azion.com/en/documentation/products/store/edge-sql/' },
    { title: 'How Technology Can Help You Comply with Regulations for Fintech', description: 'Distributed infrastructure brings security, compliance, and monitoring together.', href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/' },
    { title: 'How Justa is evolving its technology to meet modern digital demands', description: 'See how Justa uses the Azion Web Platform in PIX and QR Code transactions.', href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/' }
  ]"
  :primary-action="{
    label: 'See all guides',
    href: 'https://www.azion.com/en/documentation/products/guides/',
    trailing: true,
    target: '_blank'
  }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ResourceGrid>} */
export const Scrollable = {
  render: () => ({ components: { ResourceGrid }, template: SCROLLABLE_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Six cards: past four, the grid scrolls inside a fading scroll area, so the band keeps the height of its copy.'
      },
      source: { code: toSfc(IMPORT, SCROLLABLE_TEMPLATE) }
    }
  }
}
