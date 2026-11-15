<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const DAY = 86_400_000
  const REFERENCE = Date.UTC(2026, 10, 10, 12)

  interface Member {
    id: string
    name: string
    email: string
    method: string
    enabled: boolean
    since: Date | null
  }

  type MemberRow = Member & { status: string }

  const seedMembers: Member[] = [
    {
      id: 'm-1',
      name: 'Avery Stone',
      email: 'avery.stone@example.com',
      method: 'Authenticator app',
      enabled: true,
      since: new Date(REFERENCE - 210 * DAY)
    },
    {
      id: 'm-2',
      name: 'Jordan Reyes',
      email: 'jordan.reyes@example.com',
      method: 'Authenticator app',
      enabled: true,
      since: new Date(REFERENCE - 40 * DAY)
    },
    {
      id: 'm-3',
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      method: '',
      enabled: false,
      since: null
    },
    {
      id: 'm-4',
      name: 'Lena Fischer',
      email: 'lena.fischer@example.com',
      method: 'Authenticator app',
      enabled: true,
      since: new Date(REFERENCE - 6 * DAY)
    },
    {
      id: 'm-5',
      name: 'Marco Bianchi',
      email: 'marco.bianchi@example.com',
      method: '',
      enabled: false,
      since: null
    }
  ]

  const REQUIRED_ON_START = true
  const members = ref(seedMembers)
  const required = ref(REQUIRED_ON_START)
  const loading = ref(false)
  const loadFailed = ref(false)

  const withoutMfa = computed(() => members.value.filter((member) => !member.enabled))

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'MFA', minWidth: 120 },
    { accessorKey: 'method', header: 'Method', minWidth: 160 },
    { accessorKey: 'since', header: 'Set up', minWidth: 160 },
    { id: 'actions', kind: 'action', hideable: false }
  ]
  const rows = computed(() =>
    members.value.map((member) => ({
      ...member,
      status: member.enabled ? 'Enabled' : 'Not set up'
    }))
  )
  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'MFA',
      options: [{ value: 'Enabled' }, { value: 'Not set up' }]
    },
    { key: 'method', label: 'Method', options: [{ value: 'Authenticator app' }] }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'email', 'status', 'method'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'account-mfa' }
    })

  const membersTable = ref<TableExposed<MemberRow> | null>(null)
  const exportCsv = () => membersTable.value?.exportCsv({ filename: 'mfa-status.csv' })

  const refreshing = ref(false)
  const refresh = () => {
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      members.value = seedMembers
      loading.value = false
    }, 700)
  }

  const requireOpen = ref(false)
  const onRequire = (value: boolean) => {
    if (value) {
      requireOpen.value = true
      return
    }
    required.value = false
    toast.success('MFA is optional again.', {
      description: 'People who set it up keep using it.'
    })
  }
  const confirmRequire = () => {
    required.value = true
    requireOpen.value = false
    const count = withoutMfa.value.length
    toast.success('MFA is now required.', {
      description: count
        ? `${count} ${count === 1 ? 'person sets' : 'people set'} it up at their next sign-in.`
        : 'Everyone in the account already uses it.'
    })
  }

  const pending = ref<MemberRow | null>(null)
  const resetOpen = ref(false)
  const onAction = (value: DropdownMenuOptionValue, row: MemberRow) => {
    if (value === 'reset') {
      pending.value = row
      resetOpen.value = true
      return
    }
    if (value === 'remind') {
      toast.success(`Reminder sent to ${row.email}.`, {
        description: 'The email links to the MFA setup page.'
      })
    }
  }
  const reset = () => {
    const row = pending.value
    if (!row) return
    const member = members.value.find((item) => item.id === row.id)
    if (member) {
      member.enabled = false
      member.method = ''
      member.since = null
    }
    resetOpen.value = false
    toast.success(`MFA reset for ${row.name}.`, {
      description: required.value
        ? 'They set it up again at their next sign-in.'
        : 'They can sign in with their password until they set it up again.'
    })
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Multi-factor authentication"
        description="Who signs in with a second factor, and whether the account requires one."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/mfa"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <Card :padded="false">
          <template #content>
            <Item.List>
              <SettingRow
                title="Require MFA"
                kind="compact"
                description="Everyone in the account must use a second factor to sign in. People without one set it up at their next sign-in."
              >
                <Switch
                  :model-value="required"
                  aria-label="Require MFA"
                  :disabled="loading || loadFailed"
                  @update:model-value="onRequire"
                />
              </SettingRow>
            </Item.List>
          </template>
        </Card>

        <Alert
          v-if="!required && !loading && !loadFailed && withoutMfa.length"
          severity="warning"
        >
          {{ withoutMfa.length }} of {{ members.length }} people sign in with a password only.
          Require MFA, or remind them to set it up.
        </Alert>

        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header
            v-if="!loadFailed"
            class="flex flex-wrap items-start gap-(--layout-group-gap)"
          >
            <div class="flex min-w-0 grow basis-(--container-2xs)">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter people"
                aria-label="Filter people"
              />
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
              <Tooltip
                text="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-refresh"
                  kind="outlined"
                  size="medium"
                  :loading="refreshing"
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

          <Alert
            v-if="loadFailed"
            severity="danger"
          >
            The MFA status could not be loaded. Nothing was changed; try again.
            <template #action>
              <Button
                label="Retry"
                kind="secondary"
                size="small"
                @click="retryLoad"
              />
            </template>
          </Alert>

          <Card
            v-else
            :padded="false"
          >
            <template #content>
              <DataTable
                ref="membersTable"
                v-bind="tableProps"
                :loading="loading"
                enable-sorting
                :bordered="false"
                aria-label="People and their MFA status"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      :label="row.name"
                      size="small"
                      kind="square"
                    />
                    <div class="flex min-w-0 flex-col">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        row.name
                      }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)">{{ row.email }}</span>
                    </div>
                  </div>
                </template>
                <template #cell-status="{ row }">
                  <Table.CellStatus
                    :label="row.status"
                    :severity="row.enabled ? 'success' : 'warning'"
                  />
                </template>
                <template #cell-method="{ value }">
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                </template>
                <template #cell-since="{ row }">
                  <Table.CellTime
                    v-if="row.since"
                    :value="row.since"
                  />
                  <span
                    v-else
                    class="text-body-sm text-(--text-muted)"
                    >—</span
                  >
                </template>
                <template #header-actions>
                  <span class="sr-only">Actions</span>
                </template>
                <template #cell-actions="{ row }">
                  <Table.CellActions
                    :name="row.name"
                    @select="(_event, value) => onAction(value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Item
                        key="dropdown-menu.option-1"
                        v-if="row.enabled"
                        value="reset"
                        label="Reset MFA"
                      />
                      <DropdownMenu.Item
                        key="dropdown-menu.option-2"
                        v-else
                        value="remind"
                        label="Send setup reminder"
                      />
                    </DropdownMenu.Group>
                  </Table.CellActions>
                </template>
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="pi pi-search"
                    title="No matching people"
                    description="No person matches these filters."
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
              </DataTable>
            </template>
          </Card>
        </div>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="requireOpen"
      kind="primary"
      title="Require MFA"
      :description="
        withoutMfa.length
          ? `${withoutMfa.length} ${withoutMfa.length === 1 ? 'person does' : 'people do'} not use MFA yet (${withoutMfa.map((member) => member.name).join(', ')}). They are asked to set it up at their next sign-in and cannot use the account until they do.`
          : 'Everyone in the account already uses MFA. New people set it up at their first sign-in.'
      "
      confirm-label="Require MFA"
      size="small"
      @confirm="confirmRequire"
    />

    <ConfirmDialog
      v-model:open="resetOpen"
      title="Reset MFA"
      :description="`${pending?.name ?? ''} loses the second factor they set up and signs in with their password only until they set one up again. Use it when they lost their device.`"
      confirm-label="Reset MFA"
      size="small"
      @confirm="reset"
    />
  </div>
</template>
