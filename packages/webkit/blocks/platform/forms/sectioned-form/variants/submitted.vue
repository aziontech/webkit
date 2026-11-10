<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import FieldPassword from '@aziontech/webkit/field-password'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldRadio from '@aziontech/webkit/field-radio'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Kbd from '@aziontech/webkit/kbd'
  import Label from '@aziontech/webkit/label'
  import Menu from '@aziontech/webkit/menu'
  import MultiSelect from '@aziontech/webkit/multi-select'
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

  const breadcrumb = [{ label: 'Forms', href: '/forms' }, { label: 'Fields separated' }]

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

  const scopes = [
    { label: 'gab-lisboa', value: 'gab-lisboa' },
    { label: 'acme', value: 'acme' },
    { label: 'rafael-personal', value: 'rafael-personal' }
  ]
  const scopeLabel = (value) => scopes.find((option) => option.value === value)?.label ?? ''

  const deploymentTypes = [
    {
      value: 'static',
      label: 'Static site',
      description:
        'Pre-rendered HTML/CSS/JS served straight from the CDN. Fastest, no server runtime.'
    },
    {
      value: 'ssr',
      label: 'Server-side rendered',
      description: 'Rendered on demand by a server function. Best for dynamic, personalized pages.'
    },
    {
      value: 'hybrid',
      label: 'Hybrid',
      description: 'A static shell with server-rendered islands. Balances speed and dynamism.'
    }
  ]
  const runtimes = [
    { value: 'node18', label: 'Node.js 18' },
    { value: 'node20', label: 'Node.js 20 (LTS)' },
    { value: 'bun', label: 'Bun 1.x' }
  ]
  const regionOptions = [
    { label: 'US East', value: 'us-east' },
    { label: 'US West', value: 'us-west' },
    { label: 'South America', value: 'sa-east' },
    { label: 'Europe', value: 'eu-west' },
    { label: 'Asia Pacific', value: 'ap-southeast' }
  ]
  const regionsLabel = (values) =>
    (values ?? [])
      .map((value) => regionOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const form = reactive({
    scope: 'gab-lisboa',
    repoName: 'nuxt-ecommerce',
    repoPrivate: true,
    accessToken: '',
    revalidationSecret: '',
    storeDomain: '',
    deploymentType: '',
    runtime: 'node20',
    regions: ['us-east'],
    buildCommand: '',
    deployKey: '',
    buildNotes: '',
    alertPhone: '',
    emailNotifications: true,
    slackAlerts: false,
    deployPreviews: true,
    caching: true,
    http3: false,
    requestFiltering: false,
    acceptDeploy: false
  })
  const submitted = ref(true)
  const submitting = ref(false)

  const scopeEmpty = computed(() => !form.scope)
  const repoEmpty = computed(() => !form.repoName.trim())
  const tokenEmpty = computed(() => !form.accessToken.trim())
  const domainInvalid = computed(
    () => form.storeDomain.trim() !== '' && !/^https?:\/\/.+\..+/.test(form.storeDomain.trim())
  )
  const deploymentTypeEmpty = computed(() => !form.deploymentType)
  const buildCommandEmpty = computed(() => !form.buildCommand.trim())
  const deployKeyEmpty = computed(() => !form.deployKey)
  const deployKeyInvalid = computed(() => form.deployKey.length > 0 && form.deployKey.length < 8)
  const phoneEmpty = computed(() => !form.alertPhone.trim())
  const alertPhoneNumber = ref({ number: '', complete: false })
  const phoneInvalid = computed(
    () => form.alertPhone.trim() !== '' && !alertPhoneNumber.value.complete
  )
  const acceptEmpty = computed(() => !form.acceptDeploy)

  const scopeWarning = computed(() => submitted.value && scopeEmpty.value)
  const repoWarning = computed(() => submitted.value && repoEmpty.value)
  const tokenWarning = computed(() => submitted.value && tokenEmpty.value)
  const domainError = computed(() => submitted.value && domainInvalid.value)
  const deploymentTypeWarning = computed(() => submitted.value && deploymentTypeEmpty.value)
  const buildCommandWarning = computed(() => submitted.value && buildCommandEmpty.value)
  const deployKeyWarning = computed(() => submitted.value && deployKeyEmpty.value)
  const deployKeyError = computed(() => submitted.value && deployKeyInvalid.value)
  const phoneWarning = computed(() => submitted.value && phoneEmpty.value)
  const phoneError = computed(() => submitted.value && phoneInvalid.value)
  const acceptWarning = computed(() => submitted.value && acceptEmpty.value)

  const isValid = computed(
    () =>
      !scopeEmpty.value &&
      !repoEmpty.value &&
      !tokenEmpty.value &&
      !domainInvalid.value &&
      !deploymentTypeEmpty.value &&
      !buildCommandEmpty.value &&
      !deployKeyEmpty.value &&
      !deployKeyInvalid.value &&
      !phoneEmpty.value &&
      !phoneInvalid.value &&
      !acceptEmpty.value
  )

  const submit = () => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
    }, 900)
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
                  label="Account Settings"
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
                  label="Personal Tokens"
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
                  <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model:value="theme"
                    aria-label="Theme"
                  />
                </div>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="home"
                  label="Home Page"
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

      <div class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
        <form
          class="flex min-h-full flex-col"
          aria-labelledby="template-settings-title"
          novalidate
          @submit.prevent="submit"
        >
          <div class="layout-column-form layout-boundary flex flex-1 flex-col">
            <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
              <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <h1
                    id="template-settings-title"
                    class="text-balance text-heading-xs text-(--text-default)"
                  >
                    Import from Git
                  </h1>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">
                  Configure your Git repository to integrate your codebase and automate deployments
                  directly from your version control system.
                </p>
              </div>
            </header>

            <fieldset
              class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Template settings</legend>

              <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
                <div class="flex w-full flex-col gap-(--spacing-xs)">
                  <Label
                    for="tpl-scope"
                    :required="scopeWarning"
                    >Scope</Label
                  >
                  <Select
                    v-model="form.scope"
                    size="large"
                    :disabled="submitting"
                    placeholder="Select an account"
                    :display-value="scopeLabel"
                  >
                    <Select.Trigger id="tpl-scope">
                      <template #iconLeft>
                        <i
                          class="ai ai-github"
                          aria-hidden="true"
                        />
                      </template>
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Option
                        v-for="option in scopes"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </div>

                <FieldTextSwitch
                  v-model="form.repoName"
                  v-model:enabled="form.repoPrivate"
                  input-id="tpl-repo-name"
                  name="repoName"
                  label="Private Repository Name"
                  placeholder="my-repository"
                  :required="repoWarning"
                  :disabled="submitting"
                />
              </div>

              <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
                <h2 class="text-heading-xs text-(--text-default)">Template Settings</h2>

                <FieldText
                  v-model="form.accessToken"
                  input-id="tpl-access-token"
                  name="accessToken"
                  label="Store Access Token"
                  placeholder="Access Token"
                  size="large"
                  :disabled="submitting"
                  :required="tokenWarning"
                  :helper-text="
                    tokenWarning
                      ? 'This field is required.'
                      : 'You can find this token in the API credentials of your store.'
                  "
                >
                  <template #iconRight>
                    <i
                      class="pi pi-lock"
                      aria-hidden="true"
                    />
                  </template>
                </FieldText>

                <FieldText
                  v-model="form.revalidationSecret"
                  input-id="tpl-revalidation-secret"
                  name="revalidationSecret"
                  label="Store revalidation secret"
                  placeholder="Revalidation secret"
                  size="large"
                  :disabled="submitting"
                  helper-text="You can find this secret in the API credentials of your store."
                >
                  <template #iconRight>
                    <i
                      class="pi pi-lock"
                      aria-hidden="true"
                    />
                  </template>
                </FieldText>

                <FieldText
                  v-model="form.storeDomain"
                  input-id="tpl-store-domain"
                  name="storeDomain"
                  label="Store Domain"
                  placeholder="https://store.example.com"
                  size="large"
                  :disabled="submitting"
                  :invalid="domainError"
                  :helper-text="
                    domainError
                      ? 'Enter a valid URL, e.g. https://store.example.com.'
                      : 'The public URL of your store.'
                  "
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-globe"
                      aria-hidden="true"
                    />
                  </template>
                  <template #iconRight>
                    <i
                      class="pi pi-lock"
                      aria-hidden="true"
                    />
                  </template>
                </FieldText>
              </section>

              <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
                <h2 class="text-heading-xs text-(--text-default)">Deployment</h2>

                <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
                  <legend class="mb-(--spacing-xs) p-0">
                    <Label :required="deploymentTypeWarning">Deployment type</Label>
                  </legend>
                  <div class="flex flex-col gap-(--spacing-sm)">
                    <FieldRadioBlock
                      v-for="option in deploymentTypes"
                      :key="option.value"
                      v-model="form.deploymentType"
                      :value="option.value"
                      name="deploymentType"
                      :input-id="`tpl-deploymentType-${option.value}`"
                      :label="option.label"
                      :description="option.description"
                      :disabled="submitting"
                    />
                  </div>
                  <HelperText
                    v-if="deploymentTypeWarning"
                    kind="required"
                    label="Select a deployment type."
                  />
                </fieldset>

                <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
                  <legend class="mb-(--spacing-xs) p-0">
                    <Label>Runtime</Label>
                  </legend>
                  <div class="flex flex-wrap gap-(--spacing-lg)">
                    <FieldRadio
                      v-for="option in runtimes"
                      :key="option.value"
                      v-model="form.runtime"
                      :value="option.value"
                      name="runtime"
                      :input-id="`tpl-runtime-${option.value}`"
                      :label="option.label"
                      :disabled="submitting"
                    />
                  </div>
                </fieldset>

                <div class="flex w-full flex-col gap-(--spacing-xs)">
                  <Label for="tpl-regions">Regions</Label>
                  <MultiSelect
                    v-model="form.regions"
                    size="large"
                    :disabled="submitting"
                    placeholder="Select regions"
                    :display-value="regionsLabel"
                  >
                    <MultiSelect.Trigger id="tpl-regions" />
                    <MultiSelect.Content>
                      <MultiSelect.Option
                        v-for="option in regionOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </MultiSelect.Option>
                    </MultiSelect.Content>
                  </MultiSelect>
                  <HelperText label="Leave empty to deploy to every available region." />
                </div>
              </section>

              <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
                <h2 class="text-heading-xs text-(--text-default)">Build &amp; Runtime</h2>

                <FieldInputGroup
                  v-model="form.buildCommand"
                  input-id="tpl-build-command"
                  name="buildCommand"
                  label="Build command"
                  placeholder="npm run build"
                  :disabled="submitting"
                  :required="buildCommandWarning"
                  :helper-text="
                    buildCommandWarning
                      ? 'This field is required.'
                      : 'Run from the repository root during each deployment.'
                  "
                >
                  <template #left>
                    <span class="text-label-sm text-(--text-muted)">$</span>
                  </template>
                </FieldInputGroup>

                <FieldPassword
                  v-model="form.deployKey"
                  input-id="tpl-deploy-key"
                  name="deployKey"
                  label="Deploy Key"
                  placeholder="Paste your deploy key"
                  autocomplete="new-password"
                  :disabled="submitting"
                  :required="deployKeyWarning"
                  :invalid="deployKeyError"
                  :helper-text="
                    deployKeyError
                      ? 'The deploy key must be at least 8 characters.'
                      : deployKeyWarning
                        ? 'This field is required.'
                        : 'Used to authenticate the build against your repository.'
                  "
                />

                <FieldTextarea
                  v-model="form.buildNotes"
                  input-id="tpl-build-notes"
                  name="buildNotes"
                  label="Build notes"
                  placeholder="Anything the team should know about this deployment (optional)."
                  :disabled="submitting"
                  helper-text="Markdown is supported. Shown on the deployment summary."
                />
              </section>

              <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
                <h2 class="text-heading-xs text-(--text-default)">Notifications &amp; Alerts</h2>

                <FieldPhoneNumber
                  v-model="form.alertPhone"
                  input-id="tpl-alert-phone"
                  name="alertPhone"
                  label="On-call alert number"
                  :disabled="submitting"
                  :required="phoneWarning"
                  :invalid="phoneError"
                  @update:phone="alertPhoneNumber = $event"
                  :helper-text="
                    phoneError
                      ? 'Enter a valid phone number.'
                      : phoneWarning
                        ? 'This field is required.'
                        : 'We call this number if a production deployment fails.'
                  "
                />

                <div class="flex flex-col gap-(--spacing-sm)">
                  <FieldSwitchBlock
                    v-model="form.emailNotifications"
                    label="Email notifications"
                    description="Send a summary email to the team when a deployment finishes."
                    :disabled="submitting"
                  />
                  <FieldSwitchBlock
                    v-model="form.slackAlerts"
                    label="Slack alerts"
                    description="Post to your connected Slack channel on failures and rollbacks."
                    :disabled="submitting"
                  />
                </div>

                <FieldSwitch
                  v-model="form.deployPreviews"
                  label="Deploy previews"
                  description="Build a preview URL for every pull request."
                  :disabled="submitting"
                />
              </section>

              <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
                <h2 class="text-heading-xs text-(--text-default)">Delivery features</h2>

                <div class="flex flex-col gap-(--spacing-sm)">
                  <FieldCheckboxBlock
                    v-model="form.caching"
                    label="Caching"
                    description="Cache responses close to your users for faster global delivery."
                    :disabled="submitting"
                  />
                  <FieldCheckboxBlock
                    v-model="form.http3"
                    label="HTTP/3"
                    description="Serve traffic over HTTP/3 (QUIC) where the client supports it."
                    :disabled="submitting"
                  />
                  <FieldCheckboxBlock
                    v-model="form.requestFiltering"
                    label="Request filtering"
                    description="Screen incoming requests against a managed rule set."
                    :disabled="submitting"
                  />
                </div>
              </section>

              <div class="layout-section-start flex flex-col gap-(--spacing-xs)">
                <FieldCheckbox
                  v-model="form.acceptDeploy"
                  input-id="tpl-accept-deploy"
                  name="acceptDeploy"
                  label="I understand this triggers an immediate production deployment."
                  :required="acceptWarning"
                  :disabled="submitting"
                />
                <HelperText
                  v-if="acceptWarning"
                  kind="required"
                  label="You must acknowledge this before deploying."
                />
              </div>

              <div class="layout-group-start flex justify-end">
                <Button
                  label="Deploy"
                  kind="primary"
                  size="medium"
                  :loading="submitting"
                  @click="submit"
                />
              </div>
            </fieldset>
          </div>
        </form>
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
                      label="Account Settings"
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
                      label="Personal Tokens"
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
                      <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model:value="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="home"
                      label="Home Page"
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
