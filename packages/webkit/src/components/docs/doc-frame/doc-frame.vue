<script setup lang="ts">
  import {
    defaultDocument,
    useEventListener,
    useMediaQuery,
    useMounted,
    useScrollLock
  } from '@vueuse/core'
  import type { VNode } from 'vue'
  import { cloneVNode, computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { usePortalLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import { flattenSlot } from './flatten-slot'

  defineOptions({ name: 'DocFrame', inheritAttrs: false })

  export interface DocFrameProps {
    /** Caption under the frame, centered; plain-text fallback for the caption slot. */
    caption?: string
    /** Lead-in above the frame, left aligned; plain-text fallback for the hint slot. */
    hint?: string
    /** Media source; omit to frame slot content instead. */
    src?: string
    /** Alternative text for the framed media. */
    alt?: string
    /** Plays the clip on its own, muted, inline and looping, with a pause control instead of the player controls; off under reduced motion. */
    autoplay?: boolean
  }

  const props = withDefaults(defineProps<DocFrameProps>(), {
    caption: '',
    hint: '',
    src: '',
    alt: '',
    autoplay: false
  })

  defineSlots<{
    /** Framed content when no `src` is given. */
    default(): unknown
    /** Rich caption content; the `caption` prop is its plain-text fallback. */
    caption(): unknown
    /** Rich lead-in content; the `hint` prop is its plain-text fallback. */
    hint(): unknown
  }>()

  const slots = useSlots()
  const attrs = useAttrs()
  const { t } = useTranslate({ docFrame: en.docFrame, common: en.common })

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-frame')

  const CLIP_EXTENSIONS = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i

  const isClip = computed(() => CLIP_EXTENSIONS.test(props.src))

  const AUTOPLAY_ATTRS = {
    playsinline: '',
    loop: '',
    muted: '',
    autoplay: null,
    autoPlay: null,
    controls: null,
    'data-autoplay': ''
  }

  const playsOnItsOwn = (nodeAttrs: Record<string, unknown> | null) => {
    if (!nodeAttrs) return false
    const value = nodeAttrs['autoplay'] ?? nodeAttrs['autoPlay']
    return value !== undefined && value !== null && value !== false
  }

  const isAutoplayClip = (node: VNode) => node?.type === 'video' && playsOnItsOwn(node.props)

  const slotNodes = computed(() => flattenSlot(slots['default']?.() ?? []))

  const framed = computed(() =>
    slotNodes.value.map((node) => (isAutoplayClip(node) ? cloneVNode(node, AUTOPLAY_ATTRS) : node))
  )

  const autoplays = computed(() =>
    props.src ? isClip.value && props.autoplay : slotNodes.value.some(isAutoplayClip)
  )

  const mounted = useMounted()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const surfaceEl = ref<HTMLElement | null>(null)
  const chosenPaused = ref<boolean | null>(null)
  const paused = computed(() => chosenPaused.value ?? reducedMotion.value)
  const playing = computed(() => mounted.value && autoplays.value && !paused.value)
  const clipName = computed(() => {
    if (props.src) return props.alt
    const clip = slotNodes.value.find(isAutoplayClip)
    const name = clip?.props?.['aria-label'] ?? clip?.props?.['title']
    return typeof name === 'string' ? name : ''
  })
  const pauseLabel = computed(() => {
    const alt = clipName.value
    if (paused.value) return alt ? t('docFrame.playNamed', { alt }) : t('common.playAnimation')
    return alt ? t('docFrame.pauseNamed', { alt }) : t('common.pauseAnimation')
  })

  const autoplayClipEls = () =>
    Array.from(surfaceEl.value?.querySelectorAll<HTMLVideoElement>('video[data-autoplay]') ?? [])

  watch(
    [playing, () => props.src],
    ([isPlaying]) => {
      for (const clip of autoplayClipEls()) {
        if (!isPlaying) {
          clip.pause()
          continue
        }
        clip.play()?.catch(() => {
          chosenPaused.value = true
        })
      }
    },
    { flush: 'post' }
  )

  const onPauseToggle = () => {
    chosenPaused.value = !paused.value
  }

  const zoomable = computed(() => Boolean(props.src) && !isClip.value)

  const zoomed = ref(false)
  const triggerEl = ref<HTMLButtonElement | null>(null)
  const overlayEl = ref<HTMLElement | null>(null)
  const zoomImageEl = ref<HTMLImageElement | null>(null)

  const flip = ref('')

  const armed = ref(false)

  const isScrollLocked = useScrollLock(defaultDocument?.body)

  const flipTransform = (from: DOMRect, to: DOMRect) => {
    if (!to.width || !to.height) return ''
    const scaleX = from.width / to.width
    const scaleY = from.height / to.height
    const shiftX = from.left + from.width / 2 - (to.left + to.width / 2)
    const shiftY = from.top + from.height / 2 - (to.top + to.height / 2)
    return `translate(${shiftX}px, ${shiftY}px) scale(${scaleX}, ${scaleY})`
  }

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const open = async () => {
    if (!zoomable.value) return
    const from = triggerEl.value?.getBoundingClientRect()
    zoomed.value = true
    armed.value = false
    flip.value = ''
    if (prefersReducedMotion()) return
    await nextTick()
    const image = zoomImageEl.value
    if (!from || !image) return
    flip.value = flipTransform(from, image.getBoundingClientRect())
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        armed.value = true
        flip.value = ''
      })
    })
  }

  const close = () => {
    const image = zoomImageEl.value
    const from = triggerEl.value?.getBoundingClientRect()
    if (!image || !from || prefersReducedMotion()) {
      zoomed.value = false
      return
    }
    flip.value = flipTransform(from, image.getBoundingClientRect())
  }

  const onZoomTransitionend = (event: TransitionEvent) => {
    if (event.target !== zoomImageEl.value || event.propertyName !== 'transform') return
    if (flip.value) zoomed.value = false
  }

  watch(zoomed, (isOpen) => {
    isScrollLocked.value = isOpen
  })

  useFocusTrap(overlayEl, zoomed)

  useEventListener(defaultDocument, 'keydown', (event: KeyboardEvent) => {
    if (!zoomed.value || event.key !== 'Escape') return
    event.preventDefault()
    close()
  })

  watch(zoomed, async (isOpen, wasOpen) => {
    if (isOpen || !wasOpen) return
    await nextTick()
    triggerEl.value?.focus()
  })

  const portalLocale = usePortalLocale()
