<script setup>
  import HelperText from '@aziontech/webkit/helper-text'
</script>

<template>
  <div class="flex flex-col gap-2">
    <HelperText
      type="helper"
      label="Helper Text"
    />
    <HelperText
      type="invalid"
      label="Text Error"
    />
    <HelperText
      type="required"
      label="Text Error"
    />
    <HelperText
      type="disabled"
      label="Helper Text"
    />
  </div>
</template>
