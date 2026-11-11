<script setup lang="ts">
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import Pagination from '@aziontech/webkit/pagination'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import tokens from 'virtual:docs-tokens'
  import { ref } from 'vue'

  import { LOCALES } from '../lib/i18n'
  import TokenList from './TokenList.vue'

  defineProps<{ kind: 'locale' | 'direction' | 'devices' }>()

  const catalogs = { 'pt-BR': ptBR, es }
  const locale = ref('pt-BR')
  const dir = ref<'ltr' | 'rtl'>('rtl')
  const page = ref(3)
  const pageSize = ref(10)
</script>

<template>
  <section
    v-if="kind === 'locale' || kind === 'direction'"
    class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
  >
    <ToggleGroup
      key="toggle-group-1"
      v-if="kind === 'locale'"
      v-model="locale"
      :options="LOCALES"
      aria-label="Demo language"
      size="small"
    />
    <ToggleGroup
      key="toggle-group-2"
      v-else
      v-model="dir"
      :options="[
        { label: 'ltr', value: 'ltr' },
        { label: 'rtl', value: 'rtl' }
      ]"
      aria-label="Demo direction"
      size="small"
    />
    <WebkitProvider
      :locale="kind === 'locale' ? locale : 'en'"
      :catalogs="catalogs"
      :dir="kind === 'direction' ? dir : 'auto'"
      class="overflow-x-auto"
    >
      <Pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="200"
        :page-size-options="[10, 25, 50]"
        :sibling-count="1"
      />
    </WebkitProvider>
  </section>
  <section
    v-else
    class="flex flex-col gap-(--spacing-md)"
  >
    <h2 class="text-heading-sm">Breakpoints</h2>
    <TokenList
      :tokens="tokens.breakpoints"
      sample="none"
    />
    <h2 class="text-heading-sm">Containers and layout measures</h2>
    <TokenList
      :tokens="tokens.containers"
      sample="none"
    />
  </section>
</template>
