<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{ text: string }>()

  const parts = computed(() =>
    props.text.split('`').map((value, at) => ({ value, code: at % 2 === 1 }))
  )
</script>

<template>
  <template
    v-for="(part, at) in parts"
    :key="at"
  >
    <code
      v-if="part.code"
      class="text-label-code-sm"
      >{{ part.value }}</code
    >
    <template v-else>{{ part.value }}</template>
  </template>
</template>
