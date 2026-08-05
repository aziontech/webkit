<script setup lang="ts">
  import { computed, inject, useAttrs, useId } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'
  import { MenuSubInjectionKey } from '../injection-key'
  import { getMenuLevelTransitionStyle, MENU_LEVEL_ENTER_MS } from '../presets/transitions'

  defineOptions({
    name: 'MenuGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Header text; omit for an unlabeled block. */
    label?: string
    /** Accessible name for the section when there is no visible label. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    ariaLabel: ''
  })

  const slots = defineSlots<{
    default(): unknown
    label(): unknown
  }>()

  const ctx = useMenuContext()
  const attrs = useAttrs()

  const uid = useId()
  const labelId = `${uid}-label`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-group'
  )

  const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label))

  /**
   * A group inside a drilled level is part of that level's own anatomy, and the level
   * slides as one piece — so only a ROOT-level group is a surface that steps aside when a
   * level is pushed. Without this a nested group would hide itself the moment the stack
   * was non-empty, taking the pushed level's own rows out of the a11y tree with it.
   */
  // Resolved once, synchronously in setup — the component hierarchy cannot change.
  const isNested = inject(MenuSubInjectionKey, null) !== null
  const isCurrent = computed(() => isNested || ctx.levels.value.length === 0)

  /**
   * Timing follows the direction this level is travelling: it leaves on a push and comes
   * back on a pop. The transform itself is a class; only the timing is inline. A nested
   * group never travels on its own, so it carries no level transition at all.
   */
  const levelStyle = computed(() => {
    if (isNested) return undefined
    // Coming back (a pop) it slides in OPAQUE so it covers the level leaving behind it;
    // going out (a push) it fades as it goes.
    return isCurrent.value
      ? getMenuLevelTransitionStyle('enter', { fade: false })
      : getMenuLevelTransitionStyle('leave')
  })

  /**
   * Out of flow rather than `display: none` while a level is pushed: an element that was
   * never rendered has nothing to tween from, so the slide back in on a pop would snap.
   * Reduced motion drops it out of the box entirely instead of sliding it.
   */
  const ROOT_CLASS =
    // `relative z-10` / `aria-hidden:z-0`: the hidden level is absolutely positioned, and a
    // positioned element paints above an in-flow sibling by default — the current level has
    // to win, or the level being replaced sits on top of the one replacing it.
    'relative z-10 flex w-full flex-col my-[var(--spacing-sm)] first-of-type:my-0 translate-x-0 ' +
    // `-translate-x-full` clears the group's own width but not the host's padding, so a
    // `Sidebar`-inset menu leaves a sliver of the outgoing level on screen. Fading it is
    // the only fix available to a component that cannot know its host's padding. Only the
    // leave transitions opacity (see presets/transitions.ts), so coming back is opaque.
    // Backgroundless layers cannot occlude one another: sliding two of them across the same
    // viewport, you read the leaving one through the gaps between the arriving one's rows. A
    // fill for the duration of the slide is what makes the surfaces actually cover.
    'data-[motion=push]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[motion=pop]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'aria-hidden:z-0 ' +
    'aria-hidden:absolute aria-hidden:inset-x-0 aria-hidden:top-0 aria-hidden:-translate-x-full ' +
    'aria-hidden:opacity-0 aria-hidden:motion-reduce:hidden ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  /**
   * The rail ARRIVING is an entrance like a level's. A root group normally slides back into view
   * on a pop, from a rendered off-canvas position — but when the host remounted on the way back
   * out of a level there is no such position to tween from, so the entrance needs Vue's from-frame
   * exactly as a mounting level does. Gated on the root's `enterOnMount` (the consumer's answer to
   * "was this arrival travelled to") and on there being no level, since a group behind a pushed
   * level should stay where it is instead of animating in behind it. Nested groups never travel on
   * their own — the level carries them.
   */
  const appear = computed(
    () => !isNested && ctx.enterOnMount.value && ctx.levels.value.length === 0
  )
</script>

<template>
  <!--
    Only the mounting phase needs Vue, and only when the rail is what was arrived at: the
    from-position has to exist for one frame before the class-driven `translate-x-0` takes over,
    and `!` outranks it on specificity. The group comes back from the LEFT, the side a pop sends
    it out to and brings it in from. `motion-safe:` keeps the off-canvas frame out of a
    reduced-motion render, and no opacity is tweened — an arriving surface stays opaque so it
    covers whatever is leaving behind it (see presets/transitions.ts).
  -->
  <Transition
    :appear="appear"
    :duration="{ enter: MENU_LEVEL_ENTER_MS, leave: 0 }"
    enter-from-class="motion-safe:-translate-x-full!"
  >
    <section
      v-bind="$attrs"
      :data-testid="testId"
      :data-motion="ctx.motion.value"
      :aria-hidden="isCurrent ? undefined : 'true'"
      :inert="isCurrent ? undefined : true"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :aria-label="hasLabel ? undefined : ariaLabel || undefined"
      :class="rootClass"
      :style="levelStyle"
    >
      <!--
      A title, not a control: static text with no hover surface and no toggle. A group
      separates rows; it does not fold them. Folding belongs to a condensed ROW, whose
      chevron and rail say which rows it owns — a toggle here would read as a nav row and
      compete with the rows it labels.
    -->
      <div
        v-if="hasLabel"
        :id="labelId"
        :data-testid="`${testId}__label`"
        class="flex min-h-8 w-full shrink-0 items-center px-[var(--spacing-sm)] text-label-sm text-[var(--text-muted)]"
      >
        <span class="min-w-0 flex-1 truncate">
          <slot name="label">{{ label }}</slot>
        </span>
      </div>
      <ul
        :data-testid="`${testId}__list`"
        class="relative m-0 flex w-full list-none flex-col p-0"
      >
        <slot />
      </ul>
    </section>
  </Transition>
</template>
