<script setup>
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
</script>

<template>
  <DocTabs>
    <DocTab title="macOS">
      <p>Install the CLI with Homebrew, then run it once to sign in.</p>
    </DocTab>
    <DocTab title="Linux">
      <p>Download the binary for your architecture and put it on your path.</p>
    </DocTab>
    <DocTab title="Windows">
      <p>Run the installer, then open a new terminal so the path is picked up.</p>
    </DocTab>
  </DocTabs>
</template>
