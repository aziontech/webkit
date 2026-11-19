<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('en-GB')
  const options = [
    { value: 'en-US', label: 'English (United States)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'fr-FR', label: 'Français (France)' },
    { value: 'fr-CA', label: 'Français (Canada)' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'ar', label: 'العربية', country: 'SA' }
  ]
</script>

<template>
  <LanguageSelect
    v-model="locale"
    :options="options"
    class="max-w-(--container-xs)"
  />
</template>
