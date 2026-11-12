<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xl)">
    <EmptyState
      v-for="size in ['small', 'medium']"
      :key="size"
      :size="size"
      title="No resource yet"
      description="Get started by creating your first resource."
      icon="pi pi-inbox"
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
  </div>
</template>
