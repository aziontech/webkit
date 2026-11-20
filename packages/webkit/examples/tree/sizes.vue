<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'az az-folder',
      children: [
        { id: 'assets/hero.webp', label: 'hero.webp', icon: 'az az-image', description: '248 KB' },
        { id: 'assets/logo.svg', label: 'logo.svg', icon: 'az az-image', description: '12 KB' }
      ]
    },
    { id: 'index.html', label: 'index.html', icon: 'az az-file', description: '4 KB' }
  ]

  const sizes = ['small', 'medium', 'large']
  const expanded = ref({ small: ['assets'], medium: ['assets'], large: ['assets'] })
  const selected = ref({
    small: 'assets/logo.svg',
    medium: 'assets/logo.svg',
    large: 'assets/logo.svg'
  })
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-lg)">
    <div
      v-for="size in sizes"
      :key="size"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <p class="text-label-sm text-(--text-muted)">{{ size }}</p>
      <Tree
        v-model:open-keys="expanded[size]"
        v-model:selected-key="selected[size]"
        :items="items"
        :size="size"
        selectable
        :aria-label="`Bucket objects, ${size}`"
      />
    </div>
  </div>
</template>
