import Avatar from '@aziontech/webkit/content/avatar'
import InputText from '@aziontech/webkit/inputs/input-text'
import Sidebar from '@aziontech/webkit/layout/sidebar'
import SidebarFooter from '@aziontech/webkit/layout/sidebar-footer'
import SidebarGroup from '@aziontech/webkit/layout/sidebar-group'
import MenuItem from '@aziontech/webkit/navigation/menu-item'
import DropdownMenu from '@aziontech/webkit/overlay/dropdown-menu'
import DropdownMenuContent from '@aziontech/webkit/overlay/dropdown-menu-content'
import DropdownMenuItem from '@aziontech/webkit/overlay/dropdown-menu-item'
import DropdownMenuPortal from '@aziontech/webkit/overlay/dropdown-menu-portal'
import DropdownMenuSeparator from '@aziontech/webkit/overlay/dropdown-menu-separator'
import DropdownMenuTrigger from '@aziontech/webkit/overlay/dropdown-menu-trigger'
import { ref } from 'vue'

const sampleImage =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

const profileMenuHeaderClasses =
  'flex flex-col gap-[var(--spacing-1)] px-[var(--spacing-2)] py-[var(--spacing-2)]'

const profileMenuContentClasses = 'w-[18.625rem] min-w-[18.625rem]'

const componentDocsDescription = [
  'Helps users move between views or sections. Composable application sidebar with optional header and footer regions; navigation content scrolls inside a built-in `ScrollArea`.',
  '',
  '## Usage',
  '',
  '```vue',
  '<script setup>',
  "import Sidebar from '@aziontech/webkit/layout/sidebar'",
  "import SidebarGroup from '@aziontech/webkit/layout/sidebar-group'",
  "import SidebarHeader from '@aziontech/webkit/layout/sidebar-header'",
  "import SidebarFooter from '@aziontech/webkit/layout/sidebar-footer'",
  "import MenuItem from '@aziontech/webkit/navigation/menu-item'",
  '</script>',
  '',
  '<template>',
  '  <Sidebar aria-label="Application" class="h-screen w-[280px]">',
  '    <template #header>',
  '      <SidebarHeader>',
  '        <!-- optional header content -->',
  '      </SidebarHeader>',
  '    </template>',
  '    <SidebarGroup>',
  '      <MenuItem label="Home" icon="ai ai-home" href="/" selected />',
  '    </SidebarGroup>',
  '    <SidebarGroup label="Build">',
  '      <MenuItem label="Applications" icon="ai ai-edge-application" href="/applications" />',
  '    </SidebarGroup>',
  '    <template #footer>',
  '      <SidebarFooter>',
  '        <!-- optional footer content -->',
  '      </SidebarFooter>',
  '    </template>',
  '  </Sidebar>',
  '</template>',
  '```'
].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof Sidebar>} */
const meta = {
  title: 'Webkit/Layout/Sidebar',
  component: Sidebar,
  subcomponents: {
    SidebarGroup,
    SidebarFooter,
    MenuItem,
    Avatar,
    InputText,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
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
        component: componentDocsDescription
      }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Sidebar' },
        category: 'props'
      }
    },
    header: {
      control: false,
      description: 'Optional top region (search, branding).',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    default: {
      control: false,
      description: 'Navigation groups and menu items; region padding and group gap are applied by `Sidebar`.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    footer: {
      control: false,
      description: 'Optional bottom region (profile, actions).',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    ariaLabel: 'Application'
  }
}

export default meta

function createHomeItem() {
  return {
    label: 'Home',
    icon: 'ai ai-home',
    to: '/',
    id: 'home'
  }
}

function createMarketplaceItem() {
  return {
    label: 'Marketplace',
    icon: 'ai ai-marketplace',
    to: '/marketplace',
    id: 'marketplace'
  }
}

function createDomainsItem() {
  return {
    label: 'Domains',
    icon: 'ai ai-workloads',
    to: '/domains',
    id: 'domains'
  }
}

function createBuildItems() {
  return [
    {
      label: 'Applications',
      icon: 'ai ai-edge-application',
      to: '/applications',
      id: 'edge-application'
    },
    { label: 'Variables', icon: 'ai ai-variables', to: '/variables', id: 'variables' }
  ]
}

function createSecureItems() {
  return [
    {
      label: 'Connectors',
      icon: 'ai ai-edge-connectors',
      to: '/connectors',
      id: 'edge-connectors'
    },
    { label: 'Edge DNS', icon: 'ai ai-edge-dns', to: '/edge-dns', id: 'edge-dns' },
    { label: 'Firewalls', icon: 'ai ai-edge-firewall', to: '/firewalls', id: 'edge-firewall' }
  ]
}

