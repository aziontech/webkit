<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref, watch } from 'vue'

  import { messages } from '../lib/i18n'
  import { resolvedTheme, settings } from '../lib/settings'

  const props = defineProps<{ src: string; title: string }>()

  const t = messages
  const viewport = ref('full')
  const frame = ref<HTMLIFrameElement | null>(null)

  const VIEWPORTS = [
    { value: '375', label: 'Mobile 375' },
    { value: '768', label: 'Tablet 768' },
    { value: '1280', label: 'Desktop 1280' },
    { value: 'full', label: 'Full' }
  ]

  const width = computed(() => (viewport.value === 'full' ? '100%' : `${viewport.value}px`))

  const query = computed(
    () =>
      `?theme=${resolvedTheme(settings.theme)}&dir=${settings.dir}&lang=${encodeURIComponent(settings.locale)}`
  )

  const initialSrc = ref(props.src)

  function post() {
    frame.value?.contentWindow?.postMessage(
      {
        source: 'webkit-docs',
        theme: resolvedTheme(settings.theme),
        dir: settings.dir,
        locale: settings.locale
      },
      location.origin
    )
  }

  watch(() => ({ ...settings }), post)
  watch(
    () => props.src,
    (src) => {
      initialSrc.value = src + query.value
    }
  )
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
      <ToggleGroup
        v-model="viewport"
        :options="VIEWPORTS"
        :aria-label="t.viewport"
        size="small"
      />
      <IconButton
        icon="pi pi-external-link"
        kind="outlined"
        size="small"
        :aria-label="t.openInNewTab"
        :href="src"
        target="_blank"
      />
    </div>
    <div
      class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas)"
    >
      <div
        class="docs-frame mx-auto"
        :style="{ width }"
      >
        <iframe
          ref="frame"
          :src="initialSrc"
          :title="title"
          loading="lazy"
          class="block h-[42rem] w-full border-0"
          @load="post"
        />
      </div>
    </div>
  </div>
</template>
