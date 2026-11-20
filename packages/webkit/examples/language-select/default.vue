<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Field from '@aziontech/webkit/field'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import Pagination from '@aziontech/webkit/pagination-root'
  import { ref } from 'vue'

  const locale = ref('en-US')
  const page = ref(1)
  const catalogs = { 'pt-BR': ptBR, es }
</script>

<template>
  <ConfigProvider
    :locale="locale"
    :catalogs="catalogs"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <Field class="max-w-(--container-xs)">
        <Field.Label>Language</Field.Label>
        <LanguageSelect v-model="locale" />
      </Field>
      <Pagination
        v-model:page="page"
        :total="120"
        :page-size="10"
      />
    </div>
  </ConfigProvider>
</template>
