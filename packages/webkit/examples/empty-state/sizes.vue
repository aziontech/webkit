<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xl)">
    <EmptyState
      v-for="size in ['small', 'medium']"
      :key="size"
      :size="size"
      title="No applications yet"
      description="Create an application to start serving your site from Azion."
      icon="az az-inbox"
    >
      <template #actions>
        <div class="flex gap-(--spacing-3)">
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
  </div>
</template>
