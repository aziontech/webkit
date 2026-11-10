<script setup>
  import { ref } from 'vue'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'

  const theme = ref('system')
</script>

<template>
  <ThemeSwitcher
    v-model="theme"
    disabled
  />
</template>
