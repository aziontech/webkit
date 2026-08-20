<script setup>
  // Settings → Users Management. The teammates with access to this account and the
  // role each one holds.
  //
  // LAYOUT — an INTERNAL page on the DATA measure (`.layout-column`, the same column
  // every other table page in the app uses). The page stack has no vertical gap: it
  // holds the heading plus ONE band below it — the controls row over the table it
  // narrows — which carries the band step and stacks its two parts at the group step
  // (see src/styles/layout.css).
  // It owns its own scroll region because the
  // shell hands each tab a plain flex column (see AccountSettings.vue: the Account
  // Settings tab pins its own footer).
  import Avatar from '@aziontech/webkit/avatar'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useListFilters } from '../../../lib/behavior/list-state'

  // Where `Documentation` on the page heading goes. The docs ROOT, not a deep link: the
  // account-side topics have no entry in lib/data/product-empty-states.js (that
  // registry covers the first-level product modules), and pointing at a path we have
  // not verified is worse than pointing at the index. Replace with the topic's own URL
  // when there is one.
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

  // ── The filter catalog ────────────────────────────────────────────────────
  // The COLUMNS decide the fields: Role and Status are the enumerable ones,
  // while Name, Email and Last Active are covered by the search field.
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
    visibleRows: visibleUsers
  } = useListFilters(filterFields, users, { pageSize: 10 })

  const userColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'email', header: 'Email', grow: 2 },
    { accessorKey: 'role', header: 'Role', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastActive', header: 'Last Active' },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Which columns are switched off, driven by the Columns button on the controls
  // row (../../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever
  // recorded, so this never has to be kept in step with the column model above.
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
      <!-- The page's action is on the HEADING, not in the controls row below it — see
           the note in ./Credentials.vue. `Invite`, not `Create`: what this opens sends a
           mail to a person, and the row it adds is a consequence of them accepting. -->
      <PageHeading
        title="Users management"
        description="Manage the teammates who have access to this account and their roles."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Invite user"
            kind="primary"
            icon="pi pi-user-plus"
            @click="inviteUser"
          />
        </template>
      </PageHeading>

      <!-- The page's parent section. It holds one section here — the controls row
           over the table it narrows, at the GROUP step — and spaces whatever sits
           inside it at --layout-section-gap. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
               right, above the card — the same row every list in the console opens with. -->
          <ControlsHeader>
            <!-- Search drives the table's global filter from outside the card, so the field is
                 a plain InputText (`Table.Search` is context-aware and only works inside
                 `<Table>`). One horizontal band: it grows into the row's slack and compresses
                 rather than wrapping (see ui/ControlsHeader.vue). -->
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

            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="userColumns"
            />
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <CardBox :padded="false">
            <template #content>
              <Table
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
              </Table>
            </template>
          </CardBox>
        </section>
      </section>
    </section>
  </div>
</template>
