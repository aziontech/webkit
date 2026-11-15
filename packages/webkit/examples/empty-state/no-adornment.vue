<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <EmptyState
    title="No resource yet"
    description="Get started by creating your first resource."
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
      <Link
        label="Docs"
        icon="pi pi-arrow-right"
        size="medium"
        href="#"
      />
    </template>
  </EmptyState>
</template>
