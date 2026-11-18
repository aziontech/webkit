<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type {
    DropdownMenuItemValue,
    TableColumn,
    TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, reactive, ref, useId, watch } from 'vue'

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

  const dnssecKeys = computed(() => [
    {
      label: 'Key tag',
      value: zone.value.dnssecKey.keyTag,
      description:
        'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
    },
    {
      label: 'Algorithm',
      value: zone.value.dnssecKey.algorithm,
      description: 'Specifies the algorithm used to generate the DNSSEC key.'
    },
    {
      label: 'Digest type',
      value: zone.value.dnssecKey.digestType,
      description: 'Indicates the hash function used for the DNSSEC digest.'
    },
    {
      label: 'Digest',
      value: zone.value.dnssecKey.digest,
      description:
        'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
    }
  ])

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

  const discard = (event: MouseEvent) => {
    Object.assign(settings, JSON.parse(baseline.value) as DnsZoneDetailSettings)
    errors.name = ''
    errors.domain = ''
    emit('discard', event)
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

  const onRowAction = (event: Event, value: DropdownMenuItemValue, record: DnsZoneDetailRecord) =>
    emit('row-action', event, { value, record })

  const tableEl = ref<TableExposed<DnsZoneDetailRecord> | null>(null)
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
              <SettingsGroup
                label="General"
                hint="How this zone is identified across the platform."
                anchor="general"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Name"
                        description="Give a unique and descriptive name to identify your zone."
                      >
                        <Input
                          v-model="settings.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          autocomplete="off"
                          required
                          :invalid="!!errors.name"
                          :aria-describedby="errors.name ? nameMessageId : undefined"
                          :disabled="saving"
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          :id="nameMessageId"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>

                      <SettingsRow
                        title="Domain name"
                        description="Provide the domain name you want to host. Example: example.com."
                      >
                        <Input
                          v-model="settings.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain name"
                          autocomplete="off"
                          required
                          :invalid="!!errors.domain"
                          :aria-describedby="errors.domain ? domainMessageId : undefined"
                          :disabled="saving"
                          @update:model-value="errors.domain = ''"
                        />
                        <FieldError
                          v-if="errors.domain"
                          :id="domainMessageId"
                          >{{ errors.domain }}</FieldError
                        >
                      </SettingsRow>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Configure your nameserver"
                hint="Make this zone the authoritative DNS for the domain."
                anchor="configure-your-nameserver"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Nameservers"
                        description="Make this zone the authoritative DNS for the domain by copying the nameserver values."
                        stackable
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputGroupRoot
                            v-for="(ns, index) in zone.nameservers"
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
                        <FieldDescription :id="nameserverMessageId"
                          >Add the nameservers in your domain provider.</FieldDescription
                        >
                      </SettingsRow>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="DNSSEC"
                hint="Signs the zone so resolvers can detect spoofed answers."
                anchor="dnssec"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Enable DNSSEC"
                        description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the key tag and digest values in your domain provider to complete the setup."
                        variant="compact"
                      >
                        <Switch
                          v-model="settings.dnssec"
                          aria-label="Enable DNSSEC"
                          :disabled="saving"
                        />
                      </SettingsRow>

                      <template v-if="settings.dnssec">
                        <SettingsRow
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
                        </SettingsRow>
                      </template>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Status"
                hint="A zone can be held inactive while its records are being built."
                anchor="status"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Active"
                        description="When active, the zone answers authoritative DNS queries for the domain."
                        variant="compact"
                      >
                        <Switch
                          v-model="settings.active"
                          aria-label="Active"
                          :disabled="saving"
                        />
                      </SettingsRow>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>
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
              icon="az az-book"
              variant="outline"
              size="medium"
              href="https://example.com/docs/records"
              target="_blank"
            />
            <Button
              v-if="importable"
              label="Import zone file"
              icon="az az-file-import"
              variant="outline"
              size="medium"
              @click="(event: MouseEvent) => emit('import', event)"
            />
            <Button
              label="Add Record"
              icon="az az-plus"
              variant="outline"
              size="medium"
              @click="(event: MouseEvent) => emit('create', event)"
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
                  :disabled="blocked"
                />
              </div>
              <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                <Tooltip
                  content="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="az az-refresh"
                    variant="outline"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh"
                    @click="(event: MouseEvent) => emit('refresh', event)"
                  />
                </Tooltip>
                <Tooltip
                  content="Download CSV"
                  class="shrink-0"
                >
                  <IconButton
                    icon="az az-download"
                    variant="outline"
                    size="medium"
                    :disabled="blocked || !matchingItems.length"
                    aria-label="Download CSV"
                    @click="tableEl?.exportCsv({ filename: 'records.csv' })"
                  />
                </Tooltip>
                <CollectionPreferences
                  v-bind="preferencesProps"
                  title="Table preferences"
                  :disabled="blocked"
                />
              </div>
            </header>
            <Alert
              v-if="error"
              severity="danger"
              :label="error"
              action-label="Retry"
              @action="(event: MouseEvent) => emit('retry', event)"
            />
            <Card
              v-else
              :padded="false"
            >
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
                    <TableCellId
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
                    <TableCellLink
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
                    <TableCellActions
                      :name="row.name"
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="edit"
                          label="Edit"
                        >
                          <template #leading
                            ><i
                              class="az az-pencil"
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
                              class="az az-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </TableCellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      key="empty-state-1"
                      v-if="status === 'no-match'"
                      size="medium"
                      icon="az az-filter-off"
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
                      icon="az az-list"
                      title="No records yet"
                      :description="`Add a record, or import a zone file, so this zone starts answering for ${zone.domain}.`"
                    >
                      <template #actions>
                        <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                          <Button
                            label="Add Record"
                            icon="az az-plus"
                            variant="secondary"
                            size="small"
                            @click="(event: MouseEvent) => emit('create', event)"
                          />
                          <Button
                            label="Import zone file"
                            icon="az az-upload"
                            variant="outline"
                            size="small"
                            @click="(event: MouseEvent) => emit('import', event)"
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
  </div>
</template>
