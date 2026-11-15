<script setup lang="ts">
  import { computed, inject, nextTick, useAttrs } from 'vue'

  import { useListboxTrigger } from '../../../../composables/use-listbox'
  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import Chip from '../../chip/chip.vue'
  import { multiSelectContextKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectTrigger',
    inheritAttrs: false
  })

  const ctx = inject(multiSelectContextKey)
  if (!ctx) {
    throw new Error('MultiSelectTrigger must be used inside MultiSelect.')
  }

  defineSlots<{
    /** Leading adornment before the value (an icon). */
    prefix(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-trigger'
  )
  const triggerId = computed(
    () => (attrs['id'] as string | undefined) ?? ctx.controlId.value ?? `${ctx.contentId}-trigger`
  )
  const describedBy = computed(
    () => (attrs['aria-describedby'] as string | undefined) ?? ctx.describedBy.value
  )

  const { t } = useTranslate({ multiSelect: en.multiSelect })

  const field = computed(() => ctx.kind.value === 'chips' || ctx.searchable.value)
  const locked = computed(() => ctx.disabled.value || ctx.readonly.value)

  const selection = computed(() => ctx.modelValue.value ?? [])
  const shownChips = computed(() => {
    const limit = ctx.chipLimit.value
    return limit > 0 ? selection.value.slice(0, limit) : selection.value
  })
  const hiddenChips = computed(() => selection.value.length - shownChips.value.length)

  const inputPlaceholder = computed(() => {
    if (ctx.kind.value === 'summary' && ctx.filled.value) return ctx.displayValue.value
    return ctx.filled.value ? '' : ctx.placeholder.value
  })

  const setControl = (el: unknown) => {
    ctx.controlRef.value = (el as globalThis.HTMLElement | null) ?? null
  }

  const removeChip = (value: unknown) => {
    if (locked.value) return
    ctx.toggleValue(value)
    ctx.focusControl()
  }

  const onFieldClick = (event: globalThis.MouseEvent) => {
    if (locked.value) return
    const target = event.target as globalThis.Element | null
    const button = target?.closest('button')
    if (button && button !== ctx.controlRef.value) return
    ctx.focusControl()
    if (ctx.searchable.value) ctx.setOpen(true)
    else ctx.setOpen(!ctx.open.value)
  }

  const onFieldKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.target !== ctx.controlRef.value) return
    if (ctx.searchable.value) onInputKeydown(event)
    else onKeydown(event)
  }

  const onInput = (event: Event) => {
    if (locked.value) return
    ctx.setQuery((event.target as globalThis.HTMLInputElement).value)
    ctx.setOpen(true)
  }

  const onInputKeydown = (event: globalThis.KeyboardEvent) => {
    if (locked.value) return
    const key = event.key
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      const wasOpen = ctx.open.value
      ctx.setOpen(true)
      if (wasOpen) ctx.navigate.value?.(key === 'ArrowDown' ? 'Home' : 'End')
      else
        void nextTick(() =>
          nextTick(() => ctx.navigate.value?.(key === 'ArrowDown' ? 'Home' : 'End'))
        )
      return
    }
    if (key === 'Enter') {
      event.preventDefault()
      if (ctx.showCreate.value) ctx.create(event)
      else ctx.setOpen(true)
      return
    }
    if (key === 'Escape') {
      if (ctx.open.value) {
        event.preventDefault()
        ctx.setOpen(false)
      } else if (ctx.query.value) {
        event.preventDefault()
        ctx.setQuery('')
      }
      return
    }
    if (key === 'Tab') {
      if (ctx.open.value) ctx.setOpen(false)
      return
    }
    if (key === 'Backspace' && !ctx.query.value && selection.value.length) {
      ctx.toggleValue(selection.value[selection.value.length - 1])
    }
  }

  const onClick = () => {
    if (ctx.disabled.value || ctx.readonly.value) return
    ctx.setOpen(!ctx.open.value)
  }

  const { onKeydown } = useListboxTrigger({
    open: ctx.open,
    setOpen: ctx.setOpen,
    locked: () => ctx.disabled.value || ctx.readonly.value,
    pendingFocus: ctx.pendingFocus
  })
</script>

