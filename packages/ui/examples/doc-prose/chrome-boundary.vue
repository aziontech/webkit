<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <DocProse>
    <h2>The contract stops at a component's edge</h2>
    <p>This paragraph is authored prose, so it takes the prose rung and the prose ink.</p>
    <div data-doc-chrome>
      <h2>A component's own heading</h2>
      <p>A component's own copy keeps whatever that component gives it.</p>
    </div>
    <p>And prose after the component picks the ladder back up.</p>
  </DocProse>
</template>
