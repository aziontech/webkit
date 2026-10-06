<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import { computed } from 'vue'

  interface Props {
    value?: string | number
    resource?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    resource: ''
  })

  const text = computed(() => (props.value === null ? '' : String(props.value)))

  const ariaLabel = computed(() => (props.resource ? `Copy ${props.resource} ID` : 'Copy ID'))
</script>

<template>
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 flex-1 truncate tabular-nums">{{ text }}</span>
    <CopyButton
      v-if="text"
      kind="outlined"
      :value="text"
      :aria-label="ariaLabel"
    />
  </div>
</template>
