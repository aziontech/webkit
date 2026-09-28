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

  /** Follows the level's own anchor, not the stack — a level still sliding out after a pop keeps its Back button. */
  const isVisible = computed(() => ctx.backHost.value !== null)

  /**
   * Where a pop LANDS — the level beneath the current one, not the level the reader is in.
   * Empty for the menu root, which has no trigger to name it — `label` names that one.
   */
  const destination = computed(() => {
    const levels = ctx.levels.value
    return props.label || (levels.length > 1 ? levels[levels.length - 2].label : '')
  })

  /** The visible text doubles as the accessible name, so the two can never disagree. */
  const text = computed(() => (destination.value ? `Back to ${destination.value}` : 'Back'))

  // A BUTTON, not a row: it hugs its label (`w-fit`) and left-aligns, unlike the nav rows
  // beneath it — the control that leaves the level should not read as one of them.
  const ROOT_CLASS =
    'group relative flex h-8 w-fit max-w-full shrink-0 items-center gap-(--spacing-xxs) ' +
    'mb-(--spacing-sm) ' +
    // Starts on `--spacing-sm`, the menu's content column, without the rows' 32px icon box.
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
      :class="rootClass"
      @click="ctx.pop()"
    >
      <!-- The chevron carries the whole "this goes back" reading, so it sits tight against the
           label rather than a row's icon-box away from it. -->
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
