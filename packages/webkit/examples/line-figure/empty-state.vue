<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import LineFigure from '@aziontech/webkit/line-figure'
</script>

<template>
  <EmptyState
    title="Page not found"
    description="The address may be mistyped, or the page has moved."
  >
    <template #icon>
      <div class="w-60 max-w-full">
        <LineFigure name="azion-404" />
      </div>
    </template>
    <template #actions>
      <Button
        kind="secondary"
        href="/"
      >
        Go to home
      </Button>
    </template>
  </EmptyState>
</template>