</script>

<template>
  <figure
    v-bind="$attrs"
    data-doc-block
    :data-testid="testId"
    class="m-0 w-full"
  >
    <div
      v-if="$slots['hint'] || hint"
      :data-testid="`${testId}__hint`"
      class="pb-(--spacing-xs) text-body-xs text-(--text-muted)"
    >
      <slot name="hint">{{ hint }}</slot>
    </div>
    <div
      ref="surfaceEl"
      class="relative flex flex-col items-center justify-center overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm)"
    >
      <video
        v-if="isClip"
        :src="src"
        :aria-label="alt || undefined"
        :data-autoplay="autoplay || undefined"
        :playsinline="autoplay || undefined"
        :loop="autoplay || undefined"
        :muted="autoplay || undefined"
        :controls="!autoplay || undefined"
        class="block h-auto w-full rounded-(--shape-control)"
      ></video>
      <button
        v-else-if="zoomable"
        ref="triggerEl"
        type="button"
        :data-testid="`${testId}__zoom-trigger`"
        :aria-label="alt ? t('docFrame.zoomNamed', { alt }) : t('docFrame.zoom')"
        class="group relative block w-full cursor-zoom-in rounded-(--shape-control) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
        @click="open"
      >
        <img
          :src="src"
          :alt="alt"
          class="block h-auto w-full rounded-(--shape-control)"
        />
        <span
          aria-hidden="true"
          :data-testid="`${testId}__zoom-hint`"
          class="pointer-events-none absolute top-(--spacing-xs) end-(--spacing-xs) inline-flex items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          <i class="az az-zoom-in text-body-xs"></i>
          {{ t('docFrame.fullScreen') }}
        </span>
      </button>
      <img
        v-else-if="src"
        :src="src"
        :alt="alt"
        class="block h-auto w-full rounded-(--shape-control)"
      />
      <template v-else>
        <component
          :is="node"
          v-for="(node, position) in framed"
          :key="position"
        />
      </template>
      <IconButton
        v-if="mounted && autoplays"
        :data-testid="`${testId}__pause`"
        :icon="paused ? 'az az-play' : 'az az-pause'"
        :aria-label="pauseLabel"
        variant="outline"
        size="small"
        class="absolute end-(--spacing-xs) bottom-(--spacing-xs)"
        @click="onPauseToggle"
      />
    </div>
    <figcaption
      v-if="$slots['caption'] || caption"
      :data-testid="`${testId}__caption`"
      class="pt-(--spacing-xs) text-center text-body-xs text-(--text-muted)"
    >
      <slot name="caption">{{ caption }}</slot>
    </figcaption>

    <Teleport to="body">
      <div
        v-if="zoomed"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        ref="overlayEl"
        role="dialog"
        aria-modal="true"
        data-state="open"
        :data-testid="`${testId}__zoom`"
        :aria-label="alt || t('docFrame.zoomedImage')"
        class="fixed inset-0 z-1200 flex items-center justify-center p-(--spacing-lg) animate-fade-in motion-reduce:animate-none"
      >
        <div
          aria-hidden="true"
          :data-testid="`${testId}__zoom-backdrop`"
          class="absolute inset-0 cursor-zoom-out bg-(--bg-backdrop)"
          @click="close"
        ></div>
        <button
          type="button"
          :data-testid="`${testId}__zoom-close`"
          :aria-label="t('docFrame.closeFullScreen')"
          class="fixed top-(--spacing-lg) end-(--spacing-lg) cursor-pointer rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-2xs) text-label-md text-(--text-default) hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
          @click="close"
        >
          {{ t('docFrame.close') }}
        </button>
        <img
          ref="zoomImageEl"
          :src="src"
          :alt="alt"
          :style="{ transform: flip }"
          :data-flip="armed ? 'armed' : 'start'"
          class="pointer-events-none relative block max-h-full max-w-full rounded-(--shape-control) object-contain data-[flip=armed]:transition-[transform] data-[flip=armed]:duration-moderate-02 data-[flip=armed]:ease-expressive-entrance motion-reduce:transition-none!"
          @transitionend="onZoomTransitionend"
        />
      </div>
    </Teleport>
  </figure>
</template>
