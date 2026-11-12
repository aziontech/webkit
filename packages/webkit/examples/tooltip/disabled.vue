<script setup>
  import Tooltip from '@aziontech/webkit/tooltip'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Tooltip
    text="This is a Tooltip"
    disabled
  >
    <Button
      label="Hover me"
      kind="outlined"
      size="medium"
    />
  </Tooltip>
</template>
