<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <EmptyState
    title="No resource yet"
    description="Get started by creating your first resource."
    icon="az az-inbox"
    bordered
  >
    <template #actions>
      <div class="flex gap-(--spacing-3)">
        <Button
          variant="secondary"
          label="Secondary Item"
        />
        <Button
          variant="outline"
          label="Create Item"
        />
      </div>
      <Link
        label="Docs"
        icon="az az-arrow-right"
        size="medium"
        href="#"
      />
    </template>
  </EmptyState>
</template>
