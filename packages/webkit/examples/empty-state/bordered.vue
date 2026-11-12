<script setup>
  import EmptyState from '@aziontech/webkit/empty-state'
  import Button from '@aziontech/webkit/button'
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <EmptyState
    title="No resource yet"
    description="Get started by creating your first resource."
    icon="pi pi-inbox"
    bordered
  >
    <template #actions>
      <div class="flex gap-(--spacing-3)">
        <Button
          kind="secondary"
          label="Secondary Item"
        />
        <Button
          kind="outlined"
          label="Create Item"
        />
      </div>
      <MiniButton
        label="Docs"
        icon="pi pi-arrow-right"
        size="medium"
        href="#"
      />
    </template>
  </EmptyState>
</template>
