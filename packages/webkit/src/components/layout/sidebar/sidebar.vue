<script setup lang="ts">
  import {
    computed,
    markRaw,
    onMounted,
    onScopeDispose,
    provide,
    ref,
    useAttrs,
    useSlots
  } from 'vue'

  import { logicalArrowKey } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import ScrollArea from '../scroll-area/scroll-area.vue'
  import {
    SIDEBAR_ICON_RAIL_TOKEN,
    SIDEBAR_NUDGE_STEP,
    useSidebarRail
  } from './composables/use-sidebar-rail'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'Sidebar',
    inheritAttrs: false
  })

  /** How a collapsed sidebar leaves the layout: entirely, or down to an icon rail. */
  export type SidebarCollapsible = 'offcanvas' | 'icon'

  interface Props {
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

  const props = withDefaults(defineProps<Props>(), {
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-sidebar')

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

  const railPlacement = computed(() => (dir.value === 'rtl' ? 'left' : 'right'))

  provide(SidebarInjectionKey, {
    testId: testId.value,
    get collapsible() {
      return collapseMode.value !== null
    },
    get rail() {
      return rail.value
    },
    tooltip: markRaw(Tooltip),
    get tooltipPlacement() {
      return railPlacement.value
    },
    expand: () => {
      collapsed.value = false
    }
  })

  const isEditable = (target: EventTarget | null) => {
    if (!(target instanceof globalThis.HTMLElement)) return false
    if (target.isContentEditable) return true
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  }

  const shortcutActive = computed(() => props.shortcut && collapseMode.value !== null)

  const onShortcut = (event: globalThis.KeyboardEvent) => {
    if (!shortcutActive.value || event.defaultPrevented) return
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
    if (event.key.toLowerCase() !== 'b' || isEditable(event.target)) return
    event.preventDefault()
    collapsed.value = !collapsed.value
  }

  onMounted(() => globalThis.document.addEventListener('keydown', onShortcut))

  onScopeDispose(() => globalThis.document?.removeEventListener('keydown', onShortcut))

  const keyShortcuts = computed(() => (shortcutActive.value ? 'Control+B Meta+B' : undefined))

  const onHandleKey = (event: globalThis.KeyboardEvent, expandOnly = false) => {
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') nudge(SIDEBAR_NUDGE_STEP)
    else if (key === 'ArrowLeft' && !expandOnly) nudge(-SIDEBAR_NUDGE_STEP)
    else return
    event.preventDefault()
  }

  defineExpose({ measure })

  const isCollapsed = computed(() => collapsed.value && railEnabled.value && !resizing.value)

  const isOut = computed(() => isCollapsed.value && !iconMode.value)

  const hydrated = ref(false)

  const settled = ref(false)

  onMounted(() => {
    hydrated.value = true
    const raf = globalThis.requestAnimationFrame
    if (typeof raf !== 'function') {
      settled.value = true
      return
    }
    raf(() =>
      raf(() => {
        settled.value = true
      })
    )
  })

  const setRailEl = (el: unknown) => {
    railEl.value = (el as globalThis.HTMLElement | null) ?? null
  }

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

  const RAIL_MOTION_CLASS =
    'transition-[width,min-width] duration-moderate-02 ease-expressive-entrance has-[>div>input:checked]:ease-productive-exit data-[resizing]:transition-none not-data-[settled]:transition-none motion-reduce:transition-none'

  const rootClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'border-e border-(--border-muted) bg-(--bg-surface)',
      railEnabled.value
        ? cn(
            'relative shrink-0 overflow-hidden',
            iconMode.value
              ? 'w-(--sidebar-width) has-[>div>input:checked]:w-(--sidebar-rail-width) min-w-(--sidebar-min-width) has-[>div>input:checked]:min-w-(--sidebar-rail-width)'
              : 'data-[collapsed]:border-e-0 has-[>div>input:checked]:border-e-0 w-(--sidebar-width) has-[>div>input:checked]:w-0 min-w-(--sidebar-min-width) has-[>div>input:checked]:min-w-0',
            'data-[resizing]:min-w-0 max-w-(--sidebar-max-width)',
            RAIL_MOTION_CLASS,
            props.resizable ? 'resize-x data-[hydrated]:resize-none' : undefined
          )
        : undefined,
      attrs.class
    )
  )

  const NAV_CLASS =
    'flex h-full min-h-0 flex-1 flex-col [--menu-item-ring-offset:var(--bg-surface)] [--menu-ring-offset:var(--bg-surface)]'

  const headerRegionClass = computed(() =>
    cn(
      'w-full shrink-0 p-(--spacing-md)',
      rail.value ? 'overflow-hidden px-(--spacing-xs)' : undefined
    )
  )

  const INNER_MOTION_CLASS =
    'transition-[translate,opacity] duration-moderate-02 ease-expressive-entrance has-[>input:checked]:ease-productive-exit data-[resizing]:transition-none not-data-[settled]:transition-none motion-reduce:transition-none motion-reduce:translate-none'

  const innerClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full flex-col',
      iconMode.value
        ? 'w-[calc(var(--sidebar-width)-1px)] has-[>input:checked]:w-[calc(var(--sidebar-rail-width)-1px)]'
        : cn(
            'w-[calc(var(--sidebar-width)-1px)] translate-x-0 has-[>input:checked]:-translate-x-full rtl:has-[>input:checked]:translate-x-full opacity-100 has-[>input:checked]:opacity-20',
            INNER_MOTION_CLASS
          )
    )
  )

  const footerRegionClass = computed(() =>
    collapseMode.value !== null
      ? 'w-full shrink-0'
      : 'w-full shrink-0 px-(--spacing-md) pb-(--spacing-md)'
  )

  const footerBandClass = () => {
    if (collapseMode.value === null) return undefined
    if (rail.value) {
      return 'flex flex-col items-center gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-xs) py-(--spacing-sm)'
    }
    return cn(
      'flex h-14 items-center gap-(--spacing-xs)',
      'border-t border-(--border-muted) px-(--spacing-md)',
      !slots['footer'] ? 'justify-end' : undefined
    )
  }

  const footerSlotClass = () => {
    if (collapseMode.value === null) return undefined
    return rail.value ? 'flex min-w-0 justify-center' : 'min-w-0 flex-1'
  }

  const scrollClass = () =>
    cn(
      'flex min-h-0 flex-1 flex-col gap-(--spacing-md) p-(--spacing-md)',
      'scroll-py-(--spacing-xxs)',
      slots['header'] ? 'pt-(--spacing-xxs)' : undefined,
      rail.value ? 'px-(--spacing-xs)' : undefined
    )
