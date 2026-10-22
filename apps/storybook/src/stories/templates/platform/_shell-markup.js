import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import ButtonHighlight from '@aziontech/webkit/button-highlight'
import CommandMenu from '@aziontech/webkit/command-menu'
import Drawer from '@aziontech/webkit/drawer'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import Dropdown from '@aziontech/webkit/dropdown'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import Kbd from '@aziontech/webkit/kbd'
import Menu from '@aziontech/webkit/menu'
import Sidebar from '@aziontech/webkit/sidebar'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { each, indent } from '../../_shared/markup'

const USER_EMAIL = 'myemail@azion.com'
const USER_NAME = 'myemail'
export const DOCS_HREF =
  'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'

export const NAV_GROUPS = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: 'ai ai-home', path: '/home' },
      { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', path: '/workloads' },
      { id: 'deployments', label: 'Deployments', icon: 'ai ai-deploy-pillar', path: '/deployments' }
    ]
  },
  {
    label: 'Build',
    items: [
      {
        id: 'applications',
        label: 'Applications',
        icon: 'ai ai-edge-application',
        path: '/applications'
      },
      { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', path: '/functions' },
      { id: 'variables', label: 'Variables', icon: 'ai ai-variables', path: '/variables' },
      { id: 'connectors', label: 'Connectors', icon: 'ai ai-edge-connectors', path: '/connectors' },
      {
        id: 'custom-pages',
        label: 'Custom Pages',
        icon: 'ai ai-custom-pages',
        path: '/custom-pages'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      { id: 'firewall', label: 'Firewall', icon: 'ai ai-edge-firewall', path: '/firewall' },
      { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', path: '/edge-dns' },
      { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', path: '/waf-rules' },
      {
        id: 'certificate-manager',
        label: 'Certificate Manager',
        icon: 'ai ai-digital-certificates',
        path: '/certificates'
      },
      {
        id: 'network-lists',
        label: 'Network Lists',
        icon: 'ai ai-network-lists',
        path: '/network-lists'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        id: 'object-storage',
        label: 'Object Storage',
        icon: 'ai ai-edge-storage',
        path: '/object-storage'
      },
      {
        id: 'sql-database',
        label: 'SQL Database',
        icon: 'ai ai-edge-sql',
        path: '/sql-database',
        tagValue: 'Preview'
      }
    ]
  },
  {
    label: 'Observe',
    items: [
      { id: 'data-stream', label: 'Data Stream', icon: 'ai ai-data-stream', path: '/data-stream' },
      { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', path: '/edge-pulse' },
      {
        id: 'real-time-metrics',
        label: 'Real-Time Metrics',
        icon: 'ai ai-real-time-metrics',
        path: '/real-time-metrics'
      },
      {
        id: 'real-time-events',
        label: 'Real-Time Events',
        icon: 'ai ai-real-time-events',
        path: '/real-time-events'
      },
      {
        id: 'real-time-purge',
        label: 'Real-Time Purge',
        icon: 'ai ai-real-time-purge',
        path: '/real-time-purge'
      }
    ]
  },
  {
    label: 'More',
    items: [
      { id: 'marketplace', label: 'Marketplace', icon: 'ai ai-marketplace', path: '/marketplace' },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'pi pi-cog',
        kind: 'drill',
        groups: [
          {
            label: 'Settings',
            items: [
              { id: 'settings-general', label: 'General', path: '/account' },
              {
                id: 'settings-build-deployment',
                label: 'Build & Deployment',
                path: '/account/build-deployment'
              },
              { id: 'settings-environments', label: 'Environments', path: '/account/environments' },
              { id: 'settings-users', label: 'Users management', path: '/account/users' },
              { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
            ]
          },
          {
            label: 'Access',
            items: [
              { id: 'settings-tokens', label: 'Personal Tokens', path: '/personal-tokens' },
              { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
              { id: 'settings-security-mfa', label: 'Multi-factor auth' },
              { id: 'settings-security-sessions', label: 'Active sessions' },
              { id: 'settings-activity', label: 'Activity History', path: '/account/activity' }
            ]
          },
          {
            label: 'Billing',
            items: [
              { id: 'settings-billing', label: 'Billing and plan', path: '/account/billing' },
              { id: 'settings-invoices', label: 'Invoices' }
            ]
          }
        ]
      }
    ]
  }
]

export const BREADCRUMB = [{ label: 'Workloads', href: '/workloads' }, { label: 'workload_01' }]

const leaves = (items) =>
  items.flatMap((item) =>
    item.groups ? leaves(item.groups.flatMap((group) => group.items)) : [item]
  )

const PALETTE_GROUPS = NAV_GROUPS.map((group) => ({
  heading: group.label ?? '',
  items: leaves(group.items)
}))

export const shellState = (active = 'workloads') => {
  const activeId = ref(active)
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)
  const onNavigate = (event, node) => {
    activeId.value = node.id
  }
  const onMobileNavigate = (event, node) => {
    onNavigate(event, node)
    navOpen.value = false
  }
  return {
    navGroups: NAV_GROUPS,
    paletteGroups: PALETTE_GROUPS,
    activeId,
    navOpen,
    paletteOpen,
    theme,
    railWidth,
    railCollapsed,
    onNavigate,
    onMobileNavigate
  }
}

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const pad = (depth) => '  '.repeat(depth)

export const literal = (value, depth) => {
  if (Array.isArray(value)) {
    const entries = value.map((entry) => `${pad(depth + 1)}${literal(entry, depth + 1)}`)
    return `[\n${entries.join(',\n')}\n${pad(depth)}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, entry]) => `${key}: ${literal(entry, depth + 1)}`
    )
    const inline = `{ ${entries.join(', ')} }`
    if (!inline.includes('\n') && pad(depth).length + inline.length <= 100) return inline
    return `{\n${entries.map((entry) => `${pad(depth + 1)}${entry}`).join(',\n')}\n${pad(depth)}}`
  }
  return quoted(String(value))
}

export const declare = (name, value) => `const ${name} = ${literal(value, 0)}`

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const webkitImport = (name) => `import ${name} from '@aziontech/webkit/${kebab(name)}'`

const SHELL_PARTS = [
  'Avatar',
  'Brand',
  'Button',
  'ButtonHighlight',
  'CommandMenu',
  'Drawer',
  'DrawerContent',
  'DrawerOverlay',
  'DrawerPortal',
  'Dropdown',
  'GlobalHeader',
  'IconButton',
  'Kbd',
  'Menu',
  'Sidebar',
  'StatusIndicator',
  'ThemeSwitcher',
  'Tooltip'
]

export const scriptLines = ({
  parts,
  declarations,
  state,
  active = 'workloads',
  vue = ['ref']
}) => [
  ...[...new Set([...SHELL_PARTS, ...parts])].sort().map(webkitImport),
  `import { ${vue.join(', ')} } from 'vue'`,
  '',
  declare('navGroups', NAV_GROUPS),
  ...declarations,
  '',
  `const activeId = ref('${active}')`,
  'const navOpen = ref(false)',
  'const paletteOpen = ref(false)',
  "const theme = ref('system')",
  'const railWidth = ref(null)',
  'const railCollapsed = ref(false)',
  ...state,
  '',
  'const leaves = (items) =>',
  '  items.flatMap((item) =>',
  '    item.groups ? leaves(item.groups.flatMap((group) => group.items)) : [item]',
  '  )',
  '',
  'const paletteGroups = navGroups.map((group) => ({',
  "  heading: group.label ?? '',",
  '  items: leaves(group.items)',
  '}))',
  '',
  'const onNavigate = (event, node) => {',
  '  activeId.value = node.id',
  '}',
  '',
  'const onMobileNavigate = (event, node) => {',
  '  onNavigate(event, node)',
  '  navOpen.value = false',
  '}'
]

const BRAND_BAND = `<div class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)">
  <a
    href="/home"
    aria-label="Azion home"
    class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <Brand kind="default" size="small" />
  </a>
</div>`

const PALETTE = `<CommandMenu v-model:open="paletteOpen">
  <CommandMenu.Input placeholder="Search resources, pages and commands" />
  <CommandMenu.List>
    <CommandMenu.Group v-for="(group, index) in paletteGroups" :key="index" :heading="group.heading">
      <CommandMenu.Item v-for="item in group.items" :key="item.id" :value="item.id">
        <template v-if="item.icon" #prefix>
          <i :class="item.icon" aria-hidden="true" />
        </template>
        {{ item.label }}
      </CommandMenu.Item>
    </CommandMenu.Group>
    <CommandMenu.Group heading="Actions">
      <CommandMenu.Item value="create">
        <template #prefix>
          <i class="pi pi-plus-circle" aria-hidden="true" />
        </template>
        Create Resource
      </CommandMenu.Item>
    </CommandMenu.Group>
    <CommandMenu.Empty>No resource, page or command matches your search.</CommandMenu.Empty>
  </CommandMenu.List>
</CommandMenu>`

const navMenu = (handler) => `<div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
  <Menu :groups="navGroups" :active-id="activeId" role="presentation" @navigate="${handler}">
    <Menu.Back />
  </Menu>
</div>`

const ACCOUNT_OPTIONS = [
  { value: 'settings', label: 'Account Settings', icon: 'pi pi-cog' },
  { value: 'personal-tokens', label: 'Personal Tokens', icon: 'pi pi-key' }
]

const LINK_OPTIONS = [
  { value: 'home', label: 'Home Page', icon: 'pi pi-home' },
  { value: 'changelog', label: 'Changelog', icon: 'pi pi-pencil' },
  { value: 'feedback', label: 'Feedback', icon: 'pi pi-comment' },
  { value: 'docs', label: 'Docs', icon: 'pi pi-book' }
]

const SESSION_OPTIONS = [{ value: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }]

const option = ({ value, label, icon }) => `<Dropdown.Option value="${value}" label="${label}">
  <template #right>
    <i class="${icon}" aria-hidden="true" />
  </template>
</Dropdown.Option>`

const RAIL_FOOTER = `<div class="flex items-center gap-(--spacing-xs)">
  <Avatar label="${USER_EMAIL}" size="small" kind="square" />
  <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">${USER_NAME}</span>
  <Dropdown placement="top-end">
    <Dropdown.Trigger>
      <Tooltip text="Account menu">
        <IconButton icon="pi pi-ellipsis-v" aria-label="Account menu" kind="outlined" size="small" />
      </Tooltip>
    </Dropdown.Trigger>
    <Dropdown.Group>
      <template #top>
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-label-md text-(--text-default)">${USER_NAME}</span>
          <span class="truncate text-body-xs text-(--text-muted)">${USER_EMAIL}</span>
        </div>
      </template>
${each(ACCOUNT_OPTIONS, option, 3)}
    </Dropdown.Group>
    <Dropdown.Group>
      <div class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)">
        <span class="flex-1 truncate text-left text-label-sm text-(--text-default)">Theme</span>
        <ThemeSwitcher v-model:value="theme" aria-label="Theme" />
      </div>
    </Dropdown.Group>
    <Dropdown.Group>
${each(LINK_OPTIONS, option, 3)}
    </Dropdown.Group>
    <Dropdown.Group>
${each(SESSION_OPTIONS, option, 3)}
    </Dropdown.Group>
    <Dropdown.Group>
      <div class="flex justify-center px-(--spacing-xs) py-(--spacing-xxs)">
        <StatusIndicator severity="success" label="All systems normal" />
      </div>
    </Dropdown.Group>
  </Dropdown>
</div>`

const RESIZABLE_RAIL = `<Sidebar
  v-model:width="railWidth"
  v-model:collapsed="railCollapsed"
  resizable
  collapsible
  aria-label="Main navigation"
  collapse-aria-label="Collapse sidebar"
  expand-aria-label="Expand sidebar"
  resize-aria-label="Resize sidebar"
  class="h-full [--sidebar-width:var(--container-2xs)]"
>`

const rail = ({
  palette,
  navigate,
  resizable = false
}) => `${resizable ? RESIZABLE_RAIL : '<Sidebar aria-label="Main navigation">'}
  <template #header>
    <div class="-m-(--spacing-md) flex flex-col">
${indent(BRAND_BAND, 3)}${palette ? `\n${indent(PALETTE, 3)}` : ''}
    </div>
  </template>

${indent(navMenu(navigate), 1)}

  <template #footer>
${indent(RAIL_FOOTER, 2)}
  </template>
</Sidebar>`

const MOBILE_NAV = `<span class="contents md:hidden">
  <Tooltip text="Open navigation" placement="bottom">
    <IconButton icon="pi pi-bars" aria-label="Open navigation" kind="outlined" size="medium" @click="navOpen = true" />
  </Tooltip>
  <a
    href="/home"
    aria-label="Azion home"
    class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <Brand kind="default" size="small" />
  </a>
</span>`

const CRUMB = `<div class="-ml-(--spacing-xs) hidden min-w-0 shrink md:flex">
  <Breadcrumb :items="breadcrumb" />
</div>`

const HEADER_ACTIONS = `<span class="contents @min-[50rem]:hidden">
  <IconButton icon="pi pi-search" aria-label="Search" aria-keyshortcuts="Meta+K" kind="outlined" size="medium" @click="paletteOpen = true" />
</span>
<button
  type="button"
  aria-label="Search"
  aria-keyshortcuts="Meta+K"
  class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none @min-[50rem]:flex"
  @click="paletteOpen = true"
>
  <span class="inline-flex shrink-0 items-center justify-center text-(--text-muted)" aria-hidden="true">
    <i class="pi pi-search" />
  </span>
  <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">Search</span>
  <Kbd meta size="small">K</Kbd>
</button>
<span class="contents md:hidden">
  <Tooltip text="Create" placement="bottom">
    <IconButton icon="pi pi-plus-circle" aria-label="Create" kind="primary" size="medium" />
  </Tooltip>
  <Tooltip text="Agent" placement="bottom">
    <IconButton icon="ai ai-ask-azion" aria-label="Agent" kind="outlined" size="medium" />
  </Tooltip>
</span>
<span class="hidden md:contents">
  <Button label="Create" kind="primary" size="medium" icon="pi pi-plus-circle" />
  <ButtonHighlight label="Agent" size="medium" icon="ai ai-ask-azion" />
</span>
<button
  type="button"
  aria-label="Account settings"
  class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
>
  <Avatar label="${USER_EMAIL}" size="medium" kind="square" />
</button>`

const header = (withBreadcrumb) => `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left>
${indent([MOBILE_NAV, ...(withBreadcrumb ? [CRUMB] : [])].join('\n'), 2)}
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
${indent(HEADER_ACTIONS, 2)}
  </GlobalHeader.Right>
</GlobalHeader>`

export const shell = ({
  withBreadcrumb,
  main
}) => `<div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
  <div class="hidden h-full shrink-0 md:flex">
${indent(rail({ palette: true, navigate: 'onNavigate', resizable: true }), 2)}
  </div>

  <div class="flex min-w-0 flex-1 flex-col">
    <div class="@container shrink-0">
${indent(header(withBreadcrumb), 3)}
    </div>

${indent(main, 2)}
  </div>

  <Drawer v-model:open="navOpen" side="right" size="small">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
${indent(rail({ palette: false, navigate: 'onMobileNavigate' }), 4)}
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</div>`

export const SHELL_COMPONENTS = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  ButtonHighlight,
  CommandMenu,
  'CommandMenu.Input': CommandMenu.Input,
  'CommandMenu.List': CommandMenu.List,
  'CommandMenu.Group': CommandMenu.Group,
  'CommandMenu.Item': CommandMenu.Item,
  'CommandMenu.Empty': CommandMenu.Empty,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  IconButton,
  Kbd,
  Menu,
  'Menu.Back': Menu.Back,
  Sidebar,
  StatusIndicator,
  ThemeSwitcher,
  Tooltip
}

export const APPLICATION_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'device-groups', label: 'Device Groups' },
  { value: 'cache-settings', label: 'Cache Settings' },
  { value: 'functions-instances', label: 'Functions Instances' },
  { value: 'rules-engine', label: 'Rules Engine' },
  { value: 'main-settings', label: 'Settings' }
]

export const WORKLOAD_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'settings', label: 'Settings' }
]

export const FIREWALL_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'rules-engine', label: 'Rules Engine' },
  { value: 'main-settings', label: 'Settings' }
]

export const pageTabs = (actions = '') => `<div class="shrink-0 border-b border-(--border-default)">
  <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
    <div class="-ml-(--spacing-xs) min-w-0 flex-1">
      <TabView v-model:value="activeTab">
        <TabView.List>
          <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
        </TabView.List>
      </TabView>
    </div>${
      actions
        ? `\n    <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">\n${indent(actions, 3)}\n    </div>`
        : ''
    }
  </div>
</div>`

export const settingsTab = ({ ariaLabel, column, bar }) => `<main class="flex h-full flex-col">
${indent(pageTabs())}
  <form class="flex min-h-0 flex-1 flex-col overflow-auto" aria-label="${ariaLabel}" novalidate @submit.prevent>
${indent(column, 2)}
${indent(bar, 2)}
  </form>
</main>`

export const region = (label, fill = false) =>
  `<div class="flex ${fill ? 'min-h-0 flex-1' : 'min-h-(--container-3xs)'} items-center justify-center text-body-sm text-(--text-muted)">${label}</div>`

export const pageScroll = (main, scroll = 'overflow-auto') =>
  `<div class="min-h-0 flex-1 ${scroll} animate-page-enter motion-reduce:animate-none">
${indent(main)}
</div>`

const WEBKIT_IMPORT = /^import \w+ from '@aziontech\/webkit\//
const VUE_IMPORT = /^import \{ (.*) \} from 'vue'$/

const splitScript = (lines) => {
  const webkit = lines.filter((line) => WEBKIT_IMPORT.test(line))
  const vue = lines.flatMap((line) => line.match(VUE_IMPORT)?.[1].split(', ') ?? [])
  const body = lines.filter((line) => !WEBKIT_IMPORT.test(line) && !VUE_IMPORT.test(line))
  while (body[0] === '') body.shift()
  return { webkit, vue, body }
}

export const mergeScripts = (...scripts) => {
  const parts = scripts.map(splitScript)
  const webkit = [...new Set(parts.flatMap((part) => part.webkit))].sort()
  const vue = [...new Set(parts.flatMap((part) => part.vue))].sort()
  return [
    ...webkit,
    `import { ${vue.join(', ')} } from 'vue'`,
    ...parts.flatMap((part) => ['', ...part.body])
  ]
}
