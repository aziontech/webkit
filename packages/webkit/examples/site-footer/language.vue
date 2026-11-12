<script setup>
  import SiteFooter from '@aziontech/webkit/site-footer'
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
    <SiteFooter
      v-model:language="language"
      kind="content"
      home="#"
      :columns="columns"
      :languages="['EN', 'PT-BR', 'ES']"
    />
    <p class="px-(--spacing-md) text-body-sm text-(--text-muted)">Page language: {{ language }}</p>
  </div>
</template>
