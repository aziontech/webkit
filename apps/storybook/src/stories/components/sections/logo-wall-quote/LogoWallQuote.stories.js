import LogoWallQuote from '@aziontech/webkit/sections/logo-wall-quote'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/logo-wall-quote'

const IMPORT = "import LogoWallQuote from '@aziontech/webkit/sections/logo-wall-quote'"

/** @type {import('@storybook/vue3').Meta<typeof LogoWallQuote>} */
const meta = {
  title: 'Components/Sections/LogoWallQuote',
  component: LogoWallQuote,
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
          "The customers band: a section title over a framed logo wall of linked client marks with one signed quote in its aside, closed by a call to action. It is a page section — the site places it from a `{ _id: 'logo-wall-quote', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `logo-wall`, `quote` and `button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the logo wall.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    logos: {
      control: 'object',
      description:
        "The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, href? }` where `logoTreatment` is `'as-is'`, `'monochrome'` or `'invert-light'`.",
      table: {
        category: 'props',
        type: { summary: 'LogoWallQuoteLogo[]' },
        defaultValue: { summary: '[]' }
      }
    },
    quote: {
      control: 'object',
      description:
        "The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt }`. Omitted when absent.",
      table: {
        category: 'props',
        type: { summary: 'LogoWallQuoteQuote' },
        defaultValue: { summary: 'undefined' }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'LogoWallQuoteAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { LogoWallQuote },
  setup() {
    return { args }
  },
  template: '<LogoWallQuote v-bind="args" />'
})

const DEFAULT_MARKUP = `<LogoWallQuote
  eyebrow="Customers"
  title="Trusted by the world's largest banks and e-commerce companies"
  aria-label="Banks and e-commerce companies running on Azion"
  :logos="[
    {
      name: 'Magalu',
      logo: '/marketing-components/logos/magalu-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/magalu/'
    },
    {
      name: 'Banco de la Nación',
      logo: '/marketing-components/logos/banco-de-la-nacion-extended-mono.svg',
      logoTreatment: 'monochrome',
      href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/'
    },
    {
      name: 'Netshoes',
      logo: '/marketing-components/logos/netshoes-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/netshoes/'
    },
    {
      name: 'Agibank',
      logo: '/marketing-components/logos/agibank-extended-reversed.svg',
      logoLight: '/marketing-components/logos/agibank-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    {
      name: 'Zoop',
      logo: '/marketing-components/logos/zoop-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
    },
    {
      name: 'Crefisa',
      logo: '/marketing-components/logos/crefisa-extended-reversed.svg',
      logoTreatment: 'invert-light',
      href: 'https://www.azion.com/en/success-case/crefisa/'
    },
    {
      name: 'Renner',
      logo: '/marketing-components/logos/renner-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/renner/'
    },
    {
      name: 'Fourbank',
      logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
      logoTreatment: 'invert-light',
      href: 'https://www.azion.com/en/success-case/fourbank/'
    },
    {
      name: 'Marisa',
      logo: '/marketing-components/logos/marisa-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/marisa/'
    }
  ]"
  :quote="{
    text: '&quot;Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.&quot;',
    name: 'Ismael Aguilar',
    jobTitle: 'Information Security Manager at Zoop',
    logo: '/marketing-components/logos/zoop-extended-color.svg',
    logoAlt: 'Zoop'
  }"
  :primary-action="{
    label: 'Read the case study',
    href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/',
    trailing: true,
    target: '_blank'
  }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWallQuote>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the customers page places it: the overline and headline over a nine-mark logo wall, with one signed quote from Zoop in the aside and a link out to its case study. Edit the props in the Controls panel — a band with no logos and no quote renders only its title.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
