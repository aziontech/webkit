<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FlowDiagramBind from '@aziontech/webkit/flow-diagram-bind'
  import type {
    FlowDiagramEdgeData,
    FlowDiagramNodeData
  } from '@aziontech/webkit/flow-diagram-root'
  import FlowDiagram from '@aziontech/webkit/flow-diagram-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Subheader from '@aziontech/webkit/subheader'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import DeployAction from '../parts/deploy-action.vue'
  import { type TopologyTarget, useTopologyStaging } from '../use-topology-staging'
  import DetailResourceService from './service.vue'

  type ProductionStep = {
    id: string
    icon: string
    title: string
    description: string
    actionLabel: string
    done: boolean
    doneNote?: string
  }

  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('overview')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const environment = ref('Production')
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((option) => option.name.toLowerCase().includes(needle))
  })

  const productionSteps: ProductionStep[] = [
    {
      id: 'domain',
      icon: 'az az-globe',
      title: 'Add a custom domain',
      description:
        'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
      actionLabel: 'Add Domain',
      done: false
    },
    {
      id: 'policy',
      icon: 'az az-shield',
      title: 'Enable a security policy',
      description:
        'Bind a policy so requests are inspected before they reach the resource. Rate limiting, request inspection, and IP filtering.',
      actionLabel: 'Bind Policy',
      done: false
    },
    {
      id: 'errorPage',
      icon: 'az az-file',
      title: 'Set custom error pages',
      description: 'Answer 4xx and 5xx with your own page instead of the default response.',
      actionLabel: 'Bind Error Page',
      done: false
    }
  ]

  const SERVICE = { name: 'service-01' }

  const detailOpen = ref(false)

  const targets: Record<string, TopologyTarget> = {
    policy: {
      kind: 'Policy',
      icon: 'az az-shield',
      options: [
        { value: 'payments-api', label: 'payments-api' },
        { value: 'api-hardening', label: 'api-hardening' },
        { value: 'partner-gateway', label: 'partner-gateway' },
        { value: 'production-policy', label: 'production-policy' },
        { value: 'canary-policy', label: 'canary-policy' }
      ],
      unbound: 'Requests reach the resource without inspection.'
    },
    errorPage: {
      kind: 'Error Page',
      icon: 'az az-file',
      options: [
        { value: 'Branded 404', label: 'Branded 404' },
        { value: 'Maintenance window', label: 'Maintenance window' },
        { value: 'Server error', label: 'Server error' },
        { value: 'Blocked by policy', label: 'Blocked by policy' },
        { value: 'Rate limited', label: 'Rate limited' }
      ],
      unbound: 'Errors answer with the default page.'
    },
    origin: {
      kind: 'Origin',
      icon: 'az az-link',
      options: [
        { value: 'web-app-storage', label: 'web-app-storage' },
        { value: 'api-primary', label: 'api-primary' },
        { value: 'assets-storage', label: 'assets-storage' },
        { value: 'api-failover', label: 'api-failover' },
        { value: 'uploads', label: 'uploads' }
      ],
      removable: false,
      bound:
        'Provisioned with this service. It is the resource’s origin, so it can be re-pointed but not removed.',
      fields: [
        { label: 'ID', value: '1599818521' },
        { label: 'Type', value: 'Storage' },
        { label: 'Address', value: 'web-app-assets' }
      ]
    }
  }

  const expanded = ref<string[]>([])
  const deployOpen = ref(false)
  const topologyEl = ref<HTMLElement | null>(null)

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
    bound: { policy: '', errorPage: '', origin: 'web-app-storage' },
    name: SERVICE.name,
    toastId: 'service-deploy',
    onEdit: () => topologyEl.value?.scrollIntoView({ block: 'start' })
  })

  const topologyNodes = computed<FlowDiagramNodeData[]>(() => [
    {
      id: 'domains',
      eyebrow: 'Domains',
      icon: 'az az-globe',
      title: 'service-01.example.com',
      status: '1 domain',
      severity: 'neutral',
      fields: [
        {
          label: 'Generated domain',
          value: 'service-01.example.com',
          copyable: true,
          href: 'https://service-01.example.com'
        }
      ]
    },
    {
      id: 'service',
      eyebrow: 'Service',
      icon: 'az az-server',
      title: SERVICE.name,
      status: 'Live',
      severity: 'success',
      href: '/services/1020655',
      fields: [
        { label: 'ID', value: '1020655' },
        {
          label: 'Domain',
          value: 'service-01.example.com',
          copyable: true,
          href: 'https://service-01.example.com'
        },
        { label: 'Environment', value: 'Production' }
      ]
    },
    slotNode('policy'),
    {
      id: 'resource',
      eyebrow: 'Resource',
      icon: 'az az-box',
      title: 'web-app',
      status: 'Active',
      severity: 'success',
      href: '/resources/1170472732',
      fields: [
        { label: 'ID', value: '1170472732' },
        { label: 'Repository', value: 'acme/web-app' },
        { label: 'Branch', value: 'main' }
      ]
    },
    slotNode('errorPage'),
    slotNode('origin'),
    {
      id: 'storage',
      eyebrow: 'Storage',
      icon: 'az az-inbox',
      title: 'web-app-assets',
      status: 'Public',
      severity: 'info',
      href: '/storage/web-app-assets',
      fields: [
        { label: 'Access', value: 'Public' },
        { label: 'Files', value: '24' },
        { label: 'Size', value: '1.2 MB' }
      ]
    }
  ])

  const topologyEdges: FlowDiagramEdgeData[] = [
    { from: 'domains', to: 'service' },
    { from: 'service', to: 'policy' },
    { from: 'policy', to: 'resource' },
    { from: 'policy', to: 'errorPage' },
    { from: 'resource', to: 'origin' },
    { from: 'origin', to: 'storage' }
  ]

  const showTopology = (key: string) => {
    detailOpen.value = false
    if (!expanded.value.includes(key)) expanded.value = [...expanded.value, key]
    topologyEl.value?.scrollIntoView({ block: 'start' })
  }

  const runDeploy = () => {
    deployOpen.value = false
    deploy()
  }

  const doneCount = computed(() => productionSteps.filter((step) => step.done).length)
  const complete = computed(
    () => productionSteps.length > 0 && doneCount.value === productionSteps.length
  )

  const STEP_MEDIA_CLASS =
    'flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ' +
    'ease-productive-entrance ' +
    'group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Services', href: '/services' },
        { label: SERVICE.name, href: '/services/1020655' }
      ]"
    >
      <Select
        :model-value="environment"
        :display-value="(value) => String(value ?? '')"
        variant="ghost"
        size="small"
        @update:model-value="
          (value) => {
            if (value !== '__add-environment__') environment = String(value)
          }
        "
        @update:open="
          (open) => {
            if (!open) environmentQuery = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch environment" />
        <Select.Content>
          <template #search>
            <Input
              v-model="environmentQuery"
              size="small"
              placeholder="Search environments"
              aria-label="Search environments"
              @keydown.stop
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Environments">
            <Select.Item
              v-for="option in environmentMatches"
              :key="option.name"
              :value="option.name"
            >
              {{ option.name }}
              <template #tag>
                <Tag
                  :label="option.policy"
                  severity="neutral"
                  size="small"
                />
              </template>
            </Select.Item>
            <p
              v-if="!environmentMatches.length"
              class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
            >
              No environments match "{{ environmentQuery }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Item
              value="__add-environment__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="az az-circle-plus"
                  aria-hidden="true"
                />
                Add Environment
              </span>
            </Select.Item>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumb>
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

    <section
      v-if="activeTab === 'overview'"
      class="min-h-0 flex-1"
    >
      <div>
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <DetailResourceService v-model:environment="environment" />

            <Card
              :padded="false"
              :data-complete="complete || null"
            >
              <template #header>
                <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
                  <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

                  <Tag
                    :label="
                      complete
                        ? 'Ready for production'
                        : `${doneCount} of ${productionSteps.length}`
                    "
                    :severity="complete ? 'success' : 'neutral'"
                    size="small"
                    class="shrink-0"
                  />
                </div>

                <IconButton
                  icon="az az-app-window"
                  aria-label="Expand the production checklist"
                  variant="outline"
                  size="small"
                  class="shrink-0"
                  @click="detailOpen = true"
                />
              </template>

              <template #default>
                <div
                  v-if="!complete"
                  class="flex flex-col"
                >
                  <div
                    v-for="step in productionSteps"
                    :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
                    :data-done="step.done || null"
                    class="group/step transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
                  >
                    <Item
                      size="small"
                      clickable
                    >
                      <Item.Media>
                        <i
                          :class="step.icon"
                          class="text-body-sm leading-none text-(--text-muted) group-data-done/step:text-(--primary)"
                          aria-hidden="true"
                        />
                      </Item.Media>

                      <Item.Content>
                        <Item.Title>
                          {{ step.title }}
                        </Item.Title>
                      </Item.Content>

                      <Item.Actions>
                        <i
                          v-if="step.done"
                          class="az az-check text-body-sm leading-none text-(--primary)"
                          aria-hidden="true"
                        />
                        <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
                      </Item.Actions>
                    </Item>
                  </div>
                </div>
              </template>
            </Card>

            <Drawer
              v-model:open="detailOpen"
              size="large"
              side="end"
            >
              <DrawerContent>
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                      <DrawerTitle>Ship to production</DrawerTitle>
                      <Tag
                        :label="
                          complete
                            ? 'Ready for production'
                            : `${doneCount} of ${productionSteps.length}`
                        "
                        :severity="complete ? 'success' : 'neutral'"
                        size="small"
                        class="shrink-0"
                      />
                    </div>
                    <p class="text-body-sm text-(--text-muted)">
                      The create put this service live on a generated hostname. These are the gates
                      between that and production.
                    </p>
                  </div>
                </PanelHeader>

                <PanelBody>
                  <div class="flex flex-col gap-(--spacing-sm)">
                    <Item
                      v-for="step in productionSteps"
                      :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
                      size="medium"
                      :data-done="step.done || null"
                    >
                      <Item.Media>
                        <span
                          :class="STEP_MEDIA_CLASS"
                          aria-hidden="true"
                        >
                          <i
                            :class="step.done ? 'az az-check' : step.icon"
                            class="text-body-sm leading-none"
                          />
                        </span>
                      </Item.Media>

                      <Item.Content>
                        <Item.Title>
                          {{ step.title }}
                        </Item.Title>
                        <Item.Description>
                          {{ step.description }}
                        </Item.Description>
                      </Item.Content>

                      <Item.Footer>
                        <Tag
                          v-if="step.done"
                          icon="az az-check"
                          :label="step.doneNote || 'Done'"
                          severity="neutral"
                          size="medium"
                        />
                        <Button
                          v-else
                          :label="step.actionLabel || step.title"
                          variant="outline"
                          size="small"
                          @click="step.id in targets ? showTopology(step.id) : (detailOpen = false)"
                        />
                      </Item.Footer>
                    </Item>
                  </div>
                </PanelBody>

                <PanelFooter>
                  <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
                    <Button
                      label="Done"
                      variant="primary"
                      size="medium"
                      @click="detailOpen = false"
                    />
                  </div>
                </PanelFooter>
              </DrawerContent>
            </Drawer>

            <div
              ref="topologyEl"
              class="flex scroll-mt-(--spacing-lg) flex-col gap-(--layout-group-gap)"
            >
              <Subheader
                title="Deployment topology"
                description="How a request reaches this service in Production. Bind, change or remove a policy, an error page or the origin here; the change is staged until you deploy."
                size="small"
              />
              <div
                class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
              >
                <FlowDiagram
                  v-model:open-keys="expanded"
                  :nodes="topologyNodes"
                  :edges="topologyEdges"
                  aria-label="Deployment topology"
                >
                  <template #actions="{ node }">
                    <Tooltip
                      v-if="node.id === 'domains'"
                      content="Add domain"
                    >
                      <IconButton
                        icon="az az-plus"
                        variant="outline"
                        size="small"
                        aria-label="Add domain"
                        href="/domains/create"
                      />
                    </Tooltip>
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
                {{
                  stagedCount ? `${stagedNote} ${stagedCount} staged. Deploy to apply.` : stagedNote
                }}
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
    <section
      v-else
      class="min-h-0 flex-1"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="az az-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`/services/service-01/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </section>

    <Drawer
      v-model:open="deployOpen"
      side="end"
      size="large"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Deploy {{ SERVICE.name }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DrawerDescription>
              The service goes to Production with the changes below. The deployment that is live
              keeps serving until the new one is ready.
            </DrawerDescription>
            <section
              aria-labelledby="service-deploy-changes"
              class="flex flex-col gap-(--spacing-xs)"
            >
              <h3
                id="service-deploy-changes"
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
                No topology change is staged. The deploy publishes the service as it is.
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
