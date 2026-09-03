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

  // Only a ROOT-level group steps aside on a push — a nested one slides with its level;
  // hiding it would pull the pushed level's own rows out of the a11y tree.
  const isNested = inject(MenuSubInjectionKey, null) !== null
  const isCurrent = computed(() => isNested || ctx.levels.value.length === 0)

  /** Timing follows the direction of travel (out on a push, back on a pop); only the timing is inline. */
  const levelStyle = computed(() => {
    if (isNested) return undefined
    // A pop slides in OPAQUE so it covers the leaving level; a push fades as it goes.
    return isCurrent.value
      ? getMenuLevelTransitionStyle('enter', { fade: false })
      : getMenuLevelTransitionStyle('leave')
  })

  // Out of flow, not unrendered, while hidden: an unrendered element has nothing to tween
  // from, so the slide back in on a pop would snap. Reduced motion drops it out entirely.
  const ROOT_CLASS =
    // The hidden level is positioned, so by default it paints above the in-flow current
    // level — the current one has to win the stacking.
    'relative z-10 flex w-full flex-col my-(--spacing-sm) first-of-type:my-0 translate-x-0 ' +
    // The slide clears the group's width but not the host's padding — a sliver of the
    // outgoing level would show, and fading the leave is the only fix (enter stays opaque;
    // see presets/transitions.ts). Backgroundless layers need a fill during the slide to occlude.
    'data-[motion=push]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[motion=pop]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'aria-hidden:z-0 ' +
    'aria-hidden:absolute aria-hidden:inset-x-0 aria-hidden:top-0 aria-hidden:-translate-x-full ' +
    'aria-hidden:opacity-0 aria-hidden:motion-reduce:hidden ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  // After a host remount there is no rendered off-canvas position to tween from, so the pop
  // entrance needs Vue's from-frame like a mounting level's. Gated on `enterOnMount` and an
  // empty stack — a group behind a pushed level stays put.
  const appear = computed(
    () => !isNested && ctx.enterOnMount.value && ctx.levels.value.length === 0
  )
</script>

<template>
  <!-- The from-frame must exist one paint before the class-driven resting position wins (the
       enter-from class outranks it on specificity). No opacity is tweened — an arriving surface
       stays opaque to cover what leaves — and its guard skips the frame under reduced motion. -->
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
      <!-- A title, not a control: a group separates rows, it does not fold them — folding
           belongs to a condensed ROW, whose chevron and rail say which rows it owns. -->
      <div
        v-if="hasLabel"
        :id="labelId"
        :data-testid="`${testId}__label`"
        class="flex min-h-8 w-full shrink-0 items-center px-(--spacing-sm) text-label-sm text-(--text-muted)"
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
