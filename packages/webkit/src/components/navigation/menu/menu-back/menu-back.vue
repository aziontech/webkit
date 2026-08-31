<script setup lang="ts">
  import { type ComponentPublicInstance, computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'

  defineOptions({
    name: 'MenuBack',
    inheritAttrs: false
  })

  interface Props {
    /** Names the destination Back returns to, overriding the level below it on the stack. Set it to name the menu root, which has no trigger to name itself. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: ''
  })

  defineSlots<{
    default?(): unknown
  }>()

  const ctx = useMenuContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-back'
  )

  /**
   * Presence follows the level's own anchor, not the stack: on a pop the stack empties at
   * once, but the level it named is still sliding out and must keep its Back button.
   */
  const isVisible = computed(() => ctx.backHost.value !== null)

  /**
   * Where a pop LANDS — the level beneath the current one — not the level the reader is in.
   * A back button names its destination; naming the current level would read as travelling
   * to the place you are already standing. Empty when the destination is the menu root,
   * which has no trigger to name it: `label` is how a consumer names that one.
   *
   * Read LIVE, with no hold across the slide-out. Naming the current level needed one (the
   * stack empties the instant a pop begins, blanking the label of the level still sliding
   * away); naming the destination never does. A pop to the root leaves the text unchanged —
   * the root is unnamed both before and after — and a pop between levels hands the button to
   * the incoming level, whose own destination is exactly what the live stack now reports.
   */
  const destination = computed(() => {
    const levels = ctx.levels.value
    return props.label || (levels.length > 1 ? levels[levels.length - 2].label : '')
  })

  /**
   * The visible text is also the accessible name, so the two can never disagree — which is
   * why there is no `aria-label` here. A bare "Back" is the honest fallback when the
   * destination has no name.
   */
  const text = computed(() => (destination.value ? `Back to ${destination.value}` : 'Back'))

  // A BUTTON, not a row: it hugs its label (`w-fit`) instead of spanning the rail, and its
  // content is left-aligned. Both are deliberate — a full-width box with a centred label is
  // the shape of the nav rows beneath it, and reading as one of them makes the single control
  // that leaves the level the hardest thing in it to find.
  const ROOT_CLASS =
    // `mb` sets the button apart from the level's first group instead of letting it read as
    // that group's first row — it heads the level, it is not part of it.
    // No motion of its own: it renders INSIDE the current level (see the teleport below), so
    // the level's slide carries it and its box never sits in the root's flow.
    'group relative flex h-8 w-fit max-w-full shrink-0 items-center gap-(--spacing-xxs) ' +
    'mb-(--spacing-sm) ' +
    // `--spacing-sm` is the menu's single content column, so the chevron's box starts exactly
    // where a row's icon box centres its glyph — the button sits on the rows' column without
    // borrowing their 32px icon box, which is what pushed its label onto the rows' label
    // column and made it read as one of them.
    'rounded-(--shape-elements) px-(--spacing-sm) ' +
    'text-(--text-default) ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance " +
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance " +
    'hover:before:opacity-100 active:after:opacity-100 ' +
    'motion-reduce:before:transition-none motion-reduce:after:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  /** A function ref registers on patch, so a push can focus this button on the same tick. */
  const registerElement = (el: globalThis.Element | ComponentPublicInstance | null) => {
    ctx.setBackElement(el as globalThis.HTMLElement | null)
  }
</script>

<template>
  <!--
    Renders into the CURRENT level rather than where it is declared. That anchor only exists
    while a level is pushed, which is exactly when Back should exist — so `isVisible` and the
    host agree, the level's slide animates Back for free, and the root's flow never reserves
    a row that is about to leave.
  -->
  <Teleport
    v-if="isVisible"
    :to="ctx.backHost.value"
  >
    <button
      :ref="registerElement"
      v-bind="$attrs"
      type="button"
      :data-testid="testId"
      :class="rootClass"
      @click="ctx.pop()"
    >
      <!--
        The chevron carries the whole "this goes back" reading, so it is tight against the
        label (`--spacing-xxs`) rather than held a row's icon-box away from it.
      -->
      <i
        class="pi pi-chevron-left size-4 shrink-0 leading-none text-[length:inherit] text-(--text-muted)"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
      <!-- Same label class as every other row, so Back reads at the rows' size, not smaller. -->
      <span class="min-w-0 truncate text-label-md">
        <slot>{{ text }}</slot>
      </span>
    </button>
  </Teleport>
</template>
