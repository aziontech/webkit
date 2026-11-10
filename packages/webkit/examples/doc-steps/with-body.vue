<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Install the Azion CLI">
      <p>
        Homebrew is the shortest path on macOS; every other platform is documented in the CLI
        reference.
      </p>
    </DocStep>
    <DocStep title="Link the project">
      <p>
        Reads your project, picks a preset, and writes the <code>azion/</code> folder that describes
        the workload.
      </p>
    </DocStep>
    <DocStep title="Deploy" />
  </DocSteps>
</template>
