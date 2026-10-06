<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
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

  const tableRef = ref(null)

  const credentialColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'token', header: 'Token', grow: 2 },
    { accessorKey: 'created', header: 'Created', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'lastUsed', header: 'Last used', minWidth: FIT_COLUMN },
    { accessorKey: 'status', header: 'Status', minWidth: TAG_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const columnVisibility = ref({})

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
      <PageHeading
        title="Credentials"
        description="Manage the API tokens used to authenticate against this account."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Create Credential"
            kind="outlined"
            icon="pi pi-plus"
            @click="createCredential"
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
              <TableRoot
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
              </TableRoot>
            </template>
          </CardBox>
        </section>
      </section>
    </section>
  </div>
</template>
