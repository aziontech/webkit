<script setup lang="ts">
  import type { DropdownMenuItemValue, TableColumn } from '@aziontech/ui/data-table'
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs from '@aziontech/ui/tabs'
  import { type FilteringProperty, useCollection } from '@aziontech/ui/use-collection'
  import { computed, reactive, ref, useId, watch } from 'vue'

  import { DNS_ZONE_POLICY_TYPES } from './dns-zone-policy'
  import DnsZoneRecordsTab from './parts/dns-zone-records-tab.vue'
  import DnsZoneSettingsTab from './parts/dns-zone-settings-tab.vue'
  import { sampleRecords, sampleZone } from './sample'

  /** A tab of the zone page. */
  export type DnsZoneDetailTab = 'main-settings' | 'records'

  /** The DNSSEC values the user copies into the domain provider. */
  export interface DnsZoneDetailDnssecKey {
    /** Identifier of the key that signs the zone. */
    keyTag: string
    /** The signing algorithm, with its number. */
    algorithm: string
    /** The digest hash function, with its number. */
    digestType: string
    /** The digest of the public key. */
    digest: string
  }

  /** The editable zone settings, and the values a save sends. */
  export interface DnsZoneDetailSettings {
    /** The zone name. */
    name: string
    /** The domain the zone hosts. */
    domain: string
    /** Whether DNSSEC signs the zone. */
    dnssec: boolean
    /** Whether the zone answers authoritative queries. */
    active: boolean
  }

  /** The zone the page shows. */
  export interface DnsZoneDetailZone extends DnsZoneDetailSettings {
    /** The nameservers the user sets in the domain provider. */
    nameservers: string[]
    /** The DNSSEC key values, shown while DNSSEC is on. */
    dnssecKey: DnsZoneDetailDnssecKey
  }

  /** A record of the zone. */
  export interface DnsZoneDetailRecord {
    /** The record ID. */
    id: string
    /** The record name, relative to the zone. */
    name: string
    /** The record type, such as A or CNAME. */
    type: string
    /** What the record answers with. */
    value: string
    /** Time to live, in seconds. */
    ttl: number
    /** The policy option value, simple or weighted. */
    policy: string
    /** The weight, blank when it does not apply. */
    weight: number | null
    /** What the record is for. */
    description: string
  }

  export interface DnsZoneDetailProps {
    /** The zone; the settings form opens on it and Discard returns to it. Left out, the sample renders. */
    zone?: DnsZoneDetailZone
    /** The zone records. Pass an empty array for a zone with none. Left out, the sample renders. */
    records?: DnsZoneDetailRecord[]
    /** The records request is in flight: Refresh spins and the table shows its loading state. */
    loading?: boolean
    /** Why the records failed to load, shown in a danger alert with Retry in place of the table. */
    error?: string
    /** The save is in flight: the form locks and Save spins. */
    saving?: boolean
    /** Shows Import zone file in the Records heading. */
    importable?: boolean
  }

  const props = withDefaults(defineProps<DnsZoneDetailProps>(), {
    zone: undefined,
    records: undefined,
    loading: false,
    error: '',
    saving: false,
    importable: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: DnsZoneDetailSettings]
    discard: [event: MouseEvent]
    create: [event: MouseEvent]
    import: [event: MouseEvent]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; record: DnsZoneDetailRecord }
    ]
  }>()

  const activeTab = defineModel<DnsZoneDetailTab>('tab', { default: 'main-settings' })

  const zone = computed<DnsZoneDetailZone>(() => props.zone ?? sampleZone)
  const records = computed<DnsZoneDetailRecord[]>(
    () => props.records ?? (props.loading || props.error ? [] : sampleRecords)
  )

  const tabs: { value: DnsZoneDetailTab; label: string }[] = [
    { value: 'main-settings', label: 'Main settings' },
    { value: 'records', label: 'Records' }
  ]

  const settingsOf = (source: DnsZoneDetailZone): DnsZoneDetailSettings => ({
    name: source.name,
    domain: source.domain,
    dnssec: source.dnssec,
    active: source.active
  })

  const errors = reactive({ name: '', domain: '' })
  const settings = reactive<DnsZoneDetailSettings>(settingsOf(zone.value))
  const saving = computed(() => props.saving)
  const baseline = ref(JSON.stringify(settings))
  const dirty = computed(() => JSON.stringify(settings) !== baseline.value)
  const nameMessageId = useId()
  const domainMessageId = useId()
  const nameserverMessageId = useId()

  watch(
    () => JSON.stringify(settingsOf(zone.value)),
    (next) => {
      Object.assign(settings, JSON.parse(next) as DnsZoneDetailSettings)
      baseline.value = next
    }
  )

  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }

  const save = (event: Event) => {
    if (saving.value || !validate()) return
    emit('submit', event, { ...settings })
  }
  const onSaveShortcut = (event: KeyboardEvent) => {
    if (!dirty.value || saving.value) return
    save(event)
  }

  const discard = (event: MouseEvent) => {
    Object.assign(settings, JSON.parse(baseline.value) as DnsZoneDetailSettings)
    errors.name = ''
    errors.domain = ''
    emit('discard', event)
  }

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

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'type',
      label: 'Type',
      options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value }))
    },
    { key: 'policy', label: 'Policy', options: DNS_ZONE_POLICY_TYPES },
    { key: 'value', label: 'Value' }
  ]

  const collection = useCollection({
    items: records,
    columns,
    filtering: { fields: ['name', 'id', 'type', 'value', 'description'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'dns-records-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    }
  })

  const blocked = computed(() => (props.loading && !records.value.length) || props.error !== '')
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

    <DnsZoneSettingsTab
      v-if="activeTab === 'main-settings'"
      :settings="settings"
      :errors="errors"
      :zone="zone"
      :saving="saving"
      :dirty="dirty"
      :name-message-id="nameMessageId"
      :domain-message-id="domainMessageId"
      :nameserver-message-id="nameserverMessageId"
      @save="save"
      @shortcut="onSaveShortcut"
      @discard="discard"
    />

    <DnsZoneRecordsTab
      v-else
      :zone="zone"
      :collection="collection"
      :loading="loading"
      :error="error"
      :importable="importable"
      :blocked="blocked"
      @create="(event: MouseEvent) => emit('create', event)"
      @import="(event: MouseEvent) => emit('import', event)"
      @refresh="(event: MouseEvent) => emit('refresh', event)"
      @retry="(event: MouseEvent) => emit('retry', event)"
      @row-action="
        (event: Event, payload: { value: DropdownMenuItemValue; record: DnsZoneDetailRecord }) =>
          emit('row-action', event, payload)
      "
    />
  </div>
</template>
