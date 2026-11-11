<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { TableInjectionKey } from '../injection-key'

  export type SortDirection = 'none' | 'ascending' | 'descending'

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

  const props = withDefaults(defineProps<Props>(), {
    direction: 'none',
    visible: true
  })

  const emit = defineEmits<{
    toggle: [direction: 'ascending' | 'descending']
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ tableSortButton: en.tableSortButton })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__sort-button` : 'data-table__sort-button')
  )

  const icon = computed<string>(() => {
    if (props.direction === 'ascending') return 'pi pi-sort-amount-up'
    if (props.direction === 'descending') return 'pi pi-sort-amount-down'
    return 'pi pi-sort-alt'
  })

  const ariaLabel = computed<string>(() => {
    if (props.direction === 'ascending') return t('tableSortButton.ascending')
    if (props.direction === 'descending') return t('tableSortButton.descending')
    return t('tableSortButton.unsorted')
  })

  const handleClick = () => {
    emit('toggle', props.direction === 'ascending' ? 'descending' : 'ascending')
  }
</script>

<template>
  <IconButton
    :icon="icon"
    v-bind="{ ariaLabel }"
    kind="transparent"
    size="small"
    :data-testid="testId"
    :data-visible="visible"
    :data-direction="direction"
    class="data-[visible=false]:invisible data-[visible=false]:pointer-events-none"
    @click="handleClick"
  />
</template>
