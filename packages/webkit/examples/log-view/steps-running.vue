<script setup lang="ts">
  import LogView, { type LogViewStep } from '@aziontech/webkit/log-view'

  const steps: LogViewStep[] = [
    {
      key: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'done',
      duration: '3s',
      lines: [
        { id: '0', time: '13:47:33', type: 'success', message: 'Deploy started successfully!' },
        { id: '1', time: '13:47:36', type: 'success', message: 'Token added successfully!' }
      ]
    },
    {
      key: 'build',
      title: 'Build',
      description: 'Bundling static assets for the edge',
      status: 'running',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: 'Running npm run build' },
        { id: '1', time: '13:47:44', type: 'text', message: 'Transforming 312 modules' }
      ]
    },
    {
      key: 'rules',
      title: 'Routing Rules',
      description: 'Request rules and cache policies',
      status: 'pending',
      lines: []
    },
    {
      key: 'publish',
      title: 'Publish',
      description: 'Deploy published to the edge',
      status: 'pending',
      lines: []
    }
  ]
</script>

<template>
  <div class="w-full rounded-(--shape-control) border border-(--border-default)">
    <LogView.Steps
      :steps="steps"
      :view-switch="false"
      progress
    >
      <template #header>
        <h2 class="m-0 text-heading-2xs text-(--text-default)">Deployment logs</h2>
        <span class="text-label-sm text-(--text-muted)">Step 2 of 4: Build</span>
      </template>
    </LogView.Steps>
  </div>
</template>
