import Button from '@aziontech/webkit/button'
import Default from '@aziontech/webkit/svg/azion/default'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import MenuItem from '@aziontech/webkit/menu-item'
import Sidebar from '@aziontech/webkit/sidebar'
import SidebarGroup from '@aziontech/webkit/sidebar-group'
import TabView from '@aziontech/webkit/tab-view'

import { toSfc } from '../_shared/story-source'

// Every component rendered in the shell, so the "Show code" SFC runs standalone.
// GlobalHeader and TabView are imported as compound roots — their dot-notation
// sub-tags (GlobalHeader.Brand, TabView.List, ...) resolve off the binding in a
// real SFC, matching the canvas 1-to-1.
const IMPORT = [
  "import Button from '@aziontech/webkit/button'",
  "import Default from '@aziontech/webkit/svg/azion/default'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import MenuItem from '@aziontech/webkit/menu-item'",
  "import Sidebar from '@aziontech/webkit/sidebar'",
  "import SidebarGroup from '@aziontech/webkit/sidebar-group'",
  "import TabView from '@aziontech/webkit/tab-view'"
]

/** @type {import('@storybook/vue3').Meta<typeof GlobalHeader>} */
const meta = {
  title: 'Templates/PlatformShell',
  component: GlobalHeader,
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
          'Console application shell composed from `GlobalHeader`, `Sidebar`, `TabView` and `Button`: a global header, a persistent navigation sidebar, a page heading with actions, tabs, and scrollable panel content.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

// The whole shell, authored once so the live canvas and the "Show code"
// snippet can never drift.
const SHELL_TEMPLATE = `<div class="flex h-screen min-h-0 w-full flex-col bg-(--bg-canvas)">
  <GlobalHeader aria-label="Global header">
    <GlobalHeader.Left>
      <IconButton icon="pi pi-bars" kind="text" size="large" aria-label="Menu" />
      <GlobalHeader.Brand>
        <a href="/" aria-label="Azion home">
          <Default />
        </a>
      </GlobalHeader.Brand>
    </GlobalHeader.Left>
    <GlobalHeader.Right>
      <Button label="Create" kind="primary" size="medium" />
    </GlobalHeader.Right>
  </GlobalHeader>

  <div class="flex min-h-0 w-full flex-1 overflow-hidden">
    <aside class="flex h-full w-[320px] shrink-0 flex-col self-stretch">
      <Sidebar aria-label="Application" class="h-full w-full">
        <template #header>
          <InputText placeholder="Search" size="medium" />
        </template>
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
          <MenuItem label="Bot Manager" icon="pi pi-wrench" href="/marketplace/bot-manager" target="_blank" />
          <MenuItem label="SIEM" icon="pi pi-chart-bar" href="/marketplace/siem" target="_blank" />
        </SidebarGroup>
      </Sidebar>
    </aside>

    <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-canvas)">
      <div class="flex min-h-0 flex-1 flex-col gap-(--spacing-xl) overflow-auto p-(--spacing-xl)">
        <header class="flex w-full shrink-0 flex-wrap items-end justify-between gap-(--spacing-4)">
          <div class="flex min-w-0 flex-col gap-(--spacing-2)">
            <h1 class="text-heading-md text-(--text-default)">Page Heading</h1>
            <p class="text-body-xs text-(--text-muted)">A brief description about this page</p>
          </div>
          <div class="flex shrink-0 items-center gap-(--spacing-3)">
            <Button label="Get Help" kind="text" size="medium" />
            <Button label="Add new Resource" kind="outlined" size="medium" />
          </div>
        </header>

        <TabView default-value="tab-1" class="flex min-h-0 w-full flex-1 flex-col">
          <TabView.List>
            <TabView.Item value="tab-1" label="Tab Item" />
            <TabView.Item value="tab-2" label="Tab Item" />
            <TabView.Item value="tab-3" label="Tab Item" />
            <TabView.Item value="tab-4" label="Tab Item" />
            <TabView.Item value="tab-5" label="Tab Item" />
            <TabView.Item value="tab-6" label="Tab Item" />
            <TabView.Item value="tab-7" label="Tab Item" />
          </TabView.List>
          <TabView.Content class="mt-(--spacing-4) min-h-0 flex-1">
            <TabView.Panel value="tab-1">
              <div class="grid min-h-[12rem] w-full grid-cols-3 gap-(--spacing-6)">
                <div
                  v-for="index in 6"
                  :key="index"
                  class="min-h-[8rem] rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface)"
                />
              </div>
            </TabView.Panel>
            <TabView.Panel value="tab-2">
              <p class="text-body-sm text-(--text-muted)">Content for tab 2</p>
            </TabView.Panel>
            <TabView.Panel value="tab-3">
              <p class="text-body-sm text-(--text-muted)">Content for tab 3</p>
            </TabView.Panel>
            <TabView.Panel value="tab-4">
              <p class="text-body-sm text-(--text-muted)">Content for tab 4</p>
            </TabView.Panel>
            <TabView.Panel value="tab-5">
              <p class="text-body-sm text-(--text-muted)">Content for tab 5</p>
            </TabView.Panel>
            <TabView.Panel value="tab-6">
              <p class="text-body-sm text-(--text-muted)">Content for tab 6</p>
            </TabView.Panel>
            <TabView.Panel value="tab-7">
              <p class="text-body-sm text-(--text-muted)">Content for tab 7</p>
            </TabView.Panel>
          </TabView.Content>
        </TabView>
      </div>
    </main>
  </div>
</div>`

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string template: Vue compiles
// `GlobalHeader.Brand` / `TabView.List` to a `resolveComponent` exact-name
// lookup. In a real SFC the dotted tag resolves off the imported compound root,
// so the pasted snippet needs only `import GlobalHeader` / `import TabView`.
const components = {
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  IconButton,
  Button,
  Default,
  Sidebar,
  SidebarGroup,
  MenuItem,
  InputText,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  'TabView.Content': TabView.Content,
  'TabView.Panel': TabView.Panel
}

/** @type {import('@storybook/vue3').StoryObj<typeof GlobalHeader>} */
export const DefaultShell = {
  name: 'Default',
  render: () => ({ components, template: SHELL_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Console layout with the navigation sidebar, a page heading, seven TabView tabs, and a card grid in the first panel.'
      },
      source: { code: toSfc(IMPORT, SHELL_TEMPLATE) }
    }
  }
}
