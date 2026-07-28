import Avatar from '@aziontech/webkit/avatar'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import ButtonHighlight from '@aziontech/webkit/button-highlight'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import MenuItem from '@aziontech/webkit/menu-item'
import PlatformShell from '@aziontech/webkit/platform-shell'
import Sidebar from '@aziontech/webkit/sidebar'
import SidebarGroup from '@aziontech/webkit/sidebar-group'
import Default from '@aziontech/webkit/svg/azion/default'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../_shared/story-source'

// Every component rendered in the shell, so the "Show code" SFC runs standalone.
// PlatformShell owns the GlobalHeader + TabView roots; the compound sub-tags
// (TabView.List, Item.List, Table.Search, ...) resolve off their imported binding
// in a real SFC, matching the canvas 1-to-1. The content is authored statically
// (inline table data, :model-value on controls) so the pasted snippet needs no
// setup script — the layout is what this template demonstrates.
const IMPORT = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import ButtonHighlight from '@aziontech/webkit/button-highlight'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import MenuItem from '@aziontech/webkit/menu-item'",
  "import PlatformShell from '@aziontech/webkit/platform-shell'",
  "import Sidebar from '@aziontech/webkit/sidebar'",
  "import SidebarGroup from '@aziontech/webkit/sidebar-group'",
  "import Default from '@aziontech/webkit/svg/azion/default'",
  "import Switch from '@aziontech/webkit/switch'",
  "import TabView from '@aziontech/webkit/tab-view'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

/** @type {import('@storybook/vue3').Meta<typeof PlatformShell>} */
const meta = {
  title: 'Templates/ApplicationShell',
  component: PlatformShell,
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
          'Application resource-detail shell recreated from the Azion Console applications route: a navigation `Sidebar` with the Azion brand, a `GlobalHeader` carrying the resource breadcrumb and the Create / Copilot / account actions, and the resource sub-pages as internal `TabView` tabs (Main Settings, Build, Device Groups, Cache Settings, Functions Instances, Rules Engine) each rendering its real content.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    headerAriaLabel: {
      control: 'text',
      description: 'Accessible name for the header landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Global header'" },
        category: 'props'
      }
    },
    tabDefaultValue: {
      control: 'text',
      description: 'Initial active tab.',
      table: {
        type: { summary: 'string | number | null' },
        defaultValue: { summary: "'main-settings'" },
        category: 'props'
      }
    }
  },
  args: {
    headerAriaLabel: 'Azion Console',
    tabDefaultValue: 'main-settings'
  }
}

export default meta

// --- Reusable section-title paragraph, matching the console's ItemGroup titles.
const SECTION_TITLE = 'px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]'

