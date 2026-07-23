<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, toRef, useAttrs } from 'vue'

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
  const ctx = useCommandMenuContext()
  const groupId = inject(CommandMenuGroupIdKey, null)

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
    class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none data-[active]:bg-[var(--bg-selected)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)]"
    @click="!disabled && activate($event)"
    @keydown.enter.prevent="!disabled && activate($event)"
    @keydown.space.prevent="!disabled && activate($event)"
    @mouseenter="!disabled && ctx.setActive(value)"
  >
    <span
      v-if="$slots['prefix']"
      class="flex shrink-0 items-center"
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
