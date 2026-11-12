<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocProse>
    <DocUpdate
      label="August 19, 2026"
      description="v2.4.0"
      :tags="['Console', 'Edge Functions']"
    >
      <p>
        Rules Engine conditions now match on request headers, so a rule can branch on anything the
        client sends without a function in the path.
      </p>
    </DocUpdate>
  </DocProse>
</template>
