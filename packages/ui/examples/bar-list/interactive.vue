<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import { ref } from 'vue'

  const items = [
    { name: '/home', value: 843 },
    { name: '/documentation', value: 384 },
    { name: '/blocks', value: 108 },
    { name: '/imprint', value: 46 },
    { name: '/cancellation', value: 3 }
  ]

  const linkedItems = items.map((item) => ({
    ...item,
    href: `#/analytics?path=${item.name}`
  }))

  const selected = ref('none')

  const onItemClick = (event, item) => {
    selected.value = item.name
  }
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-(--spacing-xl) md:grid-cols-2">
    <BarList
      aria-label="Top paths, linked"
      :items="linkedItems"
    />
    <div class="flex flex-col gap-(--spacing-sm)">
      <BarList
        aria-label="Top paths"
        :items="items"
        clickable
        @item-click="onItemClick"
      />
      <p class="text-body-sm text-(--text-muted)">Selected: {{ selected }}</p>
    </div>
  </div>
</template>
