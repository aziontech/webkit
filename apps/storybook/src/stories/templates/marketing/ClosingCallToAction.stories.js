import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { COLUMN_IMPORTS, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CallToAction from '@aziontech/webkit/call-to-action'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'"
]

const components = {
  Button,
  CallToAction,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  TextureMaterial
}

const closingColumn = (markup) =>
  `<SectionContainer max-width="site">\n  <SectionGap hatch />\n\n${indent(markup)}\n</SectionContainer>`

const SPLIT_TEMPLATE = closingColumn(`<SectionModule
  id="contact"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <CallToAction
    framed
    kind="split"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
  >
    <template #actions>
      <Button label="Start Free" kind="secondary" size="large" href="/signup" />
    </template>
    <template #aside>
      <Button
        label="Talk to our team"
        kind="outlined"
        size="large"
        href="#"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </CallToAction>
</SectionModule>
<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-[calc(var(--spacing-xxl)*2)]"
>
  <TextureMaterial kind="lines" />
</FrameBox>`)

const PANEL_TEMPLATE = closingColumn(`<SectionModule :divided="false" :padded="false">
  <CallToAction
    framed
    title="Ready to join us?"
    description="Explore our open positions and find the right fit for you."
  >
    <template #actions>
      <Button
        label="See all available jobs"
        kind="secondary"
        size="large"
        href="/careers/jobs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </CallToAction>
</SectionModule>

<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-(--spacing-xxl)"
>
  <TextureMaterial kind="lines" />
</FrameBox>`)

const meta = {
  title: 'Templates/Marketing/Content/ClosingCallToAction',
  excludeStories: ['SPLIT_SECTION', 'PANEL_SECTION'],
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

export const Split = {
  render: () => ({ components, template: SPLIT_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, SPLIT_TEMPLATE) }
    }
  }
}

export const SPLIT_SECTION = {
  _id: 'closing-call-to-action-split',
  props: {
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
    primaryAction: {
      label: 'Start Free',
      href: 'https://console.azion.com/signup?tck=build_cta'
    },
    asideAction: {
      label: 'Talk to our team',
      href: 'https://www.azion.com/en/contact/'
    }
  }
}

export const SplitJson = {
  tags: ['!dev'],
  ...siteJsonStory(SPLIT_SECTION)
}

export const Panel = {
  render: () => ({ components, template: PANEL_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, PANEL_TEMPLATE) }
    }
  }
}

export const PANEL_SECTION = {
  _id: 'closing-call-to-action-panel',
  props: {
    title: 'Ready to join us?',
    description: 'Explore our open positions and find the right fit for you.',
    action: {
      label: 'See all available jobs',
      href: '/en/careers/jobs/'
    }
  }
}

export const PanelJson = {
  tags: ['!dev'],
  ...siteJsonStory(PANEL_SECTION)
}
