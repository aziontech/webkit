<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentsTable from '../../../components/deployment/DeploymentsTable.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { applicationDeploymentRows } from '../../../lib/data/deployment-history'
  import { deploymentFilterFields } from '../../../lib/data/deployments'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  const props = defineProps({
    /** The record this page is about (../../../lib/data/applications.js). */
    application: { type: Object, required: true }
  })

  const HELP = productFirstUse('deployments').learnMore.href

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const deployments = computed(() =>
    applicationDeploymentRows(props.application.id, props.application.name)
  )

  const deployFields = computed(() => deploymentFilterFields(deployments.value))
  const deploySearch = ref('')
  const deployFilters = ref({})
  const deployColumns = ref({ id: false })

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)

  const deploy = () =>
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        scopedType: 'application',
        resourceId: props.application.name
      }
    })

  const openDeployment = (event, row) =>
    router.push({
      path: `/deployments/${row.versionId}`,
      query: {
        email: userEmail.value,
        application: props.application.id,
        applicationName: props.application.name
      }
    })

  const onRowAction = (event, value, row) => {
    if (value === 'details') {
      openDeployment(event, row)
      return
    }
    if (value === 'redeploy') {
      toast.info(`Redeploying version ${row.versionId}.`)
      return
    }
    toast.info(`Promoting version ${row.versionId}.`)
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Deployments"
      description="Every deployment that shipped this application, newest first."
      size="small"
      :documentation="HELP"
    >
      <template #actions>
        <HeadingAction
          label="Deploy"
          kind="primary"
          icon="pi pi-cloud-upload"
          @click="deploy"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
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
              :table="tableRef"
              filename="deployments.csv"
            />
          </template>
        </ControlsHeader>

        <FilterChips
          v-model="deployFilters"
          :fields="deployFields"
        />

        <CardBox :padded="false">
          <template #content>
            <DeploymentsTable
              ref="tableRef"
              v-model:search="deploySearch"
              v-model:filters="deployFilters"
              v-model:column-visibility="deployColumns"
              :deployments="deployments"
              :fields="deployFields"
              :email="userEmail"
              :controls="false"
              :loading="loading"
              @row-click="openDeployment"
              @action="onRowAction"
            />
          </template>
        </CardBox>
      </section>
    </section>
  </div>
</template>
