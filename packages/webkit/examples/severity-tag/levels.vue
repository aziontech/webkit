<script setup>
  import SeverityTag from '@aziontech/webkit/severity-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SeverityTag level="critical" />
    <SeverityTag level="high" />
    <SeverityTag level="medium" />
    <SeverityTag level="low" />
    <SeverityTag level="info" />
  </div>
</template>
