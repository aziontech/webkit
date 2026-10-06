<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../../lib/behavior/table-columns'

  const HELP = 'https://www.azion.com/en/documentation/'

  const users = ref([
    {
      id: 'u-1',
      name: 'Gabriel Lisboa',
      email: 'gabriel@cerne.digital',
      role: 'Owner',
      status: 'Active',
      lastActive: 'Just now'
    },
    {
      id: 'u-2',
      name: 'Rafael Umman',
      email: 'rafael.umman@azion.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 hours ago'
    },
    {
      id: 'u-3',
      name: 'Marina Costa',
      email: 'marina.costa@azion.com',
      role: 'Developer',
      status: 'Active',
      lastActive: 'Yesterday'
    },
    {
      id: 'u-4',
      name: 'Lucas Pereira',
      email: 'lucas.pereira@azion.com',
      role: 'Developer',
      status: 'Pending',
      lastActive: '—'
    },
    {
      id: 'u-5',
      name: 'Ana Rodrigues',
      email: 'ana.rodrigues@azion.com',
      role: 'Viewer',
      status: 'Active',
      lastActive: '3 days ago'
    },
    {
      id: 'u-6',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@azion.com',
      role: 'Viewer',
      status: 'Inactive',
      lastActive: '2 months ago'
    }
  ])

  const filterFields = [
    {
      id: 'role',
      label: 'Role',
      kind: 'options',
      options: [...new Set(users.value.map((user) => user.role))]
        .sort((a, b) => a.localeCompare(b))
        .map((role) => ({ value: role, label: role })),
      match: (user, values) => values.includes(user.role)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [...new Set(users.value.map((user) => user.status))]
        .sort((a, b) => a.localeCompare(b))
        .map((status) => ({ value: status, label: status })),
      match: (user, values) => values.includes(user.status)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleUsers,
    loading,
    refresh
  } = useListFilters(filterFields, users, { pageSize: 10 })

  const tableRef = ref(null)

  const userColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'email', header: 'Email', grow: 2 },
    { accessorKey: 'role', header: 'Role', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'lastActive', header: 'Last Active', minWidth: FIT_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const columnVisibility = ref({})

  const roleSeverity = (role) =>
    ({ Owner: 'primary', Admin: 'info', Developer: 'secondary', Viewer: 'secondary' })[role] ??
    'secondary'

  const statusSeverity = (status) =>
    ({ Active: 'success', Pending: 'warning', Inactive: 'secondary' })[status] ?? 'secondary'

  const inviteUser = () =>
    toast.success('Invite sent (demo).', {
      description: 'The teammate will receive an email to join this account.'
    })

  const onUserAction = (event, value, row) => {
    if (value === 'remove') {
      users.value = users.value.filter((user) => user.id !== row.id)
      toast.success(`${row.name} removed from the account.`)
      return
    }
    toast.info(value === 'edit' ? `Editing ${row.name}` : `${row.name}`, {
      description: row.email
    })
  }
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Users management"
        description="Manage the teammates who have access to this account and their roles."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Invite User"
            kind="outlined"
            icon="pi pi-user-plus"
            @click="inviteUser"
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
              placeholder="Search users"
              aria-label="Search users"
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
                filename="users.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="userColumns"
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
                :data="visibleUsers"
                :columns="userColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :border="false"
                :loading="loading"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      :label="row.name"
                      size="small"
                      kind="square"
                    />
                    <span class="truncate">{{ row.name }}</span>
                  </div>
                </template>

                <template #cell-role="{ value }">
                  <Tag
                    :label="value"
                    :severity="roleSeverity(value)"
                    size="medium"
                  />
                </template>

                <template #cell-status="{ value }">
                  <Tag
                    :label="value"
                    :severity="statusSeverity(value)"
                    size="medium"
                  />
                </template>

                <template #cell-actions="{ row }">
                  <Dropdown
                    placement="bottom-end"
                    @select="(event, value) => onUserAction(event, value, row)"
                  >
                    <Dropdown.Trigger>
                      <Tooltip text="User actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="small"
                          aria-label="User actions"
                        />
                      </Tooltip>
                    </Dropdown.Trigger>
                    <Dropdown.Group>
                      <Dropdown.Option
                        value="view"
                        label="View profile"
                      />
                      <Dropdown.Option
                        value="edit"
                        label="Edit role"
                      />
                    </Dropdown.Group>
                    <Dropdown.Group>
                      <Dropdown.Option
                        value="remove"
                        label="Remove"
                      >
                        <template #left>
                          <i
                            class="pi pi-trash"
                            aria-hidden="true"
                          />
                        </template>
                      </Dropdown.Option>
                    </Dropdown.Group>
                  </Dropdown>
                </template>
              </TableRoot>
            </template>
          </CardBox>
        </section>
      </section>
    </section>
  </div>
</template>
