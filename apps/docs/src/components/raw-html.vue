<script setup lang="ts">
  import { h } from 'vue'

  const props = withDefaults(defineProps<{ html: string; tag?: string }>(), { tag: 'div' })

  const RawElement = () => h(props.tag, { class: 'docs-html', innerHTML: props.html })
</script>

<template>
  <RawElement />
</template>
