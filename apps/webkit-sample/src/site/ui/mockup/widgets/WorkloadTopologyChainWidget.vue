<script setup lang="ts">
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup, { type ShellMockupFade, type ShellMockupKind } from '../ShellMockup.vue'

  defineOptions({ name: 'WorkloadTopologyChainWidget' })

  interface Props {
    /** How the mockup is plated. */
    kind?: ShellMockupKind
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'bare',
    chrome: false,
    width: 600,
    fade: 'none',
    active: true
  })

  interface TopologyNode {
    key: string
    eyebrow: string
    icon: string
    title: string
    detail: string
    label: string
    severity: TagSeverity
    lead?: boolean
  }

  type TopologySide = 'start' | 'center' | 'end'

  interface TopologyColumn {
    key: string
    order: number
    side: TopologySide
    nodes: TopologyNode[]
  }

  const COLUMNS: TopologyColumn[] = [
    {
      key: 'domains',
      order: 0,
      side: 'start',
      nodes: [
        {
          key: 'domain-shop',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'shop.example.com',
          detail: 'TLS 1.3',
          label: 'Public',
          severity: 'info'
        },
        {
          key: 'domain-www',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'www.example.com',
          detail: 'TLS 1.3',
          label: 'Public',
          severity: 'info'
        },
        {
          key: 'domain-generated',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'storefront.azion.app',
          detail: 'TLS 1.3',
          label: 'Public',
          severity: 'info'
        }
      ]
    },
    {
      key: 'workload',
      order: 1,
      side: 'center',
      nodes: [
        {
          key: 'workload',
          eyebrow: 'Workload',
          icon: 'ai ai-workloads',
          title: 'storefront-prod',
          detail: '3 domains',
          label: 'Live',
          severity: 'success',
          lead: true
        }
      ]
    },
    {
      key: 'bindings',
      order: 2,
      side: 'end',
      nodes: [
        {
          key: 'application',
          eyebrow: 'Application',
          icon: 'ai ai-edge-application',
          title: 'storefront',
          detail: 'Cache enabled',
          label: 'Active',
          severity: 'success'
        },
        {
          key: 'firewall',
          eyebrow: 'Firewall',
          icon: 'ai ai-edge-firewall',
          title: 'edge-rules',
          detail: '12 rules',
          label: 'Active',
          severity: 'success'
        }
      ]
    }
  ]
</script>

<template>
  <ShellMockup
    :kind="kind"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
  >
    <div class="grid h-full grid-cols-3 items-center gap-x-(--spacing-lg) p-(--spacing-xs)">
      <MockupPart
        v-for="column in COLUMNS"
        :key="column.key"
        :order="column.order"
        class="min-w-0 self-center"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <div
            v-for="(node, index) in column.nodes"
            :key="node.key"
            class="relative min-w-0"
          >
            <span
              v-if="column.side !== 'start'"
              class="absolute top-1/2 right-full h-px w-[calc(var(--spacing-lg)/2)] bg-(--border-default)"
              aria-hidden="true"
            />
            <span
              v-if="column.side !== 'end'"
              class="absolute top-1/2 left-full h-px w-[calc(var(--spacing-lg)/2)] bg-(--border-default)"
              aria-hidden="true"
            />
            <span
              v-if="column.side !== 'center' && column.nodes.length > 1"
              :data-side="column.side"
              :data-first="index === 0 || null"
              :data-last="index === column.nodes.length - 1 || null"
              class="absolute top-[calc(var(--spacing-md)/-2)] bottom-[calc(var(--spacing-md)/-2)] w-px bg-(--border-default) data-first:top-1/2 data-last:bottom-1/2 data-[side=end]:right-[calc(100%+var(--spacing-lg)/2)] data-[side=start]:left-[calc(100%+var(--spacing-lg)/2)]"
              aria-hidden="true"
            />
            <div
              :data-lead="node.lead || null"
              class="relative flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm) shadow-(--shadow-xs) data-lead:border-(--primary) data-lead:shadow-[0_0_var(--spacing-lg)_var(--primary-mask),0_0_var(--spacing-xl)_var(--primary-mask)]"
            >
              <div class="flex items-center gap-(--spacing-xxs)">
                <i
                  :class="node.icon"
                  class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
                <Tag
                  class="ml-auto shrink-0"
                  :label="node.label"
                  :severity="node.severity"
                  size="small"
                />
              </div>
              <span class="truncate text-label-md text-(--text-default)">{{ node.title }}</span>
              <span class="truncate text-body-sm text-(--text-muted)">{{ node.detail }}</span>
            </div>
          </div>
        </div>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
