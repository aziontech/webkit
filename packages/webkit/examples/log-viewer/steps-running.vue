<script setup lang="ts">
  import LogViewer, { type LogViewerStep } from '@aziontech/webkit/log-viewer'

  const steps: LogViewerStep[] = [
    {
      id: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'success',
      duration: '3s',
      lines: [
        { id: '0', time: '13:47:33', type: 'success', message: 'Deploy started successfully!' },
        { id: '1', time: '13:47:36', type: 'success', message: 'Token added successfully!' }
      ]
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Bundling static assets for the edge',
      status: 'running',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: 'Running npm run build' },
        { id: '1', time: '13:47:44', type: 'text', message: 'Transforming 312 modules' }
      ]
    },
    {
      id: 'rules',
      title: 'Routing Rules',
      description: 'Request rules and cache policies',
      status: 'pending',
      lines: []
    },
    {
      id: 'publish',
      title: 'Publish',
      description: 'Deploy published to the edge',
      status: 'pending',
      lines: []
    }
  ]
</script>

<template>
  <div class="w-full rounded-(--shape-control) border border-(--border-default)">
    <LogViewer.Steps
      :steps="steps"
      :view-switch="false"
      progress
    >
      <template #header>
        <h2 class="m-0 text-heading-2xs text-(--text-default)">Deployment logs</h2>
        <span class="text-label-sm text-(--text-muted)">Step 2 of 4: Build</span>
      </template>
    </LogViewer.Steps>
  </div>
</template>
