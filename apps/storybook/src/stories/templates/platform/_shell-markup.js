import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
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
import InputText from '@aziontech/webkit/input-text'
import Kbd from '@aziontech/webkit/kbd'
import Menu from '@aziontech/webkit/menu'
import Select from '@aziontech/webkit/select'
import Sidebar from '@aziontech/webkit/sidebar'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import Tag from '@aziontech/webkit/tag'
import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref, watch } from 'vue'

import { each, indent } from '../../_shared/markup'

const USER_EMAIL = 'myemail@azion.com'
const USER_NAME = 'myemail'
export const DOCS_HREF =
  'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'

export const NAV_GROUPS = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: 'pi pi-home', path: '/home' },
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
        icon: 'ai ai-certificate-manager',
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
        id: 'real-time-metrics-module',
        label: 'Real-Time Metrics',
        icon: 'ai ai-real-time-metrics',
        kind: 'drill',
        href: '/real-time-metrics',
        groups: [
          { items: [{ id: 'real-time-metrics', label: 'Overview', path: '/real-time-metrics' }] },
          {
            label: 'Build',
            items: [
              {
                id: 'rtm-applications',
                label: 'Applications',
                path: '/real-time-metrics',
                query: { dashboard: 'applications' }
              },
              {
                id: 'rtm-tiered-cache',
                label: 'Tiered Cache',
                path: '/real-time-metrics',
                query: { dashboard: 'tiered-cache' }
              },
              {
                id: 'rtm-functions',
                label: 'Functions',
                path: '/real-time-metrics',
                query: { dashboard: 'functions' }
              },
              {
                id: 'rtm-image-processor',
                label: 'Image Processor',
                path: '/real-time-metrics',
                query: { dashboard: 'image-processor' }
              }
            ]
          },
          {
            label: 'Secure',
            items: [
              {
                id: 'rtm-waf',
                label: 'WAF',
                path: '/real-time-metrics',
                query: { dashboard: 'waf' }
              },
              {
                id: 'rtm-firewall',
                label: 'Firewall',
                path: '/real-time-metrics',
                query: { dashboard: 'firewall' }
              },
              {
                id: 'rtm-dns',
                label: 'DNS',
                path: '/real-time-metrics',
                query: { dashboard: 'dns' }
              },
              {
                id: 'rtm-bot-manager',
                label: 'Bot Manager',
                path: '/real-time-metrics',
                query: { dashboard: 'bot-manager' }
              }
            ]
          },
          {
            label: 'Observe',
            items: [
              {
                id: 'rtm-data-stream',
                label: 'Data Stream',
                path: '/real-time-metrics',
                query: { dashboard: 'data-stream' }
              }
            ]
          }
        ]
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
    item.groups
      ? leaves(item.groups.flatMap((group) => group.items))
      : item.children
        ? leaves(item.children)
        : [item]
  )

const PALETTE_GROUPS = NAV_GROUPS.flatMap((group, groupIndex) => {
  const blocks = []
  let run = []
  const flush = () => {
    if (run.length) {
      blocks.push({
        key: `area-${groupIndex}-${blocks.length}`,
        heading: group.label ?? '',
        items: leaves(run)
      })
    }
    run = []
  }
  for (const item of group.items) {
    if (item.groups || item.children) {
      flush()
      blocks.push({ key: item.id, heading: item.label, items: leaves([item]) })
    } else run.push(item)
  }
  flush()
  return blocks
})

export const PALETTE_RECENTS = [
  {
    key: 'workloads/1020655',
    name: 'workload_01',
    icon: 'ai ai-workloads',
    typeLabel: 'Workload',
    navId: 'workloads'
  },
  {
    key: 'domains/domain-1020655',
    name: 'my-workload-1.azion.run',
    icon: 'ai ai-domains',
    typeLabel: 'Domain',
    navId: 'workloads'
  },
  {
    key: 'sql-database/feature-flags',
    name: 'feature-flags',
    icon: 'ai ai-edge-sql',
    typeLabel: 'Database',
    navId: 'sql-database'
  }
]