function createStoreItems() {
  return [
    {
      label: 'Object Storage',
      icon: 'ai ai-edge-storage',
      to: '/object-storage',
      id: 'object-storage'
    },
    {
      label: 'SQL Database',
      icon: 'ai ai-edge-sql',
      to: '/sql-database',
      tag: 'Preview',
      id: 'sql-database'
    }
  ]
}

function createDeployItems() {
  return [{ label: 'Edge Nodes', icon: 'ai ai-edge-nodes', to: '/edge-node', id: 'edge-nodes' }]
}

function createObserveItems() {
  return [
    { label: 'Data Stream', icon: 'ai ai-data-stream', to: '/data-stream', id: 'data-stream' },
    { label: 'Edge Pulse', icon: 'ai ai-edge-pulse', to: '/edge-pulse', id: 'edge-pulse' },
    {
      label: 'Real-Time Metrics',
      icon: 'ai ai-real-time-metrics',
      to: '/real-time-metrics',
      id: 'real-time-metrics'
    },
    {
      label: 'Real-Time Events',
      icon: 'ai ai-real-time-events',
      to: '/real-time-events',
      id: 'real-time-events'
    },
    { label: 'SIEM', icon: 'pi pi-chart-bar', to: '/siem', id: 'siem' }
  ]
}

function createToolsItems() {
  return [
    {
      label: 'Real-Time Purge',
      icon: 'ai ai-real-time-purge',
      to: '/real-time-purge',
      id: 'real-time-purge'
    }
  ]
}

function createEdgeLibrariesItems() {
  return [
    {
      label: 'Certificate Manager',
      icon: 'ai ai-digital-certificates',
      to: '/digital-certificates',
      id: 'digital-certificates'
    },
    { label: 'Custom Pages', icon: 'ai ai-custom-pages', to: '/custom-pages', id: 'custom-pages' },
    {
      label: 'Edge Services',
      icon: 'ai ai-edge-services',
      to: '/edge-services',
      id: 'edge-services'
    },
    { label: 'Functions', icon: 'ai ai-edge-functions', to: '/functions', id: 'edge-functions' },
    {
      label: 'Network Lists',
      icon: 'ai ai-network-lists',
      to: '/network-lists',
      id: 'network-lists'
    },
    { label: 'WAF Rules', icon: 'ai ai-waf-rules', to: '/waf', id: 'waf-rules' }
  ]
}

function createMarketplaceProductsItems() {
  return [
    {
      label: 'Bot Manager',
      icon: 'pi pi-wrench',
      to: 'https://radware.eu.auth0.com/authorize?client_id=KnZSRL3CSoahL0ymcqfwsmt55EHxXxgS&response_type=code&connection=caixa-sso&prompt=login&scope=openid%20profile&redirect_uri=https://console.radwarecloud.com?connection=caixa-sso',
      id: 'bot-manager',
      external: true
    },
    {
      label: 'SIEM',
      icon: 'pi pi-chart-bar',
      to: 'https://caixa-siem.azion.com/login',
      id: 'siem-external',
      external: true
    }
  ]
}

function getMenuItens(showMarketplaceProductsItens = true) {
  return [
    createHomeItem(),
    createMarketplaceItem(),
    createDomainsItem(),
    { label: 'Build', items: createBuildItems() },
    { label: 'Secure', items: createSecureItems() },
    { label: 'Store', items: createStoreItems() },
    { label: 'Deploy', items: createDeployItems() },
    { label: 'Observe', items: createObserveItems() },
    { label: 'Tools', items: createToolsItems() },
    { label: 'Edge Libraries', items: createEdgeLibrariesItems() },
    {
      label: 'Marketplace Products',
      visible: showMarketplaceProductsItens,
      items: createMarketplaceProductsItems()
    }
  ]
}

function splitMenuModel(showMarketplaceProductsItens = true) {
  const visibleMenus = getMenuItens(showMarketplaceProductsItens).filter(
    (menu) => menu.visible !== false
  )

  return {
    rootItems: visibleMenus.filter((menu) => !menu.items),
    sections: visibleMenus
      .filter((menu) => Array.isArray(menu.items))
      .map((menu) => ({
        label: menu.label,
        items: menu.items.filter((item) => item.visible !== false)
      }))
  }
}

