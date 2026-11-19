<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('pt-BR')
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-sm)">
    <LanguageSelect
      v-for="size in sizes"
      :key="size"
      v-model="locale"
      :size="size"
      :aria-label="`Language, ${size}`"
    />
  </div>
</template>
