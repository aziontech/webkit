<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { selectContextKey } from '../injection-key'

  defineOptions({
    name: 'SelectOption',
    inheritAttrs: false
  })

  interface Props {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** PrimeIcons class for the leading decorative icon. */
    icon?: string
    /** Disables this single option; does not affect the parent select. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    icon: undefined,
    disabled: false
  })

  defineSlots<{
    default(): unknown
    left(): unknown
    tag(): unknown
  }>()

  const ctx = inject(selectContextKey)
  if (!ctx) {
    throw new Error('SelectOption must be used inside <Select>.')
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'select-option'
  )

  const selected = computed(() => ctx.isSelected(props.value))

  const onClick = () => {
    if (props.disabled) return
    ctx.toggleValue(props.value)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (props.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ctx.toggleValue(props.value)
    }
  }
</script>

<template>
  <div
    v-bind="$attrs"
    role="option"
    tabindex="-1"
    :aria-selected="selected"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-selected="selected || null"
    :data-disabled="disabled || null"
    :data-mode="ctx.multiple.value ? 'multiple' : 'single'"
    :class="attrs.class"
    class="flex h-8 cursor-pointer select-none items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)] outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:bg-[var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[selected]:bg-[var(--bg-selected)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot
      v-if="$slots['left']"
      name="left"
    />
    <i
      v-else-if="icon"
      :class="[icon, 'flex shrink-0 items-center text-[var(--text-default)]']"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span class="flex-1 truncate text-left">
      <slot />
    </span>
    <slot
      v-if="$slots['tag']"
      name="tag"
    />
    <i
      v-if="selected"
      class="pi pi-check shrink-0 text-[var(--text-default)]"
      aria-hidden="true"
      :data-testid="`${testId}__check`"
    />
  </div>
</template>
