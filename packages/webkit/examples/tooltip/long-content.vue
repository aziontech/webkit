<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <Tooltip
    content="This tooltip contains a longer message that wraps across multiple lines when it exceeds the maximum width of the panel."
    placement="top"
  >
    <IconButton
      icon="ai ai-circle-info"
      aria-label="More information"
      kind="transparent"
      size="small"
    />
  </Tooltip>
</template>
