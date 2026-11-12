<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Menu from '@aziontech/webkit/menu'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Switch from '@aziontech/webkit/switch'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'

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
        { id: 'applications', label: 'Applications', icon: 'pi pi-box', href: '/applications' },
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
      key: 'applications/storefront-app',
      name: 'storefront-app',
      icon: 'pi pi-box',
      typeLabel: 'Application',
      navId: 'applications'
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

  const activeId = ref('applications')
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
    { id: 'create', label: 'Create Application', icon: 'pi pi-plus-circle' },
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

  const onNavigate = (event, node, closeNavigation) => {
    event.preventDefault()
    activeId.value = node.id
    closeNavigation()
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
  const crumbs = [
    { label: 'Applications', href: '/applications' },
    { label: 'storefront-app', href: '/applications/storefront-app' },
    { label: 'static-assets' }
  ]

  const browserBehaviors = [
    { value: 'honor', label: 'Honor origin cache headers' },
    { value: 'override', label: 'Override cache settings' },
    { value: 'no-cache', label: 'No cache' }
  ]
  const edgeBehaviors = [
    { value: 'honor', label: 'Honor origin cache headers' },
    { value: 'override', label: 'Override cache settings' }
  ]
  const topologies = [
    { value: 'nearest-region', label: 'Nearest region' },
    { value: 'south-america', label: 'South America' },
    { value: 'north-america', label: 'North America' }
  ]
  const varyBehaviors = [
    { value: 'ignore', label: 'Ignore all, best cache rate' },
    { value: 'all', label: 'Vary by all' },
    { value: 'allowlist', label: 'Vary by some (allowlist)' },
    { value: 'denylist', label: 'Vary by all except some (denylist)' }
  ]
  const methods = [
    { value: 'POST', label: 'POST' },
    { value: 'OPTIONS', label: 'OPTIONS' }
  ]

  const labelOf = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? String(value ?? '')
  const methodsLabel = (values) => (values?.length ? values.join(', ') : '')

  const form = reactive({
    name: 'static-assets',
    browserBehavior: 'override',
    browserMaxAge: 604800,
    edgeBehavior: 'override',
    edgeMaxAge: 2592000,
    staleCache: true,
    largeFileCache: false,
    largeFileOffset: 1024,
    tieredCache: true,
    tieredTopology: 'nearest-region',
    varyByMethod: [],
    queryStringBehavior: 'allowlist',
    queryStringFields: 'v, lang',
    cookieBehavior: 'ignore',
    cookieNames: ''
  })
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const saving = ref(false)
  const errors = reactive({})

  const clear = (key) => {
    delete errors[key]
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.name.trim()) {
      errors.name = { kind: 'required', message: 'Enter a name for this cache setting.' }
    } else if (!/^[a-z0-9-]+$/.test(form.name.trim())) {
      errors.name = {
        kind: 'invalid',
        message: 'Use lowercase letters, numbers and hyphens only.'
      }
    }
    if (form.edgeBehavior === 'override' && form.edgeMaxAge < 60) {
      errors.edgeMaxAge = {
        kind: 'invalid',
        message: 'The edge keeps an object for at least 60 seconds.'
      }
    }
    if (['allowlist', 'denylist'].includes(form.queryStringBehavior)) {
      if (!form.queryStringFields.trim()) {
        errors.queryStringFields = {
          kind: 'required',
          message: 'List at least one query string field.'
        }
      }
    }
    if (['allowlist', 'denylist'].includes(form.cookieBehavior) && !form.cookieNames.trim()) {
      errors.cookieNames = { kind: 'required', message: 'List at least one cookie name.' }
    }
    return Object.keys(errors).length === 0
  }

  const ERROR_ORDER = ['name', 'edgeMaxAge', 'queryStringFields', 'cookieNames']
  const focusFirstError = () =>
    nextTick(() => {
      const first = ERROR_ORDER.find((key) => errors[key])
      if (first) document.getElementById(`cache-${first}`)?.focus()
    })

  const RUN_TOAST = 'cache-settings-deploy'
  let timer

  const editAgain = () => {
    toast.dismiss(RUN_TOAST)
    nextTick(() => document.getElementById('cache-name')?.focus())
  }

  const deploy = () => {
    toast.loading(`Deploying ${form.name}…`, {
      id: RUN_TOAST,
      description: 'storefront-app keeps serving the current cache rules until it finishes.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      saving.value = false
      baseline.value = JSON.stringify(form)
      toast.success(`${form.name} is live.`, {
        id: RUN_TOAST,
        description: 'Production caches with the new rules from now on.',
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editAgain },
          { label: 'Redeploy', onClick: deploy }
        ]
      })
    }, 1200)
  }

  const save = () => {
    if (!validate()) {
      focusFirstError()
      return
    }
    saving.value = true
    deploy()
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value))
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="h-dvh [--sidebar-width:var(--container-2xs)]">
    <AppLayout>
      <template #navigation="{ drawer, closeNavigation }">
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
              @navigate="(event, node) => onNavigate(event, node, closeNavigation)"
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
      </template>

      <template #header="{ compact, openNavigation }">
        <div class="@container">
          <GlobalHeader aria-label="Console">
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
              <SearchTrigger
                collapsible
                @open="paletteOpen = true"
              />

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
      </template>

      <main class="flex min-h-full min-w-0 flex-col">
        <form
          class="flex min-h-full min-w-0 flex-col animate-page-enter motion-reduce:animate-none"
          aria-label="Cache settings"
          novalidate
          @submit.prevent="save"
        >
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
            <PageHeader
              title="Cache settings"
              description="How static-assets is cached at the edge and in browsers. Rules of storefront-app pick it with the Set cache policy behavior."
              size="small"
            />

            <fieldset
              class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">Cache settings</legend>

              <SettingsSection
                title="General"
                hint="Names the cache setting in the rules that reference it."
                anchor="general"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="name"
                          title="Name"
                          description="What the Set cache policy behavior of a rule picks from its list."
                        >
                          <Input
                            id="cache-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="static-assets"
                            autocomplete="off"
                            :required="errors.name?.kind === 'required'"
                            :invalid="errors.name?.kind === 'invalid'"
                            :aria-describedby="errors.name ? 'cache-name-message' : undefined"
                            :disabled="saving"
                            @update:model-value="clear('name')"
                          />
                          <HelperText
                            v-if="errors.name"
                            id="cache-name-message"
                            :kind="errors.name.kind"
                            :label="errors.name.message"
                          />
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Browser cache"
                hint="How long the visitor's browser may reuse a response before asking again."
                anchor="browser-cache"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="browserBehavior"
                          title="Behavior"
                          description="Honoring the origin passes its Cache-Control through. Overriding replaces it with the time set here."
                        >
                          <Select
                            v-model="form.browserBehavior"
                            size="large"
                            class="w-full"
                            :display-value="labelOf(browserBehaviors)"
                            :disabled="saving"
                          >
                            <Select.Trigger aria-label="Browser cache behavior" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in browserBehaviors"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          v-if="form.browserBehavior === 'override'"
                          key="browserMaxAge"
                          title="Maximum TTL in seconds"
                          description="Up to 31536000 seconds, one year."
                          :level="1"
                        >
                          <NumberInput
                            id="cache-browserMaxAge"
                            v-model="form.browserMaxAge"
                            size="large"
                            class="w-full"
                            :min="0"
                            :max="31536000"
                            aria-label="Browser maximum TTL in seconds"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Edge cache"
                hint="How long the edge may serve a stored response before it asks the origin again."
                anchor="edge-cache"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="edgeBehavior"
                          title="Behavior"
                          description="Overriding sets the time the edge keeps each object, from 60 seconds up."
                        >
                          <Select
                            v-model="form.edgeBehavior"
                            size="large"
                            class="w-full"
                            :display-value="labelOf(edgeBehaviors)"
                            :disabled="saving"
                          >
                            <Select.Trigger aria-label="Edge cache behavior" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in edgeBehaviors"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          v-if="form.edgeBehavior === 'override'"
                          key="edgeMaxAge"
                          title="Maximum TTL in seconds"
                          description="From 60 to 31536000 seconds."
                          :level="1"
                        >
                          <NumberInput
                            id="cache-edgeMaxAge"
                            v-model="form.edgeMaxAge"
                            size="large"
                            class="w-full"
                            :min="0"
                            :max="31536000"
                            aria-label="Edge maximum TTL in seconds"
                            :disabled="saving"
                            :invalid="Boolean(errors.edgeMaxAge)"
                            :aria-describedby="
                              errors.edgeMaxAge ? 'cache-edgeMaxAge-message' : undefined
                            "
                            @update:model-value="clear('edgeMaxAge')"
                          />
                          <HelperText
                            v-if="errors.edgeMaxAge"
                            id="cache-edgeMaxAge-message"
                            :kind="errors.edgeMaxAge.kind"
                            :label="errors.edgeMaxAge.message"
                          />
                        </SettingRow>
                        <SettingRow
                          key="staleCache"
                          title="Stale cache"
                          description="Keep serving the expired object while the origin is unreachable, instead of answering with an error."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.staleCache"
                            aria-label="Stale cache"
                            :disabled="saving"
                          />
                        </SettingRow>
                        <SettingRow
                          key="largeFileCache"
                          title="Large file optimization"
                          description="Fetch and cache large objects in fragments, so a partial request does not wait for the whole file."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.largeFileCache"
                            aria-label="Large file optimization"
                            :disabled="saving"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.largeFileCache"
                          key="largeFileOffset"
                          title="Fragment size in kB"
                          description="Each fragment requested from the origin. 1024 kB is the default."
                          :level="1"
                        >
                          <NumberInput
                            id="cache-largeFileOffset"
                            v-model="form.largeFileOffset"
                            size="large"
                            class="w-full"
                            :min="1"
                            aria-label="Fragment size in kilobytes"
                            :disabled="saving"
                          />
                        </SettingRow>
                        <SettingRow
                          key="tieredCache"
                          title="Tiered cache"
                          description="Add a second cache layer between the edge and your origin, so an edge miss can still be answered without reaching it."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.tieredCache"
                            aria-label="Tiered cache"
                            :disabled="saving"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.tieredCache"
                          key="tieredTopology"
                          title="Topology"
                          description="Where the second layer sits. Pin a region only when the origin is fixed to one."
                          :level="1"
                        >
                          <Select
                            v-model="form.tieredTopology"
                            size="large"
                            class="w-full"
                            :display-value="labelOf(topologies)"
                            :disabled="saving"
                          >
                            <Select.Trigger aria-label="Tiered cache topology" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in topologies"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Advanced cache key"
                hint="Which parts of a request make two requests two different cached objects."
                anchor="cache-key"
                collapsible
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="varyByMethod"
                          title="Cache by HTTP method"
                          description="GET and HEAD are always cached. Adding POST or OPTIONS puts the request body in the cache key."
                        >
                          <MultiSelect
                            v-model="form.varyByMethod"
                            size="large"
                            class="w-full"
                            placeholder="GET and HEAD only"
                            :display-value="methodsLabel"
                            :disabled="saving"
                          >
                            <MultiSelect.Trigger aria-label="Cache by HTTP method" />
                            <MultiSelect.Content>
                              <MultiSelect.Option
                                v-for="option in methods"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </MultiSelect.Option>
                            </MultiSelect.Content>
                          </MultiSelect>
                        </SettingRow>
                        <SettingRow
                          key="queryStringBehavior"
                          title="Cache by query string"
                        >
                          <Select
                            v-model="form.queryStringBehavior"
                            size="large"
                            class="w-full"
                            :display-value="labelOf(varyBehaviors)"
                            :disabled="saving"
                          >
                            <Select.Trigger aria-label="Cache by query string" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in varyBehaviors"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          v-if="['allowlist', 'denylist'].includes(form.queryStringBehavior)"
                          key="queryStringFields"
                          title="Query string fields"
                          description="Comma separated and case sensitive: utm_source and UTM_SOURCE are two fields."
                          :level="1"
                        >
                          <Input
                            id="cache-queryStringFields"
                            v-model="form.queryStringFields"
                            size="large"
                            class="w-full"
                            aria-label="Query string fields"
                            placeholder="page, sort, lang"
                            autocomplete="off"
                            :required="errors.queryStringFields?.kind === 'required'"
                            :invalid="errors.queryStringFields?.kind === 'invalid'"
                            :aria-describedby="
                              errors.queryStringFields
                                ? 'cache-queryStringFields-message'
                                : undefined
                            "
                            :disabled="saving"
                            @update:model-value="clear('queryStringFields')"
                          />
                          <HelperText
                            v-if="errors.queryStringFields"
                            id="cache-queryStringFields-message"
                            :kind="errors.queryStringFields.kind"
                            :label="errors.queryStringFields.message"
                          />
                        </SettingRow>
                        <SettingRow
                          key="cookieBehavior"
                          title="Cache by cookies"
                        >
                          <Select
                            v-model="form.cookieBehavior"
                            size="large"
                            class="w-full"
                            :display-value="labelOf(varyBehaviors)"
                            :disabled="saving"
                          >
                            <Select.Trigger aria-label="Cache by cookies" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in varyBehaviors"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          v-if="['allowlist', 'denylist'].includes(form.cookieBehavior)"
                          key="cookieNames"
                          title="Cookie names"
                          description="Comma separated. A name ending in * matches every cookie that starts with it."
                          :level="1"
                        >
                          <Input
                            id="cache-cookieNames"
                            v-model="form.cookieNames"
                            size="large"
                            class="w-full"
                            aria-label="Cookie names"
                            placeholder="session_id, ab_*"
                            autocomplete="off"
                            :required="errors.cookieNames?.kind === 'required'"
                            :invalid="errors.cookieNames?.kind === 'invalid'"
                            :aria-describedby="
                              errors.cookieNames ? 'cache-cookieNames-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="clear('cookieNames')"
                          />
                          <HelperText
                            v-if="errors.cookieNames"
                            id="cache-cookieNames-message"
                            :kind="errors.cookieNames.kind"
                            :label="errors.cookieNames.message"
                          />
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>

          <Transition
            enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="translate-y-2 opacity-0"
          >
            <SaveBar v-if="dirty || saving">
              Cache settings changed.
              <span class="text-(--text-muted)">Saving deploys storefront-app to Production.</span>

              <template #actions>
                <Button
                  type="button"
                  label="Discard"
                  kind="outlined"
                  size="medium"
                  :disabled="saving"
                  @click="discard"
                />
                <Button
                  label="Save"
                  kind="primary"
                  size="medium"
                  :loading="saving"
                  @click="save"
                />
              </template>
            </SaveBar>
          </Transition>
        </form>
      </main>
    </AppLayout>

    <Toaster position="bottom-right" />
  </div>
</template>
