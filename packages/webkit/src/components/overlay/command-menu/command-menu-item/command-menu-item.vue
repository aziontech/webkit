<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, toRef, useAttrs, useSlots } from 'vue'

  import Kbd from '../../../content/kbd/kbd.vue'
  import {
    CommandMenuGroupIdKey,
    type CommandMenuItemValue,
    useCommandMenuContext
  } from '../injection-key'

  defineOptions({
    name: 'CommandMenuItem',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    prefix(): unknown
    suffix(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Identifier emitted on the root `select` event when this item is activated. */
      value: CommandMenuItemValue
      /** Disables interaction; the item is skipped by roving navigation and never activates. */
      disabled?: boolean
      /** A `'+'`-delimited shortcut hint (e.g. `'meta+d'`) rendered on the right via `Kbd`. Display only. */
      shortcut?: string
    }>(),
    {
      disabled: false,
      shortcut: ''
    }
  )

  const attrs = useAttrs()
  const slots = useSlots()
  const ctx = useCommandMenuContext()
  const groupId = inject(CommandMenuGroupIdKey, null)

  const hasPrefix = computed(() => Boolean(slots['prefix']))

  const labelRef = ref<HTMLElement | null>(null)
  const itemText = ref(String(props.value))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__item`
  )

  const isVisible = computed(() => {
    const q = ctx.query.value.trim().toLowerCase()
    if (!q) return true
    return `${String(props.value)} ${itemText.value}`.toLowerCase().includes(q)
  })

  const shortcutTokens = computed(() =>
    props.shortcut
      .toLowerCase()
      .split('+')
      .map((token) => token.trim())
      .filter(Boolean)
  )
  const hasShortcut = computed(() => shortcutTokens.value.length > 0)
  const shortcutKey = computed(() => {
    const tokens = shortcutTokens.value
    return tokens.length ? tokens[tokens.length - 1].toUpperCase() : ''
  })
  const shortcutMeta = computed(() => shortcutTokens.value.slice(0, -1).includes('meta'))
  const shortcutCtrl = computed(() => shortcutTokens.value.slice(0, -1).includes('ctrl'))
  const shortcutShift = computed(() => shortcutTokens.value.slice(0, -1).includes('shift'))
  const shortcutAlt = computed(() => shortcutTokens.value.slice(0, -1).includes('alt'))

  function activate(event: globalThis.MouseEvent | globalThis.KeyboardEvent) {
    if (props.disabled) return
    ctx.select(event, props.value)
  }

  const disabledRef = toRef(props, 'disabled')
  let unregister: (() => void) | null = null

  onMounted(() => {
    itemText.value = labelRef.value?.textContent?.trim() || String(props.value)
    unregister = ctx.registerItem({
      value: props.value,
      groupId,
      disabled: disabledRef,
      isVisible,
      hasPrefix,
      activate
    })
  })

  onBeforeUnmount(() => {
    unregister?.()
  })
</script>

<template>
  <div
    v-show="isVisible"
    v-bind="attrs"
    role="option"
    tabindex="-1"
    :aria-selected="ctx.isActive(value)"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-active="ctx.isActive(value) || undefined"
    :data-disabled="disabled || undefined"
    class="flex min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none data-[active]:bg-(--bg-selected) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)"
    @click="!disabled && activate($event)"
    @keydown.enter.prevent="!disabled && activate($event)"
    @keydown.space.prevent="!disabled && activate($event)"
    @mouseenter="!disabled && ctx.setActive(value)"
  >
    <!--
      Rendered for every item once ANY item in the list carries a prefix, so the
      icon column is reserved and all labels start on the same x. The box is a
      fixed `size-4` — the same glyph size Menu rows use — so an item's own icon
      cannot widen the column and push its label out of line with the others.
    -->
    <span
      v-if="ctx.hasPrefixColumn.value"
      :data-testid="`${testId}__prefix`"
      class="flex size-4 shrink-0 items-center justify-center overflow-hidden"
    >
      <slot name="prefix" />
    </span>

    <span
      ref="labelRef"
      class="flex-1 truncate text-left"
    >
      <slot />
    </span>

    <Kbd
      v-if="hasShortcut"
      :meta="shortcutMeta"
      :ctrl="shortcutCtrl"
      :shift="shortcutShift"
      :alt="shortcutAlt"
      size="small"
      >{{ shortcutKey }}</Kbd
    >
    <span
      v-else-if="$slots['suffix']"
      class="flex shrink-0 items-center"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>
