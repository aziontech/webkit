<script setup lang="ts">
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import { getCurrentInstance, onMounted, useSSRContext } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DocsShell from './layouts/DocsShell.vue'
  import { persistSettings, restoreSettings, settings } from './lib/settings'

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
  <WebkitProvider
    :locale="settings.locale"
    :dir="settings.dir"
    class="min-h-screen bg-(--bg-canvas) text-(--text-default)"
  >
    <RouterView v-if="route.meta.bare" />
    <DocsShell v-else>
      <RouterView />
    </DocsShell>
  </WebkitProvider>
</template>
