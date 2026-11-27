<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Tag, { type TagSeverity } from '../../tag/tag.vue'
  import ConsoleMockupShell, {
    type ConsoleMockupShellFade
  } from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'

  defineOptions({ name: 'WorkloadDeploymentsWidget' })

  interface Props {
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ConsoleMockupShellFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { width: 860, fade: 'none', active: true })

  interface DeploymentRow {
    version: string
    application: string
    status: string
    severity: TagSeverity
    time: string
    action: string
  }

  const ROWS: DeploymentRow[] = [
    {
      version: 'v42',
      application: 'storefront',
      status: 'Canary',
      severity: 'info',
      time: '4 minutes ago',
      action: 'Promote'
    },
    {
      version: 'v41',
      application: 'storefront',
      status: 'Current',
      severity: 'success',
      time: '2 days ago',
      action: ''
    },
    {
      version: 'v40',
      application: 'storefront',
      status: 'Previous',
      severity: 'neutral',
      time: '6 days ago',
      action: 'Rollback'
    }
  ]
</script>

<template>
  <ConsoleMockupShell
    :width="width"
    :fade="fade"
    :active="active"
    title="Workloads › storefront-prod › Deployments"
  >
    <div class="flex h-full flex-col gap-(--spacing-md) p-(--spacing-lg)">
      <ConsoleMockupShellItem :order="0">
        <div
          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
        >
          <div class="flex items-center gap-(--spacing-sm)">
            <span class="text-label-sm text-(--text-default)">Traffic split</span>
            <Tag
              class="ms-auto"
              label="Rolling out"
              severity="info"
              size="small"
            />
          </div>
          <div class="flex h-2 gap-px overflow-hidden rounded-(--shape-control)">
            <span class="w-[85%] bg-(--primary)" />
            <span class="flex-1 bg-(--bg-selected)" />
          </div>
          <div class="flex items-center justify-between text-label-sm text-(--text-muted)">
            <span>v41 live · 85%</span>
            <span>v42 canary · 15%</span>
          </div>
        </div>
      </ConsoleMockupShellItem>

      <div
        class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      >
        <ConsoleMockupShellItem
          v-for="(row, index) in ROWS"
          :key="row.version"
          :order="1 + index"
        >
          <div
            class="grid grid-cols-[3rem_1fr_6rem] items-center gap-(--spacing-sm) border-b border-(--border-muted) px-(--spacing-md) py-(--spacing-sm) md:grid-cols-[3rem_1fr_6rem_1fr_6rem]"
          >
            <span class="text-label-sm text-(--text-default)">{{ row.version }}</span>
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="az az-applications shrink-0 text-body-md leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">{{ row.application }}</span>
            </span>
            <span class="inline-flex">
              <Tag
                :label="row.status"
                :severity="row.severity"
                size="small"
              />
            </span>
            <span class="hidden truncate text-body-sm text-(--text-muted) md:block">{{
              row.time
            }}</span>
            <span class="hidden justify-end md:flex">
              <Button
                v-if="row.action"
                :label="row.action"
                variant="ghost"
                size="small"
              />
            </span>
          </div>
        </ConsoleMockupShellItem>
      </div>
    </div>
  </ConsoleMockupShell>
</template>
