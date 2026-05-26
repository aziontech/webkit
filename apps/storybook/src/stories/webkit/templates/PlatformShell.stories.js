import AzionDefault from '@aziontech/webkit/svg/azion/default'
import Button from '@aziontech/webkit/actions/button'
import IconButton from '@aziontech/webkit/actions/icon-button'
import InputText from '@aziontech/webkit/inputs/input-text'
import GlobalHeader from '@aziontech/webkit/layout/global-header'
import MenuItem from '@aziontech/webkit/navigation/menu-item'
import NavSidebar from '@aziontech/webkit/layout/sidebar'
import SidebarGroup from '@aziontech/webkit/layout/sidebar-group'
import TabView from '@aziontech/webkit/navigation/tab-view'
import PlatformShell from '@aziontech/webkit/templates/platform-shell'

/** @type {import('@storybook/vue3').Meta<typeof PlatformShell>} */
const meta = {
  title: 'Webkit/Templates/PlatformShell',
  component: PlatformShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'landmark-one-main', enabled: false }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Console application shell aligned with Webkit Figma Example (node 3735:13804): `GlobalHeader`, persistent `layout/sidebar`, page heading, `TabView` tabs, and scrollable panel content.'
      }
    }
  },
  argTypes: {
    headerAriaLabel: {
      control: 'text',
      description: 'Accessible name for the header landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Global header' },
        category: 'props'
      }
    },
    tabDefaultValue: {
      control: 'text',
      description: 'Initial active tab when the tabs slot is used.',
      table: {
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'tab-1' },
        category: 'props'
      }
    },
    'header-left': {
      control: false,
      description: 'Start region inside GlobalHeader.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    'header-middle': {
      control: false,
      description: 'Center region inside GlobalHeader.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    'header-right': {
      control: false,
      description: 'End region inside GlobalHeader.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    sidebar: {
      control: false,
      description: 'Navigation column (typically NavSidebar).',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    'page-header': {
      control: false,
      description: 'Page heading and actions above tabs.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    tabs: {
      control: false,
      description: 'TabView.List and TabView.Content (inside shell TabView.Root).',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    default: {
      control: false,
      description: 'Main page content when the tabs slot is omitted.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    headerAriaLabel: 'Global header',
    tabDefaultValue: 'tab-1'
  }
}

export default meta

const navigationTemplate = `
  <NavSidebar aria-label="Application" class="h-full w-full">
    <template #header>
      <InputText placeholder="Search" size="medium" />
    </template>
    <SidebarGroup scroll>
    <SidebarGroup>
      <MenuItem label="Home" icon="ai ai-home" selected href="/" />
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
      <MenuItem
        label="SQL Database"
        icon="ai ai-edge-sql"
        href="/sql-database"
        tag-value="Preview"
        tag-severity="primary"
      />
    </SidebarGroup>
    <SidebarGroup label="Deploy">
      <MenuItem label="Edge Nodes" icon="ai ai-edge-nodes" href="/edge-node" />
    </SidebarGroup>
    <SidebarGroup label="Observe">
      <MenuItem label="Data Stream" icon="ai ai-data-stream" href="/data-stream" />
      <MenuItem label="Edge Pulse" icon="ai ai-edge-pulse" href="/edge-pulse" />
      <MenuItem label="Real-Time Metrics" icon="ai ai-real-time-metrics" href="/real-time-metrics" />
      <MenuItem label="Real-Time Events" icon="ai ai-real-time-events" href="/real-time-events" />
      <MenuItem label="SIEM" icon="pi pi-chart-bar" href="/siem" />
    </SidebarGroup>
    <SidebarGroup label="Tools">
      <MenuItem label="Real-Time Purge" icon="ai ai-real-time-purge" href="/real-time-purge" />
    </SidebarGroup>
    <SidebarGroup label="Edge Libraries">
      <MenuItem label="Certificate Manager" icon="ai ai-digital-certificates" href="/digital-certificates" />
      <MenuItem label="Custom Pages" icon="ai ai-custom-pages" href="/custom-pages" />
      <MenuItem label="Edge Services" icon="ai ai-edge-services" href="/edge-services" />
      <MenuItem label="Functions" icon="ai ai-edge-functions" href="/functions" />
      <MenuItem label="Network Lists" icon="ai ai-network-lists" href="/network-lists" />
      <MenuItem label="WAF Rules" icon="ai ai-waf-rules" href="/waf" />
    </SidebarGroup>
    <SidebarGroup label="Marketplace Products">
      <MenuItem
        label="Bot Manager"
        icon="pi pi-wrench"
        href="https://radware.eu.auth0.com/authorize?client_id=KnZSRL3CSoahL0ymcqfwsmt55EHxXxgS&response_type=code&connection=caixa-sso&prompt=login&scope=openid%20profile&redirect_uri=https://console.radwarecloud.com?connection=caixa-sso"
        target="_blank"
      />
      <MenuItem
        label="SIEM"
        icon="pi pi-chart-bar"
        href="https://caixa-siem.azion.com/login"
        target="_blank"
      />
    </SidebarGroup>
    </SidebarGroup>
  </NavSidebar>
`

const tabsTemplate = `
  <TabViewList>
    <TabViewItem value="tab-1" label="Tab Item" />
    <TabViewItem value="tab-2" label="Tab Item" />
    <TabViewItem value="tab-3" label="Tab Item" />
    <TabViewItem value="tab-4" label="Tab Item" />
    <TabViewItem value="tab-5" label="Tab Item" />
    <TabViewItem value="tab-6" label="Tab Item" />
    <TabViewItem value="tab-7" label="Tab Item" />
  </TabViewList>
  <TabViewContent class="mt-[var(--spacing-4)] min-h-0 flex-1">
    <TabViewPanel value="tab-1">
      <div
        class="grid min-h-[12rem] w-full grid-cols-3 gap-[var(--spacing-6)]"
        data-testid="template-platform-shell-story__tab-grid"
      >
        <div
          v-for="index in 6"
          :key="index"
          class="min-h-[8rem] rounded-[var(--shape-card)] border border-[var(--border-muted)] bg-[var(--bg-surface)]"
        />
      </div>
    </TabViewPanel>
    <TabViewPanel value="tab-2">
      <p class="text-body-sm text-[var(--text-muted)]">Content for tab 2</p>
    </TabViewPanel>
    <TabViewPanel value="tab-3">
      <p class="text-body-sm text-[var(--text-muted)]">Content for tab 3</p>
    </TabViewPanel>
    <TabViewPanel value="tab-4">
      <p class="text-body-sm text-[var(--text-muted)]">Content for tab 4</p>
    </TabViewPanel>
    <TabViewPanel value="tab-5">
      <p class="text-body-sm text-[var(--text-muted)]">Content for tab 5</p>
    </TabViewPanel>
    <TabViewPanel value="tab-6">
      <p class="text-body-sm text-[var(--text-muted)]">Content for tab 6</p>
    </TabViewPanel>
    <TabViewPanel value="tab-7">
      <p class="text-body-sm text-[var(--text-muted)]">Content for tab 7</p>
    </TabViewPanel>
  </TabViewContent>
`

const Template = (args) => ({
  components: {
    PlatformShell,
    GlobalHeader,
    GlobalHeaderBrand: GlobalHeader.Brand,
    IconButton,
    Button,
    AzionDefault,
    NavSidebar,
    SidebarGroup,
    MenuItem,
    InputText,
    TabViewList: TabView.List,
    TabViewItem: TabView.Item,
    TabViewContent: TabView.Content,
    TabViewPanel: TabView.Panel
  },
  setup() {
    return { args }
  },
  template: `
    <PlatformShell
      v-bind="args"
      data-testid="template-platform-shell-story"
    >
      <template #header-left>
        <IconButton
          icon="pi pi-bars"
          kind="text"
          size="large"
          aria-label="Menu"
          data-testid="template-platform-shell-story__menu"
        />
        <GlobalHeaderBrand>
          <a href="/" aria-label="Azion home">
            <AzionDefault />
          </a>
        </GlobalHeaderBrand>
      </template>
      <template #header-middle />
      <template #header-right>
        <Button label="Create" kind="primary" size="medium" />
      </template>
      <template #sidebar>
        ${navigationTemplate}
      </template>
      <template #page-header>
        <header class="flex w-full flex-wrap items-end justify-between gap-[var(--spacing-4)]">
          <div class="flex min-w-0 flex-col gap-[var(--spacing-2)]">
            <h1 class="text-heading-md text-[var(--text-default)]">Page Heading</h1>
            <p class="text-body-xs text-[var(--text-muted)]">
              A brief description about this page
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-[var(--spacing-3)]">
            <Button label="Get Help" kind="text" size="medium" />
            <Button label="Add new Resource" kind="outlined" size="medium" />
          </div>
        </header>
      </template>
      <template #tabs>
        ${tabsTemplate}
      </template>
    </PlatformShell>
  `
})

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Figma Example layout: Console menu, page heading, seven TabView items, and a card grid in the first panel.'
      }
    }
  }
}
