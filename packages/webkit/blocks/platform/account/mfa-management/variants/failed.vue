<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const DAY = 86_400_000
  const REFERENCE = Date.UTC(2026, 10, 10, 12)

  const seedMembers = [
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

  const REQUIRED_ON_START = false
  const members = ref([])
  const required = ref(REQUIRED_ON_START)
  const loading = ref(false)
  const loadFailed = ref(true)

  const withoutMfa = computed(() => members.value.filter((member) => !member.enabled))

  const columns = [
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
  const { filterProps, tableProps, clearFilters } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'email', 'status'] },
    pagination: { pageSize: 10 }
  })

  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      members.value = seedMembers
      loading.value = false
    }, 700)
  }

  const requireOpen = ref(false)
  const onRequire = (value) => {
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

  const pending = ref(null)
  const resetOpen = ref(false)
  const onAction = (value, row) => {
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
          <Input
            v-if="!loadFailed"
            v-bind="filterProps"
            placeholder="Search people"
            aria-label="Search people"
            class="w-full"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </Input>

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
              <Table
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
                    @select="(event, value) => onAction(value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        key="dropdown-menu.option-1"
                        v-if="row.enabled"
                        value="reset"
                        label="Reset MFA"
                      />
                      <DropdownMenu.Option
                        key="dropdown-menu.option-2"
                        v-else
                        value="remind"
                        label="Send setup reminder"
                      />
                    </DropdownMenu.Group>
                  </Table.CellActions>
                </template>
                <template #empty>
                  <div
                    class="flex flex-col items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-lg)"
                  >
                    <p class="m-0 text-body-sm text-(--text-muted)">
                      No person matches this search.
                    </p>
                    <Button
                      label="Clear search"
                      kind="outlined"
                      size="small"
                      @click="clearFilters"
                    />
                  </div>
                </template>
              </Table>
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
      @confirm="confirmRequire"
    />

    <ConfirmDialog
      v-model:open="resetOpen"
      title="Reset MFA"
      :description="`${pending?.name ?? ''} loses the second factor they set up and signs in with their password only until they set one up again. Use it when they lost their device.`"
      confirm-label="Reset MFA"
      @confirm="reset"
    />

    <Toaster position="bottom-right" />
  </div>
</template>
