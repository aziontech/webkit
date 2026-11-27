<script setup>
  import DocPreviousNext from '@aziontech/ui/doc-previous-next'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <DocPreviousNext
      aria-label="First page navigation"
      :next="{ label: 'Deploy an application', href: '/docs/deploy' }"
    />
    <DocPreviousNext
      aria-label="Last page navigation"
      :previous="{ label: 'Bind a domain', href: '/docs/domains' }"
    />
  </div>
</template>
