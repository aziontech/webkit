<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'pi pi-folder',
      children: [
        { id: 'assets/hero.webp', label: 'hero.webp', icon: 'pi pi-image', description: '248 KB' },
        { id: 'assets/logo.svg', label: 'logo.svg', icon: 'pi pi-image', description: '12 KB' },
        { id: 'assets/styles.css', label: 'styles.css', icon: 'pi pi-file', description: '18 KB' }
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
    { id: 'index.html', label: 'index.html', icon: 'pi pi-file', description: '4 KB' }
  ]

  const expanded = ref(['assets', 'reports'])
  const selectedIds = ref(['assets/hero.webp', 'assets/logo.svg'])
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
    <Tree
      v-model:expanded="expanded"
      v-model:selected-ids="selectedIds"
      :items="items"
      selectable="multiple"
      aria-label="Bucket objects"
    />
    <p class="text-body-sm text-(--text-muted)">
      {{ selectedIds.length }} selected: {{ selectedIds.join(', ') || 'none' }}
    </p>
  </div>
</template>
