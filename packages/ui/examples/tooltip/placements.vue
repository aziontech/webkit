<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-(--spacing-8) p-(--spacing-8)">
    <Tooltip
      content="top side"
      side="top"
    >
      <IconButton
        icon="az az-arrow-up"
        aria-label="top side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      content="end side"
      side="end"
    >
      <IconButton
        icon="az az-arrow-right"
        aria-label="end side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      content="bottom side"
      side="bottom"
    >
      <IconButton
        icon="az az-arrow-down"
        aria-label="bottom side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      content="start side"
      side="start"
    >
      <IconButton
        icon="az az-arrow-left"
        aria-label="start side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
  </div>
</template>
