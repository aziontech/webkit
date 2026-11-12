<script setup>
  import Button from '@aziontech/webkit/button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <Tooltip
    text="This is a Tooltip"
    placement="top"
  >
    <Button
      label="Hover me"
      kind="outlined"
      size="medium"
    />
  </Tooltip>
</template>
