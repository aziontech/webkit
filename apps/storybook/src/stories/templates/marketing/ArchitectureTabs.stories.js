import Button from '@aziontech/webkit/button'
import Diagram from '@aziontech/webkit/diagram'
import FrameBox from '@aziontech/webkit/frame-box'
import MediaTabs from '@aziontech/webkit/media-tabs'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Diagram from '@aziontech/webkit/diagram'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  Button,
  Diagram,
  FrameBox,
  MediaTabs,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const DIAGRAMS = [
  { value: 'request-path', name: 'ai-gateway' },
  { value: 'failover', name: 'ai-gateway-provider-failover' },
  { value: 'costs', name: 'ai-gateway-model-routing' },
  { value: 'latency', name: 'ai-gateway-latency-routing' },
  { value: 'cache', name: 'ai-gateway-response-cache' }
]

const declaration = (diagrams) =>
  `const diagrams = [\n${diagrams.map(({ value, name }) => `  { value: '${value}', name: '${name}' }`).join(',\n')}\n]`

const DECLARATION = declaration(DIAGRAMS)

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="horizontal"
      padding="small"
      eyebrow="Routing"
      title="Every AI request through one control point"
      description="Every client calls one endpoint. Firewall stops abuse, then a function checks the key, routes the call, and logs it."
    >
      <template #actions>
        <Button
          label="Docs"
          kind="secondary"
          size="large"
          href="/product-preview"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </SectionTitle>
  </template>

  <FrameBox flush borders="top" marks="none">
    <MediaTabs
      position="bottom"
      size="small"
      :items="[
        {
          title: 'Request path',
          description:
            'A call crosses Firewall, the application and the function before it reaches a model.'
        },
        {
          title: 'Provider failover',
          description:
            'When a provider degrades, the gateway moves to the next model on the alias.'
        },
        {
          title: 'Cost routing',
          description:
            'Premium tokens go only where they pay off; everyone else gets a lighter model.'
        },
        {
          title: 'Latency routing',
          description:
            'Real-time tasks run on AI Inference, close to the user, in under 30 ms.'
        },
        {
          title: 'Response cache',
          description:
            'A repeated prompt is answered from cache, with no model call and no tokens spent.'
        }
      ]"
      :auto-play-interval="6000"
      class="[--media-tabs-media-bg:var(--bg-surface)] [--media-tabs-media-min-lg:28rem] [--media-tabs-media-min:24rem]"
    >
      <template #media="{ index }">
        <Diagram
          :key="diagrams[index].value"
          :name="diagrams[index].name"
          class="w-full"
        />
      </template>
    </MediaTabs>

  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Solutions/ArchitectureTabs',
  excludeStories: ['SITE_SECTION', 'PLATFORM_SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  ...editable(() => ({ components, setup: () => ({ diagrams: DIAGRAMS }), template: TEMPLATE }), {
    diagrams: DIAGRAMS
  }),
  parameters: {
    docs: {
      source: { code: toSfc([...IMPORTS, '', DECLARATION], TEMPLATE) }
    }
  }
}

const PLATFORM_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Diagram from '@aziontech/webkit/diagram'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const PLATFORM_TABS = [
  {
    value: 'request-path',
    title: 'Request path',
    description:
      'Routing sends the request to the nearest data center, where the workload answers from cache or the origin.',
    name: 'workloads'
  },
  {
    value: 'security',
    title: 'Security first',
    description: 'Network lists, the WAF and rate limits run in order before any application code.',
    name: 'firewall'
  },
  {
    value: 'compute',
    title: 'Code at the edge',
    description: 'A rule runs a function on the routes that need logic, with no cold start.',
    name: 'functions'
  },
  {
    value: 'data',
    title: 'Data close by',
    description: 'Reads come from the nearest replica; writes are applied once on the primary.',
    name: 'sql-database'
  },
  {
    value: 'observe',
    title: 'Every request seen',
    description:
      'Each request becomes a queryable event within seconds, in the Console or over GraphQL.',
    name: 'real-time-events'
  }
]

