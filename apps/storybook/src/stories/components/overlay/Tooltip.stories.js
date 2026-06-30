import Button from '@aziontech/webkit/button'
import IconButton from '@aziontech/webkit/icon-button'
import Tooltip from '@aziontech/webkit/tooltip'

/** @type {import('@storybook/vue3').Meta<typeof Tooltip>} */
const meta = {
  title: 'Components/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
        component: [
          'Surfaces a short hint anchored to a trigger element when the user hovers, focuses, or long-presses it. Use for icon-only buttons, abbreviations, or any control whose meaning is not obvious from its label alone. **Not** for rich content or interactive children — use `overlay/popover` instead.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Tooltip from '@aziontech/webkit/overlay/tooltip'",
          "import IconButton from '@aziontech/webkit/icon-button'",
          '</script>',
          '',
          '<template>',
          '  <Tooltip text="Delete" placement="top">',
          '    <IconButton icon="pi pi-trash" aria-label="Delete" />',
          '  </Tooltip>',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Plain text shown inside the tooltip.',
      table: { category: 'props', type: { summary: 'string' } }
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
    onUpdateOpen: {
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

const Template = (args) => ({
  components: { Tooltip, Button },
  setup() {
    return { args }
  },
  template: `
    <Tooltip
      v-bind="args"
      @update:open="args.onUpdateOpen"
      @show="args.onShow"
      @hide="args.onHide"
    >
      <Button label="Hover me" kind="outlined" size="medium" />
    </Tooltip>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Outlined button trigger. Hover or focus “Hover me” to reveal the tooltip.'
      }
    }
  }
}

const placementIcons = {
  top: 'pi pi-arrow-up',
  right: 'pi pi-arrow-right',
  bottom: 'pi pi-arrow-down',
  left: 'pi pi-arrow-left'
}

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const Placements = {
  render: (args) => ({
    components: { Tooltip, IconButton },
    setup() {
      const placements = ['top', 'right', 'bottom', 'left']
      return { args, placements, placementIcons }
    },
    template: `
      <div class="flex flex-wrap items-center justify-center gap-[var(--spacing-8)] p-[var(--spacing-8)]">
        <Tooltip
          v-for="placement in placements"
          :key="placement"
          v-bind="args"
          :placement="placement"
          :text="\`\${placement} placement\`"
          @update:open="args.onUpdateOpen"
          @show="args.onShow"
          @hide="args.onHide"
        >
          <IconButton
            :icon="placementIcons[placement]"
            :aria-label="\`\${placement} placement\`"
            kind="outlined"
            size="medium"
          />
        </Tooltip>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'All four anchor sides with directional arrow triggers. Hover or focus each icon button to compare placement.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const AutoPlacement = {
  render: () => ({
    components: { Tooltip, IconButton },
    template: `
      <div class="relative h-[28rem] w-full border border-dashed border-[var(--border-muted)]">
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
      </div>
    `
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          '`placement="auto"` lets the tooltip pick the side with the most available space at open time. The four edge-positioned triggers below all share the same prop value — each resolves to the side that fits best. The resolved value is reflected in `data-placement`. Backed by the shared `@aziontech/webkit/use-placement` composable.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Tooltip>} */
export const LongContent = {
  render: (args) => ({
    components: { Tooltip, IconButton },
    setup() {
      return { args }
    },
    template: `
      <Tooltip
        v-bind="args"
        @update:open="args.onUpdateOpen"
        @show="args.onShow"
        @hide="args.onHide"
      >
        <IconButton
          icon="pi pi-info-circle"
          aria-label="More information"
          kind="transparent"
          size="small"
        />
      </Tooltip>
    `
  }),
  args: {
    text: 'This tooltip contains a longer message that wraps across multiple lines when it exceeds the maximum width of the panel.'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Long text wraps within the tooltip max width (`var(--container-3xs)`). Hover or focus the info icon to preview multi-line layout.'
      }
    }
  }
}
