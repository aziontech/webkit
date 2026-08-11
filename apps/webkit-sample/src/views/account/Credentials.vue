<script setup>
  // Settings → Credentials. The API tokens used to authenticate against this account.
  //
  // LAYOUT — a LIST band on the DATA measure (`.layout-column`). The page stack has
  // no vertical gap: it holds the heading plus ONE band below it — the controls row
  // over the table it narrows — which carries the band step and stacks its two parts
  // at the group step (see src/styles/layout.css). It owns its
  // own scroll region because the shell hands each tab a plain flex column (see
  // AccountSettings.vue).
  import Button from '@aziontech/webkit/button'
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

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import FilterBar from '../../components/ui/FilterBar.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import { useListFilters } from '../../lib/list-state'


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
    visibleRows: visibleCredentials
  } = useListFilters(filterFields, credentials, { pageSize: 10 })

  const credentialColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'token', header: 'Token', grow: 2 },
    { accessorKey: 'created', header: 'Created', enableSorting: true },
    { accessorKey: 'lastUsed', header: 'Last Used' },
    { accessorKey: 'status', header: 'Status' },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const credentialStatusSeverity = (status) => (status === 'Active' ? 'success' : 'danger')

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
              placeholder="Search credentials..."
              aria-label="Search credentials"
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
                label="Create Credential"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createCredential"
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
                v-model:pagination="pagination"
                v-model:globalFilter="search"
                :data="visibleCredentials"
                :columns="credentialColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :border="false"
              >
                <!-- A token is data, not code: it keeps the cell's own type and
                     --text-default, so a row reads at one weight across its columns
                     (Applications.vue's list is the reference). -->
                <template #cell-token="{ value }">
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
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
