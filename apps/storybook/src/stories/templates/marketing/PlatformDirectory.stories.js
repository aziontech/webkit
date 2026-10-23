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
    label: 'Build',
    items: [
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run code globally with no cold starts',
        href: '/products/functions'
      },
      {
        icon: 'pi pi-sitemap',
        title: 'Rules Engine',
        description: 'Automate request handling with rules',
        href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
      },
      {
        icon: 'pi pi-image',
        title: 'Image Processor',
        description: 'Resize and convert images on demand',
        href: 'https://www.azion.com/en/products/image-processor/'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Speed up content delivery and reduce origin load',
        href: 'https://www.azion.com/en/products/cache/'
      },
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run models close to the user',
        href: 'https://www.azion.com/en/products/ai-inference/'
      },
      {
        icon: 'ai ai-gateway',
        title: 'AI Gateway',
        description: 'Route, secure and log every model call',
        href: 'https://www.azion.com/en/solutions#ai'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and serve objects close to users',
        href: 'https://www.azion.com/en/products/object-storage/'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Run SQL on a distributed database',
        href: 'https://www.azion.com/en/products/sql-database/'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Store key-value data with low latency',
        href: 'https://www.azion.com/en/products/kv-store/'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'WAF',
        description: 'Block common attacks close to traffic',
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
        title: 'Bot Manager',
        description: 'Detect and stop automated traffic',
        href: 'https://www.azion.com/en/products/bot-manager/'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'Edge DNS',
        description: 'Authoritative DNS, distributed globally',
        href: 'https://www.azion.com/en/products/edge-dns/'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Spread traffic across origins for availability',
        href: 'https://www.azion.com/en/products/load-balancer/'
      }
    ]
  },
  {
    label: 'Observe',
    items: [
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Real-Time Metrics',
        description: 'Watch traffic, errors and latency as they happen',
        href: 'https://www.azion.com/en/products/real-time-metrics/'
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
  heading: '<SectionTitle title="Everything you need to build and run applications" />',
  marks: 'all',
  label: 'Azion products',
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
    title: 'Everything you need to build and run applications',
    ariaLabel: 'Azion products',
    groups: [
      {
        title: 'Build',
        items: [
          {
            icon: 'ai ai-edge-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: 'https://www.azion.com/en/products/functions/'
          },
          {
            icon: 'pi pi-sitemap',
            title: 'Rules Engine',
            description: 'Automate request handling with rules',
            href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
          },
          {
            icon: 'pi pi-microchip-ai',
            title: 'AI Inference',
            description: 'Run models close to the user',
            href: 'https://www.azion.com/en/products/ai-inference/'
          },
          {
            icon: 'pi pi-sitemap',
            title: 'AI Gateway',
            description: 'Route, secure and log every model call',
            href: 'https://www.azion.com/en/solutions#ai'
          }
        ]
      },
      {
        title: 'Store',
        items: [
          {
            icon: 'ai ai-edge-storage',
            title: 'Object Storage',
            description: 'Store and serve objects close to users',
            href: 'https://www.azion.com/en/products/object-storage/'
          },
          {
            icon: 'ai ai-edge-sql',
            title: 'SQL Database',
            description: 'Run SQL on a distributed database',
            href: 'https://www.azion.com/en/products/sql-database/'
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
          },
          {
            icon: 'pi pi-sitemap',
            title: 'API Gateway',
            description: 'Secure, manage, and scale API traffic',
            href: 'https://www.azion.com/en/solutions/api-gateway/'
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
    ]
  }
}

export const PrimitivesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
