<script setup lang="ts">
  import { useAttrs } from 'vue'

  import { useListboxTrigger } from '../../../../composables/use-listbox-trigger'
  import type { SelectRootContext } from '../../../../composables/use-select-root'

  defineOptions({
    name: 'SelectTriggerButton',
    inheritAttrs: false
  })

  export interface SelectTriggerButtonProps {
    /** Context of the select root the trigger opens. */
    ctx: SelectRootContext
    /** Test id of the trigger; its inner parts derive theirs from it. */
    testId: string
    /** Isolates the shown value from the trigger's own direction and marks it as the value part. */
    isolated?: boolean
    /** Base direction of the isolated value. */
    valueDir?: 'ltr' | 'rtl' | 'auto'
  }
  const props = defineProps<SelectTriggerButtonProps>()

  defineSlots<{
    /** Leading adornment before the value. */
    leading(): unknown
    /** Trailing adornment after the value, before the chevron. */
    trailing(): unknown
  }>()

  const attrs = useAttrs()

  const { onKeydown } = useListboxTrigger(props.ctx)

  const ROOT_CLASS =
    'group relative flex w-full items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) px-(--spacing-sm) text-label-sm ' +
    'text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 ' +
    'data-[invalid]:border-(--danger-border) data-[invalid]:focus-visible:ring-(--danger) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:hover:border-(--border-input) ' +
    'data-[disabled]:focus-visible:ring-0 data-[disabled]:focus-visible:ring-offset-0 ' +
    'data-[readonly]:cursor-default'

  const CHEVRON_CLASS =
    'az az-chevron-down shrink-0 text-(--text-muted) ' +
    'group-data-[disabled]:text-(--text-disabled) ' +
    'transition-transform duration-150 ease-out motion-reduce:transition-none ' +
    'data-[state=open]:rotate-180'
</script>

<template>
  <button
    :ref="ctx.triggerEl"
    v-bind="{ ...$attrs, ...ctx.stateAttrs.value, ...ctx.controlAttrs($attrs) }"
    type="button"
    :aria-disabled="ctx.disabled.value || undefined"
    :data-testid="testId"
    :data-filled="ctx.filled.value || null"
    :class="[ROOT_CLASS, attrs.class]"
    @click="ctx.setOpen(!ctx.open.value)"
    @keydown="onKeydown"
  >
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
    <slot name="leading" />
    <span
      class="flex-1 truncate text-start data-[filled=false]:text-(--text-muted) group-data-[disabled]:text-(--text-disabled)"
      :data-filled="ctx.filled.value"
      :data-slot="isolated ? 'value' : undefined"
      :data-testid="`${testId}__value`"
    >
      <bdi
        v-if="isolated && ctx.filled.value"
        :dir="valueDir"
        >{{ ctx.displayValue.value }}</bdi
      >
      <template v-else>{{
        ctx.filled.value ? ctx.displayValue.value : ctx.placeholder.value
      }}</template>
    </span>
    <slot name="trailing" />
    <i
      :class="CHEVRON_CLASS"
      :data-state="ctx.open.value ? 'open' : 'closed'"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </button>
</template>
