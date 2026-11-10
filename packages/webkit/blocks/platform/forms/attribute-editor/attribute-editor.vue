<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Dropdown from '@aziontech/webkit/dropdown'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  const columns = [
    { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'scope', header: 'Scope', minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]
  const filterFields = [
    { id: 'lastEditor', label: 'Author' },
    { id: 'type', label: 'Type' },
    { id: 'modified', label: 'Last Modified' }
  ]
  const seed = [
    {
      id: 'v-001',
      key: 'API_BASE_URL',
      value: 'https://api.example.com',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Robson Junior',
      lastEditorAvatar: '',
      lastModified: '1 month ago'
    },
    {
      id: 'v-002',
      key: 'PAYMENT_SECRET_KEY',
      value: 'sk_live_51H8sX2eZv...',
      secret: true,
      scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
      lastEditor: 'Isaque Böck',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-003',
      key: 'FEATURE_FLAGS',
      value: 'checkout_v2,dark_mode',
      secret: false,
      scope: [{ type: 'service', id: '3344556677', name: 'storefront' }],
      lastEditor: 'Rafael Garbinatto',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-004',
      key: 'DATABASE_PASSWORD',
      value: 'p4ssw0rd-r0t4t3d',
      secret: true,
      scope: [{ type: 'policy', id: '5540117', name: 'production-policy' }],
      lastEditor: 'Herbert Júlio',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-005',
      key: 'MAX_UPLOAD_MB',
      value: '25',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Rafael Umman',
      lastEditorAvatar: '',
      lastModified: '3 months ago'
    }
  ]

  const variables = ref([...seed])
  const existingKeys = computed(() => variables.value.map((variable) => variable.key))

  const search = ref('')
  const loading = ref(false)
  const table = ref(null)
  const columnVisibility = ref({ id: false })

  const refresh = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 600)
  }

  const filterOpen = ref(false)
  const filterQuery = ref('')
  const filterRows = computed(() => {
    const term = filterQuery.value.trim().toLowerCase()
    return term
      ? filterFields.filter((field) => field.label.toLowerCase().includes(term))
      : filterFields
  })

  const columnsOpen = ref(false)
  const listedColumns = columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.accessorKey,
      label: column.header,
      locked: column.hideable === false
    }))
  const isVisible = (id) => columnVisibility.value[id] !== false
  const setVisible = (id, visible) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => listedColumns.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }

  const displayValue = (row) => (row.secret ? SECRET_MASK : row.value)

  const scopeSummary = (scope) =>
    scopeTypes
      .map((entry) => ({
        ...entry,
        names: (scope ?? []).filter((item) => item.type === entry.type).map((item) => item.name)
      }))
      .filter((entry) => entry.names.length > 0)
      .map((group) => ({
        label: group.label,
        detail:
          group.type === 'global'
            ? ''
            : group.names.length === 1
              ? group.names[0]
              : `${group.names.length} ${group.plural}`
      }))

  const onCreated = (created) => {
    variables.value = [
      ...created.map((variable, index) => ({
        ...variable,
        id: `v-${Date.now()}-${index}`,
        lastEditor: 'myemail',
        lastEditorAvatar: '',
        lastModified: 'just now'
      })),
      ...variables.value
    ]
  }

  const SECRET_MASK = '••••••••'
  const SECRET_HINT =
    'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'
  const VIEW_OPTIONS = [
    { label: 'Form', value: 'Form' },
    { label: 'JSON', value: 'JSON' }
  ]
  const fieldClass =
    'h-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-md) text-(--text-default) outline-none placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  const formId = useId()
  const fieldId = (entry, part) => `${formId}-${part}-${entry.id}`
  const messageId = (entry, part) => `${fieldId(entry, part)}-message`

  let nextEntryId = 0
  const createEntry = (key = '', value = '', secret = false) => ({
    id: (nextEntryId += 1),
    key,
    value,
    secret,
    visible: false
  })
  const isEmptyEntry = (entry) => !entry.key.trim() && !entry.value.trim()
  const formatKey = (value) =>
    String(value ?? '')
      .replace(/\s/g, '_')
      .toUpperCase()

  const drawerOpen = ref(false)
  const submitting = ref(false)
  const submitted = ref(false)
  const entries = ref([createEntry()])
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  const fileInput = ref(null)

  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))
  const keyCounts = computed(() =>
    filledEntries.value.reduce((counts, entry) => {
      const key = entry.key.trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map())
  )
  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )

  const keyError = (entry) => {
    if (!submitted.value || isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return { kind: 'required', message: 'Key is required.' }
    if (!/^[A-Z0-9_]+$/.test(key))
      return { kind: 'invalid', message: 'Use only uppercase letters, numbers, and underscores.' }
    if (keyCounts.value.get(key) > 1)
      return { kind: 'invalid', message: `Duplicated key: ${duplicatedKeys.value.join(', ')}` }
    if (existingKeys.value.includes(key))
      return { kind: 'invalid', message: `${key} already exists in this list.` }
    return null
  }
  const valueError = (entry) => {
    if (!submitted.value || isEmptyEntry(entry) || entry.value.trim()) return null
    return { kind: 'required', message: 'Value is required.' }
  }

  const noVariables = computed(() => filledEntries.value.length === 0)
  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })
  const canRemove = computed(() => entries.value.length > 1)

  const addEntry = async () => {
    const entry = createEntry()
    entries.value.push(entry)
    await nextTick()
    document.getElementById(fieldId(entry, 'key'))?.focus()
  }
  const removeEntry = (index) => {
    if (canRemove.value) entries.value.splice(index, 1)
  }
  const setKey = (entry, value) => {
    entry.key = formatKey(value)
  }

  const secretTooltip = (entry) =>
    entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretAriaLabel = (entry) => (entry.secret ? 'Unmark as secret' : 'Mark as secret')

  const unquote = (value) => {
    const quote = value[0]
    if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
      return value.slice(1, -1)
    }
    return value
  }
  const parseEnvFile = (content) => {
    const parsed = []
    const invalidLines = []
    String(content ?? '')
      .split(/\r?\n/)
      .forEach((line, index) => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return
        const declaration = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
        const match = declaration.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
        if (!match) {
          invalidLines.push(index + 1)
          return
        }
        parsed.push({ key: match[1], value: unquote(match[2]) })
      })
    return { parsed, invalidLines }
  }
  const parseJsonObject = (content) => {
    const parsed = JSON.parse(content)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return Object.entries(parsed)
      .filter(([key]) => key.trim())
      .map(([key, value]) => ({
        key: formatKey(key),
        value:
          typeof value === 'string'
            ? value
            : value == null
              ? ''
              : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value)
      }))
  }
  const parsePasted = (content) => {
    const text = String(content ?? '').trim()
    if (!text) return null
    if (text.startsWith('{')) {
      try {
        const pairs = parseJsonObject(text)
        return pairs?.length ? pairs : null
      } catch {
        return null
      }
    }
    const { parsed, invalidLines } = parseEnvFile(text)
    return invalidLines.length || !parsed.length ? null : parsed
  }
  const toEntries = (pairs, secrets = new Set()) =>
    pairs.map((pair) => createEntry(pair.key, pair.value, secrets.has(pair.key)))

  const pasteIntoKey = (event, index) => {
    if (!isEmptyEntry(entries.value[index])) return
    const pairs = parsePasted(event.clipboardData?.getData('text/plain'))
    if (!pairs) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }

  const onFilePicked = async (event) => {
    const [file] = event.target.files ?? []
    event.target.value = ''
    if (!file) return
    const { parsed, invalidLines } = parseEnvFile(await file.text())
    if (!parsed.length && invalidLines.length) return
    view.value = 'Form'
    await nextTick()
    entries.value = [...filledEntries.value, ...toEntries(parsed)]
    if (!entries.value.length) entries.value = [createEntry()]
  }

  watch(view, (next) => {
    if (next === 'JSON') {
      jsonError.value = ''
      jsonText.value = JSON.stringify(
        Object.fromEntries(filledEntries.value.map((entry) => [entry.key.trim(), entry.value])),
        null,
        2
      )
      return
    }
    if (jsonError.value) return
    const secrets = new Set(
      filledEntries.value.filter((entry) => entry.secret).map((entry) => entry.key.trim())
    )
    const pairs = parseJsonObject(jsonText.value) ?? []
    entries.value = pairs.length ? toEntries(pairs, secrets) : [createEntry()]
  })

  watch(jsonText, (text) => {
    if (view.value !== 'JSON') return
    try {
      jsonError.value = parseJsonObject(text)
        ? ''
        : 'Variables must be a JSON object with key/value pairs.'
    } catch {
      jsonError.value = 'Variables must be valid JSON.'
    }
  })

  const scopeTypes = [
    { type: 'global', label: 'Global', plural: '' },
    { type: 'environment', label: 'Environment', plural: 'environments' },
    { type: 'project', label: 'Project', plural: 'projects' },
    { type: 'service', label: 'Service', plural: 'services' },
    { type: 'policy', label: 'Policy', plural: 'policies' }
  ]
  const scopeOptions = {
    environment: [
      { value: 'env-production', label: 'Production' },
      { value: 'env-preview', label: 'Preview' },
      { value: 'env-stage', label: 'Stage' }
    ],
    project: [
      { value: '1020655', label: 'web-app' },
      { value: '1020828', label: 'docs-site' },
      { value: '1021001', label: 'api-gateway' },
      { value: '1021174', label: 'mobile-backend' }
    ],
    service: [
      { value: '4410203040', label: 'checkout' },
      { value: '3344556677', label: 'storefront' },
      { value: '8899001122', label: 'search' },
      { value: '9988776655', label: 'marketing-site' }
    ],
    policy: [
      { value: '5540117', label: 'production-policy' },
      { value: '5540118', label: 'staging-policy' },
      { value: '5540119', label: 'api-hardening' },
      { value: '5540120', label: 'checkout-shield' }
    ]
  }
  const createScopes = () =>
    scopeTypes.map((scope) => ({
      ...scope,
      placeholder: scope.plural ? `Select ${scope.plural}` : '',
      enabled: scope.type === 'global',
      ids: [],
      query: '',
      options: scopeOptions[scope.type] ?? []
    }))
  const scopes = reactive(createScopes())

  const setScopeEnabled = (scope, enabled) => {
    if (scope.type === 'global') return
    scope.enabled = enabled
    scope.ids = enabled ? scope.options.map((option) => option.value) : []
    scope.query = ''
    scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
  }
  const scopeMissing = (scope) => scope.enabled && scope.type !== 'global' && scope.ids.length === 0
  const scopeError = (scope) => submitted.value && scopeMissing(scope)
  const scopeDisplay = (scope) => (ids) => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
    return scope.options.find((option) => option.value === ids[0])?.label ?? ids[0]
  }
  const visibleScopeOptions = (scope) => {
    const query = scope.query.trim().toLowerCase()
    if (!query) return scope.options
    return scope.options.filter((option) => option.label.toLowerCase().includes(query))
  }
  const scopePayload = () =>
    scopes.flatMap((scope) => {
      if (!scope.enabled) return []
      if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
      return scope.ids.map((id) => ({
        type: scope.type,
        id,
        name: scope.options.find((option) => option.value === id)?.label ?? id
      }))
    })

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    entries.value = [createEntry()]
    view.value = 'Form'
    jsonText.value = '{}'
    jsonError.value = ''
    submitted.value = false
    Object.assign(scopes, createScopes())
    submitting.value = false
  })

  const submit = async () => {
    if (submitting.value) return
    if (view.value === 'JSON') {
      if (jsonError.value) return
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (!isValid.value || scopes.some(scopeMissing)) return
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const scope = scopePayload()
    const created = filledEntries.value.map((entry) => ({
      key: entry.key.trim(),
      value: entry.value,
      secret: entry.secret,
      scope
    }))
    onCreated(created)
    submitting.value = false
    drawerOpen.value = false
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
        <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <h1
              data-size="medium"
              class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
            >
              Variables
            </h1>
          </div>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            Configure variable names, values, and settings for use across your projects.
          </p>
        </div>
        <div
          class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full"
        >
          <div class="w-full md:w-fit">
            <Button
              label="Documentation"
              icon="pi pi-book"
              kind="outlined"
              href="https://example.com/docs/variables"
              target="_blank"
              size="medium"
              class="w-full"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              label="Create Variable"
              icon="pi pi-plus"
              kind="outlined"
              size="medium"
              class="w-full"
              @click="drawerOpen = true"
            />
          </div>
        </div>
      </header>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-center gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
              <div class="flex shrink-0 items-center">
                <Popover
                  v-model:open="filterOpen"
                  placement="bottom-start"
                  class="shrink-0"
                >
                  <div class="relative">
                    <Popover.Trigger>
                      <Button
                        label="Filter"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-filter"
                      />
                    </Popover.Trigger>
                  </div>
                  <Popover.Content>
                    <div class="flex flex-col">
                      <div
                        class="relative overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                      >
                        <div
                          data-level="root"
                          class="flex flex-col"
                        >
                          <div class="border-b border-(--border-default) p-(--spacing-xs)">
                            <InputText
                              v-model="filterQuery"
                              size="medium"
                              class="w-full"
                              placeholder="Filter by…"
                              aria-label="Search filter fields"
                            >
                              <template #iconLeft>
                                <i
                                  class="pi pi-search"
                                  aria-hidden="true"
                                />
                              </template>
                            </InputText>
                          </div>
                          <div
                            class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)"
                          >
                            <button
                              v-for="field in filterRows"
                              :key="field.id"
                              type="button"
                              data-filter-row
                              class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                              :aria-expanded="false"
                            >
                              <span class="grow truncate">{{ field.label }}</span>
                              <i
                                class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                            </button>
                            <p
                              v-if="!filterRows.length"
                              class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                            >
                              No match for “{{ filterQuery }}”.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover>
              </div>
              <div class="flex min-w-36 grow basis-(--container-2xs)">
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search variables"
                  aria-label="Search variables"
                  class="w-full"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
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
                  :loading="loading"
                  ariaLabel="Refresh"
                  @click="refresh"
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
                  :disabled="!table"
                  ariaLabel="Download CSV"
                  @click="table?.exportCsv({ filename: 'variables.csv' })"
                />
              </Tooltip>
              <Popover
                v-model:open="columnsOpen"
                placement="bottom-end"
                class="shrink-0"
              >
                <Popover.Trigger>
                  <Tooltip
                    text="Columns"
                    :disabled="columnsOpen"
                  >
                    <IconButton
                      icon="ai ai-column"
                      kind="outlined"
                      size="medium"
                      ariaLabel="Columns"
                    />
                  </Tooltip>
                </Popover.Trigger>
                <Popover.Content>
                  <div class="flex flex-col">
                    <div
                      class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)"
                    >
                      <p class="text-label-md text-(--text-default)">Columns</p>
                    </div>
                    <div
                      class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)"
                    >
                      <label
                        v-for="column in listedColumns"
                        :key="column.id"
                        class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                        :class="
                          column.locked
                            ? 'cursor-default text-(--text-muted)'
                            : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'
                        "
                      >
                        <Switch
                          :model-value="isVisible(column.id)"
                          :disabled="column.locked"
                          @update:model-value="(value) => setVisible(column.id, !!value)"
                        />
                        <span class="min-w-0 truncate">{{ column.label }}</span>
                        <span
                          v-if="column.locked"
                          class="ml-auto shrink-0 text-label-xs text-(--text-muted)"
                          >Always shown</span
                        >
                      </label>
                    </div>
                    <div
                      v-if="hiddenCount"
                      class="border-t border-(--border-default) p-(--spacing-xxs)"
                    >
                      <Button
                        label="Show all columns"
                        kind="text"
                        size="small"
                        class="w-full"
                        @click="showAll"
                      />
                    </div>
                  </div>
                </Popover.Content>
              </Popover>
            </div>
          </header>

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <TableRoot
                  ref="table"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="variables"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="loading"
                >
                  <template #cell-key="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-key shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-id="{ value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
                      <CopyButton
                        v-if="value"
                        kind="outlined"
                        :value="value"
                        aria-label="Copy variable ID"
                      />
                    </div>
                  </template>

                  <template #cell-value="{ row }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <span class="min-w-0 truncate">{{ displayValue(row) }}</span>
                      <div
                        v-if="!row.secret"
                        class="shrink-0 ml-auto"
                      >
                        <CopyButton
                          kind="outlined"
                          :value="row.value"
                          aria-label="Copy value"
                        />
                      </div>
                    </div>
                  </template>

                  <template #cell-lastModified="{ row, value }">
                    <div
                      v-if="value"
                      class="flex min-w-0 items-center gap-(--spacing-xs)"
                    >
                      <Tooltip
                        v-if="row.lastEditor"
                        :text="row.lastEditor"
                      >
                        <Avatar
                          :src="row.lastEditorAvatar || undefined"
                          :alt="row.lastEditor"
                          :label="row.lastEditor"
                          size="small"
                          kind="square"
                        />
                      </Tooltip>
                      <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-scope="{ value }">
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span
                        v-for="item in scopeSummary(value)"
                        :key="item.label"
                        class="truncate whitespace-nowrap"
                      >
                        {{ item.label }}
                        <span
                          v-if="item.detail"
                          class="text-(--text-muted)"
                          >{{ item.detail }}</span
                        >
                      </span>
                    </div>
                  </template>

                  <template #cell-actions>
                    <Dropdown placement="bottom-end">
                      <Dropdown.Trigger>
                        <Tooltip text="Row actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        >
                          <template #left>
                            <i
                              class="pi pi-pencil"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="duplicate"
                          label="Clone"
                        >
                          <template #left>
                            <i
                              class="pi pi-clone"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left>
                            <i
                              class="pi pi-trash"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>
                  </template>
                </TableRoot>
              </template>
            </CardBox>
          </section>
        </section>
      </section>
    </main>

    <Drawer
      v-model:open="drawerOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Variable"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Create Variable</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Create one or more variables and define where they are available.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create Variable</legend>
                <section
                  data-stacked
                  class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                >
                  <div
                    data-stacked
                    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                  >
                    <div
                      class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                    >
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                      >
                        <span class="flex items-center gap-(--spacing-xs)">Variables</span>
                      </h2>
                      <Hint
                        text="Store values your services read at runtime. Add one row per variable, or import a .env file."
                        class="shrink-0"
                      />
                    </div>
                  </div>
                  <div
                    data-open
                    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                  >
                    <div class="min-w-0 data-collapsible:overflow-hidden">
                      <div
                        data-open
                        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                      >
                        <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                          <div class="flex items-center gap-(--spacing-xs) self-end">
                            <Button
                              label="Upload"
                              icon="pi pi-upload"
                              kind="outlined"
                              size="medium"
                              @click="fileInput?.click()"
                            />
                            <input
                              ref="fileInput"
                              type="file"
                              accept=".env,.txt,text/plain"
                              class="sr-only"
                              tabindex="-1"
                              aria-hidden="true"
                              @change="onFilePicked"
                            />
                            <SegmentedButton
                              v-model="view"
                              :options="VIEW_OPTIONS"
                              aria-label="Variables view"
                              size="medium"
                            />
                          </div>

                          <template v-if="view === 'Form'">
                            <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                              <div
                                v-for="(entry, index) in entries"
                                :key="entry.id"
                                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                              >
                                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                  <InputGroupRoot
                                    size="large"
                                    :required="keyError(entry)?.kind === 'required'"
                                    :invalid="keyError(entry)?.kind === 'invalid'"
                                  >
                                    <InputGroupAddon>
                                      <label
                                        :for="fieldId(entry, 'key')"
                                        class="w-20"
                                        >Key</label
                                      >
                                    </InputGroupAddon>
                                    <input
                                      :id="fieldId(entry, 'key')"
                                      :value="entry.key"
                                      placeholder="MY_VARIABLE"
                                      autocomplete="off"
                                      spellcheck="false"
                                      :aria-invalid="!!keyError(entry) || undefined"
                                      :aria-describedby="
                                        keyError(entry) ? messageId(entry, 'key') : undefined
                                      "
                                      :class="fieldClass"
                                      class="text-label-code-sm"
                                      @input="setKey(entry, $event.target.value)"
                                      @paste="pasteIntoKey($event, index)"
                                    />
                                    <Tooltip
                                      v-if="canRemove"
                                      text="Remove variable"
                                    >
                                      <IconButton
                                        icon="pi pi-trash"
                                        kind="outlined"
                                        size="large"
                                        aria-label="Remove variable"
                                        @click="removeEntry(index)"
                                      />
                                    </Tooltip>
                                  </InputGroupRoot>

                                  <InputGroupRoot
                                    size="large"
                                    :required="!!valueError(entry)"
                                  >
                                    <InputGroupAddon>
                                      <label
                                        :for="fieldId(entry, 'value')"
                                        class="w-20"
                                        >Value</label
                                      >
                                    </InputGroupAddon>
                                    <input
                                      :id="fieldId(entry, 'value')"
                                      v-model="entry.value"
                                      :type="entry.secret && !entry.visible ? 'password' : 'text'"
                                      :placeholder="
                                        entry.secret ? SECRET_MASK : 'my-variable-value'
                                      "
                                      autocomplete="off"
                                      spellcheck="false"
                                      :aria-invalid="!!valueError(entry) || undefined"
                                      :aria-describedby="
                                        valueError(entry) ? messageId(entry, 'value') : undefined
                                      "
                                      :class="fieldClass"
                                      class="text-label-sm"
                                    />
                                    <Tooltip
                                      v-if="entry.secret"
                                      :text="entry.visible ? 'Hide value' : 'Show value'"
                                    >
                                      <IconButton
                                        :icon="entry.visible ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                        kind="outlined"
                                        size="large"
                                        :aria-label="entry.visible ? 'Hide value' : 'Show value'"
                                        :aria-pressed="entry.visible"
                                        @click="entry.visible = !entry.visible"
                                      />
                                    </Tooltip>
                                    <InputGroupAddon>
                                      <Tooltip :text="secretTooltip(entry)">
                                        <span class="flex items-center gap-(--spacing-xs)">
                                          <label :for="fieldId(entry, 'secret')">Secret</label>
                                          <Checkbox
                                            v-model="entry.secret"
                                            binary
                                            :input-id="fieldId(entry, 'secret')"
                                            :aria-label="secretAriaLabel(entry)"
                                          />
                                        </span>
                                      </Tooltip>
                                    </InputGroupAddon>
                                  </InputGroupRoot>
                                </div>

                                <HelperText
                                  v-if="keyError(entry)"
                                  :id="messageId(entry, 'key')"
                                  :kind="keyError(entry).kind"
                                  :label="keyError(entry).message"
                                />
                                <HelperText
                                  v-if="valueError(entry)"
                                  :id="messageId(entry, 'value')"
                                  :kind="valueError(entry).kind"
                                  :label="valueError(entry).message"
                                />
                              </div>
                            </div>

                            <div>
                              <Button
                                label="Add variable"
                                icon="pi pi-plus"
                                kind="outlined"
                                size="medium"
                                :disabled="!canAdd"
                                @click="addEntry"
                              />
                            </div>

                            <HelperText
                              label="Paste JSON or .env contents into an empty key field to create one row per variable."
                            />
                          </template>

                          <template v-else>
                            <Textarea
                              v-model="jsonText"
                              aria-label="Variables JSON"
                              :invalid="!!jsonError"
                              :aria-describedby="jsonError ? formId + '-json-message' : undefined"
                            />
                            <HelperText>
                              Use a JSON object format, for example:
                              <code class="text-label-code-sm"
                                >{"API_URL":"https://example.com"}</code
                              >
                            </HelperText>
                            <HelperText
                              v-if="jsonError"
                              :id="formId + '-json-message'"
                              kind="invalid"
                              :label="jsonError"
                            />
                          </template>

                          <HelperText :label="SECRET_HINT" />
                          <HelperText
                            v-if="submitted && noVariables"
                            kind="required"
                            label="Add at least one variable."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  data-stacked
                  class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                >
                  <div
                    data-stacked
                    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                  >
                    <div
                      class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                    >
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                      >
                        <span class="flex items-center gap-(--spacing-xs)">Scope</span>
                      </h2>
                      <Hint
                        text="Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Scope cannot be changed after the variable is created."
                        class="shrink-0"
                      />
                    </div>
                  </div>
                  <div
                    data-open
                    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                  >
                    <div class="min-w-0 data-collapsible:overflow-hidden">
                      <div
                        data-open
                        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                      >
                        <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                          <div
                            v-for="scope in scopes"
                            :key="scope.type"
                            class="flex min-w-0 flex-col gap-(--spacing-xs)"
                          >
                            <InputGroupRoot
                              size="large"
                              :required="scopeError(scope)"
                            >
                              <InputGroupAddon>
                                <span class="w-20">{{ scope.label }}</span>
                              </InputGroupAddon>
                              <span
                                v-if="scope.type === 'global'"
                                class="flex h-full min-w-0 flex-1 items-center bg-(--bg-canvas) px-(--spacing-md) text-label-sm text-(--text-default)"
                              >
                                The entire account
                              </span>
                              <div
                                v-else
                                class="h-full min-w-0 flex-1"
                              >
                                <MultiSelect
                                  v-model="scope.ids"
                                  size="large"
                                  :placeholder="scope.placeholder"
                                  :display-value="scopeDisplay(scope)"
                                  :disabled="!scope.enabled"
                                  :required="scopeError(scope)"
                                >
                                  <MultiSelect.Trigger
                                    :aria-label="scope.placeholder"
                                    :aria-describedby="
                                      scopeError(scope)
                                        ? formId + '-scope-' + scope.type
                                        : undefined
                                    "
                                  />
                                  <MultiSelect.Content>
                                    <template #search>
                                      <InputText
                                        v-model="scope.query"
                                        size="small"
                                        placeholder="Search"
                                        aria-label="Search"
                                        @keydown.stop
                                      >
                                        <template #iconLeft>
                                          <i
                                            class="pi pi-search"
                                            aria-hidden="true"
                                          />
                                        </template>
                                      </InputText>
                                    </template>
                                    <MultiSelect.Option
                                      v-for="option in visibleScopeOptions(scope)"
                                      :key="option.value"
                                      :value="option.value"
                                    >
                                      {{ option.label }}
                                    </MultiSelect.Option>
                                  </MultiSelect.Content>
                                </MultiSelect>
                              </div>
                              <InputGroupAddon>
                                <Switch
                                  :model-value="scope.enabled"
                                  :disabled="scope.type === 'global'"
                                  :aria-label="'Enable ' + scope.label + ' scope'"
                                  @update:model-value="(value) => setScopeEnabled(scope, value)"
                                />
                              </InputGroupAddon>
                            </InputGroupRoot>
                            <HelperText
                              v-if="scopeError(scope)"
                              :id="formId + '-scope-' + scope.type"
                              kind="required"
                              label="Select at least one resource for this scope."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
                <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
                <Button
                  label="Save"
                  kind="primary"
                  size="medium"
                  :loading="submitting"
                  type="submit"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
