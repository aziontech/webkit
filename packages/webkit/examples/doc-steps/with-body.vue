<script setup>
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocSteps.Step title="Install the Azion CLI">
      <p>
        Homebrew is the shortest path on macOS; every other platform is documented in the CLI
        reference.
      </p>
    </DocSteps.Step>
    <DocSteps.Step title="Link the project">
      <p>
        Reads your project, picks a preset, and writes the <code>azion/</code> folder that describes
        the workload.
      </p>
    </DocSteps.Step>
    <DocSteps.Step title="Deploy" />
  </DocSteps>
</template>
