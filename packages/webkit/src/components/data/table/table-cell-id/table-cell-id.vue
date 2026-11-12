<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import CopyButton from '../../../actions/copy-button/copy-button.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCellId',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The identifier shown and copied. */
      value?: string | number
      /** What the identifier belongs to, for the copy button's name (`Copy workload ID`). */
      resource?: string
    }>(),
    {
      value: '',
      resource: ''
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellId: en.tableCellId })
  const ctx = inject(TableInjectionKey, null)
  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell-id` : 'data-table__cell-id')
  )

  const text = computed<string>(() =>
    props.value === null || props.value === undefined ? '' : String(props.value)
  )
  const copyLabel = computed<string>(() =>
    props.resource
      ? t('tableCellId.copyResource', { resource: props.resource })
      : t('tableCellId.copy')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <span
      dir="ltr"
      class="min-w-0 flex-1 truncate text-start tabular-nums"
      >{{ text }}</span
    >
    <CopyButton
      v-if="text"
      kind="outlined"
      :value="text"
      :aria-label="copyLabel"
      :data-testid="`${testId}__copy`"
      class="ms-auto shrink-0"
    />
  </div>
</template>
