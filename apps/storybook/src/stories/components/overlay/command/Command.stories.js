import Button from '@aziontech/webkit/button'
import Command from '@aziontech/webkit/command'
import CommandEmpty from '@aziontech/webkit/command-empty'
import CommandGroup from '@aziontech/webkit/command-group'
import CommandInput from '@aziontech/webkit/command-input'
import CommandItem from '@aziontech/webkit/command-item'
import CommandList from '@aziontech/webkit/command-list'
import CommandSeparator from '@aziontech/webkit/command-separator'
import Input from '@aziontech/webkit/input'
import Kbd from '@aziontech/webkit/kbd'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

// The palette panel teleports to `document.body`, so a story that forced `open`
// would stack its panel on top of every other story's panel on the Docs page.
// Every story therefore starts closed and ships its own opening affordance,
// matching the `dialog` story pattern.
const IMPORT_ROOT = "import Command from '@aziontech/webkit/command'"
const IMPORT_INPUT = "import CommandInput from '@aziontech/webkit/command-input'"
const IMPORT_LIST = "import CommandList from '@aziontech/webkit/command-list'"
const IMPORT_GROUP = "import CommandGroup from '@aziontech/webkit/command-group'"
const IMPORT_ITEM = "import CommandItem from '@aziontech/webkit/command-item'"
const IMPORT_EMPTY = "import CommandEmpty from '@aziontech/webkit/command-empty'"
const IMPORT_SEPARATOR = "import CommandSeparator from '@aziontech/webkit/command-separator'"
const IMPORT_BUTTON = "import Button from '@aziontech/webkit/button'"
const IMPORT_INPUT_TEXT = "import Input from '@aziontech/webkit/input'"
const IMPORT_KBD = "import Kbd from '@aziontech/webkit/kbd'"
const IMPORT_VUE = "import { ref } from 'vue'"
const OPEN_REF = ['', 'const open = ref(false)']

const commandMenuStoryComponents = {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
  Button,
  Input,
  Kbd
}

/** @type {import('@storybook/vue3').Meta<typeof Command>} */
const meta = {
  title: 'Components/Primitives/Overlay/Command',
  component: Command,
  subcomponents: {
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
    CommandSeparator
  },
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
          'A ⌘K command palette: a modal overlay with a search input and a filtered, keyboard-navigable list of actions. It wraps the Dialog primitive for panel, backdrop, focus trap, scroll-lock, and Escape, and adds a search input, a scrollable list of items organized into optional groups, an empty state, and separators. Every story below starts closed — open it from the affordance in the canvas, then filter by typing, move with ArrowUp / ArrowDown, activate with Enter, and close with Escape.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  decorators: [
    () => ({
      template: '<div class="flex min-h-[180px] w-full items-center justify-center"><story /></div>'
    })
  ],
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
        "Global '+'-delimited keyboard shortcut that toggles the palette open (e.g. 'meta+k'). Pass an empty string to opt out of the global binding.",
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
      description: 'The palette content: a CommandInput followed by a CommandList.',
      table: { category: 'slots' }
    }
  },
  args: {
    defaultOpen: false,
    dismissible: true,
    shortcut: 'meta+k'
  }
}

export default meta

// The real entry point: a large read-only search field carrying a ⌘K hint. It is
// the only story that keeps the global `meta+k` binding, so pressing ⌘K on the
// Docs page opens exactly one palette.
const DEFAULT_RENDER_TEMPLATE = `<Input
  model-value=""
  placeholder="Search…"
  size="large"
  readonly
  aria-keyshortcuts="Meta+K"
  class="max-w-[360px] cursor-pointer"
  @click="onUpdate(true)"
  @keydown.enter="onUpdate(true)"
>
  <template #iconLeft>
    <span class="pi pi-search" aria-hidden="true" />
  </template>
  <template #iconRight>
    <Kbd meta size="small">K</Kbd>
  </template>
</Input>

<Command v-bind="args" :open="open" @update:open="onUpdate">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem value="deploy">Deploy Project</CommandItem>
      <CommandItem value="new-app">Create Application</CommandItem>
      <CommandItem value="settings">Go to Settings</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Commands">
      <CommandItem value="search" shortcut="meta+k">Search everything</CommandItem>
      <CommandItem value="new-app-cmd" shortcut="meta+n">New Application</CommandItem>
      <CommandItem value="toggle-theme" shortcut="meta+shift+l">Toggle Theme</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

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

const DEFAULT_SNIPPET = `<Input
  model-value=""
  placeholder="Search…"
  size="large"
  readonly
  aria-keyshortcuts="Meta+K"
  class="max-w-[360px] cursor-pointer"
  @click="open = true"
  @keydown.enter="open = true"
>
  <template #iconLeft>
    <span class="pi pi-search" aria-hidden="true" />
  </template>
  <template #iconRight>
    <Kbd meta size="small">K</Kbd>
  </template>
</Input>

<Command v-model:open="open" shortcut="meta+k">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem value="deploy">Deploy Project</CommandItem>
      <CommandItem value="new-app">Create Application</CommandItem>
      <CommandItem value="settings">Go to Settings</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Commands">
      <CommandItem value="search" shortcut="meta+k">Search everything</CommandItem>
      <CommandItem value="new-app-cmd" shortcut="meta+n">New Application</CommandItem>
      <CommandItem value="toggle-theme" shortcut="meta+shift+l">Toggle Theme</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

