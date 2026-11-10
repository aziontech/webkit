<script setup>
  import DocPagination from '@aziontech/webkit/doc-pagination'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <DocPagination
      aria-label="First page navigation"
      :next="{ title: 'Deploy an application', href: '/docs/deploy' }"
    />
    <DocPagination
      aria-label="Last page navigation"
      :previous="{ title: 'Bind a domain', href: '/docs/domains' }"
    />
  </div>
</template>
