<script setup lang="ts">
  import { computed, inject, nextTick, useAttrs } from 'vue'

  import { useElementListener } from '../../../../composables/use-element-listener'
  import { useListboxTrigger } from '../../../../composables/use-listbox-trigger'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Chip from '../../chip/chip.vue'
  import SelectTriggerButton from '../../select/parts/select-trigger-button.vue'
  import { MultiSelectInjectionKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectTrigger',
    inheritAttrs: false
  })

  const ctx = inject(MultiSelectInjectionKey)
  if (!ctx) {
    throw new Error('MultiSelectTrigger must be used inside MultiSelect.')
  }

  defineSlots<{
    /** Leading adornment before the value (an icon). */
    leading(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-trigger'
  )

  const { t } = useTranslate({ multiSelect: en.multiSelect })

  const field = computed(() => ctx.variant.value === 'chips' || ctx.searchable.value)

  const selection = computed(() => ctx.modelValue.value ?? [])
  const shownChips = computed(() => {
    const limit = ctx.chipLimit.value
    return limit > 0 ? selection.value.slice(0, limit) : selection.value
  })
  const hiddenChips = computed(() => selection.value.length - shownChips.value.length)

  const inputPlaceholder = computed(() => {
    if (ctx.variant.value === 'summary' && ctx.filled.value) return ctx.displayValue.value
    return ctx.filled.value ? '' : ctx.placeholder.value
  })

  const removeChip = (value: unknown) => {
    if (ctx.locked()) return
    ctx.toggleValue(value)
    ctx.focusControl()
  }

  const onFieldClick = (event: globalThis.MouseEvent) => {
    if (ctx.locked()) return
    const target = event.target as globalThis.Element | null
    const button = target?.closest('button')
    if (button && button !== ctx.controlEl.value) return
    ctx.focusControl()
    if (ctx.searchable.value) ctx.setOpen(true)
    else ctx.setOpen(!ctx.open.value)
  }

  useElementListener(() => (field.value ? ctx.triggerEl.value : null), 'click', onFieldClick)

  const onInput = (event: Event) => {
    if (ctx.locked()) return
    ctx.setQuery((event.target as globalThis.HTMLInputElement).value)
    ctx.setOpen(true)
  }

  const openAndNavigate = (key: string) => {
    const edge = key === 'ArrowDown' ? 'Home' : 'End'
    const wasOpen = ctx.open.value
    ctx.setOpen(true)
    if (wasOpen) ctx.navigate.value?.(edge)
    else void nextTick(() => nextTick(() => ctx.navigate.value?.(edge)))
  }

  const onInputEscape = (event: globalThis.KeyboardEvent) => {
    if (ctx.open.value) {
      event.preventDefault()
      ctx.setOpen(false)
    } else if (ctx.query.value) {
      event.preventDefault()
      ctx.setQuery('')
    }
  }

  const onInputKeydown = (event: globalThis.KeyboardEvent) => {
    if (ctx.locked()) return
    const key = event.key
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      openAndNavigate(key)
    } else if (key === 'Enter') {
      event.preventDefault()
      if (ctx.showCreate.value) ctx.create(event)
      else ctx.setOpen(true)
    } else if (key === 'Escape') {
      onInputEscape(event)
    } else if (key === 'Tab') {
      if (ctx.open.value) ctx.setOpen(false)
    } else if (key === 'Backspace' && !ctx.query.value && selection.value.length) {
      ctx.toggleValue(selection.value[selection.value.length - 1])
    }
  }

  const { onKeydown } = useListboxTrigger(ctx)

  const FIELD_ROOT_CLASS =
    'group relative flex w-full cursor-pointer flex-wrap items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) py-px ' +
    'ps-(--spacing-2xs) pe-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:border-(--border-strong) ' +
    'has-[[data-control]:focus-visible]:ring-2 has-[[data-control]:focus-visible]:ring-(--ring-color) has-[[data-control]:focus-visible]:ring-offset-2 ' +
    'has-[[data-control]:focus-visible]:ring-offset-(--bg-canvas) ' +
    'data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 ' +
    'data-[invalid]:border-(--danger-border) data-[invalid]:has-[[data-control]:focus-visible]:ring-(--danger) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:hover:border-(--border-default) ' +
    'data-[readonly]:cursor-default'

  const SEARCH_INPUT_CLASS =
    'h-6 min-w-16 flex-1 bg-transparent ps-(--spacing-2xs) text-label-sm pointer-coarse:text-body-md ' +
    'text-(--text-default) outline-none placeholder:text-(--text-muted) ' +
    'data-[filled]:placeholder:text-(--text-default) ' +
    'disabled:cursor-not-allowed disabled:placeholder:text-(--text-disabled)'

  const FIELD_CHEVRON_CLASS =
    'az az-chevron-down ms-auto shrink-0 text-(--text-muted) ' +
    'group-data-[disabled]:text-(--text-disabled) ' +
    'transition-transform duration-150 ease-out motion-reduce:transition-none ' +
    'data-[state=open]:rotate-180'