/** @type {import('@storybook/vue3').StoryObj<typeof Command>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The intended entry point: a large search field with a ⌘K hint that opens the palette via `v-model:open`, plus the global `meta+k` (⌘K / Ctrl+K) shortcut. Inside, a "Suggestions" group of plain-label items and a "Commands" group whose items carry ⌘ shortcut hints rendered via Kbd.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_VUE,
            IMPORT_ROOT,
            IMPORT_INPUT,
            IMPORT_LIST,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_SEPARATOR,
            IMPORT_INPUT_TEXT,
            IMPORT_KBD,
            ...OPEN_REF
          ],
          DEFAULT_SNIPPET
        )
      }
    }
  }
}

// The stories below opt out of the global binding (`shortcut=""`) so the Docs
// page has a single ⌘K owner — the Default story above. One template const per
// story renders the canvas AND builds the snippet, so the two cannot drift.
// Three groups, only one separator — so the story shows both ways groups are
// spaced (around a separator, and between two bare groups). Half the items carry
// a `prefix` icon and half do not: the box is rendered only by the rows that
// supply a glyph, so an icon-less row carries no empty column.
const GROUPED_TEMPLATE = `<Button label="Open grouped palette" kind="primary" @click="open = true" />

<Command v-model:open="open" shortcut="">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem value="deploy">
        <template #prefix><i class="pi pi-cloud-upload" aria-hidden="true" /></template>
        Deploy Project
      </CommandItem>
      <CommandItem value="new-app">Create Application</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Navigation">
      <CommandItem value="settings">
        <template #prefix><i class="pi pi-cog" aria-hidden="true" /></template>
        Go to Settings
      </CommandItem>
      <CommandItem value="billing">Go to Billing</CommandItem>
    </CommandGroup>
    <CommandGroup heading="Account">
      <CommandItem value="profile">
        <template #prefix><i class="pi pi-user" aria-hidden="true" /></template>
        View Profile
      </CommandItem>
      <CommandItem value="logout">Log Out</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

export const Grouped = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(false)
      return { open }
    },
    template: GROUPED_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Three labeled groups — the central grouping anatomy — showing both spacings: `--spacing-sm` above a `CommandSeparator` and `--spacing-xs` below it, and `--spacing-sm` between two groups with no separator between them. Half the items carry a `prefix` icon and half do not; the leading box is rendered only by the rows that supply a glyph, so an icon-less row puts no empty element in the DOM and carries no indent. Opens from a button; `shortcut=""` opts out of the global binding so only Default owns ⌘K on this page.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_VUE,
            IMPORT_ROOT,
            IMPORT_INPUT,
            IMPORT_LIST,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_SEPARATOR,
            IMPORT_BUTTON,
            ...OPEN_REF
          ],
          GROUPED_TEMPLATE
        )
      }
    }
  }
}

const SHORTCUTS_TEMPLATE = `<Button label="Open palette with shortcuts" kind="primary" @click="open = true" />

<Command v-model:open="open" shortcut="">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem value="command" shortcut="meta+k">Open Command Menu</CommandItem>
      <CommandItem value="command-palette" shortcut="meta+shift+p">Open Command Palette</CommandItem>
      <CommandItem value="close" shortcut="esc">Close Overlay</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

export const WithShortcuts = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(false)
      return { open }
    },
    template: SHORTCUTS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Items carrying keyboard-shortcut hints rendered on the right via Kbd. The item `shortcut` is display only — it does not register a binding. Opens from a button; `shortcut=""` on the root opts out of the global binding.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_VUE,
            IMPORT_ROOT,
            IMPORT_INPUT,
            IMPORT_LIST,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_BUTTON,
            ...OPEN_REF
          ],
          SHORTCUTS_TEMPLATE
        )
      }
    }
  }
}

const EMPTY_TEMPLATE = `<Button label="Open empty palette" kind="primary" @click="open = true" />

<Command v-model:open="open" shortcut="">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandEmpty>No commands found.</CommandEmpty>
  </CommandList>
</Command>`

export const Empty = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(false)
      return { open }
    },
    template: EMPTY_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The empty state, shown when the filter yields no visible items. Opens from a button; `shortcut=""` opts out of the global binding.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_VUE,
            IMPORT_ROOT,
            IMPORT_INPUT,
            IMPORT_LIST,
            IMPORT_EMPTY,
            IMPORT_BUTTON,
            ...OPEN_REF
          ],
          EMPTY_TEMPLATE
        )
      }
    }
  }
}

const DISABLED_TEMPLATE = `<Button label="Open palette with a disabled item" kind="primary" @click="open = true" />

<Command v-model:open="open" shortcut="">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem value="deploy">Deploy Project</CommandItem>
      <CommandItem value="publish" disabled>Publish Release</CommandItem>
      <CommandItem value="new-app">Create Application</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

export const Disabled = {
  render: () => ({
    components: commandMenuStoryComponents,
    setup() {
      const open = ref(false)
      return { open }
    },
    template: DISABLED_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A disabled item alongside enabled ones — skipped by roving navigation and never activated. Opens from a button; `shortcut=""` opts out of the global binding.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_VUE,
            IMPORT_ROOT,
            IMPORT_INPUT,
            IMPORT_LIST,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_BUTTON,
            ...OPEN_REF
          ],
          DISABLED_TEMPLATE
        )
      }
    }
  }
}
