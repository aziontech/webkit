<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import Switch from '@aziontech/webkit/switch'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { UseRuleListPositionReturn } from '../composables/use-rule-list-position'
  import type { UseRuleListReorderReturn } from '../composables/use-rule-list-reorder'
  import type { RuleListPhaseOption } from '../lib/rule-list'
  import type { RuleListRule } from '../view-rule-list.vue'
  import RuleMoveCell from './rule-move-cell.vue'

  /** One phase as the list shows it. */
  export interface RulePhaseGroup extends RuleListPhaseOption {
    /** How many rules the phase has. */
    total: number
    /** The rules the search keeps. */
    items: RuleListRule[]
  }

  export interface RulePhaseTableProps {
    /** The phase and its rules. */
    group: RulePhaseGroup
    /** The table columns for the layout. */
    columns: TableColumn[]
    /** The rules are loading. */
    loading: boolean
    /** The save is in flight. */
    saving: boolean
    /** The narrow layout. */
    narrow: boolean
    /** The search text. */
    search: string
    /** Moving rules within their phase. */
    reorder: UseRuleListReorderReturn
    /** The typed position and the Move menu. */
    positioning: UseRuleListPositionReturn
  }

  const props = defineProps<RulePhaseTableProps>()

  const emit = defineEmits<{
    edit: [event: MouseEvent, rule: RuleListRule]
    'set-active': [rule: RuleListRule, value: boolean]
    'clear-search': []
  }>()

  const loadingRows = computed<RuleListRule[]>(() =>
    Array.from({ length: props.group.total || 3 }, (_, index) => ({
      id: `loading-${index}`,
      name: '',
      description: '',
      phase: props.group.value,
      author: '',
      modified: '',
      active: false,
      locked: false
    }))
  )

  const { pinned, canMove, lockReason, position, step, reorderRows, reorderable } = props.reorder
  const { positionValue, onPositionInput, commitPosition, cancelPosition, onMoveSelect } =
    props.positioning
</script>

<template>
  <DataTable
    :data="loading ? loadingRows : group.items"
    :columns="columns"
    row-key="id"
    :bordered="false"
    :loading="loading"
    :reorderable="!narrow"
    :row-reorderable="reorderable(group.value)"
    :aria-label="`${group.label} phase rules, in the order they run`"
    @update:data="(next: RuleListRule[]) => reorderRows(group.value, next)"
  >
    <template #cell-move="{ row }">
      <RuleMoveCell
        :row="row"
        :phase-label="group.label"
        :total="group.total"
        :narrow="narrow"
        :lock-reason="lockReason(group.value, row)"
        :position="position(group.value, row)"
        :pinned="pinned(group.value)"
        :can-move-up="canMove(group.value, position(group.value, row), -1)"
        :can-move-down="canMove(group.value, position(group.value, row), 1)"
        :position-value="positionValue(group.value, row)"
        @menu-select="(value) => onMoveSelect(group.value, row, value)"
        @step="
          (direction, control) => step(group.value, position(group.value, row), direction, control)
        "
        @position-input="(value) => onPositionInput(row, value)"
        @commit="(refocus) => commitPosition(group.value, row, refocus)"
        @cancel="cancelPosition"
      />
    </template>
    <template #cell-name="{ row }">
      <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
        <Button
          variant="link"
          :label="row.name"
          data-rule-name
          :aria-label="`Edit ${row.name}`"
          class="min-w-0"
          @click="(event: MouseEvent) => emit('edit', event, row)"
        />
        <Tag
          v-if="row.locked"
          label="Default"
          severity="neutral"
          size="small"
        />
      </div>
    </template>
    <template #cell-description="{ row }">
      <span class="min-w-0 truncate text-(--text-muted)">{{ row.description }}</span>
    </template>
    <template #cell-status="{ row }">
      <div class="flex min-h-10 min-w-0 items-center">
        <Field orientation="horizontal">
          <Switch
            :model-value="row.active"
            :disabled="row.locked || saving"
            :aria-label="`Run ${row.name}`"
            @update:model-value="(value: boolean) => emit('set-active', row, value)"
          />
          <Field.Label>
            <span
              class="text-body-sm max-md:sr-only"
              aria-hidden="true"
              >{{ row.active ? 'Active' : 'Inactive' }}</span
            >
          </Field.Label>
        </Field>
      </div>
    </template>
    <template #cell-modified="{ row }">
      <TableCellTime
        :value="row.modified"
        :author="row.author"
      />
    </template>
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-search"
        :title="`No ${group.label.toLowerCase()} rule matches “${search.trim()}”`"
      >
        <template #actions>
          <Button
            label="Clear search"
            variant="outline"
            size="small"
            @click="emit('clear-search')"
          />
        </template>
      </EmptyState>
    </template>
  </DataTable>
</template>
