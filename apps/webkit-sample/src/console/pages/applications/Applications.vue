<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
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
  import DomainCell from '../../components/list/DomainCell.vue'
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
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN } from '../../lib/behavior/table-columns'
  import { APPLICATIONS } from '../../lib/data/applications'
  import { latestApplicationDeployment } from '../../lib/data/deployment-history'
  import { statusMeta, statusOptions } from '../../lib/data/deployments'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { provisionedApplications, removeDeployment } from '../../lib/data/provisioning'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('applications')

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const applications = ref([...APPLICATIONS])

  const withDeploymentStatus = (application) => ({
    ...application,
    status: latestApplicationDeployment(application.id, application.name)?.status ?? ''
  })

  const withDomains = (application) => {
    const custom = (application.customDomains ?? []).map((entry) => entry.domain)
    const domains = [...custom, application.domainName].filter(Boolean)
    return {
      ...application,
      domainName: domains[0] ?? '',
      domains,
      domainCount: Math.max(domains.length - 1, 0)
    }
  }

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'repository', header: 'Repository', grow: 2 },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'domainName', header: 'Domain Name', grow: 3 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const authorOptions = [
    ...new Map(applications.value.map((app) => [app.author, app.authorAvatar]))
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([author, avatar]) => ({ value: author, label: author, avatar }))

  const applicationStatuses = new Set(
    applications.value.map((app) => withDeploymentStatus(app).status)
  )
  const statusFilterOptions = statusOptions.filter((option) =>
    applicationStatuses.has(option.value)
  )

  const filterFields = [
    {
      id: 'author',
      label: 'Author',
      kind: 'options',
      options: authorOptions,
      match: (app, values) => values.includes(app.author)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: statusFilterOptions,
      match: (app, values) => values.includes(app.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (app, values) => matchDate(app.modifiedAt, values)
    }
  ]

  const allApplications = computed(() =>
    [...provisionedApplications.value, ...tenancyRows(applications.value, 'applications')]
      .map(withDeploymentStatus)
      .map(withDomains)
  )

  const {
    filters,
    search,
    pagination,
    visibleRows: filteredApplications,
    loading,
    refresh
  } = useListFilters(filterFields, allApplications)

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const createApplication = () =>
    router.push({ path: '/applications/new', query: { email: userEmail.value } })

  const openApp = (event, row) =>
    router.push({
      path: `/applications/${row.id}`,
      query: { email: userEmail.value }
    })

  const connectGit = (row) =>
    router.push({
      path: `/applications/${row.id}`,
      query: { email: userEmail.value, tab: 'build' }
    })

  const openDeploy = (row) => {
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        scopedType: 'application',
        resourceId: row.name
      }
    })
  }

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    removeDeployment(row.id)
    applications.value = applications.value.filter((app) => app.id !== row.id)
    toast.success(`${row.name} deleted`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'deploy') {
      openDeploy(row)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    if (value === 'view') {
      openApp(event, row)
      return
    }
    const copy = {
      edit: `Editing ${row.name}`,
      duplicate: `Duplicating ${row.name}`
    }
    toast.info(copy[value] ?? row.name, { description: `Application ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="Applications"
        description="Build, deploy, and manage your applications."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create Application"
            kind="outlined"
            icon="pi pi-plus"
            @click="createApplication"
          />
        </template>
      </PageHeading>

      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search"
              aria-label="Search applications"
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
                filename="applications.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <TableRoot
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="filteredApplications"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="loading"
                  @row-click="openApp"
                >
                  <template #cell-name="{ value, row }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        :class="presetIcon(row.preset)"
                        class="shrink-0 text-body-lg"
                        :title="presetLabel(row.preset)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-repository="{ value, row }">
                    <Tag
                      v-if="value"
                      severity="secondary"
                      size="medium"
                      icon="pi pi-github"
                      rounded
                      class="max-w-full"
                    >
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </Tag>
                    <button
                      v-else
                      type="button"
                      class="inline-flex min-w-0 items-center rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                      @click.stop="connectGit(row)"
                    >
                      <span class="truncate">Connect Git Repository</span>
                    </button>
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="application"
                    />
                  </template>

                  <template #cell-domainName="{ value, row }">
                    <DomainCell
                      :value="value"
                      :domains="row.domains"
                      :count="row.domainCount"
                    />
                  </template>

                  <template #cell-status="{ value }">
                    <StatusIndicator
                      v-if="value"
                      :severity="statusMeta(value).severity"
                      :loading="statusMeta(value).loading"
                      :label="value"
                    />
                    <span
                      v-else
                      class="text-body-sm text-(--text-disabled)"
                      >Not deployed</span
                    >
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
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Row actions">
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
                          value="deploy"
                          label="Deploy"
                        >
                          <template #left>
                            <i
                              class="pi pi-cloud-upload"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="view"
                          label="View details"
                        >
                          <template #left>
                            <i
                              class="pi pi-eye"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
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
                          label="Clone"
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
                </TableRoot>
              </template>
            </CardBox>
          </section>
        </section>
      </section>

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="Application"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
