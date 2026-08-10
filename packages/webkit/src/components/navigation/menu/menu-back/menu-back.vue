<script setup lang="ts">
  import { type ComponentPublicInstance, computed, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'

  defineOptions({
    name: 'MenuBack',
    inheritAttrs: false
  })

  interface Props {
    /** Overrides the parent trigger's label taken from context. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: ''
  })

  // Optional, because the accessible name below depends on whether the consumer
  // actually passed it — a non-optional signature makes that check always true.
  const slots = defineSlots<{
    default?(): unknown
  }>()

  const ctx = useMenuContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-back'
  )

  /**
   * Presence follows the level's own anchor, not the stack: on a pop the stack empties at
   * once, but the level it named is still sliding out and must keep its header.
   */
  const isVisible = computed(() => ctx.backHost.value !== null)

  /** The label of the trigger that opened the level this row belongs to. */
  const levelLabel = computed(() => {
    const levels = ctx.levels.value
    return levels.length > 0 ? levels[levels.length - 1].label : ''
  })

  /**
   * Held over the slide-out. `levels` empties the instant a pop starts, so reading it live
   * would blank the label of the very level the row is still labelling.
   */
  const lastLabel = ref('')
  watch(levelLabel, (value) => {
    if (value) lastLabel.value = value
  })

  const text = computed(() => props.label || levelLabel.value || lastLabel.value)

  /**
   * Only named here when the row renders its own text — a consumer slot owns both the
   * visible text and the accessible name, so the two can never disagree.
   */
  const ariaLabel = computed(() => {
    if (slots.default) return undefined
    return text.value ? `Back to ${text.value}` : 'Back'
  })

  // Back heads the same list as the drilled rows, so it shares `menu-item`'s row geometry
  // (height, padding, gap, 32px icon box) — otherwise its label sits off the column the
  // rows beneath it establish.
  const ROOT_CLASS =
    // `mb` sets the Back row apart from the level's first group instead of letting it read
    // as that group's first row — it heads the level, it is not part of it.
    // No motion of its own: it renders INSIDE the current level (see the teleport below), so
    // the level's slide carries it and its box never sits in the root's flow.
    'group relative flex h-8 w-full shrink-0 items-center gap-(--spacing-xs) ' +
    'mb-(--spacing-sm) ' +
    // Symmetric padding, unlike a nav row's: the label is centred against the whole row, so
    // the leading and trailing insets have to match or it lands off-centre by their difference.
    // The chevron still sits on the same column as an item's icon.
    'rounded-(--shape-elements) px-(--spacing-xxs) ' +
    'text-(--text-default) ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance " +
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance " +
    'hover:before:opacity-100 active:after:opacity-100 ' +
    'motion-reduce:before:transition-none motion-reduce:after:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  /** A function ref registers on patch, so a push can focus this row on the same tick. */
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
      :aria-label="ariaLabel"
      :class="rootClass"
      @click="ctx.pop()"
    >
      <span
        class="flex size-8 shrink-0 items-center justify-center overflow-hidden"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <i
          class="pi pi-chevron-left size-4 shrink-0 leading-none text-[length:inherit] text-(--text-muted)"
          aria-hidden="true"
        />
      </span>
      <!-- Same label class as every other row, so Back reads at the rows' size, not smaller. -->
      <span class="min-w-0 flex-1 truncate text-center text-label-md">
        <slot>{{ text }}</slot>
      </span>
      <!--
        Balances the leading chevron's box so the label is centred against the FULL row rather
        than against the space left over beside the chevron — otherwise it sits half an icon
        box off-centre. Empty and hidden from assistive tech; it exists only to hold width.
      -->
      <span
        class="size-8 shrink-0"
        aria-hidden="true"
      />
    </button>
  </Teleport>
</template>
