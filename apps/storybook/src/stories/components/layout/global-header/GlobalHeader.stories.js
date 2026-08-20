import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import GlobalHeader from '@aziontech/webkit/global-header'
import Default from '@aziontech/webkit/svg/azion/default'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import Default from '@aziontech/webkit/svg/azion/default'"
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
      options: ['app', 'content'],
      description:
        "Where the bar sits: `app` spans the whole window above the navigation rail and insets its regions by the shell's own step; `content` sits inside the content zone beside the rail, full bleed, and insets them by the page boundary instead.",
      table: {
        type: { summary: "'app' | 'content'" },
        defaultValue: { summary: "'app'" },
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
    kind: 'app'
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

// The content-zone placement: FULL BLEED across the content zone (right of the
// navigation rail), with its regions inset by the page boundary rather than by the
// shell's own step — so the first crumb opens on the same vertical as the page
// content beside it. The mock page under the bar is here to make that edge visible;
// it is not part of the component.
const CONTENT_ZONE_TEMPLATE = `<div class="flex w-full flex-col bg-(--bg-canvas)">
  <GlobalHeader kind="content" aria-label="Console header">
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
          'The bar placed inside the content zone, beside the navigation rail: full bleed across the zone, with its regions inset by the page boundary instead of the shell step — so the breadcrumb starts on the same vertical as the page content beside it.'
      },
      source: { code: toSfc(CONTENT_IMPORT, CONTENT_ZONE_TEMPLATE) }
    }
  }
}
