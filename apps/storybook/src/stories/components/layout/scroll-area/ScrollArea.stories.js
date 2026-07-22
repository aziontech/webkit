import ScrollArea from '@aziontech/webkit/scroll-area'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ScrollArea from '@aziontech/webkit/scroll-area'"

const longCopy = `Jokester began sneaking into the castle in the middle of the night and leaving
jokes all over the place: under the king's pillow, in his soup, even in the
royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
then one day, the king tripped over one of Jokester's whoopee cushions and
fell into the moat. He was so embarrassed that he decided to make Jokester the
official court jester.`

/** @type {import('@storybook/vue3').Meta<typeof ScrollArea>} */
const meta = {
  title: 'Components/Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          'Native overflow container with themed thin scrollbars and keyboard scrolling (arrow keys, Page Up/Down, Home/End). Set the viewport height and width via `class` on the root, and choose the scroll axis with `orientation`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Scroll direction for overflow content.',
      table: {
        category: 'props',
        type: { summary: "'vertical' | 'horizontal' | 'both'" },
        defaultValue: { summary: "'vertical'" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name when the region is not labelled by visible text.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    default: {
      control: false,
      description: 'Scrollable content.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    orientation: 'vertical',
    ariaLabel: 'Scrollable content'
  }
}

export default meta

const Template = (args) => ({
  components: { ScrollArea },
  setup() {
    return { args, longCopy }
  },
  template: `
    <ScrollArea
      v-bind="args"
      class="h-[200px] max-w-[var(--container-md)] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]"
    >
      {{ longCopy }}
    </ScrollArea>
  `
})

const DEFAULT_MARKUP = `<ScrollArea
  orientation="vertical"
  aria-label="Scrollable content"
  class="h-[200px] max-w-[var(--container-md)] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]"
>
  ${longCopy}
</ScrollArea>`

/** @type {import('@storybook/vue3').StoryObj<typeof ScrollArea>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Vertical scroll region sized via `class`, with a themed thin scrollbar.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const ORIENTATIONS_TEMPLATE = `<div class="flex flex-wrap items-start gap-[var(--spacing-6)]">
  <ScrollArea
    orientation="vertical"
    aria-label="Vertical scroll"
    class="h-[160px] w-[240px] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-3)] text-body-sm text-[var(--text-default)]"
  >
    <div class="h-[320px]">Tall content that scrolls along the vertical axis.</div>
  </ScrollArea>
  <ScrollArea
    orientation="horizontal"
    aria-label="Horizontal scroll"
    class="w-[240px] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-3)] text-body-sm text-[var(--text-default)]"
  >
    <p class="m-0 w-max whitespace-nowrap">This line is intentionally wider than the container so horizontal scrolling is required.</p>
  </ScrollArea>
  <ScrollArea
    orientation="both"
    aria-label="Two-axis scroll"
    class="h-[160px] w-[240px] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-3)] text-body-sm text-[var(--text-default)]"
  >
    <div class="h-[320px] w-[480px]">Tall and wide content for two-axis scrolling.</div>
  </ScrollArea>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ScrollArea>} */
export const Orientations = {
  render: () => ({ components: { ScrollArea }, template: ORIENTATIONS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The `orientation` prop drives the scroll axis: `vertical`, `horizontal`, and `both` shown side by side.'
      },
      source: { code: toSfc(IMPORT, ORIENTATIONS_TEMPLATE) }
    }
  }
}
