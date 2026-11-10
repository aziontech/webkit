<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import CardBox from '@aziontech/webkit/card-box'
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import Spinner from '@aziontech/webkit/spinner'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const steps = [
    {
      key: 'token',
      title: 'Access Token',
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
      title: 'Clone Template',
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
      title: 'Routing Rules',
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
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
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
          <div class="ml-auto flex min-w-0 items-center gap-(--spacing-sm)">
            <span class="shrink-0 text-label-sm text-(--text-default)">2/8 steps</span>
            <span class="truncate text-label-sm text-(--text-muted)">Install dependencies</span>
          </div>
        </div>
        <Accordion
          v-model:value="openStep"
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
                  class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-left data-[state=failed]:flex-wrap"
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
                <span class="ml-auto flex shrink-0 items-center">
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
                :border="false"
                :show-copy="false"
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
        <ProgressBar
          :value="32"
          :max="100"
          size="small"
          shape="flat"
          class="w-full"
          aria-label="Deployment progress"
        />
      </div>
    </template>
  </CardBox>
</template>
