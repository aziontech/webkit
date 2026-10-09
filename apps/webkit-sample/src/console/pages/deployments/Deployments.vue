<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import { toast } from '@aziontech/webkit/toast'
  import { consoleDeployRows, deployRows } from '@shared/lib/azion-deploys'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentsTable from '../../components/deployment/DeploymentsTable.vue'
  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { DEPLOYMENT_COLUMNS } from '../../lib/data/deployment-columns'
  import { DEPLOYMENT_HISTORY } from '../../lib/data/deployment-history'
  import { deploymentFilterFields } from '../../lib/data/deployments'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('deployments')

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const byNewest = (a, b) => b.deployedAt - a.deployedAt

  const seededDeployments = computed(() => [...deployRows(), ...DEPLOYMENT_HISTORY].sort(byNewest))

  const allDeployments = computed(() =>
    [...consoleDeployRows(), ...tenancyRows(seededDeployments.value, 'deployments')].sort(byNewest)
  )

  const showFirstUse = computed(() => accountEmpty.value && allDeployments.value.length === 0)

  const deployFields = computed(() =>
    deploymentFilterFields(allDeployments.value, { deployed: true })
  )

  const {
    filters: deployFilters,
    search: deploySearch,
    loading,
    refresh
  } = useListFilters([], allDeployments)

  const deploymentsTableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const openDeployment = (event, row) =>
    router.push({
      path: `/deployments/${row.versionId}`,
      query: {
        email: userEmail.value,
        workload: row.workloadId,
        workloadName: row.workloadName
      }
    })

  const onDeploymentAction = (event, value, row) => {
    if (value === 'details') {
      openDeployment(event, row)
      return
    }
    if (value === 'redeploy') {
      toast.info(`Redeploying version ${row.versionId}.`)
      return
    }
    toast.info(`Promoting version ${row.versionId} to Production.`)
  }
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[{ label: 'Deployments' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="showFirstUse ? 'layout-column-focused' : 'layout-column'"
    >
      <PageHeading
        v-if="!showFirstUse"
        size="medium"
        title="Deployments"
        description="Track every deployment your workloads have published, across all of your resources."
        :documentation="firstUse.learnMore.href"
      />

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
          <ControlsHeader>
            <FilterButton
              v-model="deployFilters"
              :fields="deployFields"
            />
            <InputText
              v-model="deploySearch"
              size="medium"
              placeholder="Search deployments"
              aria-label="Search deployments"
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
                :table="deploymentsTableRef"
                filename="deployments.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="DEPLOYMENT_COLUMNS"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="deployFilters"
            :fields="deployFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <DeploymentsTable
                  ref="deploymentsTableRef"
                  v-model:columnVisibility="columnVisibility"
                  v-model:search="deploySearch"
                  v-model:filters="deployFilters"
                  :deployments="allDeployments"
                  :fields="deployFields"
                  :email="userEmail"
                  :controls="false"
                  :loading="loading"
                  @row-click="openDeployment"
                  @action="onDeploymentAction"
                />
              </template>
            </CardBox>
          </section>
        </section>
      </section>
    </main>
  </AppLayout>
</template>
