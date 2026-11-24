<script setup lang="ts">
  import { computed, h, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import Checkbox from '../../checkbox/checkbox.vue'
  import SelectItemRow from '../../select/parts/select-item-row.vue'
  import { MultiSelectGroupInjectionKey, MultiSelectInjectionKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectItem',
    inheritAttrs: false
  })

  export interface MultiSelectItemProps {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** Azion icon class for the leading decorative icon. */
    icon?: string
    /** Disables this single option; does not affect the parent multi-select. */
    disabled?: boolean
  }
  const props = withDefaults(defineProps<MultiSelectItemProps>(), {
    icon: '',
    disabled: false
  })

  const slots = defineSlots<{
    default(): unknown
    leading(): unknown
    tag(): unknown
  }>()

  const ctx = inject(MultiSelectInjectionKey)
  if (!ctx) {
    throw new Error('MultiSelectItem must be used inside MultiSelect.')
  }

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'multi-select-item')

  const group = inject(MultiSelectGroupInjectionKey, null)

  const id = Symbol('MultiSelectItem')
  const labelText = ref('')
  const rowCtx = {
    ...ctx,
    registerLabel: (value: unknown, text: string) => {
      labelText.value = text
      ctx.registerLabel(value, text)
      ctx.registerOption(id, text)
    }
  }
  const visible = computed(() => ctx.matches(labelText.value))
  onMounted(() => group?.register(id, visible))
  onBeforeUnmount(() => {
    ctx.unregisterOption(id)
    group?.unregister(id)
  })

  const indicator = () =>
    h('span', { inert: '', 'aria-hidden': 'true', class: 'contents' }, [
      h(Checkbox, {
        modelValue: ctx.isSelected(props.value),
        class: 'pointer-events-none',
        tabindex: -1,
        'data-testid': `${testId.value}__indicator`
      })
    ])

  const row = () =>
    h(
      SelectItemRow,
      { ...attrs, ...props, ctx: rowCtx, testId: testId.value },
      { ...slots, indicator }
    )
</script>

<template>
  <component
    :is="row()"
    v-show="visible"
  />
</template>
