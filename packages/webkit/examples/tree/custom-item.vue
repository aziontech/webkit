<script setup>
  import Tree from '@aziontech/webkit/tree'
  import Tag from '@aziontech/webkit/tag'
  import IconButton from '@aziontech/webkit/icon-button'
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

  const statuses = {
    'assets/styles.css': {
      label: 'Modified',
      severity: 'warning'
    },
    'index.html': {
      label: 'Published',
      severity: 'success'
    },
    'robots.txt': {
      label: 'Draft',
      severity: 'secondary'
    }
  }
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Tree
      v-model:expanded="expanded"
      :items="items"
      aria-label="Bucket objects"
    >
      <template #item="{ item }">
        <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
          <i
            :class="item.icon"
            aria-hidden="true"
          />
          <span class="min-w-0 truncate text-label-md text-(--text-default)">{{ item.label }}</span>
          <Tag
            v-if="statuses[item.id]"
            :label="statuses[item.id].label"
            :severity="statuses[item.id].severity"
            size="small"
          />
        </span>
      </template>
      <template #actions="{ item }">
        <IconButton
          icon="pi pi-ellipsis-h"
          kind="transparent"
          size="small"
          :aria-label="'More actions for ' + item.label"
        />
      </template>
    </Tree>
  </div>
</template>
