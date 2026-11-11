<script setup>
  import OverflowCount from '@aziontech/webkit/overflow-count'

  const domains = ['shop.example.com', 'api.example.com', 'img.example.com', 'docs.example.com']
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) min-w-0 items-center gap-(--spacing-xs)">
    <a
      :href="`https://${domains[0]}`"
      target="_blank"
      rel="noopener noreferrer"
      class="min-w-0 truncate text-body-sm text-(--text-default) underline-offset-2 hover:underline"
      >{{ domains[0] }}</a
    >
    <OverflowCount
      :items="domains.slice(1).map((label) => ({ label, href: `https://${label}` }))"
      :noun="{ one: 'domain', other: 'domains' }"
    />
  </div>
</template>
