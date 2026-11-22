<script setup lang="ts">
  import { computed, markRaw, onMounted, provide, ref, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import ScrollArea from '../scroll-area/scroll-area.vue'
  import { useSidebarKeys } from './composables/use-sidebar-keys'
  import { SIDEBAR_ICON_RAIL_TOKEN, useSidebarRail } from './composables/use-sidebar-rail'
  import { SidebarInjectionKey } from './injection-key'
  import {
    EXPAND_CLASS,
    EXPAND_HINT_CLASS,
    INNER_MOTION_CLASS,
    NAV_CLASS,
    RAIL_MOTION_CLASS,
    RESIZE_INDICATOR_CLASS,
    sidebarFooterBandClass,
    sidebarFooterSlotClass,
    sidebarScrollClass
  } from './lib/sidebar-classes'

  defineOptions({
    name: 'Sidebar',
    inheritAttrs: false
  })

  /** How a collapsed sidebar leaves the layout: entirely, or down to an icon rail. */
  export type SidebarCollapsible = 'offcanvas' | 'icon'

  export interface SidebarProps {
    ariaLabel?: string
    resizable?: boolean
    /** Adds the collapse trigger; true or offcanvas takes a collapsed sidebar out of the layout, icon keeps an icon rail. */
    collapsible?: boolean | SidebarCollapsible
    /** Lets Cmd+B or Ctrl+B toggle the collapsed state while the sidebar is collapsible. */
    shortcut?: boolean
    minWidthToken?: string
    maxWidthToken?: string
    collapseAriaLabel?: string
    expandAriaLabel?: string
    resizeAriaLabel?: string
  }

  const props = withDefaults(defineProps<SidebarProps>(), {
    ariaLabel: '',
    resizable: false,
    collapsible: false,
    shortcut: false,
    minWidthToken: '--container-3xs',
    maxWidthToken: '--container-sm',
    collapseAriaLabel: '',
    expandAriaLabel: '',
    resizeAriaLabel: ''
  })

  /** Whether the rail is in the layout; false collapses it. Use with `v-model:open`. */
  const open = defineModel<boolean>('open', { default: true })

  /** The sized width in px; null until the rail measures itself. Use with `v-model:width`. */
  const width = defineModel<number | null>('width', { default: null })

  defineSlots<{
    default(props: { rail: boolean }): unknown
    header(props: { rail: boolean }): unknown
    footer(props: { rail: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ sidebar: en.sidebar })
  const labels = computed(() => ({
    root: props.ariaLabel || t('sidebar.label'),
    collapse: props.collapseAriaLabel || t('sidebar.collapse'),
    expand: props.expandAriaLabel || t('sidebar.expand'),
    resize: props.resizeAriaLabel || t('sidebar.resize')
  }))
  const slots = useSlots()

  const collapsed = computed<boolean>({
    get: () => !open.value,
    set: (value) => {
      open.value = !value
    }
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'sidebar')

  const collapseMode = computed<SidebarCollapsible | null>(() => {
    if (props.collapsible === 'icon') return 'icon'
    return props.collapsible ? 'offcanvas' : null
  })

  const iconMode = computed(() => collapseMode.value === 'icon')

  const railEnabled = computed(() => props.resizable || collapseMode.value !== null)

  const {
    railEl,
    resizing,
    previewing,
    startPreview,
    endPreview,
    valueNow,
    valueMin,
    valueMax,
    railStyle,
    innerStyle,
    startResize,
    tapToExpand,
    nudge,
    measure,
    dir
  } = useSidebarRail({
    collapsed,
    width,
    minWidthToken: () => props.minWidthToken,
    maxWidthToken: () => props.maxWidthToken,
    enabled: railEnabled,
    collapsedWidthToken: () => (iconMode.value ? SIDEBAR_ICON_RAIL_TOKEN : '')
  })

  const rail = computed(() => iconMode.value && collapsed.value)

  provide(SidebarInjectionKey, {
    testId: testId.value,
    get collapsible() {
      return collapseMode.value !== null
    },
    get rail() {
      return rail.value
    },
    tooltip: markRaw(Tooltip),
    expand: () => {
      collapsed.value = false
    }
  })

  const handleEl = ref<globalThis.HTMLElement | null>(null)
  const expandHandleEl = ref<globalThis.HTMLElement | null>(null)
  const keyShortcuts = useSidebarKeys(
    handleEl,
    expandHandleEl,
    () => props.shortcut && collapseMode.value !== null,
    collapsed,
    dir,
    nudge,
    tapToExpand
  )

  defineExpose({ measure })

  const isCollapsed = computed(() => collapsed.value && railEnabled.value && !resizing.value)

  const panelState = computed(() => {
    if (!railEnabled.value) return undefined
    return collapsed.value ? 'closed' : 'open'
  })

  const isOut = computed(() => isCollapsed.value && !iconMode.value)

  const hydrated = ref(false)

  const settled = ref(false)

  const settle = () => {
    settled.value = true
  }

  onMounted(() => {
    hydrated.value = true
    const raf = globalThis.requestAnimationFrame
    if (typeof raf === 'function') raf(() => raf(settle))
    else settle()
  })

  const setRailEl = (el: unknown) => (railEl.value = (el as globalThis.HTMLElement | null) ?? null)

  const cssVars = computed(() => {
    if (!railEnabled.value) return {}
    return {
      '--sidebar-width': width.value == null ? undefined : `${width.value}px`,
      '--sidebar-min-width': `var(${props.minWidthToken})`,
      '--sidebar-max-width': `var(${props.maxWidthToken})`,
      '--sidebar-rail-width': iconMode.value ? `var(${SIDEBAR_ICON_RAIL_TOKEN})` : undefined
    }
  })

  const asideStyle = computed(() => ({ ...cssVars.value, ...railStyle.value }))

  const rootClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'border-e border-(--border-muted) bg-(--bg-surface)',
      railEnabled.value
        ? cn(
            'relative shrink-0 overflow-hidden',
            iconMode.value
              ? 'w-(--sidebar-width) has-[>div[data-state=closed]]:w-(--sidebar-rail-width) min-w-(--sidebar-min-width) has-[>div[data-state=closed]]:min-w-(--sidebar-rail-width)'
              : 'data-[state=closed]:border-e-0 has-[>div[data-state=closed]]:border-e-0 w-(--sidebar-width) ' +
                  'has-[>div[data-state=closed]]:w-0 min-w-(--sidebar-min-width) has-[>div[data-state=closed]]:min-w-0',
            'data-[resizing]:min-w-0 max-w-(--sidebar-max-width)',
            RAIL_MOTION_CLASS,
            props.resizable ? 'resize-x data-[hydrated]:resize-none' : undefined
          )
        : undefined,
      attrs.class
    )
  )

  const headerRegionClass = computed(() =>
    cn(
      'w-full shrink-0 p-(--spacing-md)',
      rail.value ? 'overflow-hidden px-(--spacing-xs)' : undefined
    )
  )

  const innerClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full flex-col',
      iconMode.value
        ? 'w-[calc(var(--sidebar-width)-1px)] data-[state=closed]:w-[calc(var(--sidebar-rail-width)-1px)]'
        : cn(
            'w-[calc(var(--sidebar-width)-1px)] translate-x-0 data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full opacity-100 data-[state=closed]:opacity-20',
            INNER_MOTION_CLASS
          )
    )
  )

  const footerRegionClass = computed(() =>
    collapseMode.value !== null
      ? 'w-full shrink-0'
      : 'w-full shrink-0 px-(--spacing-md) pb-(--spacing-md)'
  )

  const footerBandClass = () =>
    sidebarFooterBandClass(collapseMode.value !== null, rail.value, Boolean(slots['footer']))

  const footerSlotClass = () => sidebarFooterSlotClass(collapseMode.value !== null, rail.value)

  const scrollClass = () => sidebarScrollClass(Boolean(slots['header']), rail.value)