<template>
  <button
    v-if="!field"
    :ref="
      (el) => {
        ctx.triggerRef.value = el as globalThis.HTMLElement | null
      }
    "
    v-bind="$attrs"
    type="button"
    :id="triggerId"
    :aria-describedby="describedBy"
    :aria-label="(attrs['aria-label'] as string | undefined) ?? ctx.ariaLabel.value"
    :aria-labelledby="(attrs['aria-labelledby'] as string | undefined) ?? ctx.ariaLabelledby.value"
    role="combobox"
    aria-haspopup="listbox"
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
    class="group relative flex w-full items-center gap-(--spacing-xs) overflow-hidden rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[invalid]:border-(--danger-border) data-[invalid]:focus-visible:ring-(--danger) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:hover:border-(--border-input) data-[disabled]:focus-visible:ring-0 data-[disabled]:focus-visible:ring-offset-0 data-[readonly]:cursor-default"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot name="prefix" />
    <span
      class="flex-1 truncate text-start data-[filled=false]:text-(--text-muted) group-data-[disabled]:text-(--text-disabled)"
      :data-filled="ctx.filled.value"
      :data-testid="`${testId}__value`"
    >
      <template v-if="ctx.filled.value">{{ ctx.displayValue.value }}</template>
      <template v-else>{{ ctx.placeholder.value }}</template>
    </span>
    <i
      class="ai ai-chevron-down shrink-0 text-(--text-muted) group-data-[disabled]:text-(--text-disabled) transition-transform duration-150 ease-out motion-reduce:transition-none data-[state=open]:rotate-180"
      :data-state="ctx.open.value ? 'open' : 'closed'"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </button>
  <div
    v-else
    :ref="
      (el) => {
        ctx.triggerRef.value = el as globalThis.HTMLElement | null
      }
    "
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="ctx.open.value ? 'open' : 'closed'"
    :data-size="ctx.size.value"
    :data-kind="ctx.kind.value"
    :data-searchable="ctx.searchable.value || null"
    :data-disabled="ctx.disabled.value || null"
    :data-readonly="ctx.readonly.value || null"
    :data-invalid="ctx.invalid.value || null"
    :data-required="ctx.required.value || null"
    :data-filled="ctx.filled.value || null"
    :class="attrs.class"
    class="group relative flex w-full cursor-pointer flex-wrap items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) py-px ps-(--spacing-2xs) pe-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) has-[[data-control]:focus-visible]:ring-2 has-[[data-control]:focus-visible]:ring-(--ring-color) has-[[data-control]:focus-visible]:ring-offset-2 has-[[data-control]:focus-visible]:ring-offset-(--bg-canvas) data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 data-[invalid]:border-(--danger-border) data-[invalid]:has-[[data-control]:focus-visible]:ring-(--danger) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:hover:border-(--border-default) data-[readonly]:cursor-default"
    @click="onFieldClick"
    @keydown="onFieldKeydown"
  >
    <slot name="prefix" />
    <template v-if="ctx.kind.value === 'chips'">
      <Chip
        v-for="value in shownChips"
        :key="String(value)"
        :label="ctx.labelOf(value)"
        :removable="!locked"
        :disabled="ctx.disabled.value"
        :data-testid="`${testId}__chip`"
        kind="filled"
        size="small"
        class="max-w-full"
        @remove="removeChip(value)"
      />
      <Chip
        v-if="hiddenChips > 0"
        :label="t('multiSelect.more', { count: hiddenChips })"
        :data-testid="`${testId}__more`"
        kind="outlined"
        size="small"
      />
    </template>
    <input
      v-if="ctx.searchable.value"
      :ref="setControl"
      data-control
      type="text"
      :id="triggerId"
      :value="ctx.query.value"
      :placeholder="inputPlaceholder"
      :aria-describedby="describedBy"
      :aria-label="(attrs['aria-label'] as string | undefined) ?? ctx.ariaLabel.value"
      :aria-labelledby="
        (attrs['aria-labelledby'] as string | undefined) ?? ctx.ariaLabelledby.value
      "
      role="combobox"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-expanded="ctx.open.value"
      :aria-controls="ctx.contentId"
      :aria-invalid="ctx.invalid.value || undefined"
      :aria-required="ctx.required.value || undefined"
      :disabled="ctx.disabled.value"
      :readonly="ctx.readonly.value"
      :data-filled="(ctx.kind.value === 'summary' && ctx.filled.value) || null"
      :data-testid="`${testId}__input`"
      autocomplete="off"
      :spellcheck="false"
      dir="auto"
      class="h-6 min-w-16 flex-1 bg-transparent ps-(--spacing-2xs) text-label-sm text-(--text-default) outline-none placeholder:text-(--text-muted) data-[filled]:placeholder:text-(--text-default) disabled:cursor-not-allowed disabled:placeholder:text-(--text-disabled)"
      @input="onInput"
    />
    <button
      v-else
      :ref="setControl"
      data-control
      type="button"
      :id="triggerId"
      :aria-describedby="describedBy"
      :aria-label="(attrs['aria-label'] as string | undefined) ?? ctx.ariaLabel.value"
      :aria-labelledby="
        (attrs['aria-labelledby'] as string | undefined) ?? ctx.ariaLabelledby.value
      "
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="ctx.open.value"
      :aria-controls="ctx.contentId"
      :aria-invalid="ctx.invalid.value || undefined"
      :aria-required="ctx.required.value || undefined"
      :aria-disabled="ctx.disabled.value || undefined"
      :disabled="ctx.disabled.value"
      :data-testid="`${testId}__control`"
      class="h-6 min-w-4 flex-1 truncate ps-(--spacing-2xs) text-start text-label-sm text-(--text-muted) outline-none disabled:cursor-not-allowed group-data-[disabled]:text-(--text-disabled)"
    >
      <template v-if="!ctx.filled.value">{{ ctx.placeholder.value }}</template>
    </button>
    <i
      class="ai ai-chevron-down ms-auto shrink-0 text-(--text-muted) group-data-[disabled]:text-(--text-disabled) transition-transform duration-150 ease-out motion-reduce:transition-none data-[state=open]:rotate-180"
      :data-state="ctx.open.value ? 'open' : 'closed'"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </div>
</template>
