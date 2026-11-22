<script setup lang="ts" generic="TItem extends object = Record<string, unknown>">
  import { computed, provide, ref, useAttrs, useId, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import Separator from '../../layout/separator/separator.vue'
  import { useAttributeEditorDrag } from './composables/use-attribute-editor-drag'
  import {
    type AttributeEditorRowsWiring,
    useAttributeEditorRows
  } from './composables/use-attribute-editor-rows'
  import { AttributeEditorInjectionKey } from './injection-key'
  import { createRowKeys, fitOf, positionIn, rowErrorsAt, rowItemAt } from './lib/rows'
  import AttributeEditorGroupBar from './parts/attribute-editor-group-bar.vue'
  import AttributeEditorRow from './parts/attribute-editor-row.vue'
  import type {
    AttributeEditorCellSlots,
    AttributeEditorColumn,
    AttributeEditorErrors,
    AttributeEditorRowActionsScope,
    AttributeEditorRowScope,
    AttributeEditorSize
  } from './types'

  defineOptions({
    name: 'AttributeEditor',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Columns of every row: key of the item field, label, placeholder, required. */
      definition?: AttributeEditorColumn[]
      /** Error per cell, aligned with the rows (nested per group in grouped mode). Empty shows none. */
      errors?: AttributeEditorErrors
      /** Label of the Add button. Empty uses the locale catalog. */
      addButtonLabel?: string
      /** Accessible name of the Remove button, followed by the row number. Empty uses the locale catalog. */
      removeButtonLabel?: string
      /** Label of the Add group button in grouped mode. Empty uses the locale catalog. */
      addGroupLabel?: string
      /** Text shown when there are no rows. Empty uses the locale catalog. */
      emptyTitle?: string
      /** Most rows allowed (per group in grouped mode); Add is disabled at the limit and the rows left are announced. */
      limit?: number
      /** Most groups allowed in grouped mode. */
      groupLimit?: number
      /** Fewest rows kept; rows at the minimum lose their Remove button. */
      minItems?: number
      /** Builds a new row. Unset creates an item with an empty string per column key. */
      newItem?: () => TItem
      /** Hides Remove on the rows it returns false for. Unset makes every row removable. */
      itemRemovable?: (item: TItem) => boolean
      /** Size of the default controls and the Remove button, on the 28 / 32 / 40 rhythm. */
      size?: AttributeEditorSize
      /** Disables every control, Add and Remove. */
      disabled?: boolean
      /** Disables Add only, for example until the last row is filled in. */
      addDisabled?: boolean
      /**
       * Shows a grip and Move up / Move down on every row (and every group in grouped mode) when there is
       * more than one; rows move by dragging the grip, with the buttons, with Arrow Up / Arrow Down on the
       * grip or Alt+Arrow Up / Alt+Arrow Down anywhere in the row. The new order goes out through v-model.
       */
      reorderable?: boolean
      /** Accessible name of the list of rows. */
      ariaLabel?: string
    }>(),
    {
      definition: () => [],
      errors: () => [],
      addButtonLabel: '',
      removeButtonLabel: '',
      addGroupLabel: '',
      emptyTitle: '',
      limit: undefined,
      groupLimit: undefined,
      minItems: 0,
      newItem: undefined,
      itemRemovable: undefined,
      size: 'medium',
      disabled: false,
      addDisabled: false,
      reorderable: false,
      ariaLabel: ''
    }
  )

  const emit = defineEmits<{
    add: [event: MouseEvent, detail: { index: number; groupIndex?: number }]
    remove: [
      event: MouseEvent | KeyboardEvent,
      detail: { index: number; item: TItem; groupIndex?: number }
    ]
  }>()

  const items = defineModel<TItem[]>('items', { default: () => [] })
  const groups = defineModel<TItem[][] | undefined>('groups')

  const slots = defineSlots<
    {
      row?(scope: AttributeEditorRowScope<TItem>): unknown
      empty?(): unknown
      actions?(): unknown
      info?(): unknown
      'row-actions'?(scope: AttributeEditorRowActionsScope<TItem>): unknown
      limit?(scope: { count: number; limit: number; left: number }): unknown
    } & AttributeEditorCellSlots<TItem>
  >()

  const attrs = useAttrs()
  const { t } = useTranslate({ attributeEditor: en.attributeEditor })
  const baseId = useId()
  const rootEl = ref<HTMLElement | null>(null)
  const addEl = ref<{ $el?: HTMLElement } | null>(null)
  const announcement = ref('')
  const hintId = `${baseId}-reorder-hint`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'attribute-editor')

  const grouped = computed(() => groups.value !== undefined)
  const groupList = computed<TItem[][]>(() =>
    grouped.value ? (groups.value ?? []) : [items.value]
  )
  const total = computed(() => groupList.value.reduce((sum, group) => sum + group.length, 0))

  const keys = createRowKeys(baseId)
  const rowKey = (item: TItem) => keys.keyOf(item, 'row')
  const groupKey = (group: TItem[]) => keys.keyOf(group, 'group')
  const cloneGroups = () => keys.clone(groupList.value)

  const addLabel = computed(() => props.addButtonLabel || t('attributeEditor.add'))
  const groupAddLabel = computed(() => props.addGroupLabel || t('attributeEditor.addGroup'))
  const emptyText = computed(() => props.emptyTitle || t('attributeEditor.emptyTitle'))
  const removeLabel = (position: number) =>
    t('attributeEditor.rowAction', {
      label: props.removeButtonLabel || t('attributeEditor.remove'),
      index: position
    })

  const columnCount = computed(() => Math.max(props.definition.length, 1))

  const atLimit = (group: TItem[]) => props.limit !== undefined && group.length >= props.limit
  const canAddGroup = computed(
    () =>
      !props.disabled &&
      (props.groupLimit === undefined || groupList.value.length < props.groupLimit)
  )
  const limitText = (group: TItem[]) => {
    if (props.limit === undefined) return ''
    const left = Math.max(props.limit - group.length, 0)
    return left === 0
      ? t('attributeEditor.limitReached', { limit: props.limit })
      : t('attributeEditor.remaining', { count: left })
  }

  const rowErrors = (index: number, groupIndex: number | undefined) =>
    rowErrorsAt(props.errors as unknown[], index, groupIndex)

  const removable = (item: TItem) =>
    !props.disabled &&
    total.value > props.minItems &&
    (props.itemRemovable ? props.itemRemovable(item) : true)

  const position = (index: number, groupIndex: number | undefined) =>
    positionIn(groupList.value, index, groupIndex)

  const commit = (next: TItem[][], message?: () => string) => {
    if (grouped.value) groups.value = next
    else items.value = next[0] ?? []
    if (message) announcement.value = message()
  }

  const wiring: AttributeEditorRowsWiring<TItem> = {
    grouped,
    groupList,
    total,
    keys,
    cloneGroups,
    commit,
    position,
    removable,
    say: (key, params) => t(`attributeEditor.${key}`, params),
    onAdd: (event, detail) => emit('add', event, detail),
    onRemove: (event, detail) => emit('remove', event, detail),
    rootEl,
    addEl
  }
  const move = useAttributeEditorRows(props, wiring)
  const { add, addGroup, remove, update } = move

  const rowReorderShown = (group: TItem[]) => props.reorderable && !slots.row && group.length > 1
  const groupReorderShown = computed(
    () => props.reorderable && grouped.value && groupList.value.length > 1
  )
  const actionCount = (group: TItem[]) => (rowReorderShown(group) ? 4 : 1)
  const fit = computed(() =>
    fitOf(columnCount.value, Math.max(1, ...groupList.value.map(actionCount)), props.size)
  )

  const drag = useAttributeEditorDrag(
    props,
    rootEl,
    (event) => rowItemAt(event, rootEl.value, groupList.value, grouped.value, rowKey),
    move.onRowKeydown,
    (scope, from, to, groupIndex) =>
      scope === 'group' ? move.moveGroup(from, to) : move.moveRow(from, groupIndex, to)
  )
  const { armed, onDragstart, onDragover, onDrop, onDragend, dragging, dropEdge } = drag

  provide(AttributeEditorInjectionKey, {
    testId,
    slots: useSlots(),
    props,
    hintId,
    groupCount: computed(() => groupList.value.length),
    rowErrors,
    position,
    removeLabel,
    update,
    remove,
    move,
    drag
  })

  const GROUP_CLASS =
    'relative flex min-w-0 flex-col gap-(--spacing-sm) ' +
    'data-[grouped]:rounded-(--shape-card) data-[grouped]:border data-[grouped]:border-(--border-muted) data-[grouped]:bg-(--bg-surface) data-[grouped]:p-(--spacing-md) ' +
    'data-[dragging]:opacity-60 data-[dragging]:outline-dashed data-[dragging]:outline-2 data-[dragging]:outline-offset-2 data-[dragging]:outline-(--accent) ' +
    'data-[drop]:before:pointer-events-none data-[drop]:before:absolute data-[drop]:before:inset-x-0 data-[drop]:before:h-0.5 data-[drop]:before:bg-(--accent) ' +
    "data-[drop]:before:content-[''] data-[drop=before]:before:-top-(--spacing-xs) data-[drop=after]:before:-bottom-(--spacing-xs)"

  const HEADER_CLASS =
    'hidden min-w-0 grid-cols-[repeat(var(--attribute-editor-columns),minmax(0,1fr))_auto] gap-(--spacing-sm) text-label-sm text-(--text-default) ' +
    'group-data-[fit=md]:@md/attribute-editor:grid group-data-[fit=xl]:@xl/attribute-editor:grid group-data-[fit=3xl]:@3xl/attribute-editor:grid'
