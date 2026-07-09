import Avatar from '@aziontech/webkit/avatar'
import Dropdown from '@aziontech/webkit/dropdown'
import InputText from '@aziontech/webkit/input-text'
import MenuItem from '@aziontech/webkit/menu-item'
import Sidebar from '@aziontech/webkit/sidebar'
import SidebarFooter from '@aziontech/webkit/sidebar-footer'
import SidebarGroup from '@aziontech/webkit/sidebar-group'
import SidebarHeader from '@aziontech/webkit/sidebar-header'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT_SIDEBAR = "import Sidebar from '@aziontech/webkit/sidebar'"
const IMPORT_GROUP = "import SidebarGroup from '@aziontech/webkit/sidebar-group'"
const IMPORT_HEADER = "import SidebarHeader from '@aziontech/webkit/sidebar-header'"
const IMPORT_FOOTER = "import SidebarFooter from '@aziontech/webkit/sidebar-footer'"
const IMPORT_MENU_ITEM = "import MenuItem from '@aziontech/webkit/menu-item'"
const IMPORT_INPUT_TEXT = "import InputText from '@aziontech/webkit/input-text'"
const IMPORT_AVATAR = "import Avatar from '@aziontech/webkit/avatar'"
const IMPORT_DROPDOWN = "import Dropdown from '@aziontech/webkit/dropdown'"
const IMPORT_VUE_REF = "import { ref } from 'vue'"

const sampleImage =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

// Navigation content shared by every story — root links plus grouped sections,
// including a selected item and a trailing tag. Reused by both the render
// template and the "Show code" snippet so canvas and source never drift.
const NAV_CONTENT = `<SidebarGroup>
    <MenuItem label="Home" icon="ai ai-home" href="/" selected />
    <MenuItem label="Marketplace" icon="ai ai-marketplace" href="/marketplace" />
    <MenuItem label="Domains" icon="ai ai-workloads" href="/domains" />
  </SidebarGroup>
  <SidebarGroup label="Build">
    <MenuItem label="Applications" icon="ai ai-edge-application" href="/applications" />
    <MenuItem label="Variables" icon="ai ai-variables" href="/variables" />
  </SidebarGroup>
  <SidebarGroup label="Secure">
    <MenuItem label="Connectors" icon="ai ai-edge-connectors" href="/connectors" />
    <MenuItem label="Edge DNS" icon="ai ai-edge-dns" href="/edge-dns" />
    <MenuItem label="Firewalls" icon="ai ai-edge-firewall" href="/firewalls" />
  </SidebarGroup>
  <SidebarGroup label="Store">
    <MenuItem label="Object Storage" icon="ai ai-edge-storage" href="/object-storage" />
    <MenuItem label="SQL Database" icon="ai ai-edge-sql" href="/sql-database" tag-value="Preview" tag-severity="primary" />
  </SidebarGroup>
  <SidebarGroup label="Observe">
    <MenuItem label="Data Stream" icon="ai ai-data-stream" href="/data-stream" />
    <MenuItem label="Real-Time Metrics" icon="ai ai-real-time-metrics" href="/real-time-metrics" />
  </SidebarGroup>`

const HEADER_SLOT = `<template #header>
    <SidebarHeader>
      <InputText placeholder="Search" size="medium" />
    </SidebarHeader>
  </template>`

const FOOTER_SLOT = `<template #footer>
    <SidebarFooter>
      <Dropdown v-model:open="profileMenuOpen" placement="top-start">
        <Dropdown.Trigger class="block w-full">
          <button
            type="button"
            class="flex w-full items-center gap-[var(--spacing-sm)] rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-canvas)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-left transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
            aria-label="Open profile menu"
          >
            <Avatar kind="square" size="medium" src="${sampleImage}" alt="Rafael Umman" />
            <span class="flex min-w-0 flex-1 flex-col justify-center">
              <span class="truncate text-label-sm text-[var(--text-default)]">Rafael Umman</span>
              <span class="truncate text-label-sm text-[var(--text-muted)]">rafael.umman@example.com</span>
            </span>
            <i class="pi pi-sort-alt text-[var(--text-muted)]" aria-hidden="true" />
          </button>
        </Dropdown.Trigger>
        <Dropdown.Group>
          <Dropdown.Option value="account-settings" label="Account Settings" />
          <Dropdown.Option value="billing" label="Billing" />
          <Dropdown.Option value="credentials" label="Credentials" />
        </Dropdown.Group>
        <Dropdown.Group>
          <Dropdown.Option value="logout" label="Log out">
            <template #left>
              <i class="pi pi-sign-out" aria-hidden="true" />
            </template>
          </Dropdown.Option>
        </Dropdown.Group>
      </Dropdown>
    </SidebarFooter>
  </template>`

