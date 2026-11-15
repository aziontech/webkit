<script setup>
  import DocPrevNext from '@aziontech/webkit/doc-prev-next'
</script>

<template>
  <DocPrevNext
    :previous="{ title: 'Deploy an application', href: '/docs/deploy' }"
    :next="{ title: 'Bind a domain', href: '/docs/domains' }"
    @navigate="(event, page) => router.push(page.href)"
  />
</template>
