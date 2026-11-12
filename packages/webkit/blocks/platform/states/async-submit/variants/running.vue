<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import LogView, { type LogViewLine } from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import PageHeader from '@aziontech/webkit/page-header'
  import Progress from '@aziontech/webkit/progress'
  import Spinner from '@aziontech/webkit/spinner'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }
  type StepStatus = 'done' | 'running' | 'failed' | 'skipped' | 'pending'
  interface DeployStep {
    key: string
    title: string
    description: string
    status: StepStatus
    duration: string
    tag?: StatusTag
    lines: LogViewLine[]
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const outcome = ref('error')
  const status = ref('running')
  const running = computed(() => status.value === 'running')

  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  const run = {
    name: 'web-app',
    scope: 'acme',
    attempt: 1,
    record: { service: { domain: 'web-app.example.com' } },
    error: {
      detail:
        'The template built, its assets were uploaded and the service was created, but a rule with the same behavior is already bound to this domain, so the routing rules were refused. Nothing was published, so a redeploy starts from the same commit.'
    }
  }

  const statusTag = computed<StatusTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'secondary' }
  })

  const steps: DeployStep[] = [
    {
      key: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'done',
      duration: '3s',
      lines: [
        {
          id: '0',
          time: '13:47:33',
          type: 'success',
          message: '[TASK] - #. Deploy started successfully!'
        },
        {
          id: '1',
          time: '13:47:33',
          type: 'text',
          message: '[TASK] - #. Creating access token!'
        },
        {
          id: '2',
          time: '13:47:35',
          type: 'text',
          message: '[TASK] - #. Adding token to the CLI!'
        },
        {
          id: '3',
          time: '13:47:36',
          type: 'success',
          message: '[TASK] - #. Token added successfully!'
        }
      ]
    },
    {
      key: 'clone',
      title: 'Clone template',
      description: 'Template cloned into the GitHub scope',
      status: 'done',
      duration: '4s',
      lines: [
        {
          id: '0',
          time: '13:47:37',
          type: 'text',
          message: '[TASK] - # Current directory: vue/vue3-vite-static/'
        },
        { id: '1', time: '13:47:38', type: 'text', message: '[TASK] - #. Cloning template!' },
        {
          id: '2',
          time: '13:47:39',
          type: 'text',
          message: 'Receiving objects: 100% (312/312), 1.14 MiB'
        },
        {
          id: '3',
          time: '13:47:40',
          type: 'success',
          message: '[TASK] - #. Template cloned successfully!'
        }
      ]
    },
    {
      key: 'install',
      title: 'Install dependencies',
      description: '478 packages installed',
      status: 'running',
      duration: '',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: '[TASK] - # npm install' },
        {
          id: '1',
          time: '13:47:45',
          type: 'text',
          message: 'npm warn deprecated inflight@1.0.6: this module is not supported'
        }
      ]
    },
    {
      key: 'build',
      title: 'Build',
      description: 'Project built into dist/',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      key: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      key: 'service',
      title: 'Service',
      description: 'Service and cache settings created',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      key: 'rules',
      title: 'Routing rules',
      description: 'Request rules and cache policies applied',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      key: 'deploy',
      title: 'Publish',
      description: 'Repository wired and the deploy published',
      status: 'pending',
      duration: '',
      lines: []
    }
  ]

  const openStep = ref('install')

  const RUN_TOAST = 'async-submit-run'

  const redeploy = () =>
    toast.loading(`Deploying ${run.name}…`, {
      id: RUN_TOAST,
      description: `${REPO.scope}/${REPO.name}. It keeps running if you leave.`
    })

  onMounted(redeploy)

  onBeforeUnmount(() => toast.dismiss(RUN_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        title="Async deployment"
        description="A deploy runs for half a minute and asks nothing of you while it does. Start one, then open any module in the sidebar. The run keeps going and reports back through the toast, wherever you are."
        size="large"
      >
        <template #actions>
          <Tag
            :label="statusTag.label"
            :severity="statusTag.severity"
            size="medium"
          />
        </template>
      </PageHeader>

      <aside
        aria-label="Scenario simulation"
        class="layout-section-start flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
      >
        <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
          <p class="m-0 text-overline-sm text-(--text-muted)">Simulation: how this deploy ends</p>
          <Tag
            :label="`${REPO.scope}/${REPO.name}`"
            severity="secondary"
            size="medium"
          />
        </div>
        <p class="m-0 text-body-sm text-(--text-muted)">
          The ending is held in the URL (<code class="text-label-code-sm">?outcome=</code>), so a
          run is linkable and survives a reload. Select one, press Deploy, and leave the page. The
          toast follows you and settles wherever you are.
        </p>
        <div class="flex flex-wrap items-center gap-(--spacing-sm)">
          <ToggleGroup
            v-model="outcome"
            :options="outcomes"
            aria-label="Simulated deployment outcome"
          />
          <Button
            label="Deploy"
            kind="primary"
            size="medium"
            icon="pi pi-play"
            :loading="running"
            :disabled="running"
          />
          <Button
            label="Reset scenario"
            kind="transparent"
            size="medium"
            :disabled="running"
          />
        </div>
      </aside>

      <div class="layout-section-start">
        <Card :padded="false">
          <template #header>
            <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
            <StatusIndicator
              loading
              severity="info"
              label="Building"
            />
          </template>

          <template #content>
            <div class="flex w-full flex-col">
              <div
                class="flex min-h-12 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <p class="shrink-0 text-heading-xxs text-(--text-default)">Logs</p>
                <div class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)">
                  <span class="shrink-0 text-label-sm text-(--text-default)">2/8 steps</span>
                  <span class="truncate text-label-sm text-(--text-muted)"
                    >Install dependencies</span
                  >
                </div>
              </div>
              <Accordion
                v-model="openStep"
                type="single"
                collapsible
              >
                <Accordion.Item
                  v-for="step in steps"
                  :key="step.key"
                  :value="step.key"
                >
                  <Accordion.Trigger>
                    <span class="flex min-h-10 flex-1 items-center gap-(--spacing-sm)">
                      <span class="flex size-5 shrink-0 items-center justify-center">
                        <i
                          v-if="step.status === 'done'"
                          class="pi pi-check-circle text-(--success-contrast)"
                          aria-hidden="true"
                        />
                        <i
                          v-else-if="step.status === 'failed'"
                          class="pi pi-times-circle text-(--danger-contrast)"
                          aria-hidden="true"
                        />
                        <i
                          v-else-if="step.status === 'skipped'"
                          class="pi pi-minus-circle text-(--text-muted) opacity-60"
                          aria-hidden="true"
                        />
                        <div
                          v-else-if="step.status === 'running'"
                          class="contents text-(--text-default)"
                        >
                          <Spinner />
                        </div>
                        <span
                          v-else
                          class="size-3.5 rounded-full border border-dashed border-(--border-default)"
                        />
                      </span>
                      <span
                        :data-state="step.status"
                        class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-start data-[state=failed]:flex-wrap"
                      >
                        <span
                          :data-state="step.status"
                          class="shrink-0 text-label-md text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
                        >
                          {{ step.title }}
                        </span>
                        <span
                          :data-state="step.status"
                          class="min-w-0 truncate text-body-sm text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast) data-[state=running]:motion-safe:bg-[linear-gradient(90deg,var(--text-muted)_0%,var(--text-muted)_35%,var(--text-default)_50%,var(--text-muted)_65%,var(--text-muted)_100%)] data-[state=running]:motion-safe:bg-[length:200%_100%] data-[state=running]:motion-safe:bg-clip-text data-[state=running]:motion-safe:text-transparent data-[state=running]:motion-safe:animate-(--animate-shimmer) motion-reduce:animate-none"
                        >
                          {{ step.description }}
                        </span>
                      </span>
                      <span class="ms-auto flex shrink-0 items-center">
                        <span
                          v-if="step.duration"
                          class="text-label-code-md text-(--text-muted)"
                        >
                          {{ step.duration }}
                        </span>
                      </span>
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <LogView
                      :lines="step.lines"
                      :bordered="false"
                      :copyable="false"
                      :loading="step.status === 'pending'"
                      loading-label="Waiting to start…"
                    >
                      <LogViewContent>
                        <template #empty>No log lines yet.</template>
                      </LogViewContent>
                    </LogView>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
              <Progress
                :value="32"
                :max="100"
                size="small"
                shape="flat"
                class="w-full"
                aria-label="Deployment progress"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
