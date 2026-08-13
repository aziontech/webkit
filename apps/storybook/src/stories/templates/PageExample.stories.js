import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import HeroTitle from '@aziontech/webkit/hero-title'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionTitle from '@aziontech/webkit/section-title'

import { toSfc } from '../_shared/story-source'

// Every component the page renders, so the "Show code" SFC runs standalone.
const IMPORT = [
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import HeroTitle from '@aziontech/webkit/hero-title'",
  "import SectionGap from '@aziontech/webkit/section-gap'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const pageComponents = { Button, FrameBox, HeroTitle, SectionGap, SectionTitle }

/** @type {import('@storybook/vue3').Meta<typeof FrameBox>} */
const meta = {
  title: 'Templates/PageExample',
  component: FrameBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'heading-order', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'A full marketing page assembled from the framed layout set: a `FrameBox` hero band with a `HeroTitle`, `SectionGap` frames sized per break, `SectionTitle` headers in two of their three layouts (`horizontal` then `centered`), and a divider grid whose cells are borderless `FrameBox`es. The page has no margins — every rule you see belongs to a frame, `flush` collapses each junction to a single hairline, and the gaps are the only vertical rhythm.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const PAGE_TEMPLATE = `<div class="bg-(--bg-canvas)">
  <FrameBox
    borders="y"
    class="px-(--spacing-xl) py-(--spacing-xxl)"
  >
    <HeroTitle
      eyebrow="Edge platform"
      highlight="Build anything."
      title="Run it everywhere."
      description="Ship applications, security and observability from one platform — no servers to place, no regions to pick."
    >
      <template #actions>
        <Button label="Start for free" />
        <Button kind="outlined" label="Talk to sales" />
      </template>
    </HeroTitle>
  </FrameBox>

  <SectionGap hatch size="large" />

  <SectionTitle
    kind="horizontal"
    eyebrow="Platform"
    title="Everything runs at the edge"
    description="One runtime, one policy surface, one place to look when something breaks — and the same three primitives behind every workload you ship."
  />

  <div class="grid gap-px bg-(--border-default) sm:grid-cols-3">
    <FrameBox borders="none" class="bg-(--bg-canvas)">
      <div class="flex h-full flex-col gap-(--spacing-xs) p-(--spacing-xl)">
        <h3 class="m-0 text-heading-sm text-(--text-default)">Applications</h3>
        <p class="m-0 text-body-md text-(--text-muted)">Deploy code that runs close to the request, with no cold start to design around.</p>
      </div>
    </FrameBox>
    <FrameBox borders="none" class="bg-(--bg-canvas)">
      <div class="flex h-full flex-col gap-(--spacing-xs) p-(--spacing-xl)">
        <h3 class="m-0 text-heading-sm text-(--text-default)">Security</h3>
        <p class="m-0 text-body-md text-(--text-muted)">WAF, rate limiting and bot rules applied at the same hop that serves the traffic.</p>
      </div>
    </FrameBox>
    <FrameBox borders="none" class="bg-(--bg-canvas)">
      <div class="flex h-full flex-col gap-(--spacing-xs) p-(--spacing-xl)">
        <h3 class="m-0 text-heading-sm text-(--text-default)">Observability</h3>
        <p class="m-0 text-body-md text-(--text-muted)">Real-time events and logs from every edge location, queryable as one dataset.</p>
      </div>
    </FrameBox>
  </div>

  <SectionGap hatch size="medium" />

  <SectionTitle
    eyebrow="Get started"
    title="Your first deploy takes a minute"
    description="Create an account, push a project, and watch it go live at every edge location."
  >
    <template #actions>
      <Button label="Create an account" />
      <Button kind="outlined" label="Read the docs" />
    </template>
  </SectionTitle>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Default = {
  render: () => ({ components: pageComponents, template: PAGE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The whole set composed as one page: hero band, a `large` gap opening the platform part, a `horizontal` section header, a `gap-px` divider grid of borderless frames, a `medium` gap, and a centered closing header with its CTAs. Every section header owns the rule that divides it from its body, so the page needs no vertical margins of its own — the two `SectionGap` steps are the whole rhythm.'
      },
      source: { code: toSfc(IMPORT, PAGE_TEMPLATE) }
    }
  }
}
