<script setup>
  import HelperText from '@aziontech/webkit/helper-text'
</script>

<template>
  <div class="flex flex-col gap-2">
    <HelperText
      kind="helper"
      label="Helper Text"
    />
    <HelperText
      kind="invalid"
      label="Text Error"
    />
    <HelperText
      kind="required"
      label="Text Error"
    />
    <HelperText
      kind="disabled"
      label="Helper Text"
    />
  </div>
</template>
