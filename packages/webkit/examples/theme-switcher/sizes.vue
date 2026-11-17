<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const theme = ref('system')
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <div
      v-for="size in ['small', 'medium', 'large']"
      :key="size"
      class="flex items-center gap-(--spacing-xs)"
    >
      <ThemeSwitcher
        v-model="theme"
        :size="size"
      />
      <IconButton
        icon="ai ai-github"
        variant="outline"
        :size="size"
        aria-label="GitHub"
      />
    </div>
  </div>
</template>
