<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { type Component, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { cached, keys, preloadExample } from '../lib/data'
  import { applyTheme, settings } from '../lib/settings'

  const route = useRoute()
  const mounted = ref(false)

  const path = computed(() => String(route.query.path ?? '').split('/'))
  const dir = computed(() => (path.value.length === 2 ? path.value[0] : ''))
  const example = computed(() => (path.value.length === 2 ? path.value[1] : ''))
  const file = computed(() => `${example.value}.vue`)
  const live = computed(() =>
    mounted.value ? cached<Component>(keys.example(dir.value, file.value)) : undefined
  )

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
    :data-ready="live ? '' : undefined"
    class="min-h-screen w-full bg-(--bg-canvas) p-(--spacing-lg)"
  >
    <component
      :is="live"
      v-if="live"
    />
  </div>
</template>
