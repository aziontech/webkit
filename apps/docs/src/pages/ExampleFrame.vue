<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { type Component, computed, onBeforeUnmount, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { cached, keys } from '../lib/data'
  import { applyTheme, settings } from '../lib/settings'

  const route = useRoute()

  const dir = computed(() => String(route.params.dir ?? ''))
  const file = computed(() => `${String(route.params.example ?? '')}.vue`)
  const live = computed(() => cached<Component>(keys.example(dir.value, file.value)))

  useHead({ title: computed(() => `${dir.value}: ${route.params.example} — WebKit`) })

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
    :data-example="`${dir}/${file}`"
    class="min-h-screen w-full bg-(--bg-canvas) p-(--spacing-lg)"
  >
    <component
      :is="live"
      v-if="live"
    />
  </div>
</template>
