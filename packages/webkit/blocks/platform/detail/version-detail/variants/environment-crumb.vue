<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Menu from '@aziontech/webkit/menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SplitButton from '@aziontech/webkit/split-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', path: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', path: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          path: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', path: '/resources' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', path: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', path: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', path: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', path: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', path: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', path: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', path: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', path: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          path: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', path: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', path: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', path: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  path: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  path: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  path: '/metrics',
                  query: { dashboard: 'cache' }
                }
              ]
            },
            {
              label: 'Security',
              items: [
                {
                  id: 'metrics-domains',
                  label: 'Domains',
                  path: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  path: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  path: '/metrics',
                  query: { dashboard: 'rule-sets' }
                }
              ]
            },
            {
              label: 'Data',
              items: [
                {
                  id: 'metrics-databases',
                  label: 'Databases',
                  path: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  path: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', path: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', path: '/catalog' },
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
                  label: 'Build and deployment',
                  path: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  path: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', path: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', path: '/account/activity' }
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

  const recentRows = [
    {
      key: 'resources/1020655',
      name: 'resource-01',
      icon: 'pi pi-box',
      typeLabel: 'Resource',
      navId: 'resources'
    },
    {
      key: 'domains/domain-1020655',
      name: 'app.example.com',
      icon: 'pi pi-globe',
      typeLabel: 'Domain',
      navId: 'domains'
    },
    {
      key: 'databases/feature-flags',
      name: 'feature-flags',
      icon: 'pi pi-database',
      typeLabel: 'Database',
      navId: 'databases'
    }
  ]

  const accountCommands = [
    { id: 'settings', label: 'Account settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const activeId = ref('resources')
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const leaves = (items) =>
    items.flatMap((item) =>
      item.groups
        ? leaves(item.groups.flatMap((group) => group.items))
        : item.children
          ? leaves(item.children)
          : [item]
    )

  const paletteGroups = navGroups.flatMap((group, groupIndex) => {
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
      label: resolvedTheme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar',
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
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'variables', label: 'Variables' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'custom-code', label: 'Custom Code' },
    { value: 'rules', label: 'Rules' }
  ]
  const versions = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'Herbert Júlio',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Rafael Umman',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Marcus Grando',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function "ab-test" arguments',
      author: 'Bruno Germano',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable "API_URL"',
      author: 'Gab Lisboa',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Robson Junior',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Isaque Böck',
      createdAgo: '1 week ago'
    }
  ]
  const version = {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
    comment: 'Cache static assets for 30 days',
    author: 'Herbert Júlio',
    createdAgo: '14 hours ago'
  }
  const earlier = [
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Rafael Umman',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Marcus Grando',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function "ab-test" arguments',
      author: 'Bruno Germano',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable "API_URL"',
      author: 'Gab Lisboa',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Robson Junior',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Isaque Böck',
      createdAgo: '1 week ago'
    }
  ]
  const defaultModules = [
    {
      key: 'protocol_optimization',
      title: 'Protocol Optimization',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Detect device types to configure responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on every request.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const versionId = ref('ADA8FMMR')
  const query = ref('')

  const environments = [
    { name: 'Production', policy: 'Single', serves: 'AEO25I38' },
    { name: 'Preview', policy: 'Versioned', serves: 'AG1VVDJP' },
    { name: 'Staging', policy: 'Versioned', serves: '' }
  ]
  const environment = ref('Production')
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })
  const servedIn = (id) =>
    environments.filter((entry) => entry.serves === id).map((entry) => entry.name)
  const pickEnvironment = (value) => {
    if (value === '__create-environment__') return
    environment.value = value
    const served = environments.find((entry) => entry.name === value)?.serves
    if (served) versionId.value = served
  }
  const pickVersion = (value) => {
    if (value !== '__create-version__') versionId.value = value
  }
  const activeTab = ref('main-settings')
  const settings = reactive({
    name: 'web-app',
    active: true,
    modules: {
      protocol_optimization: true,
      cache: true,
      device_detection: false,
      custom_code: true,
      image_optimization: false,
      load_balancing: false,
      web_socket_proxy: false
    }
  })
  const saveAction = ref('deploy')
  const historyCollapsed = ref(true)
  const historyBasis = ref(348)
  const description = ref('Cache static assets for 30 days')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (event, value) => {
    if (value === 'history' && !historyCollapsed.value) {
      historyCollapsed.value = true
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyCollapsed.value = false
  }
</script>

<template>
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <div class="hidden h-full [--sidebar-width:var(--container-2xs)] md:flex">
      <Sidebar
        v-model:width="railWidth"
        v-model:collapsed="railCollapsed"
        resizable
        collapsible
        aria-label="Main navigation"
        collapse-aria-label="Collapse sidebar"
        expand-aria-label="Expand sidebar"
        resize-aria-label="Resize sidebar"
      >
        <template #header>
          <div class="-m-(--spacing-md) flex flex-col">
            <div
              class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
            >
              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </div>

            <Command
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <Command.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <Command.List>
                <Command.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <Command.Item
                    v-for="row in recentRows"
                    :key="row.key"
                    :value="'res:' + row.key"
                  >
                    <template #prefix>
                      <i
                        :class="row.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ row.name }}
                    <template #suffix>
                      <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
                    </template>
                  </Command.Item>
                </Command.Group>

                <Command.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <Command.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <Command.Item
                    v-for="item in group.items"
                    :key="item.id"
                    :value="'nav:' + item.id"
                  >
                    <template
                      v-if="item.icon"
                      #prefix
                    >
                      <i
                        :class="item.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ item.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Separator key="commands-rule" />

                <Command.Group heading="Actions">
                  <Command.Item
                    v-for="command in actionCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Account">
                  <Command.Item
                    v-for="command in accountCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Empty>No resource, page or command matches your search.</Command.Empty>
              </Command.List>
            </Command>
          </div>
        </template>

        <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
          <Menu
            :groups="navGroups"
            :active-id="activeId"
            role="presentation"
            @navigate="onNavigate"
          >
            <Menu.Back />
          </Menu>
        </div>

        <template #footer>
          <div class="flex items-center gap-(--spacing-xs)">
            <Avatar
              label="alex@example.com"
              size="small"
              kind="square"
            />
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">alex</span>
            <DropdownMenu placement="top-end">
              <DropdownMenu.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <DropdownMenu.Option
                  value="settings"
                  label="Account settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="personal-tokens"
                  label="Personal tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model="theme"
                    aria-label="Theme"
                  />
                </div>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="home"
                  label="Home page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
                  <Button
                    label="Upgrade to Pro"
                    kind="secondary"
                    size="medium"
                    class="w-full"
                  />
                  <div class="flex justify-center px-(--spacing-xs)">
                    <StatusIndicator
                      severity="success"
                      label="All systems normal"
                    />
                  </div>
                </div>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </template>
      </Sidebar>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="@container">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left>
            <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
              <span class="contents md:hidden">
                <Tooltip
                  text="Open navigation"
                  placement="bottom"
                >
                  <IconButton
                    icon="pi pi-bars"
                    aria-label="Open navigation"
                    kind="outlined"
                    size="medium"
                    @click="navOpen = true"
                  />
                </Tooltip>
              </span>

              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>

              <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb
                  :items="[]"
                  class="w-full"
                >
                  <Breadcrumb.List>
                    <li class="inline-flex items-center">
                      <Breadcrumb.Item
                        label="Resources"
                        href="/resources"
                      />
                    </li>
                    <Breadcrumb.Separator />
                    <li class="inline-flex items-center">
                      <Breadcrumb.Item
                        label="web-app"
                        href="/resources/1784552864?tab=versions"
                      />
                    </li>
                    <Breadcrumb.Separator />
                    <li class="inline-flex min-w-0 items-center">
                      <div class="min-w-0">
                        <Select
                          :model-value="environment"
                          :display-value="(value) => String(value ?? '')"
                          class="w-full"
                          @update:model-value="pickEnvironment"
                          @update:open="
                            (open) => {
                              if (!open) environmentQuery = ''
                            }
                          "
                        >
                          <Select.Trigger aria-label="Switch environment" />
                          <Select.Content>
                            <template #search>
                              <Input
                                v-model="environmentQuery"
                                size="small"
                                placeholder="Search environments"
                                aria-label="Search environments"
                                @keydown.stop
                              >
                                <template #iconLeft>
                                  <i
                                    class="pi pi-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </template>
                            <Select.Group label="Environments">
                              <Select.Option
                                v-for="entry in environmentMatches"
                                :key="entry.name"
                                :value="entry.name"
                              >
                                {{ entry.name }}
                                <template #tag>
                                  <Tag
                                    :label="entry.policy"
                                    severity="secondary"
                                    size="small"
                                  />
                                </template>
                              </Select.Option>
                              <p
                                v-if="!environmentMatches.length"
                                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                              >
                                No environments match "{{ environmentQuery }}".
                              </p>
                            </Select.Group>
                            <template #footer>
                              <Select.Option
                                value="__create-environment__"
                                class="w-full"
                              >
                                <span class="flex items-center gap-(--spacing-xs)">
                                  <i
                                    class="pi pi-plus-circle"
                                    aria-hidden="true"
                                  />
                                  Add Environment
                                </span>
                              </Select.Option>
                            </template>
                          </Select.Content>
                        </Select>
                      </div>
                    </li>
                    <Breadcrumb.Separator />
                    <li class="inline-flex min-w-0 items-center">
                      <div class="min-w-0">
                        <Select
                          :model-value="versionId"
                          @update:model-value="pickVersion"
                          :display-value="
                            (id) =>
                              versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
                          "
                          class="w-full"
                          @update:open="
                            (open) => {
                              if (!open) query = ''
                            }
                          "
                        >
                          <Select.Trigger aria-label="Switch version" />
                          <Select.Content>
                            <template #search>
                              <Input
                                v-model="query"
                                size="small"
                                placeholder="Search versions"
                                aria-label="Search versions"
                                @keydown.stop
                              >
                                <template #iconLeft>
                                  <i
                                    class="pi pi-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </template>
                            <Select.Group label="Versions">
                              <Select.Option
                                v-for="entry in matches"
                                :key="entry.id"
                                :value="entry.id"
                              >
                                {{ entry.name }}
                                <span
                                  v-if="servedIn(entry.id).length"
                                  class="text-body-xs text-(--text-muted)"
                                  >Live in {{ servedIn(entry.id).join(', ') }}</span
                                >
                                <template #tag>
                                  <Tag
                                    :label="entry.tag.label"
                                    :severity="entry.tag.severity"
                                    :icon="entry.tag.icon"
                                    size="small"
                                  />
                                </template>
                              </Select.Option>
                              <p
                                v-if="!matches.length"
                                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                              >
                                No versions match "{{ query }}".
                              </p>
                            </Select.Group>
                            <template #footer>
                              <Select.Option
                                value="__create-version__"
                                class="w-full"
                              >
                                <span class="flex items-center gap-(--spacing-xs)">
                                  <i
                                    class="pi pi-plus-circle"
                                    aria-hidden="true"
                                  />
                                  Add Version
                                </span>
                              </Select.Option>
                            </template>
                          </Select.Content>
                        </Select>
                      </div>
                    </li>
                  </Breadcrumb.List>
                </Breadcrumb>
              </div>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <SearchTrigger
              collapsible
              @open="paletteOpen = true"
            />

            <span class="contents md:hidden">
              <Tooltip
                text="Create"
                placement="bottom"
              >
                <IconButton
                  icon="pi pi-plus-circle"
                  kind="primary"
                  size="medium"
                  aria-label="Create"
                />
              </Tooltip>
              <Tooltip
                text="Agent"
                placement="bottom"
              >
                <IconButton
                  icon="ai ai-ask-azion"
                  kind="outlined"
                  size="medium"
                  aria-label="Agent"
                />
              </Tooltip>
            </span>
            <span class="hidden md:contents">
              <Button
                label="Create"
                kind="primary"
                size="medium"
                icon="pi pi-plus-circle"
              />
              <ButtonHighlight
                label="Agent"
                size="medium"
                icon="ai ai-ask-azion"
              />
            </span>

            <button
              type="button"
              aria-label="Account settings"
              class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                label="alex@example.com"
                size="medium"
                kind="square"
              />
            </button>
          </GlobalHeader.Right>
        </GlobalHeader>
        <nav
          aria-label="Breadcrumb"
          class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
        >
          <Tooltip text="Back to web-app versions">
            <IconButton
              icon="pi pi-arrow-left"
              kind="transparent"
              size="medium"
              href="/resources/1784552864?tab=versions"
              aria-label="Back to web-app versions"
            />
          </Tooltip>
          <div class="min-w-0 flex-1">
            <Select
              :model-value="environment"
              :display-value="(value) => String(value ?? '')"
              class="w-full"
              @update:model-value="pickEnvironment"
              @update:open="
                (open) => {
                  if (!open) environmentQuery = ''
                }
              "
            >
              <Select.Trigger aria-label="Switch environment" />
              <Select.Content>
                <template #search>
                  <Input
                    v-model="environmentQuery"
                    size="small"
                    placeholder="Search environments"
                    aria-label="Search environments"
                    @keydown.stop
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <Select.Group label="Environments">
                  <Select.Option
                    v-for="entry in environmentMatches"
                    :key="entry.name"
                    :value="entry.name"
                  >
                    {{ entry.name }}
                    <template #tag>
                      <Tag
                        :label="entry.policy"
                        severity="secondary"
                        size="small"
                      />
                    </template>
                  </Select.Option>
                  <p
                    v-if="!environmentMatches.length"
                    class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                  >
                    No environments match "{{ environmentQuery }}".
                  </p>
                </Select.Group>
                <template #footer>
                  <Select.Option
                    value="__create-environment__"
                    class="w-full"
                  >
                    <span class="flex items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-plus-circle"
                        aria-hidden="true"
                      />
                      Add Environment
                    </span>
                  </Select.Option>
                </template>
              </Select.Content>
            </Select>
          </div>
          <div class="min-w-0 flex-1">
            <Select
              :model-value="versionId"
              @update:model-value="pickVersion"
              :display-value="
                (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
              "
              class="w-full"
              @update:open="
                (open) => {
                  if (!open) query = ''
                }
              "
            >
              <Select.Trigger aria-label="Switch version" />
              <Select.Content>
                <template #search>
                  <Input
                    v-model="query"
                    size="small"
                    placeholder="Search versions"
                    aria-label="Search versions"
                    @keydown.stop
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <Select.Group label="Versions">
                  <Select.Option
                    v-for="entry in matches"
                    :key="entry.id"
                    :value="entry.id"
                  >
                    {{ entry.name }}
                    <span
                      v-if="servedIn(entry.id).length"
                      class="text-body-xs text-(--text-muted)"
                      >Live in {{ servedIn(entry.id).join(', ') }}</span
                    >
                    <template #tag>
                      <Tag
                        :label="entry.tag.label"
                        :severity="entry.tag.severity"
                        :icon="entry.tag.icon"
                        size="small"
                      />
                    </template>
                  </Select.Option>
                  <p
                    v-if="!matches.length"
                    class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                  >
                    No versions match "{{ query }}".
                  </p>
                </Select.Group>
                <template #footer>
                  <Select.Option
                    value="__create-version__"
                    class="w-full"
                  >
                    <span class="flex items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-plus-circle"
                        aria-hidden="true"
                      />
                      Add Version
                    </span>
                  </Select.Option>
                </template>
              </Select.Content>
            </Select>
          </div>
        </nav>
      </div>

      <div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
        <div class="grid h-full min-h-0">
          <Resizable
            orientation="horizontal"
            aria-label="Version workspace"
          >
            <Resizable.Pane aria-label="Version settings">
              <main class="flex min-h-0 min-w-0 flex-1 flex-col">
                <PageTabs v-model="activeTab">
                  <Tabs.Item
                    v-for="tab in tabs"
                    :key="tab.value"
                    :value="tab.value"
                    :label="tab.label"
                  />
                  <template #actions>
                    <Tag
                      label="Draft"
                      severity="warning"
                      icon="pi pi-file-edit"
                      size="medium"
                    />
                    <DropdownMenu
                      placement="bottom-end"
                      @select="openHistory"
                    >
                      <DropdownMenu.Trigger>
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="transparent"
                          size="small"
                          aria-label="Version actions"
                        />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Group>
                        <DropdownMenu.Option
                          value="edit"
                          label="Edit version info"
                        >
                          <template #left>
                            <i
                              class="pi pi-pencil"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Option>
                        <DropdownMenu.Option
                          value="history"
                          :label="
                            historyCollapsed ? 'Show version history' : 'Hide version history'
                          "
                        >
                          <template #left>
                            <i
                              class="pi pi-history"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Option>
                      </DropdownMenu.Group>
                    </DropdownMenu>
                  </template>
                </PageTabs>

                <section
                  class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
                >
                  <ScrollArea
                    aria-label="Version settings"
                    fade
                  >
                    <div class="flex min-h-full flex-col">
                      <fieldset class="contents">
                        <legend class="sr-only">web-app ADA8FMMR</legend>
                        <form
                          class="flex min-h-full flex-col"
                          aria-label="Main settings"
                          novalidate
                          @submit.prevent
                        >
                          <div
                            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
                          >
                            <PageHeader
                              title="Settings"
                              description="Core configuration for this resource."
                              size="small"
                            />

                            <fieldset
                              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
                            >
                              <legend class="sr-only">Main settings</legend>

                              <SettingsSection
                                title="General"
                                hint="How this resource is identified across the console, and whether it is serving traffic."
                                anchor="general"
                              >
                                <Card :padded="false">
                                  <template #content>
                                    <Item.List>
                                      <SettingRow
                                        title="Name"
                                        description="A unique and descriptive name to identify the resource."
                                      >
                                        <Input
                                          v-model="settings.name"
                                          size="large"
                                          class="w-full"
                                          aria-label="Name"
                                        />
                                      </SettingRow>
                                      <SettingRow
                                        title="Active"
                                        description="When disabled, the resource stops serving traffic."
                                        kind="compact"
                                      >
                                        <Switch
                                          v-model="settings.active"
                                          aria-label="Active"
                                        />
                                      </SettingRow>
                                    </Item.List>
                                  </template>
                                </Card>
                              </SettingsSection>

                              <SettingsSection
                                title="Modules"
                                hint="The capabilities this resource runs with, each of which can be toggled here."
                                anchor="modules"
                              >
                                <Card :padded="false">
                                  <template #content>
                                    <Item.List>
                                      <SettingRow
                                        v-for="mod in defaultModules"
                                        :key="mod.key"
                                        :title="mod.title"
                                        :description="mod.description"
                                        kind="compact"
                                      >
                                        <Switch
                                          v-model="settings.modules[mod.key]"
                                          :aria-label="mod.title"
                                        />
                                      </SettingRow>
                                    </Item.List>
                                  </template>
                                </Card>
                              </SettingsSection>

                              <SettingsSection
                                title="Subscription modules"
                                hint="Paid add-ons that are activated with sales, not from this page."
                                anchor="subscription-modules"
                              >
                                <Card :padded="false">
                                  <template #content>
                                    <Item.List>
                                      <SettingRow
                                        title="WebSocket Proxy"
                                        kind="compact"
                                      >
                                        <template #description>
                                          Enhance real-time data exchange between your resource and
                                          backend services using the WebSocket protocol.
                                          <a
                                            href="https://example.com/contact-sales"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                                          >
                                            Contact sales
                                            <i
                                              class="pi pi-external-link shrink-0 text-body-sm leading-none"
                                              aria-hidden="true"
                                            />
                                          </a>
                                        </template>
                                        <Tooltip text="Contact sales to activate this module.">
                                          <Switch
                                            v-model="settings.modules.web_socket_proxy"
                                            disabled
                                            aria-label="WebSocket Proxy"
                                          />
                                        </Tooltip>
                                      </SettingRow>
                                    </Item.List>
                                  </template>
                                </Card>
                              </SettingsSection>
                            </fieldset>
                          </div>
                        </form>
                      </fieldset>
                    </div>
                  </ScrollArea>
                </section>

                <Transition
                  appear
                  enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
                  enter-from-class="translate-y-2 opacity-0"
                >
                  <footer
                    class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                    data-testid="version-detail-bar"
                  >
                    <div
                      class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <span
                        class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                        aria-hidden="true"
                      >
                        <i class="pi pi-file-edit text-body-sm text-(--text-default)" />
                      </span>
                      <div
                        class="flex min-w-0 flex-1 flex-col"
                        role="status"
                      >
                        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <span class="truncate text-body-sm text-(--text-default)">Draft</span>
                          <span class="hidden shrink-0 sm:inline-flex">
                            <Tag
                              label="Editable"
                              severity="info"
                              size="small"
                            />
                          </span>
                        </div>
                        <p
                          class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                          title="This version is open for editing. Deploy it when ready."
                        >
                          This version is open for editing. Deploy it when ready.
                        </p>
                      </div>

                      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                        <SplitButton
                          :label="saveOptions.find((option) => option.value === saveAction).label"
                          :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
                          kind="primary"
                          size="medium"
                          :model="saveOptions"
                          @item-click="(event, item) => (saveAction = item.value)"
                        />
                      </div>
                    </div>
                  </footer>
                </Transition>
              </main>
            </Resizable.Pane>
            <Resizable.Handle
              v-if="!historyCollapsed"
              aria-label="Resize the version history"
            />
            <Resizable.Pane
              v-model:basis="historyBasis"
              v-model:collapsed="historyCollapsed"
              collapsible
              :min="280"
              :max="560"
              aria-label="Version history"
            >
              <aside
                :inert="historyCollapsed"
                aria-labelledby="version-history-title"
                class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
                data-testid="version-detail-history"
                @keydown.esc="historyCollapsed = true"
              >
                <header
                  class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
                >
                  <h2
                    id="version-history-title"
                    class="truncate text-label-lg text-(--text-default)"
                  >
                    Version history
                  </h2>
                  <IconButton
                    icon="pi pi-times"
                    kind="transparent"
                    size="small"
                    aria-label="Close version history"
                    @click="historyCollapsed = true"
                  />
                </header>
                <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
                  <ol class="flex flex-col">
                    <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
                      <span
                        class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                        aria-hidden="true"
                      />
                      <span
                        class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
                        aria-hidden="true"
                      >
                        <i class="pi pi-file-edit text-body-xs" />
                      </span>
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <span class="truncate text-label-md text-(--text-default)">
                            {{ version.name }}
                          </span>
                          <span class="flex shrink-0">
                            <Tag
                              :label="version.tag.label"
                              :severity="version.tag.severity"
                              size="small"
                            />
                          </span>
                          <span
                            v-if="!editing"
                            class="ms-auto shrink-0"
                          >
                            <IconButton
                              icon="pi pi-pencil"
                              kind="transparent"
                              size="small"
                              aria-label="Edit version info"
                              @click="
                                () => {
                                  draftText = description
                                  editing = true
                                }
                              "
                            />
                          </span>
                        </div>
                        <p class="text-label-sm text-(--text-muted)">Current version</p>

                        <div
                          v-if="editing"
                          class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
                        >
                          <Field>
                            <Field.Label>Description</Field.Label>
                            <Textarea
                              v-model="draftText"
                              placeholder="What changed in this version?"
                            />
                            <Field.Description
                              >Shows in the version list and on the deployment.</Field.Description
                            >
                          </Field>
                          <div class="flex justify-end gap-(--spacing-xs)">
                            <Button
                              label="Cancel"
                              kind="outlined"
                              size="small"
                              @click="editing = false"
                            />
                            <Button
                              label="Save"
                              kind="primary"
                              size="small"
                              @click="
                                () => {
                                  description = draftText.trim()
                                  editing = false
                                }
                              "
                            />
                          </div>
                        </div>
                        <template v-else>
                          <p
                            :data-empty="!description || null"
                            class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
                          >
                            {{ description || 'No description' }}
                          </p>
                          <span
                            class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                          >
                            <span class="flex shrink-0">
                              <Avatar
                                :alt="version.author"
                                :label="version.author"
                                size="small"
                                kind="square"
                              />
                            </span>
                            <span class="truncate"
                              >{{ version.author }} · {{ version.createdAgo }}</span
                            >
                          </span>
                        </template>
                      </div>
                    </li>

                    <li class="relative flex flex-col pb-(--spacing-lg)">
                      <span
                        class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                        aria-hidden="true"
                      />
                      <p class="flex gap-(--spacing-sm)">
                        <span
                          class="relative flex size-7 shrink-0 items-center justify-center"
                          aria-hidden="true"
                        >
                          <span
                            class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                          />
                        </span>
                        <span class="pt-1 text-body-sm text-(--text-muted)">
                          No changes yet. Each change you save shows up here.
                        </span>
                      </p>
                    </li>

                    <li
                      v-for="(entry, index) in earlier.slice(0, shown)"
                      :key="entry.id"
                      class="relative flex pb-(--spacing-lg) last:pb-0"
                    >
                      <span
                        v-if="index < earlier.slice(0, shown).length - 1"
                        class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                      >
                        <span
                          class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                          aria-hidden="true"
                        >
                          <i class="pi pi-code text-body-xs" />
                        </span>
                        <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <span
                              class="truncate text-label-md text-(--text-default) group-hover:underline"
                            >
                              {{ entry.name }}
                            </span>
                            <span class="flex shrink-0">
                              <Tag
                                :label="entry.tag.label"
                                :severity="entry.tag.severity"
                                size="small"
                              />
                            </span>
                          </span>
                          <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                            {{ entry.comment }}
                          </span>
                          <span
                            class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                          >
                            <span class="flex shrink-0">
                              <Avatar
                                :alt="entry.author"
                                :label="entry.author"
                                size="small"
                                kind="square"
                              />
                            </span>
                            <span class="truncate"
                              >{{ entry.author }} · {{ entry.createdAgo }}</span
                            >
                          </span>
                        </span>
                      </button>
                    </li>
                  </ol>

                  <div
                    v-if="earlier.length > shown"
                    class="pt-(--spacing-sm)"
                  >
                    <Button
                      label="Show older"
                      kind="transparent"
                      size="small"
                      @click="shown += 5"
                    />
                  </div>
                </div>
              </aside>
            </Resizable.Pane>
          </Resizable>
        </div>
      </div>
    </div>

    <Drawer
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent aria-label="Navigation">
          <Sidebar aria-label="Main navigation">
            <template #header>
              <div class="-m-(--spacing-md) flex flex-col">
                <div
                  class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
                >
                  <a
                    href="/home"
                    aria-label="Azion home"
                    class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                  >
                    <Brand
                      kind="default"
                      size="small"
                    />
                  </a>
                </div>
              </div>
            </template>

            <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
              <Menu
                :groups="navGroups"
                :active-id="activeId"
                role="presentation"
                @navigate="onMobileNavigate"
              >
                <Menu.Back />
              </Menu>
            </div>

            <template #footer>
              <div class="flex items-center gap-(--spacing-xs)">
                <Avatar
                  label="alex@example.com"
                  size="small"
                  kind="square"
                />
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                  >alex</span
                >
                <DropdownMenu placement="top-end">
                  <DropdownMenu.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <DropdownMenu.Option
                      value="settings"
                      label="Account settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="personal-tokens"
                      label="Personal tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="home"
                      label="Home page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)"
                    >
                      <Button
                        label="Upgrade to Pro"
                        kind="secondary"
                        size="medium"
                        class="w-full"
                      />
                      <div class="flex justify-center px-(--spacing-xs)">
                        <StatusIndicator
                          severity="success"
                          label="All systems normal"
                        />
                      </div>
                    </div>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
