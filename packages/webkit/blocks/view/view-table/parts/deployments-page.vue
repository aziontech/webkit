<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  import { type Deployment, deploymentColumns, deploymentProperties } from '../lib/deployments'
  import { deploymentsReferenceTime, sampleDeployments } from '../sample'
  import CollectionControls from './collection-controls.vue'
  import DeploymentsTable from './deployments-table.vue'

  const items = ref<Deployment[]>(sampleDeployments)

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items,
    columns: deploymentColumns,
    filtering: { fields: ['version', 'id', 'project', 'environment', 'author', 'status'] },
    propertyFiltering: { properties: deploymentProperties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'deployments-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const deploymentsTableEl = ref<InstanceType<typeof DeploymentsTable> | null>(null)
  const exportCsv = () => deploymentsTableEl.value?.exportCsv('deployments.csv')

  const openDeployment = (row: Deployment) => {
    window.location.assign(`/deployments/${row.id}`)
  }

  let nextDeploymentId = Math.max(...sampleDeployments.map((row) => Number(row.id)))

  const redeploy = (row: Deployment) => {
    nextDeploymentId += 1
    items.value = [
      {
        ...row,
        id: String(nextDeploymentId),
        current: false,
        status: 'Queued',
        duration: '',
        deployedAt: new Date(deploymentsReferenceTime)
      },
      ...items.value
    ]
    toast.success(`${row.version} queued for redeploy.`, { description: row.project })
  }

  const pendingPromotion = ref<Deployment | null>(null)
  const promoteOpen = ref(false)

  const confirmPromote = () => {
    const promoted = pendingPromotion.value
    if (!promoted) return
    items.value = items.value.map((row) => {
      if (row.id === promoted.id) return { ...row, environment: 'Production', current: true }
      if (row.project === promoted.project && row.environment === 'Production')
        return { ...row, current: false }
      return row
    })
    promoteOpen.value = false
    toast.success(`${promoted.version} promoted to production.`, {
      description: promoted.project
    })
  }

  const onRowAction = (value: DropdownMenuItemValue, row: Deployment) => {
    if (value === 'view') openDeployment(row)
    if (value === 'redeploy') redeploy(row)
    if (value === 'promote') {
      pendingPromotion.value = row
      promoteOpen.value = true
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Deployments"
        description="Every deployment of your projects, newest first."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/deployments"
            target="_blank"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <CollectionControls
            :property-filter-props="propertyFilterProps"
            :preferences-props="preferencesProps"
            label="Filter deployments"
            :loading="loading"
            :download-disabled="!matchingItems.length"
            @refresh="refresh"
            @download="exportCsv"
          />
          <section class="flex min-h-0 flex-col">
            <Card
              key="card-1"
              v-if="status === 'empty'"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="medium"
                  icon="az az-cloud-upload"
                  title="No deployments yet"
                  description="Deploy a project and every run shows up here, with its version, status and environment."
                >
                  <template #actions>
                    <Button
                      label="Documentation"
                      icon="az az-book"
                      variant="outline"
                      size="small"
                      href="https://example.com/docs/deployments"
                      target="_blank"
                    />
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Card
              key="card-2"
              v-else
              :padded="false"
            >
              <template #default>
                <DeploymentsTable
                  ref="deploymentsTableEl"
                  :table-props="tableProps"
                  :loading="loading || fetching"
                  @open="(_event, row) => openDeployment(row)"
                  @action="(_event, { value, row }) => onRowAction(value, row)"
                  @clear-filters="clearFilters"
                />
              </template>
            </Card>
          </section>
        </section>
      </section>
    </div>
    <ConfirmDialog
      v-model:open="promoteOpen"
      title="Promote to production"
      variant="primary"
      size="medium"
      confirm-label="Promote"
      @confirm="confirmPromote"
    >
      <p class="m-0 text-body-sm text-(--text-muted)">
        {{ pendingPromotion?.version }} becomes the current production deployment of
        {{ pendingPromotion?.project }}, in place of the one serving traffic now.
      </p>
    </ConfirmDialog>
  </div>
</template>
