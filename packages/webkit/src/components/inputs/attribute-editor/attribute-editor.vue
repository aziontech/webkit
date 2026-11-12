<script setup lang="ts" generic="TItem extends object = Record<string, unknown>">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
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
      /** Rows in list mode. Supports v-model:items. */
      items?: TItem[]
      /** Rows in grouped mode: every inner array is an AND group, groups are joined by OR. Supports v-model:groups. */
      groups?: TItem[][]
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
      empty?: string
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
      /** Accessible name of the list of rows. */
      ariaLabel?: string
    }>(),
    {
      items: () => [],
      groups: undefined,
      definition: () => [],
      errors: () => [],
      addButtonLabel: '',
      removeButtonLabel: '',
      addGroupLabel: '',
      empty: '',
      limit: undefined,
      groupLimit: undefined,
      minItems: 0,
      newItem: undefined,
      itemRemovable: undefined,
      size: 'medium',
      disabled: false,
      addDisabled: false,
      ariaLabel: ''
    }
  )

  const emit = defineEmits<{
    'update:items': [items: TItem[]]
    'update:groups': [groups: TItem[][]]
    add: [detail: { index: number; groupIndex?: number }]
    remove: [detail: { index: number; item: TItem; groupIndex?: number }]
  }>()

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
  const rootRef = ref<HTMLElement | null>(null)
  const addRef = ref<{ $el?: HTMLElement } | null>(null)
  const announcement = ref('')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-attribute-editor'
  )

  const grouped = computed(() => props.groups !== undefined)
  const groupList = computed<TItem[][]>(() =>
    grouped.value ? (props.groups ?? []) : [props.items]
  )
  const total = computed(() => groupList.value.reduce((sum, group) => sum + group.length, 0))

  const rowKeys = new WeakMap<object, string>()
  let nextKey = 0
  const rowKey = (item: TItem) => {
    let key = rowKeys.get(item)
    if (!key) {
      nextKey += 1
      key = `${baseId}-row-${nextKey}`
      rowKeys.set(item, key)
    }
    return key
  }

  const addLabel = computed(() => props.addButtonLabel || t('attributeEditor.add'))
  const groupAddLabel = computed(() => props.addGroupLabel || t('attributeEditor.addGroup'))
  const emptyText = computed(() => props.empty || t('attributeEditor.empty'))
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
    if (grouped.value) emit('update:groups', next)
    else emit('update:items', next[0] ?? [])
  }

  const createItem = (): TItem =>
    props.newItem
      ? props.newItem()
      : (Object.fromEntries(props.definition.map((column) => [column.key, ''])) as TItem)

  const focusRow = async (selector: string) => {
    await nextTick()
    const row = rootRef.value?.querySelector<HTMLElement>(selector)
    const target = row?.querySelector<HTMLElement>(
      'input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex="0"]'
    )
    if (target) {
      target.focus()
      return
    }
    addRef.value?.$el?.focus()
  }

  const rowSelector = (index: number, groupIndex: number | undefined) =>
    groupIndex === undefined
      ? `[data-row="${index}"]:not([data-group])`
      : `[data-group="${groupIndex}"][data-row="${index}"]`

  const add = (groupIndex?: number) => {
    const next = groupList.value.map((group) => [...group])
    const target = groupIndex ?? 0
    if (!next[target]) next[target] = []
    next[target].push(createItem())
    const index = next[target].length - 1
    commit(next)
    announcement.value = t('attributeEditor.added', { index: position(index, groupIndex) })
    emit('add', groupIndex === undefined ? { index } : { index, groupIndex })
    focusRow(rowSelector(index, groupIndex))
  }

  const addGroup = () => {
    const next = [...groupList.value.map((group) => [...group]), [createItem()]]
    const groupIndex = next.length - 1
    commit(next)
    announcement.value = t('attributeEditor.added', { index: total.value + 1 })
    emit('add', { index: 0, groupIndex })
    focusRow(rowSelector(0, groupIndex))
  }

  const remove = (index: number, groupIndex?: number) => {
    const target = groupIndex ?? 0
    const item = groupList.value[target]?.[index]
    if (!item || !removable(item)) return
    const spoken = position(index, groupIndex)
    let next = groupList.value.map((group) => [...group])
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
    emit('remove', groupIndex === undefined ? { index, item } : { index, item, groupIndex })
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
    const next = groupList.value.map((group) => [...group])
    next[target][index] = changed
    commit(next)
  }
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
    ref="rootRef"
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
        :key="grouped ? `group-${groupIndex}` : 'list'"
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
          class="flex min-w-0 flex-col gap-(--spacing-sm) data-[grouped]:rounded-(--shape-card) data-[grouped]:border data-[grouped]:border-(--border-muted) data-[grouped]:bg-(--bg-surface) data-[grouped]:p-(--spacing-md)"
          :data-grouped="grouped || null"
          :data-testid="grouped ? `${testId}__group` : undefined"
        >
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
              <span
                class="group-data-[size=small]/attribute-editor:w-7 group-data-[size=medium]/attribute-editor:w-8 group-data-[size=large]/attribute-editor:w-10"
              />
            </div>

            <ul
              class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-sm) p-0"
              :aria-label="!grouped ? ariaLabel || undefined : undefined"
            >
              <li
                v-for="(item, index) in group"
                :key="rowKey(item)"
                class="flex min-w-0 flex-col gap-(--spacing-sm) border-t border-(--border-muted) pt-(--spacing-sm) first:border-t-0 first:pt-0 @md/attribute-editor:border-t-0 @md/attribute-editor:pt-0 data-[joined]:border-t-0 data-[joined]:pt-0"
                :data-row="index"
                :data-group="grouped ? groupIndex : undefined"
                :data-joined="grouped && index > 0 ? '' : undefined"
                :data-testid="`${testId}__row`"
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
                  :remove="() => remove(index, grouped ? groupIndex : undefined)"
                  :removable="removable(item)"
                  :remove-label="removeLabel(position(index, grouped ? groupIndex : undefined))"
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
                    <div class="flex justify-end">
                      <slot
                        name="row-actions"
                        :item="item"
                        :index="index"
                        :group-index="grouped ? groupIndex : undefined"
                        :remove="() => remove(index, grouped ? groupIndex : undefined)"
                        :removable="removable(item)"
                        :remove-label="
                          removeLabel(position(index, grouped ? groupIndex : undefined))
                        "
                      >
                        <Tooltip
                          v-if="removable(item)"
                          :text="removeLabel(position(index, grouped ? groupIndex : undefined))"
                        >
                          <IconButton
                            icon="pi pi-trash"
                            kind="outlined"
                            :size="size"
                            :ariaLabel="
                              removeLabel(position(index, grouped ? groupIndex : undefined))
                            "
                            :data-testid="`${testId}__remove`"
                            @click="remove(index, grouped ? groupIndex : undefined)"
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
              icon="pi pi-plus"
              kind="outlined"
              size="small"
              :disabled="disabled || addDisabled || atLimit(group)"
              :data-testid="`${testId}__add`"
              @click="add(groupIndex)"
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
          ref="addRef"
          :label="addLabel"
          icon="pi pi-plus"
          kind="outlined"
          size="medium"
          :disabled="disabled || addDisabled || atLimit(items)"
          :data-testid="`${testId}__add`"
          @click="add()"
        />
        <Button
          v-else
          key="add-group"
          ref="addRef"
          :label="groupAddLabel"
          icon="pi pi-plus"
          kind="outlined"
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
  </div>
</template>
