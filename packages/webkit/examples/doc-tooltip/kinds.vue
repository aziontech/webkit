<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocTooltip from '@aziontech/webkit/doc-tooltip'
</script>

<template>
  <DocProse>
    <p>
      A passive gloss just defines the term: a
      <DocTooltip
        title="workload"
        tip="The binding between a domain and the application that answers on it."
      >
        workload
      </DocTooltip>
      is the pairing the deploy creates. Its panel is a real tooltip describing the term.
    </p>
    <p>
      An interactive gloss closes on somewhere to go, so it is a small dialog instead: an
      <DocTooltip
        title="Edge Application"
        tip="The build that runs at the edge, close to the people using it."
        link-label="Read the guide"
        href="/docs/edge-application"
      >
        edge application
      </DocTooltip>
      can be read about at length.
    </p>
  </DocProse>
</template>