const SidebarTemplate =
  ({ withHeader = false, withFooter = false } = {}) =>
  (args) => ({
    components: {
      Sidebar,
      SidebarGroup,
      SidebarFooter,
      MenuItem,
      InputText,
      Avatar,
      DropdownMenu,
      DropdownMenuTrigger,
      DropdownMenuPortal,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuSeparator
    },
    setup() {
      const { rootItems, sections } = splitMenuModel(true)
      const profileMenuOpen = ref(false)

      return {
        args,
        rootItems,
        sections,
        withHeader,
        withFooter,
        profileMenuOpen,
        sampleImage,
        profileMenuHeaderClasses,
        profileMenuContentClasses
      }
    },
    template: `
    <Sidebar v-bind="args" class="h-screen w-[280px]">
      <template
        v-if="withHeader"
        #header
      >
        <InputText placeholder="Search" size="medium" />
      </template>
      <SidebarGroup>
          <MenuItem
            v-for="item in rootItems"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :href="item.to"
            :target="item.external ? '_blank' : '_self'"
            :selected="item.id === 'home'"
          />
        </SidebarGroup>
        <SidebarGroup
          v-for="section in sections"
          :key="section.label"
          :label="section.label"
        >
          <MenuItem
            v-for="item in section.items"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :href="item.to"
            :target="item.external ? '_blank' : '_self'"
            :tag-value="item.tag"
            :tag-severity="item.tag ? 'primary' : undefined"
          />
        </SidebarGroup>
      <template
        v-if="withFooter"
        #footer
      >
        <SidebarFooter>
            <DropdownMenu
              v-model:open="profileMenuOpen"
              side="top"
              :close-on-select="true"
            >
              <DropdownMenuTrigger class="block w-full">
                <button
                  type="button"
                  class="flex w-full items-center gap-[var(--spacing-sm)] rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-canvas)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-left transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
                  aria-label="Open profile menu"
                >
                  <Avatar
                    kind="square"
                    size="medium"
                    :src="sampleImage"
                    alt="Rafael Umman"
                  />
                  <span class="flex min-w-0 flex-1 flex-col justify-center">
                    <span class="truncate text-label-sm text-[var(--text-default)]">Rafael Umman</span>
                    <span class="truncate text-label-sm text-[var(--text-muted)]">email@gmail.com</span>
                  </span>
                  <i
                    class="pi pi-sort-alt text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent :class="profileMenuContentClasses">
                  <div
                    :class="profileMenuHeaderClasses"
                    role="presentation"
                    data-testid="overlay-dropdown-menu__profile-primary"
                  >
                    <span class="text-label-md text-[var(--text-default)]">Rafael Umman</span>
                    <span class="text-body-sm text-[var(--text-muted)]">email@gmail.com</span>
                  </div>
                  <DropdownMenuItem
                    label="Account Settings"
                    value="account-settings"
                  />
                  <DropdownMenuItem
                    label="Users Management"
                    value="users-management"
                  />
                  <DropdownMenuItem
                    label="Billing"
                    value="billing"
                  />
                  <DropdownMenuItem
                    label="Credentials"
                    value="credentials"
                  />
                  <DropdownMenuItem
                    label="Activity History"
                    value="activity-history"
                  />
                  <DropdownMenuItem
                    label="Team Permissions"
                    value="team-permissions"
                  />
                  <DropdownMenuSeparator />
                  <div
                    :class="profileMenuHeaderClasses"
                    role="presentation"
                    data-testid="overlay-dropdown-menu__profile-secondary"
                  >
                    <span class="text-label-md text-[var(--text-default)]">User.name</span>
                    <span class="text-label-sm text-[var(--text-muted)]">email@gmail.com</span>
                  </div>
                  <DropdownMenuItem
                    label="Your Settings"
                    value="your-settings"
                  />
                  <DropdownMenuItem
                    label="Personal Tokens"
                    value="personal-tokens"
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    label="Log out"
                    value="logout"
                    icon="pi pi-sign-out"
                  />
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
        </SidebarFooter>
      </template>
    </Sidebar>
  `
  })

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const Default = {
  render: SidebarTemplate({ withHeader: false, withFooter: false }),
  parameters: {
    docs: { description: { story: 'Content-only sidebar (no header and no footer).' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const WithHeaderSearch = {
  render: SidebarTemplate({ withHeader: true, withFooter: false }),
  parameters: {
    docs: { description: { story: 'Adds the header region with a search input.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const WithHeaderAndProfileFooter = {
  render: SidebarTemplate({ withHeader: true, withFooter: true }),
  parameters: {
    docs: {
      description: {
        story:
          'Header search plus profile footer with Avatar; account DropdownMenu opens above the trigger (`side="top"`).'
      }
    }
  }
}
