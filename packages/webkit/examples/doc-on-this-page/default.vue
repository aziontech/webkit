<script setup>
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
</script>

<template>
  <DocOnThisPage
    :items="[
      { id: 'deploy', text: 'Deploy an application', depth: 2 },
      { id: 'what-you-get', text: 'What you get', depth: 3 },
      { id: 'build-command', text: 'Build command', depth: 3 },
      { id: 'bind-a-domain', text: 'Bind a domain', depth: 2 }
    ]"
    active-id="what-you-get"
    :groups="[
      {
        label: 'Repository',
        links: [
          { label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }
        ]
      }
    ]"
    @select="(event, item) => scrollToHeading(item.id)"
  />
</template>
