<script setup lang="ts">
  import { computed, ref } from 'vue'

  import DeployAction from '../parts/deploy-action.vue'
  import DeployDrawer from '../parts/deploy-drawer.vue'
  import ResourceTabBar from '../parts/resource-tab-bar.vue'
  import ServiceEnvironmentSwitch from '../parts/service-environment-switch.vue'
  import ServiceOverviewTab from '../parts/service-overview-tab.vue'
  import TabRouteEmpty from '../parts/tab-route-empty.vue'
  import TopologyChanges from '../parts/topology-changes.vue'
  import { serviceTargets } from '../sample'
  import { useTopologyStaging } from '../use-topology-staging'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('overview')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const environment = ref('Production')
  const deployOpen = ref(false)
  const overviewEl = ref<InstanceType<typeof ServiceOverviewTab> | null>(null)

  const staging = useTopologyStaging({
    targets: serviceTargets,
    bound: { policy: '', errorPage: '', origin: 'web-app-storage' },
    name: 'service-01',
    toastId: 'service-deploy',
    onEdit: () => overviewEl.value?.reveal()
  })
  const { stagedCount, stagedChanges, deploying } = staging

  const runDeploy = () => {
    deployOpen.value = false
    staging.deploy()
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <ServiceEnvironmentSwitch
      v-model:environment="environment"
      service="service-01"
    />
    <ResourceTabBar
      v-model="activeTab"
      :tabs="tabs"
    >
      <template #actions>
        <DeployAction
          :staged-count="stagedCount"
          :loading="deploying"
          @deploy="deployOpen = true"
        />
      </template>
    </ResourceTabBar>

    <section
      v-if="activeTab === 'overview'"
      class="min-h-0 flex-1"
    >
      <ServiceOverviewTab
        ref="overviewEl"
        v-model:environment="environment"
        :staging="staging"
      />
    </section>
    <section
      v-else
      class="min-h-0 flex-1"
    >
      <TabRouteEmpty
        :label="tabLabel"
        :href="`/services/service-01/${activeTab}`"
      />
    </section>

    <DeployDrawer
      v-model:open="deployOpen"
      title="Deploy service-01"
      @deploy="runDeploy"
    >
      <template #description>
        The service goes to Production with the changes below. The deployment that is live keeps
        serving until the new one is ready.
      </template>
      <TopologyChanges
        heading-id="service-deploy-changes"
        :changes="stagedChanges"
        empty-text="No topology change is staged. The deploy publishes the service as it is."
      />
    </DeployDrawer>
  </div>
</template>
