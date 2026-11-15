<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import EmptyState from '@aziontech/webkit/empty-state'

  const versionId = 'AQ3M9TZK'
</script>

<template>
  <div class="layout-boundary flex min-h-0 flex-1 flex-col">
    <ConsoleLayout.Breadcrumbs
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: 'web-app', href: '/resources/1784552864' },
        { label: versionId }
      ]"
    />
    <div
      class="layout-column-focused flex min-h-0 flex-1 flex-col justify-center py-(--layout-section-gap)"
    >
      <h1 class="sr-only">Version not found</h1>
      <EmptyState
        icon="ai ai-history"
        title="Version not found"
        :description="`web-app has no version ${versionId}. It may have been deleted, or the link may be out of date.`"
        bordered
      >
        <template #actions>
          <Button
            label="View Versions"
            kind="outlined"
            size="medium"
            href="/resources/1784552864?tab=versions"
          />
        </template>
      </EmptyState>
    </div>
  </div>
</template>
