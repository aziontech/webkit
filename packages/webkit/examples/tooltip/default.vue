<script setup>
  import Button from '@aziontech/webkit/button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <Tooltip
    content="This is a Tooltip"
    side="top"
  >
    <Button
      label="Hover me"
      variant="outline"
      size="medium"
    />
  </Tooltip>
</template>
