<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'

  defineOptions({ name: 'Kbd', inheritAttrs: false })

  export type KbdSize = 'small' | 'medium'

  export type KbdKeyName = keyof typeof en.kbd

  export type KbdKind = 'combined' | 'separate'

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
    /** Named key printed from the locale catalog (`escape` → `Esc`, `enter` → `Enter`); the slot still renders after it. */
    keyName?: KbdKeyName | ''
    /** A key sequence drawn after the modifier props and keyName; modifier and named keys print from the catalog. */
    keys?: string[]
    /** Visual variant: one keycap holding every key, or one keycap per key. */
    kind?: KbdKind
  }

  const props = withDefaults(defineProps<Props>(), {
    meta: false,
    ctrl: false,
    shift: false,
    alt: false,
    size: 'medium',
    keyName: '',
    keys: () => [],
    kind: 'combined'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const { t } = useTranslate({ kbd: en.kbd })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-kbd')

  const isMac = ref(false)

  onMounted(() => {
    isMac.value = /mac/i.test(navigator.platform || navigator.userAgent || '')
  })

  function modifierGlyph(name: string): string | null {
    if (name === 'meta') return isMac.value ? '⌘' : t('kbd.ctrl')
    if (name === 'ctrl') return isMac.value ? '⌃' : t('kbd.ctrl')
    if (name === 'alt') return isMac.value ? '⌥' : t('kbd.alt')
    if (name === 'shift') return '⇧'
    return null
  }

  function keyGlyph(key: string): string {
    const name = key.toLowerCase()
    const modifier = modifierGlyph(name)
    if (modifier) return modifier
    if (name in en.kbd) return t(`kbd.${name as KbdKeyName}`)
    return key.length === 1 ? key.toUpperCase() : key
  }

  const caps = computed<{ id: string; glyph: string }[]>(() => {
    const list: { id: string; glyph: string }[] = []
    for (const name of ['meta', 'ctrl', 'alt', 'shift'] as const) {
      if (props[name]) list.push({ id: name, glyph: modifierGlyph(name) ?? '' })
    }
    if (props.keyName) list.push({ id: 'key-name', glyph: t(`kbd.${props.keyName}`) })
    props.keys.forEach((key, index) => list.push({ id: `key-${index}`, glyph: keyGlyph(key) }))
    return list
  })
</script>

<template>
  <kbd
    dir="ltr"
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-kind="kind"
    :class="attrs.class"
    class="inline-flex items-center justify-center gap-(--spacing-2xs) tabular-nums leading-none bg-(--bg-surface) text-(--text-default) border border-b-2 border-(--border-default) rounded-(--shape-control) shadow-(--shadow-sm) px-(--spacing-xs) data-[size=medium]:text-overline-md data-[size=medium]:h-6 data-[size=medium]:min-w-6 data-[size=small]:text-overline-sm data-[size=small]:h-5 data-[size=small]:min-w-5 data-[kind=separate]:bg-transparent data-[kind=separate]:border-0 data-[kind=separate]:shadow-none data-[kind=separate]:px-0 data-[kind=separate]:min-w-0"
  >
    <template v-if="kind === 'separate'">
      <kbd
        v-for="cap in caps"
        :key="cap.id"
        :data-size="size"
        :data-testid="`${testId}__key`"
        class="inline-flex items-center justify-center bg-(--bg-surface) text-(--text-default) border border-b-2 border-(--border-default) rounded-(--shape-control) shadow-(--shadow-sm) px-(--spacing-xs) data-[size=medium]:h-6 data-[size=medium]:min-w-6 data-[size=small]:h-5 data-[size=small]:min-w-5"
        >{{ cap.glyph }}</kbd
      >
      <kbd
        v-if="$slots['default']"
        :data-size="size"
        :data-testid="`${testId}__key`"
        class="inline-flex items-center justify-center bg-(--bg-surface) text-(--text-default) border border-b-2 border-(--border-default) rounded-(--shape-control) shadow-(--shadow-sm) px-(--spacing-xs) data-[size=medium]:h-6 data-[size=medium]:min-w-6 data-[size=small]:h-5 data-[size=small]:min-w-5"
        ><slot
      /></kbd>
    </template>
    <template v-else>
      <span
        v-for="cap in caps"
        :key="cap.id"
        >{{ cap.glyph }}</span
      >
      <slot />
    </template>
  </kbd>
</template>
