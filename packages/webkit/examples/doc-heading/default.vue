<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <DocProse>
    <DocHeading
      anchor="purge-by-url"
      :level="2"
    >
      Purge by URL
    </DocHeading>
    <p>Remove one cached object by its full URL, query string included.</p>
  </DocProse>
</template>
