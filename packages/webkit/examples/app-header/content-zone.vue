<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console header">
      <AppHeader.Start>
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <Breadcrumb :items="[{ label: 'Build', href: '/build' }, { label: 'Custom Pages' }]" />
        </div>
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Create"
          variant="secondary"
          size="medium"
          icon="ai ai-circle-plus"
        />
      </AppHeader.End>
    </AppHeader>
    <div class="layout-boundary">
      <h1 class="text-heading-xl text-(--text-default)">Custom Pages</h1>
      <p class="text-body-md text-(--text-muted)">
        Manage the pages served for an error or a maintenance window.
      </p>
    </div>
  </div>
</template>
