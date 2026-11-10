<script setup>
  import DocPagination from '@aziontech/webkit/doc-pagination'
</script>

<template>
  <DocPagination
    :previous="{ title: 'Deploy an application', href: '/docs/deploy' }"
    :next="{ title: 'Bind a domain', href: '/docs/domains' }"
    @navigate="(event, page) => router.push(page.href)"
  />
</template>
