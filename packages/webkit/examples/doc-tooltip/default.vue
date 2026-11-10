<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocTooltip from '@aziontech/webkit/doc-tooltip'
</script>

<template>
  <DocProse>
    <p>
      Every deploy produces an
      <DocTooltip
        headline="Edge Application"
        tip="The build that runs at the edge, close to the people using it."
      >
        edge application
      </DocTooltip>
      built from your <code>azion.config.js</code>.
    </p>
  </DocProse>
</template>