</script>

<template>
  <SelectTriggerButton
    v-if="!field"
    v-bind="$attrs"
    :ctx="ctx"
    :test-id="testId"
  >
    <template #leading><slot name="leading" /></template>
  </SelectTriggerButton>
  <div
    v-else
    :ref="ctx.triggerEl"
    v-bind="{ ...$attrs, ...ctx.stateAttrs.value }"
    :data-testid="testId"
    :data-variant="ctx.variant.value"
    :data-searchable="ctx.searchable.value || null"
    :data-filled="ctx.filled.value || null"
    :class="[FIELD_ROOT_CLASS, attrs.class]"
  >
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
    <slot name="leading" />
    <template v-if="ctx.variant.value === 'chips'">
      <Chip
        v-for="value in shownChips"
        :key="String(value)"
        :label="ctx.labelOf(value)"
        :removable="!ctx.locked()"
        :disabled="ctx.disabled.value"
        :data-testid="`${testId}__chip`"
        variant="filled"
        size="small"
        class="max-w-full"
        @remove="removeChip(value)"
      />
      <Chip
        v-if="hiddenChips > 0"
        :label="t('multiSelect.more', { count: hiddenChips })"
        :data-testid="`${testId}__more`"
        variant="outline"
        size="small"
      />
    </template>
    <input
      v-if="ctx.searchable.value"
      :ref="ctx.controlEl"
      v-bind="ctx.controlAttrs($attrs)"
      :aria-label="(attrs['aria-label'] as string | undefined) ?? ctx.ariaLabel.value"
      data-control
      type="text"
      :value="ctx.query.value"
      :placeholder="inputPlaceholder"
      aria-autocomplete="list"
      :readonly="ctx.readonly.value"
      :data-filled="(ctx.variant.value === 'summary' && ctx.filled.value) || null"
      :data-testid="`${testId}__input`"
      autocomplete="off"
      :spellcheck="false"
      autocapitalize="none"
      autocorrect="off"
      dir="auto"
      :class="SEARCH_INPUT_CLASS"
      @input="onInput"
      @keydown="onInputKeydown"
    />
    <button
      v-else
      :ref="ctx.controlEl"
      v-bind="ctx.controlAttrs($attrs)"
      data-control
      type="button"
      :aria-disabled="ctx.disabled.value || undefined"
      :data-testid="`${testId}__control`"
      @keydown="onKeydown"
      class="h-6 min-w-4 flex-1 truncate ps-(--spacing-2xs) text-start text-label-sm text-(--text-muted) outline-none disabled:cursor-not-allowed group-data-[disabled]:text-(--text-disabled)"
    >
      <template v-if="!ctx.filled.value">{{ ctx.placeholder.value }}</template>
    </button>
    <i
      :class="FIELD_CHEVRON_CLASS"
      :data-state="ctx.open.value ? 'open' : 'closed'"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </div>
</template>
