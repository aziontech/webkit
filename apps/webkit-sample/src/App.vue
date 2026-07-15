<script setup>
  import { RouterView } from 'vue-router'

  // Single toast region for the whole app — the store is a singleton, so any
  // toast.error()/toast.success() call from any screen surfaces here.
  import Toaster from '@aziontech/webkit/toast'
</script>

<template>
  <RouterView />
  <Toaster position="bottom-right" />
</template>
