<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import LogViewer, {
    type LogViewerStep,
    type LogViewerStepsView
  } from '@aziontech/webkit/log-viewer'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref, watch } from 'vue'

  /** Where the run stands, read from the props. */
  export type AsyncSubmitStatus = 'idle' | 'running' | 'error' | 'success'

  /** A label and color for a status tag. */
  export interface AsyncSubmitTag {
    /** Tag text. */
    label: string
    /** Tag color. */
    severity: TagSeverity
  }

  /** One step of the deployment logs. */
  export interface AsyncSubmitStep extends LogViewerStep {
    /** A tag beside the step name, such as Failed or Skipped. */
    tag?: AsyncSubmitTag
  }

  /** The finished deployment, shown in the success Alert. */
  export interface AsyncSubmitDeployment {
    /** The address the service answers on. */
    domain: string
    /** How many runs it took. */
    attempts: number
  }

  export interface AsyncSubmitProps {
    /** The service the run deploys, named in the heading and the result. */
    name?: string
    /** A run is in flight: the heading reads Deploying and the logs card streams the steps. */
    loading?: boolean
    /** Why the run failed, shown in the danger Alert with Edit and Redeploy. */
    error?: string
    /** One line for the failure toast; left empty, the toast names the failed step. */
    errorSummary?: string
    /** The finished run: the heading reads Deployed and the success Alert names the address. */
    deployment?: AsyncSubmitDeployment
    /** The steps of the current or the failed run, streamed in the logs card. */
    steps?: AsyncSubmitStep[]
  }

  const props = withDefaults(defineProps<AsyncSubmitProps>(), {
    name: 'web-app',
    loading: false,
    error: '',
    errorSummary: '',
    deployment: undefined,
    steps: () => []
  })

  const emit = defineEmits<{
    deploy: [event: MouseEvent]
    redeploy: [event: MouseEvent]
    edit: [event: MouseEvent]
    'open-service': [event: MouseEvent]
  }>()

  const REPO = computed(() => ({ name: props.name, scope: 'acme' }))
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const status = computed<AsyncSubmitStatus>(() => {
    if (props.loading) return 'running'
    if (props.error) return 'error'
    if (props.deployment) return 'success'
    return 'idle'
  })

  const statusTag = computed<AsyncSubmitTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'neutral' }
  })

  const runningStep = computed(() => props.steps.find((step) => step.status === 'running'))
  const failedStep = computed(() => props.steps.find((step) => step.status === 'error'))
  const doneCount = computed(() => props.steps.filter((step) => step.status === 'success').length)
  const failedTitle = computed(() => failedStep.value?.title ?? '')

  const logViewer = ref<LogViewerStepsView>('phased')
  const openStep = ref<string | undefined>()
  watch(
    () => (status.value === 'running' ? runningStep.value?.id : failedStep.value?.id),
    (next) => {
      openStep.value = next
    },
    { immediate: true }
  )

  const stepTag = (key: string) => props.steps.find((step) => step.id === key)?.tag

  const edit = (event: MouseEvent) => emit('edit', event)

  const redeploy = (event: MouseEvent) => emit('redeploy', event)

  const deploy = (event: MouseEvent) => {
    if (props.loading) return
    emit('deploy', event)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        :title="`Deploy ${REPO.name}`"
        :description="`Builds ${REPO.scope}/${REPO.name} and publishes it to production.`"
      >
        <template #meta>
          <Tag
            :label="statusTag.label"
            :severity="statusTag.severity"
            size="medium"
            data-testid="state-async-submit__status"
          />
        </template>
      </PageHeader>

      <div
        v-if="status === 'error'"
        key="status-failed"
        class="[--popup-origin:top] layout-section-start animate-popup-scale-in motion-reduce:animate-none"
      >
        <Alert
          severity="danger"
          :label="error"
        >
          <template #actions>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                variant="ghost"
                size="medium"
                @click="edit"
              />
              <Button
                label="Redeploy"
                variant="secondary"
                size="medium"
                icon="az az-refresh"
                @click="redeploy"
              />
            </div>
          </template>
        </Alert>
      </div>

      <div
        v-else-if="status === 'success' && deployment"
        key="status-live"
        class="[--popup-origin:top] layout-section-start animate-popup-scale-in motion-reduce:animate-none"
      >
        <Alert
          severity="success"
          :label="`${REPO.name} is live at ${deployment.domain}. It took ${deployment.attempts} attempt${deployment.attempts > 1 ? 's' : ''}.`"
        >
          <template #actions>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                variant="ghost"
                size="medium"
                @click="edit"
              />
              <Button
                label="Redeploy"
                variant="ghost"
                size="medium"
                icon="az az-refresh"
                @click="redeploy"
              />
              <Button
                label="Open service"
                variant="secondary"
                size="medium"
                @click="emit('open-service', $event)"
              />
            </div>
          </template>
        </Alert>
      </div>

      <div
        v-if="status === 'running' || (status === 'error' && steps.length)"
        class="layout-section-start"
      >
        <Card :padded="false">
          <template #header>
            <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
            <StatusIndicator
              v-if="status === 'running'"
              loading
              severity="info"
              label="Building"
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
              :copyable="status !== 'running'"
              :view-switch="false"
              :progress="status === 'running'"
            >
              <template #header>
                <p class="shrink-0 text-heading-2xs text-(--text-default)">Logs</p>
                <div class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)">
                  <template v-if="status === 'running'">
                    <span class="shrink-0 text-label-sm text-(--text-default)"
                      >{{ doneCount }}/{{ steps.length }} steps</span
                    >
                    <span
                      v-if="runningStep"
                      class="truncate text-label-sm text-(--text-muted)"
                      >{{ runningStep.title }}</span
                    >
                  </template>
                  <Tag
                    v-else
                    :label="`Failed: ${failedTitle}`"
                    severity="danger"
                  />
                </div>
              </template>
              <template #step-meta="{ step }">
                <Tag
                  v-if="stepTag(step.id)"
                  v-bind="stepTag(step.id)"
                  size="small"
                />
              </template>
              <template
                v-if="status === 'error'"
                #step-empty="{ step }"
              >
                {{
                  step.status === 'skipped'
                    ? `Never ran. The deployment stopped at ${failedTitle}.`
                    : 'No log lines yet.'
                }}
              </template>
            </LogViewer.Steps>
          </template>
        </Card>
      </div>

      <div
        v-if="status === 'idle'"
        class="layout-section-start"
      >
        <EmptyState
          bordered
          icon="az az-cloud-upload"
          title="No deployment running"
          :description="`Deploy ${REPO.name} to build it and publish it to production. It takes about half a minute, and you can leave this page while it runs.`"
        >
          <template #actions>
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              icon="az az-play"
              @click="deploy"
            />
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
