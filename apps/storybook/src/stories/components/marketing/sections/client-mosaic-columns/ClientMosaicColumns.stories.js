import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'

import { withStoryAssets } from '../../../../_shared/site-assets'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/client-mosaic-columns'

const IMPORT = "import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'"

/** @type {import('@storybook/vue3').Meta<typeof ClientMosaicColumns>} */
const meta = {
  title: 'Components/Marketing/Sections/ClientMosaicColumns',
  component: ClientMosaicColumns,
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
          "Three featured success stories side by side: each column is a client mark on a face painted in the client brand colour, over a one-line story that links to the case. It is a page section — the site places it from a `{ _id: 'client-mosaic-columns', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box` and `logo-wall`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the list of stories.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    linkLabel: {
      control: 'text',
      description: 'Label the mark face reveals on hover and the link accessible name.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    cells: {
      control: 'object',
      description:
        "The stories, in order; each is `{ name, logo, href, story, brand, logoTreatment? }` where `brand` is `{ base, glow, ink? }` (CSS colours painting the face, `ink` `'dark'` or `'light'`) and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`.",
      table: {
        category: 'props',
        type: { summary: 'ClientMosaicColumnsCell[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: withStoryAssets(SITE_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { ClientMosaicColumns },
  setup() {
    return { args }
  },
  template: '<ClientMosaicColumns v-bind="args" />'
})

const DEFAULT_MARKUP = `<ClientMosaicColumns
  aria-label="Featured success stories"
  link-label="Read story"
  :cells="[
    {
      name: 'Magalu',
      logo: '/marketing-components/logos/magalu-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/magalu/',
      story: 'Explore how Magalu enhances cybersecurity with Azion\\'s Firewall and WAF, improving threat intelligence and bot management in retail.',
      brand: { base: '#0e89ff', glow: '#0e89ff' },
      logoTreatment: 'monochrome'
    },
    {
      name: 'Dafiti',
      logo: '/marketing-components/logos/dafiti-extended-reversed.svg',
      href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
      story: 'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
      brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' },
      logoTreatment: 'knockout'
    },
    {
      name: 'MadeiraMadeira',
      logo: '/marketing-components/logos/madeiramadeira-extended-reversed.svg',
      href: 'https://www.azion.com/en/success-case/madeiramadeira/',
      story: 'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
      brand: { base: '#ff9014', glow: '#ff9014' },
      logoTreatment: 'monochrome'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientMosaicColumns>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Three success stories in equal columns, each mark on its client brand colour with the story line beneath. Hover a column to reveal its link line; edit the cells in the Controls panel — a band with no cells renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