</script>

<template>
  <aside
    :ref="setRailEl"
    v-bind="$attrs"
    :class="rootClass"
    :style="asideStyle"
    :aria-label="labels.root"
    :data-testid="testId"
    :data-state="isCollapsed ? 'closed' : 'open'"
    :data-rail="rail ? '' : undefined"
    :data-resizing="resizing ? '' : undefined"
    :data-hydrated="hydrated ? '' : undefined"
    :data-settled="settled ? '' : undefined"
    :inert="isOut ? true : undefined"
  >
    <div
      :class="innerClass"
      :style="innerStyle"
      :data-resizing="resizing ? '' : undefined"
      :data-settled="settled ? '' : undefined"
      :data-state="panelState"
      :data-testid="`${testId}__panel`"
    >
      <div
        v-if="$slots['header']"
        :class="headerRegionClass"
        :data-testid="`${testId}__header`"
      >
        <slot
          name="header"
          :rail="rail"
        />
      </div>
      <nav
        :class="NAV_CLASS"
        :data-testid="`${testId}__nav`"
      >
        <ScrollArea
          :class="scrollClass()"
          tabindex="-1"
          fade
          :data-testid="`${testId}__scroll`"
        >
          <slot :rail="rail" />
        </ScrollArea>
      </nav>
      <div
        v-if="$slots['footer'] || collapseMode !== null"
        :class="footerRegionClass"
        :data-testid="`${testId}__footer`"
      >
        <div :class="footerBandClass()">
          <div
            v-if="$slots['footer']"
            :class="footerSlotClass()"
          >
            <slot
              name="footer"
              :rail="rail"
            />
          </div>
          <Tooltip
            v-if="collapseMode !== null"
            :content="rail ? labels.expand : labels.collapse"
            :side="rail ? 'end' : 'top'"
          >
            <IconButton
              :icon="rail ? 'az az-chevrons-right' : 'az az-chevrons-left'"
              :ariaLabel="rail ? labels.expand : labels.collapse"
              :aria-keyshortcuts="keyShortcuts"
              variant="outline"
              size="small"
              :data-testid="`${testId}__${rail ? 'expand-button' : 'collapse'}`"
              @click="collapsed = !rail"
            />
          </Tooltip>
        </div>
      </div>
    </div>

    <div
      v-if="resizable"
      role="separator"
      aria-orientation="vertical"
      :aria-label="labels.resize"
      tabindex="0"
      :aria-valuenow="valueNow"
      :aria-valuemin="valueMin"
      :aria-valuemax="valueMax"
      :data-resizing="resizing ? '' : undefined"
      :data-preview="previewing ? '' : undefined"
      ref="handleEl"
      :data-testid="`${testId}__handle`"
      class="group absolute inset-y-0 end-0 z-10 w-(--spacing-xs) cursor-col-resize touch-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
      @pointerdown="startResize"
    >
      <span :class="RESIZE_INDICATOR_CLASS" />
    </div>
  </aside>

  <Transition
    enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    leave-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="collapseMode === 'offcanvas' && collapsed"
      :data-resizing="resizing ? '' : undefined"
      :data-preview="previewing ? '' : undefined"
      :data-testid="`${testId}__expand`"
      :class="EXPAND_CLASS"
      @pointerenter="startPreview"
      @pointerleave="endPreview"
      @focusin="startPreview"
      @focusout="endPreview"
    >
      <div
        v-if="resizable"
        role="separator"
        aria-orientation="vertical"
        ref="expandHandleEl"
        :aria-label="t('sidebar.expandByDragging', { label: labels.expand })"
        tabindex="0"
        :aria-valuenow="valueNow"
        :aria-valuemin="valueMin"
        :aria-valuemax="valueMax"
        class="absolute inset-y-0 start-0 w-full cursor-col-resize touch-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
        @pointerdown="startResize"
      />

      <div :class="EXPAND_HINT_CLASS">
        <Tooltip
          :content="labels.expand"
          side="end"
        >
          <IconButton
            icon="az az-chevrons-right"
            :ariaLabel="labels.expand"
            variant="outline"
            size="medium"
            :data-testid="`${testId}__expand-button`"
            @click="collapsed = false"
          />
        </Tooltip>
      </div>
    </div>
  </Transition>
</template>
