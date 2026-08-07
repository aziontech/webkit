import Avatar from '@aziontech/webkit/avatar'
import CommandMenu from '@aziontech/webkit/command-menu'
import CommandMenuEmpty from '@aziontech/webkit/command-menu-empty'
import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
import CommandMenuInput from '@aziontech/webkit/command-menu-input'
import CommandMenuItem from '@aziontech/webkit/command-menu-item'
import CommandMenuList from '@aziontech/webkit/command-menu-list'
import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'
import Dropdown from '@aziontech/webkit/dropdown'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Kbd from '@aziontech/webkit/kbd'
import Menu from '@aziontech/webkit/menu'
import MenuBack from '@aziontech/webkit/menu-back'
import MenuGroup from '@aziontech/webkit/menu-group'
import MenuItem from '@aziontech/webkit/menu-item'
import MenuSub from '@aziontech/webkit/menu-sub'
import MenuSubContent from '@aziontech/webkit/menu-sub-content'
import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
import Sidebar from '@aziontech/webkit/sidebar'
import SidebarFooter from '@aziontech/webkit/sidebar-footer'
import SidebarHeader from '@aziontech/webkit/sidebar-header'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT_SIDEBAR = "import Sidebar from '@aziontech/webkit/sidebar'"
const IMPORT_HEADER = "import SidebarHeader from '@aziontech/webkit/sidebar-header'"
const IMPORT_FOOTER = "import SidebarFooter from '@aziontech/webkit/sidebar-footer'"
const IMPORT_INPUT_TEXT = "import InputText from '@aziontech/webkit/input-text'"
const IMPORT_KBD = "import Kbd from '@aziontech/webkit/kbd'"
const IMPORT_AVATAR = "import Avatar from '@aziontech/webkit/avatar'"
const IMPORT_ICON_BUTTON = "import IconButton from '@aziontech/webkit/icon-button'"
const IMPORT_DROPDOWN = "import Dropdown from '@aziontech/webkit/dropdown'"
const IMPORT_DROPDOWN_TRIGGER = "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'"
const IMPORT_DROPDOWN_GROUP = "import DropdownGroup from '@aziontech/webkit/dropdown-group'"
const IMPORT_DROPDOWN_OPTION = "import DropdownOption from '@aziontech/webkit/dropdown-option'"
const IMPORT_COMMAND_MENU = "import CommandMenu from '@aziontech/webkit/command-menu'"
const IMPORT_COMMAND_MENU_INPUT =
  "import CommandMenuInput from '@aziontech/webkit/command-menu-input'"
const IMPORT_COMMAND_MENU_LIST = "import CommandMenuList from '@aziontech/webkit/command-menu-list'"
const IMPORT_COMMAND_MENU_GROUP =
  "import CommandMenuGroup from '@aziontech/webkit/command-menu-group'"
const IMPORT_COMMAND_MENU_ITEM = "import CommandMenuItem from '@aziontech/webkit/command-menu-item'"
const IMPORT_COMMAND_MENU_SEPARATOR =
  "import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'"
const IMPORT_COMMAND_MENU_EMPTY =
  "import CommandMenuEmpty from '@aziontech/webkit/command-menu-empty'"
const IMPORT_MENU = "import Menu from '@aziontech/webkit/menu'"
const IMPORT_MENU_BACK = "import MenuBack from '@aziontech/webkit/menu-back'"
const IMPORT_MENU_GROUP = "import MenuGroup from '@aziontech/webkit/menu-group'"
const IMPORT_MENU_ITEM = "import MenuItem from '@aziontech/webkit/menu-item'"
const IMPORT_MENU_SUB = "import MenuSub from '@aziontech/webkit/menu-sub'"
const IMPORT_MENU_SUB_TRIGGER = "import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'"
const IMPORT_MENU_SUB_CONTENT = "import MenuSubContent from '@aziontech/webkit/menu-sub-content'"
const IMPORT_VUE_REF = "import { ref } from 'vue'"

const sidebarStoryComponents = {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  InputText,
  Kbd,
  Avatar,
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownGroup,
  DropdownOption,
  CommandMenu,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuSeparator,
  CommandMenuEmpty,
  Menu,
  MenuBack,
  MenuGroup,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger
}

