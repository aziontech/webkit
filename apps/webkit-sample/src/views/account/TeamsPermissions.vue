<script setup>
  // Settings → Teams Permissions. The account's teams and the access level each one
  // grants.
  //
  // Backed by the shared teams.js store so this tab stays in sync with the focused
  // Create/Edit Team flow (/teams/new · /teams/:id), which returns here. The
  // Permissions cell shows the first permission plus a "+N" pill that opens a Popover
  // (with a "Show all permissions" Tooltip) listing the rest.
  //
  // LAYOUT — a LIST band on the DATA measure (`.layout-column`). The page stack has
  // no vertical gap: it holds the heading plus ONE band below it — the controls row
  // over the table it narrows — which carries the band step and stacks its two parts
  // at the group step (see src/styles/layout.css). It owns its
  // own scroll region because the shell hands each tab a plain flex column (see
  // AccountSettings.vue).
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import DeleteDialog from '../../components/ui/DeleteDialog.vue'
  import FilterBar from '../../components/ui/FilterBar.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import { useListFilters } from '../../lib/list-state'
  import { permissionLabel, permissionLabelsFor, useTeams } from '../../teams.js'

  const route = useRoute()
  const router = useRouter()

  // Free-text search, hoisted into the ControlsHeader above the card.

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const { teams, createTeam: addTeam, removeTeam } = useTeams()

  const teamColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, grow: 2 },
    { accessorKey: 'permissions', header: 'Permissions', grow: 3 },
    { accessorKey: 'status', header: 'Status' },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const teamStatusSeverity = (status) =>
    ({ Active: 'success', Inactive: 'secondary' })[status] ?? 'secondary'

  const firstPermission = (row) =>
    row.permissions.length ? permissionLabel(row.permissions[0]) : 'No permissions'
  const overflowCount = (row) => Math.max(row.permissions.length - 1, 0)
  const permissionList = (row) => permissionLabelsFor(row.permissions)

  const teamsQuery = () => ({ email: userEmail.value })
  const createTeam = () => router.push({ path: '/teams/new', query: teamsQuery() })

  const onTeamAction = (event, value, row) => {
    if (value === 'edit') {
      router.push({ path: `/teams/${row.id}`, query: teamsQuery() })
      return
    }
    if (value === 'duplicate') {
      const copy = addTeam({
        name: `${row.name} (copy)`,
        description: row.description,
        status: row.status,
        permissions: row.permissions
      })
      toast.success(`Team "${copy.name}" created.`)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
    }
  }

  // Deleting a team takes its permission bindings with it, so it asks for the team's
  // name back before it happens.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    removeTeam(row.id)
    toast.success(`Team "${row.name}" deleted.`)
    pendingDelete.value = null
  }
  // ── The filter catalog ────────────────────────────────────────────────────
  // Status is the one enumerable column. Permissions is a LIST per row, not a
  // value — a field over it would ask "has any of these", which is a different
  // question from the membership every other field asks, so it stays out.
  const filterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (team, values) => values.includes(team.status)
    }
  ]

  // No pagination model: this table lists every row, so there is no page offset a
  // narrowed set could strand.
  const {
    filters,
    search,
    visibleRows: visibleTeams
  } = useListFilters(filterFields, teams)

</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Teams Permissions"
        description="Manage your account's teams and the access level each one grants."
      />

      <!-- The page's parent section. It holds one section here — the controls row
           over the table it narrows, at the GROUP step — and spaces whatever sits
           inside it at --layout-section-gap. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
               right, above the card — the same row every list in the console opens with. -->
          <ControlsHeader>
            <!-- Search drives the table's global filter from outside the card, so the field is
                 a plain InputText (`Table.Search` is context-aware and only works inside
                 `<Table>`). One horizontal band: it grows into the row's slack and compresses
                 rather than wrapping (see ui/ControlsHeader.vue). -->
            <InputText
              v-model="search"
              size="large"
              placeholder="Search teams..."
              aria-label="Search teams"
              class="min-w-36 grow basis-[var(--container-2xs)]"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>

            <template #actions>
              <Button
                label="Create Team"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createTeam"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
          <FilterBar
            v-model="filters"
            :fields="filterFields"
          />

          <CardBox :padded="false">
            <template #content>
              <Table
                v-model:globalFilter="search"
                :data="visibleTeams"
                :columns="teamColumns"
                row-key="id"
                enable-sorting
                :border="false"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <Avatar
                      :label="row.name"
                      size="small"
                      kind="square"
                    />
                    <span class="truncate">{{ row.name }}</span>
                  </div>
                </template>

                <template #cell-permissions="{ row }">
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <span class="truncate text-body-sm text-[var(--text-default)]">
                      {{ firstPermission(row) }}
                    </span>

                    <Popover
                      v-if="overflowCount(row)"
                      placement="bottom-start"
                      width="medium"
                    >
                      <Popover.Trigger>
                        <Tooltip text="Show all permissions">
                          <button
                            type="button"
                            :aria-label="`Show all ${row.permissions.length} permissions`"
                            class="inline-flex shrink-0 items-center rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-xs text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
                          >
                            +{{ overflowCount(row) }}
                          </button>
                        </Tooltip>
                      </Popover.Trigger>

                      <Popover.Content>
                        <div
                          class="flex max-h-[var(--container-xs)] flex-col overflow-auto p-[var(--spacing-xxs)]"
                        >
                          <p
                            class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
                          >
                            {{ row.permissions.length }} permissions
                          </p>
                          <span
                            v-for="label in permissionList(row)"
                            :key="label"
                            class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)]"
                          >
                            {{ label }}
                          </span>
                        </div>
                      </Popover.Content>
                    </Popover>
                  </div>
                </template>

                <template #cell-status="{ value }">
                  <Tag
                    :label="value"
                    :severity="teamStatusSeverity(value)"
                    size="medium"
                  />
                </template>

                <template #cell-actions="{ row }">
                  <Dropdown
                    placement="bottom-end"
                    @select="(event, value) => onTeamAction(event, value, row)"
                  >
                    <Dropdown.Trigger>
                      <Tooltip text="Team actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="small"
                          aria-label="Team actions"
                        />
                      </Tooltip>
                    </Dropdown.Trigger>
                    <Dropdown.Group>
                      <Dropdown.Option
                        value="edit"
                        label="Edit"
                      >
                        <template #left>
                          <i
                            class="pi pi-pencil"
                            aria-hidden="true"
                          />
                        </template>
                      </Dropdown.Option>
                      <Dropdown.Option
                        value="duplicate"
                        label="Duplicate"
                      >
                        <template #left>
                          <i
                            class="pi pi-clone"
                            aria-hidden="true"
                          />
                        </template>
                      </Dropdown.Option>
                    </Dropdown.Group>
                    <Dropdown.Group>
                      <Dropdown.Option
                        value="delete"
                        label="Delete"
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

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Team"
      :name="pendingDelete?.name ?? ''"
      @confirm="confirmDelete"
    />
  </div>
</template>
