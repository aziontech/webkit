<script setup lang="ts">
  import { Toaster } from '@aziontech/webkit/toast'
  import { useHead } from '@unhead/vue'
  import { type Component, computed, onBeforeUnmount, onMounted, watch } from 'vue'
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
  const live = computed(() =>
    block.value && state.value
      ? cached<Component>(keys.block(block.value.dir, state.value.file))
      : undefined
  )

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
</script>

<template>
  <div
    :data-source="block && state ? `blocks/${block.dir}/${state.file}` : undefined"
    :class="[
      'min-h-screen w-full bg-(--bg-canvas)',
      block?.layout === 'fullscreen' ? '' : 'p-(--spacing-lg)'
    ]"
  >
    <Toaster position="bottom-right" />
    <component
      :is="live"
      v-if="live"
    />
  </div>
</template>
