<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-(--spacing-8) p-(--spacing-8)">
    <Tooltip
      text="top placement"
      placement="top"
    >
      <IconButton
        icon="pi pi-arrow-up"
        aria-label="top placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      text="right placement"
      placement="right"
    >
      <IconButton
        icon="pi pi-arrow-right"
        aria-label="right placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      text="bottom placement"
      placement="bottom"
    >
      <IconButton
        icon="pi pi-arrow-down"
        aria-label="bottom placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      text="left placement"
      placement="left"
    >
      <IconButton
        icon="pi pi-arrow-left"
        aria-label="left placement"
        kind="outlined"
        size="medium"
      />
    </Tooltip>
  </div>
</template>
