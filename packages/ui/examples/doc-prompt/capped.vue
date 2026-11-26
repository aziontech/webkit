<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <DocPrompt title="Priming prompt">
    You are working in an Azion Web Platform project. Read the repository, identify the framework
    and its build output directory, then create the edge application, bind a domain to it, and
    deploy. Before you deploy, tell me which framework you detected and which build command you are
    about to run, and wait for me to confirm. After the deploy succeeds, report the edge URL and the
    propagation time, and leave the build artifacts in place so I can inspect them.
  </DocPrompt>
</template>
