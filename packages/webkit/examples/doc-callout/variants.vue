<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <DocCallout variant="note">A neutral aside the reader should not skip.</DocCallout>
    <DocCallout variant="info">Background that explains why the step exists.</DocCallout>
    <DocCallout variant="tip"
      >Run <code data-command>azion deploy --local</code> to skip the remote install.</DocCallout
    >
    <DocCallout variant="check">The certificate is issued and renews on its own.</DocCallout>
    <DocCallout variant="warning"
      >Changing the preset rebuilds every function in the workload.</DocCallout
    >
    <DocCallout variant="danger"
      >Deleting a workload releases its domain and cannot be undone.</DocCallout
    >
  </div>
</template>
