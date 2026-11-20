<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Textarea
      v-model="value"
      placeholder="resize=vertical (default)"
      resize="vertical"
    />
    <Textarea
      v-model="value"
      placeholder="resize=horizontal"
      resize="horizontal"
    />
    <Textarea
      v-model="value"
      placeholder="resize=both"
      resize="both"
    />
    <Textarea
      v-model="value"
      placeholder="resize=none"
      resize="none"
    />
  </div>
</template>