// One shared body for every slot, authored once so the live canvas (Template)
// and the "Show code" snippet (DEFAULT_MARKUP) can never drift. Tab values /
// labels and each panel's content mirror the console application detail route.
const SHELL_BODY = `  <template #header-left>
    <Breadcrumb
      :items="[
        { label: 'Applications', href: '/applications' },
        { label: 'webkit-sample-vue' }
      ]"
    />
  </template>
  <template #header-middle />
  <template #header-right>
    <Button label="Create" kind="secondary" size="medium" icon="pi pi-plus-circle" />
    <ButtonHighlight label="Copilot" size="medium" icon="ai ai-ask-azion" />
    <Avatar label="myemail@azion.com" size="medium" kind="square" />
  </template>
  <template #sidebar>
    <Sidebar aria-label="Main navigation" class="h-full w-full">
      <template #header>
        <a href="/" aria-label="Azion home" class="inline-flex">
          <Default />
        </a>
      </template>
      <SidebarGroup>
        <MenuItem label="Home" icon="ai ai-home" href="/" />
        <MenuItem label="Marketplace" icon="ai ai-marketplace" href="/marketplace" />
        <MenuItem label="Domains" icon="ai ai-workloads" href="/domains" />
      </SidebarGroup>
      <SidebarGroup label="Build">
        <MenuItem label="Applications" icon="ai ai-edge-application" href="/applications" selected />
        <MenuItem label="Variables" icon="ai ai-variables" href="/variables" />
      </SidebarGroup>
      <SidebarGroup label="Secure">
        <MenuItem label="Connectors" icon="ai ai-edge-connectors" href="/connectors" />
        <MenuItem label="Edge DNS" icon="ai ai-edge-dns" href="/edge-dns" />
        <MenuItem label="Firewalls" icon="ai ai-edge-firewall" href="/firewalls" />
      </SidebarGroup>
      <SidebarGroup label="Observe">
        <MenuItem label="Data Stream" icon="ai ai-data-stream" href="/data-stream" />
        <MenuItem label="Real-Time Metrics" icon="ai ai-real-time-metrics" href="/real-time-metrics" />
      </SidebarGroup>
    </Sidebar>
  </template>
  <template #tabs>
    <TabView.List class="sticky top-0 z-[2] -mt-[var(--spacing-sm)] w-full bg-[var(--bg-canvas)]">
      <TabView.Item value="main-settings" label="Main Settings" />
      <TabView.Item value="build" label="Build" />
      <TabView.Item value="device-groups" label="Device Groups" />
      <TabView.Item value="cache-settings" label="Cache Settings" />
      <TabView.Item value="functions-instances" label="Functions Instances" />
      <TabView.Item value="rules-engine" label="Rules Engine" />
    </TabView.List>
    <TabView.Content class="mx-auto mt-[var(--spacing-4)] min-h-0 w-full max-w-[var(--container-4xl)] flex-1 p-[var(--spacing-lg)]">
      <!-- Main Settings — two ItemGroups: General + Modules, each its own Save. -->
      <TabView.Panel value="main-settings">
        <div class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
          <div class="flex flex-col gap-[var(--spacing-1)]">
            <h2 class="text-heading-sm text-[var(--text-default)]">Main Settings</h2>
            <p class="text-body-xs text-[var(--text-muted)]">
              Core configuration for this edge application.
            </p>
          </div>

          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="${SECTION_TITLE}">General</p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Name</Item.Title>
                      <Item.Description>
                        A unique and descriptive name to identify the application.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        model-value="webkit-sample-vue"
                        size="large"
                        class="w-full max-w-[20rem]"
                        aria-label="Name"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Active</Item.Title>
                      <Item.Description>
                        When disabled, the application stops serving traffic at the edge.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch :model-value="true" aria-label="Active" />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end">
                  <Button label="Save" kind="secondary" size="medium" disabled />
                </div>
              </template>
            </CardBox>
          </section>

          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="${SECTION_TITLE}">Modules</p>
            <div class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-label-md text-[var(--text-muted)]">Default Modules</p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Application Accelerator</Item.Title>
                          <Item.Description>Optimize protocols and manage dynamic content delivery.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch :model-value="true" aria-label="Application Accelerator" />
                        </Item.Actions>
                      </Item>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>
                            Cache
                            <Tag label="Automatically enabled in all accounts." icon="pi pi-lock" severity="secondary" size="small" />
                          </Item.Title>
                          <Item.Description>Customize advanced cache settings.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch :model-value="true" disabled aria-label="Cache" />
                        </Item.Actions>
                      </Item>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Device Detection</Item.Title>
                          <Item.Description>Activate DeviceAtlas variables to configure responsive rules.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch :model-value="false" aria-label="Device Detection" />
                        </Item.Actions>
                      </Item>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Functions</Item.Title>
                          <Item.Description>Build ultra-low latency functions that run on the edge.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch :model-value="true" aria-label="Functions" />
                        </Item.Actions>
                      </Item>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Image Processor</Item.Title>
                          <Item.Description>Enable dynamic image editing options.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch :model-value="false" aria-label="Image Processor" />
                        </Item.Actions>
                      </Item>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Load Balancer</Item.Title>
                          <Item.Description>Balance traffic to your origins ensuring reliability and network congestion control.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch :model-value="false" aria-label="Load Balancer" />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                  <template #footer>
                    <div class="flex w-full items-center justify-end">
                      <Button label="Save" kind="secondary" size="medium" disabled />
                    </div>
                  </template>
                </CardBox>
              </section>

              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-label-md text-[var(--text-muted)]">Subscription modules</p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>WebSocket Proxy</Item.Title>
                          <Item.Description>Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Tooltip text="Contact sales to activate this module.">
                            <Switch :model-value="false" disabled aria-label="WebSocket Proxy" />
                          </Tooltip>
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </CardBox>
              </section>
            </div>
          </section>
        </div>
      </TabView.Panel>

      <!-- Build — git connection + build configuration + latest deployment. -->
      <TabView.Panel value="build">
        <div class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
          <header class="flex w-full flex-wrap items-end justify-between gap-[var(--spacing-4)]">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-1)]">
              <h2 class="text-heading-sm text-[var(--text-default)]">Build</h2>
              <p class="text-body-xs text-[var(--text-muted)]">
                Connect your application to a Git repository for automatic builds and deployments.
              </p>
            </div>
            <Button label="Deploy" kind="primary" size="medium" icon="pi pi-cloud-upload" />
          </header>

          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="${SECTION_TITLE}">Git repository</p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Connected repository</Item.Title>
                      <Item.Description>
                        <span class="inline-flex items-center gap-[var(--spacing-xxs)]">
                          <i class="ai-cor ai-vue" aria-hidden="true" />
                          <i class="pi pi-github" aria-hidden="true" />
                          <a
                            href="https://github.com/gab-az/webkit-sample-vue"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                          >
                            <span>gab-az/webkit-sample-vue</span>
                            <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                          </a>
                        </span>
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button label="Disconnect" kind="danger" size="small" />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="${SECTION_TITLE}">Build configuration</p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Build command</Item.Title>
                      <Item.Description>The command that builds the application.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText model-value="azion build" size="large" class="w-full max-w-[20rem] font-code" aria-label="Build command" />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Deploy command</Item.Title>
                      <Item.Description>The command that deploys the build to the edge.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText model-value="azion deploy --local" size="large" class="w-full max-w-[20rem] font-code" aria-label="Deploy command" />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Production branch</Item.Title>
                      <Item.Description>Pushes to this branch deploy to production.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText model-value="main" size="large" class="w-full max-w-[12rem] font-code" aria-label="Production branch" />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end">
                  <Button label="Save" kind="secondary" size="medium" disabled />
                </div>
              </template>
            </CardBox>
          </section>

          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="${SECTION_TITLE}">Latest deployment</p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Domain</Item.Title>
                      <Item.Description>The edge domain serving this application.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end gap-[var(--spacing-xs)]">
                      <a
                        href="https://e7b4verynr.map.azionedge.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                      >
                        <span>e7b4verynr.map.azionedge.net</span>
                        <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                      </a>
                      <CopyButton kind="outlined" value="https://e7b4verynr.map.azionedge.net" aria-label="Copy domain URL" />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Environment</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Tag label="production" severity="secondary" size="medium" />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>
        </div>
      </TabView.Panel>

      <!-- List sub-pages — label only (their tables live in the real console). -->
      <TabView.Panel value="device-groups">
        <div class="flex min-w-0 flex-col gap-[var(--spacing-1)]">
          <h2 class="text-heading-sm text-[var(--text-default)]">Device Groups</h2>
          <p class="text-body-xs text-[var(--text-muted)]">
            Group requests by User-Agent to apply custom application behaviors.
          </p>
        </div>
      </TabView.Panel>

      <TabView.Panel value="cache-settings">
        <div class="flex min-w-0 flex-col gap-[var(--spacing-1)]">
          <h2 class="text-heading-sm text-[var(--text-default)]">Cache Settings</h2>
          <p class="text-body-xs text-[var(--text-muted)]">
            Define how content is cached at the edge and in browsers.
          </p>
        </div>
      </TabView.Panel>

      <TabView.Panel value="functions-instances">
        <div class="flex min-w-0 flex-col gap-[var(--spacing-1)]">
          <h2 class="text-heading-sm text-[var(--text-default)]">Functions Instances</h2>
          <p class="text-body-xs text-[var(--text-muted)]">
            Edge functions instantiated on this application.
          </p>
        </div>
      </TabView.Panel>

      <TabView.Panel value="rules-engine">
        <div class="flex min-w-0 flex-col gap-[var(--spacing-1)]">
          <h2 class="text-heading-sm text-[var(--text-default)]">Rules Engine</h2>
          <p class="text-body-xs text-[var(--text-muted)]">
            Conditional rules applied to requests and responses.
          </p>
        </div>
      </TabView.Panel>
    </TabView.Content>
  </template>`

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string template (Vue compiles
// `TabView.List` / `Item.List` / `Table.Search` to a `resolveComponent`
// exact-name lookup). In a real SFC each dotted tag resolves off its imported
// compound root, so the pasted snippet needs only the flat imports above.
const components = {
  PlatformShell,
  Avatar,
  Breadcrumb,
  Button,
  ButtonHighlight,
  CardBox,
  CopyButton,
  Default,
  InputText,
  MenuItem,
  Sidebar,
  SidebarGroup,
  Switch,
  Tag,
  Tooltip,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Item,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  'TabView.Content': TabView.Content,
  'TabView.Panel': TabView.Panel
}

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `<PlatformShell v-bind="args" data-testid="template-application-shell-story">
${SHELL_BODY}
</PlatformShell>`
})

const DEFAULT_MARKUP = `<PlatformShell header-aria-label="Azion Console" tab-default-value="main-settings">
${SHELL_BODY}
</PlatformShell>`

/** @type {import('@storybook/vue3').StoryObj<typeof PlatformShell>} */
export const DefaultShell = {
  name: 'Default',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The application detail route: navigation sidebar with Applications selected, the resource breadcrumb and account actions in the global header, and the six resource sub-pages as internal tabs — Main Settings (General + Modules ItemGroups), Build (git connection + build config + latest deployment), and the Device Groups / Cache Settings / Functions Instances / Rules Engine data tables. Click a tab or use Arrow / Home / End keys to move between sub-pages.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
