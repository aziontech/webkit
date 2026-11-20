<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import PaginationRoot from '@aziontech/webkit/pagination-root'

  const messages = {
    pagination: { info: '{start}–{end} de {total} domínios' }
  }
</script>

<template>
  <ConfigProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
    :messages="messages"
  >
    <PaginationRoot :total="48" />
  </ConfigProvider>
</template>
