<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { selectContextKey } from '../injection-key'

  defineOptions({
    name: 'SelectTrigger',
    inheritAttrs: false
  })

  const ctx = inject(selectContextKey)
  if (!ctx) {
    throw new Error('SelectTrigger must be used inside <Select>.')
  }

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-trigger')

  const triggerId = computed(() => (attrs['id'] as string | undefined) ?? ctx.inputId.value)

  const accessibleName = computed(
    () => (attrs['aria-label'] as string | undefined) ?? (ctx.ariaLabel.value || undefined)
  )

  const activeDescendant = computed(() =>
    ctx.open.value && !ctx.multiple.value ? ctx.activeId.value : undefined
  )

  const onClick = () => {
    if (ctx.disabled.value || ctx.readonly.value) return
    ctx.setOpen(!ctx.open.value)
  }

  const isPrintable = (event: globalThis.KeyboardEvent) =>
    event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (ctx.disabled.value || ctx.readonly.value || event.defaultPrevented) return
    if (!ctx.open.value) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        ctx.openList('selected')
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        ctx.openList(event.key === 'Home' ? 'first' : 'last')
      } else if (isPrintable(event)) {
        event.preventDefault()
        ctx.openList('selected', event.key)
      }
      return
    }
    if (ctx.multiple.value) {
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault()
        ctx.close(true)
      }
      return
    }
    ctx.onListKeydown(event)
  }
</script>

<template>
  <button
    v-if="!ctx.native.value"
    :ref="
      (el) => {
        ctx.triggerRef.value = el as globalThis.HTMLElement | null
      }
    "
    v-bind="$attrs"
    :id="triggerId"
    type="button"
    :role="ctx.multiple.value ? undefined : 'combobox'"
    aria-haspopup="listbox"
    :aria-label="accessibleName"
    :aria-expanded="ctx.open.value"
    :aria-controls="ctx.contentId"
    :aria-activedescendant="activeDescendant"
    :aria-invalid="ctx.invalid.value || undefined"
    :aria-required="(ctx.required.value && !ctx.multiple.value) || undefined"
    :aria-disabled="ctx.disabled.value || undefined"
    :disabled="ctx.disabled.value"
    :data-testid="testId"
    :data-state="ctx.open.value ? 'open' : 'closed'"
    :data-size="ctx.size.value"
    :data-disabled="ctx.disabled.value || null"
    :data-readonly="ctx.readonly.value || null"
    :data-invalid="ctx.invalid.value || null"
    :data-required="ctx.required.value || null"
    :data-filled="ctx.filled.value || null"
    :class="attrs.class"
    class="group relative flex w-full items-center gap-(--spacing-xs) overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[invalid]:border-(--danger-border) data-[invalid]:focus-visible:ring-(--danger) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:hover:border-(--border-default) data-[disabled]:focus-visible:ring-0 data-[disabled]:focus-visible:ring-offset-0 data-[readonly]:cursor-default"
    @click="onClick"
    @keydown="onKeydown"
    @focus="ctx.setNavigating(true)"
    @blur="ctx.setNavigating(false)"
  >
    <slot name="iconLeft" />
    <span
      class="flex-1 truncate text-left data-[filled=false]:text-(--text-muted) group-data-[disabled]:text-(--text-disabled)"
      :data-filled="ctx.filled.value"
      :data-testid="`${testId}__value`"
    >
      <template v-if="ctx.filled.value">{{ ctx.displayValue.value }}</template>
      <template v-else>{{ ctx.placeholder.value }}</template>
    </span>
    <i
      class="pi pi-chevron-down shrink-0 text-(--text-muted) group-data-[disabled]:text-(--text-disabled) transition-transform duration-150 ease-out motion-reduce:transition-none data-[state=open]:rotate-180"
      :data-state="ctx.open.value ? 'open' : 'closed'"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </button>
</template>
