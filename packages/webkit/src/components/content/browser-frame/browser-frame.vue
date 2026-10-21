<script setup lang="ts">
  import { useElementSize } from '@vueuse/core'
  import { computed, ref, useAttrs, useId } from 'vue'

  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import { useFrameDocument } from './composables/use-frame-document'

  defineOptions({ name: 'BrowserFrame', inheritAttrs: false })

  type ResizeAxis = 'width' | 'height' | 'both'

  interface Props {
    /** Read-only URL shown in the chrome's address bar; the address bar is not rendered when empty. */
    address?: string
    /** Smallest viewport width the resize handles can reach, in pixels. */
    minWidth?: number
    /** Largest viewport width the resize handles can reach, in pixels; widths wider than the container are scaled down to fit. */
    maxWidth?: number
    /** Smallest viewport height the resize handles can reach, in pixels. */
    minHeight?: number
    /** Largest viewport height the resize handles can reach, in pixels. */
    maxHeight?: number
    /** Accessible name of the viewport; when empty it falls back to `address`, then to `Preview`. */
    ariaLabel?: string
    /** Accessible name of the address bar's copy button. */
    copyAriaLabel?: string
    /** Accessible name of the right-edge width handle. */
    widthHandleAriaLabel?: string
    /** Accessible name of the bottom-edge height handle. */
    heightHandleAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    address: '',
    minWidth: 320,
    maxWidth: 1920,
    minHeight: 320,
    maxHeight: 1440,
    ariaLabel: '',
    copyAriaLabel: 'Copy address',
    widthHandleAriaLabel: 'Resize preview width',
    heightHandleAriaLabel: 'Resize preview height'
  })

  /** Simulated viewport width in pixels; undefined fills the container. */
  const width = defineModel<number | undefined>('width')

  /** Simulated viewport height in pixels. */
  const height = defineModel<number>('height', { default: 800 })

  defineSlots<{
    /** The live content, teleported into the frame's viewport once it is ready. Renders client-side only. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const sizerRef = ref<globalThis.HTMLElement | null>(null)
  const iframeRef = ref<globalThis.HTMLIFrameElement | null>(null)
  const { width: containerWidth } = useElementSize(sizerRef)
  const { body: frameBody } = useFrameDocument(iframeRef)
  const viewportId = useId()

  const dragAxis = ref<ResizeAxis | null>(null)
  const focused = ref(false)
  let originX = 0
  let originY = 0
  let startWidth = 0
  let startHeight = 0

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-browser-frame'
  )

  const resizing = computed(() => dragAxis.value !== null)

  const container = computed(() => Math.floor(containerWidth.value))

  const effectiveWidth = computed(() => width.value ?? container.value)

  const scale = computed(() =>
    container.value > 0 && effectiveWidth.value > container.value
      ? container.value / effectiveWidth.value
      : 1
  )

  const scaled = computed(() => scale.value < 1)

  const displayedWidth = computed(() => effectiveWidth.value * scale.value)

  const widthNow = computed(() => Math.round(effectiveWidth.value))

  const heightNow = computed(() => Math.round(height.value))

  const clamp = (value: number, lower: number, upper: number) =>
    Math.min(Math.max(value, lower), Math.max(lower, upper))

  const widthValueNow = computed(() => clamp(widthNow.value, props.minWidth, props.maxWidth))

  const heightValueNow = computed(() => clamp(heightNow.value, props.minHeight, props.maxHeight))

  const frameTitle = computed(() => props.ariaLabel || props.address || 'Preview')

  const addressHead = computed(() => props.address.slice(0, -12))

  const addressTail = computed(() => props.address.slice(-12))

  const frameStyle = computed(() =>
    width.value === undefined ? undefined : { width: `${displayedWidth.value}px` }
  )

  const clipStyle = computed(() => ({ height: `${Math.ceil(height.value * scale.value)}px` }))

  const viewportStyle = computed(() => ({
    width: effectiveWidth.value > 0 ? `${effectiveWidth.value}px` : undefined,
    height: `${height.value}px`,
    transform: scaled.value ? `scale(${scale.value})` : undefined
  }))

  const onWidthKeydown = (event: globalThis.KeyboardEvent) => {
    const step = event.shiftKey ? 100 : 10
    const targets: Record<string, number> = {
      ArrowLeft: widthValueNow.value - step,
      ArrowRight: widthValueNow.value + step,
      Home: props.minWidth,
      End: props.maxWidth
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    width.value = clamp(next, props.minWidth, props.maxWidth)
  }

  const onHeightKeydown = (event: globalThis.KeyboardEvent) => {
    const step = event.shiftKey ? 100 : 10
    const targets: Record<string, number> = {
      ArrowUp: heightValueNow.value - step,
      ArrowDown: heightValueNow.value + step,
      Home: props.minHeight,
      End: props.maxHeight
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    height.value = clamp(next, props.minHeight, props.maxHeight)
  }

  const startResize = (event: globalThis.PointerEvent, axis: ResizeAxis) => {
    if (event.button !== 0) return
    const handle = event.currentTarget as globalThis.HTMLElement
    handle.setPointerCapture(event.pointerId)
    originX = event.clientX
    originY = event.clientY
    startWidth = displayedWidth.value
    startHeight = height.value
    dragAxis.value = axis
    event.preventDefault()
  }

  const moveResize = (event: globalThis.PointerEvent) => {
    const axis = dragAxis.value
    if (axis === null) return
    if (axis !== 'height') {
      const upper = container.value > 0 ? Math.min(container.value, props.maxWidth) : props.maxWidth
      width.value = clamp(
        Math.round(startWidth + (event.clientX - originX) * 2),
        props.minWidth,
        upper
      )
    }
    if (axis !== 'width') {
      height.value = clamp(
        Math.round(startHeight + (event.clientY - originY) / scale.value),
        props.minHeight,
        props.maxHeight
      )
    }
  }

  const stopResize = () => {
    dragAxis.value = null
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-resizing="resizing || null"
    :data-scaled="scaled || null"
    class="group relative w-full min-w-0"
  >
    <div
      ref="sizerRef"
      aria-hidden="true"
      class="h-0 w-full"
    />
    <div
      class="relative mx-auto max-w-full rounded-(--shape-card) bg-(--bg-surface) after:pointer-events-none after:absolute after:inset-0 after:rounded-(--shape-card) after:border after:border-(--border-default) after:content-['']"
      :style="frameStyle"
    >
      <div
        class="flex h-10 items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm)"
      >
        <span
          aria-hidden="true"
          class="flex flex-1 items-center gap-(--spacing-xs)"
        >
          <span
            v-for="dot in 3"
            :key="dot"
            class="size-2.5 shrink-0 rounded-full bg-(--border-strong)"
          />
        </span>
        <span
          v-if="address"
          :data-testid="`${testId}__address`"
          class="flex h-7 w-full min-w-0 max-w-(--container-xs) items-center rounded-(--radius-full) border border-(--border-muted) bg-(--bg-placeholder) ps-(--spacing-sm)"
        >
          <span
            aria-hidden="true"
            class="flex min-w-0 flex-1 items-center justify-center text-label-code-sm text-(--text-muted)"
          >
            <span class="min-w-0 truncate">{{ addressHead }}</span>
            <span class="shrink-0 whitespace-nowrap">{{ addressTail }}</span>
          </span>
          <span class="-my-px -me-px flex shrink-0">
            <CopyButton
              :value="address"
              kind="transparent"
              size="small"
              :ariaLabel="copyAriaLabel"
              :data-testid="`${testId}__copy`"
            />
          </span>
        </span>
        <span class="flex flex-1 items-center justify-end">
          <span
            v-if="resizing || focused"
            aria-hidden="true"
            class="shrink-0 whitespace-nowrap tabular-nums text-label-sm text-(--text-muted)"
            >{{ widthNow }} × {{ heightNow }}</span
          >
        </span>
      </div>
      <div
        class="overflow-hidden rounded-b-(--shape-card) bg-(--bg-canvas)"
        :style="clipStyle"
      >
        <iframe
          :id="viewportId"
          ref="iframeRef"
          srcdoc=""
          :title="frameTitle"
          :data-testid="`${testId}__viewport`"
          class="block w-full max-w-none origin-top-left border-0 bg-(--bg-canvas) group-data-[resizing]:pointer-events-none"
          :style="viewportStyle"
        />
      </div>
      <div
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        :aria-valuenow="widthValueNow"
        :aria-valuemin="minWidth"
        :aria-valuemax="maxWidth"
        :aria-valuetext="`${widthValueNow} pixels wide`"
        :aria-controls="viewportId"
        :aria-label="widthHandleAriaLabel"
        :data-testid="`${testId}__width-handle`"
        class="group/handle absolute inset-y-0 right-0 flex w-6 cursor-col-resize touch-none items-center justify-center rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
        @keydown="onWidthKeydown"
        @focus="focused = true"
        @blur="focused = false"
        @pointerdown="startResize($event, 'width')"
        @pointermove="moveResize"
        @pointerup="stopResize"
        @pointercancel="stopResize"
        @lostpointercapture="stopResize"
      >
        <span
          class="h-8 w-1 rounded-(--shape-elements) bg-(--border-strong) transition-colors duration-150 ease-out group-hover/handle:bg-(--text-default) group-focus-visible/handle:bg-(--text-default) group-data-[resizing]:bg-(--text-default) motion-reduce:transition-none"
        />
      </div>
      <div
        role="separator"
        tabindex="0"
        aria-orientation="horizontal"
        :aria-valuenow="heightValueNow"
        :aria-valuemin="minHeight"
        :aria-valuemax="maxHeight"
        :aria-valuetext="`${heightValueNow} pixels tall`"
        :aria-controls="viewportId"
        :aria-label="heightHandleAriaLabel"
        :data-testid="`${testId}__height-handle`"
        class="group/handle absolute inset-x-0 bottom-0 flex h-6 cursor-row-resize touch-none items-center justify-center rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
        @keydown="onHeightKeydown"
        @focus="focused = true"
        @blur="focused = false"
        @pointerdown="startResize($event, 'height')"
        @pointermove="moveResize"
        @pointerup="stopResize"
        @pointercancel="stopResize"
        @lostpointercapture="stopResize"
      >
        <span
          class="h-1 w-8 rounded-(--shape-elements) bg-(--border-strong) transition-colors duration-150 ease-out group-hover/handle:bg-(--text-default) group-focus-visible/handle:bg-(--text-default) group-data-[resizing]:bg-(--text-default) motion-reduce:transition-none"
        />
      </div>
      <div
        aria-hidden="true"
        :data-testid="`${testId}__corner-handle`"
        class="group/handle absolute right-0 bottom-0 z-1 flex size-6 cursor-nwse-resize touch-none items-center justify-center rounded-(--shape-elements)"
        @pointerdown="startResize($event, 'both')"
        @pointermove="moveResize"
        @pointerup="stopResize"
        @pointercancel="stopResize"
        @lostpointercapture="stopResize"
      >
        <span
          class="size-2 rounded-(--shape-elements) bg-(--border-strong) transition-colors duration-150 ease-out group-hover/handle:bg-(--text-default) group-data-[resizing]:bg-(--text-default) motion-reduce:transition-none"
        />
      </div>
    </div>
    <Teleport
      v-if="frameBody"
      :to="frameBody"
    >
      <slot />
    </Teleport>
  </div>
</template>
