<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FlowDiagramBind from '@aziontech/webkit/flow-diagram-bind'
  import type {
    FlowDiagramEdgeData,
    FlowDiagramNodeData
  } from '@aziontech/webkit/flow-diagram-root'
  import FlowDiagram from '@aziontech/webkit/flow-diagram-root'
  import Link from '@aziontech/webkit/link'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import ApplicationAddressBand from '../parts/application-address-band.vue'
  import ApplicationDeploymentsTab from '../parts/application-deployments-tab.vue'
  import ApplicationVersionsTab from '../parts/application-versions-tab.vue'
  import DeployAction from '../parts/deploy-action.vue'
  import { type TopologyTarget, useTopologyStaging } from '../use-topology-staging'

  const APP = {
    name: 'storefront-app',
    host: 'storefront-app-k3m9.azion.app',
    deployment: '4182093317',
    version: 'BX7Q2LMA'
  }

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'topology', label: 'Topology' }
  ]
  const activeTab = ref('overview')

  const facts = [
    { label: 'Active version', value: APP.version, code: true },
    { label: 'Framework', value: 'Vite' },
    { label: 'Source', value: 'acme/storefront (main)' },
    { label: 'Created', value: '2 weeks ago by Mara Lin', author: 'Mara Lin' }
  ]

  const versions = [
    {
      id: 'BX7Q2LMA',
      name: 'BX7Q2LMA',
      description: 'Cache product images for 7 days',
      state: 'Active',
      createdAgo: '3 hours ago'
    },
    {
      id: 'BW1K8RTE',
      name: 'BW1K8RTE',
      description: 'Add rule"Redirect old checkout"',
      state: 'Ready',
      createdAgo: 'Yesterday'
    },
    {
      id: 'BV4N6PXD',
      name: 'BV4N6PXD',
      description: 'Bypass cache for /api/*',
      state: 'Ready',
      createdAgo: '4 days ago'
    }
  ]
  const deployments = [
    {
      id: '4182093317',
      version: 'BX7Q2LMA',
      environment: 'Production',
      status: 'Live',
      createdAgo: '3 hours ago'
    },
    {
      id: '4181877250',
      version: 'BW1K8RTE',
      environment: 'Preview',
      status: 'Live',
      createdAgo: 'Yesterday'
    },
    {
      id: '4180412906',
      version: 'BW1K8RTE',
      environment: 'Production',
      status: 'Failed',
      createdAgo: 'Yesterday'
    }
  ]
  const deploymentSeverity: Record<string, StatusIndicatorSeverity> = {
    Live: 'success',
    Failed: 'danger',
    Building: 'info'
  }

  const targets: Record<string, TopologyTarget> = {
    firewall: {
      kind: 'Firewall',
      icon: 'az az-shield',
      options: [
        { value: 'edge-guard', label: 'edge-guard' },
        { value: 'strict-waf', label: 'strict-waf' }
      ],
      unbound: 'Requests reach the application without inspection.'
    },
    function: {
      kind: 'Function instance',
      icon: 'az az-code',
      options: [
        { value: 'geo-redirect', label: 'geo-redirect' },
        { value: 'ab-split', label: 'ab-split' }
      ],
      unbound: 'No function runs before the cache.'
    }
  }

  const expanded = ref(['firewall'])
  const deployOpen = ref(false)

  const {
    stagedCount,
    stagedChanges,
    stagedNote,
    deploying,
    slotNode,
    bind,
    unbind,
    createTarget,
    deploy
  } = useTopologyStaging({
    targets,
    bound: { firewall: 'edge-guard', function: '' },
    name: APP.name,
    toastId: 'application-deploy',
    dismissOnLeave: true,
    onEdit: () => {
      activeTab.value = 'topology'
    }
  })

  const nodes = computed<FlowDiagramNodeData[]>(() => [
    {
      id: 'domain',
      eyebrow: 'Domain',
      icon: 'az az-globe',
      title: 'shop.example.com',
      status: 'Live',
      severity: 'success'
    },
    {
      id: 'workload',
      eyebrow: 'Workload',
      icon: 'az az-sitemap',
      title: 'storefront',
      status: 'Active',
      severity: 'success'
    },
    slotNode('firewall'),
    {
      id: 'application',
      eyebrow: 'Application',
      icon: 'az az-box',
      title: APP.name,
      status: 'Active',
      severity: 'success'
    },
    slotNode('function')
  ])

  const edges: FlowDiagramEdgeData[] = [
    { from: 'domain', to: 'workload' },
    { from: 'workload', to: 'firewall' },
    { from: 'firewall', to: 'application' },
    { from: 'application', to: 'function' }
  ]

  const runDeploy = () => {
    deployOpen.value = false
    deploy()
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <DeployAction
            :staged-count="stagedCount"
            :loading="deploying"
            @deploy="deployOpen = true"
          />
        </template>
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <section
          v-if="activeTab === 'overview'"
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
        >
          <Card :padded="false">
            <template #default>
              <ApplicationAddressBand
                :host="APP.host"
                icon="az az-box"
              />

              <dl
                class="m-0 grid grid-cols-1 gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md) sm:grid-cols-3 lg:grid-cols-6"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                  <dt class="text-label-sm text-(--text-muted)">Deployment</dt>
                  <dd class="m-0 flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <Link
                      :label="APP.deployment"
                      :href="`/deployments/${APP.deployment}`"
                      size="small"
                    />
                    <Tag
                      label="Production"
                      severity="neutral"
                      size="small"
                      class="shrink-0"
                    />
                  </dd>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                  <dt class="text-label-sm text-(--text-muted)">Status</dt>
                  <dd class="m-0 flex min-h-7 items-center">
                    <StatusIndicator
                      severity="success"
                      label="Ready"
                    />
                  </dd>
                </div>
                <div
                  v-for="fact in facts"
                  :key="fact.label"
                  class="flex min-w-0 flex-col gap-(--spacing-2xs)"
                >
                  <dt class="text-label-sm text-(--text-muted)">{{ fact.label }}</dt>
                  <dd class="m-0 flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      v-if="fact.author"
                      :label="fact.author"
                      size="small"
                    />
                    <span
                      class="truncate text-body-sm text-(--text-default)"
                      :class="fact.code && 'font-(family-name:--font-code)'"
                      >{{ fact.value }}</span
                    >
                  </dd>
                </div>
              </dl>

              <div
                class="flex flex-wrap items-center justify-between gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
              >
                <p class="m-0 text-body-sm text-(--text-muted)">
                  Settings, cache and rules live on a version. Open the active version to change
                  them, then deploy it.
                </p>
                <Button
                  label="Open active version"
                  variant="outline"
                  size="small"
                  @click="activeTab = 'versions'"
                />
              </div>
            </template>
          </Card>
        </section>

        <ApplicationVersionsTab
          v-else-if="activeTab === 'versions'"
          :versions="versions"
          :latest="APP.version"
        />

        <ApplicationDeploymentsTab
          v-else-if="activeTab === 'deployments'"
          :deployments="deployments"
          :severity="deploymentSeverity"
        />

        <section
          v-else
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
        >
          <Subheader
            title="Deployment topology"
            description="How a request reaches this application in Production. Bind or remove a firewall or a function here; the change is staged until you deploy."
            size="small"
          />
          <div
            class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <FlowDiagram
              v-model:open-keys="expanded"
              :nodes="nodes"
              :edges="edges"
              aria-label="Deployment topology"
            >
              <template #actions="{ node }">
                <FlowDiagramBind
                  v-if="node.bindable"
                  :label="node.eyebrow"
                  :options="node.bindOptions"
                  :value="node.boundValue"
                  :removable="node.removable"
                  @bind="(_event, value) => bind(node.id, value)"
                  @remove="() => unbind(node.id)"
                  @create="() => createTarget(node.id)"
                />
              </template>
            </FlowDiagram>
          </div>
          <p
            role="status"
            class="m-0 text-body-sm text-(--text-muted)"
          >
            {{ stagedCount ? `${stagedNote} ${stagedCount} staged. Deploy to apply.` : stagedNote }}
          </p>
        </section>
      </div>
    </section>

    <Drawer
      v-model:open="deployOpen"
      side="end"
      size="large"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Deploy {{ APP.name }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DrawerDescription>
              Version {{ APP.version }} goes to Production. The version that is live keeps serving
              until the new one is ready.
            </DrawerDescription>
            <section
              aria-labelledby="application-deploy-changes"
              class="flex flex-col gap-(--spacing-xs)"
            >
              <h3
                id="application-deploy-changes"
                class="m-0 text-label-md text-(--text-default)"
              >
                Topology changes
              </h3>
              <ul
                v-if="stagedChanges.length"
                class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="change in stagedChanges"
                  :key="change.key"
                  class="flex flex-wrap items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="text-body-sm text-(--text-default)">{{ change.kind }}</span>
                  <span class="text-body-sm text-(--text-muted)"
                    >{{ change.from }} to {{ change.to }}</span
                  >
                </li>
              </ul>
              <p
                v-else
                class="m-0 text-body-sm text-(--text-muted)"
              >
                No topology change is staged. The deploy publishes the active version as it is.
              </p>
            </section>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Cancel"
              variant="outline"
              @click="deployOpen = false"
            />
            <Button
              label="Deploy"
              variant="primary"
              icon="az az-cloud-upload"
              @click="runDeploy"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
