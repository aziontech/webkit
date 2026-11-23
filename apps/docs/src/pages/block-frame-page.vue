<script setup lang="ts">
  import { Toaster } from '@aziontech/webkit/toast'
  import { useHead } from '@unhead/vue'
  import { type Component, computed, h, onBeforeUnmount, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { cached, findBlock, keys } from '../lib/data'
  import { applyTheme, settings } from '../lib/settings'

  const route = useRoute()

  const id = computed(() => {
    const value = route.params.id
    return (Array.isArray(value) ? value.join('/') : String(value ?? '')).replace(/\/+$/, '')
  })
  const block = computed(() => findBlock(id.value))
  const state = computed(() =>
    block.value?.states.find((entry) => entry.slug === String(route.params.state))
  )
  const live = computed(() => {
    if (!block.value || !state.value) return undefined
    const page = cached<Component>(keys.block(block.value.dir, state.value.file))
    const shellFile = block.value.shell
    if (!page || !shellFile || shellFile === state.value.file) return page
    const shell = cached<Component>(keys.block(block.value.dir, shellFile))
    return shell ? () => h(shell, null, { default: () => h(page) }) : page
  })

  useHead({
    title: computed(() =>
      block.value && state.value ? `${block.value.title}: ${state.value.name} — WebKit` : 'WebKit'
    )
  })

  function onMessage(event: MessageEvent) {
    if (event.origin !== location.origin || event.data?.source !== 'webkit-docs') return
    if (event.data.theme === 'dark' || event.data.theme === 'light')
      settings.theme = event.data.theme
    if (event.data.dir === 'ltr' || event.data.dir === 'rtl') settings.dir = event.data.dir
    if (typeof event.data.locale === 'string') settings.locale = event.data.locale
  }

  watch(
    () => settings.theme,
    (theme) => applyTheme(theme)
  )

  onMounted(() => window.addEventListener('message', onMessage))

  onBeforeUnmount(() => window.removeEventListener('message', onMessage))

  const FRAME_CLASS =
    'min-h-screen w-full bg-(--bg-canvas) not-data-[layout=fullscreen]:p-(--spacing-lg) ' +
    'has-[>[data-layout-fill]]:flex has-[>[data-layout-fill]]:h-dvh has-[>[data-layout-fill]]:min-h-0 has-[>[data-layout-fill]]:flex-col ' +
    'has-[>[data-layout-fill]]:overflow-hidden [&>[data-layout-fill]]:min-h-0 [&>[data-layout-fill]]:flex-1'
</script>

<template>
  <div
    :data-source="block && state ? `blocks/${block.dir}/${state.file}` : undefined"
    :data-layout="block?.layout"
    :class="FRAME_CLASS"
  >
    <Toaster />
    <component
      :is="live"
      v-if="live"
    />
  </div>
</template>
