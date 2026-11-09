<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core'
  import type { VNode } from 'vue'
  import { cloneVNode, computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap/index.js'
  import { flattenSlot } from './flatten-slot'

  defineOptions({ name: 'DocFrame', inheritAttrs: false })

  interface Props {
    /** Caption under the frame, centered; plain-text fallback for the caption slot. */
    caption?: string
    /** Lead-in above the frame, left aligned; plain-text fallback for the hint slot. */
    hint?: string
    /** Media source; omit to frame slot content instead. */
    src?: string
    /** Alternative text for the framed media. */
    alt?: string
    /** Plays the clip on its own, muted, inline and looping, with no controls. */
    autoplay?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
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

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-frame')

  const CLIP_EXTENSIONS = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i

  const isClip = computed(() => CLIP_EXTENSIONS.test(props.src))

  const AUTOPLAY_ATTRS = { playsinline: '', loop: '', muted: '' }

  const playsOnItsOwn = (nodeAttrs: Record<string, unknown> | null) => {
    if (!nodeAttrs) return false
    const value = nodeAttrs['autoplay'] ?? nodeAttrs['autoPlay']
    return value !== undefined && value !== null && value !== false
  }

  const normalizeClip = (node: VNode) =>
    node?.type === 'video' && playsOnItsOwn(node.props) ? cloneVNode(node, AUTOPLAY_ATTRS) : node

  const framed = computed(() => flattenSlot(slots['default']?.() ?? []).map(normalizeClip))

  const zoomable = computed(() => Boolean(props.src) && !isClip.value)

  const zoomed = ref(false)
  const triggerRef = ref<HTMLButtonElement | null>(null)
  const overlayRef = ref<HTMLElement | null>(null)
  const zoomImageRef = ref<HTMLImageElement | null>(null)

  const flip = ref('')

  const armed = ref(false)

  const isScrollLocked = useScrollLock(document.body)

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
    const from = triggerRef.value?.getBoundingClientRect()
    zoomed.value = true
    armed.value = false
    flip.value = ''
    if (prefersReducedMotion()) return
    await nextTick()
    const image = zoomImageRef.value
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
    const image = zoomImageRef.value
    const from = triggerRef.value?.getBoundingClientRect()
    if (!image || !from || prefersReducedMotion()) {
      zoomed.value = false
      return
    }
    flip.value = flipTransform(from, image.getBoundingClientRect())
  }

  const onZoomTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== zoomImageRef.value || event.propertyName !== 'transform') return
    if (flip.value) zoomed.value = false
  }

  watch(zoomed, (isOpen) => {
    isScrollLocked.value = isOpen
  })

  useFocusTrap(overlayRef, zoomed)

  useEventListener(document, 'keydown', (event: KeyboardEvent) => {
    if (!zoomed.value || event.key !== 'Escape') return
    event.preventDefault()
    close()
  })

  watch(zoomed, async (isOpen, wasOpen) => {
    if (isOpen || !wasOpen) return
    await nextTick()
    triggerRef.value?.focus()
  })
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
      class="flex flex-col items-center justify-center overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm)"
    >
      <video
        v-if="isClip"
        :src="src"
        :aria-label="alt || undefined"
        :autoplay="autoplay || undefined"
        :playsinline="autoplay || undefined"
        :loop="autoplay || undefined"
        :muted="autoplay || undefined"
        :controls="!autoplay || undefined"
        class="block h-auto w-full rounded-(--shape-elements)"
      ></video>
      <button
        v-else-if="zoomable"
        ref="triggerRef"
        type="button"
        :data-testid="`${testId}__zoom-trigger`"
        :aria-label="alt ? `View full screen: ${alt}` : 'View image full screen'"
        class="group relative block w-full cursor-zoom-in rounded-(--shape-elements) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
        @click="open"
      >
        <img
          :src="src"
          :alt="alt"
          class="block h-auto w-full rounded-(--shape-elements)"
        />
        <span
          aria-hidden="true"
          :data-testid="`${testId}__zoom-hint`"
          class="pointer-events-none absolute top-(--spacing-xs) right-(--spacing-xs) inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-default) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          <i class="pi pi-search-plus text-body-xs"></i>
          Full screen
        </span>
      </button>
      <img
        v-else-if="src"
        :src="src"
        :alt="alt"
        class="block h-auto w-full rounded-(--shape-elements)"
      />
      <template v-else>
        <component
          :is="node"
          v-for="(node, position) in framed"
          :key="position"
        />
      </template>
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
        ref="overlayRef"
        role="dialog"
        aria-modal="true"
        data-state="open"
        :data-testid="`${testId}__zoom`"
        :aria-label="alt || 'Image, full screen'"
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
          aria-label="Close full screen"
          class="fixed top-(--spacing-lg) right-(--spacing-lg) cursor-pointer rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xxs) text-label-md text-(--text-default) hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
          @click="close"
        >
          Close
        </button>
        <img
          ref="zoomImageRef"
          :src="src"
          :alt="alt"
          :style="{ transform: flip }"
          :data-flip="armed ? 'armed' : 'start'"
          class="pointer-events-none relative block max-h-full max-w-full rounded-(--shape-elements) object-contain data-[flip=armed]:transition-[transform] data-[flip=armed]:duration-moderate-02 data-[flip=armed]:ease-expressive-entrance motion-reduce:transition-none!"
          @transitionend="onZoomTransitionEnd"
        />
      </div>
    </Teleport>
  </figure>
</template>
