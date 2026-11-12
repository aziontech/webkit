<script setup>
  import Slider from '@aziontech/webkit/slider'
  import { ref } from 'vue'

  const value = ref(40)
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <Slider
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      :reference-values="[0, 25, 50, 75, 100]"
      unit="%"
      aria-label="Alert threshold"
    />
  </div>
</template>
