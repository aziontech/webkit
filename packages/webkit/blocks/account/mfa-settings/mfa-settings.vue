<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import { sampleMembers } from './sample'

  /** One person of the account and their second factor. */
  export interface MfaSettingsMember {
    /** Stable key. */
    id: string
    /** Display name. */
    name: string
    /** Sign-in email, shown under the name. */
    email: string
    /** The second factor in use, such as Authenticator app; empty when none. */
    method: string
    /** Whether the person signs in with a second factor. */
    enabled: boolean
    /** When the second factor was set up, or null when it is not. */
    since: Date | null
  }

  export interface MfaSettingsProps {
    /** The people to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    members?: MfaSettingsMember[]
    /** A request is in flight: with no people it is the first load, with people a refresh. */
    loading?: boolean
    /** Why the MFA status could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  const props = withDefaults(defineProps<MfaSettingsProps>(), {
    members: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    remind: [event: Event, member: MfaSettingsMember]
    reset: [event: MouseEvent, member: MfaSettingsMember]
  }>()

  const required = defineModel<boolean>('required', { default: false })

  type MemberRow = MfaSettingsMember & { status: string }

  const source = computed<MfaSettingsMember[]>(
    () => props.members ?? (props.loading || props.error ? [] : sampleMembers)
  )
  const items = ref<MfaSettingsMember[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const loadFailed = computed(() => props.error !== '')

  const withoutMfa = computed(() => items.value.filter((member) => !member.enabled))

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'MFA', minWidth: 120 },
    { accessorKey: 'method', header: 'Method', minWidth: 160 },
    { accessorKey: 'since', header: 'Set up', minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]
  const rows = computed(() =>
    items.value.map((member) => ({
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

  const membersTableEl = ref<TableExposed<MemberRow> | null>(null)
  const exportCsv = () => membersTableEl.value?.exportCsv({ filename: 'mfa-status.csv' })

  const refreshing = computed(() => props.loading && items.value.length > 0)

  const requireOpen = ref(false)
  const onRequire = (value: boolean) => {
    if (value) {
      requireOpen.value = true
      return
    }
    required.value = false
  }
  const confirmRequire = () => {
    required.value = true
    requireOpen.value = false
  }

  const pending = ref<MfaSettingsMember | null>(null)
  const resetOpen = ref(false)
  const onAction = (event: Event, value: DropdownMenuItemValue, row: MemberRow) => {
    const member = items.value.find((item) => item.id === row.id)
    if (!member) return
    if (value === 'reset') {
      pending.value = member
      resetOpen.value = true
      return
    }
    if (value === 'remind') emit('remind', event, member)
  }
  const reset = (event: MouseEvent) => {
    const member = pending.value
    if (!member) return
    items.value = items.value.map((item) =>
      item.id === member.id ? { ...item, enabled: false, method: '', since: null } : item
    )
    resetOpen.value = false
    emit('reset', event, member)
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
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/mfa"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Require MFA"
                variant="compact"
                description="Everyone in the account must use a second factor to sign in. People without one set it up at their next sign-in."
              >
                <Switch
                  :model-value="required"
                  aria-label="Require MFA"
                  :disabled="loading || loadFailed"
                  @update:model-value="onRequire"
                />
              </SettingsRow>
            </Item.List>
          </template>
        </Card>

        <Alert
          v-if="!required && !loading && !loadFailed && withoutMfa.length"
          severity="warning"
        >
          {{ withoutMfa.length }} of {{ items.length }} people sign in with a password only. Require
          MFA, or remind them to set it up.
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
                content="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="ai ai-refresh"
                  variant="outline"
                  size="medium"
                  :loading="refreshing"
                  aria-label="Refresh"
                  @click="emit('refresh', $event)"
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
            {{ error }}
            <template #actions>
              <Button
                label="Retry"
                variant="secondary"
                size="small"
                @click="emit('retry', $event)"
              />
            </template>
          </Alert>

          <Card
            v-else
            :padded="false"
          >
            <template #default>
              <DataTable
                ref="membersTableEl"
                v-bind="tableProps"
                :loading="loading"
                sortable
                :bordered="false"
                aria-label="People and their MFA status"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      :label="row.name"
                      size="small"
                      variant="square"
                    />
                    <div class="flex min-w-0 flex-col">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        row.name
                      }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)">{{ row.email }}</span>
                      <TableCellStatus
                        :label="row.status"
                        :severity="row.enabled ? 'success' : 'warning'"
                        aria-hidden="true"
                        class="mt-(--spacing-2xs) w-fit sm:hidden"
                      />
                    </div>
                  </div>
                </template>
                <template #cell-status="{ row }">
                  <TableCellStatus
                    :label="row.status"
                    :severity="row.enabled ? 'success' : 'warning'"
                  />
                </template>
                <template #cell-method="{ value }">
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                </template>
                <template #cell-since="{ row }">
                  <TableCellTime
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
                  <TableCellActions
                    :name="row.name"
                    @select="(event, value) => onAction(event, value, row)"
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
                  </TableCellActions>
                </template>
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="ai ai-search"
                    title="No matching people"
                    description="No person matches these filters."
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
                </template>
              </DataTable>
            </template>
          </Card>
        </div>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="requireOpen"
      variant="primary"
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
