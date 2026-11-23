<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <DocProse>
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
  </DocProse>
</template>
