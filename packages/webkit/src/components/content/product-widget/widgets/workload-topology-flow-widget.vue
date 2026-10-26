<script setup lang="ts">
  import FlowRoot from '../../../data/flow/flow.vue'
  import FlowAnchor from '../../../data/flow/flow-anchor/flow-anchor.vue'
  import FlowNode from '../../../data/flow/flow-node/flow-node.vue'
  import FlowParallel from '../../../data/flow/flow-parallel/flow-parallel.vue'
  import Tag, { type TagSeverity } from '../../../tag/tag.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'

  defineOptions({ name: 'WorkloadTopologyFlowWidget' })

  interface Props {
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })

  interface FlowNodeEntry {
    key: string
    eyebrow: string
    icon: string
    title: string
    label: string
    severity: TagSeverity
  }

  const LEVELS: { key: string; nodes: FlowNodeEntry[] }[] = [
    {
      key: 'domains',
      nodes: [
        {
          key: 'domain-shop',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'shop.example.com',
          label: 'Public',
          severity: 'info'
        },
        {
          key: 'domain-api',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
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
          icon: 'ai ai-workloads',
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
          icon: 'ai ai-edge-application',
          title: 'storefront',
          label: 'Active',
          severity: 'success'
        },
        {
          key: 'firewall',
          eyebrow: 'Firewall',
          icon: 'ai ai-edge-firewall',
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
    <ShellMockup
      kind="bare"
      :chrome="false"
      :active="active"
      :width="876"
      :mobile-width="876"
      still
    >
      <FlowRoot
        align="center"
        class="w-full [&>div]:w-full"
      >
        <FlowParallel
          v-for="level in LEVELS"
          :key="level.key"
          align="start"
          class="min-w-[15rem] flex-1"
        >
          <FlowNode
            v-for="node in level.nodes"
            :key="node.key"
            unstyled
            class="w-full"
          >
            <div
              :data-active="node.key === 'workload' || null"
              class="relative flex w-full min-w-0 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) data-[active]:border-(--primary) data-[active]:before:pointer-events-none data-[active]:before:absolute data-[active]:before:inset-0 data-[active]:before:rounded-[inherit] data-[active]:before:content-[''] data-[active]:before:shadow-[calc(var(--spacing-5)*-1)_0_var(--spacing-11)_calc(var(--spacing-4)*-1)_var(--accent),var(--spacing-5)_0_var(--spacing-11)_calc(var(--spacing-4)*-1)_var(--primary),0_0_var(--spacing-5)_calc(var(--spacing-2)*-1)_var(--primary)]"
            >
              <FlowAnchor>
                <div
                  class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
                >
                  <i
                    :class="node.icon"
                    aria-hidden="true"
                    class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                  />
                  <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
                  <Tag
                    class="ml-auto shrink-0"
                    :severity="node.severity"
                    :label="node.label"
                    size="small"
                  />
                </div>
              </FlowAnchor>
              <span
                class="min-w-0 truncate px-(--spacing-md) pb-(--spacing-sm) text-label-sm text-(--text-default)"
                >{{ node.title }}</span
              >
            </div>
          </FlowNode>
        </FlowParallel>
      </FlowRoot>
    </ShellMockup>
  </div>
</template>
