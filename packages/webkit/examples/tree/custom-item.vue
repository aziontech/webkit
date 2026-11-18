<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'az az-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'az az-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'az az-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'az az-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'az az-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'az az-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'az az-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'az az-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'az az-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'az az-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'az az-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'az az-file',
      description: '1 KB'
    }
  ]

  const expanded = ref(['assets', 'assets/images'])

  const lastAction = ref('')

  const actionLabels = {
    download: 'Downloaded',
    'copy-path': 'Copied the path of',
    delete: 'Deleted'
  }

  function onAction(item, value) {
    lastAction.value = `${actionLabels[value]} ${item.label}`
  }

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
      severity: 'neutral'
    }
  }
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
    <Tree
      v-model:open-keys="expanded"
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
        <DropdownMenuRoot
          align="end"
          @select="(event, value) => onAction(item, value)"
        >
          <DropdownMenuTrigger>
            <IconButton
              icon="az az-ellipsis"
              variant="ghost"
              size="small"
              :aria-label="'More actions for ' + item.label"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuItem
              value="download"
              label="Download"
            />
            <DropdownMenuItem
              value="copy-path"
              label="Copy path"
            />
            <DropdownMenuItem
              value="delete"
              label="Delete"
            />
          </DropdownMenuGroup>
        </DropdownMenuRoot>
      </template>
    </Tree>
    <p
      class="text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      Last action: {{ lastAction || 'none' }}
    </p>
  </div>
</template>
