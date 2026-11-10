<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
</script>

<template>
  <DocCardGroup :cols="2">
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
  </DocCardGroup>
</template>