const sampleImage =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

const HEADER_SLOT = `<template #header>
    <SidebarHeader>
      <div class="cursor-pointer [&_input]:cursor-pointer" @click="paletteOpen = true" @keydown.enter="paletteOpen = true">
        <InputText
          model-value=""
          placeholder="Search"
          size="large"
          readonly
          aria-label="Search navigation and commands"
          aria-keyshortcuts="Meta+K"
        >
          <template #iconLeft><i class="pi pi-search" aria-hidden="true" /></template>
          <template #iconRight><Kbd meta size="small">K</Kbd></template>
        </InputText>
      </div>

      <CommandMenu v-model:open="paletteOpen">
        <CommandMenuInput placeholder="Search navigation and commands" />
        <CommandMenuList>
          <CommandMenuGroup heading="Build">
            <CommandMenuItem value="nav:applications">
              <template #prefix><i class="ai ai-edge-application" aria-hidden="true" /></template>
              Applications
            </CommandMenuItem>
            <CommandMenuItem value="nav:variables">
              <template #prefix><i class="ai ai-variables" aria-hidden="true" /></template>
              Variables
            </CommandMenuItem>
          </CommandMenuGroup>

          <CommandMenuSeparator />

          <CommandMenuGroup heading="Account">
            <CommandMenuItem value="cmd:settings">
              <template #prefix><i class="pi pi-cog" aria-hidden="true" /></template>
              Account Settings
            </CommandMenuItem>
          </CommandMenuGroup>

          <CommandMenuEmpty>No navigation or command matches your search.</CommandMenuEmpty>
        </CommandMenuList>
      </CommandMenu>
    </SidebarHeader>
  </template>`

const MENU_CONTENT = `<Menu role="presentation">
    <MenuBack />
    <MenuGroup>
      <MenuItem label="Home" icon="ai ai-home" href="/" selected />
      <MenuItem label="Marketplace" icon="ai ai-marketplace" href="/marketplace" />
    </MenuGroup>
    <MenuGroup label="Build">
      <MenuItem label="Applications" icon="ai ai-edge-application" href="/applications" />
      <MenuSub default-open>
        <MenuSubTrigger label="Edge Functions" kind="inline" />
        <MenuSubContent>
          <MenuItem label="Runtime APIs" href="/functions/runtime-apis" />
          <MenuItem label="Bundlers" href="/functions/bundlers" />
        </MenuSubContent>
      </MenuSub>
      <MenuItem label="Variables" icon="ai ai-variables" href="/variables" />
    </MenuGroup>
    <MenuGroup label="Store">
      <MenuItem label="Object Storage" icon="ai ai-edge-storage" href="/object-storage" />
      <MenuItem label="SQL Database" icon="ai ai-edge-sql" href="/sql-database" tag-value="Preview" tag-severity="primary" />
    </MenuGroup>
    <MenuGroup label="Account">
      <MenuSub>
        <MenuSubTrigger label="Settings" icon="pi pi-cog" kind="drill" />
        <MenuSubContent>
          <MenuGroup label="Organization">
            <MenuItem label="General" href="/settings/general" />
            <MenuItem label="Members" href="/settings/members" />
            <MenuItem label="Billing" href="/settings/billing" />
          </MenuGroup>
        </MenuSubContent>
      </MenuSub>
    </MenuGroup>
  </Menu>`

const FOOTER_SLOT = `<template #footer>
    <SidebarFooter class="flex items-center gap-[var(--spacing-xs)]">
      <Avatar kind="square" size="small" src="${sampleImage}" alt="Rafael Umman" />
      <span class="min-w-0 flex-1 truncate text-label-sm text-[var(--text-default)]">Rafael Umman</span>
      <Dropdown v-model:open="accountMenuOpen" placement="top-end">
        <DropdownTrigger>
          <IconButton icon="pi pi-ellipsis-v" aria-label="Account menu" kind="outlined" size="small" />
        </DropdownTrigger>
        <DropdownGroup>
          <template #top>
            <div class="flex min-w-0 flex-col">
              <span class="truncate text-label-md text-[var(--text-default)]">Rafael Umman</span>
              <span class="truncate text-body-xs text-[var(--text-muted)]">rafael.umman@example.com</span>
            </div>
          </template>
          <DropdownOption value="settings" label="Account Settings" />
          <DropdownOption value="personal-tokens" label="Personal Tokens" />
        </DropdownGroup>
        <DropdownGroup>
          <DropdownOption value="logout" label="Log Out">
            <template #right><i class="pi pi-sign-out" aria-hidden="true" /></template>
          </DropdownOption>
        </DropdownGroup>
      </Dropdown>
    </SidebarFooter>
  </template>`

