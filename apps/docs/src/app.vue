<script setup lang="ts">
  import ConfigProvider, { type ConfigProviderProps } from '@aziontech/webkit/config-provider'
  import { getCurrentInstance, onMounted, shallowRef, useSSRContext, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DocsShell from './components/docs-shell.vue'
  import { persistSettings, restoreSettings, settings } from './lib/settings'

  type Catalog = NonNullable<ConfigProviderProps['catalogs']>[string]

  const LOADERS: Record<string, () => Promise<Catalog>> = {
    'pt-BR': () => import('@aziontech/webkit/locales/pt-BR').then((module) => module.ptBR),
    es: () => import('@aziontech/webkit/locales/es').then((module) => module.es)
  }
  const catalogs = shallowRef<Record<string, Catalog>>({})

  watch(
    () => settings.locale,
    async (locale) => {
      const load = LOADERS[locale]
      if (!load || catalogs.value[locale]) return
      catalogs.value = { ...catalogs.value, [locale]: await load() }
    },
    { immediate: true }
  )
  const route = useRoute()

  if (import.meta.env.SSR) {
    const app = getCurrentInstance()?.appContext.app as { ssrContext?: unknown } | undefined
    if (app) app.ssrContext = useSSRContext()
  }
  const router = useRouter()

  function onClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = (event.target as HTMLElement | null)?.closest('a')
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
    const href = anchor.getAttribute('href')
    if (!href || !href.startsWith('/') || href.startsWith('//')) return
    if (/^\/(llms|docs|media|logos)\//.test(href) || href.endsWith('.md')) return
    event.preventDefault()
    router.push(href)
  }

  onMounted(() => {
    const isFrame = route.meta.bare === true
    restoreSettings(isFrame ? new URLSearchParams(location.search) : null)
    if (!isFrame) persistSettings()
    document.addEventListener('click', onClick)
  })
</script>

<template>
  <ConfigProvider
    :locale="settings.locale"
    :catalogs="catalogs"
    :dir="settings.dir"
    class="min-h-screen bg-(--bg-canvas) text-(--text-default)"
  >
    <RouterView v-if="route.meta.bare" />
    <DocsShell v-else>
      <RouterView />
    </DocsShell>
  </ConfigProvider>
</template>
