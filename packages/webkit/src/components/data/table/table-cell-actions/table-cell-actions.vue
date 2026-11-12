<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import type { DropdownMenuOptionValue } from '../../../navigation/dropdown-menu/injection-key'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCellActions',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The row's name, for the trigger's accessible name (`Actions for edge-app`). Empty uses `Row actions`. */
      name?: string
      /** Disables the trigger. */
      disabled?: boolean
    }>(),
    {
      name: '',
      disabled: false
    }
  )

  const emit = defineEmits<{
    /** An option was chosen; `value` is the option's `value`. */
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue]
  }>()

  defineSlots<{
    /** `DropdownMenu.Group`s of `DropdownMenu.Option`s; destructive options in their own last group. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellActions: en.tableCellActions })
  const ctx = inject(TableInjectionKey, null)
  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell-actions` : 'data-table__cell-actions')
  )
  const label = computed<string>(() =>
    props.name ? t('tableCellActions.labelFor', { name: props.name }) : t('tableCellActions.label')
  )
</script>

<template>
  <DropdownMenu
    v-bind="$attrs"
    :data-testid="testId"
    placement="bottom-end"
    :disabled="disabled"
    @select="(event, value) => emit('select', event, value)"
  >
    <DropdownMenuTrigger>
      <IconButton
        icon="pi pi-ellipsis-h"
        kind="outlined"
        size="small"
        :ariaLabel="label"
        :disabled="disabled"
        :data-testid="`${testId}__trigger`"
      />
    </DropdownMenuTrigger>
    <slot />
  </DropdownMenu>
</template>
