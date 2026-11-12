<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <DocHeading
      id="cache"
      :level="1"
      label="Cache"
    />
    <DocHeading
      id="cache-rules"
      :level="2"
      label="Cache rules"
    />
    <DocHeading
      id="cache-keys"
      :level="3"
      label="Cache keys"
    />
    <DocHeading
      id="query-strings"
      :level="4"
      label="Query strings"
    />
  </div>
</template>
