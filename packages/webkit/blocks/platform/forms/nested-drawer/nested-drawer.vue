<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import CardBox from '@aziontech/webkit/card-box'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Dropdown from '@aziontech/webkit/dropdown'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
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
                  label: 'Build & Deployment',
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
    { id: 'settings', label: 'Account Settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal Tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const breadcrumb = [{ label: 'Forms', href: '/forms' }, { label: 'Nested drawer' }]

  const activeId = ref('forms')
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
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }

  let nextId = 0
  const uid = () => (nextId += 1)

  const services = ref([
    { value: 'svc-auth', label: 'auth-handler' },
    { value: 'svc-img', label: 'image-optimizer' }
  ])
  const serviceLabel = (value) =>
    services.value.find((service) => service.value === value)?.label ?? ''

  const runtimes = [
    { value: 'node20', label: 'Node.js 20' },
    { value: 'python312', label: 'Python 3.12' }
  ]
  const runtimeLabel = (value) => runtimes.find((r) => r.value === value)?.label ?? ''

  const instances = ref([{ id: 'inst-1', name: 'auth-guard', serviceId: 'svc-auth' }])

  const parentOpen = ref(false)
  const form = reactive({ name: '', serviceId: '' })
  const errors = reactive({ name: '', serviceId: '' })
  const submitting = ref(false)

  const CREATE_SERVICE = '__create-service__'
  const serviceSelectOpen = ref(false)

  const childOpen = ref(false)
  const childForm = reactive({ name: '', runtime: '' })
  const childErrors = reactive({ name: '', runtime: '' })
  const childSubmitting = ref(false)

  const onServiceModel = (value) => {
    if (value === CREATE_SERVICE) {
      serviceSelectOpen.value = false
      childOpen.value = true
      return
    }
    form.serviceId = value
    errors.serviceId = ''
  }

  const openParent = () => {
    parentOpen.value = true
  }
  const cancelParent = () => {
    parentOpen.value = false
  }

  watch(parentOpen, (open) => {
    if (!open) return
    form.name = ''
    form.serviceId = ''
    errors.name = ''
    errors.serviceId = ''
  })

  const submitParent = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.serviceId = form.serviceId ? '' : 'Select a service.'
    if (errors.name || errors.serviceId) return
    instances.value = [
      { id: `inst-${uid()}`, name: form.name.trim(), serviceId: form.serviceId },
      ...instances.value
    ]
    parentOpen.value = false
  }

  const cancelChild = () => {
    childOpen.value = false
  }

  watch(childOpen, (open) => {
    if (!open) return
    childForm.name = ''
    childForm.runtime = ''
    childErrors.name = ''
    childErrors.runtime = ''
  })

  const submitChild = () => {
    childErrors.name = childForm.name.trim() ? '' : 'Name is required.'
    childErrors.runtime = childForm.runtime ? '' : 'Runtime is required.'
    if (childErrors.name || childErrors.runtime) return
    const value = `svc-${uid()}`
    services.value = [{ value, label: childForm.name.trim() }, ...services.value]
    form.serviceId = value
    errors.serviceId = ''
    childOpen.value = false
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

            <CommandMenu
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <CommandMenu.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <CommandMenu.List>
                <CommandMenu.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <CommandMenu.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Separator key="commands-rule" />

                <CommandMenu.Group heading="Actions">
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Group heading="Account">
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Empty
                  >No resource, page or command matches your search.</CommandMenu.Empty
                >
              </CommandMenu.List>
            </CommandMenu>
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
            <Dropdown placement="top-end">
              <Dropdown.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <Dropdown.Option
                  value="settings"
                  label="Account Settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="personal-tokens"
                  label="Personal Tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model:value="theme"
                    aria-label="Theme"
                  />
                </div>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="home"
                  label="Home Page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
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
              </Dropdown.Group>
            </Dropdown>
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

              <div class="-ml-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb
                  :items="breadcrumb"
                  class="w-full"
                />
              </div>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <span class="contents @min-[47rem]:hidden">
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
              class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
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
      </div>

      <div
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto layout-boundary"
      >
        <main class="flex h-full flex-col">
          <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
            <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <h1 class="text-balance text-heading-xs text-(--text-default)">Instances</h1>
              </div>
              <p class="text-pretty text-body-sm text-(--text-muted)">
                Create a resource whose Select needs a related resource that may not exist yet — the
                quick-add opens a second drawer, then selects the new resource back into the parent.
                Each drawer is its own scoped save.
              </p>
            </div>
            <div
              class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full"
            >
              <div class="w-full md:w-fit">
                <Button
                  label="Add Instance"
                  icon="pi pi-plus"
                  kind="outlined"
                  size="medium"
                  class="w-full"
                  @click="openParent"
                />
              </div>
            </div>
          </header>

          <ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
            <li
              v-for="instance in instances"
              :key="instance.id"
              class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
            >
              <span class="text-label-code-sm text-(--text-default)">{{ instance.name }}</span>
              <span class="text-body-xs text-(--text-muted)">{{
                serviceLabel(instance.serviceId)
              }}</span>
            </li>
          </ul>
        </main>

        <Drawer
          v-model:open="parentOpen"
          size="large"
          side="right"
        >
          <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
              <form
                class="flex min-h-0 flex-1 flex-col"
                aria-label="Add Instance"
                novalidate
                @submit.prevent="submitParent"
              >
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <DrawerTitle>Add Instance</DrawerTitle>
                    <p class="text-body-sm text-(--text-muted)">
                      Instantiate a service in this project — pick an existing service or create a
                      new one inline.
                    </p>
                  </div>
                  <DrawerClose />
                </PanelHeader>

                <PanelContent>
                  <fieldset
                    class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                    :disabled="submitting"
                  >
                    <legend class="sr-only">Create instance</legend>

                    <section class="flex flex-col gap-(--layout-group-gap)">
                      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                        General
                      </p>
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Name</Item.Title>
                                <Item.Description
                                  >Give a unique and descriptive name to identify the
                                  instance.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div
                                    class="flex w-full items-center justify-end gap-(--spacing-xs)"
                                  >
                                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                                      <InputText
                                        v-model="form.name"
                                        size="large"
                                        :disabled="submitting"
                                        class="w-full"
                                        aria-label="Name"
                                        placeholder="my-instance"
                                        :required="!!errors.name && !form.name.trim()"
                                        :invalid="!!errors.name && !!form.name.trim()"
                                        :aria-describedby="
                                          errors.name ? 'instance-name-error' : undefined
                                        "
                                        @update:model-value="errors.name = ''"
                                      />
                                      <HelperText
                                        v-if="errors.name"
                                        id="instance-name-error"
                                        :kind="form.name.trim() ? 'invalid' : 'required'"
                                        :label="errors.name"
                                      />
                                    </div>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </CardBox>
                    </section>

                    <section class="flex flex-col gap-(--layout-group-gap)">
                      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                        Service
                      </p>
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Service</Item.Title>
                                <Item.Description
                                  >Pick the service to instantiate, or create a new
                                  one.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div
                                    class="flex w-full items-center justify-end gap-(--spacing-xs)"
                                  >
                                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                                      <Select
                                        :model-value="form.serviceId"
                                        v-model:open="serviceSelectOpen"
                                        size="large"
                                        :disabled="submitting"
                                        class="w-full"
                                        placeholder="Select a service"
                                        :required="!!errors.serviceId"
                                        :display-value="serviceLabel"
                                        @update:model-value="onServiceModel"
                                      >
                                        <Select.Trigger
                                          id="instance-service"
                                          aria-label="Service"
                                          :aria-describedby="
                                            errors.serviceId ? 'instance-service-error' : undefined
                                          "
                                        />
                                        <Select.Content>
                                          <Select.Option
                                            v-for="service in services"
                                            :key="service.value"
                                            :value="service.value"
                                          >
                                            {{ service.label }}
                                          </Select.Option>
                                          <template #footer>
                                            <Select.Option
                                              :value="CREATE_SERVICE"
                                              icon="pi pi-plus-circle"
                                              class="w-full"
                                            >
                                              Create Service
                                            </Select.Option>
                                          </template>
                                        </Select.Content>
                                      </Select>
                                      <HelperText
                                        v-if="errors.serviceId"
                                        id="instance-service-error"
                                        kind="required"
                                        :label="errors.serviceId"
                                      />
                                    </div>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </CardBox>
                    </section>
                  </fieldset>
                </PanelContent>

                <PanelFooter>
                  <div
                    class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
                  >
                    <div class="w-full md:w-fit">
                      <Button
                        class="w-full"
                        type="button"
                        label="Cancel"
                        kind="outlined"
                        size="medium"
                        :disabled="submitting"
                        @click="cancelParent"
                      />
                    </div>
                    <div class="w-full md:w-fit">
                      <Button
                        class="w-full"
                        label="Save"
                        kind="primary"
                        size="medium"
                        :loading="submitting"
                        type="submit"
                      />
                    </div>
                  </div>
                </PanelFooter>
              </form>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>

        <Drawer
          v-model:open="childOpen"
          size="medium"
          side="right"
        >
          <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
              <form
                class="flex min-h-0 flex-1 flex-col"
                aria-label="Create Service"
                novalidate
                @submit.prevent="submitChild"
              >
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <DrawerTitle>Create service</DrawerTitle>
                    <p class="text-body-sm text-(--text-muted)">
                      Create a service to instantiate — it becomes available in the selector when
                      saved.
                    </p>
                  </div>
                  <DrawerClose />
                </PanelHeader>

                <PanelContent>
                  <fieldset
                    class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                    :disabled="childSubmitting"
                  >
                    <legend class="sr-only">Create service</legend>

                    <section class="flex flex-col gap-(--layout-group-gap)">
                      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                        General
                      </p>
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Name</Item.Title>
                                <Item.Description>A unique name for the service.</Item.Description>
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div
                                    class="flex w-full items-center justify-end gap-(--spacing-xs)"
                                  >
                                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                                      <InputText
                                        v-model="childForm.name"
                                        size="large"
                                        :disabled="childSubmitting"
                                        class="w-full"
                                        aria-label="Name"
                                        placeholder="my-service"
                                        :required="!!childErrors.name && !childForm.name.trim()"
                                        :invalid="!!childErrors.name && !!childForm.name.trim()"
                                        :aria-describedby="
                                          childErrors.name ? 'svc-name-error' : undefined
                                        "
                                        @update:model-value="childErrors.name = ''"
                                      />
                                      <HelperText
                                        v-if="childErrors.name"
                                        id="svc-name-error"
                                        :kind="childForm.name.trim() ? 'invalid' : 'required'"
                                        :label="childErrors.name"
                                      />
                                    </div>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Runtime</Item.Title>
                                <Item.Description
                                  >The language the service runs on.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div
                                    class="flex w-full items-center justify-end gap-(--spacing-xs)"
                                  >
                                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                                      <Select
                                        v-model="childForm.runtime"
                                        size="large"
                                        :disabled="childSubmitting"
                                        class="w-full"
                                        placeholder="Select a runtime"
                                        :required="!!childErrors.runtime"
                                        :display-value="runtimeLabel"
                                        @update:model-value="childErrors.runtime = ''"
                                      >
                                        <Select.Trigger
                                          id="svc-runtime"
                                          aria-label="Runtime"
                                          :aria-describedby="
                                            childErrors.runtime ? 'svc-runtime-error' : undefined
                                          "
                                        />
                                        <Select.Content>
                                          <Select.Option
                                            v-for="option in runtimes"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Option>
                                        </Select.Content>
                                      </Select>
                                      <HelperText
                                        v-if="childErrors.runtime"
                                        id="svc-runtime-error"
                                        kind="required"
                                        :label="childErrors.runtime"
                                      />
                                    </div>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </CardBox>
                    </section>
                  </fieldset>
                </PanelContent>

                <PanelFooter>
                  <div
                    class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
                  >
                    <div class="w-full md:w-fit">
                      <Button
                        class="w-full"
                        type="button"
                        label="Cancel"
                        kind="outlined"
                        size="medium"
                        :disabled="childSubmitting"
                        @click="cancelChild"
                      />
                    </div>
                    <div class="w-full md:w-fit">
                      <Button
                        class="w-full"
                        label="Save"
                        kind="primary"
                        size="medium"
                        :loading="childSubmitting"
                        type="submit"
                      />
                    </div>
                  </div>
                </PanelFooter>
              </form>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
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
                <Dropdown placement="top-end">
                  <Dropdown.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>
                  <Dropdown.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <Dropdown.Option
                      value="settings"
                      label="Account Settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="personal-tokens"
                      label="Personal Tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model:value="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="home"
                      label="Home Page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
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
                  </Dropdown.Group>
                </Dropdown>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
