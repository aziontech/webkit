<script setup>
  import CopyText from '@aziontech/ui/copy-text'
</script>

<template>
  <div class="flex max-w-(--container-3xs) flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">CNAME</span>
    <CopyText
      value="acme-store-production.example.com"
      aria-label="Copy CNAME"
    />
  </div>
</template>
