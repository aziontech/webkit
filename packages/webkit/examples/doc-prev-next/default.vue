<script setup>
  import DocPrevNext from '@aziontech/webkit/doc-prev-next'
</script>

<template>
  <DocPrevNext
    :previous="{ label: 'Deploy an application', href: '/docs/deploy' }"
    :next="{ label: 'Bind a domain', href: '/docs/domains' }"
    @navigate="(event, page) => router.push(page.href)"
  />
</template>
