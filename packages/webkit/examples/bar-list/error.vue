<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <BarList
      aria-label="Top paths"
      error="The analytics service did not answer. Check your connection and try again."
    >
      <template #error>
        <EmptyState
          title="Could not load the top paths"
          description="The analytics service did not answer. Check your connection and try again."
          icon="az az-triangle-alert"
          size="small"
          bordered
        >
          <template #actions>
            <Button
              label="Try again"
              variant="secondary"
              size="small"
              icon="az az-refresh"
            />
          </template>
        </EmptyState>
      </template>
    </BarList>
  </div>
</template>
