<script setup lang="ts">
  import { computed, h, inject, useAttrs } from 'vue'

  import { SelectInjectionKey } from '../injection-key'
  import { pendingLabelNodes } from '../lib/pending-labels'
  import SelectPanel from '../parts/select-panel.vue'

  defineOptions({
    name: 'SelectContent',
    inheritAttrs: false
  })

  const ctx = inject(SelectInjectionKey)
  if (!ctx) {
    throw new Error('SelectContent must be used inside <Select>.')
  }

  const slots = defineSlots<{
    /** The options (SelectItem, SelectGroup). */
    default(): unknown
    /** Pinned above the list, for a search field. */
    search(): unknown
    /** Pinned below the list, for an action such as Create. */
    footer(): unknown
  }>()

  const attrs = useAttrs()

  const PendingLabels = () => pendingLabelNodes(slots.default?.(), ctx.isSelected)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-content')

  const panelWidth = () =>
    ctx.variant.value === 'ghost'
      ? null
      : { minWidth: 'var(--container-3xs)', width: `${ctx.triggerEl.value?.offsetWidth ?? 0}px` }

  const panel = () =>
    h(
      SelectPanel,
      {
        ...attrs,
        ctx,
        testId: testId.value,
        positioning: { collisionPadding: ctx.variant.value === 'ghost' ? 8 : { x: 0, y: 8 } },
        panelWidth,
        listbox: {
          textFieldSelector: 'input:not([type="checkbox"]):not([type="radio"]), textarea'
        },
        'data-variant': ctx.variant.value,
        class: ['data-[variant=ghost]:min-w-(--container-3xs)', attrs.class]
      },
      slots
    )
</script>

<template>
  <component :is="panel()" />
  <div
    v-if="!ctx.open.value && ctx.labelsPending.value"
    hidden
    :data-testid="`${testId}__labels`"
  >
    <PendingLabels />
  </div>
</template>
