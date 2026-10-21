import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import MediaTabs from '@aziontech/webkit/media-tabs'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import {
  GATEWAY_REQUEST_PATH,
  LATENCY_ROUTING,
  MODEL_ROUTING,
  PROVIDER_FAILOVER,
  RESPONSE_CACHE
} from '../../../../../webkit-sample/src/site/data/diagrams.js'
import {
  PLATFORM_ARCHITECTURE_BAND,
  PLATFORM_ARCHITECTURE_DIAGRAMS
} from '../../../../../webkit-sample/src/site/data/product-architectures.js'
import DiagramSet from '../../../../../webkit-sample/src/site/ui/diagram/DiagramSet.vue'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'",
  "import DiagramSet from '@site/ui/diagram/DiagramSet.vue'",
  "import {\n  GATEWAY_REQUEST_PATH,\n  LATENCY_ROUTING,\n  MODEL_ROUTING,\n  PROVIDER_FAILOVER,\n  RESPONSE_CACHE\n} from '@site/data/diagrams.js'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  Button,
  FrameBox,
  DiagramSet,
  MediaTabs,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const DIAGRAMS = [
  {
    value: 'request-path',
    spec: GATEWAY_REQUEST_PATH,
    ariaLabel:
      'An AI app calls the gateway; Firewall filters the request, the AI Gateway function checks the key, and the call goes to a model on AI Inference, with third-party providers as the fallback'
  },
  {
    value: 'failover',
    spec: PROVIDER_FAILOVER,
    ariaLabel:
      'An AI app checks whether its provider is degraded; Claude Haiku 5.5 on Anthropic is degraded, so the call falls back to Claude Haiku 5.5 on Amazon Bedrock'
  },
  {
    value: 'costs',
    spec: MODEL_ROUTING,
    ariaLabel:
      'An AI app routes paid users to OpenAI GPT-5.5 with a fallback to Claude Opus 4.7, and everyone else to Kimi K2.6 or Gemma 4 depending on load'
  },
  {
    value: 'latency',
    spec: LATENCY_ROUTING,
    ariaLabel:
      'An AI app sends real-time tasks to Mistral 3 Small on AI Inference, under 30 ms, and other tasks to OpenAI GPT-5.5'
  },
  {
    value: 'cache',
    spec: RESPONSE_CACHE,
    ariaLabel:
      'An AI app checks for a cached response; a match is served from the Cache API with no tokens spent, and anything else goes to a model call'
  }
]

const DECLARATION = `const diagrams = [
  { value: 'request-path', spec: GATEWAY_REQUEST_PATH, ariaLabel: 'The path an AI request takes through the platform' },
  { value: 'failover', spec: PROVIDER_FAILOVER, ariaLabel: 'A call falling back to a second provider' },
  { value: 'costs', spec: MODEL_ROUTING, ariaLabel: 'Requests routed to models by cost' },
  { value: 'latency', spec: LATENCY_ROUTING, ariaLabel: 'A real-time task answered close to the user' },
  { value: 'cache', spec: RESPONSE_CACHE, ariaLabel: 'A cached response returned without a model call' }
]`

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
          label="Read the docs"
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
        <DiagramSet
          :diagrams="diagrams"
          :tab="diagrams[index]?.value"
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
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: () => ({ diagrams: DIAGRAMS }), template: TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc([...IMPORTS, '', DECLARATION], TEMPLATE) }
    }
  }
}

const PLATFORM_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'",
  "import DiagramSet from '@site/ui/diagram/DiagramSet.vue'",
  "import { PLATFORM_ARCHITECTURE_DIAGRAMS } from '@site/data/product-architectures.js'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const PLATFORM_DECLARATION = 'const diagrams = PLATFORM_ARCHITECTURE_DIAGRAMS'

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
        <DiagramSet
          :diagrams="diagrams"
          :tab="diagrams[index]?.value"
          class="w-full"
        />
      </template>
    </MediaTabs>
  </FrameBox>
</SectionModule>`)

export const Platform = {
  render: () => ({
    components,
    setup: () => ({ diagrams: PLATFORM_ARCHITECTURE_DIAGRAMS }),
    template: PLATFORM_TEMPLATE
  }),
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
    action: { label: 'Read the docs', href: '/product-preview', trailing: true }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

const { scene: _scene, section: _section, ...PLATFORM_PROPS } = PLATFORM_ARCHITECTURE_BAND

export const PLATFORM_SITE_SECTION = { _id: 'architecture-tabs', props: PLATFORM_PROPS }

export const PlatformJson = {
  tags: ['!dev'],
  ...siteJsonStory(PLATFORM_SITE_SECTION)
}
