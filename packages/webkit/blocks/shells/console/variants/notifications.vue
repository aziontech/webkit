<script setup>
  import Alert from '@aziontech/webkit/alert'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Avatar from '@aziontech/webkit/avatar'
  import Badge from '@aziontech/webkit/badge'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'


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
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)
  const search = ref('')
  const crumbs = [{ label: 'Resources' }]

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

  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }
</script>

  const notifications = ref([
    {
      id: 'run-4182',
      kind: 'deploy-failed',
      title: 'web-app-prod failed to deploy',
      description: 'The build stopped at step 3 of 5: a module could not be resolved.',
      time: '2 min ago',
      read: false
    },
    {
      id: 'run-4181',
      kind: 'deploy-succeeded',
      title: 'payments-api is live',
      description: 'Deployed to production in 48 seconds.',
      time: '25 min ago',
      read: false
    },
    {
      id: 'invite-77',
      kind: 'info',
      title: 'Sam joined the team',
      description: 'Sam accepted your invitation and can now edit resources.',
      time: 'Yesterday',
      read: true
    }
  ])
  const notificationsOpen = ref(true)
  const flashOpen = ref(true)

  const unread = computed(() => notifications.value.filter((item) => !item.read).length)
  const bellLabel = computed(() =>
    unread.value ? `Notifications, ${unread.value} unread` : 'Notifications'
  )

  const markAllRead = () => {
    notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
  }
  const clearAll = () => {
    notifications.value = []
  }
  const markRead = (id) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
  }

  const icons = {
    'deploy-failed': { icon: 'pi pi-times-circle', tone: 'text-(--danger)' },
    'deploy-succeeded': { icon: 'pi pi-check-circle', tone: 'text-(--success)' },
    info: { icon: 'pi pi-info-circle', tone: 'text-(--text-muted)' }
  }
</script>

