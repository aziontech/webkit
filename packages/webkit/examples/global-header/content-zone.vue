<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console header">
      <GlobalHeader.Left>
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <Breadcrumb :items="[{ label: 'Build', href: '/build' }, { label: 'Custom Pages' }]" />
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Create"
          kind="secondary"
          size="medium"
          icon="pi pi-plus-circle"
        />
      </GlobalHeader.Right>
    </GlobalHeader>
    <div class="layout-boundary">
      <h1 class="text-heading-xl text-(--text-default)">Custom Pages</h1>
      <p class="text-body-md text-(--text-muted)">
        Manage the pages served for an error or a maintenance window.
      </p>
    </div>
  </div>
</template>
