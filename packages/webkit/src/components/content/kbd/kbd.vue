<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Kbd', inheritAttrs: false })

  export type KbdSize = 'small' | 'medium'

  interface Props {
    /** Prepend the meta/command modifier glyph (⌘ on macOS, Ctrl elsewhere). */
    meta?: boolean
    /** Prepend the Control modifier glyph (⌃ on macOS, Ctrl elsewhere). */
    ctrl?: boolean
    /** Prepend the Shift modifier glyph (⇧). */
    shift?: boolean
    /** Prepend the Alt/Option modifier glyph (⌥ on macOS, Alt elsewhere). */
    alt?: boolean
    /** Size token; `small` is a denser keycap for menus, command bars, and table cells. */
    size?: KbdSize
  }

  const props = withDefaults(defineProps<Props>(), {
    meta: false,
    ctrl: false,
    shift: false,
    alt: false,
    size: 'medium'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-kbd')

  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const modifierGlyphs = computed<{ id: string; glyph: string }[]>(() => {
    const list: { id: string; glyph: string }[] = []
    if (props.meta) list.push({ id: 'meta', glyph: isMac.value ? '⌘' : 'Ctrl' })
    if (props.ctrl) list.push({ id: 'ctrl', glyph: isMac.value ? '⌃' : 'Ctrl' })
    if (props.alt) list.push({ id: 'alt', glyph: isMac.value ? '⌥' : 'Alt' })
    if (props.shift) list.push({ id: 'shift', glyph: '⇧' })
    return list
  })
</script>

<template>
  <kbd
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :class="attrs.class"
    class="inline-flex items-center justify-center gap-[var(--spacing-xxs)] tabular-nums leading-none bg-[var(--bg-surface)] text-[var(--text-default)] border border-b-2 border-[var(--border-default)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] data-[size=medium]:text-label-md data-[size=medium]:h-6 data-[size=medium]:min-w-6 data-[size=small]:text-label-sm data-[size=small]:h-5 data-[size=small]:min-w-5"
  >
    <span
      v-for="modifier in modifierGlyphs"
      :key="modifier.id"
      >{{ modifier.glyph }}</span
    >
    <slot />
  </kbd>
</template>
