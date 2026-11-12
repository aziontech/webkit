<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <DocPrompt kind="line">Show me this application traffic for the last 24 hours.</DocPrompt>
    <DocPrompt kind="line">Add a rate-limit rule to the firewall in front of it.</DocPrompt>
    <DocPrompt kind="line">Roll the last deployment back and tell me what changed.</DocPrompt>
  </div>
</template>
