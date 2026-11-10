<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Textarea
      v-model="value"
      placeholder="resizable=vertical (default)"
      resizable="vertical"
    />
    <Textarea
      v-model="value"
      placeholder="resizable=horizontal"
      resizable="horizontal"
    />
    <Textarea
      v-model="value"
      placeholder="resizable=both"
      resizable="both"
    />
    <Textarea
      v-model="value"
      placeholder="resizable=none"
      resizable="none"
    />
  </div>
</template>
