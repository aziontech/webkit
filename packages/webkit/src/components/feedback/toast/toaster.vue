<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { ToastInjectionKey } from './injection-key'
  import {
    getCloseRevealTransitionStyle,
    getRegionTransitionStyle,
    getToastTransitionStyle,
    TOAST_UNMOUNT_MS
  } from './presets/transitions'
  import ToastAction from './toast-action/toast-action.vue'
  import ToastClose from './toast-close/toast-close.vue'
  import ToastDescription from './toast-description/toast-description.vue'
  import ToastItem from './toast-item/toast-item.vue'
  import ToastTitle from './toast-title/toast-title.vue'
  import type { ToastEntry, ToastPosition } from './use-toast-store'
  import { registerToaster, useToastStore } from './use-toast-store'

  export type { ToastPosition }

  defineOptions({
    name: 'Toaster',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Default corner (or edge-center) toasts anchor to; a per-toast `position` overrides it. */
      position?: ToastPosition
      /** Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed. */
      duration?: number
      /** Maximum simultaneously visible toasts per corner before the rest queue behind. */
      max?: number
      /** Keep the stack permanently expanded (otherwise it expands on hover). */
      expand?: boolean
    }>(),
    {
      position: 'bottom-right',
      duration: 4000,
      max: 3,
      expand: false
    }
  )

  defineSlots<{
    default(props: { toast: ToastEntry; dismiss: () => void }): unknown
  }>()

  const store = useToastStore()
  provide(ToastInjectionKey, store)

  // Only one mounted Toaster renders the regions (the stack is a global singleton).
  const toasterReg = registerToaster()
  const isActive = computed(() => toasterReg.isActive())

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast')

  const GAP = 14
  const PEEK = 14

  const visibleCount = computed(() => Math.max(1, props.max))

  const isTopPos = (p: ToastPosition) => p.startsWith('top')
  const liftOf = (p: ToastPosition) => (isTopPos(p) ? 1 : -1)

  interface ToastView {
    entry: ToastEntry
    mounted: boolean
    removing: boolean
  }

  // Local lifecycle list (newest first). It mirrors the store but keeps a toast
  // around through its exit transition before dropping it from the DOM.
  const items = ref<ToastView[]>([])
  const removalTimers = new Map<string, ReturnType<typeof setTimeout>>()

  // --- Height measurement (the stack lays out by real measured heights) ------
  // Defined before the watch below: the immediate watch runs during setup and
  // calls measure(), so it must already be initialized (no temporal-dead-zone).
  const cardEls = new Map<string, HTMLElement>()
  const heights = ref<Record<string, number>>({})

  const setCardEl = (id: string, el: unknown) => {
    if (el instanceof HTMLElement) cardEls.set(id, el)
    else cardEls.delete(id)
  }

  const measure = () => {
    const nextHeights: Record<string, number> = {}
    let changed = false
    cardEls.forEach((el, id) => {
      const h = el.offsetHeight
      nextHeights[id] = h
      if (heights.value[id] !== h) changed = true
    })
    if (Object.keys(nextHeights).length !== Object.keys(heights.value).length) changed = true
    if (changed) heights.value = nextHeights
  }

  watch(
    () =>
      store.toasts.map((t) => ({
        id: t.id,
        type: t.type,
        message: t.message,
        description: t.description,
        action: t.action,
        duration: t.duration,
        position: t.position
      })),
    (next) => {
      const nextIds = new Set(next.map((t) => t.id))
      next.forEach((entry) => {
        const item = items.value.find((i) => i.entry.id === entry.id)
        if (item) {
          item.entry = entry as ToastEntry
          item.removing = false
        } else {
          const id = entry.id
          items.value = [
            { entry: entry as ToastEntry, mounted: false, removing: false },
            ...items.value
          ]
          // Flip to mounted next frame so the enter transition runs.
          nextTick(() => {
            const fresh = items.value.find((i) => i.entry.id === id)
            if (fresh) fresh.mounted = true
            measure()
          })
        }
      })
      items.value.forEach((item) => {
        if (!nextIds.has(item.entry.id) && !item.removing) {
          item.removing = true
          const id = item.entry.id
          removalTimers.set(
            id,
            setTimeout(() => {
              items.value = items.value.filter((i) => i.entry.id !== id)
              removalTimers.delete(id)
              nextTick(measure)
            }, TOAST_UNMOUNT_MS)
          )
        }
      })
      nextTick(measure)
    },
    { deep: true, immediate: true }
  )

  onMounted(() => {
    toasterReg.activate()
    nextTick(measure)
  })
  onBeforeUnmount(() => {
    toasterReg.release()
    removalTimers.forEach((t) => clearTimeout(t))
  })

  // --- Group toasts by their effective corner (per-toast `position` ?? prop) -
  interface Region {
    position: ToastPosition
    all: ToastView[]
    live: ToastView[]
  }

  const regions = computed<Region[]>(() => {
    const map = new Map<ToastPosition, ToastView[]>()
    items.value.forEach((item) => {
      const pos = item.entry.position ?? props.position
      const bucket = map.get(pos)
      if (bucket) bucket.push(item)
      else map.set(pos, [item])
    })
    return Array.from(map, ([position, all]) => ({
      position,
      all,
      live: all.filter((i) => !i.removing)
    }))
  })

  // --- Hover (per corner): expand that region AND pause the auto-dismiss ------
  const hoveredPosition = ref<ToastPosition | null>(null)
  const isExpanded = (region: Region) =>
    props.expand || (hoveredPosition.value === region.position && region.live.length > 1)

  const onEnter = (position: ToastPosition) => {
    hoveredPosition.value = position
    store.pause()
  }
  const onLeave = () => {
    hoveredPosition.value = null
    store.resume()
  }

  const dismiss = (id: string) => store.dismiss(id)

  const regionStyle = (region: Region): CSSProperties => {
    const pos = region.position
    const top = isTopPos(pos)
    const center = pos.endsWith('center')
    const vis = region.live.slice(0, visibleCount.value)
    const frontHeight = heights.value[region.live[0]?.entry.id] ?? 0

    let height = '0px'
    if (vis.length) {
      if (isExpanded(region)) {
        let total = (vis.length - 1) * GAP
        vis.forEach((i) => (total += heights.value[i.entry.id] ?? 0))
        height = total ? `${total}px` : 'auto'
      } else {
        height = `${frontHeight + Math.min(vis.length - 1, 2) * 12}px`
      }
    }

    return {
      position: 'fixed',
      zIndex: '1100',
      width: '356px',
      maxWidth: 'calc(100vw - 2 * var(--spacing-md))',
      top: top ? 'var(--spacing-md)' : 'auto',
      bottom: top ? 'auto' : 'var(--spacing-md)',
      left: center ? '50%' : pos.endsWith('left') ? 'var(--spacing-md)' : 'auto',
      right: pos.endsWith('right') ? 'var(--spacing-md)' : 'auto',
      transform: center ? 'translateX(-50%)' : 'none',
      height,
      ...getRegionTransitionStyle()
    }
  }

  // Per-toast geometry within its region (computed inline style — dynamic
  // positioning, not a class preset).
  const toastStyle = (region: Region, item: ToastView, indexInAll: number): CSSProperties => {
    const pos = region.position
    const top = isTopPos(pos)
    const lift = liftOf(pos)
    const offEdge = `translateY(${top ? '-100%' : '100%'})`
    const base: CSSProperties = {
      position: 'absolute',
      left: '0',
      right: '0',
      top: top ? '0' : 'auto',
      bottom: top ? 'auto' : '0',
      width: '100%',
      zIndex: String(region.all.length - indexInAll),
      transformOrigin: top ? 'top center' : 'bottom center'
    }

    // Enter-from and exit-to: parked off the anchored edge, faded out.
    if (!item.mounted || item.removing) {
      return {
        ...base,
        transform: `${offEdge} scale(1)`,
        opacity: '0',
        pointerEvents: 'none',
        ...getToastTransitionStyle(item.removing)
      }
    }

    const li = region.live.indexOf(item)
    const hidden = li >= visibleCount.value
    const front = li === 0
    const frontHeight = heights.value[region.live[0]?.entry.id] ?? 0
    const self = heights.value[item.entry.id] ?? 0

    let translateY = 0
    let scale = 1
    let height = self ? `${self}px` : 'auto'
    let overflow = 'visible'

    if (hidden) {
      translateY = lift * PEEK * visibleCount.value
      scale = 1 - visibleCount.value * 0.05
      height = frontHeight ? `${frontHeight}px` : 'auto'
      overflow = 'hidden'
    } else if (isExpanded(region)) {
      let before = 0
      for (let i = 0; i < li; i++) before += heights.value[region.live[i].entry.id] ?? 0
      translateY = lift * (li * GAP + before)
    } else if (front) {
      translateY = 0
    } else {
      translateY = lift * PEEK * li
      scale = 1 - li * 0.05
      height = frontHeight ? `${frontHeight}px` : 'auto'
      overflow = 'hidden'
    }

    return {
      ...base,
      transform: `translateY(${translateY}px) scale(${scale})`,
      height,
      overflow,
      opacity: hidden ? '0' : '1',
      pointerEvents: hidden ? 'none' : 'auto',
      ...getToastTransitionStyle(false)
    }
  }

  const closeRevealTransitionStyle = getCloseRevealTransitionStyle()
