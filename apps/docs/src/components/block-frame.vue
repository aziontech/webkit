<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { messages } from '../lib/i18n'
  import { resolvedTheme, settings } from '../lib/settings'

  const props = defineProps<{ src: string; title: string }>()

  const t = messages
  const viewport = ref('full')
  const frameEl = ref<HTMLIFrameElement | null>(null)
  const boxEl = ref<HTMLElement | null>(null)
  const boxWidth = ref(0)
  let observer: ResizeObserver | null = null

  const VIEWPORTS = computed(() => [
    { value: '375', label: `${t.value.viewportMobile} 375` },
    { value: '768', label: `${t.value.viewportTablet} 768` },
    { value: '1280', label: `${t.value.viewportDesktop} 1280` },
    { value: 'full', label: t.value.viewportFull }
  ])

  const preset = computed(() => (viewport.value === 'full' ? 0 : Number(viewport.value)))
  const scale = computed(() =>
    preset.value && boxWidth.value && preset.value > boxWidth.value
      ? boxWidth.value / preset.value
      : 1
  )
  const sizerStyle = computed(() =>
    scale.value < 1 ? { height: `calc(42rem * ${scale.value})` } : undefined
  )
  const frameStyle = computed(() => {
    if (!preset.value) return { width: '100%' }
    if (scale.value === 1) return { width: `${preset.value}px` }
    return {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: `${preset.value}px`,
      maxWidth: 'none',
      resize: 'none' as const,
      transform: `scale(${scale.value})`,
      transformOrigin: 'top left'
    }
  })

  onMounted(() => {
    const box = boxEl.value
    if (!box || typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver((entries) => {
      boxWidth.value = entries[0]?.contentRect.width ?? 0
    })
    observer.observe(box)
  })

  onBeforeUnmount(() => observer?.disconnect())

  const query = computed(
    () =>
      `?theme=${resolvedTheme(settings.theme)}&dir=${settings.dir}&lang=${encodeURIComponent(settings.locale)}`
  )

  const initialSrc = ref(props.src)

  function post() {
    frameEl.value?.contentWindow?.postMessage(
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
        icon="az az-external-link"
        variant="outline"
        size="small"
        :aria-label="t.openInNewTab"
        :href="src"
        target="_blank"
      />
    </div>
    <div
      ref="boxEl"
      class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas)"
    >
      <div
        class="relative"
        :style="sizerStyle"
      >
        <div
          class="docs-frame mx-auto"
          :style="frameStyle"
        >
          <iframe
            ref="frameEl"
            :src="initialSrc"
            :title="title"
            loading="lazy"
            class="block h-[42rem] w-full border-0"
            @load="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>
