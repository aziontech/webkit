<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import LogView, { type LogViewStep, type LogViewStepsView } from '@aziontech/webkit/log-view'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const status = ref('error')

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
    return { label: 'Idle', severity: 'neutral' }
  })

  type DeployStep = LogViewStep & { tag?: StatusTag }

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
      status: 'done',
      duration: '9s',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: '[TASK] - # npm install' },
        {
          id: '1',
          time: '13:47:45',
          type: 'text',
          message: 'npm warn deprecated inflight@1.0.6: this module is not supported'
        },
        {
          id: '2',
          time: '13:47:48',
          type: 'text',
          message: 'added 478 packages, and audited 479 packages in 9s'
        },
        {
          id: '3',
          time: '13:47:48',
          type: 'text',
          level: 'warn',
          message: '24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)'
        },
        {
          id: '4',
          time: '13:47:49',
          type: 'success',
          message: '[TASK] - # Dependencies installed successfully!'
        }
      ]
    },
    {
      key: 'build',
      title: 'Build',
      description: 'Project built into dist/',
      status: 'done',
      duration: '8s',
      lines: [
        { id: '0', time: '13:47:50', type: 'text', message: '[TASK] - # Build template' },
        {
          id: '1',
          time: '13:47:52',
          type: 'text',
          message: 'vite v6.0.7 building for production…'
        },
        {
          id: '2',
          time: '13:47:56',
          type: 'text',
          message: '214 modules transformed · dist/assets 1.2 MB'
        },
        {
          id: '3',
          time: '13:47:57',
          type: 'success',
          message: '[TASK] - # Build completed successfully!'
        }
      ]
    },
    {
      key: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'done',
      duration: '5s',
      lines: [
        {
          id: '0',
          time: '13:47:58',
          type: 'text',
          message: '[TASK] - # Uploading static assets to storage'
        },
        { id: '1', time: '13:47:59', type: 'text', message: 'create mode 100644 src/main.js' },
        {
          id: '2',
          time: '13:47:59',
          type: 'text',
          message: 'create mode 100644 src/router/index.js'
        },
        {
          id: '3',
          time: '13:48:01',
          type: 'text',
          message: '[TASK] - # 24 files uploaded (1.2 MB)'
        },
        {
          id: '4',
          time: '13:48:02',
          type: 'success',
          message: '[TASK] - # Upload completed successfully!'
        }
      ]
    },
    {
      key: 'service',
      title: 'Service',
      description: 'Service and cache settings created',
      status: 'done',
      duration: '5s',
      lines: [
        { id: '0', time: '13:48:03', type: 'text', message: '[TASK] - # Creating service' },
        {
          id: '1',
          time: '13:48:05',
          type: 'text',
          message: '[TASK] - # Cache Setting __DEFAULT__ created'
        },
        {
          id: '2',
          time: '13:48:07',
          type: 'success',
          message: '[TASK] - # Service created successfully!'
        }
      ]
    },
    {
      key: 'rules',
      title: 'Routing rules',
      description: 'Request rules and cache policies applied',
      status: 'failed',
      duration: '4s',
      tag: { label: 'Failed', severity: 'danger' },
      lines: [
        {
          id: '0',
          time: '13:48:08',
          type: 'text',
          message: '[TASK] - # Configuring routing rules and cache policies'
        },
        {
          id: '1',
          time: '13:48:09',
          type: 'text',
          level: 'warn',
          message: '[ERROR] - # Routing rules rejected the configuration'
        },
        {
          id: '2',
          time: '13:48:10',
          type: 'text',
          message: "409 Conflict: rule 'default-cache' already bound to this domain"
        },
        {
          id: '3',
          time: '13:48:11',
          type: 'text',
          level: 'warn',
          message: '[ERROR] - # Deploy finalized with errors. Nothing was published.'
        }
      ]
    },
    {
      key: 'deploy',
      title: 'Publish',
      description: 'Repository wired and the deploy published',
      status: 'skipped',
      duration: '',
      tag: { label: 'Skipped', severity: 'neutral' },
      lines: []
    }
  ]
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const stepTag = (key: string) => steps.find((step) => step.key === key)?.tag

  const logView = ref<LogViewStepsView>('phased')
  const openStep = ref('rules')

  const RUN_TOAST = 'async-submit-run'

  const edit = () => toast.dismiss(RUN_TOAST)

  const redeploy = () =>
    toast.loading(`Deploying ${run.name}…`, {
      id: RUN_TOAST,
      description: `${REPO.scope}/${REPO.name}. It keeps running if you leave.`
    })

  onMounted(() =>
    toast.error(`${run.name} wasn't deployed.`, {
      id: RUN_TOAST,
      description: 'The routing rules were refused.',
      duration: 0,
      closable: true,
      actions: [
        { label: 'Edit', onClick: edit },
        { label: 'Redeploy', onClick: redeploy }
      ]
    })
  )

  onBeforeUnmount(() => toast.dismiss(RUN_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        title="Deploy web-app"
        description="Builds acme/web-app and publishes it to production. A deploy takes about half a minute and keeps running if you leave this page; the result reports back wherever you are."
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

      <div
        key="status-failed"
        class="[--popup-origin:top] layout-section-start animate-popup-scale-in motion-reduce:animate-none"
      >
        <Alert
          severity="danger"
          :label="run.error?.detail"
        >
          <template #action>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                kind="transparent"
                size="medium"
                @click="edit"
              />
              <Button
                label="Redeploy"
                kind="secondary"
                size="medium"
                icon="ai ai-refresh"
                @click="redeploy"
              />
            </div>
          </template>
        </Alert>
      </div>

      <div class="layout-section-start">
        <Card :padded="false">
          <template #header>
            <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
            <ToggleGroup
              v-model="logView"
              :options="logViews"
              class="shrink-0"
              aria-label="Log view"
            />
          </template>

          <template #content>
            <LogView.Steps
              v-model:view="logView"
              v-model:open-step="openStep"
              :steps="steps"
              :view-switch="false"
            >
              <template #header>
                <p class="shrink-0 text-heading-2xs text-(--text-default)">Logs</p>
                <div class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)">
                  <Tag
                    label="Failed on routing rules"
                    severity="danger"
                  />
                </div>
              </template>
              <template #step-meta="{ step }">
                <Tag
                  v-if="stepTag(step.key)"
                  v-bind="stepTag(step.key)"
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
            </LogView.Steps>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
