import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { COLUMN_IMPORTS, indent } from '../../_shared/markup'
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
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The close of every landing page: one last ask after a hatched gap, then a closing spacer that draws no rules of its own, because the site footer under it opens with a full-bleed rule. Almost every page ends with the split form, among them Home, Products, Pricing, Success Cases, the Vercel Alternative page and every solution page, and only its copy varies per page (Build / Build once. / Run everywhere. on Retail, Web Apps, AI Workloads, Financial Services, Technology and Success Cases; Secure / Protected by default. / Always on. on Security and the Vercel Alternative page; Performance / Fast everywhere. / Always reliable. on Performance). Careers ends with the single-action panel and a closing frame half that height. Built from `SectionContainer`, `SectionGap`, `SectionModule`, `CallToAction`, `Button` and `FrameBox`, with `TextureMaterial` ruling each closing frame.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Split = {
  render: () => ({ components, template: SPLIT_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The solution pages’ close: a split `CallToAction` with `Start Free` in the lead cell and `Talk to our team` in the aside, then a double-height closing frame with its corner marks and the lines texture. The module’s `id="contact"` is the anchor the page’s other contact links scroll to.'
      },
      source: { code: toSfc(IMPORTS, SPLIT_TEMPLATE) }
    }
  }
}

export const Panel = {
  render: () => ({ components, template: PANEL_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Careers page’s close: a panel `CallToAction` with a single action to the job listing, then the small closing frame, one `--spacing-xxl` tall: the same corner marks and lines texture as the split close, at the height of a small `SectionGap`. It draws no rules, because the footer under it opens with its own.'
      },
      source: { code: toSfc(IMPORTS, PANEL_TEMPLATE) }
    }
  }
}
