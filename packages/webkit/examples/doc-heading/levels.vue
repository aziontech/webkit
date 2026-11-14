<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <DocHeading
      anchor="cache"
      :level="1"
      label="Cache"
    />
    <DocHeading
      anchor="cache-rules"
      :level="2"
      label="Cache rules"
    />
    <DocHeading
      anchor="cache-keys"
      :level="3"
      label="Cache keys"
    />
    <DocHeading
      anchor="query-strings"
      :level="4"
      label="Query strings"
    />
  </div>
</template>
