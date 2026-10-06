import FrameBox from '@aziontech/webkit/frame-box'
import Illustration from '@aziontech/webkit/illustration'
import MediaTabs from '@aziontech/webkit/media-tabs'
import MiniButton from '@aziontech/webkit/mini-button'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
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
  title: 'Templates/Marketing/Media/FeatureTabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A band that walks through the features behind one claim, one at a time: a stack of up to three tabs on one side, the active tab’s media on the other, advancing on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion. The Functions page uses it for its Observability section, with a `MiniButton` into the console under the frame. Built from `SectionModule`, `SectionTitle`, `FrameBox`, `MediaTabs` and `MiniButton`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Functions page’s Observability band: the Trace, Logs and Request path tabs, each held for 5.2 seconds. The sample site draws each tab’s media with its own animated console scene, which is not a webkit component; here the `#media` slot shows one `Illustration` scene per tab instead, picked by the slot’s `index`.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
