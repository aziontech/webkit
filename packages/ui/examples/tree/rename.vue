<script setup>
  import IconButton from '@aziontech/ui/icon-button'
  import Tree from '@aziontech/ui/tree'
  import { ref } from 'vue'

  const items = ref([
    {
      id: 'src',
      label: 'src',
      icon: 'az az-folder',
      children: [
        { id: 'src/index.js', label: 'index.js', icon: 'az az-file', description: '1.1 KB' },
        { id: 'src/router.js', label: 'router.js', icon: 'az az-file', description: '2.6 KB' }
      ]
    },
    { id: 'package.json', label: 'package.json', icon: 'az az-file', description: '812 B' },
    { id: 'README.md', label: 'README.md', icon: 'az az-file', description: '3.4 KB' }
  ])
  const expanded = ref(['src'])
  const opened = ref('')
  const treeEl = ref(null)

  function relabel(nodes, id, label) {
    return nodes.map((node) => {
      if (node.id === id) return { ...node, label }
      if (node.children) return { ...node, children: relabel(node.children, id, label) }
      return node
    })
  }

  function onRename(event, { item, label }) {
    items.value = relabel(items.value, item.id, label)
  }

  function onOpen(event, item) {
    opened.value = item.label
  }
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
    <Tree
      ref="treeEl"
      v-model:open-keys="expanded"
      :items="items"
      editable
      aria-label="Project files"
      @rename="onRename"
      @item-double-click="onOpen"
    >
      <template #actions="{ item }">
        <IconButton
          icon="az az-pencil"
          variant="ghost"
          size="small"
          :aria-label="`Rename ${item.label}`"
          @click="treeEl?.startRename(item.id)"
        />
      </template>
    </Tree>
    <p class="text-body-sm text-(--text-muted)">
      Press F2 or the pencil to rename; double-click a file to open it. Opened:
      {{ opened || 'none' }}
    </p>
  </div>
</template>
