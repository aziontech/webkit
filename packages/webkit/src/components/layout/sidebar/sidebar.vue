<script setup lang="ts">
  import { computed, onMounted, provide, ref, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import ScrollArea from '../scroll-area/scroll-area.vue'
  import { SIDEBAR_NUDGE_STEP, useSidebarRail } from './composables/use-sidebar-rail'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'Sidebar',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the navigation landmark. */
    ariaLabel?: string
    /** Adds the drag handle on the trailing edge; dragging past the minimum collapses the rail. */
    resizable?: boolean
    /** Adds the collapse trigger at the bottom of the rail and the edge affordance that brings a collapsed rail back. */
    collapsible?: boolean
    /** Theme container token the sized width is clamped up to, read off the document at runtime. */
    minWidthToken?: string
    /** Theme container token the sized width is clamped down to, read off the document at runtime. */
    maxWidthToken?: string
    /** Accessible name for the collapse trigger. */
    collapseAriaLabel?: string
    /** Accessible name for the control and the grab bar that bring a collapsed rail back. */
    expandAriaLabel?: string
    /** Accessible name for the drag handle separator. */
    resizeAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: 'Sidebar',
    resizable: false,
    collapsible: false,
    minWidthToken: '--container-3xs',
    maxWidthToken: '--container-sm',
    collapseAriaLabel: 'Collapse sidebar',
    expandAriaLabel: 'Expand sidebar',
    resizeAriaLabel: 'Resize sidebar'
  })

  defineEmits<{
    'update:collapsed': [value: boolean]
    'update:width': [value: number | null]
  }>()

  /** Whether the rail is out of the layout. */
  const collapsed = defineModel<boolean>('collapsed', { default: false })

  /** Sized width in px; `null` until the rail measures itself on mount. */
  const width = defineModel<number | null>('width', { default: null })

  defineSlots<{
    default(): unknown
    header(): unknown
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-sidebar')

  provide(SidebarInjectionKey, {
    testId: testId.value,
    get collapsible() {
      return props.collapsible
    }
  })

  const railEnabled = computed(() => props.resizable || props.collapsible)

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
    measure
  } = useSidebarRail({
    collapsed,
    width,
    minWidthToken: () => props.minWidthToken,
    maxWidthToken: () => props.maxWidthToken,
    enabled: railEnabled
  })

  defineExpose({ measure })

  const isOut = computed(() => collapsed.value && railEnabled.value)

  const hydrated = ref(false)

  onMounted(() => {
    hydrated.value = true
  })

  const setRailEl = (el: unknown) => {
    railEl.value = (el as globalThis.HTMLElement | null) ?? null
  }

  const cssVars = computed(() => {
    if (!railEnabled.value) return {}
    return {
      '--sidebar-width': width.value == null ? undefined : `${width.value}px`,
      '--sidebar-min-width': `var(${props.minWidthToken})`,
      '--sidebar-max-width': `var(${props.maxWidthToken})`
    }
  })

  const asideStyle = computed(() => ({ ...cssVars.value, ...railStyle.value }))

  const RAIL_MOTION_CLASS =
    'transition-[width] duration-moderate-02 ease-expressive-entrance has-checked:ease-expressive-exit data-[resizing]:transition-none motion-reduce:transition-none'

  const rootClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'border-r border-(--border-muted) bg-(--bg-surface)',
      railEnabled.value
        ? cn(
            'relative shrink-0 overflow-hidden',
            'data-[collapsed]:border-r-0 has-checked:border-r-0',
            'w-(--sidebar-width) has-checked:w-0',
            'min-w-(--sidebar-min-width) has-checked:min-w-0 max-w-(--sidebar-max-width)',
            RAIL_MOTION_CLASS,
            props.resizable ? 'resize-x data-[hydrated]:resize-none' : undefined
          )
        : undefined,
      attrs.class
    )
  )

  const NAV_CLASS =
    'flex h-full min-h-0 flex-1 flex-col [--menu-item-ring-offset:var(--bg-surface)] [--menu-ring-offset:var(--bg-surface)]'

  const HEADER_REGION_CLASS = 'w-full shrink-0 p-(--spacing-md)'

  const INNER_MOTION_CLASS =
    'transition-[translate,opacity] duration-moderate-02 ease-expressive-entrance has-checked:ease-expressive-exit data-[resizing]:transition-none motion-reduce:transition-none motion-reduce:translate-none'

  const INNER_CLASS = cn(
    'flex h-full min-h-0 w-full flex-col',
    'w-(--sidebar-width) translate-x-0 has-checked:-translate-x-full opacity-100 has-checked:opacity-20',
    INNER_MOTION_CLASS
  )

  const FOOTER_REGION_CLASS = 'w-full shrink-0 px-(--spacing-md) pb-(--spacing-md)'

  const footerBandClass = computed(() =>
    props.collapsible
      ? cn(
          'flex items-center gap-(--spacing-xs)',
          'border-t border-(--border-muted) pt-(--spacing-md)',
          !slots['footer'] ? 'justify-end' : undefined
        )
      : undefined
  )

  const scrollClass = computed(() =>
    cn(
      'flex min-h-0 flex-1 flex-col gap-(--spacing-md) p-(--spacing-md)',
      'scroll-py-(--spacing-xxs)',
      slots['header'] ? 'pt-(--spacing-xxs)' : undefined
    )
  )
