<script setup>
  import InputText from '@aziontech/webkit/input-text'
  import { ref } from 'vue'

  const small = ref('')
  const medium = ref('')
  const large = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <InputText
      v-model="small"
      size="small"
      placeholder="Small (28px)"
    />
    <InputText
      v-model="medium"
      size="medium"
      placeholder="Medium (32px)"
    />
    <InputText
      v-model="large"
      size="large"
      placeholder="Large (40px)"
    />
  </div>
</template>
