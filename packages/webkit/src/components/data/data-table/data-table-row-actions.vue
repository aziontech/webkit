<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'
  import DropdownMenu from '../../overlay/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuContent from '../../overlay/dropdown-menu/dropdown-menu-content.vue'
  import DropdownMenuItem from '../../overlay/dropdown-menu/dropdown-menu-item.vue'
  import DropdownMenuSeparator from '../../overlay/dropdown-menu/dropdown-menu-separator.vue'
  import DropdownMenuTrigger from '../../overlay/dropdown-menu/dropdown-menu-trigger.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableRowActions',
    inheritAttrs: false
  })

  export interface RowActionItem {
    label: string
    icon?: string
    command?: (rowData: Record<string, unknown>) => void
    disabled?: boolean | ((rowData: Record<string, unknown>) => boolean)
    visible?: boolean | ((rowData: Record<string, unknown>) => boolean)
    separator?: boolean
  }

  export interface InlineRowAction {
    icon: string
    label?: string
    command?: (rowData: Record<string, unknown>) => void
    disabled?: boolean | ((rowData: Record<string, unknown>) => boolean)
  }

  const props = withDefaults(
    defineProps<{
      /** Row data for action resolution. */
      rowData: Record<string, unknown>
      /** Menu actions array or resolver function. */
      actions: RowActionItem[] | ((rowData: Record<string, unknown>) => RowActionItem[])
      /** Optional single inline action instead of menu. */
      inlineAction?: InlineRowAction | null
    }>(),
    {
      inlineAction: null
    }
  )

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__row-actions`
  )

  const menuActions = computed(() => {
    if (typeof props.actions === 'function') return props.actions(props.rowData)
    return props.actions ?? []
  })

  const resolvedInlineDisabled = computed(() => {
    if (!props.inlineAction) return false
    if (typeof props.inlineAction.disabled === 'function') {
      return props.inlineAction.disabled(props.rowData)
    }
    return Boolean(props.inlineAction.disabled)
  })

  function executeInlineAction() {
    props.inlineAction?.command?.(props.rowData)
  }

  function runAction(action: RowActionItem) {
    action.command?.(props.rowData)
  }

  function isDisabled(action: RowActionItem) {
    if (typeof action.disabled === 'function') return action.disabled(props.rowData)
    return Boolean(action.disabled)
  }
</script>

<template>
  <div
    v-bind="attrs"
    class="flex items-center justify-end"
    :data-testid="testId"
  >
    <IconButton
      v-if="inlineAction"
      :icon="inlineAction.icon"
      :ariaLabel="inlineAction.label ?? 'Row action'"
      kind="transparent"
      size="small"
      :disabled="resolvedInlineDisabled"
      :data-testid="`${testId}__inline`"
      @click="executeInlineAction"
    />
    <DropdownMenu
      v-else
      :data-testid="`${testId}__menu`"
    >
      <DropdownMenuTrigger>
        <IconButton
          icon="pi pi-ellipsis-v"
          ariaLabel="Open row menu"
          kind="transparent"
          size="small"
          :data-testid="`${testId}__trigger`"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <template
          v-for="(action, index) in menuActions"
          :key="`${action.label}-${index}`"
        >
          <DropdownMenuSeparator v-if="action.separator" />
          <DropdownMenuItem
            v-else
            :label="action.label"
            :icon="action.icon"
            :disabled="isDisabled(action)"
            @select="runAction(action)"
          />
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
