<script setup>
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-lg)">
    <OutcomeMark severity="success" />
    <OutcomeMark severity="danger" />
    <OutcomeMark severity="warning" />
    <OutcomeMark severity="neutral" />
  </div>
</template>
