<script setup>
  import DocPrevNext from '@aziontech/webkit/doc-prev-next'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <DocPrevNext
      aria-label="First page navigation"
      :next="{ title: 'Deploy an application', href: '/docs/deploy' }"
    />
    <DocPrevNext
      aria-label="Last page navigation"
      :previous="{ title: 'Bind a domain', href: '/docs/domains' }"
    />
  </div>
</template>
