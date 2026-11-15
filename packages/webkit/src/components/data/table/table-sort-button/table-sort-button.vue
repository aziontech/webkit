<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { type SortDirection, TableInjectionKey } from '../injection-key'

  export type { SortDirection }

  defineOptions({
    name: 'TableSortButton',
    inheritAttrs: false
  })

  interface Props {
    /** Current sort direction shown by the glyph. */
    direction?: SortDirection
    /** Hides the button while keeping its layout slot. */
    visible?: boolean
  }
  export type TableSortButtonProps = Props

  const props = withDefaults(defineProps<Props>(), {
    direction: 'none',
    visible: true
  })

  const emit = defineEmits<{
    toggle: [direction: 'ascending' | 'descending']
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableSortButton: en.tableSortButton })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__sort-button` : 'data-table__sort-button')
  )

  const icon = computed<string>(() => {
    if (props.direction === 'ascending') return 'ai ai-arrow-up-wide-narrow'
    if (props.direction === 'descending') return 'ai ai-arrow-down-wide-narrow'
    return 'ai ai-sort'
  })

  const ariaLabel = computed<string>(() => {
    if (props.direction === 'ascending') return t('tableSortButton.ascending')
    if (props.direction === 'descending') return t('tableSortButton.descending')
    return t('tableSortButton.unsorted')
  })

  const onClick = () => {
    emit('toggle', props.direction === 'ascending' ? 'descending' : 'ascending')
  }
</script>

<template>
  <IconButton
    v-bind="{ ...$attrs, ariaLabel }"
    :icon="icon"
    kind="transparent"
    size="small"
    :data-testid="testId"
    :data-visible="visible"
    :data-direction="direction"
    class="data-[visible=false]:invisible data-[visible=false]:pointer-events-none"
    @click="onClick"
  />
</template>
