<script setup lang="ts">
  // CANARY — must keep failing vue/require-explicit-emits.
  // `close` is emitted but never declared in defineEmits.
  const emit = defineEmits<{ click: [MouseEvent] }>()

  function close() {
    emit('close')
  }

  defineExpose({ close })
</script>

<template>
  <button
    type="button"
    @click="emit('click', $event)"
  >
    ×
  </button>
</template>
