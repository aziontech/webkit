<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IdCell from '../../components/list/IdCell.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import {
    CERTIFICATES,
    certificateTypeOptions,
    EXPIRY_WINDOWS,
    matchExpiry
  } from '../../lib/data/certificates'
  import { createResourcePath, resourceSettingsPath } from '../../lib/data/create-resources'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { createdRowsFor, removeCreatedResource } from '../../lib/state/created-resources'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('certificates')

  const certificates = ref([...createdRowsFor('certificates'), ...CERTIFICATES])

  const scopedCertificates = computed(() => tenancyRows(certificates.value, 'certificates', CERTIFICATES))

  const showFirstUse = computed(() => accountEmpty.value && scopedCertificates.value.length === 0)

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', grow: 2 },
    { accessorKey: 'typeLabel', header: 'Type', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'subject', header: 'Subject', grow: 2 },
    { accessorKey: 'issuer', header: 'Issuer', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'expires', header: 'Expires', enableSorting: true, grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, grow: 2 },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const filterFields = [
    {
      id: 'expiry',
      label: 'Expiry',
      kind: 'range',
      options: EXPIRY_WINDOWS,
      match: (certificate, values) => matchExpiry(certificate.expiresAt, values)
    },
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: certificateTypeOptions,
      match: (certificate, values) => values.includes(certificate.type)
    },
    {
      id: 'issuer',
      label: 'Issuer',
      kind: 'options',
      options: [...new Set(CERTIFICATES.map((certificate) => certificate.issuer))]
        .sort((a, b) => a.localeCompare(b))
        .map((issuer) => ({ value: issuer, label: issuer })),
      match: (certificate, values) => values.includes(certificate.issuer)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Expired', label: 'Expired' }
      ],
      match: (certificate, values) => values.includes(certificate.status)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleCertificates,
    loading,
    refresh
  } = useListFilters(filterFields, scopedCertificates, { pageSize: 8 })

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const route = useRoute()
  const router = useRouter()

  const create = () =>
    router.push({
      path: createResourcePath('certificates'),
      query: { email: route.query.email || undefined }
    })

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    removeCreatedResource('certificates', row.id)
    certificates.value = certificates.value.filter((item) => item.id !== row.id)
    toast.success(`${row.name} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, action, row) => {
    if (action === 'edit') {
      router.push({
        path: resourceSettingsPath('certificates', row.id),
        query: { name: row.name, email: route.query.email || undefined }
      })
      return
    }
    if (action === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(row.name, { description: `${action} is disabled in the demo.` })
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Pending: 'warning', Expired: 'danger' })[status] ?? 'secondary'
</script>

<template>
  <AppLayout
    active="certificate-manager"
    :breadcrumb="[{ label: 'Certificate Manager' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="showFirstUse ? 'layout-column-focused' : 'layout-column'"
    >
      <PageHeading
        v-if="!showFirstUse"
        size="medium"
        title="Certificate Manager"
        description="Manage the TLS certificates that serve your domains."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create Certificate"
            kind="outlined"
            icon="pi pi-plus"
            @click="create"
          />
        </template>
      </PageHeading>

      <div
        v-if="showFirstUse"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader v-if="scopedCertificates.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search certificates"
              aria-label="Search certificates"
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
                filename="certificates.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="scopedCertificates.length"
            v-model="filters"
            :fields="filterFields"
          />

          <section
            v-if="!scopedCertificates.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No certificates yet"
                  description="Upload a certificate or request one from Let's Encrypt to serve your domains over TLS."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                      >
                        <i
                          class="ai ai-digital-certificates text-body-md leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create Certificate"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="create"
                    />
                  </template>
                </EmptyState>
              </template>
            </CardBox>
          </section>

          <section
            v-else
            class="flex min-h-0 flex-col"
          >
            <CardBox :padded="false">
              <template #content>
                <TableRoot
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="visibleCertificates"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="loading"
                >
                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="certificate"
                    />
                  </template>

                  <template #cell-subject="{ value }">
                    <span class="min-w-0 truncate">{{ value || '—' }}</span>
                  </template>

                  <template #cell-issuer="{ value }">
                    <span class="min-w-0 truncate">{{ value || '—' }}</span>
                  </template>

                  <template #cell-expires="{ value }">
                    <span class="min-w-0 truncate">{{ value || '—' }}</span>
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="statusSeverity(value)"
                      size="medium"
                    />
                  </template>
                  <template #cell-author="{ row }">
                    <AuthorCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ row }">
                    <LastModifiedCell :date="row.modifiedAt" />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, action) => onRowAction(event, action, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>
                      <Dropdown.Group>
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        >
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="clone"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
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

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="Certificate"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
