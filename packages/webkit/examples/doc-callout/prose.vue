<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <DocCallout kind="warning">
    <p>
      Certificates cross-signed by the retired root stop validating on older devices. It will be
      necessary to take the following actions:
    </p>
    <ul>
      <li>
        <strong>Certificates on the retired chain</strong>: migrate to the new chain or to an Azion
        certificate.
      </li>
      <li><strong>Other certificates</strong>: no action needed; they are unaffected.</li>
    </ul>
  </DocCallout>
</template>
