import Overline from '@aziontech/webkit/overline'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Overline from '@aziontech/webkit/overline'"

/** @type {import('@storybook/vue3').Meta<typeof Overline>} */
const meta = {
  title: 'Components/Content/Overline',
  component: Overline,
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
          'Uppercase monospace label for section headers and categorization text. Supports a preset prefix (`//`, `<>`, `</>`) and an optional blinking terminal-style cursor.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    prefix: {
      control: 'select',
      options: ['', '//', '<>', '</>'],
      description: 'Preset prefix rendered before the label.',
      table: {
        category: 'props',
        type: { summary: "'' | '//' | '<>' | '</>'" },
        defaultValue: { summary: "''" }
      }
    },
    showCursor: {
      control: 'boolean',
      description: 'Shows a blinking cursor at the end of the text.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    singleLine: {
      control: 'boolean',
      description: 'Prevents the prefix and label from wrapping onto multiple lines.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    default: {
      control: false,
      description: 'Label text (rendered uppercase).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    prefix: '',
    showCursor: false,
    singleLine: true
  }
}

export default meta

const Template = (args) => ({
  components: { Overline },
  setup() {
    return { args }
  },
  template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
})

const DEFAULT_MARKUP = '<Overline>OVERLINE TEXT</Overline>'

/** @type {import('@storybook/vue3').StoryObj<typeof Overline>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default overline label without prefix or cursor.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const PREFIXES_TEMPLATE = `<div class="flex flex-col items-start gap-4">
  <Overline prefix="//">COMMENT STYLE</Overline>
  <Overline prefix="<>">CODE LABEL</Overline>
  <Overline prefix="</>">CLOSING TAG</Overline>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Overline>} */
export const Prefixes = {
  render: () => ({ components: { Overline }, template: PREFIXES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All preset prefixes side by side: `//`, `<>`, and `</>`.' },
      source: { code: toSfc(IMPORT, PREFIXES_TEMPLATE) }
    }
  }
}

const CURSOR_TEMPLATE = `<div class="flex flex-col items-start gap-4">
  <Overline show-cursor prefix="//">OVERLINE TEXT</Overline>
  <Overline show-cursor>NO PREFIX</Overline>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Overline>} */
export const Cursor = {
  render: () => ({ components: { Overline }, template: CURSOR_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Blinking terminal-style cursor at the end of the text, shown with and without a prefix.'
      },
      source: { code: toSfc(IMPORT, CURSOR_TEMPLATE) }
    }
  }
}
