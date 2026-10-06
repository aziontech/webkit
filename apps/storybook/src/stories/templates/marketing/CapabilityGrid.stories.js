import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Topic from '@aziontech/webkit/topic'"
]

const components = {
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  Topic
}

const RETAIL = [
  {
    icon: 'pi pi-bolt',
    title: 'Speed that converts',
    description:
      'Deliver fast storefront experiences with consistent page speed and Core Web Vitals, lifting conversion, SEO visibility, and average order value across web and mobile.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Built for peak season',
    description:
      'Stay online during Black Friday, Cyber Monday, and flash sales with automatic scaling and a distributed architecture that absorbs traffic surges without overprovisioning.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Security built in',
    description:
      'Protect transactions, customer data, and storefront availability with DDoS mitigation, WAF, and zero trust controls integrated into the same distributed architecture.'
  },
  {
    icon: 'pi pi-lock',
    title: 'Fraud and bots blocked',
    description:
      'Block bots, scraping, credential stuffing, account takeover, and payment fraud with bot management and application security applied before requests reach your origin.'
  },
  {
    icon: 'pi pi-sparkles',
    title: 'AI-powered personalization',
    description:
      'Deliver tailored recommendations, search, and content with AI Inference and Functions executed at request time, improving conversion without round-tripping to centralized origins.'
  },
  {
    icon: 'pi pi-credit-card',
    title: 'Lower costs at scale',
    description:
      'Offload origin traffic, optimize images, and serve cached responses from a distributed architecture to cut cloud, egress, and CDN costs while scaling automatically with demand.'
  }
]

const FINANCIAL = [
  {
    icon: 'pi pi-server',
    title: 'High availability',
    description:
      'Ensure operational continuity for latency-sensitive financial applications and APIs, with automatic scalability and real-time responses, even during transaction peaks.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Advanced security',
    description:
      'Protect financial data and transactions with multilayer security integrated into the application, mitigating API attacks, DDoS, and bots without increasing operational complexity.'
  },
  {
    icon: 'pi pi-check-circle',
    title: 'Continuous compliance',
    description:
      'Meet regulatory requirements with consistent security policies and continuous auditing across distributed environments, without compromising performance or development agility.'
  }
]

const capabilityGrid = (items) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <CardGrid flush kind="frame" :columns="3">
${each(
  items,
  (item) => `<CardGrid.Cell kind="canvas">
  <Topic
    :heading-level="2"
    icon="${item.icon}"
    title="${item.title}"
    description="${item.description}"
  />
</CardGrid.Cell>`,
  3
)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const SIX_TEMPLATE = capabilityGrid(RETAIL)
const THREE_TEMPLATE = capabilityGrid(FINANCIAL)

const meta = {
  title: 'Templates/Marketing/Content/CapabilityGrid',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The band that answers "what does this do for me" right under a solution page’s hero: three or six capabilities, each an icon, a title and one sentence, on a hairline frame grid. Every solution page opens its column with it (Retail, Web Apps, AI Workloads, Security, Performance, Streaming, Financial Services, Technology). Built from `SectionModule`, `FrameBox`, `CardGrid` and `Topic`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SixCapabilities = {
  render: () => ({ components, template: SIX_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Two rows of three, the Retail page’s set. Six is the count a page uses when it argues on breadth.'
      },
      source: { code: toSfc(IMPORTS, SIX_TEMPLATE) }
    }
  }
}

export const ThreeCapabilities = {
  render: () => ({ components, template: THREE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'One row of three, the Financial Services page’s set, for a page that argues on a few strong claims.'
      },
      source: { code: toSfc(IMPORTS, THREE_TEMPLATE) }
    }
  }
}
