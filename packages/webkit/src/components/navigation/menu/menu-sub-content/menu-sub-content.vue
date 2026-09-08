<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    ref,
    shallowRef,
    useAttrs,
    watch
  } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'
  import { useMenuSubContext } from '../composables/use-menu-sub-context'
  import {
    collapseHeightOnEnter,
    collapseHeightOnLeave,
    getMenuLevelTransitionStyle,
    MENU_LEVEL_ENTER_MS
  } from '../presets/transitions'

  defineOptions({
    name: 'MenuSubContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = useMenuContext()
  const sub = useMenuSubContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-sub-content'
  )

  const isDrill = computed(() => sub.kind.value === 'drill')
  /** A drill level is the one the user is looking at only while it is the deepest. */
  const isCurrent = computed(() => ctx.isCurrentLevel(sub.id))
  /** Stays in the DOM while on the stack, and a little longer while it slides out. */
  const isMounted = computed(() => ctx.isLevelMounted(sub.id))

  // Was this level already on the stack when this instance was created — restored (persisted
  // `path`) rather than pushed? Captured at setup: a tick later the two are indistinguishable.
  // Cleared when the level leaves the stack — every later arrival was travelled to.
  const wasRestored = ref(isMounted.value)
  watch(isMounted, (mounted) => {
    if (!mounted) wasRestored.value = false
  })

  /** Whether the Teleport below can render at all: this is a drill, and the host exists. */
  const canTeleport = computed(() => isDrill.value && ctx.levelHost.value !== null)

  // Withheld one tick after the Teleport becomes renderable, so the Transition exists before
  // its child and every arrival takes the ordinary enter path. `appear` is unreliable here:
  // the Teleport target is set in the ROOT's onMounted (after this child's), so on a restored
  // stack both first render in the same patch and the appear hooks never play.
  const ready = ref(false)

  watch(
    canTeleport,
    (on) => {
      if (!on || ready.value) return
      // Must land in a LATER patch than the Transition's own first one.
      nextTick(() => {
        ready.value = true
      })
    },
    { immediate: true }
  )

  // The from-position decides whether the arrival is seen: a live push always shows it, a
  // RESTORED level only when the consumer says it was travelled to (enterOnMount).
  const enterFromClass = computed(() =>
    wasRestored.value && !ctx.enterOnMount.value
      ? ''
      : 'motion-safe:translate-x-full! motion-safe:opacity-0'
  )

  /** Only the current level and the one directly behind it slide; deeper levels stay hidden. */
  const motion = computed(() => {
    const levels = ctx.levels.value
    const index = levels.findIndex((level) => level.id === sub.id)
    if (index === -1) return ctx.motion.value
    return index >= levels.length - 2 ? ctx.motion.value : 'none'
  })

  // Rail geometry falls out of the menu-indent and menu-rail-x custom properties, so the
  // elbow cannot come unstuck from the rows. The indent is deliberately narrower than the
  // 40px icon column (a tighter tree over strict label alignment); the rail descends from
  // where the parent's content begins, and the elbow stops at the child row's LEFT EDGE —
  // the hover and selected surfaces fill the row's box, so any wider would run under them.
  const INLINE_CLASS =
    'relative m-0 flex w-full list-none flex-col p-0 ' +
    '[--menu-indent:calc(var(--spacing-sm)+var(--spacing-xs))] ' +
    '[--menu-rail-x:var(--spacing-sm)] ' +
    'pl-(--menu-indent) ' +
    '[&>li]:relative ' +
    "[&>li]:before:pointer-events-none [&>li]:before:absolute [&>li]:before:top-0 [&>li]:before:left-[calc(var(--menu-rail-x)-var(--menu-indent))] [&>li]:before:h-4 [&>li]:before:w-[calc(var(--menu-indent)-var(--menu-rail-x))] [&>li]:before:rounded-bl-(--shape-elements) [&>li]:before:border-b [&>li]:before:border-l [&>li]:before:border-(--border-default) [&>li]:before:content-[''] " +
    "[&>li]:after:pointer-events-none [&>li]:after:absolute [&>li]:after:top-4 [&>li]:after:bottom-0 [&>li]:after:left-[calc(var(--menu-rail-x)-var(--menu-indent))] [&>li]:after:w-0 [&>li]:after:border-l [&>li]:after:border-(--border-default) [&>li]:after:content-[''] " +
    '[&>li:last-child]:after:hidden'

  // A container, not a list element: a drilled level holds groups (sections) like the root,
  // and a list would be invalid with a section inside. A non-current level sits off-canvas
  // rather than unrendered so a pop has a rendered position to tween from; its own mount is
  // the one case CSS cannot cover — the Transition below owns it.
  const DRILL_CLASS =
    // The leaving level is positioned, so by default it paints above the in-flow current
    // one — the current level has to win the stacking.
    'relative z-10 flex w-full flex-col ' +
    // A fill only while sliding, so the two levels occlude instead of reading through each other.
    'data-[motion=push]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[motion=pop]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[state=open]:translate-x-0 ' +
    'data-[state=closed]:z-0 ' +
    'data-[state=closed]:absolute data-[state=closed]:inset-x-0 data-[state=closed]:top-0 ' +
    'data-[state=closed]:-translate-x-full ' +
    'data-[state=closed]:data-[motion=pop]:translate-x-full ' +
    // A level's own width is not the distance to the clipping edge when the host insets
    // the menu, so the residual sliver is faded rather than chased with a bigger translate.
    'data-[state=closed]:opacity-0 ' +
    'data-[state=closed]:motion-reduce:hidden ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  const inlineClass = computed(() => cn(INLINE_CLASS, attrs.class as string | undefined))
  const drillClass = computed(() => cn(DRILL_CLASS, attrs.class as string | undefined))

  /** Timing follows the direction of travel — enter while current, leave once moved past; only timing is inline. */
  const levelStyle = computed(() =>
    getMenuLevelTransitionStyle(isCurrent.value ? 'enter' : 'leave')
  )

  // A level claims the Back anchor on becoming current and releases it only on UNMOUNT —
  // releasing when it merely stops being current would strip the header off a level still
  // sliding out; a deeper push claims it next (last-write-wins).
  const anchorEl = shallowRef<globalThis.HTMLElement | null>(null)

  const backAnchor = (el: globalThis.Element | ComponentPublicInstance | null) => {
    const node = el as globalThis.HTMLElement | null
    anchorEl.value = node
    if (node === null) {
      if (ctx.backHost.value?.dataset['levelId'] === sub.id) ctx.setBackHost(null)
    } else if (isCurrent.value) {
      ctx.setBackHost(node)
    }
  }

  watch(isCurrent, (current) => {
    if (current && anchorEl.value) ctx.setBackHost(anchorEl.value)
  })
</script>

<template>
  <!-- The from-frame must exist one paint before the class-driven target wins (its important
       flag outranks the data-state target); leave: 0 unmounts at once — the exit slide already
       ran on the data-motion classes while the level was held. A RESTORED level takes this same
       enter path: `ready` makes the Transition exist first, `enterFromClass` gates visibility. -->
  <Teleport
    v-if="canTeleport"
    :to="ctx.levelHost.value"
  >
    <Transition
      :enter-from-class="enterFromClass"
      :duration="{ enter: MENU_LEVEL_ENTER_MS, leave: 0 }"
    >
      <div
        v-if="isMounted && ready"
        v-bind="$attrs"
        :id="sub.contentId"
        role="group"
        :data-testid="testId"
        :data-kind="sub.kind.value"
        :data-state="isCurrent ? 'open' : 'closed'"
        :data-motion="motion"
        :data-level="sub.level"
        :aria-label="sub.label.value || undefined"
        :aria-hidden="isCurrent ? undefined : 'true'"
        :inert="isCurrent ? undefined : true"
        :class="drillClass"
        :style="levelStyle"
      >
        <!-- Back renders in here, not in the root's flow: it heads this level, slides with it,
             and holds no space in the root — a Back row there would push the returning menu
             down for the whole pop and snap it back at the end. -->
        <div
          :ref="backAnchor"
          :data-level-id="sub.id"
          :data-testid="`${testId}__back-host`"
        />
        <slot />
      </div>
    </Transition>
  </Teleport>
  <Transition
    v-else-if="!isDrill"
    :css="false"
    @enter="collapseHeightOnEnter"
    @leave="collapseHeightOnLeave"
  >
    <ul
      v-if="sub.open.value"
      v-bind="$attrs"
      :id="sub.contentId"
      :data-testid="testId"
      :data-kind="sub.kind.value"
      :data-state="sub.open.value ? 'open' : 'closed'"
      :data-level="sub.level"
      :aria-labelledby="sub.triggerId"
      :class="inlineClass"
    >
      <slot />
    </ul>
  </Transition>
</template>