</script>

<template>
  <aside
    :ref="setRailEl"
    v-bind="$attrs"
    :class="rootClass"
    :style="asideStyle"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-collapsed="isOut ? '' : undefined"
    :data-resizing="resizing ? '' : undefined"
    :data-hydrated="hydrated ? '' : undefined"
    :inert="isOut ? true : undefined"
    :aria-hidden="isOut ? 'true' : undefined"
  >
    <div
      :class="INNER_CLASS"
      :style="innerStyle"
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
        :class="HEADER_REGION_CLASS"
        :data-testid="`${testId}__header`"
      >
        <slot name="header" />
      </div>
      <nav
        :class="NAV_CLASS"
        :data-testid="`${testId}__nav`"
      >
        <ScrollArea
          :class="scrollClass"
          tabindex="-1"
          :data-testid="`${testId}__scroll`"
        >
          <slot />
        </ScrollArea>
      </nav>
      <div
        v-if="$slots['footer'] || collapsible"
        :class="FOOTER_REGION_CLASS"
        :data-testid="`${testId}__footer`"
      >
        <div :class="footerBandClass">
          <div
            v-if="$slots['footer']"
            :class="collapsible ? 'min-w-0 flex-1' : undefined"
          >
            <slot name="footer" />
          </div>
          <Tooltip
            v-if="collapsible"
            :text="collapseAriaLabel"
            placement="top"
          >
            <IconButton
              icon="pi pi-angle-double-left"
              :ariaLabel="collapseAriaLabel"
              kind="outlined"
              size="small"
              :data-testid="`${testId}__collapse`"
              @click="collapsed = true"
            />
          </Tooltip>
        </div>
      </div>
    </div>

    <div
      v-if="resizable"
      role="separator"
      aria-orientation="vertical"
      :aria-label="resizeAriaLabel"
      tabindex="0"
      :aria-valuenow="valueNow"
      :aria-valuemin="valueMin"
      :aria-valuemax="valueMax"
      :data-resizing="resizing ? '' : undefined"
      :data-preview="previewing ? '' : undefined"
      :data-testid="`${testId}__handle`"
      class="group absolute inset-y-0 right-0 z-10 w-(--spacing-xs) cursor-col-resize outline-none"
      @pointerdown="startResize"
      @keydown.left.prevent="nudge(-SIDEBAR_NUDGE_STEP)"
      @keydown.right.prevent="nudge(SIDEBAR_NUDGE_STEP)"
      @dblclick="collapsed = true"
    >
      <span
        class="pointer-events-none absolute inset-y-0 right-0 w-(--border-2) bg-(--accent) opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[preview]:opacity-100 group-data-[resizing]:opacity-100 motion-reduce:transition-none"
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
      v-if="collapsible && collapsed"
      :data-resizing="resizing ? '' : undefined"
      :data-preview="previewing ? '' : undefined"
      :data-testid="`${testId}__expand`"
      class="group absolute inset-y-0 left-0 z-20 w-(--size-6) hover:w-(--size-10) focus-within:w-(--size-10) transition-[width] duration-moderate-02 ease-expressive-exit hover:ease-expressive-entrance focus-within:ease-expressive-entrance motion-reduce:transition-none"
      @pointerenter="startPreview"
      @pointerleave="endPreview"
      @focusin="startPreview"
      @focusout="endPreview"
    >
      <div
        v-if="resizable"
        role="separator"
        aria-orientation="vertical"
        :aria-label="`${expandAriaLabel} by dragging`"
        tabindex="0"
        :aria-valuenow="valueNow"
        :aria-valuemin="valueMin"
        :aria-valuemax="valueMax"
        class="absolute inset-y-0 left-0 w-full cursor-col-resize outline-none"
        @pointerdown="startResize"
        @click="tapToExpand"
        @keydown.right.prevent="nudge(SIDEBAR_NUDGE_STEP)"
      />

      <div
        class="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 translate-x-[calc(-1_*_var(--size-10))] pl-(--spacing-xxs) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-expressive-exit group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:ease-expressive-entrance group-focus-within:translate-x-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:ease-expressive-entrance motion-reduce:transition-none motion-reduce:translate-none"
      >
        <Tooltip
          :text="expandAriaLabel"
          placement="right"
        >
          <IconButton
            icon="pi pi-angle-double-right"
            :ariaLabel="expandAriaLabel"
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
