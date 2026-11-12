<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Tooltip
    text="This tooltip contains a longer message that wraps across multiple lines when it exceeds the maximum width of the panel."
    placement="top"
  >
    <IconButton
      icon="pi pi-info-circle"
      aria-label="More information"
      kind="transparent"
      size="small"
    />
  </Tooltip>
</template>
