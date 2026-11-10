<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const small = ref('')
  const medium = ref('')
  const large = ref('')
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldText
      v-model="small"
      size="small"
      label="Email (small)"
      placeholder="you@example.com"
      helper-text="Small size — 28px input height."
    />
    <FieldText
      v-model="medium"
      size="medium"
      label="Email (medium)"
      placeholder="you@example.com"
      helper-text="Medium size — 32px input height."
    />
    <FieldText
      v-model="large"
      size="large"
      label="Email (large)"
      placeholder="you@example.com"
      helper-text="Large size — 40px input height."
    />
  </div>
</template>
