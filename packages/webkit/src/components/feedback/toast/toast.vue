<script setup lang="ts">
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

  import { useDirection } from '../../../composables/use-direction'
  import { usePortalLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Progress from '../progress/progress.vue'
  import { useToastRegions } from './composables/use-toast-regions'
  import type { ToastEntry, ToastPosition } from './composables/use-toast-store'
  import { registerToaster, useToastStore } from './composables/use-toast-store'
  import { ToastInjectionKey } from './injection-key'
  import { announceToasts } from './lib/toast-announcements'
  import {
    toastItemStyle,
    type ToastRegion,
    toastRegions,
    toastRegionStyle,
    type ToastView
  } from './lib/toast-layout'
  import { toastSnapshot } from './lib/toast-snapshot'
  import { TOAST_UNMOUNT_MS } from './presets/transitions'
  import ToastAction from './toast-action/toast-action.vue'
  import ToastClose from './toast-close/toast-close.vue'
  import ToastDescription from './toast-description/toast-description.vue'
  import ToastItem from './toast-item/toast-item.vue'
  import ToastTitle from './toast-title/toast-title.vue'

  export type { ToastPosition }

  defineOptions({
    name: 'Toast',
    inheritAttrs: false
  })

  export interface ToastProps {
    /** Default corner (or edge-center) toasts anchor to; `start` and `end` follow the reading direction, and a per-toast `position` overrides it. */
    position?: ToastPosition
    /** Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed. */
    duration?: number
    /** Maximum simultaneously visible toasts per position before the rest queue behind. */
    max?: number
    /** Keep the stack permanently expanded (otherwise it expands on hover). */
    expand?: boolean
    /** Show an always-visible close control on every toast; a per-toast `closable` option overrides it. */
    closable?: boolean
  }

  const props = withDefaults(defineProps<ToastProps>(), {
    position: 'bottom-end',
    duration: 4000,
    max: 3,
    expand: false,
    closable: false
  })

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

  const portalLocale = usePortalLocale()
  const documentDirection = useDirection(() =>
    typeof document === 'undefined' ? null : document.body
  )
  const direction = computed(() => portalLocale.value.dir ?? documentDirection.value)

  const toasterReg = registerToaster()
  const isActive = computed(() => toasterReg.isActive())

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'toast')

  const progressOf = (entry: ToastEntry) => Math.min(100, Math.max(0, entry.progress ?? 0))

  const percentOf = (entry: ToastEntry) =>
    new Intl.NumberFormat(portalLocale.value.lang || undefined, {
      style: 'percent',
      maximumFractionDigits: 0
    }).format(progressOf(entry) / 100)

  const actionsOf = (entry: ToastEntry) =>
    (entry.actions?.length ? entry.actions : entry.action ? [entry.action] : []).slice(0, 2)

  const visibleCount = computed(() => Math.max(1, props.max))

  const items = ref<ToastView[]>([])

  const politeText = ref('')
  const assertiveText = ref('')
  const spoken = new Map<string, string>()

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
    () => store.toasts.map(toastSnapshot),
    (next) => {
      announceToasts(next, spoken, politeText, assertiveText)
      const nextIds = new Set(next.map((t) => t.id))
      next.forEach((entry) => {
        const item = items.value.find((i) => i.entry.id === entry.id)
        if (item) {
          item.entry = entry
          item.removing = false
        } else {
          const id = entry.id
          items.value = [{ entry: entry, mounted: false, removing: false }, ...items.value]
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

  const regions = computed(() => toastRegions(items.value, props.position))

  const hoveredPosition = ref<ToastPosition | null>(null)
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

  const { setRegionEl } = useToastRegions(
    store,
    regions,
    isActive,
    onEnter,
    onLeave,
    onFocusin,
    onFocusout
  )

  const isExpanded = (region: ToastRegion) =>
    props.expand || (hoveredPosition.value === region.position && region.live.length > 1)

  const dismiss = (id: string) => store.dismiss(id)

  const regionStyle = (region: ToastRegion) =>
    toastRegionStyle(
      region,
      heights.value,
      visibleCount.value,
      isExpanded(region),
      direction.value === 'rtl'
    )

  const toastStyle = (region: ToastRegion, item: ToastView, indexInAll: number) =>
    toastItemStyle(region, item, indexInAll, heights.value, visibleCount.value, isExpanded(region))

  const { t } = useTranslate({ toast: en.toast })
  const regionLabel = computed(() => t('toast.region', { hotkey: 'Alt+T' }))

  const ITEM_CLASS =
    'will-change-transform rounded-(--shape-control) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'transition-[transform,opacity,height] duration-moderate-02 ease-productive-entrance ' +
    'data-[removing]:duration-slow-01 data-[removing]:ease-productive-exit ' +
    'motion-reduce:transition-none'
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
          :class="ITEM_CLASS"
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
