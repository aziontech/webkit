<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, reactive, ref, useId, watch } from 'vue'

  type DnsRecord = {
    id: string
    name: string
    type: string
    value: string
    ttl: number
    policy: string
    weight: number | null
    description: string
  }
  type ZoneLineBase = {
    line: number
    name?: string
    type?: string
    ttl?: number
    value?: string
    reason: string
  }
  type ZoneLine =
    | (ZoneLineBase & { status: 'skipped' | 'error' })
    | (ZoneLineBase & { status: 'ready'; name: string; type: string; ttl: number; value: string })

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
    Object.assign(settings, JSON.parse(baseline.value) as typeof settings)
    errors.name = ''
    errors.domain = ''
  }

  const POLICY_TYPES = [
    { value: 'simple', label: 'Simple' },
    { value: 'weighted', label: 'Weighted' }
  ]

  const policyLabel = (value: string) =>
    POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', sortable: true, minWidth: 80 },
    { accessorKey: 'type', header: 'Type', sortable: true, minWidth: 104 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'ttl', header: 'TTL (seconds)', sortable: true, minWidth: 80 },
    { accessorKey: 'policy', header: 'Policy', minWidth: 80 },
    { accessorKey: 'weight', header: 'Weight', minWidth: 80 },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const rows = ref<DnsRecord[]>([
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

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'type',
      label: 'Type',
      options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value }))
    },
    { key: 'policy', label: 'Policy', options: POLICY_TYPES },
    { key: 'value', label: 'Value' }
  ]

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'id', 'type', 'value', 'description'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'dns-records-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    }
  })

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const tableEl = ref<TableExposed<DnsRecord> | null>(null)

  const SUPPORTED = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA', 'SRV', 'NS', 'PTR']

  const stripComment = (line: string) => {
    let quoted = false
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index]
      if (char === '"') quoted = !quoted
      else if (char === ';' && !quoted) return line.slice(0, index)
    }
    return line
  }
  const unroot = (name: string) =>
    name.length > 1 && name.endsWith('.') ? name.slice(0, -1) : name
  const readTtl = (token: string) => {
    if (/^\d+$/.test(token)) return Number(token)
    const match = /^(\d+)([smhdw])$/i.exec(token)
    if (!match) return null
    const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }
    return Number(match[1]) * units[match[2].toLowerCase()]
  }
  const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/
  const checkValue = (type: string, value: string) => {
    if (!value) return 'The record has no value.'
    if (type === 'A' && !IPV4.test(value)) return `${value} is not an IPv4 address.`
    if (type === 'AAAA' && !value.includes(':')) return `${value} is not an IPv6 address.`
    if (type === 'MX' && !/^\d+\s+\S+$/.test(value)) return 'MX needs a priority and a host.'
    return ''
  }

  const parseZoneFile = (text: string) => {
    const lines: ZoneLine[] = []
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
  const fileInputEl = ref<HTMLInputElement | null>(null)
  const dropError = ref('')
  const parsedText = ref(SAMPLE_ZONE)
  let parseTimer: ReturnType<typeof setTimeout> | undefined
  watch(zoneText, (text) => {
    clearTimeout(parseTimer)
    if (text === parsedText.value) return
    parseTimer = setTimeout(() => {
      parsedText.value = text
    }, 250)
  })
  const parsed = computed(() => parseZoneFile(parsedText.value))
  const readyLines = computed(() => parsed.value.lines.filter((entry) => entry.status === 'ready'))
  const errorLines = computed(() => parsed.value.lines.filter((entry) => entry.status === 'error'))
  const skippedLines = computed(() =>
    parsed.value.lines.filter((entry) => entry.status === 'skipped')
  )
  const previewColumns: TableColumn[] = [
    { accessorKey: 'line', header: 'Line', minWidth: 64 },
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'type', header: 'Type', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'status', header: 'Status', minWidth: 104 }
  ]
  const statusTag: Record<ZoneLine['status'], { label: string; severity: TagSeverity }> = {
    ready: { label: 'Ready', severity: 'success' },
    skipped: { label: 'Skipped', severity: 'neutral' },
    error: { label: 'Error', severity: 'danger' }
  }

  const readFile = async (file: File | undefined) => {
    if (!file) return
    dropError.value = ''
    const text = await file.text()
    if (!parseZoneFile(text).lines.length) {
      dropError.value = `No records found in ${file.name}. Expected a zone file in BIND format, like www IN CNAME example.com.`
      return
    }
    clearTimeout(parseTimer)
    parsedText.value = text
    zoneText.value = text
    zoneSource.value = file.name
  }
  const onDrop = (_event: DragEvent, files: File[]) => readFile(files[0])
  const onReject = () => {
    dropError.value = 'Drop one text file, such as example.com.zone or zone.txt.'
  }
  const onPicked = (event: Event) => {
    const input = event.target as HTMLInputElement
    readFile(input.files?.[0])
    input.value = ''
  }
  const onPaste = () => {
    zoneSource.value = 'the pasted zone file'
  }

  const importing = ref(false)
  let importTimer: ReturnType<typeof setTimeout> | undefined
  const runImport = () => {
    clearTimeout(parseTimer)
    parsedText.value = zoneText.value
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
  onBeforeUnmount(() => {
    clearTimeout(importTimer)
    clearTimeout(parseTimer)
  })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <section
      v-if="activeTab === 'main-settings'"
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col"
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
                  <template #default>
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
                          type="required"
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
                          type="required"
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
                  <template #default>
                    <ItemList>
                      <SettingRow
                        title="Nameservers"
                        description="Make this zone the authoritative DNS for the domain by copying the nameserver values."
                        stackable
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputGroupRoot
                            v-for="(ns, index) in nameservers"
                            :key="ns"
                          >
                            <div class="flex flex-1">
                              <Input
                                :model-value="ns"
                                size="large"
                                class="w-full"
                                :aria-label="'Nameserver ' + (index + 1)"
                                monospace
                                readonly
                              />
                            </div>
                            <CopyButton
                              variant="ghost"
                              :value="ns"
                              :aria-label="'Copy nameserver ' + (index + 1)"
                              size="small"
                            />
                          </InputGroupRoot>
                        </div>
                        <HelperText
                          :id="nameserverMessageId"
                          type="helper"
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
                  <template #default>
                    <ItemList>
                      <SettingRow
                        title="Enable DNSSEC"
                        description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the key tag and digest values in your domain provider to complete the setup."
                        variant="compact"
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
                          stackable
                        >
                          <InputGroupRoot class="w-full">
                            <div class="flex flex-1">
                              <Input
                                :model-value="key.value"
                                size="large"
                                class="w-full"
                                :aria-label="key.label"
                                monospace
                                readonly
                              />
                            </div>
                            <CopyButton
                              variant="ghost"
                              :value="key.value"
                              :aria-label="'Copy ' + key.label"
                              size="small"
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
                  <template #default>
                    <ItemList>
                      <SettingRow
                        title="Active"
                        description="When active, the zone answers authoritative DNS queries for the domain."
                        variant="compact"
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
            variant="docked"
          >
            You have unsaved changes.

            <template #actions>
              <Button
                type="button"
                label="Discard"
                variant="outline"
                size="medium"
                :disabled="saving"
                @click="discard"
              />
              <Button
                type="submit"
                label="Save"
                variant="primary"
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
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1"
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
              icon="ai ai-book"
              variant="outline"
              size="medium"
              href="https://example.com/docs/records"
              target="_blank"
            />
            <Button
              label="Import zone file"
              icon="ai ai-file-import"
              variant="outline"
              size="medium"
              @click="importOpen = true"
            />
            <Button
              label="Add Record"
              icon="ai ai-plus"
              variant="outline"
              size="medium"
            />
          </template>
        </PageHeader>
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <header class="flex items-start gap-(--layout-group-gap)">
              <div class="flex min-w-0 grow">
                <PropertyFilter
                  v-bind="propertyFilterProps"
                  placeholder="Filter records"
                  aria-label="Filter records"
                />
              </div>
              <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                <Tooltip
                  content="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="ai ai-refresh"
                    variant="outline"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh"
                    @click="refresh"
                  />
                </Tooltip>
                <Tooltip
                  content="Download CSV"
                  class="shrink-0"
                >
                  <IconButton
                    icon="ai ai-download"
                    variant="outline"
                    size="medium"
                    :disabled="!matchingItems.length"
                    aria-label="Download CSV"
                    @click="tableEl?.exportCsv({ filename: 'records.csv' })"
                  />
                </Tooltip>
                <CollectionPreferences
                  v-bind="preferencesProps"
                  title="Table preferences"
                />
              </div>
            </header>
            <Card :padded="false">
              <template #default>
                <DataTable
                  ref="tableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  sortable
                  :bordered="false"
                >
                  <template #cell-name="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>
                  <template #cell-id="{ value }">
                    <Table.CellId
                      :value="value"
                      resource="record"
                    />
                  </template>
                  <template #cell-type="{ value }">
                    <Tag
                      :label="value"
                      severity="neutral"
                      size="medium"
                    />
                  </template>
                  <template #cell-value="{ value }">
                    <Table.CellLink
                      :label="value"
                      copyable
                      @click.stop
                    />
                  </template>
                  <template #cell-policy="{ value }">
                    <span class="min-w-0 truncate">{{ policyLabel(value) }}</span>
                  </template>
                  <template #cell-weight="{ value }">
                    <span class="min-w-0 truncate">{{ value ?? '' }}</span>
                  </template>
                  <template #cell-description="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>
                  <template #cell-actions="{ row }">
                    <Table.CellActions :name="row.name">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="edit"
                          label="Edit"
                        >
                          <template #leading
                            ><i
                              class="ai ai-pencil"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="delete"
                          label="Delete"
                        >
                          <template #leading
                            ><i
                              class="ai ai-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </Table.CellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      key="empty-state-1"
                      v-if="status === 'no-match'"
                      size="medium"
                      icon="ai ai-filter-off"
                      title="No matching records"
                      description="No record matches these filters."
                    >
                      <template #actions>
                        <Button
                          label="Clear filters"
                          variant="outline"
                          size="small"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                    <EmptyState
                      key="empty-state-2"
                      v-else
                      size="medium"
                      icon="ai ai-list"
                      title="No records yet"
                      description="Add a record, or import a zone file, so this zone starts answering for example.com."
                    >
                      <template #actions>
                        <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                          <Button
                            label="Add Record"
                            icon="ai ai-plus"
                            variant="secondary"
                            size="small"
                          />
                          <Button
                            label="Import zone file"
                            icon="ai ai-upload"
                            variant="outline"
                            size="small"
                            @click="importOpen = true"
                          />
                        </div>
                      </template>
                    </EmptyState>
                  </template>
                </DataTable>
              </template>
            </Card>
          </section>
        </section>
      </div>
    </section>

    <Drawer
      v-model:open="importOpen"
      side="end"
      size="large"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Import zone file</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-lg)">
            <DrawerDescription>
              Records in BIND format are added to example.com. Nothing changes until you import, and
              lines that cannot be read are left out.
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
                icon="ai ai-file-import"
                :invalid="Boolean(dropError)"
                @drop="onDrop"
                @reject="onReject"
              >
                <Button
                  label="Browse files"
                  variant="secondary"
                  size="medium"
                  @click="fileInputEl?.click()"
                />
              </FileDropzone>
              <input
                ref="fileInputEl"
                type="file"
                accept=".zone,.txt,.db,text/plain"
                class="hidden"
                aria-hidden="true"
                tabindex="-1"
                @change="onPicked"
              />
              <HelperText
                v-if="dropError"
                type="invalid"
                :label="dropError"
              />
              <Field>
                <Field.Label for="zone-import-text">
                  <span class="text-(--text-muted)">Or paste it</span>
                </Field.Label>
                <Textarea
                  id="zone-import-text"
                  v-model="zoneText"
                  class="w-full"
                  :rows="8"
                  placeholder="www IN CNAME example.com."
                  @paste="onPaste"
                />
              </Field>
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
                <template #default>
                  <DataTable
                    :data="parsed.lines"
                    :columns="previewColumns"
                    row-key="line"
                    paginated
                    :page-size="10"
                    :bordered="false"
                    aria-label="Zone file preview"
                  >
                    <template #cell-name="{ value }">
                      <span class="font-(family-name:--font-code) text-body-sm">{{
                        value ?? '—'
                      }}</span>
                    </template>
                    <template #cell-value="{ row }">
                      <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
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
                  </DataTable>
                </template>
              </Card>
            </section>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Cancel"
              variant="outline"
              @click="importOpen = false"
            />
            <Button
              :label="
                readyLines.length === 1 ? 'Import 1 record' : `Import ${readyLines.length} records`
              "
              variant="primary"
              :disabled="!readyLines.length"
              :loading="importing"
              @click="runImport"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
