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

  const onClick = () => {
    if (ctx.disabled.value || ctx.readonly.value) return
    ctx.setOpen(!ctx.open.value)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (ctx.disabled.value || ctx.readonly.value) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      ctx.setOpen(true)
    } else if (event.key === 'Escape' && ctx.open.value) {
      event.preventDefault()
      ctx.setOpen(false)
    }
  }
</script>

<template>
  <button
    :ref="
      (el) => {
        ctx.triggerRef.value = el as globalThis.HTMLElement | null
      }
    "
    v-bind="$attrs"
    type="button"
    role="combobox"
    :aria-haspopup="ctx.multiple.value ? 'listbox' : 'listbox'"
    :aria-expanded="ctx.open.value"
    :aria-controls="ctx.contentId"
    :aria-invalid="ctx.invalid.value || undefined"
    :aria-required="ctx.required.value || undefined"
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
    class="group relative flex w-full items-center gap-[var(--spacing-xs)] overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] text-label-sm text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[invalid]:border-[var(--danger-border)] data-[invalid]:focus-visible:ring-[var(--danger)] data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:hover:border-[var(--border-default)] data-[disabled]:focus-visible:ring-0 data-[disabled]:focus-visible:ring-offset-0 data-[readonly]:cursor-default"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot name="iconLeft" />
    <span
      class="flex-1 truncate text-left data-[filled=false]:text-[var(--text-muted)] group-data-[disabled]:text-[var(--text-disabled)]"
      :data-filled="ctx.filled.value"
      :data-testid="`${testId}__value`"
    >
      <template v-if="ctx.filled.value">{{ ctx.displayValue.value }}</template>
      <template v-else>{{ ctx.placeholder.value }}</template>
    </span>
    <i
      class="pi pi-chevron-down shrink-0 text-[var(--text-muted)] group-data-[disabled]:text-[var(--text-disabled)] transition-transform duration-150 ease-out motion-reduce:transition-none data-[state=open]:rotate-180"
      :data-state="ctx.open.value ? 'open' : 'closed'"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </button>
</template>
