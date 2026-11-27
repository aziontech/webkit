<script setup>
  import SiteFooterSection from '@aziontech/ui/site-footer-section'
  import { ref } from 'vue'

  const columns = [
    {
      title: 'Company',
      links: [
        { label: 'About us', href: '#' },
        { label: 'Careers', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Blog', href: '#' }
      ]
    }
  ]

  const language = ref('PT-BR')
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-md)">
    <SiteFooterSection
      v-model:language="language"
      variant="content"
      home="#"
      :columns="columns"
      :languages="['EN', 'PT-BR', 'ES']"
    />
    <p class="px-(--spacing-md) text-body-sm text-(--text-muted)">Page language: {{ language }}</p>
  </div>
</template>
