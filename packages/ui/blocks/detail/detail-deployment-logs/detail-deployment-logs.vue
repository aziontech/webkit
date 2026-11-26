<script setup lang="ts">
  import LogViewer, {
    type LogViewerStep,
    type LogViewerStepsView
  } from '@aziontech/webkit/log-viewer'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { sampleSteps } from './sample'

  /** One step of the run with its own log lines; a step with status error is where the run failed. */
  export type DeploymentLogsStep = LogViewerStep

  /** Phased shows one log per step; complete shows every line as one log. */
  export type DeploymentLogsView = LogViewerStepsView

  export interface DeploymentLogsProps {
    /** The steps of the run, in order. Left out, the sample run renders. */
    steps?: DeploymentLogsStep[]
    /** How long the settled run took, shown beside its outcome. */
    duration?: string
  }

  const props = withDefaults(defineProps<DeploymentLogsProps>(), {
    steps: undefined,
    duration: ''
  })

  const view = defineModel<DeploymentLogsView>('view', { default: 'phased' })
  const openStepModel = defineModel<string | undefined>('openStep', { default: undefined })

  const steps = computed<DeploymentLogsStep[]>(() => props.steps ?? sampleSteps)

  const settled = computed(
    () =>
      steps.value.length > 0 &&
      !steps.value.some((step) => step.status === 'running' || step.status === 'pending')
  )
  const failedStep = computed(() => steps.value.find((step) => step.status === 'error'))

  const openStep = computed({
    get: () =>
      openStepModel.value ??
      (
        steps.value.find((step) => step.status === 'running') ??
        failedStep.value ??
        steps.value.at(-1)
      )?.id,
    set: (next) => {
      openStepModel.value = next
    }
  })

  const doneCount = computed(() => steps.value.filter((step) => step.status === 'success').length)
  const currentStep = computed(
    () =>
      steps.value.find((step) => step.status === 'running' || step.status === 'error')?.title ?? ''
  )

  const stepTags: Partial<
    Record<DeploymentLogsStep['status'], { label: string; severity: TagSeverity }>
  > = {
    error: { label: 'Failed', severity: 'danger' },
    skipped: { label: 'Skipped', severity: 'neutral' }
  }
</script>

<template>
  <LogViewer.Steps
    v-model:view="view"
    v-model:open-step="openStep"
    :steps="steps"
    :copyable="settled"
    :view-switch="settled"
    :progress="!settled"
  >
    <template #header>
      <h2 class="m-0 shrink-0 text-title-sm text-(--text-default)">Deployment logs</h2>
      <div
        v-if="!settled"
        role="status"
        class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)"
      >
        <span class="shrink-0 text-label-sm text-(--text-default)"
          >{{ doneCount }}/{{ steps.length }} steps</span
        >
        <span class="truncate text-label-sm text-(--text-muted)">{{ currentStep }}</span>
      </div>
      <div
        v-else
        class="ms-auto flex flex-wrap items-center gap-(--spacing-sm)"
      >
        <span class="flex shrink-0 whitespace-nowrap">
          <Tag
            :label="failedStep ? `Failed: ${failedStep.title}` : 'Completed'"
            :severity="failedStep ? 'danger' : 'success'"
          />
        </span>
        <span
          v-if="duration"
          class="whitespace-nowrap text-label-sm text-(--text-muted)"
          >{{ failedStep ? `Failed after ${duration}` : `Deployed in ${duration}` }}</span
        >
      </div>
    </template>
    <template #step-meta="{ step }">
      <Tag
        v-if="stepTags[step.status]"
        v-bind="stepTags[step.status]"
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
