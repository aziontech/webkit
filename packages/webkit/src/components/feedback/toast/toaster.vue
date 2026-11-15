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

  import { usePortalLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Progress from '../progress/progress.vue'
  import type { ToastEntry, ToastPosition } from './composables/use-toast-store'
  import { registerToaster, useToastStore } from './composables/use-toast-store'
  import { ToastInjectionKey } from './injection-key'
  import { TOAST_UNMOUNT_MS } from './presets/transitions'
  import ToastAction from './toast-action/toast-action.vue'
  import ToastClose from './toast-close/toast-close.vue'
  import ToastDescription from './toast-description/toast-description.vue'
  import ToastItem from './toast-item/toast-item.vue'
  import ToastTitle from './toast-title/toast-title.vue'

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
      /** Show an always-visible close control on every toast; a per-toast `closable` option overrides it. */
      closable?: boolean
    }>(),
    {
      position: 'bottom-right',
      duration: 4000,
      max: 3,
      expand: false,
      closable: false
    }
  )

  defineSlots<{
    default(props: { toast: ToastEntry; dismiss: () => void }): unknown
  }>()

  const store = useToastStore()
  provide(ToastInjectionKey, store)

  watch(
    () => props.duration,
    (ms: number) => store.setDefaultDuration(ms),
    { immediate: true }
  )

  const toasterReg = registerToaster()
  const isActive = computed(() => toasterReg.isActive())

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast')

  const progressOf = (entry: ToastEntry) => Math.min(100, Math.max(0, entry.progress ?? 0))

  const percentOf = (entry: ToastEntry) =>
    new Intl.NumberFormat(portalLocale.value.lang || undefined, {
      style: 'percent',
      maximumFractionDigits: 0
    }).format(progressOf(entry) / 100)

  const actionsOf = (entry: ToastEntry) =>
    (entry.actions?.length ? entry.actions : entry.action ? [entry.action] : []).slice(0, 2)

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

  const items = ref<ToastView[]>([])

  const politeText = ref('')
  const assertiveText = ref('')
  const spoken = new Map<string, string>()

  const speak = (channel: typeof politeText, texts: string[]) => {
    if (!texts.length) return
    channel.value = ''
    nextTick(() => (channel.value = texts.join(' ')))
  }

  const announce = (next: ToastEntry[]) => {
    const polite: string[] = []
    const assertive: string[] = []
    const ids = new Set<string>()
    next.forEach((entry) => {
      ids.add(entry.id)
      const text = [entry.message, entry.description].filter(Boolean).join('. ')
      const key = `${entry.severity}|${text}`
      if (spoken.get(entry.id) === key) return
      spoken.set(entry.id, key)
      if (entry.severity === 'danger') assertive.push(text)
      else polite.push(text)
    })
    spoken.forEach((_, id) => {
      if (!ids.has(id)) spoken.delete(id)
    })
    speak(politeText, polite)
    speak(assertiveText, assertive)
  }
  const removalTimers = new Map<string, ReturnType<typeof setTimeout>>()

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
        severity: t.severity,
        loading: t.loading,
        message: t.message,
        description: t.description,
        action: t.action,
        actions: t.actions,
        duration: t.duration,
        position: t.position,
        closable: t.closable,
        progress: t.progress
      })),
    (next) => {
      announce(next as ToastEntry[])
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

  interface Region {
    position: ToastPosition
    all: ToastView[]
    live: ToastView[]
  }

  const POSITIONS: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ]

  const regions = computed<Region[]>(() => {
    const map = new Map<ToastPosition, ToastView[]>(POSITIONS.map((position) => [position, []]))
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

  const hoveredPosition = ref<ToastPosition | null>(null)
  const isExpanded = (region: Region) =>
    props.expand || (hoveredPosition.value === region.position && region.live.length > 1)

  const onEnter = (position: ToastPosition) => {
    hoveredPosition.value = position
    store.pause()
  }
  const focusedPosition = ref<ToastPosition | null>(null)

  const onLeave = () => {
    hoveredPosition.value = null
    if (focusedPosition.value === null) store.resume()
  }

  const onFocusin = (position: ToastPosition) => {
    focusedPosition.value = position
    store.pause()
  }

  const onFocusout = (event: FocusEvent) => {
    const region = event.currentTarget as HTMLElement
    if (event.relatedTarget instanceof Node && region.contains(event.relatedTarget)) return
    focusedPosition.value = null
    if (hoveredPosition.value === null) store.resume()
  }

  const regionEls = new Map<ToastPosition, HTMLElement>()
  const setRegionEl = (position: ToastPosition, el: unknown) => {
    if (el instanceof HTMLElement) regionEls.set(position, el)
    else regionEls.delete(position)
  }

  let returnFocus: HTMLElement | null = null

  const focusFrontToast = () => {
    const region = regions.value.find((r) => r.live.length > 0)
    if (!region) return false
    const front = regionEls.get(region.position)?.querySelector<HTMLElement>('[data-front]')
    if (!front) return false
    const control = front.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
    ;(control ?? front).focus()
    return true
  }

  const onHotkey = (event: KeyboardEvent) => {
    if (!event.altKey || event.code !== 'KeyT' || !isActive.value) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (focusFrontToast()) {
      event.preventDefault()
      if (previous && !previous.closest('[data-toast-region]')) returnFocus = previous
    }
  }

  const onRegionKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return
    const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-toast-id]')
    const id = card?.dataset['toastId']
    if (!id) return
    event.preventDefault()
    event.stopPropagation()
    dismiss(id)
    const target = returnFocus
    returnFocus = null
    if (target?.isConnected) target.focus()
  }

  onMounted(() => document.addEventListener('keydown', onHotkey))
  onBeforeUnmount(() => document.removeEventListener('keydown', onHotkey))

  const dismiss = (id: string) => store.dismiss(id)

  const regionStyle = (region: Region): CSSProperties => {
    const pos = region.position
    const top = isTopPos(pos)
    const center = pos.endsWith('center')
    const vis = region.live.slice(0, visibleCount.value)
    const frontHeight = heights.value[region.live[0]?.entry.id] ?? 0

    let height = '0'
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
      bottom: top ? 'auto' : 'calc(var(--spacing-md) + var(--toast-offset-bottom, 0%))',
      left: center ? '50%' : pos.endsWith('left') ? 'var(--spacing-md)' : 'auto',
      right: pos.endsWith('right') ? 'var(--spacing-md)' : 'auto',
      transform: center ? 'translateX(-50%)' : 'none',
      height
    }
  }

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

    if (!item.mounted || item.removing) {
      return {
        ...base,
        transform: `${offEdge} scale(1)`,
        opacity: '0',
        pointerEvents: 'none'
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
      pointerEvents: hidden ? 'none' : 'auto'
    }
  }

  const portalLocale = usePortalLocale()
  const { t } = useTranslate({ toast: en.toast })
  const regionLabel = computed(() => t('toast.region', { hotkey: 'Alt+T' }))
