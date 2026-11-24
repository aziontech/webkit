<script setup lang="ts">
  import { computed, ref } from 'vue'

  import ApplicationDeploymentsTab from '../parts/application-deployments-tab.vue'
  import ApplicationOverview from '../parts/application-overview.vue'
  import ApplicationVersionsTab from '../parts/application-versions-tab.vue'
  import DeployAction from '../parts/deploy-action.vue'
  import DeployDrawer from '../parts/deploy-drawer.vue'
  import ResourceTabBar from '../parts/resource-tab-bar.vue'
  import TopologyChanges from '../parts/topology-changes.vue'
  import TopologyPanel from '../parts/topology-panel.vue'
  import {
    application as APP,
    applicationDeployments,
    applicationDeploymentSeverity,
    applicationEdges,
    applicationTargets,
    applicationTopology,
    applicationVersions
  } from '../sample'
  import { useTopologyStaging } from '../use-topology-staging'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'topology', label: 'Topology' }
  ]
  const activeTab = ref('overview')
  const expanded = ref(['firewall'])
  const deployOpen = ref(false)

  const staging = useTopologyStaging({
    targets: applicationTargets,
    bound: { firewall: 'edge-guard', function: '' },
    name: APP.name,
    toastId: 'application-deploy',
    dismissOnLeave: true,
    onEdit: () => {
      activeTab.value = 'topology'
    }
  })
  const { stagedCount, stagedChanges, stagedNote, deploying, slotNode } = staging

  const nodes = computed(() => [
    applicationTopology.domain,
    applicationTopology.workload,
    slotNode('firewall'),
    applicationTopology.application,
    slotNode('function')
  ])

  const runDeploy = () => {
    deployOpen.value = false
    staging.deploy()
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
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

    <section class="min-h-0 flex-1">
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <ApplicationOverview
          v-if="activeTab === 'overview'"
          @open-version="activeTab = 'versions'"
        />
        <ApplicationVersionsTab
          v-else-if="activeTab === 'versions'"
          :versions="applicationVersions"
          :latest="APP.version"
        />
        <ApplicationDeploymentsTab
          v-else-if="activeTab === 'deployments'"
          :deployments="applicationDeployments"
          :severity="applicationDeploymentSeverity"
        />
        <TopologyPanel
          v-else
          v-model:open-keys="expanded"
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
          description="How a request reaches this application in Production. Bind or remove a firewall or a function here; the change is staged until you deploy."
          :nodes="nodes"
          :edges="applicationEdges"
          :staged-count="stagedCount"
          :staged-note="stagedNote"
          @bind="staging.bind"
          @remove="staging.unbind"
          @create="staging.createTarget"
        />
      </div>
    </section>

    <DeployDrawer
      v-model:open="deployOpen"
      :title="`Deploy ${APP.name}`"
      @deploy="runDeploy"
    >
      <template #description>
        Version {{ APP.version }} goes to Production. The version that is live keeps serving until
        the new one is ready.
      </template>
      <TopologyChanges
        heading-id="application-deploy-changes"
        :changes="stagedChanges"
        empty-text="No topology change is staged. The deploy publishes the active version as it is."
      />
    </DeployDrawer>
  </div>
</template>
