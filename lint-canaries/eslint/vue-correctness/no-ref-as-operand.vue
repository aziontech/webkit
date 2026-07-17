<script setup lang="ts">
  // CANARY — must keep failing vue/no-ref-as-operand.
  // `count` and `loading` are used as operands without `.value`.
  import { ref } from 'vue'

  const count = ref(0)
  const loading = ref(false)

  const next = count + 1
  if (loading) {
    console.warn('always truthy — the ref object itself', next)
  }
</script>

<template>
  <span>{{ count }}</span>
</template>
