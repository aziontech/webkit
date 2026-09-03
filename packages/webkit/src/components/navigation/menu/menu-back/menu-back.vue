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

  // Optional signature — the accessible name below checks whether the slot was passed.
  const slots = defineSlots<{
    default?(): unknown
  }>()

  const ctx = useMenuContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-back'
  )

  /** Follows the level's anchor, not the stack — a level still sliding out after a pop keeps its header. */
  const isVisible = computed(() => ctx.backHost.value !== null)

  /** The label of the trigger that opened the level this row belongs to. */
  const levelLabel = computed(() => {
    const levels = ctx.levels.value
    return levels.length > 0 ? levels[levels.length - 1].label : ''
  })

  /** Held over the slide-out — `levels` empties the instant a pop starts. */
  const lastLabel = ref('')
  watch(levelLabel, (value) => {
    if (value) lastLabel.value = value
  })

  const text = computed(() => props.label || levelLabel.value || lastLabel.value)

  /** Unset when the consumer slot renders: the slot then owns both visible text and accessible name. */
  const ariaLabel = computed(() => {
    if (slots.default) return undefined
    return text.value ? `Back to ${text.value}` : 'Back'
  })

  // Shares `menu-item`'s row geometry (height, padding, gap, icon box) so its label sits on
  // the column the rows beneath it establish.
  const ROOT_CLASS =
    // The bottom margin sets Back apart from the level's first group — it heads the level.
    // No motion of its own: it renders inside the current level, whose slide carries it.
    'group relative flex h-8 w-full shrink-0 items-center gap-(--spacing-xs) ' +
    'mb-(--spacing-sm) ' +
    // Symmetric insets: the label centres against the whole row, so leading and trailing
    // padding must match or it lands off-centre by their difference.
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
  <!-- Renders into the CURRENT level: that anchor exists only while a level is pushed, so
       `isVisible` and the host agree, the level's slide animates Back for free, and the
       root's flow never reserves a row that is about to leave. -->
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
      <!-- Balances the leading chevron's box so the label centres against the full row;
           empty and hidden from assistive tech, it exists only to hold width. -->
      <span
        class="size-8 shrink-0"
        aria-hidden="true"
      />
    </button>
  </Teleport>
</template>
