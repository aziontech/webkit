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
  title: 'Components/Primitives/Layout/ScrollArea',
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
          'Native overflow container with themed thin scrollbars and keyboard scrolling (arrow keys, Page Up/Down, Home/End). Set the viewport height and width via `class` on the root, choose the scroll axis with `orientation`, and set `fade` to fade the edges that still have content to scroll to.'
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
    fade: {
      control: 'boolean',
      description:
        'Fades the edges that still have content to scroll to, sized by the distance left on each side.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    default: {
      control: false,
      description: 'Scrollable content.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    orientation: 'vertical',
    ariaLabel: 'Scrollable content',
    fade: false
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
      class="h-[200px] max-w-(--container-md) rounded-(--shape-elements) border border-(--border-default) p-(--spacing-4) text-body-sm text-(--text-default)"
    >
      {{ longCopy }}
    </ScrollArea>
  `
})

const DEFAULT_MARKUP = `<ScrollArea
  orientation="vertical"
  aria-label="Scrollable content"
  class="h-[200px] max-w-(--container-md) rounded-(--shape-elements) border border-(--border-default) p-(--spacing-4) text-body-sm text-(--text-default)"
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

const ORIENTATIONS_TEMPLATE = `<div class="flex flex-wrap items-start gap-(--spacing-6)">
  <ScrollArea
    orientation="vertical"
    aria-label="Vertical scroll"
    class="h-[160px] w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
  >
    <div class="h-[320px]">Tall content that scrolls along the vertical axis.</div>
  </ScrollArea>
  <ScrollArea
    orientation="horizontal"
    aria-label="Horizontal scroll"
    class="w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
  >
    <p class="m-0 w-max whitespace-nowrap">This line is intentionally wider than the container so horizontal scrolling is required.</p>
  </ScrollArea>
  <ScrollArea
    orientation="both"
    aria-label="Two-axis scroll"
    class="h-[160px] w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
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

const FADE_TEMPLATE = `<div class="flex flex-wrap items-start gap-(--spacing-6)">
  <div class="w-[280px] overflow-hidden rounded-(--shape-elements) border border-(--border-default)">
    <ScrollArea fade aria-label="Deployments" class="h-[240px] p-(--spacing-xs)">
      <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0">
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">edge-app-production</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">edge-app-staging</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">marketing-site</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">docs-portal</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">image-optimizer</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">api-gateway</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">auth-service</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">checkout-function</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">search-indexer</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">media-transcoder</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">waf-rules-engine</li>
        <li class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">analytics-collector</li>
      </ul>
    </ScrollArea>
  </div>
  <div class="w-[280px] overflow-hidden rounded-(--shape-elements) border border-(--border-default)">
    <ScrollArea fade orientation="horizontal" aria-label="Regions" class="p-(--spacing-xs)">
      <div class="flex w-max gap-(--spacing-xs)">
        <span class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">São Paulo</span>
        <span class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">Miami</span>
        <span class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">Frankfurt</span>
        <span class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">Tokyo</span>
        <span class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">Sydney</span>
        <span class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)">Mumbai</span>
      </div>
    </ScrollArea>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ScrollArea>} */
export const Fade = {
  render: () => ({ components: { ScrollArea }, template: FADE_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'With `fade`, only the edges that still have content fade out, and each fade grows with the distance left to scroll. The border sits on a wrapper so the fade never eats the frame.'
      },
      source: { code: toSfc(IMPORT, FADE_TEMPLATE) }
    }
  }
}
