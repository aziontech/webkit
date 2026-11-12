<script setup>
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const messages = {
    pagination: { info: '{start}–{end} de {total} domínios' }
  }
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
    :messages="messages"
  >
    <PaginationRoot :total="48" />
  </WebkitProvider>
</template>
