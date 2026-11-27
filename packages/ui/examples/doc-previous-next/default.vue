<script setup>
  import DocPreviousNext from '@aziontech/ui/doc-previous-next'
</script>

<template>
  <DocPreviousNext
    :previous="{ label: 'Deploy an application', href: '/docs/deploy' }"
    :next="{ label: 'Bind a domain', href: '/docs/domains' }"
    @navigate="(event, page) => router.push(page.href)"
  />
</template>
