import Skeleton from '@aziontech/webkit/skeleton'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Skeleton from '@aziontech/webkit/skeleton'"

/** @type {import('@storybook/vue3').Meta<typeof Skeleton>} */
const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'A loading placeholder that reserves the space of content while it loads, gently pulsing to signal activity. Two geometries cover the common cases: a rounded rectangular block (`shape`) and a `circle`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['shape', 'circle'],
      description: 'Geometry: a rounded rectangular block (`shape`) or a circle.',
      table: {
        category: 'props',
        type: { summary: "'shape' | 'circle'" },
        defaultValue: { summary: "'shape'" }
      }
    },
    width: {
      control: 'text',
      description: 'CSS width (any length).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'100%'" }
      }
    },
    height: {
      control: 'text',
      description: 'CSS height (any length); for a circle, set equal to `width`.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'1rem'" }
      }
    },
    animated: {
      control: 'boolean',
      description: 'Pulse while loading; suppressed under reduced motion.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    }
  },
  args: {
    kind: 'shape',
    width: '240px',
    height: '100px',
    animated: true
  }
}

export default meta

const Template = (args) => ({
  components: { Skeleton },
  setup() {
    return { props: args }
  },
  template: '<Skeleton v-bind="props" />'
})

const DEFAULT_MARKUP = '<Skeleton kind="shape" width="240px" height="100px" animated />'

/** @type {import('@storybook/vue3').StoryObj<typeof Skeleton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default rectangular placeholder with a pulse.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Skeleton kind="shape" width="240px" height="100px" />
  <Skeleton kind="circle" width="100px" height="100px" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Skeleton>} */
export const Types = {
  render: () => ({
    components: { Skeleton },
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both geometries side by side: a rectangular `shape` and a `circle`.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const STATIC_MARKUP = '<Skeleton kind="shape" width="240px" height="100px" :animated="false" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Skeleton>} */
export const Static = {
  args: { animated: false },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Non-pulsing placeholder when `animated: false` (also the reduced-motion fallback).'
      },
      source: { code: toSfc(IMPORT, STATIC_MARKUP) }
    }
  }
}
