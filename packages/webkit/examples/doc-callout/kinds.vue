<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <DocCallout kind="note">A neutral aside the reader should not skip.</DocCallout>
    <DocCallout kind="info">Background that explains why the step exists.</DocCallout>
    <DocCallout kind="tip"
      >Run <code>azion deploy --local</code> to skip the remote install.</DocCallout
    >
    <DocCallout kind="check">The certificate is issued and renews on its own.</DocCallout>
    <DocCallout kind="warning"
      >Changing the preset rebuilds every function in the workload.</DocCallout
    >
    <DocCallout kind="danger"
      >Deleting a workload releases its domain and cannot be undone.</DocCallout
    >
  </div>
</template>
