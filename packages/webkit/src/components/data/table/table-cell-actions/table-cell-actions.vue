<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import type { DropdownMenuItemValue } from '../../../navigation/dropdown-menu/injection-key'

  defineOptions({
    name: 'TableCellActions',
    inheritAttrs: false
  })

  export interface TableCellActionsProps {
    /** The row's name, for the trigger's accessible name (`Actions for edge-app`). Empty uses `Row actions`. */
    name?: string
    /** Disables the trigger. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<TableCellActionsProps>(), {
    name: '',
    disabled: false
  })

  const emit = defineEmits<{
    /** An option was chosen; `value` is the option's `value`. */
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  defineSlots<{
    /** `DropdownMenu.Group`s of `DropdownMenu.Item`s; destructive items in their own last group. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellActions: en.tableCellActions })
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-cell-actions'
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
        icon="ai ai-ellipsis"
        variant="outline"
        size="small"
        :ariaLabel="label"
        :disabled="disabled"
        :data-testid="`${testId}__trigger`"
      />
    </DropdownMenuTrigger>
    <slot />
  </DropdownMenu>
</template>
