<script setup>
  import SeverityTag from '@aziontech/webkit/severity-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SeverityTag severity="critical" />
    <SeverityTag severity="high" />
    <SeverityTag severity="medium" />
    <SeverityTag severity="low" />
    <SeverityTag severity="info" />
  </div>
</template>
