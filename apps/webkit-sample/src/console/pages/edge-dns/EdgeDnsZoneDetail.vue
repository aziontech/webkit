<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../components/form/SettingsSaveBar.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IdCell from '../../components/list/IdCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { saveGroup, useBaseline } from '../../lib/behavior/forms'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { NAMESERVERS, POLICY_TYPES, policyLabel, RECORD_TYPES } from '../../lib/data/edge-dns'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import CreateRecordDrawer from './CreateRecordDrawer.vue'

  const HELP = productFirstUse('edge-dns').learnMore.href

  const route = useRoute()
  const router = useRouter()

  const zone = {
    id: route.params.id || '6442',
    name: route.query.name || 'test',
    domain: route.query.domain || 'edgeflow.com'
  }

  const tabs = [
    { value: 'main-settings', label: 'Main Settings' },
    { value: 'records', label: 'Records' }
  ]
  const activeTab = computed({
    get: () =>
      tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'main-settings',
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  const errors = reactive({ name: '', domain: '' })

  const settings = reactive({
    name: zone.name,
    domain: zone.domain,
    dnssec: true,
    active: true
  })
  const saving = ref(false)
  const { dirty, commit } = useBaseline(settings)

  const snapshot = ref(JSON.parse(JSON.stringify(settings)))

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
      label: 'Digest Type',
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

  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }

  const save = () => {
    if (!validate()) return
    saveGroup(saving, 'Zone settings saved.', () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(settings))
    })
  }

  const discard = () => {
    Object.assign(settings, JSON.parse(JSON.stringify(snapshot.value)))
    errors.name = ''
    errors.domain = ''
  }

  const records = ref([
    {
      id: '423916',
      name: 'sasas',
      type: 'A',
      value: '192.0.2.1',
      ttl: 3600,
      policy: 'simple',
      weight: 255,
      description: 'Cryptographic digest of this zone’s key, as your provider expects it.'
    }
  ])

  const filterFields = [
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: RECORD_TYPES.map((type) => ({ value: type.value, label: type.value })),
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

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleRecords,
    loading,
    refresh
  } = useListFilters(filterFields, records)

  const tableRef = ref(null)

  const recordColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'ttl', header: 'TTL (seconds)', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'policy', header: 'Policy', minWidth: FIT_COLUMN },
    { accessorKey: 'weight', header: 'Weight', minWidth: FIT_COLUMN },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const columnVisibility = ref({ id: false })

  const recordDrawerOpen = ref(false)
  const openRecordDrawer = () => {
    recordDrawerOpen.value = true
  }
  const onRecordCreated = (record) => {
    records.value = [record, ...records.value]
  }

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    records.value = records.value.filter((record) => record.id !== row.id)
    toast.success(`Record "${row.name}" deleted.`)
    pendingDelete.value = null
  }

  const onRecordAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`Editing ${row.name}`, { description: `Record ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="edge-dns"
    :padded="false"
    :breadcrumb="[
      { label: 'Edge DNS', href: '/edge-dns' },
      { label: 'Zone', href: '/edge-dns' },
      { label: zone.name }
    ]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

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

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="General"
                  hint="How this zone is identified across the console."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          title="Name"
                          description="Give a unique and descriptive name to identify your zone."
                          :message="errors.name"
                          message-kind="required"
                        >
                          <template #default="{ messageId }">
                            <InputText
                              v-model="settings.name"
                              size="large"
                              class="w-full"
                              aria-label="Name"
                              autocomplete="off"
                              :required="!!errors.name"
                              :aria-describedby="messageId"
                              :disabled="saving"
                              @update:model-value="errors.name = ''"
                            />
                          </template>
                        </FieldRow>

                        <FieldRow
                          title="Domain Name"
                          description="Provide the domain name you want to host. Example: mydomain.com."
                          :message="errors.domain"
                          message-kind="required"
                        >
                          <template #default="{ messageId }">
                            <InputText
                              v-model="settings.domain"
                              size="large"
                              class="w-full"
                              aria-label="Domain Name"
                              autocomplete="off"
                              :required="!!errors.domain"
                              :aria-describedby="messageId"
                              :disabled="saving"
                              @update:model-value="errors.domain = ''"
                            />
                          </template>
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Configure your nameserver"
                  hint="Set Azion Edge DNS as the authoritative DNS server for the domain."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          title="Nameservers"
                          description="Set Azion Edge DNS as the authoritative DNS server for a domain by copying the nameservers values."
                          message="Add the nameservers in your domain provider."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <InputGroupRoot
                              v-for="(ns, index) in NAMESERVERS"
                              :key="ns"
                            >
                              <InputText
                                :model-value="ns"
                                size="large"
                                class="flex-1 font-code"
                                :aria-label="`Nameserver ${index + 1}`"
                                readonly
                              />
                              <CopyButton
                                kind="transparent"
                                :value="ns"
                                :aria-label="`Copy nameserver ${index + 1}`"
                              />
                            </InputGroupRoot>
                          </div>
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="DNSSEC"
                  hint="Signs the zone so resolvers can detect spoofed answers."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          kind="compact"
                          title="Enable DNSSEC"
                          description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the Key Tag and Digest values in your domain provider to complete the setup."
                        >
                          <Switch
                            v-model="settings.dnssec"
                            aria-label="Enable DNSSEC"
                            :disabled="saving"
                          />
                        </FieldRow>

                        <template v-if="settings.dnssec">
                          <FieldRow
                            v-for="key in dnssecKeys"
                            :key="key.label"
                            :title="key.label"
                            :description="key.description"
                          >
                            <InputGroupRoot class="w-full">
                              <InputText
                                :model-value="key.value"
                                size="large"
                                class="flex-1 font-code"
                                :aria-label="key.label"
                                readonly
                              />
                              <CopyButton
                                kind="transparent"
                                :value="key.value"
                                :aria-label="`Copy ${key.label}`"
                              />
                            </InputGroupRoot>
                          </FieldRow>
                        </template>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Status"
                  hint="A zone can be held inactive while its records are being built."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          kind="compact"
                          title="Active"
                          description="When active, the zone answers authoritative DNS queries for the domain."
                        >
                          <Switch
                            v-model="settings.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>
              </fieldset>
            </section>
          </div>

          <SettingsSaveBar
            :dirty="dirty"
            :saving="saving"
            @save="save"
            @discard="discard"
          />
        </form>
      </section>

      <section
        v-else
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
      >
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <PageHeading
            title="Records"
            description="The authoritative records this zone answers with."
            size="small"
            :documentation="HELP"
          >
            <template #actions>
              <HeadingAction
                label="Add Record"
                kind="outlined"
                icon="pi pi-plus"
                @click="openRecordDrawer"
              />
            </template>
          </PageHeading>

          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <ControlsHeader>
                <FilterButton
                  v-model="filters"
                  :fields="filterFields"
                />
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search records"
                  aria-label="Search records"
                  class="min-w-36 grow basis-(--container-2xs)"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
                <template #actions>
                  <RefreshButton
                    :loading="loading"
                    @refresh="refresh"
                  />
                  <ExportButton
                    :table="tableRef"
                    filename="dns-records.csv"
                  />
                  <ColumnsButton
                    v-model="columnVisibility"
                    :columns="recordColumns"
                  />
                </template>
              </ControlsHeader>

              <FilterChips
                v-model="filters"
                :fields="filterFields"
              />

              <CardBox :padded="false">
                <template #content>
                  <TableRoot
                    ref="tableRef"
                    v-model:pagination="pagination"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="visibleRecords"
                    :columns="recordColumns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="8"
                    :border="false"
                    :loading="loading"
                  >
                    <template #cell-name="{ value }">
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </template>

                    <template #cell-id="{ value }">
                      <IdCell
                        :value="value"
                        resource="record"
                      />
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
                        <CopyButton
                          kind="outlined"
                          :value="value"
                          aria-label="Copy record value"
                          class="ml-auto shrink-0"
                          @click.stop
                        />
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

                    <template #cell-actions="{ row }">
                      <Dropdown
                        placement="bottom-end"
                        @select="(event, value) => onRecordAction(event, value, row)"
                      >
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
                            <template #left
                              ><i
                                class="pi pi-pencil"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="delete"
                            label="Delete"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                      </Dropdown>
                    </template>
                  </TableRoot>
                </template>
              </CardBox>
            </section>
          </section>
        </div>
      </section>
    </main>

    <CreateRecordDrawer
      v-model:open="recordDrawerOpen"
      :domain="settings.domain"
      @created="onRecordCreated"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Record"
      :name="pendingDelete?.name ?? ''"
      description="The selected Record will be deleted, and resolvers will stop returning it once the change propagates. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>
