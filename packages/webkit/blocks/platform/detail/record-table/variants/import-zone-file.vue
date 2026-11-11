<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import Card from '@aziontech/webkit/card'
  import Chip from '@aziontech/webkit/chip'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, reactive, ref, useId, watch } from 'vue'

  const activeTab = ref('records')

  const zone = { name: 'main-zone', domain: 'example.com' }

  const tabs = [
    { value: 'main-settings', label: 'Main settings' },
    { value: 'records', label: 'Records' }
  ]

  const nameservers = ['ns1.example.net', 'ns2.example.com', 'ns3.example.org']

  const dnssecKeys = [
    {
      label: 'Key tag',
      value: '34505',
      description:
        'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
    },
    {
      label: 'Algorithm',
      value: '13 (ECDSA Curve P-256 with SHA-256)',
      description: 'Specifies the algorithm used to generate the DNSSEC key.'
    },
    {
      label: 'Digest type',
      value: '2 (SHA-256)',
      description: 'Indicates the hash function used for the DNSSEC digest.'
    },
    {
      label: 'Digest',
      value: '8A9E1F2C3B4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F',
      description:
        'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
    }
  ]

  const errors = reactive({ name: '', domain: '' })
  const settings = reactive({ name: zone.name, domain: zone.domain, dnssec: true, active: true })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(settings))
  const dirty = computed(() => JSON.stringify(settings) !== baseline.value)
  const nameMessageId = useId()
  const domainMessageId = useId()
  const nameserverMessageId = useId()

  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }

  const save = () => {
    if (saving.value || !validate()) return
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(settings)
      saving.value = false
    }, 900)
  }

  const discard = () => {
    Object.assign(settings, JSON.parse(baseline.value))
    errors.name = ''
    errors.domain = ''
  }

  const POLICY_TYPES = [
    { value: 'simple', label: 'Simple' },
    { value: 'weighted', label: 'Weighted' }
  ]

  const policyLabel = (value) => POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''

  const filterFields = [
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value, label: value })),
      match: (record, values) => values.includes(record.type)
    },
    {
      id: 'policy',
      label: 'Policy',
      kind: 'options',
      options: POLICY_TYPES,
      match: (record, values) => values.includes(record.policy)
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: 80 },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: 104 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'ttl', header: 'TTL (seconds)', enableSorting: true, minWidth: 80 },
    { accessorKey: 'policy', header: 'Policy', minWidth: 80 },
    { accessorKey: 'weight', header: 'Weight', minWidth: 80 },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const rows = ref([
    {
      id: '423916',
      name: 'www',
      type: 'A',
      value: '192.0.2.1',
      ttl: 3600,
      policy: 'simple',
      weight: 255,
      description: 'Points www at the origin server.'
    }
  ])

  const search = ref('')

  const filters = ref({})
  const filterOpen = ref(false)
  const activeId = ref(null)
  const customId = ref(null)
  const calendarOpen = ref(false)
  const customRange = ref(null)
  const query = ref('')
  const direction = ref('forward')
  const filterPanel = ref(null)
  let requestedId = null

  const isApplied = (field) => Boolean(filters.value[field.id]?.length)
  const appliedFilters = computed(() => filterFields.filter(isApplied))
  const appliedCount = computed(() => appliedFilters.value.length)
  const summarize = (field) => {
    const values = filters.value[field.id] ?? []
    if (!values.length) return null
    const first = field.options.find((option) => option.value === values[0])
    return { label: first ? first.label : field.formatValue(values[0]), extra: values.length - 1 }
  }
  const summarizeText = (field) => {
    const parts = summarize(field)
    if (!parts) return ''
    return parts.extra ? `${parts.label} +${parts.extra}` : parts.label
  }
  const avatarsOf = (field) =>
    field.options
      .filter(
        (option) => 'avatar' in option && (filters.value[field.id] ?? []).includes(option.value)
      )
      .slice(0, 3)

  const customField = computed(() => filterFields.find((field) => field.id === customId.value))
  const activeField = computed(
    () => filterFields.find((field) => field.id === activeId.value) ?? customField.value
  )
  const levelKey = computed(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })
  const filterRows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const source = activeField.value ? activeField.value.options : filterFields
    return term ? source.filter((row) => row.label.toLowerCase().includes(term)) : source
  })
  const isPicked = (value) => (filters.value[activeId.value] ?? []).includes(value)

  watch(filterOpen, (open) => {
    if (!open) return
    activeId.value = requestedId
    requestedId = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
  })

  const toLevel = (dir, mutate) => {
    direction.value = dir
    mutate()
  }
  const enter = (fieldId) => {
    if (!filterOpen.value) {
      requestedId = fieldId
      filterOpen.value = true
      return
    }
    toLevel('forward', () => {
      activeId.value = fieldId
      query.value = ''
    })
  }
  const back = () =>
    toLevel('back', () => {
      activeId.value = null
      query.value = ''
    })
  const pick = (field, option) => {
    if (option.custom) {
      toLevel('forward', () => {
        customId.value = field.id
      })
      calendarOpen.value = true
      return
    }
    const current = filters.value[field.id] ?? []
    const next =
      field.kind === 'range'
        ? current[0] === option.value
          ? []
          : [option.value]
        : current.includes(option.value)
          ? current.filter((item) => item !== option.value)
          : [...current, option.value]
    filters.value = { ...filters.value, [field.id]: next }
    if (field.kind === 'range') back()
  }
  const leaveCustom = () => {
    calendarOpen.value = false
    customRange.value = null
    toLevel('back', () => {
      customId.value = null
    })
  }
  const commitCustom = (range) => {
    const field = customField.value
    if (!field) return
    const next = { ...filters.value }
    if (range?.start || range?.end) next[field.id] = [range]
    else delete next[field.id]
    filters.value = next
    leaveCustom()
    back()
    filterOpen.value = false
  }
  const clearFilter = (field) => {
    const next = { ...filters.value }
    delete next[field.id]
    filters.value = next
  }
  const levelRows = () => [
    ...(filterPanel.value?.querySelectorAll(`[data-level="${levelKey.value}"] [data-filter-row]`) ??
      [])
  ]
  const move = (event, step) => {
    const items = levelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target)
    items[(index + step + items.length) % items.length]?.focus()
  }
  watch(levelKey, async () => {
    await nextTick()
    levelRows()[0]?.focus()
  })

  const loading = ref(false)
  let refreshTimer
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const listedColumns = columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.id ?? column.accessorKey,
      label: column.label ?? column.header,
      locked: column.hideable === false
    }))
  const columnsOpen = ref(false)
  const columnsTipOpen = ref(false)
  watch(columnsOpen, (open) => {
    if (open) columnsTipOpen.value = false
  })
  const columnVisibility = ref({ id: false })
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

  const tableRef = ref(null)
  const pagination = ref({ pageIndex: 0, pageSize: 8 })
  const visibleRows = computed(() =>
    rows.value.filter((row) =>
      filterFields.every((field) => {
        const values = filters.value[field.id]
        return !values?.length || field.match(row, values)
      })
    )
  )
  watch(filters, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const SUPPORTED = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA', 'SRV', 'NS', 'PTR']

  const stripComment = (line) => {
    let quoted = false
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index]
      if (char === '"') quoted = !quoted
      else if (char === ';' && !quoted) return line.slice(0, index)
    }
    return line
  }
  const unroot = (name) => (name.length > 1 && name.endsWith('.') ? name.slice(0, -1) : name)
  const readTtl = (token) => {
    if (/^\d+$/.test(token)) return Number(token)
    const match = /^(\d+)([smhdw])$/i.exec(token)
    if (!match) return null
    return Number(match[1]) * { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }[match[2].toLowerCase()]
  }
  const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/
  const checkValue = (type, value) => {
    if (!value) return 'The record has no value.'
    if (type === 'A' && !IPV4.test(value)) return `${value} is not an IPv4 address.`
    if (type === 'AAAA' && !value.includes(':')) return `${value} is not an IPv6 address.`
    if (type === 'MX' && !/^\d+\s+\S+$/.test(value)) return 'MX needs a priority and a host.'
    return ''
  }

  const parseZoneFile = (text) => {
    const lines = []
    let origin = ''
    let defaultTtl = 3600
    let lastName = '@'
    let skipping = 0
    text.split(/\r?\n/).forEach((rawLine, position) => {
      const line = stripComment(rawLine)
      const number = position + 1
      if (!line.trim()) return
      if (skipping > 0) {
        skipping += (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
        return
      }
      const tokens = line.trim().split(/\s+/)
      const directive = tokens[0].toUpperCase()
      if (directive === '$ORIGIN') {
        origin = unroot(tokens[1] ?? '')
        return
      }
      if (directive === '$TTL') {
        const ttl = readTtl(tokens[1] ?? '')
        if (ttl === null) {
          lines.push({
            line: number,
            status: 'error',
            reason: `$TTL ${tokens[1] ?? ''} is not a time.`
          })
        } else defaultTtl = ttl
        return
      }
      if (directive.startsWith('$')) return
      let index = 0
      let name = lastName
      if (!/^\s/.test(line)) {
        name = tokens[0]
        index = 1
      }
      lastName = name
      let ttl = defaultTtl
      for (let guard = 0; guard < 2 && index < tokens.length; guard += 1) {
        const parsed = readTtl(tokens[index])
        if (parsed !== null) {
          ttl = parsed
          index += 1
        } else if (/^(IN|CH|HS)$/i.test(tokens[index])) index += 1
        else break
      }
      const type = (tokens[index] ?? '').toUpperCase()
      const rest = tokens.slice(index + 1)
      const unrooted = unroot(name)
      const relative =
        unrooted === '@' || (origin && unrooted === origin)
          ? '@'
          : origin && unrooted.endsWith(`.${origin}`)
            ? unrooted.slice(0, -(origin.length + 1))
            : unrooted
      if (type === 'SOA') {
        skipping = (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
        lines.push({
          line: number,
          name: relative,
          type,
          status: 'skipped',
          reason: 'The zone keeps its own SOA.'
        })
        return
      }
      if (!SUPPORTED.includes(type)) {
        lines.push({
          line: number,
          name: relative,
          type: type || '—',
          status: type ? 'skipped' : 'error',
          reason: type ? `${type} records are not supported.` : 'No record type on this line.'
        })
        return
      }
      if (type === 'NS' && relative === '@') {
        lines.push({
          line: number,
          name: relative,
          type,
          status: 'skipped',
          reason: 'The zone answers with its own nameservers.'
        })
        return
      }
      const value =
        type === 'TXT'
          ? (rest.join(' ').match(/"([^"]*)"/g) ?? [rest.join(' ')])
              .map((part) => part.replace(/^"|"$/g, ''))
              .join('')
          : rest.map(unroot).join(' ')
      const problem = checkValue(type, value)
      lines.push({
        line: number,
        name: relative,
        type,
        ttl,
        value,
        status: problem ? 'error' : 'ready',
        reason: problem
      })
    })
    return { origin, lines }
  }

  const SAMPLE_ZONE = `$ORIGIN example.com.
$TTL 1h
@       IN SOA ns1.example.net. admin.example.com. ( 2026111101 7200 3600 1209600 3600 )
@       IN NS  ns1.example.net.
@       IN A   192.0.2.10
www     IN CNAME example.com.
api 300 IN A   192.0.2.300
mail    IN MX  10 mx.example.net.
@       IN TXT "v=spf1 include:_spf.example.net ~all"
ipv6    IN AAAA 2001:db8::10
legacy  IN HINFO "PC" "Linux"`

  const importOpen = ref(true)
  const zoneText = ref(SAMPLE_ZONE)
  const zoneSource = ref('the pasted zone file')
  const fileInput = ref(null)
  const dropError = ref('')
  const parsed = computed(() => parseZoneFile(zoneText.value))
  const readyLines = computed(() => parsed.value.lines.filter((entry) => entry.status === 'ready'))
  const errorLines = computed(() => parsed.value.lines.filter((entry) => entry.status === 'error'))
  const skippedLines = computed(() =>
    parsed.value.lines.filter((entry) => entry.status === 'skipped')
  )
  const previewColumns = [
    { accessorKey: 'line', header: 'Line', minWidth: 64 },
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'type', header: 'Type', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'status', header: 'Status', minWidth: 104 }
  ]
  const statusTag = {
    ready: { label: 'Ready', severity: 'success' },
    skipped: { label: 'Skipped', severity: 'secondary' },
    error: { label: 'Error', severity: 'danger' }
  }

  const readFile = async (file) => {
    if (!file) return
    dropError.value = ''
    const text = await file.text()
    if (!parseZoneFile(text).lines.length) {
      dropError.value = `No records found in ${file.name}. Expected a zone file in BIND format, like www IN CNAME example.com.`
      return
    }
    zoneText.value = text
    zoneSource.value = file.name
  }
  const onDrop = (event, files) => readFile(files[0])
  const onReject = () => {
    dropError.value = 'Drop one text file, such as example.com.zone or zone.txt.'
  }
  const onPicked = (event) => {
    readFile(event.target.files?.[0])
    event.target.value = ''
  }
  const onPaste = () => {
    zoneSource.value = 'the pasted zone file'
  }

  const importing = ref(false)
  let importTimer
  const runImport = () => {
    if (!readyLines.value.length) return
    importing.value = true
    clearTimeout(importTimer)
    importTimer = setTimeout(() => {
      const added = readyLines.value.map((entry, offset) => ({
        id: String(424000 + rows.value.length + offset),
        name: entry.name,
        type: entry.type,
        value: entry.value,
        ttl: entry.ttl,
        policy: 'simple',
        weight: null,
        description: ''
      }))
      rows.value = [...rows.value, ...added]
      importing.value = false
      importOpen.value = false
      const left = errorLines.value.length
      toast.success(
        added.length === 1
          ? `Imported 1 record from ${zoneSource.value}.`
          : `Imported ${added.length} records from ${zoneSource.value}.`,
        {
          description: left
            ? `${left} ${left === 1 ? 'line was' : 'lines were'} left out. Fix them in the file and import it again.`
            : 'The zone answers with them now.'
        }
      )
    }, 700)
  }
  onBeforeUnmount(() => clearTimeout(importTimer))
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex h-full min-h-0 flex-col">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>

      <section
        v-if="activeTab === 'main-settings'"
        class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
      >
        <form
          class="flex min-h-full min-w-0 flex-col"
          aria-label="Zone settings"
          novalidate
          @submit.prevent="save"
        >
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Zone settings</legend>
                <SettingsSection
                  title="General"
                  hint="How this zone is identified across the platform."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Name"
                          description="Give a unique and descriptive name to identify your zone."
                        >
                          <Input
                            v-model="settings.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            autocomplete="off"
                            :required="!!errors.name"
                            :aria-describedby="errors.name ? nameMessageId : undefined"
                            :disabled="saving"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText
                            v-if="errors.name"
                            :id="nameMessageId"
                            kind="required"
                            :label="errors.name"
                          />
                        </SettingRow>

                        <SettingRow
                          title="Domain name"
                          description="Provide the domain name you want to host. Example: example.com."
                        >
                          <Input
                            v-model="settings.domain"
                            size="large"
                            class="w-full"
                            aria-label="Domain name"
                            autocomplete="off"
                            :required="!!errors.domain"
                            :aria-describedby="errors.domain ? domainMessageId : undefined"
                            :disabled="saving"
                            @update:model-value="errors.domain = ''"
                          />
                          <HelperText
                            v-if="errors.domain"
                            :id="domainMessageId"
                            kind="required"
                            :label="errors.domain"
                          />
                        </SettingRow>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Configure your nameserver"
                  hint="Make this zone the authoritative DNS for the domain."
                  anchor="configure-your-nameserver"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Nameservers"
                          description="Make this zone the authoritative DNS for the domain by copying the nameserver values."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <InputGroupRoot
                              v-for="(ns, index) in nameservers"
                              :key="ns"
                            >
                              <div class="flex flex-1 font-code">
                                <Input
                                  :model-value="ns"
                                  size="large"
                                  class="w-full"
                                  :aria-label="'Nameserver ' + (index + 1)"
                                  readonly
                                />
                              </div>
                              <CopyButton
                                kind="transparent"
                                :value="ns"
                                :aria-label="'Copy nameserver ' + (index + 1)"
                              />
                            </InputGroupRoot>
                          </div>
                          <HelperText
                            :id="nameserverMessageId"
                            kind="helper"
                            label="Add the nameservers in your domain provider."
                          />
                        </SettingRow>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="DNSSEC"
                  hint="Signs the zone so resolvers can detect spoofed answers."
                  anchor="dnssec"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Enable DNSSEC"
                          description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the key tag and digest values in your domain provider to complete the setup."
                          kind="compact"
                        >
                          <Switch
                            v-model="settings.dnssec"
                            aria-label="Enable DNSSEC"
                            :disabled="saving"
                          />
                        </SettingRow>

                        <template v-if="settings.dnssec">
                          <SettingRow
                            v-for="key in dnssecKeys"
                            :key="key.label"
                            :title="key.label"
                            :description="key.description"
                          >
                            <InputGroupRoot class="w-full">
                              <div class="flex flex-1 font-code">
                                <Input
                                  :model-value="key.value"
                                  size="large"
                                  class="w-full"
                                  :aria-label="key.label"
                                  readonly
                                />
                              </div>
                              <CopyButton
                                kind="transparent"
                                :value="key.value"
                                :aria-label="'Copy ' + key.label"
                              />
                            </InputGroupRoot>
                          </SettingRow>
                        </template>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Status"
                  hint="A zone can be held inactive while its records are being built."
                  anchor="status"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Active"
                          description="When active, the zone answers authoritative DNS queries for the domain."
                          kind="compact"
                        >
                          <Switch
                            v-model="settings.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>
              </fieldset>
            </section>
          </div>
          <Transition
            enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="translate-y-2 opacity-0"
          >
            <SaveBar
              v-if="dirty || saving"
              kind="docked"
            >
              You have unsaved changes.

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
                  type="submit"
                  label="Save"
                  kind="primary"
                  size="medium"
                  :loading="saving"
                />
              </template>
            </SaveBar>
          </Transition>
        </form>
      </section>

      <section
        v-else
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
      >
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <PageHeader
            title="Records"
            description="The authoritative records this zone answers with."
            size="small"
          >
            <template #actions>
              <Button
                label="Documentation"
                icon="pi pi-book"
                kind="outlined"
                size="medium"
                href="https://example.com/docs/records"
                target="_blank"
              />
              <Button
                label="Import zone file"
                icon="pi pi-file-import"
                kind="outlined"
                size="medium"
                @click="importOpen = true"
              />
              <Button
                label="Add Record"
                icon="pi pi-plus"
                kind="outlined"
                size="medium"
              />
            </template>
          </PageHeader>
          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-center gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
                  <div class="flex shrink-0 items-center">
                    <PopoverRoot
                      v-model:open="filterOpen"
                      placement="bottom-start"
                      :dismissible="!calendarOpen"
                      class="shrink-0"
                    >
                      <div class="relative">
                        <PopoverTrigger>
                          <Button
                            label="Filter"
                            kind="outlined"
                            size="medium"
                            icon="pi pi-filter"
                          />
                          <Transition
                            enter-from-class="scale-75 opacity-0"
                            enter-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                            leave-to-class="scale-75 opacity-0"
                            leave-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                          >
                            <div
                              v-if="appliedCount"
                              class="pointer-events-none absolute -top-2 -end-2 min-w-5"
                            >
                              <Badge
                                :label="String(appliedCount)"
                                severity="primary"
                                size="small"
                                aria-hidden="true"
                                class="w-full"
                              />
                            </div>
                          </Transition>
                        </PopoverTrigger>
                      </div>
                      <PopoverContent>
                        <div
                          ref="filterPanel"
                          class="flex flex-col"
                          @keydown.down="move($event, 1)"
                          @keydown.up="move($event, -1)"
                        >
                          <div class="relative overflow-hidden">
                            <Transition
                              :enter-from-class="
                                direction === 'forward'
                                  ? 'translate-x-[12%] opacity-0'
                                  : 'translate-x-[-12%] opacity-0'
                              "
                              enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                              :leave-to-class="
                                direction === 'forward'
                                  ? 'translate-x-[-12%] opacity-0'
                                  : 'translate-x-[12%] opacity-0'
                              "
                              leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                            >
                              <div
                                :key="levelKey"
                                :data-level="levelKey"
                                class="flex flex-col"
                              >
                                <div
                                  v-if="activeField"
                                  class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)"
                                >
                                  <IconButton
                                    icon="pi pi-angle-left"
                                    kind="outlined"
                                    size="small"
                                    :aria-label="
                                      customField ? 'Back to date periods' : 'Back to all filters'
                                    "
                                    @click="customField ? leaveCustom() : back()"
                                  />
                                  <span class="truncate text-label-sm text-(--text-default)">{{
                                    activeField.label
                                  }}</span>
                                </div>

                                <div
                                  v-if="customField"
                                  class="px-(--spacing-md) py-(--spacing-sm)"
                                >
                                  <CalendarRoot
                                    v-model="customRange"
                                    v-model:open="calendarOpen"
                                    mode="range"
                                    size="medium"
                                    :show-fields="false"
                                    placeholder="Select a range"
                                    class="w-full"
                                    @update:model-value="commitCustom"
                                  />
                                </div>

                                <template v-else>
                                  <div class="border-b border-(--border-default) p-(--spacing-xs)">
                                    <Input
                                      v-model="query"
                                      size="medium"
                                      class="w-full"
                                      :placeholder="
                                        activeField
                                          ? 'Search ' + activeField.label.toLowerCase()
                                          : 'Search fields'
                                      "
                                      :aria-label="
                                        activeField
                                          ? 'Search ' + activeField.label + ' values'
                                          : 'Search filter fields'
                                      "
                                    >
                                      <template #iconLeft>
                                        <i
                                          class="pi pi-search"
                                          aria-hidden="true"
                                        />
                                      </template>
                                    </Input>
                                  </div>

                                  <div
                                    class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)"
                                  >
                                    <template v-if="!activeField">
                                      <button
                                        v-for="field in filterRows"
                                        :key="field.id"
                                        type="button"
                                        data-filter-row
                                        class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                        :aria-expanded="false"
                                        @click="enter(field.id)"
                                      >
                                        <span class="grow truncate">{{ field.label }}</span>
                                        <span
                                          v-if="isApplied(field)"
                                          class="truncate text-(--text-muted)"
                                          >{{ summarizeText(field) }}</span
                                        >
                                        <i
                                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </template>

                                    <template v-else>
                                      <button
                                        v-for="option in filterRows"
                                        :key="String(option.value)"
                                        type="button"
                                        data-filter-row
                                        :role="
                                          option.custom
                                            ? undefined
                                            : activeField.kind === 'range'
                                              ? 'menuitemradio'
                                              : 'menuitemcheckbox'
                                        "
                                        :aria-checked="
                                          option.custom ? undefined : isPicked(option.value)
                                        "
                                        class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                        @click="pick(activeField, option)"
                                      >
                                        <Avatar
                                          v-if="'avatar' in option"
                                          :src="option.avatar || undefined"
                                          :alt="option.label"
                                          :label="option.label"
                                          size="small"
                                          kind="square"
                                          class="shrink-0"
                                        />
                                        <span class="grow truncate">{{ option.label }}</span>
                                        <i
                                          v-if="option.custom"
                                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                          aria-hidden="true"
                                        />
                                        <i
                                          v-else
                                          class="pi pi-check shrink-0 text-(--text-default)"
                                          :class="isPicked(option.value) ? '' : 'invisible'"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </template>

                                    <p
                                      v-if="!filterRows.length"
                                      class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                                    >
                                      No match for “{{ query }}”.
                                    </p>
                                  </div>

                                  <div
                                    v-if="activeField && isApplied(activeField)"
                                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                                  >
                                    <button
                                      type="button"
                                      class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                      @click="clearFilter(activeField)"
                                    >
                                      <i
                                        class="pi pi-filter-slash text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                      Clear {{ activeField.label }}
                                    </button>
                                  </div>
                                </template>
                              </div>
                            </Transition>
                          </div>
                        </div>
                      </PopoverContent>
                    </PopoverRoot>
                  </div>
                  <div class="flex min-w-36 grow basis-(--container-2xs)">
                    <Input
                      v-model="search"
                      size="medium"
                      placeholder="Search records"
                      aria-label="Search records"
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
                      :disabled="!tableRef"
                      aria-label="Download CSV"
                      @click="tableRef?.exportCsv({ filename: 'records.csv' })"
                    />
                  </Tooltip>
                  <PopoverRoot
                    v-model:open="columnsOpen"
                    placement="bottom-end"
                    class="shrink-0"
                  >
                    <PopoverTrigger>
                      <Tooltip
                        v-model:open="columnsTipOpen"
                        text="Columns"
                        :disabled="columnsOpen"
                      >
                        <IconButton
                          icon="ai ai-column"
                          kind="outlined"
                          size="medium"
                          aria-label="Columns"
                        />
                      </Tooltip>
                    </PopoverTrigger>
                    <PopoverContent>
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
                            class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
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
                              class="ms-auto shrink-0 text-label-xs text-(--text-muted)"
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
                            kind="transparent"
                            size="small"
                            class="w-full"
                            @click="showAll"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </PopoverRoot>
                </div>
              </header>
              <div
                v-if="appliedFilters.length"
                class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
              >
                <TransitionGroup
                  move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  enter-from-class="scale-90 opacity-0"
                  leave-from-class="scale-100 opacity-100"
                  leave-to-class="scale-90 opacity-0"
                  leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                >
                  <span
                    v-for="field in appliedFilters"
                    :key="field.id"
                    class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  >
                    <Chip
                      :data-filter-chip="field.id"
                      :label="field.label"
                      kind="filled"
                      size="medium"
                      clickable
                      removable
                      @click="enter(field.id)"
                      @remove="clearFilter(field)"
                    >
                      <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                        <span class="truncate text-(--text-muted)">{{ field.label }}</span>
                        <span
                          v-if="avatarsOf(field).length"
                          class="flex shrink-0 items-center -space-x-1"
                        >
                          <Avatar
                            v-for="option in avatarsOf(field)"
                            :key="String(option.value)"
                            :src="option.avatar || undefined"
                            :alt="option.label"
                            :label="option.label"
                            size="small"
                            kind="circle"
                          />
                        </span>
                        <span class="truncate">{{ summarize(field)?.label }}</span>
                        <span
                          v-if="summarize(field)?.extra"
                          class="shrink-0 text-(--text-muted)"
                          >+{{ summarize(field).extra }}</span
                        >
                      </span>
                    </Chip>
                  </span>
                </TransitionGroup>
              </div>
              <Card :padded="false">
                <template #content>
                  <TableRoot
                    ref="tableRef"
                    v-model:pagination="pagination"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="visibleRows"
                    :columns="columns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="8"
                    :bordered="false"
                    :loading="loading"
                  >
                    <template #cell-name="{ value }">
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </template>
                    <template #cell-id="{ value }">
                      <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                        <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
                        <CopyButton
                          v-if="value"
                          kind="outlined"
                          :value="value"
                          aria-label="Copy record ID"
                        />
                      </div>
                    </template>
                    <template #cell-type="{ value }">
                      <Tag
                        :label="value"
                        severity="secondary"
                        size="medium"
                      />
                    </template>
                    <template #cell-value="{ value }">
                      <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                        <span class="min-w-0 truncate">{{ value }}</span>
                        <div class="shrink-0 ms-auto">
                          <CopyButton
                            kind="outlined"
                            :value="value"
                            aria-label="Copy record value"
                            @click.stop
                          />
                        </div>
                      </div>
                    </template>
                    <template #cell-policy="{ value }">
                      <span class="min-w-0 truncate">{{ policyLabel(value) }}</span>
                    </template>
                    <template #cell-weight="{ value }">
                      <span class="min-w-0 truncate">{{ value ?? '—' }}</span>
                    </template>
                    <template #cell-description="{ value }">
                      <span class="min-w-0 truncate">{{ value || '—' }}</span>
                    </template>
                    <template #cell-actions>
                      <DropdownMenuRoot placement="bottom-end">
                        <DropdownMenuTrigger>
                          <Tooltip text="Row actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="outlined"
                              size="small"
                              aria-label="Row actions"
                            />
                          </Tooltip>
                        </DropdownMenuTrigger>
                        <DropdownMenuGroup>
                          <DropdownMenuOption
                            value="edit"
                            label="Edit"
                          >
                            <template #left
                              ><i
                                class="pi pi-pencil"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenuOption>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                          <DropdownMenuOption
                            value="delete"
                            label="Delete"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenuOption>
                        </DropdownMenuGroup>
                      </DropdownMenuRoot>
                    </template>
                  </TableRoot>
                </template>
              </Card>
            </section>
          </section>
        </div>
      </section>
    </main>

    <Drawer
      v-model:open="importOpen"
      side="right"
      size="large"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>Import zone file</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <PanelContent>
            <div class="flex flex-col gap-(--spacing-lg)">
              <DrawerDescription>
                Records in BIND format are added to example.com. Nothing changes until you import,
                and lines that cannot be read are left out.
              </DrawerDescription>

              <section
                aria-labelledby="zone-import-source"
                class="flex flex-col gap-(--spacing-sm)"
              >
                <h3
                  id="zone-import-source"
                  class="m-0 text-label-md text-(--text-default)"
                >
                  Zone file
                </h3>
                <FileDropzone
                  title="Drop a zone file"
                  description="One .zone or .txt file in BIND format."
                  accept=".zone,.txt,.db,text/plain"
                  :multiple="false"
                  icon="pi pi-file-import"
                  :invalid="Boolean(dropError)"
                  @drop="onDrop"
                  @reject="onReject"
                >
                  <Button
                    label="Browse files"
                    kind="secondary"
                    size="medium"
                    @click="fileInput?.click()"
                  />
                </FileDropzone>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".zone,.txt,.db,text/plain"
                  class="hidden"
                  aria-hidden="true"
                  tabindex="-1"
                  @change="onPicked"
                />
                <HelperText
                  v-if="dropError"
                  kind="invalid"
                  :label="dropError"
                />
                <label
                  for="zone-import-text"
                  class="text-label-sm text-(--text-muted)"
                  >Or paste it</label
                >
                <Textarea
                  id="zone-import-text"
                  v-model="zoneText"
                  class="w-full"
                  :rows="8"
                  placeholder="www IN CNAME example.com."
                  @paste="onPaste"
                />
              </section>

              <section
                aria-labelledby="zone-import-preview"
                class="flex flex-col gap-(--spacing-sm)"
              >
                <div class="flex flex-wrap items-baseline justify-between gap-(--spacing-xs)">
                  <h3
                    id="zone-import-preview"
                    class="m-0 text-label-md text-(--text-default)"
                  >
                    Preview
                  </h3>
                  <p
                    role="status"
                    class="m-0 text-body-sm text-(--text-muted)"
                  >
                    {{ readyLines.length }} ready, {{ skippedLines.length }} skipped,
                    {{ errorLines.length }} {{ errorLines.length === 1 ? 'error' : 'errors' }}
                  </p>
                </div>
                <Alert
                  v-if="errorLines.length"
                  severity="danger"
                >
                  {{
                    errorLines.length === 1
                      ? `Line ${errorLines[0].line} cannot be imported.`
                      : `${errorLines.length} lines cannot be imported.`
                  }}
                  The ready records still import; fix the rest in the file and import it again.
                </Alert>
                <Card :padded="false">
                  <template #content>
                    <TableRoot
                      :data="parsed.lines"
                      :columns="previewColumns"
                      row-key="line"
                      :bordered="false"
                      aria-label="Zone file preview"
                    >
                      <template #cell-name="{ value }">
                        <span class="font-(family-name:--font-code) text-body-sm">{{
                          value ?? '—'
                        }}</span>
                      </template>
                      <template #cell-value="{ row }">
                        <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <span
                            v-if="row.value"
                            class="truncate font-(family-name:--font-code) text-body-sm"
                            >{{ row.value }}</span
                          >
                          <span
                            v-if="row.reason"
                            class="text-body-xs"
                            :class="
                              row.status === 'error' ? 'text-(--danger)' : 'text-(--text-muted)'
                            "
                            >{{ row.reason }}</span
                          >
                        </span>
                      </template>
                      <template #cell-status="{ value }">
                        <Tag
                          :label="statusTag[value].label"
                          :severity="statusTag[value].severity"
                          size="small"
                        />
                      </template>
                    </TableRoot>
                  </template>
                </Card>
              </section>
            </div>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                label="Cancel"
                kind="outlined"
                @click="importOpen = false"
              />
              <Button
                :label="
                  readyLines.length === 1
                    ? 'Import 1 record'
                    : `Import ${readyLines.length} records`
                "
                kind="primary"
                :disabled="!readyLines.length"
                :loading="importing"
                @click="runImport"
              />
            </div>
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Toaster position="bottom-right" />
  </div>
</template>