</script>

<template>
  <Teleport to="body">
    <template v-if="isActive">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        :data-testid="`${testId}__live-polite`"
        :lang="portalLocale.lang"
        class="sr-only"
      >
        {{ politeText }}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :data-testid="`${testId}__live-assertive`"
        :lang="portalLocale.lang"
        class="sr-only"
      >
        {{ assertiveText }}
      </div>
      <div
        v-for="region in regions"
        :key="region.position"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :data-testid="`${testId}__${region.position}`"
        :data-position="region.position"
        :data-state="isExpanded(region) ? 'open' : 'closed'"
        data-toast-region
        :role="region.all.length ? 'region' : undefined"
        :aria-label="region.all.length ? regionLabel : undefined"
        :ref="(el) => setRegionEl(region.position, el)"
        :style="regionStyle(region)"
        class="transition-[height] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        @mouseenter="onEnter(region.position)"
        @mouseleave="onLeave"
        @focusin="onFocusin(region.position)"
        @focusout="onFocusout"
        @keydown="onRegionKeydown"
      >
        <div
          v-for="(item, indexInAll) in region.all"
          :key="item.entry.id"
          :data-toast-id="item.entry.id"
          :data-front="region.live.indexOf(item) === 0 || null"
          :data-severity="item.entry.severity"
          :data-removing="item.removing || null"
          :tabindex="region.live.indexOf(item) === 0 ? -1 : undefined"
          :style="toastStyle(region, item, indexInAll)"
          class="will-change-transform rounded-(--shape-control) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) transition-[transform,opacity,height] duration-moderate-02 ease-productive-entrance data-[removing]:duration-slow-01 data-[removing]:ease-productive-exit motion-reduce:transition-none"
        >
          <div :ref="(el) => setCardEl(item.entry.id, el)">
            <slot
              :toast="item.entry"
              :dismiss="() => dismiss(item.entry.id)"
            >
              <ToastItem
                :severity="item.entry.severity"
                :loading="item.entry.loading"
              >
                <ToastTitle>{{ item.entry.message }}</ToastTitle>
                <ToastDescription v-if="item.entry.description">{{
                  item.entry.description
                }}</ToastDescription>
                <div
                  v-if="item.entry.progress !== undefined"
                  :data-testid="`${testId}__progress`"
                  class="flex items-center gap-(--spacing-xs) pt-(--spacing-2xs)"
                >
                  <Progress
                    :value="progressOf(item.entry)"
                    :aria-label="item.entry.message"
                    variant="rounded"
                    class="min-w-0 flex-1"
                  />
                  <span
                    aria-hidden="true"
                    class="shrink-0 text-body-xs text-(--text-muted) tabular-nums"
                    >{{ percentOf(item.entry) }}</span
                  >
                </div>
                <template #trailing>
                  <ToastAction
                    v-for="(entryAction, actionIndex) in actionsOf(item.entry)"
                    :key="actionIndex"
                    :label="entryAction.label"
                    @click="(event) => entryAction.onClick(event)"
                  />
                  <ToastClose
                    v-if="item.entry.closable ?? closable"
                    @click="() => dismiss(item.entry.id)"
                  />
                </template>
              </ToastItem>
            </slot>
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>
