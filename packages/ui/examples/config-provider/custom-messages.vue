<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import PaginationRoot from '@aziontech/ui/pagination-root'

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
