import Kbd from '@aziontech/webkit/kbd'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Kbd from '@aziontech/webkit/kbd'"

/** @type {import('@storybook/vue3').Meta<typeof Kbd>} */
const meta = {
  title: 'Components/Content/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Renders keyboard input — a single key or a shortcut combination — as a compact, non-interactive keycap. Modifier keys are passed as boolean props and rendered with the correct OS-aware glyph (⌘ on macOS, Ctrl elsewhere), so consumers never hardcode platform symbols.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    meta: {
      control: 'boolean',
      description: 'Prepend the meta/command modifier glyph (⌘ on macOS, Ctrl elsewhere).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ctrl: {
      control: 'boolean',
      description: 'Prepend the Control modifier glyph (⌃ on macOS, Ctrl elsewhere).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    shift: {
      control: 'boolean',
      description: 'Prepend the Shift modifier glyph (⇧).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    alt: {
      control: 'boolean',
      description: 'Prepend the Alt/Option modifier glyph (⌥ on macOS, Alt elsewhere).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size token; small is a denser keycap for menus, command bars, and table cells.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    default: {
      control: false,
      description: 'The single key or glyph rendered after any modifier glyphs (`K`, `Enter`, `Esc`).',
      table: { category: 'slots' }
    }
  },
  args: {
    meta: true,
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { Kbd },
  setup() {
    return { props: args }
  },
  template: '<Kbd v-bind="props">K</Kbd>'
})

const DEFAULT_MARKUP = '<Kbd meta>K</Kbd>'

/** @type {import('@storybook/vue3').StoryObj<typeof Kbd>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'A single keycap driven by the controls.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Kbd meta size="small">K</Kbd>
  <Kbd meta size="medium">K</Kbd>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Kbd>} */
export const Sizes = {
  render: () => ({ components: { Kbd }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All sizes side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const COMBOS_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Kbd>/</Kbd>
  <Kbd meta>K</Kbd>
  <Kbd meta shift>P</Kbd>
  <Kbd>Esc</Kbd>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Kbd>} */
export const Combinations = {
  render: () => ({ components: { Kbd }, template: COMBOS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Representative shortcuts, showing single keys, modifier combinations, and OS-aware glyphs.'
      },
      source: { code: toSfc(IMPORT, COMBOS_TEMPLATE) }
    }
  }
}
