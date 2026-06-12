import ScrollArea from '@aziontech/webkit/layout/scroll-area'
import { expect, userEvent, within } from '@storybook/test'

const longCopy = `Jokester began sneaking into the castle in the middle of the night and leaving
jokes all over the place: under the king's pillow, in his soup, even in the
royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
then one day, the king tripped over one of Jokester's whoopee cushions and
fell into the moat. He was so embarrassed that he decided to make Jokester the
official court jester.`

/** @type {import('@storybook/vue3').Meta<typeof ScrollArea>} */
const meta = {
  title: 'Webkit/Layout/ScrollArea',
  component: ScrollArea,
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
          'Native overflow container with themed thin scrollbars and keyboard scrolling (arrow keys, Page Up/Down, Home/End). Pass height/width via `class` on the root; `Sidebar` wraps its nav content in `ScrollArea` automatically.'
      }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal', 'both'],
      description: 'Scroll direction for overflow content.',
      table: {
        type: { summary: 'ScrollAreaOrientation' },
        defaultValue: { summary: 'vertical' },
        category: 'props'
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name when the region is not labelled by visible text.',
      table: {
        type: { summary: 'string' },
        category: 'props'
      }
    },
    default: {
      description: 'Scrollable content.',
      control: false,
      table: { type: { summary: 'VNode | string' }, category: 'slots' }
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

export const Default = {
  render: Template
}

export const Vertical = {
  render: Template,
  args: { orientation: 'vertical' }
}

export const Horizontal = {
  render: (args) => ({
    components: { ScrollArea },
    setup() {
      return { args }
    },
    template: `
      <ScrollArea
        v-bind="args"
        orientation="horizontal"
        aria-label="Wide content"
        class="w-[280px] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-3)]"
      >
        <p class="m-0 w-max whitespace-nowrap text-body-sm text-[var(--text-default)]">
          This line is intentionally wider than the container so horizontal scrolling is required.
        </p>
      </ScrollArea>
    `
  })
}

export const Both = {
  render: (args) => ({
    components: { ScrollArea },
    setup() {
      return { args }
    },
    template: `
      <ScrollArea
        v-bind="args"
        orientation="both"
        aria-label="Two-axis scroll"
        class="h-[160px] w-[240px] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-3)]"
      >
        <div class="h-[320px] w-[480px] text-body-sm text-[var(--text-default)]">
          Tall and wide content for two-axis scrolling.
        </div>
      </ScrollArea>
    `
  })
}

export const WithSlots = {
  render: (args) => ({
    components: { ScrollArea },
    setup() {
      return { args }
    },
    template: `
      <ScrollArea
        v-bind="args"
        class="flex h-[220px] w-[280px] flex-col gap-[var(--spacing-3)] rounded-[var(--shape-elements)] border border-[var(--border-default)] p-[var(--spacing-3)]"
      >
        <p v-for="n in 8" :key="n" class="m-0 text-body-sm text-[var(--text-muted)]">
          Section {{ n }} — stacked blocks inside one scroll viewport.
        </p>
      </ScrollArea>
    `
  })
}

export const LightDark = {
  parameters: {
    backgrounds: { default: 'light' }
  },
  render: (args) => ({
    components: { ScrollArea },
    setup() {
      return { args, longCopy }
    },
    template: `
      <div class="flex flex-col gap-[var(--spacing-6)]">
        <ScrollArea
          v-bind="args"
          class="h-[180px] max-w-[var(--container-md)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]"
        >
          {{ longCopy }}
        </ScrollArea>
        <div class="dark rounded-[var(--shape-card)] bg-[var(--bg-canvas)] p-[var(--spacing-4)]">
          <ScrollArea
            v-bind="args"
            class="h-[180px] max-w-[var(--container-md)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]"
          >
            {{ longCopy }}
          </ScrollArea>
        </div>
      </div>
    `
  })
}

export const Accessibility = {
  render: Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByTestId('layout-scroll-area')
    await userEvent.tab()
    await expect(region).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(region.scrollTop).toBeGreaterThan(0)
  }
}

export const Playground = {
  render: Template
}