<template>
  <AppLayout
    v-model:tools-open="notificationsOpen"
    tools-label="Notifications"
    class="h-dvh [--sidebar-width:var(--container-2xs)]"
  >
    <template #navigation="{ drawer }">
      <Sidebar
        v-model:width="railWidth"
        v-model:collapsed="railCollapsed"
        :resizable="!drawer"
        :collapsible="!drawer"
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
    </template>

    <template #header="{ compact, openNavigation, toggleTools }">
      <GlobalHeader
        aria-label="Console"
        class="@container"
      >
        <GlobalHeader.Left>
          <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
            <span
              v-if="compact"
              class="contents"
            >
              <Tooltip
                text="Open navigation"
                placement="bottom"
              >
                <IconButton
                  icon="pi pi-bars"
                  aria-label="Open navigation"
                  kind="outlined"
                  size="medium"
                  @click="openNavigation"
                />
              </Tooltip>
            </span>

            <a
              v-if="compact"
              href="/home"
              aria-label="Azion home"
              class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            >
              <Brand
                kind="default"
                size="small"
              />
            </a>

            <div
              v-else
              class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
            >
              <Breadcrumb
                :items="crumbs"
                class="w-full"
              />
            </div>
          </div>
        </GlobalHeader.Left>
        <GlobalHeader.Middle />
        <GlobalHeader.Right>
          <span class="contents @2xl:hidden">
            <IconButton
              icon="pi pi-search"
              kind="outlined"
              size="medium"
              aria-label="Search"
              aria-keyshortcuts="Meta+K"
              @click="paletteOpen = true"
            />
          </span>
          <button
            type="button"
            aria-label="Search"
            aria-keyshortcuts="Meta+K"
            class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @2xl:flex"
            @click="paletteOpen = true"
          >
            <span
              class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
              aria-hidden="true"
            >
              <i class="pi pi-search" />
            </span>
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">Search</span>
            <Kbd
              meta
              size="small"
              class="shrink-0"
              >K</Kbd
            >
          </button>

          <span
            v-if="compact"
            class="contents"
          >
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
          <span
            v-else
            class="contents"
          >
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

          <span class="relative inline-flex">
            <Tooltip
              text="Notifications"
              placement="bottom"
            >
              <IconButton
                icon="pi pi-bell"
                kind="outlined"
                size="medium"
                :aria-label="bellLabel"
                :aria-pressed="notificationsOpen"
                @click="toggleTools"
              />
            </Tooltip>
            <Badge
              v-if="unread"
              :label="String(unread)"
              severity="danger"
              size="small"
              aria-hidden="true"
              class="pointer-events-none absolute -end-(--spacing-xxs) -top-(--spacing-xxs)"
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
    </template>

    <template #notifications>
      <Alert
        v-if="flashOpen"
        severity="danger"
        closable
        @close="flashOpen = false"
      >
        web-app-prod failed to deploy. The version that was live keeps serving traffic.
        <template #action>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Button
              label="Edit"
              kind="outlined"
              size="small"
            />
            <Button
              label="Redeploy"
              kind="primary"
              size="small"
              icon="pi pi-refresh"
            />
          </div>
        </template>
      </Alert>
    </template>

    <div class="layout-boundary animate-page-enter motion-reduce:animate-none">
      <main class="layout-column flex min-h-full flex-col">
        <section class="flex min-w-0 flex-col gap-(--layout-section-gap)">
          <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <header class="flex items-center gap-(--layout-group-gap)">
              <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
                <Button
                  label="Filter"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-filter"
                />
                <div class="flex min-w-36 grow basis-(--container-2xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search resources"
                    aria-label="Search resources"
                    class="w-full"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                <Tooltip
                  text="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-refresh"
                    kind="outlined"
                    size="medium"
                    aria-label="Refresh"
                  />
                </Tooltip>
                <Tooltip
                  text="Download CSV"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-download"
                    kind="outlined"
                    size="medium"
                    aria-label="Download CSV"
                  />
                </Tooltip>
                <Tooltip text="Columns">
                  <IconButton
                    icon="ai ai-column"
                    kind="outlined"
                    size="medium"
                    aria-label="Columns"
                  />
                </Tooltip>
                <Button
                  label="Documentation"
                  icon="pi pi-book"
                  kind="outlined"
                  size="medium"
                  href="https://example.com/docs/resources"
                  target="_blank"
                />
                <Button
                  label="Create Resource"
                  icon="pi pi-plus"
                  kind="primary"
                  size="large"
                />
              </div>
            </header>

            <section class="flex min-h-0 flex-col">
              <Card :padded="false">
                <template #content>
                  <div
                    class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
                  >
                    Table
                  </div>
                </template>
              </Card>
            </section>
          </section>
        </section>
      </main>
    </div>

    <template #tools>
      <section
        aria-label="Notification list"
        class="flex min-h-full flex-col"
      >
        <div
          v-if="notifications.length"
          class="flex shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)"
        >
          <span class="text-label-sm text-(--text-muted)">{{ unread }} unread</span>
          <div class="flex items-center gap-(--spacing-xxs)">
            <Button
              label="Mark all as read"
              kind="transparent"
              size="small"
              :disabled="!unread"
              @click="markAllRead"
            />
            <Button
              label="Clear all"
              kind="transparent"
              size="small"
              @click="clearAll"
            />
          </div>
        </div>

        <ul
          v-if="notifications.length"
          class="m-0 flex list-none flex-col p-0"
        >
          <li
            v-for="item in notifications"
            :key="item.id"
            :data-unread="!item.read || null"
            class="flex gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm) data-[unread]:bg-(--bg-surface-raised)"
          >
            <i
              :class="[icons[item.kind].icon, icons[item.kind].tone]"
              class="mt-(--spacing-xxs) shrink-0"
              aria-hidden="true"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <p class="m-0 text-label-md text-(--text-default)">
                <span
                  v-if="!item.read"
                  class="sr-only"
                  >Unread:
                </span>
                {{ item.title }}
              </p>
              <p class="m-0 text-body-sm text-(--text-muted)">{{ item.description }}</p>
              <span class="text-label-sm text-(--text-muted)">{{ item.time }}</span>
              <div
                v-if="item.kind !== 'info'"
                class="flex flex-wrap items-center gap-(--spacing-xs) pt-(--spacing-xxs)"
              >
                <Button
                  label="Edit"
                  kind="outlined"
                  size="small"
                  @click="markRead(item.id)"
                />
                <Button
                  label="Redeploy"
                  kind="outlined"
                  size="small"
                  icon="pi pi-refresh"
                  @click="markRead(item.id)"
                />
              </div>
            </div>
          </li>
        </ul>

        <div
          v-else
          class="flex flex-1 items-center justify-center p-(--spacing-md)"
        >
          <EmptyState
            title="You are all caught up"
            description="Deploys, invitations and alerts for this account show up here."
            icon="pi pi-bell"
            size="small"
          />
        </div>
      </section>
    </template>
  </AppLayout>
</template>
