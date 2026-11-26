<script setup>
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { ref } from 'vue'

  const locale = ref('es')
</script>

<template>
  <LanguageSelect
    v-model="locale"
    disabled
    class="max-w-(--container-xs)"
  />
</template>
