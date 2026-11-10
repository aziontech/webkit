<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'pi pi-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'pi pi-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'pi pi-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'pi pi-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'pi pi-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'pi pi-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'pi pi-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'pi pi-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'pi pi-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'pi pi-file',
      description: '1 KB'
    }
  ]

  const expanded = ref(['assets', 'assets/images'])
  const selected = ref('assets/images/hero.webp')
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
    <Tree
      v-model:expanded="expanded"
      v-model:selected="selected"
      :items="items"
      selectable
      aria-label="Bucket objects"
    />
    <p class="text-body-sm text-(--text-muted)">Selected: {{ selected || 'none' }}</p>
  </div>
</template>