const CONSOLE_IMPORTS = [
  IMPORT_SIDEBAR,
  IMPORT_HEADER,
  IMPORT_FOOTER,
  IMPORT_INPUT_TEXT,
  IMPORT_KBD,
  IMPORT_AVATAR,
  IMPORT_ICON_BUTTON,
  IMPORT_DROPDOWN,
  IMPORT_DROPDOWN_TRIGGER,
  IMPORT_DROPDOWN_GROUP,
  IMPORT_DROPDOWN_OPTION,
  IMPORT_COMMAND_MENU,
  IMPORT_COMMAND_MENU_INPUT,
  IMPORT_COMMAND_MENU_LIST,
  IMPORT_COMMAND_MENU_GROUP,
  IMPORT_COMMAND_MENU_ITEM,
  IMPORT_COMMAND_MENU_SEPARATOR,
  IMPORT_COMMAND_MENU_EMPTY,
  IMPORT_MENU,
  IMPORT_MENU_BACK,
  IMPORT_MENU_GROUP,
  IMPORT_MENU_ITEM,
  IMPORT_MENU_SUB,
  IMPORT_MENU_SUB_TRIGGER,
  IMPORT_MENU_SUB_CONTENT,
  IMPORT_VUE_REF
]

const DEFAULT_SOURCE = `<Sidebar aria-label="Console" class="h-screen w-[280px]">
  ${HEADER_SLOT}
  ${MENU_CONTENT}
  ${FOOTER_SLOT}
</Sidebar>`

const RESIZABLE_SOURCE = `<div class="relative flex h-screen min-h-0">
  <Sidebar v-model:collapsed="collapsed" v-model:width="width" resizable collapsible aria-label="Console">
    ${HEADER_SLOT}
    ${MENU_CONTENT}
    ${FOOTER_SLOT}
  </Sidebar>

  <main class="min-w-0 flex-1 p-[var(--spacing-lg)]">
    <p class="text-body-sm text-[var(--text-muted)]">
      The page morphs as the rail animates — it is a flex sibling, so it fills the freed space on the same frames.
    </p>
  </main>
</div>`

/** @type {import('@storybook/vue3').Meta<typeof Sidebar>} */
const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  subcomponents: {
    SidebarHeader,
    SidebarFooter,
    Menu
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
          'Helps users move between views or sections. Composable application sidebar with optional header and footer regions; navigation content scrolls inside a built-in `ScrollArea`. It also owns the rail gesture — `resizable` adds a drag handle on the trailing edge, `collapsible` adds the collapse trigger at the bottom and the affordance that brings a collapsed rail back. Both are opt-in and independent: with neither set the sidebar renders exactly as it always has, with the host owning the width. Navigation is composed with [`Menu`](/docs/components-navigation-menu--docs), which fills the width the sidebar gives it and adds no outer margin.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Sidebar'" }
      }
    },
    resizable: {
      control: 'boolean',
      description:
        'Adds the drag handle on the trailing edge; dragging past the minimum collapses the rail.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    collapsible: {
      control: 'boolean',
      description:
        'Adds the collapse trigger at the bottom of the rail and the edge affordance that brings a collapsed rail back.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    minWidthToken: {
      control: 'text',
      description:
        'Theme container token the sized width is clamped up to, read off the document at runtime.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'--container-3xs'" }
      }
    },
    maxWidthToken: {
      control: 'text',
      description:
        'Theme container token the sized width is clamped down to, read off the document at runtime.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'--container-sm'" }
      }
    },
    collapseAriaLabel: {
      control: 'text',
      description: 'Accessible name for the collapse trigger.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Collapse sidebar'" }
      }
    },
    expandAriaLabel: {
      control: 'text',
      description:
        'Accessible name for the control and the grab bar that bring a collapsed rail back.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Expand sidebar'" }
      }
    },
    resizeAriaLabel: {
      control: 'text',
      description: 'Accessible name for the drag handle separator.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Resize sidebar'" }
      }
    },
    'onUpdate:collapsed': {
      action: 'update:collapsed',
      description:
        'The rail entered or left the layout (`v-model:collapsed`) — by the trigger, the drag crossing the snap boundary, the keyboard nudge, or a double-click on the handle.',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    'onUpdate:width': {
      action: 'update:width',
      description:
        'The sized width in px (`v-model:width`), already clamped to the token bounds. Emitted continuously during a drag.',
      table: { category: 'events', type: { summary: 'number | null' } }
    },
    default: {
      control: false,
      description: 'The navigation — a `Menu`. Region padding is applied by `Sidebar`.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    header: {
      control: false,
      description: 'Optional top region (search, branding).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    footer: {
      control: false,
      description:
        'Optional bottom region (profile, actions). With `collapsible`, the collapse trigger trails this content in the same row.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    ariaLabel: 'Console',
    resizable: false,
    collapsible: false
  }
}

