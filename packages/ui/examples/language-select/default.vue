<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Field from '@aziontech/ui/field'
  import LanguageSelect from '@aziontech/ui/language-select'
  import { es } from '@aziontech/ui/locales/es'
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import Pagination from '@aziontech/ui/pagination-root'
  import { ref } from 'vue'

  const locale = ref('en')
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
