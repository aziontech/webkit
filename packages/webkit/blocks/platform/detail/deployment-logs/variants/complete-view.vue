<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import LogView, { type LogViewLine } from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  type StepStatus = 'done' | 'failed' | 'skipped' | 'running' | 'pending'
  type DeployStep = {
    key: string
    title: string
    description: string
    status: StepStatus
    duration: string
    lines: LogViewLine[]
  }

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
          type: 'warning',
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
          message: 'vite v6.0.7 building for production...'
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
      title: 'Routing Rules',
      description: 'Request rules and cache policies applied',
      status: 'done',
      duration: '4s',
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
          message: "[TASK] - # Rule 'Deliver Static Assets' created"
        },
        {
          id: '2',
          time: '13:48:11',
          type: 'success',
          message: '[TASK] - # Routing rules configured successfully!'
        }
      ]
    },
    {
      key: 'deploy',
      title: 'Publish',
      description: 'Repository wired and the deploy published',
      status: 'done',
      duration: '4s',
      lines: [
        {
          id: '0',
          time: '13:48:12',
          type: 'text',
          message: "branch 'main' set up to track 'origin/main'."
        },
        {
          id: '1',
          time: '13:48:13',
          type: 'text',
          message: '[TASK] - #. Set the access token as a repository secret.'
        },
        {
          id: '2',
          time: '13:48:15',
          type: 'success',
          message: '[TASK] - #. Deploy finalized successfully!'
        }
      ]
    }
  ]
  const lines = steps.flatMap((step, index) =>
    step.lines.map((line) => ({ ...line, id: `${index}-${line.id}` }))
  )
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const logView = ref('complete')
  const openStep = ref('deploy')

  const stepStatusLabels: Record<StepStatus, string> = {
    done: 'Done',
    failed: 'Failed',
    skipped: 'Skipped',
    running: 'Running',
    pending: 'Not started'
  }
</script>

<template>
  <div class="flex w-full flex-col">
    <div
      class="flex min-h-12 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <p class="shrink-0 text-heading-xxs text-(--text-default)">Deployment logs</p>
      <div class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)">
        <Tag
          label="Completed"
          severity="success"
        />
        <span class="text-label-sm text-(--text-muted)">Deployed in 42s</span>
        <ToggleGroup
          v-model="logView"
          :options="logViews"
          size="medium"
          aria-label="Log view"
        />
      </div>
    </div>
    <Accordion
      v-if="logView === 'phased'"
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
              <span
                v-else
                class="size-3.5 rounded-full border border-dashed border-(--border-default)"
              />
            </span>
            <span class="sr-only">{{ stepStatusLabels[step.status] }}</span>
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
            copyable
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
    <LogView
      v-else
      :lines="lines"
      :bordered="false"
      copyable
      loading-label="Waiting to start…"
    >
      <LogViewContent>
        <template #empty>No log lines yet.</template>
      </LogViewContent>
    </LogView>
  </div>
</template>
