<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import LogViewer, {
    type LogViewerStep,
    type LogViewerStepStatus,
    type LogViewerStepsView
  } from '@aziontech/webkit/log-viewer'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  export interface DeploymentLogsCardProps {
    /** The status of the deployment, beside an unfinished log. */
    status: { severity: StatusIndicatorSeverity; label: string }
    /** How long the run took. */
    duration: string
    /** The steps of the run; left empty, the card reads not started. */
    steps: LogViewerStep[]
  }

  const props = defineProps<DeploymentLogsCardProps>()

  const STEP_TAGS: Partial<Record<LogViewerStepStatus, { label: string; severity: TagSeverity }>> =
    {
      error: { label: 'Failed', severity: 'danger' },
      skipped: { label: 'Skipped', severity: 'neutral' }
    }

  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const failedStep = computed(() => props.steps.find((step) => step.status === 'error'))

  const logViewer = ref<LogViewerStepsView>('phased')
  const openStep = ref((failedStep.value ?? props.steps.at(-1))?.id)
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="min-w-0 truncate text-heading-xs text-(--text-default)">Deployment logs</p>

      <StatusIndicator
        v-if="!steps.length"
        v-bind="status"
      />
      <div
        v-else
        class="flex shrink-0 items-center gap-(--spacing-sm)"
      >
        <StatusIndicator
          v-if="failedStep"
          v-bind="status"
        />
        <span
          v-else
          class="text-label-sm text-(--text-muted)"
          >{{ duration }}</span
        >
        <ToggleGroup
          v-model="logViewer"
          :options="logViews"
          size="medium"
          aria-label="Log view"
        />
      </div>
    </template>

    <template #default>
      <div
        v-if="!steps.length"
        class="py-(--spacing-xl)"
      >
        <EmptyState
          icon="az az-clock"
          title="Queued, not started"
          description="The steps appear here as soon as the deployment starts running."
        />
      </div>
      <LogViewer.Steps
        v-else
        v-model:view="logViewer"
        v-model:open-step="openStep"
        :steps="steps"
        :view-switch="false"
      >
        <template
          v-if="failedStep"
          #step-meta="{ step }"
        >
          <Tag
            v-if="STEP_TAGS[step.status]"
            v-bind="STEP_TAGS[step.status]"
            size="small"
          />
        </template>
        <template
          v-if="failedStep"
          #step-empty="{ step }"
        >
          {{
            step.status === 'skipped'
              ? `Never ran. The deployment stopped at ${failedStep.title}.`
              : 'No log lines yet.'
          }}
        </template>
      </LogViewer.Steps>
    </template>
  </Card>
</template>
