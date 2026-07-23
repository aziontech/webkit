import CommandMenu from '@aziontech/webkit/command-menu'
import CommandMenuEmpty from '@aziontech/webkit/command-menu-empty'
import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
import CommandMenuInput from '@aziontech/webkit/command-menu-input'
import CommandMenuItem from '@aziontech/webkit/command-menu-item'
import CommandMenuList from '@aziontech/webkit/command-menu-list'
import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CommandMenu from '@aziontech/webkit/command-menu'"

const commandMenuStoryComponents = {
  CommandMenu,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuEmpty,
  CommandMenuSeparator
}

/** @type {import('@storybook/vue3').Meta<typeof CommandMenu>} */
const meta = {
  title: 'Components/Overlay/CommandMenu',
  component: CommandMenu,
  subcomponents: {
    CommandMenuInput,
    CommandMenuList,
    CommandMenuGroup,
    CommandMenuItem,
    CommandMenuEmpty,
    CommandMenuSeparator
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
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
          'A ⌘K command palette: a modal overlay with a search input and a filtered, keyboard-navigable list of actions. It wraps the Dialog primitive for panel, backdrop, focus trap, scroll-lock, and Escape, and adds a search input, a scrollable list of items organized into optional groups, an empty state, and separators.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state. Use with `v-model:open` or `@update:open`.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    dismissible: {
      control: 'boolean',
      description: 'When true, backdrop click and Escape close the palette.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    shortcut: {
      control: 'text',
      description:
        "Global '+'-delimited keyboard shortcut that toggles the palette open (e.g. 'meta+k').",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'meta+k'" }
      }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted on every open/closed transition (v-model:open).',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    onSelect: {
      action: 'select',
      description:
        'Emitted when an enabled item is activated; payload is the activation event and the item value.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent | KeyboardEvent, value: string | number)' }
      }
    },
    default: {
      control: false,
      description: 'The palette content: a CommandMenu.Input followed by a CommandMenu.List.',
      table: { category: 'slots' }
    }
  },
  args: {
    open: true,
    dismissible: true,
    shortcut: 'meta+k'
  }
}

export default meta

const DEFAULT_RENDER_TEMPLATE = `<CommandMenu v-bind="args" :open="open" @update:open="onUpdate">
  <CommandMenuInput placeholder="Search commands…" />
  <CommandMenuList>
    <CommandMenuGroup heading="Actions">
      <CommandMenuItem value="deploy">Deploy Project</CommandMenuItem>
      <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
      <CommandMenuItem value="settings">Go to Settings</CommandMenuItem>
    </CommandMenuGroup>
  </CommandMenuList>
</CommandMenu>`

const Template = (args) => ({
  components: commandMenuStoryComponents,
  setup() {
    const open = ref(args.open ?? args.defaultOpen ?? false)
    watch(
      () => args.open,
      (next) => {
        if (next !== undefined) open.value = next
      }
    )
    const onUpdate = (next) => {
      open.value = next
      args['onUpdate:open']?.(next)
    }
    return { args, open, onUpdate }
  },
  template: DEFAULT_RENDER_TEMPLATE
})

const DEFAULT_SNIPPET = `<CommandMenu open shortcut="meta+k">
  <CommandMenu.Input placeholder="Search commands…" />
  <CommandMenu.List>
    <CommandMenu.Group heading="Actions">
      <CommandMenu.Item value="deploy">Deploy Project</CommandMenu.Item>
      <CommandMenu.Item value="new-app">Create Application</CommandMenu.Item>
      <CommandMenu.Item value="settings">Go to Settings</CommandMenu.Item>
    </CommandMenu.Group>
  </CommandMenu.List>
</CommandMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof CommandMenu>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'A controlled palette with one input, one group, and several items (no shortcuts).'
      },
      source: { code: toSfc(IMPORT, DEFAULT_SNIPPET) }
    }
  }
}

const GROUPED_TEMPLATE = `<CommandMenu :open="open" shortcut="meta+k" @update:open="open = $event">
  <CommandMenuInput placeholder="Search commands…" />
  <CommandMenuList>
    <CommandMenuGroup heading="Actions">
      <CommandMenuItem value="deploy">Deploy Project</CommandMenuItem>
      <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
    </CommandMenuGroup>
    <CommandMenuSeparator />
    <CommandMenuGroup heading="Navigation">
      <CommandMenuItem value="settings">Go to Settings</CommandMenuItem>
      <CommandMenuItem value="billing">Go to Billing</CommandMenuItem>
    </CommandMenuGroup>
  </CommandMenuList>
