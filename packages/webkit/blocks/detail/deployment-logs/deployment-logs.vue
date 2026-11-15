<script setup lang="ts">
  import LogView, { type LogViewStep } from '@aziontech/webkit/log-view'
  import { computed, ref } from 'vue'

  const steps: LogViewStep[] = [
    {
      id: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'success',
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
      id: 'clone',
      title: 'Clone template',
      description: 'Template cloned into the GitHub scope',
      status: 'success',
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
      id: 'install',
      title: 'Install dependencies',
      description: '478 packages installed',
      status: 'success',
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
      id: 'build',
      title: 'Build',
      description: 'Project built into dist/',
      status: 'running',
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
      id: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      id: 'service',
      title: 'Service',
      description: 'Service and cache settings created',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      id: 'rules',
      title: 'Routing Rules',
      description: 'Request rules and cache policies applied',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      id: 'deploy',
      title: 'Publish',
      description: 'Repository wired and the deploy published',
      status: 'pending',
      duration: '',
      lines: []
    }
  ]

  const openStep = ref('build')

  const doneCount = computed(() => steps.filter((step) => step.status === 'success').length)
  const currentStep = computed(
    () => steps.find((step) => step.status === 'running' || step.status === 'error')?.title ?? ''
  )
</script>

<template>
  <LogView.Steps
    :steps="steps"
    v-model:open-step="openStep"
    :copyable="false"
    :view-switch="false"
    progress
  >
    <template #header>
      <h2 class="m-0 shrink-0 text-heading-2xs text-(--text-default)">Deployment logs</h2>
      <div
        role="status"
        class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)"
      >
        <span class="shrink-0 text-label-sm text-(--text-default)"
          >{{ doneCount }}/{{ steps.length }} steps</span
        >
        <span class="truncate text-label-sm text-(--text-muted)">{{ currentStep }}</span>
      </div>
    </template>
  </LogView.Steps>
</template>
