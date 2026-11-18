<script setup>
  import DocTableOfContents from '@aziontech/webkit/doc-table-of-contents'
</script>

<template>
  <DocTableOfContents
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
          { label: 'View source', href: 'https://github.com/aziontech', icon: 'az az-github' }
        ]
      }
    ]"
    @select="(event, item) => scrollToHeading(item.id)"
  />
</template>
