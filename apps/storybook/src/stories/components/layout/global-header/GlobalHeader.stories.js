import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import GlobalHeader from '@aziontech/webkit/global-header'
import Default from '@aziontech/webkit/svg/azion/default'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import Default from '@aziontech/webkit/svg/azion/default'"
]

const SITE_IMPORT = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import GlobalHeader from '@aziontech/webkit/global-header'"
]

const CONTENT_IMPORT = [
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import GlobalHeader from '@aziontech/webkit/global-header'"
]

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string template: Vue compiles
// `<GlobalHeader.Left>` to `resolveComponent("GlobalHeader.Left")`, an exact-name
// lookup (a bare `GlobalHeader` registration does not satisfy it). In a real SFC
// the dotted tag resolves off the imported `GlobalHeader` binding, so consumer
// code needs only `import GlobalHeader` — these extra registrations are a
// Storybook-runtime concern.
const components = {
  Brand,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  Breadcrumb,
  Button,
  Default
}

/** @type {import('@storybook/vue3').Meta<typeof GlobalHeader>} */
const meta = {
  title: 'Components/Layout/GlobalHeader',
  component: GlobalHeader,
  subcomponents: {
    'GlobalHeader.Left': GlobalHeader.Left,
    'GlobalHeader.Middle': GlobalHeader.Middle,
    'GlobalHeader.Right': GlobalHeader.Right,
    'GlobalHeader.Brand': GlobalHeader.Brand
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Application chrome for the top menubar: a fixed-height bar with composable start, center, and end regions plus a dedicated brand slot for Azion logo variants.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the header landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Global header'" },
        category: 'props'
      }
    },
    kind: {
      control: 'inline-radio',
      options: ['content', 'site'],
      description:
        "Where the bar sits: `content` is the default — full bleed across whatever zone holds it, insetting its regions by the page boundary so the first region opens on the same vertical as the page content under or beside it; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site header measure and centres them, so they land on the bar's own column, one rung wider than the page frame under it.",
      table: {
        type: { summary: "'content' | 'site'" },
        defaultValue: { summary: "'content'" },
        category: 'props'
      }
    },
    default: {
      control: false,
      description:
        'Compose the header regions: Container (or Left + Brand), Middle/Nav, and Right sub-components.',
      table: { type: { summary: '—' }, category: 'slots' }
    }
  },
  args: {
    ariaLabel: 'Global header',
    kind: 'content'
  }
}

export default meta

// The three regions plus the branded start cluster, authored once so the live
// canvas (Template) and the "Show code" snippet (DEFAULT_MARKUP) never drift.
const HEADER_REGIONS = `  <GlobalHeader.Left>
    <GlobalHeader.Brand>
      <a href="/" aria-label="Azion home">
        <Default />
      </a>
    </GlobalHeader.Brand>
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right />`

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `<GlobalHeader v-bind="args">
${HEADER_REGIONS}
</GlobalHeader>`
})

const DEFAULT_MARKUP = `<GlobalHeader aria-label="Global header">
${HEADER_REGIONS}
</GlobalHeader>`

/** @type {import('@storybook/vue3').StoryObj<typeof GlobalHeader>} */
export const DefaultHeader = {
  name: 'Default',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The shell composed with the Azion logo in the brand slot at the start region, leaving the center and end regions ready for consumer content.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

// The default placement, shown against a page: FULL BLEED across whatever zone holds the
// bar (here the content zone right of a navigation rail), with its regions inset by the page
// boundary — so the first crumb opens on the same vertical as the page's own heading. Default
// above shows the ANATOMY of the bar; this story exists for the one claim the anatomy cannot
// show, which is that shared vertical, so the mock page under the bar is the point of it. It
// is not part of the component.
const CONTENT_ZONE_TEMPLATE = `<div class="flex w-full flex-col bg-(--bg-canvas)">
  <GlobalHeader aria-label="Console header">
    <GlobalHeader.Left class="justify-start!">
      <Breadcrumb :items="[{ label: 'Build', href: '/build' }, { label: 'Custom Pages' }]" />
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <Button label="Create" kind="secondary" size="medium" icon="pi pi-plus-circle" />
    </GlobalHeader.Right>
  </GlobalHeader>
  <div class="layout-boundary">
    <h1 class="text-heading-xl text-(--text-default)">Custom Pages</h1>
    <p class="text-body-md text-(--text-muted)">Manage the pages served for an error or a maintenance window.</p>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof GlobalHeader>} */
export const ContentZone = {
  name: 'Content zone',
  render: () => ({ components, template: CONTENT_ZONE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The default placement, against a page: full bleed across the zone that holds it, with its regions inset by the page boundary — so the breadcrumb starts on the same vertical as the heading under it, and retuning the boundary moves both. The mock page is here to make that vertical visible.'
      },
      source: { code: toSfc(CONTENT_IMPORT, CONTENT_ZONE_TEMPLATE) }
    }
  }
}

// The site placement: the SURFACE is still full bleed, and the REGIONS are capped at the
// bar's own `--layout-measure-site-header` (1620) and centred. The mock hero band takes the
// PAGE frame (`--layout-measure-site`, 1388) — the measure the hero, the sections and the
// footer share — so the story shows the real relationship between the two: below both caps
// they resolve to one inset and the brand opens on the headline's vertical; past 1436 the
// column starts pulling in, and from 1668 the bar sits a flat 92px outside it — a bar reading
// as chrome around the page rather than as one more band of it. The band is here to make that
// visible; it is not part of the component.
const SITE_TEMPLATE = `<div class="flex w-full flex-col bg-(--bg-canvas)">
  <GlobalHeader kind="site" aria-label="Azion">
    <GlobalHeader.Brand>
      <a href="/" aria-label="Azion home"><Brand kind="default" size="small" /></a>
    </GlobalHeader.Brand>
    <GlobalHeader.Middle class="justify-start!">
      <a class="text-label-md text-(--text-default) no-underline" href="/pricing">Pricing</a>
    </GlobalHeader.Middle>
    <GlobalHeader.Right>
      <Button label="Start for Free" kind="primary" size="medium" />
    </GlobalHeader.Right>
  </GlobalHeader>
  <section class="mx-auto w-full max-w-(--layout-measure-site) px-(--layout-boundary-inline) py-(--spacing-xl)">
    <h1 class="text-heading-xl text-(--text-default)">Distributed infrastructure for modern workloads</h1>
    <p class="text-body-md text-(--text-muted)">The page frame is one rung narrower than the bar above it: the two share an inset until the window passes their caps.</p>
  </section>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof GlobalHeader>} */
export const SitePlacement = {
  name: 'Site placement',
  render: () => ({ components, template: SITE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The marketing placement: the bar's surface still spans the window, but its regions are capped at the site header measure (`--layout-measure-site-header`) and centred, so the brand answers to the page instead of drifting to the window edge as the viewport grows. That cap is one rung wider than the page frame the hero, sections and footer share (`--layout-measure-site`): a bar carries the brand at one end and the account actions at the other, so it is the one band deliberately outside the frame."
      },
      source: { code: toSfc(SITE_IMPORT, SITE_TEMPLATE) }
    }
  }
}
