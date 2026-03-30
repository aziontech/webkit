<script setup>
/**
 * TokenPreview - Small preview box for a single token
 * Used for quick examples in Background/Text/Border sections
 */
import { computed } from 'vue'

const props = defineProps({
  token: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'background',
    validator: (v) => ['background', 'text', 'border'].includes(v)
  }
})

const cssVar = computed(() => `var(--${props.token})`)

const style = computed(() => {
  if (props.type === 'background') {
    return { background: cssVar.value }
  }
  if (props.type === 'text') {
    return { color: cssVar.value }
  }
  if (props.type === 'border') {
    return { borderColor: cssVar.value, borderWidth: '1px', borderStyle: 'solid' }
  }
  return {}
})
</script>

<template>
  <div
    class="px-5 py-4 rounded-lg border border-default"
    :class="{ 'bg-surface': type !== 'background' }"
    :style="type === 'background' ? style : {}"
  >
    <p
      class="text-overline-xs m-0 mb-1"
      :class="type === 'background' ? 'text-white/70' : 'text-muted'"
    >
      {{ label || token }}
    </p>
    <p
      class="text-body-xs m-0"
      :class="type === 'background' ? 'text-white' : 'text-default'"
    >
      {{ description }}
    </p>
  </div>
</template>
