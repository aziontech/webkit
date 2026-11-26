<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('en')
  const options = [
    { value: 'en', label: 'English' },
    { value: 'en-CA', label: 'English (Canada)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'es', label: 'Español' },
    { value: 'es-AR', label: 'Español (Argentina)' },
    { value: 'es-MX', label: 'Español (México)' },
    { value: 'fr-FR' },
    { value: 'fr-BE', label: 'Français (Belgique)' },
    { value: 'fr-CA', label: 'Français (Canada)' },
    { value: 'de-DE', label: 'Deutsch (Deutschland)' },
    { value: 'it-IT' },
    { value: 'ja-JP' },
    { value: 'nl-BE', label: 'Nederlands (België)' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'pt-PT', label: 'Português (Portugal)' },
    { value: 'ar', label: 'العربية', country: 'SA' }
  ]
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-md)">
    <LanguageSelect
      v-model="locale"
      variant="ghost"
      :options="options"
    />
    <LanguageSelect
      v-model="locale"
      :options="options"
      class="max-w-(--container-xs)"
    />
  </div>
</template>
