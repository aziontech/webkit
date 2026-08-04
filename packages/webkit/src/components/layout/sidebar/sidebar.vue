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

  // Declared alongside the models so the public event surface is readable from the component
  // itself (and checkable against the spec's Events table); `defineModel` below is what
  // actually emits them.
  defineEmits<{
    'update:collapsed': [value: boolean]
    'update:width': [value: number | null]
  }>()

  /** Whether the rail is out of the layout. */
  const collapsed = defineModel<boolean>('collapsed', { default: false })

  /**
   * Sized width in px. `null` means not sized yet — seeded from the rail's own natural width
   * on mount, after which the gesture owns it. px because the value is the outcome of a pointer
   * gesture; the bounds it is clamped to are the ones that come from tokens.
   */
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
    testId: testId.value
  })

  /** The gesture is offered only when one of its two halves was asked for. */
  const railEnabled = computed(() => props.resizable || props.collapsible)

  const {
    railEl,
    resizing,
    valueNow,
    valueMin,
    valueMax,
    railStyle,
    innerStyle,
    startResize,
    nudge,
    measure
  } = useSidebarRail({
    collapsed,
    width,
    minWidthToken: () => props.minWidthToken,
    maxWidthToken: () => props.maxWidthToken,
    enabled: railEnabled
  })

  /**
   * A host that reveals the sidebar AFTER mount (a viewport change out of a mobile layout) has
   * to re-measure: a rail measured while `display: none` reports 0, which would strand it
   * invisible. Nothing else is exposed — every other interaction is a model.
   */
  defineExpose({ measure })

  /** Out of the layout: collapsed, and actually able to collapse. */
  const isOut = computed(() => collapsed.value && railEnabled.value)

  /** A function ref, so the composable's own ref is what the template writes into. */
  const setRailEl = (el: unknown) => {
    railEl.value = (el as globalThis.HTMLElement | null) ?? null
  }

  const rootClass = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'border-r border-[var(--border-muted)] bg-[var(--bg-surface)]',
      // Only once the rail can be sized: a collapsed rail is 0 px wide, and its content has to
      // be clipped rather than spilling across the page while it slides out. The trailing
      // border goes with it — `width: 0` still paints a border, so a fully collapsed rail
      // would leave a 1 px line down the page as the only trace of itself.
      railEnabled.value
        ? 'relative shrink-0 overflow-hidden data-[collapsed]:border-r-0'
        : undefined,
      attrs.class
    )
  )

  // The sidebar is the surface every focus ring inside it is offset against, so it hands its
  // own fill down rather than letting a nested row fall back to `--bg-canvas`: `menu-item`
  // reads the first, and every other `Menu` row (`SubTrigger`, `Back`) reads the second.
  const NAV_CLASS =
    'flex h-full min-h-0 flex-1 flex-col [--menu-item-ring-offset:var(--bg-surface)] [--menu-ring-offset:var(--bg-surface)]'

  const HEADER_REGION_CLASS = 'w-full shrink-0 p-[var(--spacing-md)]'

  /**
   * The inner panel keeps a FIXED width while the outer rail's width animates, so its own
   * layout never reflows mid-collapse — the rows do not re-wrap on the way out.
   */
  const INNER_CLASS = 'flex h-full min-h-0 w-full flex-col'

  const footerRegionClass = computed(() =>
    cn(
      'w-full shrink-0 px-[var(--spacing-md)] pb-[var(--spacing-md)]',
      // With the trigger present the footer is a ROW — the profile block and the trigger read
      // as one footer rather than as two stacked things. Without it the region is untouched,
      // so an existing consumer's footer keeps its own layout exactly.
      props.collapsible ? 'flex items-center gap-[var(--spacing-xs)]' : undefined,
      // The trigger sits on the TRAILING edge whether or not there is footer content beside
      // it: with content, the `flex-1` slot wrapper pushes it there; alone in the region it
      // would otherwise fall to the leading edge and land in a different corner of the rail
      // depending on what the consumer happened to put in the footer.
      props.collapsible && !slots['footer'] ? 'justify-end' : undefined
    )
  )

  const scrollClass = computed(() =>
    cn(
      'flex min-h-0 flex-1 flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]',
      slots['header'] ? 'pt-0' : undefined
    )
  )
