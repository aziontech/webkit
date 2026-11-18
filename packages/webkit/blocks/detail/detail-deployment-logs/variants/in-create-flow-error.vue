<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import LogViewer, {
    type LogViewerStepStatus,
    type LogViewerStepsView
  } from '@aziontech/webkit/log-viewer'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  import { sampleCreateFlowFailedSteps } from '../sample'

  const steps = sampleCreateFlowFailedSteps

  const stepTags: Partial<Record<LogViewerStepStatus, { label: string; severity: TagSeverity }>> = {
    error: { label: 'Failed', severity: 'danger' },
    skipped: { label: 'Skipped', severity: 'neutral' }
  }

  const stepTag = (key: string) => {
    const status = steps.find((step) => step.id === key)?.status
    return status ? stepTags[status] : undefined
  }

  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const logViewer = ref<LogViewerStepsView>('phased')
  const openStep = ref('rules')
  const redeploying = ref(false)

  const redeploy = () => {
    redeploying.value = true
  }
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
      <StatusIndicator
        v-if="redeploying"
        loading
        severity="info"
        label="Redeploying"
      />
      <ToggleGroup
        v-else
        v-model="logViewer"
        :options="logViews"
        class="shrink-0"
        aria-label="Log view"
      />
    </template>

    <template #default>
      <LogViewer.Steps
        v-model:view="logViewer"
        v-model:open-step="openStep"
        :steps="steps"
        :view-switch="false"
      >
        <template #header>
          <p class="shrink-0 text-heading-2xs text-(--text-default)">Logs</p>
          <div class="ms-auto flex items-center gap-(--spacing-sm)">
            <span class="flex shrink-0 whitespace-nowrap">
              <Tag
                label="Failed on routing rules"
                severity="danger"
              />
            </span>
          </div>
        </template>
        <template #step-meta="{ step }">
          <Tag
            v-if="stepTag(step.id)"
            v-bind="stepTag(step.id)"
            size="small"
          />
        </template>
        <template #step-empty="{ step }">
          {{
            step.status === 'skipped'
              ? 'Never ran. The deployment stopped at routing rules.'
              : 'No log lines yet.'
          }}
        </template>
      </LogViewer.Steps>
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
        <Button
          label="Edit"
          variant="outline"
          size="medium"
          href="/create/templates/nuxt-ecommerce"
          :disabled="redeploying"
        />
        <Button
          label="Redeploy"
          variant="primary"
          size="medium"
          icon="az az-refresh"
          :loading="redeploying"
          @click="redeploy"
        />
      </div>
    </template>
  </Card>
</template>
