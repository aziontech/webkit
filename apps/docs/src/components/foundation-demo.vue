<script setup lang="ts">
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import tokens from 'virtual:docs-tokens'
  import { ref } from 'vue'

  import AuthSignIn from '../../../../packages/webkit/blocks/auth/auth-sign-in/auth-sign-in.vue'
  import { messages as t } from '../lib/i18n'
  import TokenTable from './tokens/token-table.vue'

  defineProps<{ kind: 'locale' | 'direction' | 'devices' }>()

  const catalogs = { 'pt-BR': ptBR, es }
  const locale = ref('pt-BR')
  const dir = ref<'ltr' | 'rtl'>('rtl')
</script>

<template>
  <section
    v-if="kind === 'locale' || kind === 'direction'"
    class="flex flex-col gap-(--spacing-sm)"
  >
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <div
        v-if="kind === 'locale'"
        class="w-full sm:w-64"
      >
        <LanguageSelect
          v-model="locale"
          :aria-label="t.demoLanguage"
          size="small"
        />
      </div>
      <ToggleGroup
        v-else
        v-model="dir"
        :options="[
          { label: 'ltr', value: 'ltr' },
          { label: 'rtl', value: 'rtl' }
        ]"
        :aria-label="t.demoDirection"
        size="small"
      />
      <span class="text-body-sm text-(--text-muted)">
        {{ kind === 'locale' ? t.demoLocaleNote : t.demoDirectionNote }}
      </span>
    </div>
    <ConfigProvider
      :locale="kind === 'locale' ? locale : 'en'"
      :catalogs="catalogs"
      :dir="kind === 'direction' ? dir : 'auto'"
      data-example="auth/auth-sign-in"
      class="h-144 overflow-hidden rounded-(--shape-card) border border-(--border-default) *:h-full!"
    >
      <AuthSignIn />
    </ConfigProvider>
  </section>
  <section
    v-else
    class="flex flex-col gap-(--spacing-md)"
  >
    <h2 class="text-heading-sm">Breakpoints</h2>
    <TokenTable
      :tokens="tokens.breakpoints"
      kind="breakpoint"
      sample="none"
      caption="Breakpoints"
    />
    <h2 class="text-heading-sm">Containers and layout measures</h2>
    <TokenTable
      :tokens="tokens.containers"
      kind="container"
      sample="none"
      caption="Containers and layout measures"
    />
  </section>
</template>