</CommandMenu>`

const GROUPED_SNIPPET = `<CommandMenu open shortcut="meta+k">
  <CommandMenu.Input placeholder="Search commands…" />
  <CommandMenu.List>
    <CommandMenu.Group heading="Actions">
      <CommandMenu.Item value="deploy">Deploy Project</CommandMenu.Item>
      <CommandMenu.Item value="new-app">Create Application</CommandMenu.Item>
    </CommandMenu.Group>
    <CommandMenu.Separator />
    <CommandMenu.Group heading="Navigation">
      <CommandMenu.Item value="settings">Go to Settings</CommandMenu.Item>
      <CommandMenu.Item value="billing">Go to Billing</CommandMenu.Item>
    </CommandMenu.Group>
  </CommandMenu.List>
</CommandMenu>`

export const Grouped = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(true)
      return { open }
    },
    template: GROUPED_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Two labeled groups separated by a divider — the central grouping anatomy.'
      },
      source: { code: toSfc(IMPORT, GROUPED_SNIPPET) }
    }
  }
}

const SHORTCUTS_TEMPLATE = `<CommandMenu :open="open" shortcut="meta+k" @update:open="open = $event">
  <CommandMenuInput placeholder="Search commands…" />
  <CommandMenuList>
    <CommandMenuGroup heading="Actions">
      <CommandMenuItem value="command-menu" shortcut="meta+k">Open Command Menu</CommandMenuItem>
      <CommandMenuItem value="command-palette" shortcut="meta+shift+p">Open Command Palette</CommandMenuItem>
      <CommandMenuItem value="close" shortcut="esc">Close Overlay</CommandMenuItem>
    </CommandMenuGroup>
  </CommandMenuList>
</CommandMenu>`

const SHORTCUTS_SNIPPET = `<CommandMenu open shortcut="meta+k">
  <CommandMenu.Input placeholder="Search commands…" />
  <CommandMenu.List>
    <CommandMenu.Group heading="Actions">
      <CommandMenu.Item value="command-menu" shortcut="meta+k">Open Command Menu</CommandMenu.Item>
      <CommandMenu.Item value="command-palette" shortcut="meta+shift+p">Open Command Palette</CommandMenu.Item>
      <CommandMenu.Item value="close" shortcut="esc">Close Overlay</CommandMenu.Item>
    </CommandMenu.Group>
  </CommandMenu.List>
</CommandMenu>`

export const WithShortcuts = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(true)
      return { open }
    },
    template: SHORTCUTS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Items carrying keyboard-shortcut hints rendered on the right via Kbd.'
      },
      source: { code: toSfc(IMPORT, SHORTCUTS_SNIPPET) }
    }
  }
}

const EMPTY_TEMPLATE = `<CommandMenu :open="open" shortcut="meta+k" @update:open="open = $event">
  <CommandMenuInput placeholder="Search commands…" />
  <CommandMenuList>
    <CommandMenuEmpty>No commands found.</CommandMenuEmpty>
  </CommandMenuList>
</CommandMenu>`

const EMPTY_SNIPPET = `<CommandMenu open shortcut="meta+k">
  <CommandMenu.Input placeholder="Search commands…" />
  <CommandMenu.List>
    <CommandMenu.Empty>No commands found.</CommandMenu.Empty>
  </CommandMenu.List>
</CommandMenu>`

export const Empty = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(true)
      return { open }
    },
    template: EMPTY_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'The empty state, shown when the filter yields no visible items.'
      },
      source: { code: toSfc(IMPORT, EMPTY_SNIPPET) }
    }
  }
}

const DISABLED_TEMPLATE = `<CommandMenu :open="open" shortcut="meta+k" @update:open="open = $event">
  <CommandMenuInput placeholder="Search commands…" />
  <CommandMenuList>
    <CommandMenuGroup heading="Actions">
      <CommandMenuItem value="deploy">Deploy Project</CommandMenuItem>
      <CommandMenuItem value="publish" disabled>Publish Release</CommandMenuItem>
      <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
    </CommandMenuGroup>
  </CommandMenuList>
</CommandMenu>`

const DISABLED_SNIPPET = `<CommandMenu open shortcut="meta+k">
  <CommandMenu.Input placeholder="Search commands…" />
  <CommandMenu.List>
    <CommandMenu.Group heading="Actions">
      <CommandMenu.Item value="deploy">Deploy Project</CommandMenu.Item>
      <CommandMenu.Item value="publish" disabled>Publish Release</CommandMenu.Item>
      <CommandMenu.Item value="new-app">Create Application</CommandMenu.Item>
    </CommandMenu.Group>
  </CommandMenu.List>
</CommandMenu>`

export const Disabled = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(true)
      return { open }
    },
    template: DISABLED_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'A disabled item alongside enabled ones — skipped by roving navigation.'
      },
      source: { code: toSfc(IMPORT, DISABLED_SNIPPET) }
    }
  }
}
