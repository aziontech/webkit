import FrameBox from '@aziontech/webkit/frame-box'
import Illustration from '@aziontech/webkit/illustration'
import MediaTabs from '@aziontech/webkit/media-tabs'
import MiniButton from '@aziontech/webkit/mini-button'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'",
  "import MiniButton from '@aziontech/webkit/mini-button'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  FrameBox,
  Illustration,
  MediaTabs,
  MiniButton,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="left"
      eyebrow="Observability"
      title="Inspect every run end-to-end"
      description="Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it."
    />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <MediaTabs
      :items="[
        {
          title: 'Trace',
          description:
            'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.'
        },
        {
          title: 'Logs',
          description:
            'Structured output on the same clock as the trace, filtered by level, searchable in place.'
        },
        {
          title: 'Request path',
          description:
            'The workload, application, function and connector it travelled, each captioned with the time spent there.'
        }
      ]"
      size="small"
      :auto-play-interval="5200"
      class="[--media-tabs-media-min:24rem]"
    >
      <template #media="{ index }">
        <Illustration
          v-if="index === 0"
          name="live-debugging"
          class="size-full"
        />
        <Illustration
          v-else-if="index === 1"
          name="stay-in-control"
          class="size-full"
        />
        <Illustration
          v-else
          name="distributed-apis"
          class="size-full"
        />
      </template>
    </MediaTabs>

    <div class="p-(--spacing-xl)">
      <MiniButton
        label="Open an invocation"
        show-icon
        icon="pi pi-angle-right"
        href="/product-preview"
      />
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Solutions/FeatureTabs',
  excludeStories: ['SITE_SECTION'],
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
  ...editable(() => ({ components, template: TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'feature-tabs',
  props: {
    eyebrow: 'Observability',
    title: 'Inspect every run end-to-end',
    description:
      'Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it.',
    tabs: [
      {
        title: 'Trace',
        description:
          'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.',
        illustration: 'live-debugging',
        illustrationLabel: 'A trace waterfall of one invocation'
      },
      {
        title: 'Logs',
        description:
          'Structured output on the same clock as the trace, filtered by level, searchable in place.',
        illustration: 'stay-in-control',
        illustrationLabel: 'Structured logs filtered by level'
      },
      {
        title: 'Request path',
        description:
          'The workload, application, function and connector it travelled, each captioned with the time spent there.',
        illustration: 'distributed-apis',
        illustrationLabel: 'The path a request took through the platform'
      }
    ],
    link: { label: 'Open an invocation', href: '/product-preview' }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
