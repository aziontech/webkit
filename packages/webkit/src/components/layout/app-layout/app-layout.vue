<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerOverlay from '../../overlay/drawer/drawer-overlay.vue'
  import DrawerPortal from '../../overlay/drawer/drawer-portal.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'

  defineOptions({
    name: 'AppLayout',
    inheritAttrs: false
  })

  /** Where the split panel sits relative to the content. */
  export type AppLayoutSplitPanelPosition = 'bottom' | 'side'

  interface Props {
    /** Whether the navigation region shows beside the content. Use with `v-model:navigation-open`. Not used while compact. */
    navigationOpen?: boolean
    /** Accessible name of the navigation drawer. Empty uses the locale catalog (`Navigation`). */
    navigationLabel?: string
    /** Whether the tools region (help) is open; while compact it drives the tools drawer. Use with `v-model:tools-open`. */
    toolsOpen?: boolean
    /** Title of the tools region, shown in its header. Empty uses the locale catalog (`Help`). */
    toolsLabel?: string
    /** Width of the tools region in pixels while not compact. */
    toolsWidth?: number
    /** Whether the split panel is open. Use with `v-model:split-panel-open`. */
    splitPanelOpen?: boolean
    /** Where the split panel sits: under the content or beside it. Use with `v-model:split-panel-position`. Bottom while compact. */
    splitPanelPosition?: AppLayoutSplitPanelPosition
    /** Height (bottom) or width (side) of the split panel in pixels. Use with `v-model:split-panel-size`. */
    splitPanelSize?: number
    /** Title of the split panel, shown in its header. Empty uses the locale catalog (`Details`). */
    splitPanelTitle?: string
    /** When set, the split panel size and position and the navigation and tools open state are kept in `localStorage` under it. */
    storageKey?: string
    /** Width of the layout itself, in pixels, under which navigation and tools become drawers and the split panel moves down. */
    compactBelow?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    navigationOpen: true,
    navigationLabel: '',
    toolsOpen: false,
    toolsLabel: '',
    toolsWidth: 320,
    splitPanelOpen: false,
    splitPanelPosition: 'bottom',
    splitPanelSize: 320,
    splitPanelTitle: '',
    storageKey: '',
    compactBelow: 768
  })

  const emit = defineEmits<{
    'update:navigationOpen': [value: boolean]
    'update:toolsOpen': [value: boolean]
    'update:splitPanelOpen': [value: boolean]
    'update:splitPanelPosition': [value: AppLayoutSplitPanelPosition]
    'update:splitPanelSize': [value: number]
  }>()

  const slots = defineSlots<{
    /** The page content (the consumer's main). Scrolls on its own. */
    default(): unknown
    /** The navigation rail; rendered beside the content, or in the navigation drawer when compact. */
    navigation?(props: { drawer: boolean; closeNavigation: () => void }): unknown
    /** The global header. */
    header?(props: {
      compact: boolean
      openNavigation: () => void
      toggleNavigation: () => void
      toggleTools: () => void
    }): unknown
    /** Flash messages above the breadcrumbs and the content. */
    notifications?(): unknown
    /** Breadcrumbs above the content. */
    breadcrumbs?(): unknown
    /** The tools region's body, usually a HelpPanel. */
    tools?(): unknown
    /** The split panel's body. */
    'split-panel'?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ appLayout: en.appLayout })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-app-layout'
  )

  function local<T>(read: () => T, event: (value: T) => void) {
    const state = ref(read()) as { value: T }
    watch(read, (value) => {
      state.value = value
    })
    return computed<T>({
      get: () => state.value,
      set: (value) => {
        if (value === state.value) return
        state.value = value
        event(value)
      }
    })
  }

  const navigationOpen = local(
    () => props.navigationOpen,
    (value) => emit('update:navigationOpen', value)
  )
  const toolsOpen = local(
    () => props.toolsOpen,
    (value) => emit('update:toolsOpen', value)
  )
  const splitOpen = local(
    () => props.splitPanelOpen,
    (value) => emit('update:splitPanelOpen', value)
  )
  const splitPosition = local(
    () => props.splitPanelPosition,
    (value) => emit('update:splitPanelPosition', value)
  )
  const splitSize = local(
    () => props.splitPanelSize,
    (value) => emit('update:splitPanelSize', value)
  )

  const rootRef = ref<globalThis.HTMLElement | null>(null)
  const rowRef = ref<globalThis.HTMLElement | null>(null)
  const separatorRef = ref<globalThis.HTMLElement | null>(null)
  const dir = useDirection(rootRef)

  const width = ref(0)
  const rowWidth = ref(0)
  const height = ref(0)
  const compact = computed(() => width.value > 0 && width.value < props.compactBelow)

  let frame = 0
  const measure = (apply: () => void) => {
    globalThis.cancelAnimationFrame?.(frame)
    frame = globalThis.requestAnimationFrame?.(apply) ?? 0
  }
  onScopeDispose(() => globalThis.cancelAnimationFrame?.(frame))

  useResizeObserver(rootRef, (entries) => {
    const rect = entries[0]?.contentRect
    measure(() => {
      width.value = rect?.width ?? 0
      height.value = rect?.height ?? 0
    })
  })
  useResizeObserver(rowRef, (entries) => {
    const rect = entries[0]?.contentRect
    globalThis.requestAnimationFrame?.(() => {
      rowWidth.value = rect?.width ?? 0
    })
  })

  const navDrawerOpen = ref(false)
  watch(compact, (value) => {
    if (!value) navDrawerOpen.value = false
  })

  const toolsDrawerOpen = computed({
    get: () => compact.value && toolsOpen.value,
    set: (value: boolean) => {
      toolsOpen.value = value
    }
  })

  const position = computed<AppLayoutSplitPanelPosition>(() =>
    compact.value ? 'bottom' : splitPosition.value
  )

  const hasNavigation = () => Boolean(slots.navigation)
  const hasTools = () => Boolean(slots.tools)
  const hasSplit = () => Boolean(slots['split-panel'])

  const showNavigation = () => hasNavigation() && !compact.value && navigationOpen.value
  const showTools = () => hasTools() && !compact.value && toolsOpen.value
  const showSplit = () => hasSplit() && splitOpen.value

  const minSize = computed(() => (position.value === 'side' ? 280 : 160))
  const maxSize = computed(() => {
    const room = position.value === 'side' ? rowWidth.value * 0.6 : height.value * 0.7
    return Math.max(minSize.value, Math.round(room || 640))
  })
  const clamp = (value: number) =>
    Math.round(Math.min(maxSize.value, Math.max(minSize.value, value)))
  const size = computed(() => clamp(splitSize.value))

  const openNavigation = () => {
    if (compact.value) navDrawerOpen.value = true
    else navigationOpen.value = true
  }
  const closeNavigation = () => {
    navDrawerOpen.value = false
  }
  const toggleNavigation = () => {
    if (compact.value) navDrawerOpen.value = !navDrawerOpen.value
    else navigationOpen.value = !navigationOpen.value
  }
  const toggleTools = () => {
    toolsOpen.value = !toolsOpen.value
  }
  const togglePosition = () => {
    splitPosition.value = splitPosition.value === 'side' ? 'bottom' : 'side'
  }

  const STEP = 16
  const BIG_STEP = 64

  const nudge = (event: globalThis.KeyboardEvent) => {
    const step = event.shiftKey ? BIG_STEP : STEP
    let delta = 0
    if (position.value === 'bottom') {
      if (event.key === 'ArrowUp') delta = step
      else if (event.key === 'ArrowDown') delta = -step
    } else {
      const grow = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      const shrink = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      if (event.key === grow) delta = step
      else if (event.key === shrink) delta = -step
    }
    if (event.key === 'Home') {
      event.preventDefault()
      splitSize.value = minSize.value
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      splitSize.value = maxSize.value
      return
    }
    if (!delta) return
    event.preventDefault()
    splitSize.value = clamp(size.value + delta)
  }

  const resizing = ref(false)
  let stopDrag: (() => void) | null = null

  const startResize = (event: globalThis.PointerEvent) => {
    const side = position.value === 'side'
    const origin = side ? event.clientX : event.clientY
    const start = size.value
    resizing.value = true
    separatorRef.value?.setPointerCapture?.(event.pointerId)
    globalThis.document.body.style.userSelect = 'none'

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const physical = (side ? moveEvent.clientX : moveEvent.clientY) - origin
      const delta = side && dir.value === 'rtl' ? physical : -physical
      splitSize.value = clamp(start + delta)
    }

    stopDrag = () => {
      resizing.value = false
      globalThis.document.body.style.removeProperty('user-select')
      globalThis.window.removeEventListener('pointermove', onMove)
      globalThis.window.removeEventListener('pointerup', stopDrag as () => void)
      globalThis.window.removeEventListener('pointercancel', stopDrag as () => void)
      stopDrag = null
    }

    globalThis.window.addEventListener('pointermove', onMove)
    globalThis.window.addEventListener('pointerup', stopDrag)
    globalThis.window.addEventListener('pointercancel', stopDrag)
    event.preventDefault()
  }

  onScopeDispose(() => stopDrag?.())

  interface Stored {
    navigationOpen?: boolean
    toolsOpen?: boolean
    splitPanelPosition?: AppLayoutSplitPanelPosition
    splitPanelSize?: number
  }

  const readStored = (): Stored | null => {
    if (!props.storageKey) return null
    try {
      const raw = globalThis.localStorage?.getItem(props.storageKey)
      return raw ? (JSON.parse(raw) as Stored) : null
    } catch {
      return null
    }
  }

  onMounted(() => {
    const stored = readStored()
    if (!stored) return
    if (typeof stored.navigationOpen === 'boolean') navigationOpen.value = stored.navigationOpen
    if (typeof stored.toolsOpen === 'boolean') toolsOpen.value = stored.toolsOpen
    if (stored.splitPanelPosition === 'bottom' || stored.splitPanelPosition === 'side')
      splitPosition.value = stored.splitPanelPosition
    if (typeof stored.splitPanelSize === 'number' && Number.isFinite(stored.splitPanelSize))
      splitSize.value = stored.splitPanelSize
  })

  watch(
    () => [navigationOpen.value, toolsOpen.value, splitPosition.value, splitSize.value],
    () => {
      if (!props.storageKey) return
      try {
        globalThis.localStorage?.setItem(
          props.storageKey,
          JSON.stringify({
            navigationOpen: navigationOpen.value,
            toolsOpen: toolsOpen.value,
            splitPanelPosition: splitPosition.value,
            splitPanelSize: splitSize.value
          } satisfies Stored)
        )
      } catch {
        return
      }
    }
  )

  const toolsTitleId = `${uid}-tools-title`
  const splitTitleId = `${uid}-split-title`
  const splitId = `${uid}-split`
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    :data-testid="testId"
    :data-compact="compact || null"
    :data-navigation="showNavigation() ? 'open' : 'closed'"
    :data-tools="toolsOpen && hasTools() ? 'open' : 'closed'"
    :data-split-panel="showSplit() ? 'open' : 'closed'"
    :data-split-panel-position="position"
    class="@container/app-layout relative flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-(--bg-canvas)"
  >
    <div
      v-if="showNavigation()"
      :data-testid="`${testId}__navigation`"
      class="flex h-full min-h-0 shrink-0"
    >
      <slot
        name="navigation"
        :drawer="false"
        :close-navigation="closeNavigation"
      />
    </div>

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <slot
        name="header"
        :compact="compact"
        :open-navigation="openNavigation"
        :toggle-navigation="toggleNavigation"
        :toggle-tools="toggleTools"
      />

      <div
        ref="rowRef"
        class="flex min-h-0 min-w-0 flex-1"
      >
        <div class="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            v-if="$slots['notifications']"
            :data-testid="`${testId}__notifications`"
            class="flex shrink-0 flex-col gap-(--spacing-xs) px-(--spacing-md) pt-(--spacing-md) empty:hidden"
          >
            <slot name="notifications" />
          </div>
          <div
            :data-testid="`${testId}__content`"
            class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto"
          >
            <div
              v-if="$slots['breadcrumbs']"
              :data-testid="`${testId}__breadcrumbs`"
              class="shrink-0 px-(--spacing-md) pt-(--spacing-md)"
            >
              <slot name="breadcrumbs" />
            </div>
            <div
              :data-testid="`${testId}__body`"
              class="min-w-0 flex-1"
            >
              <slot />
            </div>
          </div>

          <section
            v-if="showSplit() && position === 'bottom'"
            :id="splitId"
            :aria-labelledby="splitTitleId"
            :data-testid="`${testId}__split-panel`"
            class="relative flex min-h-0 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
            :style="{ height: `${size}px` }"
          >
            <div
              ref="separatorRef"
              role="separator"
              tabindex="0"
              aria-orientation="horizontal"
              :aria-label="t('appLayout.resizeSplitPanel')"
              :aria-controls="splitId"
              :aria-valuenow="size"
              :aria-valuemin="minSize"
              :aria-valuemax="maxSize"
              :data-testid="`${testId}__split-separator`"
              :data-resizing="resizing || null"
              class="absolute inset-x-0 top-0 z-10 h-(--spacing-xxs) cursor-row-resize bg-transparent outline-none transition-colors duration-fast-02 ease-productive-entrance before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] hover:bg-(--border-strong) focus-visible:bg-(--accent) data-[resizing]:bg-(--accent) motion-reduce:transition-none"
              @pointerdown="startResize"
              @keydown="nudge"
            />
            <div
              class="flex h-(--spacing-xxl) shrink-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md)"
            >
              <h2
                :id="splitTitleId"
                class="m-0 min-w-0 flex-1 truncate text-heading-xxs text-(--text-default)"
              >
                {{ splitPanelTitle || t('appLayout.splitPanel') }}
              </h2>
              <IconButton
                v-if="!compact"
                icon="pi pi-window-maximize"
                :ariaLabel="t('appLayout.showAtSide')"
                kind="transparent"
                size="small"
                :data-testid="`${testId}__split-position`"
                @click="togglePosition"
              />
              <IconButton
                icon="pi pi-times"
                :ariaLabel="t('appLayout.closeSplitPanel')"
                kind="transparent"
                size="small"
                :data-testid="`${testId}__split-close`"
                @click="splitOpen = false"
              />
            </div>
            <div
              tabindex="0"
              role="group"
              :aria-labelledby="splitTitleId"
              class="min-h-0 flex-1 overflow-auto p-(--spacing-md) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            >
              <slot name="split-panel" />
            </div>
          </section>
        </div>

        <section
          v-if="showSplit() && position === 'side'"
          :id="splitId"
          :aria-labelledby="splitTitleId"
          :data-testid="`${testId}__split-panel`"
          class="relative flex h-full min-h-0 shrink-0 flex-col border-s border-(--border-default) bg-(--bg-surface)"
          :style="{ width: `${size}px` }"
        >
          <div
            ref="separatorRef"
            role="separator"
            tabindex="0"
            aria-orientation="vertical"
            :aria-label="t('appLayout.resizeSplitPanel')"
            :aria-controls="splitId"
            :aria-valuenow="size"
            :aria-valuemin="minSize"
            :aria-valuemax="maxSize"
            :data-testid="`${testId}__split-separator`"
            :data-resizing="resizing || null"
            class="absolute inset-y-0 start-0 z-10 w-(--spacing-xxs) cursor-col-resize bg-transparent outline-none transition-colors duration-fast-02 ease-productive-entrance before:absolute before:inset-y-0 before:-inset-x-2 before:content-[''] hover:bg-(--border-strong) focus-visible:bg-(--accent) data-[resizing]:bg-(--accent) motion-reduce:transition-none"
            @pointerdown="startResize"
            @keydown="nudge"
          />
          <div
            class="flex h-(--spacing-xxl) shrink-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md)"
          >
            <h2
              :id="splitTitleId"
              class="m-0 min-w-0 flex-1 truncate text-heading-xxs text-(--text-default)"
            >
              {{ splitPanelTitle || t('appLayout.splitPanel') }}
            </h2>
            <IconButton
              icon="pi pi-window-minimize"
              :ariaLabel="t('appLayout.showAtBottom')"
              kind="transparent"
              size="small"
              :data-testid="`${testId}__split-position`"
              @click="togglePosition"
            />
            <IconButton
              icon="pi pi-times"
              :ariaLabel="t('appLayout.closeSplitPanel')"
              kind="transparent"
              size="small"
              :data-testid="`${testId}__split-close`"
              @click="splitOpen = false"
            />
          </div>
          <div
            tabindex="0"
            role="group"
            :aria-labelledby="splitTitleId"
            class="min-h-0 flex-1 overflow-auto p-(--spacing-md) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
          >
            <slot name="split-panel" />
          </div>
        </section>

        <section
          v-if="showTools()"
          :aria-labelledby="toolsTitleId"
          :data-testid="`${testId}__tools`"
          class="flex h-full min-h-0 shrink-0 flex-col border-s border-(--border-default) bg-(--bg-surface)"
          :style="{ width: `${toolsWidth}px` }"
        >
          <div
            class="flex h-(--spacing-xxl) shrink-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md)"
          >
            <h2
              :id="toolsTitleId"
              class="m-0 min-w-0 flex-1 truncate text-heading-xxs text-(--text-default)"
            >
              {{ toolsLabel || t('appLayout.tools') }}
            </h2>
            <IconButton
              icon="pi pi-times"
              :ariaLabel="t('appLayout.closeTools')"
              kind="transparent"
              size="small"
              :data-testid="`${testId}__tools-close`"
              @click="toolsOpen = false"
            />
          </div>
          <div
            tabindex="0"
            role="group"
            :aria-labelledby="toolsTitleId"
            class="min-h-0 flex-1 overflow-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
          >
            <slot name="tools" />
          </div>
        </section>
      </div>
    </div>

    <Drawer
      v-if="hasNavigation() && compact"
      key="navigation-drawer"
      v-model:open="navDrawerOpen"
      side="right"
      size="small"
      :data-testid="`${testId}__navigation-drawer`"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerTitle class="sr-only">
            {{ navigationLabel || t('appLayout.navigation') }}
          </DrawerTitle>
          <slot
            name="navigation"
            :drawer="true"
            :close-navigation="closeNavigation"
          />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Drawer
      v-if="hasTools() && compact"
      key="tools-drawer"
      v-model:open="toolsDrawerOpen"
      side="right"
      size="small"
      :data-testid="`${testId}__tools-drawer`"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerTitle>
            {{ toolsLabel || t('appLayout.tools') }}
          </DrawerTitle>
          <slot name="tools" />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
