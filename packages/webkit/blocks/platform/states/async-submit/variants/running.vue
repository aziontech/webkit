<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import LogView, { type LogViewStep } from '@aziontech/webkit/log-view'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const status = ref('running')

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
            <LogView.Steps
              v-model:open-step="openStep"
              :steps="steps"
              :copyable="false"
              :view-switch="false"
              progress
            >
              <template #header>
                <p class="shrink-0 text-heading-xxs text-(--text-default)">Logs</p>
                <div class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)">
                  <span class="shrink-0 text-label-sm text-(--text-default)">2/8 steps</span>
                  <span class="truncate text-label-sm text-(--text-muted)"
                    >Install dependencies</span
                  >
                </div>
              </template>
            </LogView.Steps>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
