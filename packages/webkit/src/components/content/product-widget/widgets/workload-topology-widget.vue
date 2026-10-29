<script setup lang="ts">
  import Button from '../../../actions/button/button.vue'
  import Tag, { type TagSeverity } from '../../../tag/tag.vue'
  import ShellMockup, {
    type ShellMockupFade,
    type ShellMockupKind
  } from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'WorkloadTopologyWidget' })

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
    kind: 'window',
    chrome: true,
    width: 860,
    fade: 'none',
    active: true
  })

  interface TopologyNode {
    key: string
    eyebrow: string
    icon: string
    title: string
    label: string
    severity: TagSeverity
    lead?: boolean
  }

  interface TopologyColumn {
    key: string
    order: number
    line?: boolean
    nodes?: TopologyNode[]
  }

  const COLUMNS: TopologyColumn[] = [
    {
      key: 'domains',
      order: 1,
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
          key: 'domain-generated',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'storefront.azion.app',
          label: 'Public',
          severity: 'info'
        }
      ]
    },
    { key: 'line-domains', order: 2, line: true },
    {
      key: 'workload',
      order: 2,
      nodes: [
        {
          key: 'workload',
          eyebrow: 'Workload',
          icon: 'ai ai-workloads',
          title: 'storefront-prod',
          label: 'Live',
          severity: 'success',
          lead: true
        }
      ]
    },
    { key: 'line-bindings', order: 3, line: true },
    {
      key: 'bindings',
      order: 3,
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
          title: 'edge-rules',
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
    title="Workloads › storefront-prod"
  >
    <div class="flex h-full flex-col gap-(--spacing-md) p-(--spacing-lg)">
      <ShellMockupPart :order="0">
        <div class="flex items-center gap-(--spacing-sm)">
          <h3 class="m-0 truncate text-heading-xs text-(--text-default)">storefront-prod</h3>
          <Tag
            label="Live"
            severity="success"
            size="small"
          />
          <span class="ml-auto inline-flex shrink-0">
            <Button
              label="Deploy"
              kind="outlined"
              size="medium"
              icon="pi pi-cloud-upload"
            />
          </span>
        </div>
      </ShellMockupPart>

      <div
        class="grid grid-cols-[1fr_var(--spacing-lg)_1fr_var(--spacing-lg)_1fr] items-center pt-(--spacing-md)"
      >
        <ShellMockupPart
          v-for="column in COLUMNS"
          :key="column.key"
          :order="column.order"
          class="min-w-0 self-center"
        >
          <span
            v-if="column.line"
            class="block h-px w-full bg-(--border-default)"
          />
          <div
            v-else
            class="flex min-w-0 flex-col gap-(--spacing-sm)"
          >
            <div
              v-for="node in column.nodes"
              :key="node.key"
              :data-lead="node.lead || null"
              class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) data-lead:border-(--primary)"
            >
              <div
                class="flex items-center gap-(--spacing-xxs) px-(--spacing-sm) pt-(--spacing-xs)"
              >
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
              <span
                class="truncate px-(--spacing-sm) pb-(--spacing-xs) text-label-sm text-(--text-default)"
                >{{ node.title }}</span
              >
            </div>
          </div>
        </ShellMockupPart>
      </div>
    </div>
  </ShellMockup>
</template>
