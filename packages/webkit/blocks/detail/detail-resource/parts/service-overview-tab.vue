<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { productionSteps, serviceEdges, serviceTargets, serviceTopology } from '../sample'
  import type { UseTopologyStagingReturn } from '../use-topology-staging'
  import ProductionChecklistCard from './production-checklist-card.vue'
  import ProductionChecklistDrawer from './production-checklist-drawer.vue'
  import ServiceSummaryCard from './service-summary-card.vue'
  import TopologyPanel from './topology-panel.vue'

  export interface ServiceOverviewTabProps {
    /** The staged topology of the service. */
    staging: UseTopologyStagingReturn
  }

  const props = defineProps<ServiceOverviewTabProps>()

  const environment = defineModel<string>('environment', { required: true })

  const detailOpen = ref(false)
  const expanded = ref<string[]>([])
  const topologyEl = ref<InstanceType<typeof TopologyPanel> | null>(null)

  const topologyNodes = computed(() => [
    serviceTopology.domains,
    serviceTopology.service,
    props.staging.slotNode('policy'),
    serviceTopology.resource,
    props.staging.slotNode('errorPage'),
    props.staging.slotNode('origin'),
    serviceTopology.storage
  ])

  const reveal = () => topologyEl.value?.reveal()

  const showStep = (_event: MouseEvent, key: string) => {
    detailOpen.value = false
    if (!(key in serviceTargets)) return
    if (!expanded.value.includes(key)) expanded.value = [...expanded.value, key]
    reveal()
  }

  defineExpose({
    /** Scrolls the topology into view. */
    reveal
  })
</script>

<template>
  <div>
    <div class="layout-column layout-boundary flex min-w-0 flex-col">
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <ServiceSummaryCard v-model:environment="environment" />
        <ProductionChecklistCard
          :steps="productionSteps"
          @expand="detailOpen = true"
        />
        <ProductionChecklistDrawer
          v-model:open="detailOpen"
          :steps="productionSteps"
          @step="showStep"
        />
        <TopologyPanel
          ref="topologyEl"
          v-model:open-keys="expanded"
          tag="div"
          class="flex scroll-mt-(--spacing-lg) flex-col gap-(--layout-group-gap)"
          description="How a request reaches this service in Production. Bind, change or remove a policy, an error page or the origin here; the change is staged until you deploy."
          :nodes="topologyNodes"
          :edges="serviceEdges"
          :staged-count="staging.stagedCount.value"
          :staged-note="staging.stagedNote.value"
          @bind="staging.bind"
          @remove="staging.unbind"
          @create="staging.createTarget"
        >
          <template #node-actions="{ node }">
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
          </template>
        </TopologyPanel>
      </section>
    </div>
  </div>
</template>
