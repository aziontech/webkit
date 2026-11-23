<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <EmptyState
    title="No applications yet"
    description="Create an application to start serving your site from Azion."
    icon="az az-inbox"
    bordered
  >
    <template #actions>
      <div class="flex flex-wrap justify-center gap-(--spacing-xs)">
        <Button
          variant="primary"
          label="Create application"
        />
        <Button
          variant="outline"
          label="Import from GitHub"
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
