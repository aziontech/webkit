<script setup lang="ts" generic="TItem extends object = Record<string, unknown>">
  import { computed, nextTick, ref, toRaw, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Separator from '../../layout/separator/separator.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import Field from '../field/field.vue'
  import FieldError from '../field/field-error/field-error.vue'
  import FieldLabel from '../field/field-label/field-label.vue'
  import Input from '../input/input.vue'
  import type {
    AttributeEditorCellSlots,
    AttributeEditorColumn,
    AttributeEditorErrors,
    AttributeEditorRowActionsScope,
    AttributeEditorRowErrors,
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
      /** Shows a grip and Move up / Move down on every row (and every group in grouped mode) when there is more than one; rows move by dragging the grip, with the buttons, with Arrow Up / Arrow Down on the grip or Alt+Arrow Up / Alt+Arrow Down anywhere in the row. The new order goes out through v-model. */
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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-attribute-editor'
  )

  const grouped = computed(() => groups.value !== undefined)
  const groupList = computed<TItem[][]>(() =>
    grouped.value ? (groups.value ?? []) : [items.value]
  )
  const total = computed(() => groupList.value.reduce((sum, group) => sum + group.length, 0))

  const rowKeys = new WeakMap<object, string>()
  let nextKey = 0
  const keyOf = (target: object, prefix: string) => {
    const raw = toRaw(target)
    let key = rowKeys.get(raw)
    if (!key) {
      nextKey += 1
      key = `${baseId}-${prefix}-${nextKey}`
      rowKeys.set(raw, key)
    }
    return key
  }
  const rowKey = (item: TItem) => keyOf(item, 'row')
  const groupKey = (group: TItem[]) => keyOf(group, 'group')
  const cloneGroups = () =>
    groupList.value.map((group) => {
      const copy = [...group]
      rowKeys.set(copy, groupKey(group))
      return copy
    })

  const addLabel = computed(() => props.addButtonLabel || t('attributeEditor.add'))
  const groupAddLabel = computed(() => props.addGroupLabel || t('attributeEditor.addGroup'))
  const emptyText = computed(() => props.emptyTitle || t('attributeEditor.empty'))
  const removeLabel = (position: number) =>
    t('attributeEditor.rowAction', {
      label: props.removeButtonLabel || t('attributeEditor.remove'),
      index: position
    })

  const columnCount = computed(() => Math.max(props.definition.length, 1))
  const columnsStyle = computed(() => ({
    '--attribute-editor-columns': String(columnCount.value)
  }))

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

  const rowErrors = (index: number, groupIndex: number | undefined): AttributeEditorRowErrors => {
    const list = props.errors as unknown[]
    const entry = groupIndex === undefined ? list[index] : (list[groupIndex] as unknown[])?.[index]
    return entry && typeof entry === 'object' && !Array.isArray(entry)
      ? (entry as AttributeEditorRowErrors)
      : {}
  }

  const removable = (item: TItem) =>
    !props.disabled &&
    total.value > props.minItems &&
    (props.itemRemovable ? props.itemRemovable(item) : true)

  const position = (index: number, groupIndex: number | undefined) => {
    if (groupIndex === undefined) return index + 1
    return (
      groupList.value.slice(0, groupIndex).reduce((sum, group) => sum + group.length, 0) + index + 1
    )
  }

  const fieldOf = (item: TItem, key: string): unknown => (item as Record<string, unknown>)[key]

  const commit = (next: TItem[][]) => {
    if (grouped.value) groups.value = next
    else items.value = next[0] ?? []
  }

  const createItem = (): TItem =>
    props.newItem
      ? props.newItem()
      : (Object.fromEntries(props.definition.map((column) => [column.key, ''])) as TItem)

  const focusRow = async (selector: string) => {
    await nextTick()
    const row = rootEl.value?.querySelector<HTMLElement>(selector)
    const target = row?.querySelector<HTMLElement>(
      'input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex="0"]'
    )
    if (target) {
      target.focus()
      return
    }
    addEl.value?.$el?.focus()
  }

  const rowSelector = (index: number, groupIndex: number | undefined) =>
    groupIndex === undefined
      ? `[data-row="${index}"]:not([data-group])`
      : `[data-group="${groupIndex}"][data-row="${index}"]`

  const add = (event: MouseEvent, groupIndex?: number) => {
    const next = cloneGroups()
    const target = groupIndex ?? 0
    if (!next[target]) next[target] = []
    next[target].push(createItem())
    const index = next[target].length - 1
    commit(next)
    announcement.value = t('attributeEditor.added', { index: position(index, groupIndex) })
    emit('add', event, groupIndex === undefined ? { index } : { index, groupIndex })
    focusRow(rowSelector(index, groupIndex))
  }

  const addGroup = (event: MouseEvent) => {
    const next = [...cloneGroups(), [createItem()]]
    const groupIndex = next.length - 1
    commit(next)
    announcement.value = t('attributeEditor.added', { index: total.value + 1 })
    emit('add', event, { index: 0, groupIndex })
    focusRow(rowSelector(0, groupIndex))
  }

  const remove = (event: MouseEvent | KeyboardEvent, index: number, groupIndex?: number) => {
    const target = groupIndex ?? 0
    const item = groupList.value[target]?.[index]
    if (!item || !removable(item)) return
    const spoken = position(index, groupIndex)
    let next = cloneGroups()
    next[target].splice(index, 1)
    let focusGroup = groupIndex
    let focusIndex = index
    if (grouped.value && next[target].length === 0) {
      next = next.filter((_, i) => i !== target)
      focusGroup = Math.min(target, next.length - 1)
      focusIndex = 0
    } else if (focusIndex >= next[target].length) {
      focusIndex = next[target].length - 1
    }
    commit(next)
    announcement.value = t('attributeEditor.removed', { index: spoken })
    emit('remove', event, groupIndex === undefined ? { index, item } : { index, item, groupIndex })
    if (focusIndex < 0 || (focusGroup !== undefined && focusGroup < 0)) {
      focusRow('[data-none]')
      return
    }
    focusRow(rowSelector(focusIndex, focusGroup))
  }

  const update = (index: number, groupIndex: number | undefined, key: string, value: unknown) => {
    const target = groupIndex ?? 0
    const current = groupList.value[target]?.[index]
    if (!current) return
    const changed = { ...current, [key]: value } as TItem
    rowKeys.set(changed, rowKey(current))
    const next = cloneGroups()
    next[target][index] = changed
    commit(next)
  }

  type DragScope = 'row' | 'group'
  const drag = ref<{ scope: DragScope; index: number; groupIndex: number | undefined } | null>(null)
  const drop = ref<{
    index: number
    groupIndex: number | undefined
    edge: 'before' | 'after'
  } | null>(null)
  const armed = ref('')
  const hintId = `${baseId}-reorder-hint`

  const rowReorderShown = (group: TItem[]) => props.reorderable && !slots.row && group.length > 1
  const groupReorderShown = computed(
    () => props.reorderable && grouped.value && groupList.value.length > 1
  )
  const actionCount = (group: TItem[]) => (rowReorderShown(group) ? 4 : 1)

  const restoreFocus = async (active: Element | null, fallback: string) => {
    await nextTick()
    if (
      active instanceof HTMLElement &&
      active.isConnected &&
      rootEl.value?.contains(active) &&
      !active.matches(':disabled')
    ) {
      if (document.activeElement !== active) active.focus()
      return
    }
    rootEl.value?.querySelector<HTMLElement>(fallback)?.focus()
  }

  const moveRow = (index: number, groupIndex: number | undefined, to: number) => {
    if (!props.reorderable || props.disabled) return
    const target = groupIndex ?? 0
    const group = groupList.value[target]
    if (!group || to < 0 || to >= group.length || to === index) return
    const active = document.activeElement
    const next = cloneGroups()
    const [moved] = next[target].splice(index, 1)
    next[target].splice(to, 0, moved)
    commit(next)
    announcement.value = t('attributeEditor.moved', {
      from: position(index, groupIndex),
      to: position(to, groupIndex)
    })
    restoreFocus(active, `${rowSelector(to, groupIndex)} [data-reorder=grip]`)
  }

  const moveGroup = (groupIndex: number, to: number) => {
    if (!props.reorderable || props.disabled || !grouped.value) return
    if (to < 0 || to >= groupList.value.length || to === groupIndex) return
    const active = document.activeElement
    const next = cloneGroups()
    const [moved] = next.splice(groupIndex, 1)
    next.splice(to, 0, moved)
    commit(next)
    announcement.value = t('attributeEditor.groupMoved', { from: groupIndex + 1, to: to + 1 })
    restoreFocus(active, `[data-group-index="${to}"] [data-reorder=group-grip]`)
  }

  const offsetOf = (event: KeyboardEvent) =>
    event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0

  const onGripKeydown = (event: KeyboardEvent, index: number, groupIndex: number | undefined) => {
    const offset = offsetOf(event)
    if (!offset) return
    event.preventDefault()
    event.stopPropagation()
    moveRow(index, groupIndex, index + offset)
  }

  const onGroupGripKeydown = (event: KeyboardEvent, groupIndex: number) => {
    const offset = offsetOf(event)
    if (!offset) return
    event.preventDefault()
    event.stopPropagation()
    moveGroup(groupIndex, groupIndex + offset)
  }

  const onRowKeydown = (event: KeyboardEvent, index: number, groupIndex: number | undefined) => {
    if (!props.reorderable || !event.altKey || event.defaultPrevented) return
    const offset = offsetOf(event)
    if (!offset) return
    event.preventDefault()
    moveRow(index, groupIndex, index + offset)
  }

  const disarm = () => {
    armed.value = ''
  }

  const onDragstart = (
    event: DragEvent,
    scope: DragScope,
    key: string,
    index: number,
    groupIndex: number | undefined
  ) => {
    if (event.target !== event.currentTarget || armed.value !== key || props.disabled) return
    drag.value = { scope, index, groupIndex }
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
    }
  }

  const sameList = (scope: DragScope, groupIndex: number | undefined) =>
    drag.value !== null &&
    drag.value.scope === scope &&
    (scope === 'group' || drag.value.groupIndex === groupIndex)

  const onDragover = (
    event: DragEvent,
    scope: DragScope,
    index: number,
    groupIndex: number | undefined
  ) => {
    if (!sameList(scope, groupIndex)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const edge = event.clientY > rect.top + rect.height / 2 ? 'after' : 'before'
    drop.value = { index, groupIndex: scope === 'group' ? undefined : groupIndex, edge }
  }

  const onDragend = () => {
    drag.value = null
    drop.value = null
    disarm()
  }

  const onDrop = (event: DragEvent, scope: DragScope, groupIndex: number | undefined) => {
    if (!sameList(scope, groupIndex) || !drag.value || !drop.value) return
    event.preventDefault()
    const from = drag.value.index
    let to = drop.value.index + (drop.value.edge === 'after' ? 1 : 0)
    if (from < to) to -= 1
    onDragend()
    if (scope === 'group') moveGroup(from, to)
    else moveRow(from, groupIndex, to)
  }

  const dragging = (scope: DragScope, index: number, groupIndex: number | undefined) =>
    sameList(scope, groupIndex) && drag.value?.index === index ? '' : undefined

  const dropEdge = (scope: DragScope, index: number, groupIndex: number | undefined) =>
    sameList(scope, groupIndex) &&
    drop.value?.index === index &&
    (scope === 'group' || drop.value.groupIndex === groupIndex) &&
    drag.value?.index !== index
      ? drop.value.edge
      : undefined
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
    class="group/attribute-editor @container/attribute-editor flex w-full min-w-0 flex-col gap-(--spacing-md)"
    :style="columnsStyle"
    :data-testid="testId"
    :data-size="size"
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
          class="relative flex min-w-0 flex-col gap-(--spacing-sm) data-[grouped]:rounded-(--shape-card) data-[grouped]:border data-[grouped]:border-(--border-muted) data-[grouped]:bg-(--bg-surface) data-[grouped]:p-(--spacing-md) data-[dragging]:opacity-60 data-[dragging]:outline-dashed data-[dragging]:outline-2 data-[dragging]:outline-offset-2 data-[dragging]:outline-(--accent) data-[drop]:before:pointer-events-none data-[drop]:before:absolute data-[drop]:before:inset-x-0 data-[drop]:before:h-0.5 data-[drop]:before:bg-(--accent) data-[drop]:before:content-[''] data-[drop=before]:before:-top-(--spacing-xs) data-[drop=after]:before:-bottom-(--spacing-xs)"
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
          <div
            v-if="groupReorderShown"
            class="flex items-center gap-(--spacing-2xs)"
            :data-testid="`${testId}__group-reorder`"
          >
            <button
              type="button"
              data-reorder="group-grip"
              class="inline-flex size-7 shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing disabled:cursor-not-allowed disabled:text-(--text-disabled) disabled:hover:bg-transparent"
              :aria-label="t('attributeEditor.reorderGroup', { index: groupIndex + 1 })"
              :aria-describedby="hintId"
              :disabled="disabled"
              :data-testid="`${testId}__group-grip`"
              @pointerdown="armed = groupKey(group)"
              @pointerup="disarm"
              @pointercancel="disarm"
              @keydown="onGroupGripKeydown($event, groupIndex)"
            >
              <i
                class="ai ai-menu"
                aria-hidden="true"
              />
            </button>
            <span class="flex-1" />
            <Tooltip :content="t('attributeEditor.moveGroupUp', { index: groupIndex + 1 })">
              <IconButton
                icon="ai ai-chevron-up"
                variant="outline"
                size="small"
                data-reorder="group-up"
                :ariaLabel="t('attributeEditor.moveGroupUp', { index: groupIndex + 1 })"
                :disabled="disabled || groupIndex === 0"
                :data-testid="`${testId}__group-move-up`"
                @click="moveGroup(groupIndex, groupIndex - 1)"
              />
            </Tooltip>
            <Tooltip :content="t('attributeEditor.moveGroupDown', { index: groupIndex + 1 })">
              <IconButton
                icon="ai ai-chevron-down"
                variant="outline"
                size="small"
                data-reorder="group-down"
                :ariaLabel="t('attributeEditor.moveGroupDown', { index: groupIndex + 1 })"
                :disabled="disabled || groupIndex === groupList.length - 1"
                :data-testid="`${testId}__group-move-down`"
                @click="moveGroup(groupIndex, groupIndex + 1)"
              />
            </Tooltip>
          </div>
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
              class="hidden min-w-0 gap-(--spacing-sm) text-label-sm text-(--text-default) @md/attribute-editor:grid @md/attribute-editor:grid-cols-[repeat(var(--attribute-editor-columns),minmax(0,1fr))_auto]"
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
              <li
                v-for="(item, index) in group"
                :key="rowKey(item)"
                class="relative flex min-w-0 flex-col gap-(--spacing-sm) border-t border-(--border-muted) pt-(--spacing-sm) first:border-t-0 first:pt-0 @md/attribute-editor:border-t-0 @md/attribute-editor:pt-0 data-[joined]:border-t-0 data-[joined]:pt-0 data-[dragging]:rounded-(--shape-card) data-[dragging]:opacity-60 data-[dragging]:outline-dashed data-[dragging]:outline-2 data-[dragging]:outline-offset-2 data-[dragging]:outline-(--accent) data-[drop]:before:pointer-events-none data-[drop]:before:absolute data-[drop]:before:inset-x-0 data-[drop]:before:h-0.5 data-[drop]:before:bg-(--accent) data-[drop]:before:content-[''] data-[drop=before]:before:-top-(--spacing-2xs) data-[drop=after]:before:-bottom-(--spacing-2xs)"
                :data-row="index"
                :data-group="grouped ? groupIndex : undefined"
                :data-joined="grouped && index > 0 ? '' : undefined"
                :data-dragging="dragging('row', index, grouped ? groupIndex : undefined)"
                :data-drop="dropEdge('row', index, grouped ? groupIndex : undefined)"
                :draggable="armed === rowKey(item) ? 'true' : undefined"
                :data-testid="`${testId}__row`"
                @keydown="onRowKeydown($event, index, grouped ? groupIndex : undefined)"
                @dragstart="
                  onDragstart($event, 'row', rowKey(item), index, grouped ? groupIndex : undefined)
                "
                @dragover="onDragover($event, 'row', index, grouped ? groupIndex : undefined)"
                @drop="onDrop($event, 'row', grouped ? groupIndex : undefined)"
                @dragend="onDragend"
              >
                <span
                  v-if="grouped && index > 0"
                  class="text-body-sm text-(--text-muted)"
                  aria-hidden="true"
                  >{{ t('attributeEditor.and') }}</span
                >
                <slot
                  name="row"
                  :item="item"
                  :index="index"
                  :group-index="grouped ? groupIndex : undefined"
                  :errors="rowErrors(index, grouped ? groupIndex : undefined)"
                  :update="
                    (key: string, value: unknown) =>
                      update(index, grouped ? groupIndex : undefined, key, value)
                  "
                  :remove="
                    (event: MouseEvent | KeyboardEvent) =>
                      remove(event, index, grouped ? groupIndex : undefined)
                  "
                  :removable="removable(item)"
                  :remove-label="removeLabel(position(index, grouped ? groupIndex : undefined))"
                  :move="
                    (_event: MouseEvent | KeyboardEvent, offset: number) =>
                      moveRow(index, grouped ? groupIndex : undefined, index + offset)
                  "
                >
                  <div
                    class="flex min-w-0 flex-col gap-(--spacing-sm) @md/attribute-editor:grid @md/attribute-editor:grid-cols-[repeat(var(--attribute-editor-columns),minmax(0,1fr))_auto] @md/attribute-editor:items-start"
                  >
                    <Field
                      v-for="column in definition"
                      :key="column.key"
                      class="min-w-0"
                      :invalid="
                        Boolean(rowErrors(index, grouped ? groupIndex : undefined)[column.key])
                      "
                      :required="column.required"
                      :disabled="disabled"
                      :data-testid="`${testId}__cell`"
                    >
                      <FieldLabel class="@md/attribute-editor:sr-only">{{
                        column.label
                      }}</FieldLabel>
                      <slot
                        :name="`cell-${column.key}`"
                        :item="item"
                        :index="index"
                        :group-index="grouped ? groupIndex : undefined"
                        :value="fieldOf(item, column.key)"
                        :update="
                          (value: unknown) =>
                            update(index, grouped ? groupIndex : undefined, column.key, value)
                        "
                        :invalid="
                          Boolean(rowErrors(index, grouped ? groupIndex : undefined)[column.key])
                        "
                      >
                        <Input
                          :model-value="String(fieldOf(item, column.key) ?? '')"
                          :placeholder="column.placeholder ?? ''"
                          :size="size"
                          autocomplete="off"
                          :spellcheck="false"
                          @update:model-value="
                            (value: string) =>
                              update(index, grouped ? groupIndex : undefined, column.key, value)
                          "
                        />
                      </slot>
                      <FieldError
                        v-if="rowErrors(index, grouped ? groupIndex : undefined)[column.key]"
                        >{{
                          rowErrors(index, grouped ? groupIndex : undefined)[column.key]
                        }}</FieldError
                      >
                    </Field>
                    <div class="flex justify-end gap-(--spacing-2xs)">
                      <template v-if="rowReorderShown(group)">
                        <button
                          type="button"
                          data-reorder="grip"
                          class="inline-flex shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing disabled:cursor-not-allowed disabled:text-(--text-disabled) disabled:hover:bg-transparent group-data-[size=small]/attribute-editor:size-7 group-data-[size=medium]/attribute-editor:size-8 group-data-[size=large]/attribute-editor:size-10"
                          :aria-label="
                            t('attributeEditor.reorder', {
                              index: position(index, grouped ? groupIndex : undefined)
                            })
                          "
                          :aria-describedby="hintId"
                          :disabled="disabled"
                          :data-testid="`${testId}__grip`"
                          @pointerdown="armed = rowKey(item)"
                          @pointerup="disarm"
                          @pointercancel="disarm"
                          @keydown="onGripKeydown($event, index, grouped ? groupIndex : undefined)"
                        >
                          <i
                            class="ai ai-menu"
                            aria-hidden="true"
                          />
                        </button>
                        <Tooltip
                          :content="
                            t('attributeEditor.moveUp', {
                              index: position(index, grouped ? groupIndex : undefined)
                            })
                          "
                        >
                          <IconButton
                            icon="ai ai-chevron-up"
                            variant="outline"
                            :size="size"
                            data-reorder="up"
                            :ariaLabel="
                              t('attributeEditor.moveUp', {
                                index: position(index, grouped ? groupIndex : undefined)
                              })
                            "
                            :disabled="disabled || index === 0"
                            :data-testid="`${testId}__move-up`"
                            @click="moveRow(index, grouped ? groupIndex : undefined, index - 1)"
                          />
                        </Tooltip>
                        <Tooltip
                          :content="
                            t('attributeEditor.moveDown', {
                              index: position(index, grouped ? groupIndex : undefined)
                            })
                          "
                        >
                          <IconButton
                            icon="ai ai-chevron-down"
                            variant="outline"
                            :size="size"
                            data-reorder="down"
                            :ariaLabel="
                              t('attributeEditor.moveDown', {
                                index: position(index, grouped ? groupIndex : undefined)
                              })
                            "
                            :disabled="disabled || index === group.length - 1"
                            :data-testid="`${testId}__move-down`"
                            @click="moveRow(index, grouped ? groupIndex : undefined, index + 1)"
                          />
                        </Tooltip>
                      </template>
                      <slot
                        name="row-actions"
                        :item="item"
                        :index="index"
                        :group-index="grouped ? groupIndex : undefined"
                        :remove="
                          (event: MouseEvent | KeyboardEvent) =>
                            remove(event, index, grouped ? groupIndex : undefined)
                        "
                        :removable="removable(item)"
                        :remove-label="
                          removeLabel(position(index, grouped ? groupIndex : undefined))
                        "
                      >
                        <Tooltip
                          v-if="removable(item)"
                          :content="removeLabel(position(index, grouped ? groupIndex : undefined))"
                        >
                          <IconButton
                            icon="ai ai-trash"
                            variant="outline"
                            :size="size"
                            :ariaLabel="
                              removeLabel(position(index, grouped ? groupIndex : undefined))
                            "
                            :data-testid="`${testId}__remove`"
                            @click="remove($event, index, grouped ? groupIndex : undefined)"
                          />
                        </Tooltip>
                        <span
                          v-else
                          aria-hidden="true"
                          class="hidden @md/attribute-editor:block group-data-[size=small]/attribute-editor:w-7 group-data-[size=medium]/attribute-editor:w-8 group-data-[size=large]/attribute-editor:w-10"
                        />
                      </slot>
                    </div>
                  </div>
                </slot>
              </li>
            </ul>
          </div>

          <div
            v-if="grouped"
            class="flex flex-wrap items-center gap-(--spacing-sm)"
          >
            <Button
              :label="addLabel"
              icon="ai ai-plus"
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
          icon="ai ai-plus"
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
          icon="ai ai-plus"
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
