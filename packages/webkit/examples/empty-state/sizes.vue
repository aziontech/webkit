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
      title="No resource yet"
      description="Get started by creating your first resource."
      icon="ai ai-inbox"
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
          icon="ai ai-arrow-right"
          size="medium"
          href="#"
        />
      </template>
    </EmptyState>
  </div>
</template>