</script>

<script lang="ts">
  export type {
    AttributeEditorCellScope,
    AttributeEditorCellSlots,
    AttributeEditorColumn,
    AttributeEditorErrors,
    AttributeEditorItem,
    AttributeEditorRowActionsScope,
    AttributeEditorRowErrors,
    AttributeEditorRowScope,
    AttributeEditorSize
  } from './types'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    class="group group/attribute-editor @container/attribute-editor flex w-full min-w-0 flex-col gap-(--spacing-md)"
    :style="{ '--attribute-editor-columns': String(columnCount) }"
    :data-testid="testId"
    :data-size="size"
    :data-fit="fit"
    :data-mode="grouped ? 'grouped' : 'list'"
    :data-disabled="disabled || null"
  >
    <p
      v-if="total === 0"
      class="m-0 text-body-sm text-(--text-muted)"
      :data-testid="`${testId}__empty`"
    >
      <slot name="empty">{{ emptyText }}</slot>
    </p>

    <component
      :is="grouped ? 'ol' : 'div'"
      v-if="total > 0"
      class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-sm) p-0"
      :aria-label="grouped ? ariaLabel || undefined : undefined"
    >
      <template
        v-for="(group, groupIndex) in groupList"
        :key="grouped ? groupKey(group) : 'list'"
      >
        <li
          v-if="grouped && groupIndex > 0"
          aria-hidden="true"
          class="list-none"
        >
          <Separator :label="t('attributeEditor.or')" />
        </li>
        <component
          :is="grouped ? 'li' : 'div'"
          :class="GROUP_CLASS"
          :data-grouped="grouped || null"
          :data-group-index="grouped ? groupIndex : undefined"
          :data-dragging="grouped ? dragging('group', groupIndex, undefined) : undefined"
          :data-drop="grouped ? dropEdge('group', groupIndex, undefined) : undefined"
          :draggable="grouped && armed === groupKey(group) ? 'true' : undefined"
          :data-testid="grouped ? `${testId}__group` : undefined"
          @dragstart="
            grouped && onDragstart($event, 'group', groupKey(group), groupIndex, undefined)
          "
          @dragover="grouped && onDragover($event, 'group', groupIndex, undefined)"
          @drop="grouped && onDrop($event, 'group', undefined)"
          @dragend="onDragend"
        >
          <AttributeEditorGroupBar
            v-if="groupReorderShown"
            :group-index="groupIndex"
            :group-key="groupKey(group)"
          />
          <div
            :role="grouped ? 'group' : undefined"
            :aria-label="
              grouped ? t('attributeEditor.group', { index: groupIndex + 1 }) : undefined
            "
            class="flex min-w-0 flex-col gap-(--spacing-sm)"
          >
            <div
              v-if="!slots.row && definition.length && group.length"
              aria-hidden="true"
              :class="HEADER_CLASS"
              :data-testid="`${testId}__header`"
            >
              <span
                v-for="column in definition"
                :key="column.key"
                class="min-w-0 truncate"
                >{{ column.label }}</span
              >
              <span class="flex justify-end gap-(--spacing-2xs)">
                <span
                  v-for="slot in actionCount(group)"
                  :key="slot"
                  class="group-data-[size=small]/attribute-editor:w-7 group-data-[size=medium]/attribute-editor:w-8 group-data-[size=large]/attribute-editor:w-10"
                />
              </span>
            </div>

            <ul
              class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-sm) p-0"
              :aria-label="!grouped ? ariaLabel || undefined : undefined"
            >
              <AttributeEditorRow
                v-for="(item, index) in group"
                :key="rowKey(item)"
                :item="item"
                :index="index"
                :group-index="grouped ? groupIndex : undefined"
                :grouped="grouped"
                :group-length="group.length"
                :reorder-shown="rowReorderShown(group)"
                :removable="removable(item)"
                :item-key="rowKey(item)"
              />
            </ul>
          </div>

          <div
            v-if="grouped"
            class="flex flex-wrap items-center gap-(--spacing-sm)"
          >
            <Button
              :label="addLabel"
              icon="az az-plus"
              variant="outline"
              size="small"
              :disabled="disabled || addDisabled || atLimit(group)"
              :data-testid="`${testId}__add`"
              @click="add($event, groupIndex)"
            />
            <span
              v-if="limit !== undefined"
              class="text-body-sm text-(--text-muted)"
              >{{ limitText(group) }}</span
            >
          </div>
        </component>
      </template>
    </component>

    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
        <Button
          v-if="!grouped"
          key="add"
          ref="addEl"
          :label="addLabel"
          icon="az az-plus"
          variant="outline"
          size="medium"
          :disabled="disabled || addDisabled || atLimit(items)"
          :data-testid="`${testId}__add`"
          @click="add($event)"
        />
        <Button
          v-else
          key="add-group"
          ref="addEl"
          :label="groupAddLabel"
          icon="az az-plus"
          variant="outline"
          size="medium"
          :disabled="!canAddGroup"
          :data-testid="`${testId}__add-group`"
          @click="addGroup"
        />
        <slot name="actions" />
      </div>
      <p
        v-if="!grouped && limit !== undefined"
        class="m-0 text-body-sm text-(--text-muted)"
        :data-testid="`${testId}__limit`"
      >
        <slot
          name="limit"
          :count="items.length"
          :limit="limit ?? 0"
          :left="Math.max((limit ?? 0) - items.length, 0)"
          >{{ limitText(items) }}</slot
        >
      </p>
      <slot name="info" />
    </div>

    <div
      role="status"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ announcement }}
    </div>
    <span
      v-if="reorderable"
      :id="hintId"
      class="sr-only"
      >{{ t('attributeEditor.reorderHint') }}</span
    >
  </div>
</template>