</script>

<template>
  <aside
    :ref="setRailEl"
    v-bind="$attrs"
    :class="rootClass"
    :style="asideStyle"
    :aria-label="labels.root"
    :data-testid="testId"
    :data-collapsed="isCollapsed ? '' : undefined"
    :data-rail="rail ? '' : undefined"
    :data-resizing="resizing ? '' : undefined"
    :data-hydrated="hydrated ? '' : undefined"
    :data-settled="settled ? '' : undefined"
    :inert="isOut ? true : undefined"
    :aria-hidden="isOut ? 'true' : undefined"
  >
    <div
      :class="innerClass"
      :style="innerStyle"
      :data-resizing="resizing ? '' : undefined"
      :data-settled="settled ? '' : undefined"
      :data-testid="`${testId}__panel`"
    >
      <input
        v-if="railEnabled"
        v-model="collapsed"
        type="checkbox"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        :data-testid="`${testId}__collapse-input`"
      />
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
            :text="rail ? labels.expand : labels.collapse"
            :placement="rail ? railPlacement : 'top'"
          >
            <IconButton
              :icon="rail ? 'ai ai-angle-double-right' : 'ai ai-angle-double-left'"
              :ariaLabel="rail ? labels.expand : labels.collapse"
              :aria-keyshortcuts="keyShortcuts"
              kind="outlined"
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
      :data-testid="`${testId}__handle`"
      class="group absolute inset-y-0 end-0 z-10 w-(--spacing-xs) cursor-col-resize touch-none outline-none"
      @pointerdown="startResize"
      @keydown="onHandleKey($event)"
      @dblclick="collapsed = true"
    >
      <span
        class="pointer-events-none absolute inset-y-0 end-0 w-(--border-2) bg-(--accent) opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[preview]:opacity-100 group-data-[resizing]:opacity-100 motion-reduce:transition-none"
      />
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
      class="group absolute inset-y-0 start-0 z-20 w-(--size-6) hover:w-(--size-10) focus-within:w-(--size-10) transition-[width] duration-moderate-02 ease-expressive-exit hover:ease-expressive-entrance focus-within:ease-expressive-entrance motion-reduce:transition-none"
      @pointerenter="startPreview"
      @pointerleave="endPreview"
      @focusin="startPreview"
      @focusout="endPreview"
    >
      <div
        v-if="resizable"
        role="separator"
        aria-orientation="vertical"
        :aria-label="t('sidebar.expandByDragging', { label: labels.expand })"
        tabindex="0"
        :aria-valuenow="valueNow"
        :aria-valuemin="valueMin"
        :aria-valuemax="valueMax"
        class="absolute inset-y-0 start-0 w-full cursor-col-resize touch-none outline-none"
        @pointerdown="startResize"
        @click="tapToExpand"
        @keydown="onHandleKey($event, true)"
      />

      <div
        class="pointer-events-none absolute start-full top-1/2 -translate-y-1/2 translate-x-[calc(-1_*_var(--size-10))] rtl:translate-x-(--size-10) ps-(--spacing-xxs) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-expressive-exit group-hover:translate-x-0 rtl:group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:ease-expressive-entrance group-focus-within:translate-x-0 rtl:group-focus-within:translate-x-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:ease-expressive-entrance motion-reduce:transition-none motion-reduce:translate-none"
      >
        <Tooltip
          :text="labels.expand"
          :placement="dir === 'rtl' ? 'left' : 'right'"
        >
          <IconButton
            icon="ai ai-angle-double-right"
            :ariaLabel="labels.expand"
            kind="outlined"
            size="medium"
            :data-testid="`${testId}__expand-button`"
            @click="collapsed = false"
          />
        </Tooltip>
      </div>
    </div>
  </Transition>
</template>
