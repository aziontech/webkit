<script setup>
  import ThemeSwitcher from '@aziontech/ui/theme-switcher'
  import { ref } from 'vue'

  const theme = ref('system')
</script>

<template>
  <ThemeSwitcher v-model="theme" />
</template>
