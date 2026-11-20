<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('en-US')
  const options = [
    { value: 'es-AR', label: 'Español (Argentina)' },
    { value: 'nl-BE', label: 'Nederlands (België)' },
    { value: 'fr-BE', label: 'Français (Belgique)' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-CA', label: 'English (Canada)' },
    { value: 'fr-CA', label: 'Français (Canada)' },
    { value: 'de-DE', label: 'Deutsch (Deutschland)' },
    { value: 'es-ES', label: 'Español (España)' },
    { value: 'fr-FR' },
    { value: 'it-IT' },
    { value: 'es-MX', label: 'Español (México)' },
    { value: 'ja-JP' },
    { value: 'pt-PT', label: 'Português (Portugal)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'en-US', label: 'English (United States)' },
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