</script>

<template>
  <!--
    Two roots by design. The rail itself, and the affordance that brings a collapsed rail back:
    the affordance cannot live inside the rail, because a collapsed rail is 0 px wide with
    `overflow-hidden` and would clip the one control that undoes the collapse. It is therefore a
    sibling, positioned against the host's own `relative` row.
  -->
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
          :data-testid="`${testId}__scroll`"
        >
          <slot />
        </ScrollArea>
      </nav>
      <div
        v-if="$slots['footer'] || collapsible"
        :class="footerRegionClass"
        :data-testid="`${testId}__footer`"
      >
        <!-- The footer content takes the row; the trigger trails it. `min-w-0` so a long
             account name truncates instead of pushing the trigger off the rail. -->
        <div
          v-if="$slots['footer']"
          :class="collapsible ? 'min-w-0 flex-1' : undefined"
        >
          <slot name="footer" />
        </div>
        <!-- An icon-only control says what it does on hover as well as to a screen reader:
             the tooltip carries the same string as the accessible name, so the two cannot
             drift. `top`, because the trigger sits on the rail's bottom edge. -->
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

    <!--
      Resize handle: the rail's own trailing edge. Drag to size it between the two container
      tokens; drag past the minimum and the rail collapses out of the layout. Arrow keys nudge
      it, double-click collapses it. The line shows only on hover / focus / drag, so the rail
      reads as a flat edge at rest.
    -->
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
      :data-testid="`${testId}__handle`"
      class="group absolute inset-y-0 right-0 z-10 w-[var(--spacing-xs)] cursor-col-resize outline-none"
      @pointerdown="startResize"
      @keydown.left.prevent="nudge(-SIDEBAR_NUDGE_STEP)"
      @keydown.right.prevent="nudge(SIDEBAR_NUDGE_STEP)"
      @dblclick="collapsed = true"
    >
      <span
        class="pointer-events-none absolute inset-y-0 right-0 w-[var(--border-2)] bg-[var(--accent)] opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[resizing]:opacity-100 motion-reduce:transition-none"
      />
    </div>
  </aside>

  <!--
    The OPEN side of the pair. Collapsing is driven from the trigger inside the rail, and that
    trigger goes inert with the rail — so bringing it back belongs out here. This zone takes over
    the host's leading edge while the rail is out; hovering it, or focusing anything inside it,
    reveals the two ways back: the grab bar (pull the rail out from under the cursor) and the
    button. Both stay hidden at rest so a collapsed layout is genuinely clean.
  -->
  <Transition
    enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    leave-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="collapsible && collapsed"
      :data-resizing="resizing ? '' : undefined"
      :data-testid="`${testId}__expand`"
      class="group absolute inset-y-0 left-0 z-20"
    >
      <!-- `grab` rather than `col-resize`: from here the gesture is picking the rail up, not
           sizing one that is already in place. -->
      <div
        v-if="resizable"
        role="separator"
        aria-orientation="vertical"
        :aria-label="`${expandAriaLabel} by dragging`"
        tabindex="0"
        :aria-valuenow="valueNow"
        :aria-valuemin="valueMin"
        :aria-valuemax="valueMax"
        class="absolute inset-y-0 left-0 w-[var(--spacing-sm)] cursor-grab outline-none active:cursor-grabbing"
        @pointerdown="startResize"
        @keydown.right.prevent="nudge(SIDEBAR_NUDGE_STEP)"
      >
        <span
          class="pointer-events-none absolute inset-y-0 left-0 w-[var(--border-2)] bg-[var(--accent)] opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-within:opacity-100 group-data-[resizing]:opacity-100 motion-reduce:transition-none"
        />
      </div>

      <div
        class="absolute left-[var(--spacing-xs)] top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-within:opacity-100 group-data-[resizing]:opacity-0 motion-reduce:transition-none"
      >
        <!-- `right`: this control sits on the host's leading edge, so the only room is
             towards the page. -->
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
