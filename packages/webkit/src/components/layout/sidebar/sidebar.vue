<script setup lang="ts">
  import { computed, provide, useAttrs, useSlots } from 'vue'

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
    railTransition,
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

  const setRailEl = (el: unknown) => {
    railEl.value = (el as globalThis.HTMLElement | null) ?? null
  }

  const rootClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'border-r border-(--border-muted) bg-(--bg-surface)',
      railEnabled.value
        ? 'relative shrink-0 overflow-hidden data-[collapsed]:border-r-0'
        : undefined,
      attrs.class
    )
  )

  const NAV_CLASS =
    'flex h-full min-h-0 flex-1 flex-col [--menu-item-ring-offset:var(--bg-surface)] [--menu-ring-offset:var(--bg-surface)]'

  const HEADER_REGION_CLASS = 'w-full shrink-0 p-(--spacing-md)'

  const INNER_CLASS = 'flex h-full min-h-0 w-full flex-col'

  const affordanceStyle = computed(() => ({
    transform: previewing.value
      ? 'translateY(-50%)'
      : 'translateY(-50%) translateX(calc(-1 * var(--size-10)))',
    opacity: previewing.value ? '1' : '0',
    transition: railTransition.value
  }))

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
    :style="railStyle"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-collapsed="isOut ? '' : undefined"
    :data-resizing="resizing ? '' : undefined"
    :inert="isOut ? true : undefined"
    :aria-hidden="isOut ? 'true' : undefined"
  >
    <div
      :class="INNER_CLASS"
      :style="innerStyle"
      :data-testid="`${testId}__panel`"
    >
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
      :style="{ transition: railTransition }"
      class="group absolute inset-y-0 left-0 z-20 w-(--size-6) data-[preview]:w-(--size-10)"
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
        :style="affordanceStyle"
        class="pointer-events-none absolute left-full top-1/2 pl-(--spacing-xxs) group-data-[preview]:pointer-events-auto"
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
