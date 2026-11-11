<script setup lang="ts">
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import { Toaster } from '@aziontech/webkit/toast'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  import DemoBar from './components/DemoBar.vue'
  import { settings } from './lib/settings'

  const catalogs = { 'pt-BR': ptBR }
</script>

<template>
  <WebkitProvider
    :locale="settings.locale"
    :catalogs="catalogs"
    :dir="settings.dir"
    class="min-h-dvh bg-(--bg-canvas) text-(--text-default)"
  >
    <RouterView />
    <DemoBar />
    <Toaster position="bottom-right" />
  </WebkitProvider>
</template>
