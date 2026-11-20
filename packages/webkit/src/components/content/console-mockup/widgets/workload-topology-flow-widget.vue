<script setup lang="ts">
  import FlowDiagramRoot from '../../../data/flow-diagram/flow-diagram.vue'
  import FlowDiagramAnchor from '../../../data/flow-diagram/flow-diagram-anchor/flow-diagram-anchor.vue'
  import FlowDiagramGroup from '../../../data/flow-diagram/flow-diagram-group/flow-diagram-group.vue'
  import FlowDiagramNode from '../../../data/flow-diagram/flow-diagram-node/flow-diagram-node.vue'
  import Tag, { type TagSeverity } from '../../tag/tag.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'

  defineOptions({ name: 'WorkloadTopologyFlowWidget' })

  interface Props {
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })

  interface FlowDiagramNodeEntry {
    key: string
    eyebrow: string
    icon: string
    title: string
    label: string
    severity: TagSeverity
  }

  const LEVELS: { key: string; nodes: FlowDiagramNodeEntry[] }[] = [
    {
      key: 'domains',
      nodes: [
        {
          key: 'domain-shop',
          eyebrow: 'Domain',
          icon: 'az az-domains',
          title: 'shop.example.com',
          label: 'Public',
          severity: 'info'
        },
        {
          key: 'domain-api',
          eyebrow: 'Domain',
          icon: 'az az-domains',
          title: 'api.example.com',
          label: 'Public',
          severity: 'info'
        }
      ]
    },
    {
      key: 'workload',
      nodes: [
        {
          key: 'workload',
          eyebrow: 'Workload',
          icon: 'az az-workloads',
          title: 'shop-prod',
          label: 'Live',
          severity: 'success'
        }
      ]
    },
    {
      key: 'bindings',
      nodes: [
        {
          key: 'application',
          eyebrow: 'Application',
          icon: 'az az-applications',
          title: 'storefront',
          label: 'Active',
          severity: 'success'
        },
        {
          key: 'firewall',
          eyebrow: 'Firewall',
          icon: 'az az-firewall',
          title: 'shop-rules',
          label: 'Active',
          severity: 'success'
        }
      ]
    }
  ]
</script>

<template>
  <div class="mx-auto aspect-876/184 w-full max-w-(--container-3xl) min-w-0">
    <ConsoleMockupShell
      variant="bare"
      :chrome="false"
      :active="active"
      :width="876"
      :mobile-width="876"
      :animated="false"
    >
      <FlowDiagramRoot
        orientation="horizontal"
        align="center"
        class="w-full [&>div]:w-full"
      >
        <FlowDiagramGroup
          v-for="level in LEVELS"
          :key="level.key"
          class="min-w-[15rem] flex-1"
        >
          <FlowDiagramNode
            v-for="node in level.nodes"
            :key="node.key"
            unstyled
            class="w-full"
          >
            <div
              :data-active="node.key === 'workload' || null"
              class="relative flex w-full min-w-0 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) data-[active]:border-(--primary) data-[active]:before:pointer-events-none data-[active]:before:absolute data-[active]:before:inset-0 data-[active]:before:rounded-[inherit] data-[active]:before:content-[''] data-[active]:before:shadow-[calc(var(--spacing-5)*-1)_0_var(--spacing-11)_calc(var(--spacing-4)*-1)_var(--accent),var(--spacing-5)_0_var(--spacing-11)_calc(var(--spacing-4)*-1)_var(--primary),0_0_var(--spacing-5)_calc(var(--spacing-2)*-1)_var(--primary)]"
            >
              <FlowDiagramAnchor>
                <div
                  class="flex w-full items-center gap-(--spacing-2xs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-2xs)"
                >
                  <i
                    :class="node.icon"
                    aria-hidden="true"
                    class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                  />
                  <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
                  <Tag
                    class="ms-auto shrink-0"
                    :severity="node.severity"
                    :label="node.label"
                    size="small"
                  />
                </div>
              </FlowDiagramAnchor>
              <span
                class="min-w-0 truncate px-(--spacing-md) pb-(--spacing-sm) text-label-sm text-(--text-default)"
                >{{ node.title }}</span
              >
            </div>
          </FlowDiagramNode>
        </FlowDiagramGroup>
      </FlowDiagramRoot>
    </ConsoleMockupShell>
  </div>
</template>
