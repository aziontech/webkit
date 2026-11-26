<script setup>
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
  import Link from '@aziontech/ui/link'
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
  </div>
</template>
