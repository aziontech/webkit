<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'ai ai-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'ai ai-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'ai ai-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'ai ai-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'ai ai-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'ai ai-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'ai ai-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'ai ai-file',
      description: '1 KB'
    }
  ]

  const expanded = ref(['assets', 'assets/images'])
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Tree
      v-model:open-keys="expanded"
      :items="items"
      aria-label="Bucket objects"
    />
  </div>
</template>