export default meta

const consoleState = () => {
  const paletteOpen = ref(false)
  const accountMenuOpen = ref(false)
  return { paletteOpen, accountMenuOpen }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const Default = {
  render: (args) => ({
    components: sidebarStoryComponents,
    setup: () => ({ args, ...consoleState() }),
    template: `
      <Sidebar v-bind="args" class="h-screen w-[280px]">
        ${HEADER_SLOT}
        ${MENU_CONTENT}
        ${FOOTER_SLOT}
      </Sidebar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The console rail, whole: a header whose search field opens a ⌘K palette, grouped navigation composed with `Menu`, and a footer carrying the account identity and its menu. The navigation scrolls inside the built-in `ScrollArea` while the header and footer stay put. `Menu` takes `role="presentation"` because the sidebar is already the `<nav>` landmark — it drops its accessible name with the role, so the region has exactly one name. Expand "Edge Functions" for a level that opens in place behind the indent rail; activate "Settings" for a drill level that replaces the menu.'
      },
      source: { code: toSfc(CONSOLE_IMPORTS, DEFAULT_SOURCE) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const Resizable = {
  render: (args) => ({
    components: sidebarStoryComponents,
    setup() {
      const collapsed = ref(false)
      const width = ref(null)
      return { args, collapsed, width, ...consoleState() }
    },
    template: `
      <div class="relative flex h-[560px] min-h-0">
        <Sidebar v-bind="args" v-model:collapsed="collapsed" v-model:width="width">
          ${HEADER_SLOT}
          ${MENU_CONTENT}
          ${FOOTER_SLOT}
        </Sidebar>

        <main class="min-w-0 flex-1 p-[var(--spacing-lg)]">
          <p class="text-body-sm text-[var(--text-muted)]">
            The page morphs as the rail animates — it is a flex sibling, so it fills the freed space on the same frames.
          </p>
        </main>
      </div>
    `
  }),
  args: {
    resizable: true,
    collapsible: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same console rail with the gesture on. Drag the trailing edge to size it between `--container-3xs` and `--container-sm`; keep pulling past the minimum and it drops out of the layout, keeping the width it had for when it comes back. The handle is a focusable separator that reports its position, so arrows nudge it and `ArrowLeft` past the boundary collapses — double-click does too. The collapse trigger sits at the bottom, trailing the account row so the two read as one footer. While collapsed the rail is `inert` and `aria-hidden` (it stays mounted so its width can animate), which is exactly why the way back is a sibling. Collapse it, then rest the pointer on the left edge: the rail **previews itself** back in to `--size-10` and the page morphs with it, with the grab bar and the expand button on top of the sliver. The zone grows to the sliver so it never slips out from under the pointer, and the sliver stays `inert` — it shows you the way back, the button takes it.'
      },
      source: {
        code: toSfc(
          [...CONSOLE_IMPORTS, '', 'const collapsed = ref(false)', 'const width = ref(null)'],
          RESIZABLE_SOURCE
        )
      }
    }
  }
}
