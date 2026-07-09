import Button from '@aziontech/webkit/button'
import EmptyState from '@aziontech/webkit/empty-state'
import MiniButton from '@aziontech/webkit/mini-button'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Button from '@aziontech/webkit/button'",
  "import MiniButton from '@aziontech/webkit/mini-button'"
]

const ACTIONS_MARKUP = `  <template #actions>
    <div class="flex gap-[var(--spacing-3)]">
      <Button kind="secondary" label="Secondary Item" />
      <Button kind="outlined" label="Create Item" />
    </div>
    <MiniButton label="View Documentation" icon="pi pi-arrow-right" size="medium" href="#" />
  </template>`

/** @type {import('@storybook/vue3').Meta<typeof EmptyState>} */
const meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'A full-region placeholder shown when a list or section has no content yet. It stacks a decorative illustration (the bundled `EmptyStateIllustration` by default), a title, an optional description, and a consumer-composed actions area, and renders on a plain background or inside a bordered surface card (`bordered`).'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Primary heading announcing the empty resource.',
      table: { category: 'props', type: { summary: 'string', required: true } }
    },
    description: {
      control: 'text',
      description: 'Supporting body copy below the title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        'Size token; affects the illustration size, the surrounding padding, and the gaps between illustration, text, and actions.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    bordered: {
      control: 'boolean',
      description:
        'When true, wraps the content in a bordered surface card; otherwise renders on a transparent background.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    icon: {
      control: false,
      description:
        'Decorative illustration centered above the title; rendered inside an aria-hidden container. Defaults to the bundled EmptyStateIllustration.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    actions: {
      control: false,
      description:
        'Action area below the description; consumer composes buttons and the documentation link.',
      table: { category: 'slots', type: { summary: 'slot' } }
    }
  },
  args: {
    title: 'No resource yet',
    description: 'Get started by creating your first resource.',
    size: 'medium',
    bordered: false
  }
}

export default meta

const Template = (args) => ({
  components: { EmptyState, Button, MiniButton },
  setup() {
    return { args }
  },
  template: `<EmptyState v-bind="args">
${ACTIONS_MARKUP}
</EmptyState>`
})

const DEFAULT_MARKUP = `<EmptyState
  title="No resource yet"
  description="Get started by creating your first resource."
>
${ACTIONS_MARKUP}
</EmptyState>`

/** @type {import('@storybook/vue3').StoryObj<typeof EmptyState>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default empty state: the illustration tile, title, description, and actions.'
      },
      source: { code: toSfc(IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex w-full flex-col gap-[var(--spacing-xl)]">
  <EmptyState
    v-for="size in ['small', 'medium', 'large']"
    :key="size"
    :size="size"
    title="No resource yet"
    description="Get started by creating your first resource."
  >
${ACTIONS_MARKUP}
  </EmptyState>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof EmptyState>} */
export const Sizes = {
  render: () => ({ components: { EmptyState, Button, MiniButton }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'The three size variants — small, medium, large — stacked.' },
      source: { code: toSfc(IMPORTS, SIZES_TEMPLATE) }
    }
  }
}

const BORDERED_MARKUP = `<EmptyState
  title="No resource yet"
  description="Get started by creating your first resource."
  bordered
>
${ACTIONS_MARKUP}
</EmptyState>`

/** @type {import('@storybook/vue3').StoryObj<typeof EmptyState>} */
export const Bordered = {
  args: { bordered: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Content wrapped in a bordered surface card (`bordered`).' },
      source: { code: toSfc(IMPORTS, BORDERED_MARKUP) }
    }
  }
}
