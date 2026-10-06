import ColumnNavigation from '@aziontech/webkit/column-navigation'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import ColumnNavigation from '@aziontech/webkit/column-navigation'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  ColumnNavigation,
  'ColumnNavigation.Column': ColumnNavigation.Column,
  'ColumnNavigation.Item': ColumnNavigation.Item,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const PLATFORM_PRIMITIVES = [
  {
    label: 'Compute',
    items: [
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run serverless code closer to users',
        href: '/products/functions'
      },
      {
        icon: 'pi pi-sitemap',
        title: 'Rules Engine',
        description: 'Automate request handling with programmable rules',
        href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Distribute traffic for performance and availability',
        href: 'https://www.azion.com/en/products/load-balancer/'
      },
      {
        icon: 'pi pi-image',
        title: 'Image Processor',
        description: 'Optimize and transform images in real time',
        href: 'https://www.azion.com/en/products/image-processor/'
      }
    ]
  },
  {
    label: 'AI',
    items: [
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run AI models closer to users',
        href: 'https://www.azion.com/en/products/ai-inference/'
      },
      {
        icon: 'ai ai-gateway',
        title: 'AI Gateway',
        description: 'Secure, manage, and optimize AI traffic',
        href: 'https://www.azion.com/en/solutions#ai'
      }
    ]
  },
  {
    label: 'Data',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Scalable, durable storage for unstructured data',
        href: 'https://www.azion.com/en/products/object-storage/'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Relational database built for distributed applications',
        href: 'https://www.azion.com/en/products/sql-database/'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Globally distributed, low-latency key-value store',
        href: 'https://www.azion.com/en/products/kv-store/'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Accelerate content delivery and reduce origin load',
        href: 'https://www.azion.com/en/products/cache/'
      }
    ]
  },
  {
    label: 'Security',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'Web Application Firewall',
        description: 'Protect human and AI applications from threats',
        href: 'https://www.azion.com/en/products/web-application-firewall/'
      },
      {
        icon: 'ai ai-azion-api',
        title: 'API Gateway',
        description: 'Secure, manage, and scale API traffic',
        href: 'https://www.azion.com/en/solutions/api-gateway/'
      },
      {
        icon: 'pi pi-android',
        title: 'Bot Management',
        description: 'Detect and stop automated threats instantly',
        href: 'https://www.azion.com/en/products/bot-manager/'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'DNS',
        description: 'Reliably host authoritative DNS zones worldwide',
        href: 'https://www.azion.com/en/products/edge-dns/'
      }
    ]
  }
]

const platformDirectory = ({ heading, marks, label, groups }) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    ${heading}
  </template>

  <FrameBox flush borders="y" marks="${marks}">
    <ColumnNavigation :columns="4" :mobile-columns="1" aria-label="${label}">
${each(
  groups,
  (group) => `<ColumnNavigation.Column title="${group.label}">
${each(
  group.items,
  (item) => `<ColumnNavigation.Item
  icon="${item.icon}"
  title="${item.title}"
  description="${item.description}"
  href="${item.href}"
/>`,
  1
)}
</ColumnNavigation.Column>`,
  3
)}
    </ColumnNavigation>
  </FrameBox>
</SectionModule>`)

const PRIMITIVES_TEMPLATE = platformDirectory({
  heading: '<SectionTitle title="Serverless AI-Native Primitives for Autonomous Workloads" />',
  marks: 'all',
  label: 'Platform primitives',
  groups: PLATFORM_PRIMITIVES
})

const meta = {
  title: 'Templates/Marketing/Content/PlatformDirectory',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The platform as a four-column directory of product links under a section title: each column is a product group (Compute, AI, Data, Security) and each row an icon, a product name and one line of what it does, linking to that product. Home opens its column with it right under the hero, and every solution page and Pricing carry the same band. The product pages (Cache, Application Accelerator, AI Inference, Workloads, Our Network) draw the same band with the sample app’s own NavColumn and NavItem; this template replaces those with the design-system components. Built from `SectionModule`, `SectionTitle`, `FrameBox` and `ColumnNavigation` (`ColumnNavigation.Column`, `ColumnNavigation.Item`).'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Primitives = {
  render: () => ({ components, template: PRIMITIVES_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Home’s band: a title with no eyebrow over the fourteen platform primitives, framed with corner marks on all four corners. Product pages the site hosts link by path (`/products/functions`); the rest go to azion.com.'
      },
      source: { code: toSfc(IMPORTS, PRIMITIVES_TEMPLATE) }
    }
  }
}
