<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const listings = {
    logs: [
      {
        id: 'logs/2026-11-01.log',
        label: '2026-11-01.log',
        icon: 'az az-file',
        description: '2.4 MB'
      },
      {
        id: 'logs/2026-11-02.log',
        label: '2026-11-02.log',
        icon: 'az az-file',
        description: '2.1 MB'
      }
    ],
    backups: [
      {
        id: 'backups/acme-store.sql',
        label: 'acme-store.sql',
        icon: 'az az-file',
        description: '48 MB'
      }
    ],
    media: [
      { id: 'media/videos', label: 'videos', icon: 'az az-folder', lazy: true },
      { id: 'media/banner.webp', label: 'banner.webp', icon: 'az az-image', description: '320 KB' }
    ],
    'media/videos': [
      {
        id: 'media/videos/intro.mp4',
        label: 'intro.mp4',
        icon: 'az az-video',
        description: '18 MB'
      }
    ]
  }

  const items = ref([
    { id: 'logs', label: 'logs', icon: 'az az-folder', lazy: true, loading: true },
    { id: 'backups', label: 'backups', icon: 'az az-folder', lazy: true },
    { id: 'media', label: 'media', icon: 'az az-folder', lazy: true },
    { id: 'index.html', label: 'index.html', icon: 'az az-file', description: '4 KB' }
  ])
  const expanded = ref(['logs'])
  const timers = []

  function patch(nodes, id, change) {
    return nodes.map((node) => {
      if (node.id === id) return { ...node, ...change }
      if (node.children) return { ...node, children: patch(node.children, id, change) }
      return node
    })
  }

  function find(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = node.children ? find(node.children, id) : undefined
      if (found) return found
    }
    return undefined
  }

  function load(id) {
    items.value = patch(items.value, id, { loading: true })
    timers.push(
      setTimeout(() => {
        items.value = patch(items.value, id, { loading: false, children: listings[id] ?? [] })
      }, 1200)
    )
  }

  function onExpanded(next) {
    const opened = next.filter((id) => !expanded.value.includes(id))
    expanded.value = next
    for (const id of opened) {
      const node = find(items.value, id)
      if (node?.lazy && !node.children && !node.loading) load(id)
    }
  }

  onMounted(() => load('logs'))
  onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Tree
      :open-keys="expanded"
      :items="items"
      aria-label="Bucket objects"
      @update:open-keys="onExpanded"
    />
  </div>
</template>
