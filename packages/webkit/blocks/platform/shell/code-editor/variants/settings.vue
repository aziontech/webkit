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
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Link from '@aziontech/webkit/link'
  import Menu from '@aziontech/webkit/menu'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

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

  const breadcrumb = [{ label: 'Services', href: '/services' }, { label: 'image-optimizer' }]

  const activeId = ref('services')
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

  const tabs = [
    { value: 'code', label: 'Code' },
    { value: 'settings', label: 'Settings' }
  ]
  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]
  const fieldTypes = [
    { value: 'string', label: 'Text' },
    { value: 'integer', label: 'Integer' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'True / false' },
    { value: 'select', label: 'Choice' },
    { value: 'array', label: 'List' }
  ]
  const itemTypes = [
    { value: 'string', label: 'Text' },
    { value: 'integer', label: 'Integer' },
    { value: 'number', label: 'Number' }
  ]

  const runtimeLabel = 'JavaScript'
  const code = `const ALLOWED = ['webp', 'avif']

export async function handleRequest(request, args = {}) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') ?? args.defaultFormat

  if (!ALLOWED.includes(format)) return fetch(request)

  url.searchParams.set('format', format)
  url.searchParams.set('quality', String(args.quality))
  return fetch(url.toString())
}
`
  const formSchema = {
    type: 'object',
    properties: {
      defaultFormat: {
        type: 'string',
        title: 'Default format',
        description:
          'Used when the request does not ask for a format. Only these are rewritten — anything else passes through untouched.',
        enum: ['webp', 'avif'],
        default: 'webp'
      },
      quality: {
        type: 'integer',
        title: 'Quality',
        description: 'Compression quality applied to every rewritten image.',
        minimum: 1,
        maximum: 100,
        default: 80
      }
    },
    required: ['defaultFormat']
  }
  const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)

  const activeTab = ref('settings')
  const activeDocument = ref('code')
  const form = reactive({
    name: 'image-optimizer',
    executionEnvironment: 'request',
    active: true,
    code,
    schema: JSON.stringify(formSchema, null, 2)
  })
  const fields = ref([
    {
      id: 'field-1',
      key: 'defaultFormat',
      type: 'select',
      title: 'Default format',
      description:
        'Used when the request does not ask for a format. Only these are rewritten — anything else passes through untouched.',
      required: true,
      default: 'webp',
      minLength: '',
      maxLength: '',
      pattern: '',
      minimum: '',
      maximum: '',
      options: ['webp', 'avif'],
      itemType: 'string'
    },
    {
      id: 'field-2',
      key: 'quality',
      type: 'integer',
      title: 'Quality',
      description: 'Compression quality applied to every rewritten image.',
      required: false,
      default: '80',
      minLength: '',
      maxLength: '',
      pattern: '',
      minimum: '1',
      maximum: '100',
      options: [],
      itemType: 'string'
    }
  ])
  const expanded = ref(new Set())
  const touched = ref(new Set())
  const schemaWidth = ref(420)
  const schemaCollapsed = ref(false)
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()

  let sequence = 2
  const newField = () => ({
    id: 'field-' + (sequence += 1),
    key: '',
    type: 'string',
    title: '',
    description: '',
    required: false,
    default: '',
    minLength: '',
    maxLength: '',
    pattern: '',
    minimum: '',
    maximum: '',
    options: [],
    itemType: 'string'
  })

  const fieldTypeLabel = (type) => fieldTypes.find((option) => option.value === type)?.label ?? type
  const itemTypeLabel = (type) => itemTypes.find((option) => option.value === type)?.label ?? type
  const summary = (field) =>
    field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)

  const keyError = (field) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key))
      return 'Letters, digits and underscore, not starting with a digit.'
    return fields.value.some((other) => other.id !== field.id && other.key.trim() === key)
      ? 'Another field already uses this name.'
      : ''
  }
  const touch = (id) => {
    touched.value = new Set(touched.value).add(id)
  }

  const isExpanded = (id) => expanded.value.has(id)
  const toggle = (id) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
  const open = (id) => {
    expanded.value = new Set(expanded.value).add(id)
  }

  const addField = () => {
    const field = newField()
    fields.value.push(field)
    open(field.id)
    nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())
  }
  const removeField = (index) => {
    const [removed] = fields.value.splice(index, 1)
    if (!removed) return
    const next = new Set(expanded.value)
    next.delete(removed.id)
    expanded.value = next
  }
  const duplicateField = (index) => {
    const copy = { ...fields.value[index], id: newField().id, key: '' }
    fields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }
  const move = (index, direction) => {
    const to = index + direction
    if (to < 0 || to >= fields.value.length) return
    const [moved] = fields.value.splice(index, 1)
    fields.value.splice(to, 0, moved)
  }
  const removeForm = () => {
    form.schema = cleanSchema
    fields.value = []
  }

  const onTypeChange = (field) => {
    for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum']) {
      field[constraint] = ''
    }
    if (field.type !== 'select') field.options = []
    if (field.type === 'boolean') field.default = false
    else if (field.type === 'array') field.default = []
    else if (typeof field.default !== 'string') field.default = ''
  }
  const linesToList = (text) =>
    String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  const listToLines = (list) => (Array.isArray(list) ? list.join('\n') : '')

  const snapshot = () => JSON.stringify({ form, fields: fields.value })
  const baseline = ref(snapshot())
  const dirty = computed(() => snapshot() !== baseline.value)
  const discard = () => {
    const saved = JSON.parse(baseline.value)
    Object.assign(form, saved.form)
    fields.value = saved.fields
  }
  const save = () => {
    nameError.value = form.name.trim() ? '' : 'This field is required.'
    codeError.value = form.code.trim() ? '' : 'This field is required.'
    if (codeError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'code'
    }
    if (nameError.value) activeTab.value = 'settings'
    if (nameError.value || codeError.value) return
    baseline.value = snapshot()
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
                    v-model="theme"
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

      <div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
        <main class="flex h-full min-h-0 flex-col">
          <h1 class="sr-only">{{ form.name }}</h1>
          <div class="border-b border-(--border-default)">
            <div
              class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)"
            >
              <div class="flex -ml-(--spacing-xs) min-w-0 flex-1">
                <Tabs
                  v-model="activeTab"
                  class="w-full"
                >
                  <Tabs.List>
                    <Tabs.Item
                      v-for="tab in tabs"
                      :key="tab.value"
                      :value="tab.value"
                      :label="tab.label"
                    />
                  </Tabs.List>
                </Tabs>
              </div>
            </div>
          </div>
          <section
            class="flex min-h-0 flex-1 flex-col"
            :class="activeTab === 'code' ? 'overflow-hidden' : 'overflow-auto'"
          >
            <div class="flex min-h-0 flex-1 flex-col">
              <fieldset class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0">
                <legend class="sr-only">{{ form.name }} settings</legend>
                <div
                  v-show="activeTab === 'code'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div
                      class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <ToggleGroup
                        v-model="activeDocument"
                        :options="documents"
                        aria-label="Editor document"
                      />
                      <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
                        {{
                          activeDocument === 'code'
                            ? runtimeLabel + ', running on request'
                            : 'The fields an instance is asked for, and their defaults.'
                        }}
                      </p>
                    </div>
                    <div class="flex min-h-0 flex-1 flex-col">
                      <div
                        v-show="activeDocument === 'code'"
                        class="flex min-h-0 flex-1 flex-col"
                      >
                        <div class="flex min-h-0 w-full flex-1 flex-col">
                          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                            <div class="flex flex-1 font-code">
                              <Textarea
                                v-model="form.code"
                                resizable="none"
                                :invalid="!!codeError"
                                aria-label="Source code"
                                class="w-full"
                                @update:model-value="codeError = ''"
                              />
                            </div>
                          </div>
                          <div
                            v-if="codeError"
                            class="px-(--spacing-sm) py-(--spacing-xs)"
                          >
                            <HelperText
                              kind="invalid"
                              :label="codeError"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        v-show="activeDocument === 'arguments'"
                        class="flex min-h-0 flex-1 flex-col"
                      >
                        <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                          <div
                            class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                          >
                            <span class="text-label-sm text-(--text-muted)">
                              {{ fields.length }} {{ fields.length === 1 ? 'field' : 'fields' }}
                            </span>
                            <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
                              <Button
                                label="Add field"
                                kind="outlined"
                                size="medium"
                                icon="pi pi-plus"
                                @click="addField"
                              />
                              <Button
                                label="Remove form"
                                kind="outlined"
                                size="medium"
                                icon="pi pi-times"
                                @click="removeForm"
                              />
                            </div>
                          </div>
                          <div class="flex min-h-0 flex-1">
                            <ResizableRoot
                              class="w-full"
                              aria-label="Argument form"
                            >
                              <ResizablePane
                                v-model:basis="schemaWidth"
                                v-model:collapsed="schemaCollapsed"
                                collapsible
                                :min="280"
                                :max="720"
                                aria-label="Schema"
                              >
                                <div class="flex min-h-0 w-full flex-1 flex-col">
                                  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                                    <div class="flex flex-1 font-code">
                                      <Textarea
                                        v-model="form.schema"
                                        resizable="none"
                                        aria-label="Argument form schema, as JSON"
                                        class="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </ResizablePane>
                              <ResizableHandle aria-label="Resize the schema" />
                              <ResizablePane aria-label="Fields">
                                <div
                                  v-if="fields.length === 0"
                                  class="flex min-h-0 flex-1 p-(--spacing-sm)"
                                >
                                  <div class="flex min-h-0 flex-1">
                                    <EmptyState
                                      bordered
                                      icon="pi pi-plus-circle"
                                      title="This form has no fields"
                                      description="Add the first argument the service reads."
                                      class="w-full"
                                    >
                                      <template #actions>
                                        <Button
                                          label="Add field"
                                          kind="secondary"
                                          size="medium"
                                          icon="pi pi-plus"
                                          @click="addField"
                                        />
                                        <Link
                                          label="Read about arguments"
                                          size="medium"
                                          href="https://example.com/docs/arguments"
                                          target="_blank"
                                        />
                                      </template>
                                    </EmptyState>
                                  </div>
                                </div>
                                <div
                                  v-else
                                  class="min-h-0 flex-1 overflow-auto p-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--save-bar-inset,0rem))]"
                                >
                                  <div
                                    class="layout-column-form mx-auto flex min-w-0 flex-col gap-(--spacing-sm)"
                                  >
                                    <Card :padded="false">
                                      <template #content>
                                        <Item.List>
                                          <div
                                            class="relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) [&>[data-slot=item]:last-child]:border-b-transparent"
                                          >
                                            <Item
                                              v-for="(field, index) in fields"
                                              :key="field.id"
                                              size="small"
                                            >
                                              <div class="flex w-full flex-col items-stretch">
                                                <div
                                                  class="flex w-full min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md)"
                                                >
                                                  <div
                                                    class="inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-default cursor-grab active:cursor-grabbing motion-reduce:transition-none"
                                                    role="button"
                                                    tabindex="0"
                                                    :aria-disabled="fields.length < 2 || undefined"
                                                    :aria-label="
                                                      'Reorder ' + (field.key || 'this field')
                                                    "
                                                    @keydown.up.prevent="move(index, -1)"
                                                    @keydown.down.prevent="move(index, 1)"
                                                  >
                                                    <i
                                                      class="pi pi-bars text-label-sm"
                                                      aria-hidden="true"
                                                    />
                                                  </div>
                                                  <Item.Content>
                                                    <div
                                                      class="flex min-w-0 flex-row items-baseline gap-(--spacing-xs)"
                                                    >
                                                      <Item.Title>
                                                        <span
                                                          class="truncate font-code text-label-code-sm"
                                                          :class="
                                                            field.key ? '' : 'text-(--text-muted)'
                                                          "
                                                        >
                                                          {{ field.key || 'Unnamed field' }}
                                                        </span>
                                                      </Item.Title>
                                                      <Item.Description class="shrink-0">{{
                                                        summary(field)
                                                      }}</Item.Description>
                                                    </div>
                                                  </Item.Content>
                                                  <Item.Actions class="shrink-0">
                                                    <Tag
                                                      v-if="field.required"
                                                      label="Required"
                                                      severity="info"
                                                      size="small"
                                                    />
                                                    <Tag
                                                      v-if="keyError(field)"
                                                      label="Needs a name"
                                                      severity="warning"
                                                      size="small"
                                                    />
                                                    <Tooltip text="Duplicate this field">
                                                      <IconButton
                                                        icon="pi pi-clone"
                                                        kind="outlined"
                                                        size="small"
                                                        :aria-label="
                                                          'Duplicate ' + (field.key || 'this field')
                                                        "
                                                        @click="duplicateField(index)"
                                                      />
                                                    </Tooltip>
                                                    <Tooltip text="Remove this field">
                                                      <IconButton
                                                        icon="pi pi-trash"
                                                        kind="outlined"
                                                        size="small"
                                                        :aria-label="
                                                          'Remove ' + (field.key || 'this field')
                                                        "
                                                        @click="removeField(index)"
                                                      />
                                                    </Tooltip>
                                                    <IconButton
                                                      :icon="
                                                        isExpanded(field.id)
                                                          ? 'pi pi-chevron-up'
                                                          : 'pi pi-chevron-down'
                                                      "
                                                      kind="outlined"
                                                      size="small"
                                                      :aria-expanded="isExpanded(field.id)"
                                                      :aria-controls="formId + '-body-' + field.id"
                                                      :aria-label="
                                                        (isExpanded(field.id) ? 'Hide' : 'Show') +
                                                        ' the settings for ' +
                                                        (field.key || 'this field')
                                                      "
                                                      @click="toggle(field.id)"
                                                    />
                                                  </Item.Actions>
                                                </div>
                                                <div
                                                  :id="formId + '-body-' + field.id"
                                                  class="grid transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                                                  :class="
                                                    isExpanded(field.id)
                                                      ? 'grid-rows-[1fr]'
                                                      : 'grid-rows-[0fr]'
                                                  "
                                                >
                                                  <div class="overflow-hidden">
                                                    <div
                                                      class="mt-(--spacing-xs) border-t border-(--border-muted)"
                                                    >
                                                      <Item.List>
                                                        <Item size="small">
                                                          <Item.Content>
                                                            <Item.Title>Name</Item.Title>
                                                            <Item.Description
                                                              >The key in the arguments object, and
                                                              what the service
                                                              reads.</Item.Description
                                                            >
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <div class="contents font-code">
                                                                  <Input
                                                                    :id="
                                                                      formId + '-key-' + field.id
                                                                    "
                                                                    v-model="field.key"
                                                                    size="medium"
                                                                    placeholder="cookie_name"
                                                                    autocomplete="off"
                                                                    spellcheck="false"
                                                                    class="w-full"
                                                                    aria-label="Name"
                                                                    :invalid="!!keyError(field)"
                                                                    :aria-describedby="
                                                                      keyError(field)
                                                                        ? formId +
                                                                          '-message-' +
                                                                          field.id
                                                                        : undefined
                                                                    "
                                                                    @blur="touch(field.id)"
                                                                  />
                                                                </div>
                                                                <HelperText
                                                                  v-if="keyError(field)"
                                                                  :id="
                                                                    formId + '-message-' + field.id
                                                                  "
                                                                  kind="required"
                                                                  :label="keyError(field)"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item size="small">
                                                          <Item.Content>
                                                            <Item.Title>Type</Item.Title>
                                                            <Item.Description
                                                              >What the field accepts, and the
                                                              control the form
                                                              renders.</Item.Description
                                                            >
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Select
                                                                  v-model="field.type"
                                                                  size="medium"
                                                                  class="w-full"
                                                                  :display-value="fieldTypeLabel"
                                                                  @update:model-value="
                                                                    onTypeChange(field)
                                                                  "
                                                                >
                                                                  <Select.Trigger
                                                                    aria-label="Type"
                                                                  />
                                                                  <Select.Content>
                                                                    <Select.Option
                                                                      v-for="option in fieldTypes"
                                                                      :key="option.value"
                                                                      :value="option.value"
                                                                    >
                                                                      {{ option.label }}
                                                                    </Select.Option>
                                                                  </Select.Content>
                                                                </Select>
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item size="small">
                                                          <Item.Content>
                                                            <Item.Title>Label</Item.Title>
                                                            <Item.Description
                                                              >How the field is named in the form.
                                                              Falls back to the
                                                              key.</Item.Description
                                                            >
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Input
                                                                  v-model="field.title"
                                                                  size="medium"
                                                                  :placeholder="
                                                                    field.key || 'Max Age (seconds)'
                                                                  "
                                                                  autocomplete="off"
                                                                  class="w-full"
                                                                  aria-label="Label"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item size="small">
                                                          <Item.Content>
                                                            <Item.Title>Description</Item.Title>
                                                            <Item.Description
                                                              >The guidance under the
                                                              field.</Item.Description
                                                            >
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Input
                                                                  v-model="field.description"
                                                                  size="medium"
                                                                  placeholder="What this argument does"
                                                                  autocomplete="off"
                                                                  class="w-full"
                                                                  aria-label="Description"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item size="small">
                                                          <Item.Content>
                                                            <Item.Title>Required</Item.Title>
                                                            <Item.Description
                                                              >The form refuses to save without
                                                              it.</Item.Description
                                                            >
                                                          </Item.Content>
                                                          <Item.Actions>
                                                            <Switch
                                                              v-model="field.required"
                                                              aria-label="Required"
                                                            />
                                                          </Item.Actions>
                                                        </Item>
                                                        <Item size="small">
                                                          <div
                                                            class="flex w-full gap-(--spacing-sm)"
                                                            :class="
                                                              field.type === 'array'
                                                                ? 'flex-col items-stretch'
                                                                : 'items-center'
                                                            "
                                                          >
                                                            <Item.Content>
                                                              <Item.Title>Default</Item.Title>
                                                              <Item.Description
                                                                >Seeds the arguments an instance
                                                                starts from.</Item.Description
                                                              >
                                                            </Item.Content>
                                                            <div
                                                              class="flex"
                                                              :class="
                                                                field.type === 'boolean'
                                                                  ? 'justify-end'
                                                                  : field.type === 'array'
                                                                    ? 'w-full'
                                                                    : 'max-w-(--container-3xs) flex-1 justify-end'
                                                              "
                                                            >
                                                              <Item.Actions class="w-full">
                                                                <Switch
                                                                  v-if="field.type === 'boolean'"
                                                                  v-model="field.default"
                                                                  aria-label="Default"
                                                                />
                                                                <div
                                                                  v-else
                                                                  class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                                >
                                                                  <Select
                                                                    v-if="field.type === 'select'"
                                                                    v-model="field.default"
                                                                    size="medium"
                                                                    class="w-full"
                                                                    placeholder="No default"
                                                                    :disabled="
                                                                      field.options.length === 0
                                                                    "
                                                                  >
                                                                    <Select.Trigger
                                                                      aria-label="Default"
                                                                    />
                                                                    <Select.Content>
                                                                      <Select.Option
                                                                        v-for="option in field.options"
                                                                        :key="option"
                                                                        :value="option"
                                                                      >
                                                                        {{ option }}
                                                                      </Select.Option>
                                                                    </Select.Content>
                                                                  </Select>
                                                                  <div
                                                                    v-else-if="
                                                                      field.type === 'array'
                                                                    "
                                                                    class="contents font-code"
                                                                  >
                                                                    <Textarea
                                                                      :model-value="
                                                                        listToLines(field.default)
                                                                      "
                                                                      :rows="3"
                                                                      placeholder="One value per line"
                                                                      class="w-full"
                                                                      aria-label="Default"
                                                                      @update:model-value="
                                                                        field.default =
                                                                          linesToList($event)
                                                                      "
                                                                    />
                                                                  </div>
                                                                  <div
                                                                    v-else
                                                                    class="contents font-code"
                                                                  >
                                                                    <Input
                                                                      v-model="field.default"
                                                                      size="medium"
                                                                      :inputmode="
                                                                        field.type === 'integer' ||
                                                                        field.type === 'number'
                                                                          ? 'numeric'
                                                                          : undefined
                                                                      "
                                                                      placeholder="No default"
                                                                      autocomplete="off"
                                                                      class="w-full"
                                                                      aria-label="Default"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </Item.Actions>
                                                            </div>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="field.type === 'string'"
                                                          size="small"
                                                        >
                                                          <Item.Content>
                                                            <Item.Title>Minimum length</Item.Title>
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Input
                                                                  v-model="field.minLength"
                                                                  size="medium"
                                                                  inputmode="numeric"
                                                                  placeholder="No minimum"
                                                                  class="w-full"
                                                                  aria-label="Minimum length"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="field.type === 'string'"
                                                          size="small"
                                                        >
                                                          <Item.Content>
                                                            <Item.Title>Maximum length</Item.Title>
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Input
                                                                  v-model="field.maxLength"
                                                                  size="medium"
                                                                  inputmode="numeric"
                                                                  placeholder="No maximum"
                                                                  class="w-full"
                                                                  aria-label="Maximum length"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="field.type === 'string'"
                                                          size="small"
                                                        >
                                                          <div
                                                            class="flex w-full flex-col items-stretch gap-(--spacing-sm)"
                                                          >
                                                            <Item.Content>
                                                              <Item.Title>Pattern</Item.Title>
                                                              <Item.Description
                                                                >A regular expression the value has
                                                                to match.</Item.Description
                                                              >
                                                            </Item.Content>
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <div class="contents font-code">
                                                                  <Input
                                                                    v-model="field.pattern"
                                                                    size="medium"
                                                                    placeholder="^[a-z0-9_-]+$"
                                                                    autocomplete="off"
                                                                    spellcheck="false"
                                                                    class="w-full"
                                                                    aria-label="Pattern"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="
                                                            field.type === 'integer' ||
                                                            field.type === 'number'
                                                          "
                                                          size="small"
                                                        >
                                                          <Item.Content>
                                                            <Item.Title>Minimum</Item.Title>
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Input
                                                                  v-model="field.minimum"
                                                                  size="medium"
                                                                  inputmode="numeric"
                                                                  placeholder="No minimum"
                                                                  class="w-full"
                                                                  aria-label="Minimum"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="
                                                            field.type === 'integer' ||
                                                            field.type === 'number'
                                                          "
                                                          size="small"
                                                        >
                                                          <Item.Content>
                                                            <Item.Title>Maximum</Item.Title>
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Input
                                                                  v-model="field.maximum"
                                                                  size="medium"
                                                                  inputmode="numeric"
                                                                  placeholder="No maximum"
                                                                  class="w-full"
                                                                  aria-label="Maximum"
                                                                />
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="field.type === 'select'"
                                                          size="small"
                                                        >
                                                          <div
                                                            class="flex w-full flex-col items-stretch gap-(--spacing-sm)"
                                                          >
                                                            <Item.Content>
                                                              <Item.Title>Choices</Item.Title>
                                                              <Item.Description
                                                                >One per line. These are the values
                                                                the form offers.</Item.Description
                                                              >
                                                            </Item.Content>
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <div class="contents font-code">
                                                                  <Textarea
                                                                    :model-value="
                                                                      listToLines(field.options)
                                                                    "
                                                                    :rows="3"
                                                                    placeholder="webp&#10;avif&#10;jpeg"
                                                                    class="w-full"
                                                                    aria-label="Choices"
                                                                    @update:model-value="
                                                                      field.options =
                                                                        linesToList($event)
                                                                    "
                                                                  />
                                                                </div>
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                        <Item
                                                          v-if="field.type === 'array'"
                                                          size="small"
                                                        >
                                                          <Item.Content>
                                                            <Item.Title>List of</Item.Title>
                                                            <Item.Description
                                                              >The type of every value in the
                                                              list.</Item.Description
                                                            >
                                                          </Item.Content>
                                                          <div
                                                            class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                          >
                                                            <Item.Actions class="w-full">
                                                              <div
                                                                class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                              >
                                                                <Select
                                                                  v-model="field.itemType"
                                                                  size="medium"
                                                                  class="w-full"
                                                                  :display-value="itemTypeLabel"
                                                                >
                                                                  <Select.Trigger
                                                                    aria-label="List of"
                                                                  />
                                                                  <Select.Content>
                                                                    <Select.Option
                                                                      v-for="option in itemTypes"
                                                                      :key="option.value"
                                                                      :value="option.value"
                                                                    >
                                                                      {{ option.label }}
                                                                    </Select.Option>
                                                                  </Select.Content>
                                                                </Select>
                                                              </div>
                                                            </Item.Actions>
                                                          </div>
                                                        </Item>
                                                      </Item.List>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </Item>
                                          </div>
                                        </Item.List>
                                      </template>
                                    </Card>
                                  </div>
                                </div>
                              </ResizablePane>
                            </ResizableRoot>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-show="activeTab === 'settings'"
                  class="layout-column-form layout-boundary flex min-w-0 flex-col"
                >
                  <section class="layout-section-start flex min-w-0 flex-col">
                    <section
                      class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                    >
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <h2
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)">General</span>
                          </h2>
                        </div>
                      </div>
                      <div class="grid min-w-0 grid-rows-[1fr]">
                        <div class="min-w-0">
                          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <Item size="small">
                                    <Item.Content>
                                      <Item.Title>Name</Item.Title>
                                      <Item.Description
                                        >Give a unique and descriptive name to identify your
                                        service.</Item.Description
                                      >
                                    </Item.Content>
                                    <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                      <Item.Actions class="w-full">
                                        <div
                                          class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                        >
                                          <Input
                                            v-model="form.name"
                                            size="large"
                                            class="w-full"
                                            aria-label="Name"
                                            autocomplete="off"
                                            :required="!!nameError"
                                            :aria-describedby="
                                              nameError ? nameMessageId : undefined
                                            "
                                            @update:model-value="nameError = ''"
                                          />
                                          <HelperText
                                            v-if="nameError"
                                            :id="nameMessageId"
                                            kind="required"
                                            :label="nameError"
                                          />
                                        </div>
                                      </Item.Actions>
                                    </div>
                                  </Item>
                                </Item.List>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                    >
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <h2
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)">Runtime</span>
                          </h2>
                        </div>
                      </div>
                      <div class="grid min-w-0 grid-rows-[1fr]">
                        <div class="min-w-0">
                          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <Item size="small">
                                    <Item.Content>
                                      <Item.Title>Runtime</Item.Title>
                                      <Item.Description
                                        >The runtime isn't editable after the service is
                                        created.</Item.Description
                                      >
                                    </Item.Content>
                                    <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                      <Item.Actions class="w-full">
                                        <div
                                          class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                        >
                                          <Input
                                            :model-value="runtimeLabel"
                                            size="large"
                                            class="w-full"
                                            aria-label="Runtime"
                                            readonly
                                            disabled
                                          >
                                            <template #iconRight>
                                              <i
                                                class="pi pi-lock"
                                                aria-hidden="true"
                                              />
                                            </template>
                                          </Input>
                                        </div>
                                      </Item.Actions>
                                    </div>
                                  </Item>
                                </Item.List>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                    >
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <h2
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)"
                              >Execution environment</span
                            >
                          </h2>
                          <Hint
                            text="Where in the request path the service runs, each stage handing the code a different request."
                            class="shrink-0"
                          />
                        </div>
                      </div>
                      <div class="grid min-w-0 grid-rows-[1fr]">
                        <div class="min-w-0">
                          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <Item size="small">
                                    <div
                                      class="flex w-full flex-col items-stretch gap-(--spacing-sm)"
                                    >
                                      <Item.Content>
                                        <Item.Title>Runs on</Item.Title>
                                      </Item.Content>
                                      <Item.Actions class="w-full">
                                        <div
                                          class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                        >
                                          <fieldset
                                            class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                                          >
                                            <legend class="sr-only">Execution environment</legend>
                                            <FieldRadioBlock
                                              v-model="form.executionEnvironment"
                                              value="request"
                                              :name="groupName"
                                              label="On request"
                                              description="Runs on each request the service handles, after routing."
                                            />
                                            <FieldRadioBlock
                                              v-model="form.executionEnvironment"
                                              value="gateway"
                                              :name="groupName"
                                              label="At the gateway"
                                              description="Runs at the gateway, before routing, where a request can still be refused."
                                            />
                                          </fieldset>
                                        </div>
                                      </Item.Actions>
                                    </div>
                                  </Item>
                                </Item.List>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                    >
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <h2
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)">Status</span>
                          </h2>
                        </div>
                      </div>
                      <div class="grid min-w-0 grid-rows-[1fr]">
                        <div class="min-w-0">
                          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <Item size="small">
                                    <Item.Content>
                                      <Item.Title>Active</Item.Title>
                                      <Item.Description
                                        >An inactive service keeps its code and stops
                                        running.</Item.Description
                                      >
                                    </Item.Content>
                                    <Item.Actions>
                                      <Switch
                                        v-model="form.active"
                                        aria-label="Active"
                                      />
                                    </Item.Actions>
                                  </Item>
                                </Item.List>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>
                  </section>
                </div>
              </fieldset>
            </div>
          </section>
          <Transition
            enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="translate-y-2 opacity-0"
          >
            <footer
              v-if="dirty"
              class="sticky bottom-0 z-10 h-0 shrink-0"
            >
              <div
                class="absolute inset-x-0 bottom-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14"
              >
                <div
                  class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0"
                >
                  <div class="flex min-w-0 items-start gap-(--spacing-xs)">
                    <i
                      class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <p class="min-w-0 text-body-sm text-(--text-default)">
                      You have unsaved changes.
                    </p>
                  </div>
                  <div
                    class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)"
                  >
                    <Button
                      type="button"
                      label="Discard"
                      kind="outlined"
                      size="medium"
                      @click="discard"
                    />
                    <Button
                      label="Save"
                      kind="primary"
                      size="medium"
                      @click="save"
                    />
                  </div>
                </div>
              </div>
            </footer>
          </Transition>
        </main>
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
                        v-model="theme"
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
