<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import EmptyState from '@aziontech/webkit/empty-state'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, reactive, ref, useId } from 'vue'

  type DnsRecord = {
    id: string
    name: string
    type: string
    value: string
    ttl: number
    policy: string
    weight: number
    description: string
  }

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

  const rows: DnsRecord[] = [
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
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
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
                              kind="transparent"
                              :value="ns"
                              :aria-label="'Copy nameserver ' + (index + 1)"
                              size="small"
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
                              kind="transparent"
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
              kind="outlined"
              size="medium"
              href="https://example.com/docs/records"
              target="_blank"
            />
            <Button
              label="Add Record"
              icon="ai ai-plus"
              kind="outlined"
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
                  text="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="ai ai-refresh"
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
                    icon="ai ai-download"
                    kind="outlined"
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
              <template #content>
                <DataTable
                  ref="tableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  enable-sorting
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
                        <DropdownMenuOption
                          value="edit"
                          label="Edit"
                        >
                          <template #leading
                            ><i
                              class="ai ai-pencil"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="delete"
                          label="Delete"
                        >
                          <template #leading
                            ><i
                              class="ai ai-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
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
                          kind="outlined"
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
                            kind="secondary"
                            size="small"
                          />
                          <Button
                            label="Import zone file"
                            icon="ai ai-upload"
                            kind="outlined"
                            size="small"
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
