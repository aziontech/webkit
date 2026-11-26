<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import Tooltip from '@aziontech/ui/tooltip'

  import type { RuleListControl } from '../lib/rule-list'
  import type { RuleListRule } from '../view-rule-list.vue'

  export interface RuleMoveCellProps {
    /** The rule of the row. */
    row: RuleListRule
    /** The label of its phase. */
    phaseLabel: string
    /** How many rules the phase has. */
    total: number
    /** The narrow layout: one Move menu instead of the position field and the arrows, and no drag handle. */
    narrow: boolean
    /** Why the rule cannot move, or nothing. */
    lockReason: string
    /** The zero-based position of the rule. */
    position: number
    /** How many locked rules lead the phase. */
    pinned: number
    /** The rule can move up. */
    canMoveUp: boolean
    /** The rule can move down. */
    canMoveDown: boolean
    /** The value the position field shows. */
    positionValue: string
  }

  defineProps<RuleMoveCellProps>()

  const emit = defineEmits<{
    'menu-select': [value: DropdownMenuItemValue]
    step: [direction: number, control: RuleListControl]
    'position-input': [value: string]
    commit: [refocus: boolean]
    cancel: []
  }>()

  const STEP_BUTTONS_CLASS =
    'flex items-center gap-(--spacing-2xs) opacity-0 transition-opacity ' +
    'duration-fast-02 ease-productive-entrance focus-within:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none [[data-reorder-row]:hover_&]:opacity-100'
</script>

<template>
  <div
    v-if="narrow"
    :data-rule-id="row.id"
    class="flex items-center justify-center"
  >
    <DropdownMenu
      side="bottom"
      align="end"
      :disabled="Boolean(lockReason)"
      @select="(_event, value) => emit('menu-select', value)"
    >
      <DropdownMenu.Trigger>
        <IconButton
          icon="az az-move-vertical"
          variant="ghost"
          size="medium"
          data-control="menu"
          :disabled="Boolean(lockReason)"
          :aria-label="
            lockReason
              ? `Move ${row.name}, position ${position + 1} of ${total}. ${lockReason}`
              : `Move ${row.name}, position ${position + 1} of ${total}`
          "
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Group>
        <DropdownMenu.Item
          value="top"
          label="Move to top"
          :disabled="!canMoveUp"
        />
        <DropdownMenu.Item
          value="up"
          label="Move up"
          :disabled="!canMoveUp"
        />
        <DropdownMenu.Item
          value="down"
          label="Move down"
          :disabled="!canMoveDown"
        />
        <DropdownMenu.Item
          value="bottom"
          label="Move to bottom"
          :disabled="!canMoveDown"
        />
      </DropdownMenu.Group>
    </DropdownMenu>
  </div>
  <div
    v-else
    :data-rule-id="row.id"
    class="flex items-center gap-(--spacing-2xs)"
  >
    <Tooltip :content="lockReason || 'Type a position to move the rule there'">
      <span class="inline-flex w-14 shrink-0 tabular-nums [&_input]:text-center">
        <Input
          :model-value="positionValue"
          size="small"
          inputmode="numeric"
          autocomplete="off"
          data-control="position"
          class="w-full"
          :disabled="Boolean(lockReason)"
          :aria-label="
            lockReason
              ? `Position ${position + 1} of ${row.name} in the ${phaseLabel} phase. ${lockReason}`
              : `Position of ${row.name} in the ${phaseLabel} phase. Type a number from ${pinned + 1} to ${total} to move it.`
          "
          @update:model-value="(value: string) => emit('position-input', value)"
          @focus="($event.target as HTMLInputElement).select()"
          @keydown.enter.prevent="emit('commit', true)"
          @keydown.esc.prevent="emit('cancel')"
          @blur="emit('commit', false)"
        />
      </span>
    </Tooltip>
    <span
      data-slot="step-buttons"
      :class="STEP_BUTTONS_CLASS"
    >
      <Tooltip :content="lockReason || 'Move up'">
        <IconButton
          icon="az az-chevron-up"
          variant="outline"
          size="small"
          data-control="up"
          :aria-label="lockReason ? `Move ${row.name} up. ${lockReason}` : `Move ${row.name} up`"
          :disabled="!canMoveUp"
          @click="emit('step', -1, 'up')"
        />
      </Tooltip>
      <Tooltip :content="lockReason || 'Move down'">
        <IconButton
          icon="az az-chevron-down"
          variant="outline"
          size="small"
          data-control="down"
          :aria-label="
            lockReason ? `Move ${row.name} down. ${lockReason}` : `Move ${row.name} down`
          "
          :disabled="!canMoveDown"
          @click="emit('step', 1, 'down')"
        />
      </Tooltip>
    </span>
  </div>
</template>