const DEFAULT_SOURCE = `<Sidebar aria-label="Application" class="h-screen w-[280px]">
  ${NAV_CONTENT}
</Sidebar>`

const HEADER_SOURCE = `<Sidebar aria-label="Application" class="h-screen w-[280px]">
  ${HEADER_SLOT}
  ${NAV_CONTENT}
</Sidebar>`

const FOOTER_SOURCE = `<Sidebar aria-label="Application" class="h-screen w-[280px]">
  ${HEADER_SLOT}
  ${NAV_CONTENT}
  ${FOOTER_SLOT}
</Sidebar>`

/** @type {import('@storybook/vue3').Meta<typeof Sidebar>} */
const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  subcomponents: {
    SidebarHeader,
    SidebarGroup,
    SidebarFooter,
    MenuItem
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
          'Helps users move between views or sections. Composable application sidebar with optional header and footer regions; navigation content scrolls inside a built-in `ScrollArea`.'
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
    default: {
      control: false,
      description:
        'Navigation groups and menu items; region padding and group gap are applied by `Sidebar`.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    header: {
      control: false,
      description: 'Optional top region (search, branding).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    footer: {
      control: false,
      description: 'Optional bottom region (profile, actions).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    ariaLabel: 'Application'
  }
}

export default meta

// The `ariaLabel` control drives the root landmark name; the header/footer
// slots are toggled per story. `profileMenuOpen` backs the footer Dropdown's
// v-model:open so the account menu opens above its trigger.
const makeSidebar =
  ({ withHeader = false, withFooter = false } = {}) =>
  (args) => ({
    components: {
      Sidebar,
      SidebarHeader,
      SidebarGroup,
      SidebarFooter,
      MenuItem,
      InputText,
      Avatar,
      Dropdown
    },
    setup() {
      const profileMenuOpen = ref(false)
      return { args, profileMenuOpen }
    },
    template: `
      <Sidebar v-bind="args" class="h-screen w-[280px]">
        ${withHeader ? HEADER_SLOT : ''}
        ${NAV_CONTENT}
        ${withFooter ? FOOTER_SLOT : ''}
      </Sidebar>
    `
  })

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const Default = {
  render: makeSidebar(),
  parameters: {
    docs: {
      description: {
        story:
          'Content-only sidebar (no header and no footer); navigation groups scroll inside the built-in ScrollArea.'
      },
      source: { code: toSfc([IMPORT_SIDEBAR, IMPORT_GROUP, IMPORT_MENU_ITEM], DEFAULT_SOURCE) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const WithHeaderSearch = {
  render: makeSidebar({ withHeader: true }),
  parameters: {
    docs: {
      description: {
        story: 'Adds the header region with a search input wrapped in SidebarHeader.'
      },
      source: {
        code: toSfc(
          [IMPORT_SIDEBAR, IMPORT_HEADER, IMPORT_GROUP, IMPORT_MENU_ITEM, IMPORT_INPUT_TEXT],
          HEADER_SOURCE
        )
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const WithHeaderAndProfileFooter = {
  render: makeSidebar({ withHeader: true, withFooter: true }),
  parameters: {
    docs: {
      description: {
        story:
          'Header search plus a profile footer whose account Dropdown opens above the trigger (placement="top-start").'
      },
      source: {
        code: toSfc(
          [
            IMPORT_SIDEBAR,
            IMPORT_HEADER,
            IMPORT_GROUP,
            IMPORT_MENU_ITEM,
            IMPORT_INPUT_TEXT,
            IMPORT_FOOTER,
            IMPORT_AVATAR,
            IMPORT_DROPDOWN,
            IMPORT_VUE_REF,
            '',
            'const profileMenuOpen = ref(false)'
          ],
          FOOTER_SOURCE
        )
      }
    }
  }
}
