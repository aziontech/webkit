<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Install the CLI.">
      <p>Download the binary for your system and add it to your path.</p>
    </DocStep>
    <DocStep title="Log in.">
      <p>Run the login command and paste the token from your account settings.</p>
    </DocStep>
    <DocStep title="Deploy the project." />
  </DocSteps>
</template>
