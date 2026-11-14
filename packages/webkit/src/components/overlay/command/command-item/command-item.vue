<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, toRef, useAttrs, useId } from 'vue'

  import Kbd, { type KbdKeyName } from '../../../content/kbd/kbd.vue'
  import { CommandGroupIdKey, type CommandItemValue, useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandItem',
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
      value: CommandItemValue
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
  const groupId = inject(CommandGroupIdKey, null)

  const itemId = useId()
  const rootRef = ref<HTMLElement | null>(null)
  const labelRef = ref<HTMLElement | null>(null)
  const itemText = ref(String(props.value))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__item`
  )

  const haystack = computed(() => `${String(props.value)} ${itemText.value}`.toLowerCase())
  const isVisible = computed(() => {
    const q = ctx.query.value.trim().toLowerCase()
    return !q || haystack.value.includes(q)
  })

  const active = computed(() => ctx.activeValue.value === props.value)

  const NAMED_KEYS: Record<string, KbdKeyName> = {
    esc: 'escape',
    escape: 'escape',
    enter: 'enter',
    return: 'enter',
    space: 'space',
    tab: 'tab',
    backspace: 'backspace',
    delete: 'delete',
    del: 'delete'
  }
  const shortcutHint = computed(() => {
    const tokens = props.shortcut
      .toLowerCase()
      .split('+')
      .map((token) => token.trim())
      .filter(Boolean)
    if (!tokens.length) return null
    const last = tokens.at(-1) ?? ''
    const modifiers = tokens.slice(0, -1)
    const keyName: KbdKeyName | undefined = NAMED_KEYS[last]
    return {
      keyName,
      key: keyName ? '' : last.toUpperCase(),
      meta: modifiers.includes('meta'),
      ctrl: modifiers.includes('ctrl'),
      shift: modifiers.includes('shift'),
      alt: modifiers.includes('alt')
    }
  })

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
      id: itemId,
      groupId,
      disabled: disabledRef,
      isVisible,
      el: rootRef,
      activate
    })
  })

  onBeforeUnmount(() => {
    unregister?.()
  })
</script>

<template>
  <div
    ref="rootRef"
    v-show="isVisible"
    :id="itemId"
    v-bind="attrs"
    role="option"
    tabindex="-1"
    :aria-selected="active"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-active="active || undefined"
    :data-disabled="disabled || undefined"
    class="flex min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none data-[active]:bg-(--bg-selected) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)"
    @click="!disabled && activate($event)"
    @keydown.enter.prevent="!disabled && activate($event)"
    @keydown.space.prevent="!disabled && activate($event)"
    @mouseenter="!disabled && ctx.setActive(value)"
  >
    <span
      v-if="$slots['prefix']"
      :data-testid="`${testId}__prefix`"
      class="flex size-4 shrink-0 items-center justify-center overflow-hidden"
    >
      <slot name="prefix" />
    </span>

    <span
      ref="labelRef"
      class="flex-1 truncate text-start"
    >
      <slot />
    </span>

    <Kbd
      v-if="shortcutHint"
      :meta="shortcutHint.meta"
      :ctrl="shortcutHint.ctrl"
      :shift="shortcutHint.shift"
      :alt="shortcutHint.alt"
      :key-name="shortcutHint.keyName"
      size="small"
      >{{ shortcutHint.key }}</Kbd
    >
    <span
      v-else-if="$slots['suffix']"
      class="flex shrink-0 items-center"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>
