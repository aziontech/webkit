import ClientMosaic from '@aziontech/webkit/sections/client-mosaic'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/client-mosaic'

const IMPORT = "import ClientMosaic from '@aziontech/webkit/sections/client-mosaic'"

/** @type {import('@storybook/vue3').Meta<typeof ClientMosaic>} */
const meta = {
  title: 'Components/Sections/ClientMosaic',
  component: ClientMosaic,
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
          "The client mosaic: a framed bento grid of customer cells where a story cell carries a photograph, the client's mark, one line of its result and a \"read the case study\" link, and a mark cell carries only the client's linked logo on a chosen fill. The layout is derived from the data: the first story spans two columns and two rows, every other story one column and two rows, every mark one cell. It is a page section — the site places it from a `{ _id: 'client-mosaic', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `bento-grid` and `mini-button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the grid.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    linkLabel: {
      control: 'text',
      description: 'Label of the link under every story.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    stories: {
      control: 'object',
      description:
        'The story cells, in order; each is `{ logo, logoAlt, photo, text, href, fill?, logoTreatment? }`. The first spans two columns and two rows, the rest one column and two rows.',
      table: {
        category: 'props',
        type: { summary: 'ClientMosaicStory[]' },
        defaultValue: { summary: '[]' }
      }
    },
    logos: {
      control: 'object',
      description:
        "The mark cells, in order; each is `{ logo, logoAlt, href, fill?, logoTreatment? }` where `fill` is `'canvas'`, `'surface'`, `'white'` or `'primary'` and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`.",
      table: {
        category: 'props',
        type: { summary: 'ClientMosaicLogo[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ClientMosaic },
  setup() {
    return { args }
  },
  template: '<ClientMosaic v-bind="args" />'
})

const DEFAULT_MARKUP = `<ClientMosaic
  aria-label="Client stories"
  link-label="Read the case study"
  :stories="[
    {
      logo: '/marketing-components/logos/netshoes-extended-color.svg',
      logoAlt: 'Netshoes',
      photo: '/marketing-components/photos/netshoes.jpg',
      text: 'Netshoes automatically blocks more than 4 million threats in six months',
      href: 'https://www.azion.com/en/success-case/netshoes/',
      fill: 'surface',
      logoTreatment: 'monochrome'
    },
    {
      logo: '/marketing-components/logos/gpa-extended-reversed.svg',
      logoAlt: 'GPA',
      photo: '/marketing-components/photos/gpa.jpg',
      text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
      href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/',
      fill: 'surface',
      logoTreatment: 'monochrome'
    }
  ]"
  :logos="[
    {
      logo: '/marketing-components/logos/dafiti-extended-mono.svg',
      logoAlt: 'Dafiti',
      href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
      fill: 'white',
      logoTreatment: 'knockout'
    },
    {
      logo: '/marketing-components/logos/agibank-extended-reversed.svg',
      logoAlt: 'Agibank',
      href: 'https://www.azion.com/en/success-case/agibank/',
      fill: 'canvas',
      logoTreatment: 'monochrome'
    },
    {
      logo: '/marketing-components/logos/renner-extended-reversed.svg',
      logoAlt: 'Renner',
      href: 'https://www.azion.com/en/success-case/renner/',
      fill: 'canvas',
      logoTreatment: 'monochrome'
    },
    {
      logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
      logoAlt: 'Fourbank',
      href: 'https://www.azion.com/en/success-case/fourbank/',
      fill: 'primary',
      logoTreatment: 'knockout'
    },
    {
      logo: '/marketing-components/logos/exame-extended-mono.svg',
      logoAlt: 'Exame',
      href: 'https://www.azion.com/en/success-case/exame/',
      fill: 'canvas',
      logoTreatment: 'monochrome'
    },
    {
      logo: '/marketing-components/logos/nzn-extended-reversed.svg',
      logoAlt: 'NZN',
      href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/',
      fill: 'primary',
      logoTreatment: 'knockout'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientMosaic>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the home page places it: two customer stories in the framed grid, the first one spanning two columns and two rows, followed by six client marks on mixed fills. Edit the props in the Controls panel — a band with no stories and no logos renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
