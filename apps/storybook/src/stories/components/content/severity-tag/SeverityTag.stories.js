import SeverityTag from '@aziontech/webkit/severity-tag'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import SeverityTag from '@aziontech/webkit/severity-tag'"

/** @type {import('@storybook/vue3').Meta<typeof SeverityTag>} */
const meta = {
  title: 'Components/Primitives/Content/SeverityTag',
  component: SeverityTag,
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
          'Labels an item with its place on an ordered severity scale: critical, high, medium, low or info. The level reads from a four-bar glyph, where the filled bars count the level, and from the label, so two levels never depend on colour alone to differ.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['critical', 'high', 'medium', 'low', 'info'],
      description:
        'Severity level; sets how many glyph bars fill, their colour and the default label.',
      table: {
        category: 'props',
        type: { summary: "'critical' | 'high' | 'medium' | 'low' | 'info'" },
        defaultValue: { summary: "'info'" }
      }
    },
    label: {
      control: 'text',
      description: 'Text of the tag; empty falls back to the level name in sentence case.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size token; medium is 24px tall, small is 20px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    default: {
      control: false,
      description: 'Replaces the label text.',
      table: { category: 'slots' }
    }
  },
  args: {
    severity: 'info',
    label: '',
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { SeverityTag },
  setup() {
    return { args }
  },
  template: '<SeverityTag v-bind="args" />'
})

const DEFAULT_MARKUP = '<SeverityTag severity="info" size="medium" />'

/** @type {import('@storybook/vue3').StoryObj<typeof SeverityTag>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'One tag at the default level, driven by the controls.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const LEVELS_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <SeverityTag severity="critical" />
  <SeverityTag severity="high" />
  <SeverityTag severity="medium" />
  <SeverityTag severity="low" />
  <SeverityTag severity="info" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SeverityTag>} */
export const Levels = {
  render: () => ({ components: { SeverityTag }, template: LEVELS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: { story: 'Every level side by side, from critical to info.' },
      source: { code: toSfc(IMPORT, LEVELS_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <SeverityTag severity="high" size="small" />
  <SeverityTag severity="high" size="medium" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SeverityTag>} */
export const Sizes = {
  render: () => ({ components: { SeverityTag }, template: SIZES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: { story: 'Both sizes side by side at one level.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
