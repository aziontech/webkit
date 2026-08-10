import Illustration from '@aziontech/webkit/illustration'
import IllustrationBox from '@aziontech/webkit/illustration-box'
import IllustrationConnector from '@aziontech/webkit/illustration-connector'
import IllustrationNode from '@aziontech/webkit/illustration-node'
import IllustrationPill from '@aziontech/webkit/illustration-pill'
import IllustrationWindow from '@aziontech/webkit/illustration-window'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Illustration from '@aziontech/webkit/illustration'"

// Registered asset names — the values `name` accepts. Keep in step with assets/registry.ts.
const ASSETS = [
  'functions',
  'ai-inference',
  'image-processor',
  'edge-storage',
  'waf-rules',
  'path',
  'sql-database',
  'azion-highlight',
  'ship',
  'api-keys',
  'traffic-chart',
  'optimize-application',
  'build',
  'deploy',
  'bot-manager',
  'help-resources'
]

/** @type {import('@storybook/vue3').Meta<typeof Illustration>} */
const meta = {
  title: 'Components/Content/Illustration',
  component: Illustration,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
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
          'A product illustration that is **built, not drawn** — composed from token-styled HTML primitives (icon box, node, connector, pill, window) rather than an exported SVG. Pass `name` to render a registered asset, or compose the parts by hand through the compound API. Because every part is HTML plus design tokens, one illustration follows light and dark, scales with `size`, and can animate; an exported `.svg` can do none of those. The parts catalog lives under Foundations → Illustration System.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: ['', ...ASSETS],
      description:
        'Key of a registered asset to render; empty renders the composed default slot instead.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Scale of the whole scene; every part inherits it unless it sets its own.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    active: {
      control: 'boolean',
      description: 'Scene-level emphasis; parts inherit it and switch to the brand rim light.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name; empty keeps the illustration decorative and hidden from assistive tech.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    name: 'ship',
    size: 'large',
    active: false,
    ariaLabel: ''
  }
}

export default meta

const Template = (args) => ({
  components: { Illustration },
  setup() {
    return { args }
  },
  template: '<Illustration v-bind="args" />'
})

const DEFAULT_MARKUP = '<Illustration name="ship" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Illustration>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The data-driven form: one `name` resolves a registered asset, lazily loaded so a consumer bundles only the assets it names.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-end gap-[var(--spacing-xl)]">
  <Illustration size="small">
    <IllustrationBox icon="ai ai-edge-application" />
    <IllustrationConnector kind="dashed" animated />
    <IllustrationBox icon="ai ai-real-time-metrics" />
  </Illustration>
  <Illustration size="medium">
    <IllustrationBox icon="ai ai-edge-application" />
    <IllustrationConnector kind="dashed" animated />
    <IllustrationBox icon="ai ai-real-time-metrics" />
  </Illustration>
  <Illustration size="large">
    <IllustrationBox icon="ai ai-edge-application" />
    <IllustrationConnector kind="dashed" animated />
    <IllustrationBox icon="ai ai-real-time-metrics" />
  </Illustration>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Illustration>} */
export const Sizes = {
  render: () => ({
    components: { Illustration, IllustrationBox, IllustrationConnector },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All three scales, on a hand-composed illustration. `size` flows to every part through context, so boxes, radii, rim thicknesses and connector lengths step together. A **registered asset** ignores `size` — it is authored against the fixed 170×128 canvas and renders at its designed size.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import IllustrationBox from '@aziontech/webkit/illustration-box'",
            "import IllustrationConnector from '@aziontech/webkit/illustration-connector'"
          ],
          SIZES_TEMPLATE
        )
      }
    }
  }
}

const ASSETS_TEMPLATE = `<div class="grid grid-cols-3 gap-[var(--spacing-xl)]">
${ASSETS.map((n) => `  <Illustration name="${n}" />`).join('\n')}
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Illustration>} */
export const Assets = {
  render: () => ({
    components: { Illustration },
    template: ASSETS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every registered asset side by side — the closed set of values `name` accepts. An asset is a small SFC composed only of the parts, so it inherits `size` and `active` and never repeats geometry. An unknown `name` renders nothing and warns.'
      },
      source: { code: toSfc(IMPORT, ASSETS_TEMPLATE) }
    }
  }
}

const ACTIVE_MARKUP = '<Illustration name="bot-manager" active />'

/** @type {import('@storybook/vue3').StoryObj<typeof Illustration>} */
export const Active = {
  args: { active: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Scene-level emphasis. Every part switches to the brand rim light. Pass `active` on a single part instead when only one should be the focal point.'
      },
      source: { code: toSfc(IMPORT, ACTIVE_MARKUP) }
    }
  }
}

const COMPOSED_IMPORTS = [
  IMPORT,
  "import IllustrationWindow from '@aziontech/webkit/illustration-window'",
  "import IllustrationConnector from '@aziontech/webkit/illustration-connector'",
  "import IllustrationNode from '@aziontech/webkit/illustration-node'",
  "import IllustrationBox from '@aziontech/webkit/illustration-box'",
  "import IllustrationPill from '@aziontech/webkit/illustration-pill'"
]

const COMPOSED_TEMPLATE = `<Illustration size="medium">
  <IllustrationWindow kind="chat" />
  <IllustrationConnector kind="dashed" animated />
  <IllustrationNode kind="dashed" />
  <IllustrationConnector kind="dashed" animated />
  <IllustrationBox icon="ai ai-edge-application" active />
  <IllustrationConnector />
  <IllustrationPill icon="ai ai-real-time-metrics" label="Metrics" />
</Illustration>`

/** @type {import('@storybook/vue3').StoryObj<typeof Illustration>} */
export const Composed = {
  render: () => ({
    components: {
      Illustration,
      IllustrationWindow,
      IllustrationConnector,
      IllustrationNode,
      IllustrationBox,
      IllustrationPill
    },
    template: `<div class="flex w-[520px] items-center gap-[var(--spacing-xs)]">${COMPOSED_TEMPLATE}</div>`
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The anatomy path: the same parts arranged by hand when no registered asset fits. Each part inherits `size` and `active` from the root, and a part that sets its own wins — here the box is the focal point in an otherwise resting scene. With the compound import these read as `Illustration.Window`, `Illustration.Box`, and so on; the flat imports shown are the tree-shakeable alternative.'
      },
      source: { code: toSfc(COMPOSED_IMPORTS, COMPOSED_TEMPLATE) }
    }
  }
}
