<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useDirection } from '../../../composables/use-direction'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { usePointerDrag } from '../../../composables/use-pointer-drag'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import SkipLink from '../../navigation/skip-link/skip-link.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'
  import { useAppLayoutStorage } from './composables/use-app-layout-storage'
  import AppLayoutSplitPanel from './parts/app-layout-split-panel.vue'

  defineOptions({
    name: 'AppLayout',
    inheritAttrs: false
  })

  /** Where the split panel sits relative to the content. */
  export type AppLayoutSplitPanelPosition = 'bottom' | 'side'

  export interface AppLayoutProps {
    /** Accessible name of the navigation drawer. Empty uses the locale catalog (`Navigation`). */
    navigationAriaLabel?: string
    /** Title of the tools region, shown in its header. Empty uses the locale catalog (`Help`). */
    toolsLabel?: string
    /** Width of the tools region in pixels while not compact. */
    toolsWidth?: number
    /** Title of the split panel, shown in its header. Empty uses the locale catalog (`Details`). */
    splitPanelTitle?: string
    /** When set, the split panel size and position and the navigation and tools open state are kept in `localStorage` under it. */
    storageKey?: string
    /** Width of the layout itself, in pixels, under which navigation and tools become drawers and the split panel moves down. */
    compactBelow?: number
  }

  const props = withDefaults(defineProps<AppLayoutProps>(), {
    navigationAriaLabel: '',
    toolsLabel: '',
    toolsWidth: 320,
    splitPanelTitle: '',
    storageKey: '',
    compactBelow: 768
  })

  /** Whether the navigation region shows beside the content. Use with `v-model:navigation-open`. Not used while compact. */
  const navigationOpen = defineModel<boolean>('navigationOpen', { default: true })

  /** Whether the tools region (help) is open; while compact it drives the tools drawer. Use with `v-model:tools-open`. */
  const toolsOpen = defineModel<boolean>('toolsOpen', { default: false })

  /** Whether the split panel is open. Use with `v-model:split-panel-open`. */
  const splitOpen = defineModel<boolean>('splitPanelOpen', { default: false })

  /** Where the split panel sits: under the content or beside it. Use with `v-model:split-panel-position`. Bottom while compact. */
  const splitPosition = defineModel<AppLayoutSplitPanelPosition>('splitPanelPosition', {
    default: 'bottom'
  })

  /** Height (bottom) or width (side) of the split panel in pixels. Use with `v-model:split-panel-size`. */
  const splitSize = defineModel<number>('splitPanelSize', { default: 320 })

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
    () => (attrs['data-testid'] as string | undefined) ?? 'app-layout'
  )

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const rowEl = ref<globalThis.HTMLElement | null>(null)
  const separatorEl = ref<globalThis.HTMLElement | null>(null)
  const setSeparatorEl = (el: unknown) => {
    separatorEl.value = el instanceof globalThis.HTMLElement ? el : null
  }
  const dir = useDirection(rootEl)

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

  useResizeObserver(rootEl, (entries) => {
    const rect = entries[0]?.contentRect
    measure(() => {
      width.value = rect?.width ?? 0
      height.value = rect?.height ?? 0
    })
  })
  useResizeObserver(rowEl, (entries) => {
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

  useElementListener(separatorEl, 'keydown', nudge)

  const { dragging: resizing, startDrag } = usePointerDrag()

  const startResize = (event: globalThis.PointerEvent) => {
    const side = position.value === 'side'
    const origin = side ? event.clientX : event.clientY
    const start = size.value

    startDrag(event, {
      captureEl: separatorEl.value,
      onMove: (moveEvent) => {
        const physical = (side ? moveEvent.clientX : moveEvent.clientY) - origin
        const delta = side && dir.value === 'rtl' ? physical : -physical
        splitSize.value = clamp(start + delta)
      }
    })
  }

  onMounted(() => {
    width.value = rootEl.value?.offsetWidth ?? 0
  })

  useAppLayoutStorage(() => props.storageKey, navigationOpen, toolsOpen, splitPosition, splitSize)

  const toolsTitleId = `${uid}-tools-title`
  const splitTitleId = `${uid}-split-title`
  const splitId = `${uid}-split`
  const contentId = `${uid}-content`

  const splitPanelProps = computed(() => ({
    size: size.value,
    minSize: minSize.value,
    maxSize: maxSize.value,
    resizing: resizing.value,
    compact: compact.value,
    title: props.splitPanelTitle,
    panelId: splitId,
    titleId: splitTitleId,
    layoutTestId: testId.value,
    separatorRef: setSeparatorEl
  }))
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    :data-compact="compact || null"
    :data-navigation="showNavigation() ? 'open' : 'closed'"
    :data-tools="toolsOpen && hasTools() ? 'open' : 'closed'"
    :data-split-panel="showSplit() ? 'open' : 'closed'"
    :data-split-panel-position="position"
    class="@container/app-layout relative flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-(--bg-canvas)"
  >
    <SkipLink
      :href="`#${contentId}`"
      :data-testid="`${testId}__skip-link`"
    />
    <div
      v-if="showNavigation()"
      :data-testid="`${testId}__navigation`"
      :data-compact-below="compactBelow"
      class="flex h-full min-h-0 shrink-0 data-[compact-below=768]:@max-3xl/app-layout:hidden"
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
        ref="rowEl"
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
            :id="contentId"
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

          <AppLayoutSplitPanel
            v-if="showSplit() && position === 'bottom'"
            v-bind="splitPanelProps"
            :side="false"
            @resize="startResize"
            @toggle-position="togglePosition"
            @close="splitOpen = false"
          >
            <slot name="split-panel" />
          </AppLayoutSplitPanel>
        </div>

        <AppLayoutSplitPanel
          v-if="showSplit() && position === 'side'"
          v-bind="splitPanelProps"
          side
          @resize="startResize"
          @toggle-position="togglePosition"
          @close="splitOpen = false"
        >
          <slot name="split-panel" />
        </AppLayoutSplitPanel>

        <section
          v-if="showTools()"
          :aria-labelledby="toolsTitleId"
          :data-testid="`${testId}__tools`"
          :data-compact-below="compactBelow"
          class="flex h-full min-h-0 shrink-0 flex-col border-s border-(--border-default) bg-(--bg-surface) data-[compact-below=768]:@max-3xl/app-layout:hidden"
          :style="{ width: `${toolsWidth}px` }"
        >
          <div
            class="flex h-(--spacing-2xl) shrink-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md)"
          >
            <h2
              :id="toolsTitleId"
              class="m-0 min-w-0 flex-1 truncate text-heading-2xs text-(--text-default)"
            >
              {{ toolsLabel || t('appLayout.tools') }}
            </h2>
            <IconButton
              icon="az az-x"
              :ariaLabel="t('appLayout.closeTools')"
              variant="ghost"
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
      side="end"
      size="small"
      :data-testid="`${testId}__navigation-drawer`"
    >
      <DrawerContent>
        <PanelHeader class="min-h-(--spacing-2xl) py-(--spacing-xs)">
          <DrawerTitle class="sr-only">
            {{ navigationAriaLabel || t('appLayout.navigation') }}
          </DrawerTitle>
        </PanelHeader>
        <slot
          name="navigation"
          :drawer="true"
          :close-navigation="closeNavigation"
        />
      </DrawerContent>
    </Drawer>

    <Drawer
      v-if="hasTools() && compact"
      key="tools-drawer"
      v-model:open="toolsDrawerOpen"
      side="end"
      size="small"
      :data-testid="`${testId}__tools-drawer`"
    >
      <DrawerContent>
        <PanelHeader>
          <DrawerTitle class="min-w-0 truncate">
            {{ toolsLabel || t('appLayout.tools') }}
          </DrawerTitle>
        </PanelHeader>
        <div class="min-h-0 flex-1 overflow-auto">
          <slot name="tools" />
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
