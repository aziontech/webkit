<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import DocHero from '@aziontech/webkit/doc-hero'

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'
</script>

<template>
  <DocHero
    title="Welcome to Azion Docs"
    description="We make every application fast and reliable. Deploy on a global network with enterprise-grade security and no cold starts."
  >
    <template #actions>
      <Button
        label="Get started"
        kind="primary"
        size="large"
        href="#"
      />
      <CopyPromptButton :value="prompt" />
    </template>
    <template #note>
      The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.
    </template>
  </DocHero>
</template>
