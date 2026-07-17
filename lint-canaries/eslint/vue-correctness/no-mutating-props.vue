<script setup lang="ts">
  // CANARY — must keep failing vue/no-mutating-props (shallowOnly: false).
  // Direct prop assignment AND deep mutation of a prop array.
  const props = defineProps({
    modelValue: { type: String, default: '' },
    items: { type: Array, default: () => [] }
  })

  function clear() {
    props.modelValue = ''
  }

  function add(item: string) {
    props.items.push(item)
  }

  defineExpose({ add, clear })
</script>

<template>
  <span>{{ props.items.length }}</span>
</template>
