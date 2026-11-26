<script setup>
  import Link from '@aziontech/ui/link'
  import OverflowCount from '@aziontech/ui/overflow-count'

  const domains = ['shop.example.com', 'api.example.com', 'img.example.com', 'docs.example.com']
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) min-w-0 items-center gap-(--spacing-xs)">
    <Link
      :href="`https://${domains[0]}`"
      :label="domains[0]"
      target="_blank"
      size="small"
    />
    <OverflowCount
      :items="domains.slice(1).map((label) => ({ label, href: `https://${label}` }))"
      :noun="{ one: 'domain', other: 'domains' }"
    />
  </div>
</template>
