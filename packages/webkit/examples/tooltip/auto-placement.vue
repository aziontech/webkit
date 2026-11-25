<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <div class="relative h-[28rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-sm text-(--text-muted) text-center max-w-(--container-md)"
    >
      All four triggers use <code>side="auto"</code>.<br />
      Hover or focus a trigger: its tooltip resolves to the side with the most room.
    </p>

    <div class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-up"
          aria-label="top-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute bottom-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-down"
          aria-label="bottom-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute start-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-left"
          aria-label="left-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute end-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-right"
          aria-label="right-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>
  </div>
</template>
