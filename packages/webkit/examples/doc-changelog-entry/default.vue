<script setup>
  import DocChangelogEntry from '@aziontech/webkit/doc-changelog-entry'
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <DocProse>
    <DocChangelogEntry
      label="August 19, 2026"
      description="v2.4.0"
      :tags="['Console', 'Functions']"
    >
      <p>
        Rules Engine conditions now match on request headers, so a rule can branch on anything the
        client sends without a function in the path.
      </p>
    </DocChangelogEntry>
  </DocProse>
</template>
