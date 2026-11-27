<script setup>
  import DocCard from '@aziontech/ui/doc-card'
  import DocCardGroup from '@aziontech/ui/doc-card-group'
</script>

<template>
  <DocCardGroup :columns="2">
    <DocCard
      title="Start from a template"
      icon="az az-layout-grid"
      href="#templates"
    >
      Ready-made projects that go live in a few clicks. No local tooling.
    </DocCard>
    <DocCard
      title="Import from GitHub"
      icon="az az-github"
      href="#github"
    >
      Connect a repository and let Azion build it on every push.
    </DocCard>
  </DocCardGroup>
</template>
