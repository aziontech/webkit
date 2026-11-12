<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Menu from '@aziontech/webkit/menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', href: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', href: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          href: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', href: '/resources' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', href: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', href: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', href: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', href: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', href: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', href: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', href: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', href: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          href: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', href: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', href: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', href: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  href: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  href: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  href: '/metrics',
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
                  href: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  href: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  href: '/metrics',
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
                  href: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  href: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', href: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', href: '/catalog' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', href: '/account' },
                {
                  id: 'settings-build-deployment',
                  label: 'Build and deployment',
                  href: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  href: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', href: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', href: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', href: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', href: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', href: '/account/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', href: '/account/billing' },
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

  const breadcrumb = [
    { label: 'Resources', href: '/resources' },
    { label: 'storefront', href: '/resources/storefront' },
    { label: 'Rules Engine' }
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
    event.preventDefault()
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

  const origins = ref([
    { value: 'origin-api', label: 'api-backend' },
    { value: 'origin-static', label: 'static-assets' }
  ])
  const originLabel = (value) => origins.value.find((origin) => origin.value === value)?.label ?? ''

  const rules = ref([{ id: 'rule-1', name: 'route-api', originId: 'origin-api' }])

  const parentOpen = ref(false)
  const form = reactive({ name: '', originId: '' })
  const errors = reactive({ name: '', originId: '' })
  const submitting = ref(false)

  const CREATE_ORIGIN = '__create-origin__'
  const originSelectOpen = ref(false)

  const childOpen = ref(false)
  const childForm = reactive({ name: '', address: '' })
  const childErrors = reactive({ name: '', address: '' })
  const childSubmitting = ref(false)

  const onOriginModel = (value) => {
    if (value === CREATE_ORIGIN) {
      originSelectOpen.value = false
      childOpen.value = true
      return
    }
    form.originId = value
    errors.originId = ''
  }

  const openParent = () => {
    parentOpen.value = true
  }

  watch(parentOpen, (open) => {
    if (!open) return
    form.name = ''
    form.originId = ''
    errors.name = ''
    errors.originId = ''
  })

  const submitParent = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.originId = form.originId ? '' : 'Select an origin.'
    if (errors.name || errors.originId) return
    rules.value = [
      ...rules.value,
      { id: `rule-${uid()}`, name: form.name.trim(), originId: form.originId }
    ]
    parentOpen.value = false
  }

  watch(childOpen, (open) => {
    if (!open) return
    childForm.name = ''
    childForm.address = ''
    childErrors.name = ''
    childErrors.address = ''
  })

  const submitChild = () => {
    childErrors.name = childForm.name.trim() ? '' : 'This field is required.'
    childErrors.address = childForm.address.trim() ? '' : 'This field is required.'
    if (childErrors.name || childErrors.address) return
    const value = `origin-${uid()}`
    origins.value = [{ value, label: childForm.name.trim() }, ...origins.value]
    form.originId = value
    errors.originId = ''
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
                  :items="breadcrumb"
                  class="w-full"
                />
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
      </div>

      <div
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto layout-boundary"
      >
        <main class="flex h-full flex-col">
          <PageHeader
            title="Rules Engine"
            description="The rules of the storefront resource, run in order on every request they match. A rule that sends requests to an origin the resource does not have yet creates it in a second drawer."
            size="small"
          >
            <template #actions>
              <Button
                label="Add Rule"
                icon="pi pi-plus"
                kind="outlined"
                size="medium"
                @click="openParent"
              />
            </template>
          </PageHeader>

          <ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
            <li
              v-for="rule in rules"
              :key="rule.id"
              class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
            >
              <span class="text-label-code-sm text-(--text-default)">{{ rule.name }}</span>
              <span class="text-body-xs text-(--text-muted)">{{ originLabel(rule.originId) }}</span>
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
                aria-label="Add Rule"
                novalidate
                @submit.prevent="submitParent"
              >
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <DrawerTitle>Add Rule</DrawerTitle>
                    <p class="text-body-sm text-(--text-muted)">
                      A rule sends the requests it matches to one origin of this resource. Select
                      the origin, or create it here.
                    </p>
                  </div>
                  <DrawerClose />
                </PanelHeader>

                <PanelContent>
                  <fieldset
                    class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                    :disabled="submitting"
                  >
                    <legend class="sr-only">Add Rule</legend>

                    <section class="flex flex-col gap-(--layout-group-gap)">
                      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                        General
                      </p>
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <SettingRow
                              title="Name"
                              description="Give a unique and descriptive name to identify the rule."
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <div class="flex w-full flex-col gap-(--spacing-xs)">
                                  <Input
                                    v-model="form.name"
                                    size="large"
                                    :disabled="submitting"
                                    class="w-full"
                                    aria-label="Name"
                                    placeholder="my-rule"
                                    :required="!!errors.name && !form.name.trim()"
                                    :invalid="!!errors.name && !!form.name.trim()"
                                    :aria-describedby="errors.name ? 'rule-name-error' : undefined"
                                    @update:model-value="errors.name = ''"
                                  />
                                  <HelperText
                                    v-if="errors.name"
                                    id="rule-name-error"
                                    :kind="form.name.trim() ? 'invalid' : 'required'"
                                    :label="errors.name"
                                  />
                                </div>
                              </div>
                            </SettingRow>
                          </Item.List>
                        </template>
                      </Card>
                    </section>

                    <section class="flex flex-col gap-(--layout-group-gap)">
                      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                        Behavior
                      </p>
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <SettingRow
                              title="Origin"
                              description="Select the origin matching requests go to, or create one."
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <div class="flex w-full flex-col gap-(--spacing-xs)">
                                  <Select
                                    :model-value="form.originId"
                                    v-model:open="originSelectOpen"
                                    size="large"
                                    :disabled="submitting"
                                    class="w-full"
                                    placeholder="Select an origin"
                                    :required="!!errors.originId"
                                    :display-value="originLabel"
                                    @update:model-value="onOriginModel"
                                  >
                                    <Select.Trigger
                                      id="rule-origin"
                                      aria-label="Origin"
                                      :aria-describedby="
                                        errors.originId ? 'rule-origin-error' : undefined
                                      "
                                    />
                                    <Select.Content>
                                      <Select.Option
                                        v-for="origin in origins"
                                        :key="origin.value"
                                        :value="origin.value"
                                      >
                                        {{ origin.label }}
                                      </Select.Option>
                                      <template #footer>
                                        <Select.Option
                                          :value="CREATE_ORIGIN"
                                          icon="pi pi-plus-circle"
                                          class="w-full"
                                        >
                                          Create Origin
                                        </Select.Option>
                                      </template>
                                    </Select.Content>
                                  </Select>
                                  <HelperText
                                    v-if="errors.originId"
                                    id="rule-origin-error"
                                    kind="required"
                                    :label="errors.originId"
                                  />
                                </div>
                              </div>
                            </SettingRow>
                          </Item.List>
                        </template>
                      </Card>
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
                        label="Add Rule"
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
                aria-label="Create Origin"
                novalidate
                @submit.prevent="submitChild"
              >
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <DrawerTitle>Create Origin</DrawerTitle>
                    <p class="text-body-sm text-(--text-muted)">
                      An origin is a host this resource fetches content from. Once saved, the rule
                      sends its requests to it.
                    </p>
                  </div>
                  <DrawerClose />
                </PanelHeader>

                <PanelContent>
                  <fieldset
                    class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                    :disabled="childSubmitting"
                  >
                    <legend class="sr-only">Create Origin</legend>

                    <section class="flex flex-col gap-(--layout-group-gap)">
                      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                        General
                      </p>
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <SettingRow
                              title="Name"
                              description="A unique name for the origin."
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <div class="flex w-full flex-col gap-(--spacing-xs)">
                                  <Input
                                    v-model="childForm.name"
                                    size="large"
                                    :disabled="childSubmitting"
                                    class="w-full"
                                    aria-label="Name"
                                    placeholder="my-origin"
                                    :required="!!childErrors.name && !childForm.name.trim()"
                                    :invalid="!!childErrors.name && !!childForm.name.trim()"
                                    :aria-describedby="
                                      childErrors.name ? 'origin-name-error' : undefined
                                    "
                                    @update:model-value="childErrors.name = ''"
                                  />
                                  <HelperText
                                    v-if="childErrors.name"
                                    id="origin-name-error"
                                    :kind="childForm.name.trim() ? 'invalid' : 'required'"
                                    :label="childErrors.name"
                                  />
                                </div>
                              </div>
                            </SettingRow>
                            <SettingRow
                              title="Address"
                              description="The host this resource fetches content from."
                              stackable
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <div class="flex w-full flex-col gap-(--spacing-xs)">
                                  <Input
                                    v-model="childForm.address"
                                    size="large"
                                    :disabled="childSubmitting"
                                    class="w-full"
                                    aria-label="Address"
                                    placeholder="origin.example.com"
                                    :required="!!childErrors.address && !childForm.address.trim()"
                                    :invalid="!!childErrors.address && !!childForm.address.trim()"
                                    :aria-describedby="
                                      childErrors.address ? 'origin-address-error' : undefined
                                    "
                                    @update:model-value="childErrors.address = ''"
                                  />
                                  <HelperText
                                    v-if="childErrors.address"
                                    id="origin-address-error"
                                    :kind="childForm.address.trim() ? 'invalid' : 'required'"
                                    :label="childErrors.address"
                                  />
                                </div>
                              </div>
                            </SettingRow>
                          </Item.List>
                        </template>
                      </Card>
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
                        label="Create Origin"
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
