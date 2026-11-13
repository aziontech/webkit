<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Textarea from '@aziontech/webkit/textarea'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  type ScopeRef = { type: string; id: string; name: string }
  type VariableSeed = {
    id: string
    key: string
    value: string
    secret: boolean
    scope: ScopeRef[]
    lastEditor: string
    lastEditorAvatar: string
    lastModified: string
  }
  type Variable = VariableSeed & { type: string }
  type VariableDraft = { key: string; value: string; secret: boolean; scope: ScopeRef[] }
  type Entry = { id: number; key: string; value: string; secret: boolean; visible: boolean }
  type EntryProblem = { kind: HelperTextKind; message: string }
  type Pair = { key: string; value: string }
  type ScopeOption = { value: string; label: string }
  type ScopeState = {
    type: string
    label: string
    plural: string
    placeholder: string
    enabled: boolean
    ids: string[]
    query: string
    options: ScopeOption[]
  }

  const columns: TableColumn[] = [
    { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'scope', header: 'Scope', minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]
  const seed: VariableSeed[] = [
    {
      id: 'v-001',
      key: 'API_BASE_URL',
      value: 'https://api.example.com',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Ethan Brooks',
      lastEditorAvatar: '',
      lastModified: '1 month ago'
    },
    {
      id: 'v-002',
      key: 'PAYMENT_SECRET_KEY',
      value: 'sk_live_51H8sX2eZv...',
      secret: true,
      scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
      lastEditor: 'Jordan Kim',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-003',
      key: 'FEATURE_FLAGS',
      value: 'checkout_v2,dark_mode',
      secret: false,
      scope: [{ type: 'service', id: '3344556677', name: 'storefront' }],
      lastEditor: 'Taylor Reed',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-004',
      key: 'DATABASE_PASSWORD',
      value: 'p4ssw0rd-r0t4t3d',
      secret: true,
      scope: [{ type: 'policy', id: '5540117', name: 'production-policy' }],
      lastEditor: 'John Smith',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-005',
      key: 'MAX_UPLOAD_MB',
      value: '25',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Sam Lee',
      lastEditorAvatar: '',
      lastModified: '3 months ago'
    }
  ]

  const authors = ['Ethan Brooks', 'Jordan Kim', 'Taylor Reed', 'John Smith', 'Sam Lee', 'myemail']
  const properties = [
    { key: 'key', label: 'Key' },
    { key: 'lastEditor', label: 'Author', options: authors.map((value) => ({ value })) },
    { key: 'type', label: 'Type', options: [{ value: 'Plain' }, { value: 'Secret' }] }
  ]
  const withType = (variable: VariableSeed): Variable => ({
    ...variable,
    type: variable.secret ? 'Secret' : 'Plain'
  })

  const variables = ref(seed.map(withType))
  const editing = ref<Variable | null>(null)
  const existingKeys = computed(() =>
    variables.value
      .filter((variable) => variable.id !== editing.value?.id)
      .map((variable) => variable.key)
  )

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: variables,
    columns,
    filtering: { fields: ['key', 'id', 'lastEditor', 'type'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'variables-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const loading = ref(false)
  const table = ref<TableExposed<Variable> | null>(null)
  const exportCsv = () => table.value?.exportCsv({ filename: 'variables.csv' })

  const refresh = () => {
    if (loading.value) return
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 600)
  }

  const displayValue = (row: Variable) => (row.secret ? SECRET_MASK : row.value)

  const scopeSummary = (scope: ScopeRef[] | undefined) =>
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

  let nextVariableId = seed.length
  const newVariableId = () => `v-${String((nextVariableId += 1)).padStart(3, '0')}`
  const touched = (
    variable: Omit<VariableSeed, 'lastEditor' | 'lastEditorAvatar' | 'lastModified'>
  ) =>
    withType({ ...variable, lastEditor: 'myemail', lastEditorAvatar: '', lastModified: 'just now' })

  const onCreated = (created: VariableDraft[]) => {
    variables.value = [
      ...created.map((variable) => touched({ ...variable, id: newVariableId() })),
      ...variables.value
    ]
  }

  const onUpdated = (id: string, [changed]: VariableDraft[]) => {
    variables.value = variables.value.map((variable) =>
      variable.id === id
        ? touched({
            ...variable,
            ...changed,
            value: changed.secret && !changed.value ? variable.value : changed.value
          })
        : variable
    )
  }

  const cloneKey = (key: string) => {
    const taken = new Set(variables.value.map((variable) => variable.key))
    let candidate = `${key}_COPY`
    let n = 1
    while (taken.has(candidate)) candidate = `${key}_COPY_${(n += 1)}`
    return candidate
  }

  const openCreate = () => {
    editing.value = null
    drawerOpen.value = true
  }

  const pending = ref<Variable | null>(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const canDelete = computed(
    () => Boolean(pending.value) && confirmation.value.trim() === pending.value?.key
  )
  const confirmDelete = () => {
    if (!canDelete.value) return
    variables.value = variables.value.filter((variable) => variable.id !== pending.value?.id)
    deleteOpen.value = false
  }

  const onRowAction = (value: DropdownMenuOptionValue, row: Variable) => {
    if (value === 'edit') {
      editing.value = row
      drawerOpen.value = true
      return
    }
    if (value === 'duplicate') {
      const index = variables.value.findIndex((variable) => variable.id === row.id)
      const copy = touched({ ...row, id: newVariableId(), key: cloneKey(row.key) })
      variables.value = [
        ...variables.value.slice(0, index + 1),
        copy,
        ...variables.value.slice(index + 1)
      ]
      return
    }
    if (value === 'delete') {
      pending.value = row
      confirmation.value = ''
      deleteOpen.value = true
    }
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
  const fieldId = (entry: Entry, part: string) => `${formId}-${part}-${entry.id}`
  const messageId = (entry: Entry, part: string) => `${fieldId(entry, part)}-message`

  let nextEntryId = 0
  const createEntry = (key = '', value = '', secret = false): Entry => ({
    id: (nextEntryId += 1),
    key,
    value,
    secret,
    visible: false
  })
  const isEmptyEntry = (entry: Entry) => !entry.key.trim() && !entry.value.trim()
  const formatKey = (value: string) => value.replace(/\s/g, '_').toUpperCase()

  const drawerOpen = ref(false)
  const submitting = ref(false)
  const submitted = ref(false)
  const entries = ref([createEntry()])
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)

  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))
  const keyCounts = computed(() =>
    filledEntries.value.reduce((counts, entry) => {
      const key = entry.key.trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map<string, number>())
  )
  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )

  const keyError = (entry: Entry): EntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return { kind: 'required', message: 'Key is required.' }
    if (!/^[A-Z0-9_]+$/.test(key))
      return { kind: 'invalid', message: 'Use only uppercase letters, numbers, and underscores.' }
    if ((keyCounts.value.get(key) ?? 0) > 1)
      return { kind: 'invalid', message: `Duplicated key: ${duplicatedKeys.value.join(', ')}` }
    if (existingKeys.value.includes(key))
      return { kind: 'invalid', message: `${key} already exists in this list.` }
    return null
  }
  const keepsSecret = (entry: Entry) =>
    Boolean(editing.value?.secret && entry.secret && entry.key.trim())
  const valueError = (entry: Entry): EntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry) || entry.value.trim() || keepsSecret(entry))
      return null
    return { kind: 'required', message: 'Value is required.' }
  }

  const noVariables = computed(() => filledEntries.value.length === 0)
  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )
  const drawerTitle = computed(() => (editing.value ? 'Edit Variable' : 'Create Variable'))
  const drawerDescription = computed(() => {
    if (!editing.value) return 'Create one or more variables and define where they are available.'
    if (editing.value.secret) return 'Leave the value empty to keep the saved secret.'
    return 'Change the key, value or scope of this variable.'
  })
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })
  const setKey = (entry: Entry, value: string) => {
    entry.key = formatKey(value)
  }

  const secretTooltip = (entry: Entry) =>
    entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretAriaLabel = (entry: Entry) => (entry.secret ? 'Unmark as secret' : 'Mark as secret')

  const unquote = (value: string) => {
    const quote = value[0]
    if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
      return value.slice(1, -1)
    }
    return value
  }
  const parseEnvFile = (content: string | undefined) => {
    const parsed: Pair[] = []
    const invalidLines: number[] = []
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
  const parseJsonObject = (content: string): Pair[] | null => {
    const parsed: unknown = JSON.parse(content)
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
  const parsePasted = (content: string | undefined) => {
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
  const toEntries = (pairs: Pair[], secrets = new Set<string>()) =>
    pairs.map((pair) => createEntry(pair.key, pair.value, secrets.has(pair.key)))

  const pasteIntoKey = (event: ClipboardEvent, index: number) => {
    if (!isEmptyEntry(entries.value[index])) return
    const pairs = parsePasted(event.clipboardData?.getData('text/plain'))
    if (!pairs) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }

  const onFilePicked = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const [file] = input.files ?? []
    input.value = ''
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
  const scopeOptions: Record<string, ScopeOption[]> = {
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
  const createScopes = (): ScopeState[] =>
    scopeTypes.map((scope) => ({
      ...scope,
      placeholder: scope.plural ? `Select ${scope.plural}` : '',
      enabled: scope.type === 'global',
      ids: [],
      query: '',
      options: scopeOptions[scope.type] ?? []
    }))
  const scopes = reactive(createScopes())

  const setScopeEnabled = (scope: ScopeState, enabled: boolean) => {
    if (scope.type === 'global') return
    scope.enabled = enabled
    scope.ids = enabled ? scope.options.map((option) => option.value) : []
    scope.query = ''
    scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
  }
  const scopeMissing = (scope: ScopeState) =>
    scope.enabled && scope.type !== 'global' && scope.ids.length === 0
  const scopeError = (scope: ScopeState) => submitted.value && scopeMissing(scope)
  const scopeDisplay = (scope: ScopeState) => (ids: unknown[]) => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
    return scope.options.find((option) => option.value === ids[0])?.label ?? String(ids[0])
  }
  const visibleScopeOptions = (scope: ScopeState) => {
    const query = scope.query.trim().toLowerCase()
    if (!query) return scope.options
    return scope.options.filter((option) => option.label.toLowerCase().includes(query))
  }
  const scopePayload = (): ScopeRef[] =>
    scopes.flatMap((scope) => {
      if (!scope.enabled) return []
      if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
      return scope.ids.map((id) => ({
        type: scope.type,
        id,
        name: scope.options.find((option) => option.value === id)?.label ?? id
      }))
    })

  const scopesFor = (scope: ScopeRef[]) =>
    createScopes().map((item) => {
      const ids = (scope ?? []).filter((entry) => entry.type === item.type).map((entry) => entry.id)
      return item.type === 'global'
        ? { ...item, enabled: ids.length > 0 }
        : { ...item, enabled: ids.length > 0, ids }
    })

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    const current = editing.value
    entries.value = current
      ? [createEntry(current.key, current.secret ? '' : current.value, current.secret)]
      : [createEntry()]
    view.value = 'Form'
    jsonText.value = '{}'
    jsonError.value = ''
    submitted.value = false
    Object.assign(scopes, current ? scopesFor(current.scope) : createScopes())
    submitting.value = false
  })

  const formEl = ref<HTMLFormElement | null>(null)
  const submit = async () => {
    if (submitting.value) return
    if (view.value === 'JSON') {
      if (jsonError.value) return
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (!isValid.value || scopes.some(scopeMissing)) {
      await nextTick()
      formEl.value
        ?.querySelector<HTMLElement>(
          ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'
        )
        ?.focus()
      return
    }
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const scope = scopePayload()
    const created = filledEntries.value.map((entry) => ({
      key: entry.key.trim(),
      value: entry.value,
      secret: entry.secret,
      scope
    }))
    if (editing.value) onUpdated(editing.value.id, created)
    else onCreated(created)
    editing.value = null
    submitting.value = false
    drawerOpen.value = false
  }
</script>

<template>
  <div class="layout-column layout-boundary flex flex-col">
    <PageHeader
      title="Variables"
      description="Configure variable names, values, and settings for use across your projects."
    >
      <template #actions>
        <Button
          label="Documentation"
          icon="pi pi-book"
          kind="outlined"
          href="https://example.com/docs/variables"
          target="_blank"
          size="medium"
        />
        <Button
          label="Create Variable"
          icon="pi pi-plus"
          kind="primary"
          size="large"
          @click="openCreate"
        />
      </template>
    </PageHeader>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header class="flex items-start gap-(--layout-group-gap)">
          <div class="flex min-w-0 grow">
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Filter variables"
              aria-label="Filter variables"
            />
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
                aria-label="Refresh"
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
                :disabled="!matchingItems.length"
                aria-label="Download CSV"
                @click="exportCsv"
              />
            </Tooltip>
            <CollectionPreferences
              v-bind="preferencesProps"
              title="Table preferences"
            />
          </div>
        </header>

        <section class="flex min-h-0 flex-col">
          <Card
            v-if="status === 'empty'"
            key="first-use"
            :padded="false"
          >
            <template #content>
              <EmptyState
                size="medium"
                icon="pi pi-key"
                title="No variables yet"
                description="Create a variable to store a value your services read at runtime."
              >
                <template #actions>
                  <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                    <Button
                      label="Create Variable"
                      icon="pi pi-plus"
                      kind="secondary"
                      size="small"
                      @click="openCreate"
                    />
                    <Button
                      label="Documentation"
                      icon="pi pi-book"
                      kind="outlined"
                      size="small"
                      href="https://example.com/docs/variables"
                      target="_blank"
                    />
                  </div>
                </template>
              </EmptyState>
            </template>
          </Card>
          <Card
            v-else
            key="table"
            :padded="false"
          >
            <template #content>
              <TableRoot
                ref="table"
                v-bind="tableProps"
                :loading="loading || fetching"
                enable-sorting
                :bordered="false"
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
                  <Table.CellId
                    :value="value"
                    resource="variable"
                  />
                </template>

                <template #cell-value="{ row }">
                  <Table.CellLink
                    :label="displayValue(row)"
                    :copyable="!row.secret"
                    :copy-value="row.value"
                  />
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

                <template #cell-actions="{ row }">
                  <Table.CellActions
                    :name="row.key"
                    @select="(_event, value) => onRowAction(value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="edit"
                        label="Edit"
                      >
                        <template #left>
                          <i
                            class="pi pi-pencil"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                      <DropdownMenu.Option
                        value="duplicate"
                        label="Clone"
                      >
                        <template #left>
                          <i
                            class="pi pi-clone"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                    </DropdownMenu.Group>

                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="delete"
                        label="Delete"
                      >
                        <template #left>
                          <i
                            class="pi pi-trash"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                    </DropdownMenu.Group>
                  </Table.CellActions>
                </template>

                <template #empty>
                  <EmptyState
                    size="medium"
                    icon="pi pi-filter-slash"
                    title="No matching variables"
                    description="No variable matches these filters."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        kind="outlined"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>
                </template>
              </TableRoot>
            </template>
          </Card>
        </section>
      </section>
    </section>

    <Drawer
      v-model:open="drawerOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            ref="formEl"
            class="flex min-h-0 flex-1 flex-col"
            :aria-label="drawerTitle"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  {{ drawerDescription }}
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">{{ drawerTitle }}</legend>
                <SettingsSection
                  title="Variables"
                  hint="Store values your services read at runtime. Add one row per variable, or import a .env file."
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                    <div
                      v-if="!editing"
                      class="flex items-center gap-(--spacing-xs) self-end"
                    >
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
                      <ToggleGroup
                        v-model="view"
                        :options="VIEW_OPTIONS"
                        aria-label="Variables view"
                        size="medium"
                      />
                    </div>

                    <template v-if="view === 'Form'">
                      <AttributeEditor
                        v-model:items="entries"
                        :new-item="createEntry"
                        :min-items="1"
                        :limit="editing ? 1 : undefined"
                        :add-disabled="!canAdd"
                        add-button-label="Add variable"
                        remove-button-label="Remove variable"
                        aria-label="Variables"
                      >
                        <template #row="{ index, remove, removable, removeLabel }">
                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                            <Field>
                              <InputGroupRoot
                                size="large"
                                :required="keyError(entries[index])?.kind === 'required'"
                                :invalid="keyError(entries[index])?.kind === 'invalid'"
                              >
                                <InputGroupAddon>
                                  <span class="inline-block w-20">
                                    <Field.Label :for="fieldId(entries[index], 'key')"
                                      >Key</Field.Label
                                    >
                                  </span>
                                </InputGroupAddon>
                                <input
                                  :id="fieldId(entries[index], 'key')"
                                  :value="entries[index].key"
                                  placeholder="MY_VARIABLE"
                                  autocomplete="off"
                                  spellcheck="false"
                                  :aria-invalid="!!keyError(entries[index]) || undefined"
                                  :aria-describedby="
                                    keyError(entries[index])
                                      ? messageId(entries[index], 'key')
                                      : undefined
                                  "
                                  :class="fieldClass"
                                  class="text-label-code-sm"
                                  @input="
                                    setKey(
                                      entries[index],
                                      ($event.target as HTMLInputElement).value
                                    )
                                  "
                                  @paste="pasteIntoKey($event, index)"
                                />
                                <Tooltip
                                  v-if="removable"
                                  text="Remove variable"
                                >
                                  <IconButton
                                    icon="pi pi-trash"
                                    kind="outlined"
                                    size="large"
                                    :aria-label="removeLabel"
                                    @click="remove"
                                  />
                                </Tooltip>
                              </InputGroupRoot>
                            </Field>

                            <Field>
                              <InputGroupRoot
                                size="large"
                                :required="!!valueError(entries[index])"
                              >
                                <InputGroupAddon>
                                  <span class="inline-block w-20">
                                    <Field.Label :for="fieldId(entries[index], 'value')"
                                      >Value</Field.Label
                                    >
                                  </span>
                                </InputGroupAddon>
                                <input
                                  :id="fieldId(entries[index], 'value')"
                                  v-model="entries[index].value"
                                  :type="
                                    entries[index].secret && !entries[index].visible
                                      ? 'password'
                                      : 'text'
                                  "
                                  :placeholder="
                                    entries[index].secret ? SECRET_MASK : 'my-variable-value'
                                  "
                                  autocomplete="off"
                                  spellcheck="false"
                                  :aria-invalid="!!valueError(entries[index]) || undefined"
                                  :aria-describedby="
                                    valueError(entries[index])
                                      ? messageId(entries[index], 'value')
                                      : undefined
                                  "
                                  :class="fieldClass"
                                  class="text-label-sm"
                                />
                                <Tooltip
                                  v-if="entries[index].secret"
                                  :text="entries[index].visible ? 'Hide value' : 'Show value'"
                                >
                                  <IconButton
                                    :icon="entries[index].visible ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                    kind="outlined"
                                    size="large"
                                    :aria-label="
                                      entries[index].visible ? 'Hide value' : 'Show value'
                                    "
                                    :aria-pressed="entries[index].visible"
                                    @click="entries[index].visible = !entries[index].visible"
                                  />
                                </Tooltip>
                                <InputGroupAddon>
                                  <Tooltip :text="secretTooltip(entries[index])">
                                    <Field
                                      orientation="horizontal"
                                      :disabled="Boolean(editing?.secret)"
                                    >
                                      <Field.Label :for="fieldId(entries[index], 'secret')"
                                        >Secret</Field.Label
                                      >
                                      <Checkbox
                                        v-model="entries[index].secret"
                                        binary
                                        :input-id="fieldId(entries[index], 'secret')"
                                        :aria-label="secretAriaLabel(entries[index])"
                                      />
                                    </Field>
                                  </Tooltip>
                                </InputGroupAddon>
                              </InputGroupRoot>
                            </Field>
                          </div>

                          <HelperText
                            v-if="keyError(entries[index])"
                            :id="messageId(entries[index], 'key')"
                            :kind="keyError(entries[index])?.kind"
                            :label="keyError(entries[index])?.message"
                          />
                          <HelperText
                            key="helper-text-2"
                            v-if="valueError(entries[index])"
                            :id="messageId(entries[index], 'value')"
                            :kind="valueError(entries[index])?.kind"
                            :label="valueError(entries[index])?.message"
                          />
                        </template>
                        <template #limit>Edit one variable at a time.</template>
                        <template #info>
                          <HelperText
                            v-if="!editing"
                            label="Paste JSON or .env contents into an empty key field to create one row per variable."
                          />
                        </template>
                      </AttributeEditor>
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
                        <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
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
                </SettingsSection>

                <SettingsSection
                  title="Scope"
                  hint="Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Scope cannot be changed after the variable is created."
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
                                scopeError(scope) ? formId + '-scope-' + scope.type : undefined
                              "
                            />
                            <MultiSelect.Content>
                              <template #search>
                                <Input
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
                                </Input>
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
                </SettingsSection>
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

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete variable"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected variable will be deleted, and services in its scope stop reading it on their
          next deployment.
        </p>
        <p
          :id="confirmLabelId"
          class="m-0 text-body-sm text-(--text-default)"
        >
          Type <code class="text-label-code-sm">{{ pending?.key }}</code> to confirm.
        </p>
        <Input
          v-model="confirmation"
          :aria-labelledby="confirmLabelId"
          autocomplete="off"
          class="w-full"
          @keydown.enter="confirmDelete"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          kind="outlined"
          size="medium"
          @click="close"
        />
        <Button
          label="Delete variable"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