export const ACCOUNT_COMMANDS = [
  { id: 'settings', label: 'Account Settings', icon: 'pi pi-cog' },
  { id: 'personal-tokens', label: 'Personal Tokens', icon: 'pi pi-key' },
  { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
  { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
]

export const shellState = (active = 'workloads') => {
  const activeId = ref(active)
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)
  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })
  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )
  const actionCommands = computed(() => [
    { id: 'create', label: 'Create Resource', icon: 'pi pi-plus-circle' },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand Sidebar' : 'Collapse Sidebar',
      icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'
    }
  ])
  const onNavigate = (event, node) => {
    activeId.value = node.id
  }
  const onMobileNavigate = (event, node) => {
    onNavigate(event, node)
    navOpen.value = false
  }
  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = PALETTE_RECENTS.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }
  return {
    navGroups: NAV_GROUPS,
    paletteGroups: PALETTE_GROUPS,
    recentRows: PALETTE_RECENTS,
    accountCommands: ACCOUNT_COMMANDS,
    activeId,
    navOpen,
    paletteOpen,
    paletteQuery,
    theme,
    railWidth,
    railCollapsed,
    actionCommands,
    onNavigate,
    onMobileNavigate,
    onPaletteSelect
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
  `import { ${[...new Set(['computed', 'ref', 'watch', ...vue])].sort().join(', ')} } from 'vue'`,
  '',
  declare('navGroups', NAV_GROUPS),
  '',
  declare('recentRows', PALETTE_RECENTS),
  '',
  declare('accountCommands', ACCOUNT_COMMANDS),
  ...declarations,
  '',
  `const activeId = ref('${active}')`,
  'const navOpen = ref(false)',
  'const paletteOpen = ref(false)',
  "const paletteQuery = ref('')",
  "const theme = ref('system')",
  'const railWidth = ref(null)',
  'const railCollapsed = ref(false)',
  ...state,
  '',
  'watch(paletteOpen, () => {',
  "  paletteQuery.value = ''",
  '})',
  '',
  'const leaves = (items) =>',
  '  items.flatMap((item) =>',
  '    item.groups',
  '      ? leaves(item.groups.flatMap((group) => group.items))',
  '      : item.children',
  '        ? leaves(item.children)',
  '        : [item]',
  '  )',
  '',
  'const paletteGroups = navGroups.flatMap((group, groupIndex) => {',
  '  const blocks = []',
  '  let run = []',
  '  const flush = () => {',
  '    if (run.length) {',
  '      blocks.push({',
  '        key: `area-${groupIndex}-${blocks.length}`,',
  "        heading: group.label ?? '',",
  '        items: leaves(run)',
  '      })',
  '    }',
  '    run = []',
  '  }',
  '  for (const item of group.items) {',
  '    if (item.groups || item.children) {',
  '      flush()',
  '      blocks.push({ key: item.id, heading: item.label, items: leaves([item]) })',
  '    } else run.push(item)',
  '  }',
  '  flush()',
  '  return blocks',
  '})',
  '',
  'const resolvedTheme = computed(() =>',
  "  theme.value === 'system'",
  "    ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches",
  "      ? 'dark'",
  "      : 'light'",
  '    : theme.value',
  ')',
  '',
  'const actionCommands = computed(() => [',
  "  { id: 'create', label: 'Create Resource', icon: 'pi pi-plus-circle' },",
  '  {',
  "    id: 'theme',",
  "    label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',",
  "    icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'",
  '  },',
  '  {',
  "    id: 'sidebar',",
  "    label: railCollapsed.value ? 'Expand Sidebar' : 'Collapse Sidebar',",
  "    icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'",
  '  }',
  '])',
  '',
  'const onNavigate = (event, node) => {',
  '  activeId.value = node.id',
  '}',
  '',
  'const onMobileNavigate = (event, node) => {',
  '  onNavigate(event, node)',
  '  navOpen.value = false',
  '}',
  '',
  'const onPaletteSelect = (event, value) => {',
  "  const [scope, id] = String(value).split(':')",
  "  if (scope === 'nav') activeId.value = id",
  "  if (scope === 'res') {",
  '    activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value',
  '  }',
  "  if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'",
  "  if (id === 'sidebar') railCollapsed.value = !railCollapsed.value",
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

const PALETTE = `<CommandMenu v-model:open="paletteOpen" @select="onPaletteSelect">
  <CommandMenu.Input
    placeholder="Search resources, pages and commands"
    @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
  />
  <CommandMenu.List>
    <CommandMenu.Group v-if="!paletteQuery" key="recents" heading="Recents">
      <CommandMenu.Item v-for="row in recentRows" :key="row.key" :value="'res:' + row.key">
        <template #prefix>
          <i :class="row.icon" aria-hidden="true" />
        </template>
        {{ row.name }}
        <template #suffix>
          <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
        </template>
      </CommandMenu.Item>
    </CommandMenu.Group>

    <CommandMenu.Separator v-if="!paletteQuery" key="recents-rule" />

    <CommandMenu.Group v-for="group in paletteGroups" :key="group.key" :heading="group.heading">
      <CommandMenu.Item v-for="item in group.items" :key="item.id" :value="'nav:' + item.id">
        <template v-if="item.icon" #prefix>
          <i :class="item.icon" aria-hidden="true" />
        </template>
        {{ item.label }}
      </CommandMenu.Item>
    </CommandMenu.Group>

    <CommandMenu.Separator key="commands-rule" />

    <CommandMenu.Group heading="Actions">
      <CommandMenu.Item v-for="command in actionCommands" :key="command.id" :value="'cmd:' + command.id">
        <template #prefix>
          <i :class="command.icon" aria-hidden="true" />
        </template>
        {{ command.label }}
      </CommandMenu.Item>
    </CommandMenu.Group>

    <CommandMenu.Group heading="Account">
      <CommandMenu.Item v-for="command in accountCommands" :key="command.id" :value="'cmd:' + command.id">
        <template #prefix>
          <i :class="command.icon" aria-hidden="true" />
        </template>
        {{ command.label }}
      </CommandMenu.Item>
    </CommandMenu.Group>

    <CommandMenu.Empty>No resource, page or command matches your search.</CommandMenu.Empty>
  </CommandMenu.List>
</CommandMenu>`

const navMenu = (handler) => `<Menu
  class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)"
  :groups="navGroups"
  :active-id="activeId"
  role="presentation"
  @navigate="${handler}"
>
  <Menu.Back />
</Menu>`

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
      <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
        <Button label="Upgrade to Pro" kind="secondary" size="medium" class="w-full" />
        <div class="flex justify-center px-(--spacing-xs)">
          <StatusIndicator severity="success" label="All systems normal" />
        </div>
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
  class="hidden h-full [--sidebar-width:var(--container-2xs)] md:flex"
>`

const rail = ({
  palette,
  navigate,
  resizable = false
}) => `${resizable ? RESIZABLE_RAIL : '<Sidebar aria-label="Main navigation" class="h-full w-full">'}
  <template #header>
    <div class="-m-(--spacing-md) flex flex-col">
${indent(BRAND_BAND, 3)}${palette ? `\n\n${indent(PALETTE, 3)}` : ''}
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
</span>

<a
  href="/home"
  aria-label="Azion home"
  class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
>
  <Brand kind="default" size="small" />
</a>`

const CRUMB_CLASS = '-ml-(--spacing-xs) hidden w-auto min-w-0 shrink md:flex'

const crumbTrail = (crumb) =>
  crumb
    ? `<Breadcrumb class="${CRUMB_CLASS}">
  <Breadcrumb.List>
    <template v-for="(item, index) in leadingCrumbs" :key="item.label + '-' + index">
      <li class="inline-flex items-center">
        <Breadcrumb.Item :label="item.label" :href="item.href" />
      </li>
      <Breadcrumb.Separator />
    </template>
    <li class="inline-flex min-w-0 items-center">
${indent(crumb, 3)}
    </li>
  </Breadcrumb.List>
</Breadcrumb>`
    : `<Breadcrumb :items="breadcrumb" class="${CRUMB_CLASS}" />`

const HEADER_ACTIONS = `<span class="contents @min-[47rem]:hidden">
  <IconButton icon="pi pi-search" kind="outlined" size="medium" aria-label="Search" aria-keyshortcuts="Meta+K" @click="paletteOpen = true" />
</span>
<button
  type="button"
  aria-label="Search"
  aria-keyshortcuts="Meta+K"
  class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
  @click="paletteOpen = true"
>
  <span class="inline-flex shrink-0 items-center justify-center text-(--text-muted)" aria-hidden="true">
    <i class="pi pi-search" />
  </span>
  <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">Search</span>
  <Kbd meta size="small" class="shrink-0">K</Kbd>
</button>

<span class="contents md:hidden">
  <Tooltip text="Create" placement="bottom">
    <IconButton icon="pi pi-plus-circle" kind="primary" size="medium" aria-label="Create" />
  </Tooltip>
  <Tooltip text="Agent" placement="bottom">
    <IconButton icon="ai ai-ask-azion" kind="outlined" size="medium" aria-label="Agent" />
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

const header = (
  withBreadcrumb,
  crumb
) => `<GlobalHeader aria-label="Azion Console" class="@container">
  <GlobalHeader.Left class="justify-start!">
${indent([MOBILE_NAV, ...(withBreadcrumb || crumb ? [crumbTrail(crumb)] : [])].join('\n\n'), 2)}
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
${indent(HEADER_ACTIONS, 2)}
  </GlobalHeader.Right>
</GlobalHeader>`

export const shell = ({
  withBreadcrumb,
  main,
  crumb = ''
}) => `<div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
${indent(rail({ palette: true, navigate: 'onNavigate', resizable: true }), 1)}

  <div class="flex min-w-0 flex-1 flex-col">
${indent(header(withBreadcrumb, crumb), 2)}

${indent(main, 2)}
  </div>

  <Drawer v-model:open="navOpen" side="right" size="small">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent aria-label="Navigation">
${indent(rail({ palette: false, navigate: 'onMobileNavigate' }), 4)}
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</div>`

const ENVIRONMENT_TRIGGER_CLASS =
  'h-6! w-auto! min-w-0 gap-(--spacing-xxs)! border-0! bg-transparent! px-(--spacing-xs)! text-label-md! hover:bg-(--bg-mask)! focus-visible:ring-offset-0! data-[state=open]:bg-(--bg-mask)!'

export const ENVIRONMENT_CRUMB = `<Select
  :model-value="environment"
  :display-value="(value) => String(value ?? '')"
  class="flex! w-auto! min-w-0"
  @update:model-value="pickEnvironment"
  @update:open="onEnvironmentOpen"
>
  <Select.Trigger aria-label="Switch environment" class="${ENVIRONMENT_TRIGGER_CLASS}" />
  <Select.Content class="min-w-57">
    <template #search>
      <InputText
        v-model="environmentQuery"
        size="small"
        placeholder="Search environments"
        aria-label="Search environments"
        @keydown.stop
      >
        <template #iconLeft>
          <i class="pi pi-search" aria-hidden="true" />
        </template>
      </InputText>
    </template>
    <Select.Group label="Environments">
      <Select.Option v-for="entry in environmentMatches" :key="entry.name" :value="entry.name">
        {{ entry.name }}
        <template #tag>
          <Tag :label="entry.policy" severity="secondary" size="small" />
        </template>
      </Select.Option>
      <p v-if="!environmentMatches.length" class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)">
        No environments match "{{ environmentQuery }}".
      </p>
    </Select.Group>
    <template #footer>
      <Select.Option value="__create-environment__" class="w-full">
        <span class="flex items-center gap-(--spacing-xs)">
          <i class="pi pi-plus-circle" aria-hidden="true" />
          Add Environment
        </span>
      </Select.Option>
    </template>
  </Select.Content>
</Select>`

export const WORKLOAD_CRUMBS = [
  { label: 'Workloads', href: '/workloads' },
  { label: 'workload_01', href: '/workloads/1020655?name=workload_01' }
]

export const WORKLOAD_ENVIRONMENTS = [
  { name: 'Production', policy: 'Single' },
  { name: 'Preview', policy: 'Versioned' }
]

export const environmentCrumbState = () => {
  const environment = ref(WORKLOAD_ENVIRONMENTS[0].name)
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return WORKLOAD_ENVIRONMENTS
    return WORKLOAD_ENVIRONMENTS.filter((entry) => entry.name.toLowerCase().includes(needle))
  })
  const pickEnvironment = (value) => {
    if (value !== '__create-environment__') environment.value = value
  }
  const onEnvironmentOpen = (open) => {
    if (!open) environmentQuery.value = ''
  }
  return {
    leadingCrumbs: WORKLOAD_CRUMBS,
    environments: WORKLOAD_ENVIRONMENTS,
    environment,
    environmentQuery,
    environmentMatches,
    pickEnvironment,
    onEnvironmentOpen
  }
}

