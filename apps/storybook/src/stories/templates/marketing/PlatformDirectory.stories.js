import ColumnNavigation from '@aziontech/webkit/column-navigation'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
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

export const Primitives = {
  render: () => ({ components, template: PRIMITIVES_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, PRIMITIVES_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'platform-directory',
  props: {
    title: 'Serverless AI-Native Primitives for Autonomous Workloads',
    ariaLabel: 'Platform primitives',
    groups: [
      {
        title: 'Compute',
        items: [
          {
            icon: 'ai ai-edge-functions',
            title: 'Functions',
            description: 'Run serverless code closer to users',
            href: 'https://www.azion.com/en/products/functions/'
          },
          {
            icon: 'pi pi-sitemap',
            title: 'Rules Engine',
            description: 'Automate request handling with programmable rules',
            href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
          }
        ]
      },
      {
        title: 'AI',
        items: [
          {
            icon: 'pi pi-microchip-ai',
            title: 'AI Inference',
            description: 'Run AI models closer to users',
            href: 'https://www.azion.com/en/products/ai-inference/'
          },
          {
            icon: 'pi pi-sitemap',
            title: 'AI Gateway',
            description: 'Secure, manage, and optimize AI traffic',
            href: 'https://www.azion.com/en/solutions#ai'
          }
        ]
      },
      {
        title: 'Data',
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
          }
        ]
      },
      {
        title: 'Security',
        items: [
          {
            icon: 'ai ai-waf-rules',
            title: 'Web Application Firewall',
            description: 'Protect human and AI applications from threats',
            href: 'https://www.azion.com/en/products/web-application-firewall/'
          },
          {
            icon: 'pi pi-sitemap',
            title: 'API Gateway',
            description: 'Secure, manage, and scale API traffic',
            href: 'https://www.azion.com/en/solutions/api-gateway/'
          }
        ]
      }
    ]
  }
}

export const PrimitivesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
