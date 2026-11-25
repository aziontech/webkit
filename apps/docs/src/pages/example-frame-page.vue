<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { type Component, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { cached, keys, preloadExample } from '../lib/route-data'
  import { applyTheme, settings } from '../lib/settings'

  const route = useRoute()
  const SSR = import.meta.env.SSR
  const mounted = ref(false)

  const segments = computed(() => {
    const value = route.params.path
    return (Array.isArray(value) ? value : String(value ?? '').split('/')).filter(Boolean)
  })
  const dir = computed(() =>
    segments.value.length > 1 ? segments.value.slice(0, -1).join('/') : ''
  )
  const example = computed(() => (segments.value.length > 1 ? (segments.value.at(-1) ?? '') : ''))
  const file = computed(() => `${example.value}.vue`)
  const live = computed(() => cached<Component>(keys.example(dir.value, file.value)))
  const styles = computed(() => cached<Component>(keys.frameStyles(`examples/${dir.value}`)))

  useHead({
    title: computed(() => (dir.value ? `${dir.value}: ${example.value} — WebKit` : 'WebKit'))
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

  watch(
    () => [dir.value, example.value],
    async () => {
      if (dir.value && example.value) await preloadExample(dir.value, example.value)
    }
  )

  onMounted(async () => {
    window.addEventListener('message', onMessage)
    if (dir.value && example.value) await preloadExample(dir.value, example.value)
    mounted.value = true
  })
  onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <div
    :data-example="mounted && dir ? `${dir}/${file}` : undefined"
    :data-ready="mounted && live ? '' : undefined"
    data-allow-mismatch="children"
    class="min-h-screen w-full bg-(--bg-canvas) p-(--spacing-lg) [--layout-sticky-top:0]"
  >
    <component
      :is="styles"
      v-if="styles"
    />
    <component
      :is="live"
      v-if="live && (SSR || mounted)"
    />
  </div>
</template>
