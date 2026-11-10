<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const small = ref('')
  const medium = ref('')
  const large = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <Input
      v-model="small"
      size="small"
      placeholder="Small (28px)"
    />
    <Input
      v-model="medium"
      size="medium"
      placeholder="Medium (32px)"
    />
    <Input
      v-model="large"
      size="large"
      placeholder="Large (40px)"
    />
  </div>
</template>
