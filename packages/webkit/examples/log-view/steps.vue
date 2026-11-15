<script setup lang="ts">
  import LogView, { type LogViewStep } from '@aziontech/webkit/log-view'
  import Tag from '@aziontech/webkit/tag'

  const steps: LogViewStep[] = [
    {
      key: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'done',
      duration: '3s',
      lines: [
        { id: '0', time: '13:47:33', type: 'success', message: 'Deploy started successfully!' },
        { id: '1', time: '13:47:35', type: 'text', message: 'Adding token to the CLI' },
        { id: '2', time: '13:47:36', type: 'success', message: 'Token added successfully!' }
      ]
    },
    {
      key: 'build',
      title: 'Build',
      description: 'Static assets bundled for the edge',
      status: 'done',
      duration: '9s',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: 'Running npm run build' },
        {
          id: '1',
          time: '13:47:47',
          type: 'text',
          level: 'warn',
          message: 'Bundle larger than recommended'
        },
        { id: '2', time: '13:47:50', type: 'success', message: 'Build finished' }
      ]
    },
    {
      key: 'publish',
      title: 'Publish',
      description: 'Deploy published to the edge',
      status: 'done',
      duration: '4s',
      lines: [
        { id: '0', time: '13:47:52', type: 'text', message: 'Uploading 24 files' },
        { id: '1', time: '13:47:54', type: 'success', message: 'Deploy finalized successfully!' }
      ]
    }
  ]
</script>

<template>
  <div class="w-full rounded-(--shape-control) border border-(--border-default)">
    <LogView.Steps
      :steps="steps"
      open-step="build"
    >
      <template #header>
        <h2 class="m-0 text-heading-2xs text-(--text-default)">Deployment logs</h2>
        <Tag
          label="Completed"
          severity="success"
        />
        <span class="text-label-sm text-(--text-muted)">Deployed in 16s</span>
      </template>
    </LogView.Steps>
  </div>
</template>
