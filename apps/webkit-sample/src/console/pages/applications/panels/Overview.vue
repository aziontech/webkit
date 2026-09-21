<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import { toast } from '@aziontech/webkit/toast'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ApplicationSummary from '../../../components/application/ApplicationSummary.vue'
  import DeploymentsTable from '../../../components/deployment/DeploymentsTable.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import SectionHeading from '../../../components/page/SectionHeading.vue'
  import { applicationDeploymentRows } from '../../../lib/data/deployment-history'

  const props = defineProps({
    /** The record this page is about (../../../lib/data/applications.js). */
    application: { type: Object, required: true }
  })

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const deployments = computed(() =>
    applicationDeploymentRows(props.application.id, props.application.name)
  )
  const latest = computed(() => deployments.value[0] ?? null)

  const columnVisibility = { id: false, workloadName: true }

  const visit = () => toast.info('Opening the application in a new tab.')

  const goToBuild = () =>
    router.replace({ query: { ...route.query, tab: 'build' } })

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
    <section
      class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
    >
      <ApplicationSummary
        :application="application"
        :deployment="latest"
        :email="userEmail"
        @visit="visit"
        @connect-repository="goToBuild"
      />

      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <SectionHeading
          anchor
          title="Activity"
          description="Every deployment that shipped this application, newest first."
        >
          <template #actions>
            <HeadingAction
              label="Deploy"
              kind="primary"
              icon="pi pi-cloud-upload"
              @click="deploy"
            />
          </template>
        </SectionHeading>

        <CardBox :padded="false">
          <template #content>
            <DeploymentsTable
              :deployments="deployments"
              :column-visibility="columnVisibility"
              :email="userEmail"
              :controls="false"
              :page-size="10"
              @row-click="openDeployment"
              @action="onRowAction"
            />
          </template>
        </CardBox>
      </section>
    </section>
  </div>
</template>
