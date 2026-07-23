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
          'A full-region placeholder shown when a list or section has no content yet. It stacks an optional standardized featured-icon tile (driven by the `icon` prop), a title, an optional description, and a consumer-composed actions area, and renders on a plain background or inside a bordered surface card (`bordered`). Supply custom adornment content via the `icon` slot, or omit both `icon` prop and slot for no adornment.'
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
      options: ['small', 'medium'],
      description:
        'Size token (small and medium only); scales the adornment, the title and description typography, the surrounding padding, and the gaps on one harmonic ramp.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    icon: {
      control: 'text',
      description:
        'PrimeIcons/Azion icon class for the standardized adornment; renders a size-scaled featured-icon tile. The `icon` slot overrides it; omit both for no adornment.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    bordered: {
      control: 'boolean',
      description:
        'When true, wraps the content in a bordered surface card; otherwise renders on a transparent background.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
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
    icon: 'pi pi-inbox',
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
  icon="pi pi-inbox"
>
${ACTIONS_MARKUP}
</EmptyState>`

/** @type {import('@storybook/vue3').StoryObj<typeof EmptyState>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default empty state: the standardized featured-icon tile, title, description, and actions.'
      },
      source: { code: toSfc(IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex w-full flex-col gap-[var(--spacing-xl)]">
  <EmptyState
    v-for="size in ['small', 'medium']"
    :key="size"
    :size="size"
    title="No resource yet"
    description="Get started by creating your first resource."
    icon="pi pi-inbox"
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
      description: { story: 'The size variants — small and medium — stacked.' },
      source: { code: toSfc(IMPORTS, SIZES_TEMPLATE) }
    }
  }
}

const ICON_MARKUP = `<EmptyState
  title="No resource yet"
  description="Get started by creating your first resource."
  icon="pi pi-inbox"
>
${ACTIONS_MARKUP}
</EmptyState>`

/** @type {import('@storybook/vue3').StoryObj<typeof EmptyState>} */
export const Icon = {
  args: { icon: 'pi pi-inbox' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'The standardized featured-icon tile adornment, driven by the `icon` prop.'
      },
      source: { code: toSfc(IMPORTS, ICON_MARKUP) }
    }
  }
}

const NO_ADORNMENT_MARKUP = `<EmptyState
  title="No resource yet"
  description="Get started by creating your first resource."
>
${ACTIONS_MARKUP}
</EmptyState>`

/** @type {import('@storybook/vue3').StoryObj<typeof EmptyState>} */
export const NoAdornment = {
  args: { icon: '' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'No adornment: neither the `icon` prop nor the `icon` slot is provided, so the adornment container does not render.'
      },
      source: { code: toSfc(IMPORTS, NO_ADORNMENT_MARKUP) }
    }
  }
}

const BORDERED_MARKUP = `<EmptyState
  title="No resource yet"
  description="Get started by creating your first resource."
  icon="pi pi-inbox"
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
