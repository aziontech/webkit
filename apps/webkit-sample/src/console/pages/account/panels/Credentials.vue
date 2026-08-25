<script setup>
  // Settings → Credentials. The API tokens used to authenticate against this account.
  //
  // LAYOUT — a LIST band on the DATA measure (`.layout-column`). The page stack has
  // no vertical gap: it holds the heading plus ONE band below it — the controls row
  // over the table it narrows — which carries the band step and stacks its two parts
  // at the group step (see src/styles/layout.css). It owns its
  // own scroll region because the shell hands each tab a plain flex column (see
  // AccountSettings.vue).
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
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

  // Where `Documentation` on the page heading goes. The docs ROOT, not a deep link: the
  // account-side topics have no entry in lib/data/product-empty-states.js (that
  // registry covers the first-level product modules), and pointing at a path we have
  // not verified is worse than pointing at the index. Replace with the topic's own URL
  // when there is one.
  const HELP = 'https://www.azion.com/en/documentation/'

  const credentials = ref([
    {
      id: 'c-1',
      name: 'Production API',
      token: 'azion_prod_9f3a1c7e',
      created: 'January 12, 2026',
      lastUsed: '2 hours ago',
      status: 'Active'
    },
    {
      id: 'c-2',
      name: 'CI / CD Pipeline',
      token: 'azion_ci_4b8d2f0a',
      created: 'March 03, 2026',
      lastUsed: 'Yesterday',
      status: 'Active'
    },
    {
      id: 'c-3',
      name: 'Staging Sandbox',
      token: 'azion_stg_1e6c9a4d',
      created: 'May 21, 2026',
      lastUsed: '1 week ago',
      status: 'Active'
    },
    {
      id: 'c-4',
      name: 'Legacy Integration',
      token: 'azion_leg_7d2f5b8c',
      created: 'November 08, 2025',
      lastUsed: '3 months ago',
      status: 'Revoked'
    }
  ])

  // ── The filter catalog ────────────────────────────────────────────────────
  // Status is the one enumerable column — Name and Token are free text, and
  // Created / Last Used are display strings with no instant behind them to compare.
  const filterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Revoked', label: 'Revoked' }
      ],
      match: (credential, values) => values.includes(credential.status)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleCredentials,
    loading,
    refresh
  } = useListFilters(filterFields, credentials, { pageSize: 10 })

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../../components/list/ExportButton.vue), so the file honours the
  // visible columns and the filtered rows instead of re-serialising them here.
  const tableRef = ref(null)

  const credentialColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'token', header: 'Token', grow: 2 },
    { accessorKey: 'created', header: 'Created', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'lastUsed', header: 'Last used', minWidth: FIT_COLUMN },
    { accessorKey: 'status', header: 'Status', minWidth: TAG_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Which columns are switched off, driven by the Columns button on the controls
  // row (../../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever
  // recorded, so this never has to be kept in step with the column model above.
  const columnVisibility = ref({})

  // The same map, with the same keys and the same severities, that every other table in
  // the console uses for a credential's life (../PersonalTokens.vue). It was a ternary —
  // Active or else danger — which read the same today, when Revoked is the only other
  // status, and would have painted the first Pending or Inactive credential red.
  const credentialStatusSeverity = (status) =>
    ({ Active: 'success', Expired: 'danger', Revoked: 'danger' })[status] ?? 'secondary'

  const createCredential = () =>
    toast.success('Credential created (demo).', {
      description: "Copy the token now — it won't be shown again."
    })

  const onCredentialAction = (event, value, row) => {
    if (value === 'revoke') {
      credentials.value = credentials.value.map((credential) =>
        credential.id === row.id ? { ...credential, status: 'Revoked' } : credential
      )
      toast.success(`${row.name} revoked.`)
      return
    }
    toast.info(`${row.name}`, { description: row.token })
  }
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <!-- The page's action is on the HEADING, not in the controls row below it: the
           controls narrow the list, the heading acts on the module (../../components/
           page/ControlsHeader.vue states the same rule). It sat in that row, which left
           a 32px primary under the 40px Documentation beside it — the page's own action
           reading as the smaller of the two. -->
      <PageHeading
        title="Credentials"
        description="Manage the API tokens used to authenticate against this account."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Create credential"
            kind="primary"
            icon="pi pi-plus"
            @click="createCredential"
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
              placeholder="Search credentials"
              aria-label="Search credentials"
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
                filename="credentials.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="credentialColumns"
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
                v-model:pagination="pagination"
                v-model:globalFilter="search"
                v-model:columnVisibility="columnVisibility"
                :data="visibleCredentials"
                :columns="credentialColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :border="false"
                :loading="loading"
              >
                <!-- A token is data, not code: it keeps the cell's own type and
                     --text-default, so a row reads at one weight across its columns
                     (Applications.vue's list is the reference). -->
                <template #cell-token="{ value }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="min-w-0 truncate">{{ value }}</span>
                    <CopyButton
                      kind="outlined"
                      :value="value"
                      aria-label="Copy token"
                    />
                  </div>
                </template>

                <template #cell-status="{ value }">
                  <Tag
                    :label="value"
                    :severity="credentialStatusSeverity(value)"
                    size="medium"
                  />
                </template>

                <template #cell-actions="{ row }">
                  <Dropdown
                    placement="bottom-end"
                    @select="(event, value) => onCredentialAction(event, value, row)"
                  >
                    <Dropdown.Trigger>
                      <Tooltip text="Credential actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="small"
                          aria-label="Credential actions"
                        />
                      </Tooltip>
                    </Dropdown.Trigger>
                    <Dropdown.Group>
                      <Dropdown.Option
                        value="view"
                        label="View details"
                      />
                    </Dropdown.Group>
                    <Dropdown.Group>
                      <Dropdown.Option
                        value="revoke"
                        label="Revoke"
                      >
                        <template #left>
                          <i
                            class="pi pi-ban"
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
