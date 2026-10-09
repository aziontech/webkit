import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import FieldText from '@aziontech/webkit/field-text'
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

const NEWSLETTER_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CallToAction from '@aziontech/webkit/call-to-action'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'"
]

const FRAME_IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'"
]

const components = {
  Button,
  CallToAction,
  FieldText,
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

const NEWSLETTER_TEMPLATE = closingColumn(`<SectionModule
  id="contact"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <CallToAction
    framed
    kind="split"
    eyebrow="Stay up to date"
    title="Subscribe to our Newsletter"
    description="Get the latest product updates, event highlights, and tech industry insights delivered to your inbox."
  >
    <template #actions>
      <div>
        <form
          novalidate
          class="flex w-full flex-col gap-(--spacing-sm) sm:w-(--container-md) sm:max-w-full sm:flex-row sm:items-start"
        >
          <FieldText
            label="Email"
            size="large"
            type="email"
            autocomplete="email"
            placeholder="Your e-mail"
            class="min-w-0 flex-1"
          />
          <Button label="Subscribe" kind="secondary" size="large" class="sm:mt-(--spacing-lg)" />
        </form>
      </div>
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

const FRAME_TEMPLATE = `<SectionContainer max-width="site">
  <FrameBox
    borders="none"
    marks="all"
    data-hatch="true"
    class="h-[calc(var(--spacing-xxl)*2)]"
  >
    <TextureMaterial kind="lines" />
  </FrameBox>
</SectionContainer>`

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
          'The close of every landing page: one last ask after a hatched gap, then a closing spacer that draws no rules of its own, because the site footer under it opens with a full-bleed rule. Almost every page ends with the split form, among them Home, Products, Pricing, Success Cases, the Vercel Alternative page and every solution page, and only its copy varies per page (Build / Build once. / Run everywhere. on Retail, Web Apps, AI Workloads, Financial Services, Technology and Success Cases; Secure / Protected by default. / Always on. on Security and the Vercel Alternative page; Performance / Fast everywhere. / Always reliable. on Performance; Ready to join us? on Careers). The Blog and every blog article end with the newsletter form in the split’s lead cell. Partners, Learning, Compliance and GDPR ask nothing at the end: their last band runs straight into the closing frame alone, with no hatched gap above it. Built from `SectionContainer`, `SectionGap`, `SectionModule`, `CallToAction`, `Button`, `FieldText` and `FrameBox`, with `TextureMaterial` ruling each closing frame.'
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
          'The single-action close: a panel `CallToAction` with one action, then the small closing frame, one `--spacing-xxl` tall: the same corner marks and lines texture as the split close, at the height of a small `SectionGap`. It draws no rules, because the footer under it opens with its own.'
      },
      source: { code: toSfc(IMPORTS, PANEL_TEMPLATE) }
    }
  }
}

export const Newsletter = {
  render: () => ({ components, template: NEWSLETTER_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Blog’s close, shared by every article: the split `CallToAction` with the subscribe form as its lead action, a `FieldText` for the address beside the `Subscribe` button, and the aside left to the supporting line. The form validates on submit and confirms with a toast; nothing is sent.'
      },
      source: { code: toSfc(NEWSLETTER_IMPORTS, NEWSLETTER_TEMPLATE) }
    }
  }
}

export const Frame = {
  render: () => ({ components, template: FRAME_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The close of a page that ends without an ask, as Partners, Learning, Compliance and GDPR do: no `CallToAction` and no hatched gap, only the double-height closing frame, set directly under the column’s last band. Its corner marks and lines texture match the split close’s frame, and it draws no rules, because the footer under it opens with its own.'
      },
      source: { code: toSfc(FRAME_IMPORTS, FRAME_TEMPLATE) }
    }
  }
}