export const ENVIRONMENT_CRUMB_DECLARATIONS = [
  '',
  declare('leadingCrumbs', WORKLOAD_CRUMBS),
  '',
  declare('environments', WORKLOAD_ENVIRONMENTS)
]

export const ENVIRONMENT_CRUMB_STATE = [
  "const environment = ref('Production')",
  "const environmentQuery = ref('')",
  '',
  'const environmentMatches = computed(() => {',
  '  const needle = environmentQuery.value.trim().toLowerCase()',
  '  if (!needle) return environments',
  '  return environments.filter((entry) => entry.name.toLowerCase().includes(needle))',
  '})',
  '',
  'const pickEnvironment = (value) => {',
  "  if (value !== '__create-environment__') environment.value = value",
  '}',
  '',
  'const onEnvironmentOpen = (open) => {',
  "  if (!open) environmentQuery.value = ''",
  '}'
]

export const ENVIRONMENT_CRUMB_PARTS = ['InputText', 'Select', 'Tag']

export const ENVIRONMENT_CRUMB_COMPONENTS = {
  InputText,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Group': Select.Group,
  'Select.Option': Select.Option,
  Tag
}

export const SHELL_COMPONENTS = {
  Avatar,
  Brand,
  Breadcrumb,
  'Breadcrumb.List': Breadcrumb.List,
  'Breadcrumb.Item': Breadcrumb.Item,
  'Breadcrumb.Separator': Breadcrumb.Separator,
  Button,
  ButtonHighlight,
  CommandMenu,
  'CommandMenu.Input': CommandMenu.Input,
  'CommandMenu.List': CommandMenu.List,
  'CommandMenu.Group': CommandMenu.Group,
  'CommandMenu.Item': CommandMenu.Item,
  'CommandMenu.Separator': CommandMenu.Separator,
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

export const pageTabs = (actions = '') => `<div class="border-b border-(--border-default)">
  <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
    <TabView v-model:value="activeTab" class="-ml-(--spacing-xs) min-w-0 flex-1">
      <TabView.List>
        <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
      </TabView.List>
    </TabView>${
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

export const AGENT_MARK_IMPORTS = [
  "import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'",
  "import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'",
  "import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'",
  "import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'"
]

export const AGENT_MARKS = [
  { name: 'claude', src: claudeMark, mono: false },
  { name: 'codex', src: codexMark, mono: true },
  { name: 'gemini', src: geminiMark, mono: false },
  { name: 'cursor', src: cursorMark, mono: true }
]

export const AGENT_MARKS_LINES = [
  'const agentMarks = [',
  "  { name: 'claude', src: claudeMark, mono: false },",
  "  { name: 'codex', src: codexMark, mono: true },",
  "  { name: 'gemini', src: geminiMark, mono: false },",
  "  { name: 'cursor', src: cursorMark, mono: true }",
  ']'
]

export const ICON_FRAME_CLASS =
  'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)'

export const iconFrame = (icon) => `<span class="${ICON_FRAME_CLASS}">
  <i class="${icon} text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
</span>`

export const AGENT_LOGOS = `<span v-for="agent in agentMarks" :key="agent.name" class="${ICON_FRAME_CLASS}">
  <span
    v-if="agent.mono"
    class="size-(--size-4) shrink-0 bg-current text-(--text-default) mask-(--agent-mark) mask-contain mask-center mask-no-repeat"
    :style="{ '--agent-mark': 'url(' + agent.src + ')' }"
  />
  <img v-else :src="agent.src" alt="" class="size-(--size-4) shrink-0" />
</span>`

export const AGENT_PROMO = {
  title: 'Set up Azion with your agent',
  description: 'Give your editor a prompt that teaches it to build and deploy here.'
}

export const promoCard = ({
  title,
  description,
  logos,
  navigates = false
}) => `<CardBox :padded="false" class="w-full">
  <template #content>
    <button
      type="button"
      class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-left transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
    >
      <span
        class="flex items-center [&>*+*]:-ml-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ml-1.5 group-focus-visible:[&>*+*]:-ml-1.5 motion-reduce:[&>*+*]:transition-none"
        aria-hidden="true"
      >
${indent(logos, 4)}
      </span>

      <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <span class="text-heading-xxs text-(--text-default)">${title}</span>
        <span class="text-pretty text-body-sm text-(--text-muted)">${description}</span>
      </span>${
        navigates
          ? `

      <i
        class="pi pi-external-link absolute right-(--spacing-md) top-(--spacing-md) text-body-sm leading-none text-(--text-muted) transition-colors duration-150 ease-out motion-reduce:transition-none group-hover:text-(--text-default)"
        aria-hidden="true"
      />`
          : ''
      }
    </button>
  </template>
</CardBox>`
