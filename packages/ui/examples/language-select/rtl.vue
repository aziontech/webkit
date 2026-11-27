<script setup>
  import LanguageSelect from '@aziontech/ui/language-select'
  import { ref } from 'vue'

  const locale = ref('ar-SA')
  const options = [
    { value: 'ar-SA', label: 'العربية (السعودية)' },
    { value: 'he-IL', label: 'עברית (ישראל)' },
    { value: 'en', label: 'English' }
  ]
</script>

<template>
  <div
    dir="rtl"
    class="flex flex-col items-start gap-(--spacing-md)"
  >
    <LanguageSelect
      v-model="locale"
      variant="ghost"
      :options="options"
      aria-label="اللغة"
    />
    <LanguageSelect
      v-model="locale"
      :options="options"
      aria-label="اللغة"
      class="max-w-(--container-xs)"
    />
  </div>
</template>