const PLATFORM_DIAGRAMS = PLATFORM_TABS.map(({ value, name }) => ({ value, name }))

const PLATFORM_DECLARATION = declaration(PLATFORM_DIAGRAMS)

const PLATFORM_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="horizontal"
      padding="small"
      eyebrow="Platform"
      title="One request through the Azion platform"
      description="The base architecture every product plugs into: a workload answers near the user, Firewall filters first, a function runs where logic is needed, data sits in the same data center, and every request is seen."
    >
      <template #actions>
        <Button
          label="See every product"
          kind="secondary"
          size="large"
          href="/site/products"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </SectionTitle>
  </template>

  <FrameBox flush borders="top" marks="none">
    <MediaTabs
      position="bottom"
      size="small"
      :items="[
        {
          title: 'Request path',
          description:
            'Routing sends the request to the nearest data center, where the workload answers from cache or the origin.'
        },
        {
          title: 'Security first',
          description:
            'Network lists, the WAF and rate limits run in order before any application code.'
        },
        {
          title: 'Code at the edge',
          description:
            'A rule runs a function on the routes that need logic, with no cold start.'
        },
        {
          title: 'Data close by',
          description:
            'Reads come from the nearest replica; writes are applied once on the primary.'
        },
        {
          title: 'Every request seen',
          description:
            'Each request becomes a queryable event within seconds, in the Console or over GraphQL.'
        }
      ]"
      :auto-play-interval="6000"
      class="[--media-tabs-media-bg:var(--bg-surface)] [--media-tabs-media-min-lg:28rem] [--media-tabs-media-min:24rem]"
    >
      <template #media="{ index }">
        <Diagram
          :key="diagrams[index].value"
          :name="diagrams[index].name"
          class="w-full"
        />
      </template>
    </MediaTabs>
  </FrameBox>
</SectionModule>`)

export const Platform = {
  ...editable(
    () => ({
      components,
      setup: () => ({ diagrams: PLATFORM_DIAGRAMS }),
      template: PLATFORM_TEMPLATE
    }),
    { diagrams: PLATFORM_DIAGRAMS }
  ),
  parameters: {
    docs: {
      source: { code: toSfc([...PLATFORM_IMPORTS, '', PLATFORM_DECLARATION], PLATFORM_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'architecture-tabs',
  props: {
    eyebrow: 'Routing',
    title: 'Every AI request through one control point',
    description:
      'Every client calls one endpoint. Firewall stops abuse, then a function checks the key, routes the call, and logs it.',
    position: 'bottom',
    tabs: [
      {
        value: 'request-path',
        title: 'Request path',
        description:
          'A call crosses Firewall, the application and the function before it reaches a model.'
      },
      {
        value: 'failover',
        title: 'Provider failover',
        description: 'When a provider degrades, the gateway moves to the next model on the alias.'
      },
      {
        value: 'costs',
        title: 'Cost routing',
        description:
          'Premium tokens go only where they pay off; everyone else gets a lighter model.'
      },
      {
        value: 'latency',
        title: 'Latency routing',
        description: 'Real-time tasks run on AI Inference, close to the user, in under 30 ms.'
      },
      {
        value: 'cache',
        title: 'Response cache',
        description:
          'A repeated prompt is answered from cache, with no model call and no tokens spent.'
      }
    ],
    action: { label: 'Docs', href: '/product-preview', trailing: true }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const PLATFORM_SITE_SECTION = {
  _id: 'architecture-tabs',
  props: {
    anchor: 'platform-architecture',
    eyebrow: 'Platform',
    title: 'One request through the Azion platform',
    description:
      'The base architecture every product plugs into: a workload answers near the user, Firewall filters first, a function runs where logic is needed, data sits in the same data center, and every request is seen.',
    position: 'bottom',
    tabs: PLATFORM_TABS.map(({ value, title, description }) => ({
      value,
      title,
      description
    })),
    action: { label: 'See every product', href: '/site/products', trailing: true }
  }
}

export const PlatformJson = {
  tags: ['!dev'],
  ...siteJsonStory(PLATFORM_SITE_SECTION)
}
