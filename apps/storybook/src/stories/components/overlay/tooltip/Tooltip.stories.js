import { ref, watch } from 'vue'

import Button from '@aziontech/webkit/button'
import IconButton from '@aziontech/webkit/icon-button'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../../_shared/story-source'

const IMPORT_TOOLTIP = "import Tooltip from '@aziontech/webkit/tooltip'"
const IMPORT_BUTTON = "import Button from '@aziontech/webkit/button'"
const IMPORT_ICON_BUTTON = "import IconButton from '@aziontech/webkit/icon-button'"

/** @type {import('@storybook/vue3').Meta<typeof Tooltip>} */
const meta = {
  title: 'Components/Overlay/Tooltip',
  component: Tooltip,
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
          'Surfaces a short hint anchored to a trigger element when the user hovers, focuses, or long-presses it. Use for icon-only buttons, abbreviations, or any control whose meaning is not obvious from its label alone. Not for rich content or interactive children — use `Popover` instead.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Plain text shown inside the tooltip.',
      table: { category: 'props', type: { summary: 'string', required: true } }
    },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left', 'auto'],
      description:
        "Anchor side relative to the trigger. `'auto'` picks the side with the most room at open time.",
      table: {
        category: 'props',
        type: { summary: "'top' | 'right' | 'bottom' | 'left' | 'auto'" },
        defaultValue: { summary: "'top'" }
      }
    },
    delay: {
      control: 'number',
      description: 'Hover-open delay in milliseconds.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables tooltip activation.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Use with `v-model:open`.',
      table: { category: 'props', type: { summary: 'boolean' } }
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'v-model:open. Fires on open and close.',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    onShow: {
      action: 'show',
      description: 'Emitted right after the open transition starts.',
      table: { category: 'events', type: { summary: 'void' } }
    },
    onHide: {
      action: 'hide',
      description: 'Emitted right after the close transition starts.',
      table: { category: 'events', type: { summary: 'void' } }
    },
    default: {
      control: false,
      description: 'The trigger element. Tooltip anchors to its bounding box.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    text: 'This is a Tooltip',
    placement: 'top',
    delay: 200,
    disabled: false,
    defaultOpen: false
  }
}

export default meta

// Tooltip is a v-model:open component. The story holds a local ref so the `open`
// control drives the canvas and hover updates are reflected back, and forwards
// every change to the Actions panel via args['onUpdate:open'].
const Template = (args) => ({
  components: { Tooltip, Button },
  setup() {
    const value = ref(args.open ?? args.defaultOpen ?? false)
    watch(
      () => args.open,
      (next) => {
        value.value = next ?? false
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:open']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: `
    <Tooltip v-bind="args" :open="value" @update:open="onUpdate">
      <Button label="Hover me" kind="outlined" size="medium" />
    </Tooltip>
  `
})

const DEFAULT_MARKUP = `<Tooltip text="This is a Tooltip" placement="top">
  <Button label="Hover me" kind="outlined" size="medium" />
</Tooltip>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Outlined button trigger. Hover or focus “Hover me” to reveal the tooltip.'
      },
      source: { code: toSfc([IMPORT_TOOLTIP, IMPORT_BUTTON], DEFAULT_MARKUP) }
    }
  }
}

const PLACEMENTS_TEMPLATE = `<div class="flex flex-wrap items-center justify-center gap-[var(--spacing-8)] p-[var(--spacing-8)]">
  <Tooltip text="top placement" placement="top">
    <IconButton icon="pi pi-arrow-up" aria-label="top placement" kind="outlined" size="medium" />
  </Tooltip>
  <Tooltip text="right placement" placement="right">
    <IconButton icon="pi pi-arrow-right" aria-label="right placement" kind="outlined" size="medium" />
  </Tooltip>
  <Tooltip text="bottom placement" placement="bottom">
    <IconButton icon="pi pi-arrow-down" aria-label="bottom placement" kind="outlined" size="medium" />
  </Tooltip>
  <Tooltip text="left placement" placement="left">
    <IconButton icon="pi pi-arrow-left" aria-label="left placement" kind="outlined" size="medium" />
  </Tooltip>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const Placements = {
  render: () => ({ components: { Tooltip, IconButton }, template: PLACEMENTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All four anchor sides with directional arrow triggers. Hover or focus each icon button to compare placement.'
      },
      source: { code: toSfc([IMPORT_TOOLTIP, IMPORT_ICON_BUTTON], PLACEMENTS_TEMPLATE) }
    }
  }
}

const AUTO_PLACEMENT_TEMPLATE = `<div class="relative h-[28rem] w-full border border-dashed border-[var(--border-muted)]">
  <p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-sm text-[var(--text-muted)] text-center max-w-md">
    All four triggers use <code>placement="auto"</code>.<br />
    Each tooltip resolves to the side with the most available space.
  </p>

  <div class="absolute top-[var(--spacing-md)] left-1/2 -translate-x-1/2">
    <Tooltip text="auto placement" placement="auto" :default-open="true">
      <IconButton icon="pi pi-arrow-up" aria-label="top-edge trigger" kind="outlined" size="medium" />
    </Tooltip>
  </div>

  <div class="absolute bottom-[var(--spacing-md)] left-1/2 -translate-x-1/2">
    <Tooltip text="auto placement" placement="auto" :default-open="true">
      <IconButton icon="pi pi-arrow-down" aria-label="bottom-edge trigger" kind="outlined" size="medium" />
    </Tooltip>
  </div>

  <div class="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2">
    <Tooltip text="auto placement" placement="auto" :default-open="true">
      <IconButton icon="pi pi-arrow-left" aria-label="left-edge trigger" kind="outlined" size="medium" />
    </Tooltip>
  </div>

  <div class="absolute right-[var(--spacing-md)] top-1/2 -translate-y-1/2">
    <Tooltip text="auto placement" placement="auto" :default-open="true">
      <IconButton icon="pi pi-arrow-right" aria-label="right-edge trigger" kind="outlined" size="medium" />
    </Tooltip>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const AutoPlacement = {
  render: () => ({ components: { Tooltip, IconButton }, template: AUTO_PLACEMENT_TEMPLATE }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`placement="auto"` lets the tooltip pick the side with the most available space at open time. The four edge-positioned triggers all share the same prop value — each resolves to the side that fits best, reflected in `data-placement`.'
      },
      source: { code: toSfc([IMPORT_TOOLTIP, IMPORT_ICON_BUTTON], AUTO_PLACEMENT_TEMPLATE) }
    }
  }
}

const LONG_CONTENT_TEMPLATE = `<Tooltip text="This tooltip contains a longer message that wraps across multiple lines when it exceeds the maximum width of the panel." placement="top">
  <IconButton icon="pi pi-info-circle" aria-label="More information" kind="transparent" size="small" />
</Tooltip>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const LongContent = {
  render: () => ({ components: { Tooltip, IconButton }, template: LONG_CONTENT_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Long text wraps within the tooltip max width (`var(--container-3xs)`). Hover or focus the info icon to preview the multi-line layout.'
      },
      source: { code: toSfc([IMPORT_TOOLTIP, IMPORT_ICON_BUTTON], LONG_CONTENT_TEMPLATE) }
    }
  }
}

const DISABLED_MARKUP = `<Tooltip text="This is a Tooltip" disabled>
  <Button label="Hover me" kind="outlined" size="medium" />
</Tooltip>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip activation is a no-op; the trigger renders but no hint appears on hover or focus.'
      },
      source: { code: toSfc([IMPORT_TOOLTIP, IMPORT_BUTTON], DISABLED_MARKUP) }
    }
  }
}
