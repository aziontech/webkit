<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="relative h-[28rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All four triggers use <code>placement="auto"</code>.<br />
      Each tooltip resolves to the side with the most available space.
    </p>

    <div class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-up"
          aria-label="top-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute bottom-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-down"
          aria-label="bottom-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute left-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-left"
          aria-label="left-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute right-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        text="auto placement"
        placement="auto"
        :default-open="true"
      >
        <IconButton
          icon="pi pi-arrow-right"
          aria-label="right-edge trigger"
          kind="outlined"
          size="medium"
        />
      </Tooltip>
    </div>
  </div>
</template>
