<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
</script>

<template>
  <DocCardGroup :cols="3">
    <DocCard
      title="Start from a template"
      icon="pi pi-th-large"
      href="#templates"
    >
      Ready-made projects that go live in a few clicks. No local tooling.
    </DocCard>
    <DocCard
      title="Import from GitHub"
      icon="pi pi-github"
      href="#github"
    >
      Connect a repository and let Azion build it on every push.
    </DocCard>
    <DocCard
      title="Deploy with the CLI"
      icon="pi pi-desktop"
      href="#cli"
    >
      Ship the project already open in your editor.
    </DocCard>
  </DocCardGroup>
</template>
