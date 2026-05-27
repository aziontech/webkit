import Avatar from '@aziontech/webkit/content/avatar'
import InputText from '@aziontech/webkit/inputs/input-text'
import Sidebar from '@aziontech/webkit/layout/sidebar'
import SidebarFooter from '@aziontech/webkit/layout/sidebar-footer'
import SidebarGroup from '@aziontech/webkit/layout/sidebar-group'
import MenuItem from '@aziontech/webkit/navigation/menu-item'

/** @type {import('@storybook/vue3').Meta<typeof Sidebar>} */
const meta = {
  title: 'Webkit/Layout/Sidebar',
  component: Sidebar,
  subcomponents: { SidebarGroup, SidebarFooter, MenuItem, Avatar, InputText },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Composable application sidebar with slot-driven regions. By default, only navigation content is rendered; spacing is controlled by region content.'
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
    }
  },
  args: {
    ariaLabel: 'Application'
  }
}

export default meta

const defaultMenu = `
  <SidebarGroup>
    <MenuItem label="Home" icon="ai ai-home" selected href="/" />
    <MenuItem label="Marketplace" icon="ai ai-marketplace" href="/marketplace" />
    <MenuItem label="Domains" icon="ai ai-workloads" href="/domains" />
  </SidebarGroup>
  <SidebarGroup label="Build">
    <MenuItem label="Applications" icon="ai ai-edge-application" href="/applications" />
    <MenuItem label="Variables" icon="ai ai-variables" href="/variables" />
  </SidebarGroup>
`

const ContentOnlyTemplate = (args) => ({
  components: { Sidebar, SidebarGroup, MenuItem },
  setup() {
    return { args }
  },
  template: `
    <Sidebar v-bind="args" class="h-screen w-[240px]">
      <SidebarGroup scroll class="p-[var(--spacing-md)]">
        ${defaultMenu}
      </SidebarGroup>
    </Sidebar>
  `
})

const WithHeaderTemplate = (args) => ({
  components: { Sidebar, SidebarGroup, MenuItem, InputText },
  setup() {
    return { args }
  },
  template: `
    <Sidebar v-bind="args" class="h-screen w-[280px]">
      <template #header>
        <div class="p-[var(--spacing-md)] pb-0">
          <InputText placeholder="Search" size="medium" />
        </div>
      </template>
      <SidebarGroup scroll class="p-[var(--spacing-md)]">
        ${defaultMenu}
      </SidebarGroup>
    </Sidebar>
  `
})

const WithHeaderAndFooterTemplate = (args) => ({
  components: { Sidebar, SidebarGroup, SidebarFooter, MenuItem, InputText, Avatar },
  setup() {
    return { args }
  },
  template: `
    <Sidebar v-bind="args" class="h-screen w-[280px]">
      <template #header>
        <div class="p-[var(--spacing-md)] pb-0">
          <InputText placeholder="Search" size="medium" />
        </div>
      </template>
      <SidebarGroup scroll class="p-[var(--spacing-md)]">
        ${defaultMenu}
      </SidebarGroup>
      <template #footer>
        <div class="p-[var(--spacing-md)] pt-0">
          <SidebarFooter>
            <button
              type="button"
              class="flex w-full items-center gap-[var(--spacing-sm)] rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-canvas)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-left transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
            >
              <Avatar
                kind="square"
                size="medium"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
                alt="Rafael Umman"
              />
              <span class="flex min-w-0 flex-1 flex-col justify-center gap-[var(--spacing-xxs)]">
                <span class="truncate text-label-sm text-[var(--text-default)]">Rafael Umman</span>
                <span class="truncate text-overline-xs text-[var(--text-muted)]">email@gmail.com</span>
              </span>
              <i
                class="pi pi-sort-alt text-[var(--text-muted)]"
                aria-hidden="true"
              />
            </button>
          </SidebarFooter>
        </div>
      </template>
    </Sidebar>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const Default = {
  render: ContentOnlyTemplate,
  parameters: {
    docs: { description: { story: 'Content-only sidebar (no header and no footer).' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const WithHeaderSearch = {
  render: WithHeaderTemplate,
  parameters: {
    docs: { description: { story: 'Adds the header region with a search input.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Sidebar>} */
export const WithHeaderAndProfileFooter = {
  render: WithHeaderAndFooterTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'Adds header search and a profile footer menu layout based on Figma node `4153:15282`.'
      }
    }
  }
}
