<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableViewAllFooter',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Footer CTA label. */
      label?: string
    }>(),
    {
      label: 'View all'
    }
  )

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__view-all-footer`
  )
</script>

<template>
  <div
    v-bind="attrs"
    class="flex justify-center border-t border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-sm)]"
    :data-testid="testId"
  >
    <Button
      kind="text"
      size="medium"
      :label="label"
      :data-testid="`${testId}__button`"
      @click="emit('click', $event)"
    />
  </div>
</template>
