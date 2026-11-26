<script setup lang="ts">
  import LogViewer, { type LogViewerStep } from '@aziontech/ui/log-viewer'
  import Tag from '@aziontech/ui/tag'

  const steps: LogViewerStep[] = [
    {
      id: 'build',
      title: 'Build',
      description: 'Static assets bundled for the edge',
      status: 'success',
      duration: '9s',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: 'Running npm run build' },
        { id: '1', time: '13:47:50', type: 'success', message: 'Build finished' }
      ]
    },
    {
      id: 'rules',
      title: 'Routing Rules',
      description: 'The rule Deliver Static Assets points to a missing origin.',
      status: 'error',
      duration: '4s',
      lines: [
        {
          id: '0',
          time: '13:48:08',
          type: 'text',
          message: 'Configuring routing rules and cache policies'
        },
        {
          id: '1',
          time: '13:48:09',
          type: 'text',
          level: 'error',
          message: 'Origin static-origin was not found'
        }
      ]
    },
    {
      id: 'publish',
      title: 'Publish',
      description: 'Deploy published to the edge',
      status: 'skipped',
      lines: []
    }
  ]
</script>

<template>
  <div class="w-full rounded-(--shape-control) border border-(--border-default)">
    <LogViewer.Steps :steps="steps">
      <template #header>
        <h2 class="m-0 text-heading-2xs text-(--text-default)">Deployment logs</h2>
        <Tag
          label="Failed: Routing Rules"
          severity="danger"
        />
      </template>
      <template #step-meta="{ step }">
        <Tag
          v-if="step.status === 'skipped'"
          label="Skipped"
          severity="neutral"
          size="small"
        />
      </template>
      <template #step-empty="{ step }">
        {{ step.status === 'skipped' ? 'Never ran. The deployment stopped at Routing Rules.' : '' }}
      </template>
    </LogViewer.Steps>
  </div>
</template>