</script>

<template>
  <Teleport to="body">
    <template v-if="isActive">
      <div
        v-for="region in regions"
        :key="region.position"
        :data-testid="`${testId}-${region.position}`"
        :data-position="region.position"
        :data-expanded="isExpanded(region) || null"
        :aria-live="region.all.some((i) => i.entry.type === 'error') ? 'assertive' : 'polite'"
        aria-atomic="false"
        :style="regionStyle(region)"
        class="motion-reduce:transition-none"
        @mouseenter="onEnter(region.position)"
        @mouseleave="onLeave"
      >
        <div
          v-for="(item, indexInAll) in region.all"
          :key="item.entry.id"
          :data-front="region.live.indexOf(item) === 0 || null"
          :data-type="item.entry.type"
          :style="toastStyle(region, item, indexInAll)"
          class="will-change-transform motion-reduce:transition-none"
        >
          <div :ref="(el) => setCardEl(item.entry.id, el)">
            <slot
              :toast="item.entry"
              :dismiss="() => dismiss(item.entry.id)"
            >
              <ToastItem :type="item.entry.type">
                <ToastTitle>{{ item.entry.message }}</ToastTitle>
                <ToastDescription v-if="item.entry.description">{{
                  item.entry.description
                }}</ToastDescription>
                <template #trailing>
                  <ToastAction
                    v-if="item.entry.action"
                    :label="item.entry.action.label"
                    @click="(event) => item.entry.action?.onClick(event)"
                  />
                  <span
                    :style="closeRevealTransitionStyle"
                    class="opacity-0 group-hover:opacity-100 focus-within:opacity-100 motion-reduce:transition-none"
                  >
                    <ToastClose @click="() => dismiss(item.entry.id)" />
                  </span>
                </template>
              </ToastItem>
            </slot>
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>
