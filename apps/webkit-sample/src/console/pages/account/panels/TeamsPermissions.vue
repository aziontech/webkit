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

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../../components/list/DeleteDialog.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { TAG_COLUMN, TAG_LIST_COLUMN_WIDE } from '../../../lib/behavior/table-columns'
  import { permissionLabel, permissionLabelsFor, useTeams } from '../../../lib/data/teams.js'

  // Where `Documentation` on the page heading goes. The docs ROOT, not a deep link: the
  // account-side topics have no entry in lib/data/product-empty-states.js (that
  // registry covers the first-level product modules), and pointing at a path we have
  // not verified is worse than pointing at the index. Replace with the topic's own URL
  // when there is one.
  const HELP = 'https://www.azion.com/en/documentation/'

  const route = useRoute()
  const router = useRouter()

  // Free-text search, hoisted into the ControlsHeader above the card.

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const { teams, createTeam: addTeam, removeTeam } = useTeams()

  const teamColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 2
    },
    { accessorKey: 'permissions', header: 'Permissions', minWidth: TAG_LIST_COLUMN_WIDE },
    { accessorKey: 'status', header: 'Status', minWidth: TAG_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Which columns are switched off, driven by the Columns button on the controls
  // row (../../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever
  // recorded, so this never has to be kept in step with the column model above.
  const columnVisibility = ref({})

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
      // A copy is made to be changed — its name still says "(copy)" — so the toast opens
      // it, the same destination the row's Edit action has.
      toast.success(`Team "${copy.name}" created.`, {
        action: {
          label: 'Open team',
          onClick: () => router.push({ path: `/teams/${copy.id}`, query: teamsQuery() })
        }
      })
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
    visibleRows: visibleTeams,
    loading,
    refresh
  } = useListFilters(filterFields, teams)

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../../components/list/ExportButton.vue), so the file honours the
  // visible columns and the filtered rows instead of re-serialising them here.
  const tableRef = ref(null)
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <!-- The page's action is on the HEADING, not in the controls row below it — see
           the note in ./Credentials.vue. -->
      <PageHeading
        title="Teams Permissions"
        description="Manage your account's teams and the access level each one grants."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Create team"
            kind="primary"
            icon="pi pi-plus"
            @click="createTeam"
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
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <!-- Search drives the table's global filter from outside the card, so the field is
                 a plain InputText (`Table.Search` is context-aware and only works inside
                 `<Table>`). One horizontal band: it grows into the row's slack and compresses
                 rather than wrapping (see ui/ControlsHeader.vue). -->
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search teams"
              aria-label="Search teams"
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
              <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                   than narrow it — fetch it again, take it away as a file, choose which
                   columns it shows. All glyphs, all `medium`, so the row shares one
                   32px height with the field and the Filter button opposite. -->
              <RefreshButton
                :loading="loading"
                @refresh="refresh"
              />
              <ExportButton
                :table="tableRef"
                filename="teams.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="teamColumns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <CardBox :padded="false">
            <template #content>
              <Table
                ref="tableRef"
                v-model:globalFilter="search"
                v-model:columnVisibility="columnVisibility"
                :data="visibleTeams"
                :columns="teamColumns"
                row-key="id"
                enable-sorting
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

                <template #cell-permissions="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate text-body-sm text-(--text-default)">
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
                            class="inline-flex shrink-0 items-center rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-xxs) text-label-xs text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                          >
                            +{{ overflowCount(row) }}
                          </button>
                        </Tooltip>
                      </Popover.Trigger>

                      <Popover.Content>
                        <!-- The count stays OUT of the scroller so it cannot scroll away
                             from the list it counts. -->
                        <p
                          class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-overline-sm text-(--text-muted)"
                        >
                          {{ row.permissions.length }} permissions
                        </p>

                        <!-- BLOCK layout, not `flex flex-col`: a flex column under a
                             max-height shrinks its items to fit instead of overflowing,
                             which clips every line to a sliver and leaves
                             `scrollHeight === clientHeight` so `overflow-auto` has
                             nothing to scroll. `overscroll-contain` keeps the wheel from
                             chaining to the page, which would re-anchor the panel
                             mid-scroll. -->
                        <div
                          class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                        >
                          <span
                            v-for="label in permissionList(row)"
                            :key="label"
                            class="block truncate px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
                            >{{ label }}</span
                          >
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
