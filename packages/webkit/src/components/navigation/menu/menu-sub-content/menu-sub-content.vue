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

  /**
   * Was this level ALREADY on the stack when this instance was created? Then it was restored
   * (the consumer handed back a persisted `path`) rather than pushed — captured at setup,
   * because by the next tick the two are indistinguishable.
   */
  const wasRestored = isMounted.value

  /** Whether the Teleport below can render at all: this is a drill, and the host exists. */
  const canTeleport = computed(() => isDrill.value && ctx.levelHost.value !== null)

  /**
   * The level is withheld for one tick after its Teleport becomes renderable, so the
   * `<Transition>` below always exists *before* its child does and every arrival goes through
   * the ordinary **enter** transition — the same path a live push takes.
   *
   * `appear` would be the obvious tool and cannot be relied on here. The level lives inside a
   * Teleport whose target is the root's level host, a ref the ROOT sets in its own `onMounted` —
   * which runs *after* this component's, children mounting first. So on a restored stack the
   * Transition and its child first appear together in that later patch, and the appear hooks do
   * not play. That is what made the entrance order-dependent: it played when the reader came
   * from another level (the child arrived while the Transition already existed) and snapped into
   * place when they arrived from anywhere else.
   */
  const ready = ref(false)

  watch(
    canTeleport,
    (on) => {
      if (!on || ready.value) return
      // Next tick, not now: this must land in a LATER patch than the Transition's own first one.
      nextTick(() => {
        ready.value = true
      })
    },
    { immediate: true }
  )

  /**
   * With the enter path always taken, the from-position is what decides whether the arrival is
   * seen. A live push always shows it; a RESTORED level shows it only when the consumer says the
   * arrival was travelled to (`enterOnMount`), so navigating between rows of a level the reader
   * is already in re-renders the level without replaying its entrance.
   */
  const enterFromClass = computed(() =>
    wasRestored && !ctx.enterOnMount.value
      ? ''
      : 'motion-safe:translate-x-full! motion-safe:opacity-0'
  )

  /**
   * Only the current level and the one directly behind it slide; a level further down
   * the stack stays hidden instead of animating back into view on a deeper push.
   */
  const motion = computed(() => {
    const levels = ctx.levels.value
    const index = levels.findIndex((level) => level.id === sub.id)
    if (index === -1) return ctx.motion.value
    return index >= levels.length - 2 ? ctx.motion.value : 'none'
  })

  /**
   * Rail geometry, all of it derived from two custom properties so the elbow can never come
   * unstuck from the rows it connects. Both tokens used below are fixed at every breakpoint,
   * so the elbow cannot drift:
   *
   * - `--menu-indent` — one step in: `--spacing-sm + --spacing-md` (28px), the step the
   *   reference sidebar uses. It is deliberately NARROWER than the row's own icon column
   *   (40px), so a child's label lands slightly left of its parent's rather than right of
   *   it — chosen for a tighter tree over strict label-column alignment.
   * - `--menu-rail-x` — where the vertical line sits, measured from the PARENT row's left
   *   edge. It is the menu's single content column (`--spacing-sm`), which every row type
   *   starts on, so the rail descends from exactly where the parent's content begins.
   *
   * The elbow spans from that line to the child ROW'S LEFT EDGE — `--menu-indent - --menu-rail-x`
   * — and stops there. It must not reach the child's content: the row's box begins at the indent,
   * and its hover and selected surfaces fill that box, so an elbow drawn any wider would run
   * underneath them. The rail lives in the gutter beside the rows, never on top of one.
   *
   * The elbow then spans from that line to the child's own content start, so its width falls
   * out of the two rather than being a second number to keep in sync.
   */
  const INLINE_CLASS =
    'relative m-0 flex w-full list-none flex-col p-0 ' +
    '[--menu-indent:calc(var(--spacing-sm)+var(--spacing-md))] ' +
    '[--menu-rail-x:var(--spacing-sm)] ' +
    'pl-[var(--menu-indent)] ' +
    '[&>li]:relative ' +
    "[&>li]:before:pointer-events-none [&>li]:before:absolute [&>li]:before:top-0 [&>li]:before:left-[calc(var(--menu-rail-x)-var(--menu-indent))] [&>li]:before:h-4 [&>li]:before:w-[calc(var(--menu-indent)-var(--menu-rail-x))] [&>li]:before:rounded-bl-[var(--shape-elements)] [&>li]:before:border-b [&>li]:before:border-l [&>li]:before:border-[var(--border-default)] [&>li]:before:content-[''] " +
    "[&>li]:after:pointer-events-none [&>li]:after:absolute [&>li]:after:top-4 [&>li]:after:bottom-0 [&>li]:after:left-[calc(var(--menu-rail-x)-var(--menu-indent))] [&>li]:after:w-0 [&>li]:after:border-l [&>li]:after:border-[var(--border-default)] [&>li]:after:content-[''] " +
    '[&>li:last-child]:after:hidden'

  /**
   * A drilled level is a MENU, not a row list: it is a container so it can hold
   * `Menu.Group`s exactly like the root does, which is what makes a second-level nav the
   * same anatomy as the first. (A `<ul>` here would be invalid the moment a group — a
   * `<section>` — went inside it, so a pushed level could only ever be flat rows.)
   *
   * A level that is not current sits out of flow and off-canvas rather than under
   * `display: none`, so the pop that brings it back has a rendered position to tween from.
   * Its own mount is the one case CSS cannot cover; the `Transition` below owns that.
   * Reduced motion hides it outright instead of sliding it.
   */
  const DRILL_CLASS =
    // `z-10` vs `z-0`: the leaving level is absolutely positioned, and a positioned element
    // paints ABOVE an in-flow sibling by default — which would put the outgoing level on top
    // of the incoming one. The current level has to win.
    'relative z-10 flex w-full flex-col ' +
    // Same reason as the root surface: a fill only while sliding, so the two levels occlude
    // each other instead of reading through one another.
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

  /**
   * Timing follows the direction this level is travelling: it enters while it is the
   * current level and leaves once a push or pop moves past it. Only the timing is inline.
   */
  const levelStyle = computed(() =>
    getMenuLevelTransitionStyle(isCurrent.value ? 'enter' : 'leave')
  )

  /**
   * A level claims the Back anchor when it becomes current, and releases it only when it
   * UNMOUNTS. Releasing it the moment the level stops being current would strip the header
   * off a level that is still sliding out; a deeper push simply claims it next, and
   * last-write-wins keeps the current level the owner.
   */
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
  <!--
    Only the mounting phase needs Vue: the from-position has to exist for one frame before
    the class-driven target takes over, and `!` outranks the `data-state` target on
    specificity. Opacity needs no `!` — nothing sets it in the `open` state, so the plain
    utility wins on its own. `motion-safe:` keeps that frame out of a reduced-motion render,
    and `leave: 0` unmounts at once — the exit slide already ran on the `data-motion`
    classes while the level was held for MENU_LEVEL_EXIT_MS. The comment sits outside the
    Teleport so it is not teleported into the consumer's level host.

    A RESTORED level (already on the stack when this component was created, because the consumer
    handed back a persisted `path`) takes this very same enter path: `ready` withholds it for one
    patch so the Transition exists before its child, and `enterFromClass` decides whether the
    arrival is seen. `appear` would be the obvious tool and is deliberately not used — see
    `ready`'s comment for why it cannot fire reliably inside this Teleport.
  -->
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
        <!--
          Back renders in here, not in the root's flow: it heads this level, so it slides with
          it and leaves the root's layout untouched — a Back row that held space in the root
          would push the returning menu down for the whole pop and snap it back at the end.
        -->
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
