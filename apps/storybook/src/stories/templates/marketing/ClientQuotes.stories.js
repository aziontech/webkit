import herosparkExtendedColor from '@aziontech/webkit/assets/herospark-extended-color.svg'
import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'
import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import QuoteTabs from '@aziontech/webkit/quote-tabs'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import herosparkExtendedColor from '@aziontech/webkit/assets/herospark-extended-color.svg'",
  "import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'",
  "import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'",
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import QuoteTabs from '@aziontech/webkit/quote-tabs'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  Button,
  FrameBox,
  QuoteTabs,
  SectionContainer,
  SectionGap,
  SectionModule
}

const setup = () => ({ herosparkExtendedColor, magaluExtendedColor, zoopExtendedColor })

const RETAIL_QUOTES = [
  {
    mark: 'dafiti',
    clientName: 'Dafiti',
    text: "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers.",
    name: 'Julian H',
    jobTitle: 'IT OPS, SRE & SEC Manager at Dafiti Group'
  },
  {
    mark: 'axur',
    text: 'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO at Axur'
  },
  {
    logo: 'magaluExtendedColor',
    clientName: 'Magalu',
    text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology at Magalu'
  },
  {
    logo: 'herosparkExtendedColor',
    clientName: 'HeroSpark',
    text: 'Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development.',
    name: 'Mateus Leonardi',
    jobTitle: 'CTO at HeroSpark'
  },
  {
    logo: 'zoopExtendedColor',
    clientName: 'Zoop',
    text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
    name: 'Ismael Aguilar',
    jobTitle: 'Information Security Manager at Zoop'
  },
  {
    mark: 'contabilizei',
    text: 'With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.',
    name: 'Fabrício Santos',
    jobTitle: 'DevSecOps Manager at Contabilizei'
  }
]

const quoted = (value) => `'${value.replace(/'/g, "\\'").replace(/"/g, '&quot;')}'`

const FIELDS = ['logo', 'mark', 'clientName', 'text', 'name', 'jobTitle']

const quoteLiteral = (quote, index, list) => {
  const fields = FIELDS.filter((key) => quote[key]).map((key) =>
    key === 'logo' ? `  logo: ${quote.logo}` : `  ${key}: ${quoted(quote[key])}`
  )
  return ['{', fields.join(',\n'), `}${index < list.length - 1 ? ',' : ''}`].join('\n')
}

const clientQuotes = (quotes) =>
  inColumn(`<SectionModule
  :divided="false"
  :padded="false"
>
  <FrameBox
    flush
    borders="y"
    marks="all"
  >
    <QuoteTabs
      aria-label="Client stories"
      :items="[
${each(quotes, (quote, index) => quoteLiteral(quote, index, quotes), 4)}
      ]"
    >
      <template #actions>
        <Button
          label="See success stories"
          kind="secondary"
          size="large"
          href="/success-cases"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </QuoteTabs>
  </FrameBox>
</SectionModule>`)

const RETAIL_TEMPLATE = clientQuotes(RETAIL_QUOTES)

const meta = {
  title: 'Templates/Marketing/Social Proof/ClientQuotes',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup, template: RETAIL_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, RETAIL_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'client-quotes',
  props: {
    ariaLabel: 'Client stories',
    items: [
      {
        mark: 'dafiti',
        clientName: 'Dafiti',
        text: "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers.",
        name: 'Julian H',
        jobTitle: 'IT OPS, SRE & SEC Manager at Dafiti Group'
      },
      {
        mark: 'axur',
        text: 'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.',
        name: 'Fabio Ramos',
        jobTitle: 'CEO at Axur'
      },
      {
        logo: '/marketing-components/logos/magalu-extended-color.svg',
        clientName: 'Magalu',
        text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America.',
        name: 'Allan Monteiro',
        jobTitle: 'CISO & Head of Technology at Magalu'
      }
    ],
    action: {
      label: 'See success stories',
      href: '/success-cases'
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
