<script setup lang="ts">
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import { useHead } from '@unhead/vue'
  import {
    computed,
    defineAsyncComponent,
    getCurrentInstance,
    onMounted,
    useSSRContext,
    watch
  } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { loadDocsShell } from './lib/docs-shell-loader'
  import { persistSettings, restoreSettings, settings } from './lib/settings'
  import { loadWebkitCatalog, webkitCatalogs as catalogs } from './lib/webkit-catalogs'

  const DocsShell = defineAsyncComponent(loadDocsShell)

  watch(
    () => settings.locale,
    (locale) => void loadWebkitCatalog(locale),
    { immediate: true }
  )
  useHead({ htmlAttrs: { lang: computed(() => settings.locale) } })
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

  let restored = false

  function restore() {
    if (restored) return
    restored = true
    const isFrame = route.meta.bare === true
    restoreSettings(isFrame ? new URLSearchParams(location.search) : null)
    if (!isFrame) persistSettings()
  }

  onMounted(() => {
    if (route.meta.bare === true) restore()
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
    <DocsShell
      v-else
      @hydrated="restore"
    >
      <RouterView />
    </DocsShell>
  </ConfigProvider>
</template>
