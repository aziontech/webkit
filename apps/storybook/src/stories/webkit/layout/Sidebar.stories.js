import InputText from '@aziontech/webkit/inputs/input-text'
import MenuItem from '@aziontech/webkit/navigation/menu-item'
import Sidebar from '@aziontech/webkit/layout/sidebar'
import SidebarFooter from '@aziontech/webkit/layout/sidebar-footer'
import SidebarGroup from '@aziontech/webkit/layout/sidebar-group'
import { expect, userEvent, within } from '@storybook/test'

/** @type {import('@storybook/vue3').Meta<typeof Sidebar>} */
const meta = {
  title: 'Webkit/Layout/Sidebar',
  component: Sidebar,
  subcomponents: { SidebarGroup, SidebarFooter, MenuItem },
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
        component:
          'Composable application sidebar: `header` (search), scrollable groups (`SidebarGroup scroll`), optional `footer` (hidden when empty). Default story mirrors Console `getMenuItens()`.'
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
      description: 'Top region — typically search (`InputText`).',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    default: {
      description: 'Navigation region — wrap sections in `<SidebarGroup scroll>`.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    footer: {
      description: 'Bottom region (pinned below scroll). Hidden when the slot is empty.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    ariaLabel: 'Application'
  }
}

export default meta

const sidebarTemplate = `
  <Sidebar v-bind="args" class="h-screen w-[280px]">
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
  </Sidebar>
`

const Template = (args) => ({
  components: { Sidebar, SidebarGroup, MenuItem, InputText },
  setup() {
    return { args }
  },
  template: sidebarTemplate
})

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Application menu template aligned with Console `getMenuItens()` (Home, Marketplace, Domains, Build, Secure, Store, Deploy, Observe, Tools, Edge Libraries, Marketplace Products).'
      }
    }
  }
}

export const WithFooter = {
  render: (args) => ({
    components: { Sidebar, SidebarGroup, SidebarFooter, MenuItem, InputText },
    setup() {
      return { args }
    },
    template: `
      <Sidebar v-bind="args" class="h-screen w-[280px]">
        <template #header>
          <InputText placeholder="Search" size="medium" />
        </template>
        <SidebarGroup scroll>
          <SidebarGroup>
            <MenuItem label="Home" icon="ai ai-home" selected href="/" />
            <MenuItem label="Settings" icon="pi pi-cog" href="/settings" />
          </SidebarGroup>
        </SidebarGroup>
        <template #footer>
          <SidebarFooter>
            <p class="text-label-sm text-[var(--text-muted)]">Console v1.0</p>
          </SidebarFooter>
        </template>
      </Sidebar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Footer slot pinned below the scrollable menu (use `#footer` or `SidebarFooter`).'
      }
    }
  }
}

export const WithoutSearch = {
  render: (args) => ({
    components: { Sidebar, SidebarGroup, MenuItem },
    setup() {
      return { args }
    },
    template: `
      <Sidebar v-bind="args" class="h-screen w-[280px]">
        <SidebarGroup scroll>
          <SidebarGroup>
            <MenuItem label="Home" icon="pi pi-home" selected href="#" />
            <MenuItem label="Settings" icon="pi pi-cog" href="#" />
          </SidebarGroup>
        </SidebarGroup>
      </Sidebar>
    `
  }),
  parameters: {
    docs: { description: { story: 'Sidebar without the header search slot.' } }
  }
}

export const LightDark = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Sidebar template on light and dark canvas backgrounds.'
      }
    }
  },
  render: () => ({
    components: { Sidebar, SidebarGroup, MenuItem, InputText },
    template: `
      <div class="flex min-h-screen">
        <section class="azion azion-light flex bg-[var(--bg-canvas)]">
          ${sidebarTemplate.replace('v-bind="args"', 'aria-label="Application light" class="h-screen w-[280px]"')}
        </section>
        <section class="azion azion-dark flex bg-[var(--bg-canvas)]">
          ${sidebarTemplate.replace('v-bind="args"', 'aria-label="Application dark" class="h-screen w-[280px]"')}
        </section>
      </div>
    `
  })
}

export const Accessibility = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard: Tab moves through search and menu links. Landmark: aside + nav structure for screen readers.'
      }
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Tab reaches the first menu link', async () => {
      await userEvent.tab()
      await userEvent.tab()
      const home = canvas.getByRole('link', { name: 'Home' })
      expect(home).toHaveFocus()
    })
  }
}

export const Playground = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Interactive sidebar template — adjust `ariaLabel` via controls.'
      }
    }
  }
}
