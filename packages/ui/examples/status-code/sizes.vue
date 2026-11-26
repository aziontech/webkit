<script setup>
  import StatusCode from '@aziontech/ui/status-code'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <StatusCode
      :code="429"
      method="POST"
      size="small"
    />
    <StatusCode
      :code="429"
      method="POST"
      size="medium"
    />
  </div>
</template>
