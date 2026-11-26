<script setup lang="ts">
  import { computed, type FunctionalComponent, inject, renderSlot } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import Field from '../../field/field.vue'
  import FieldError from '../../field/field-error/field-error.vue'
  import FieldLabel from '../../field/field-label/field-label.vue'
  import Input from '../../input/input.vue'
  import { AttributeEditorInjectionKey } from '../injection-key'

  defineOptions({ name: 'AttributeEditorRow', inheritAttrs: false })

  const props = defineProps<{
    item: object
    index: number
    groupIndex: number | undefined
    grouped: boolean
    groupLength: number
    reorderShown: boolean
    removable: boolean
    itemKey: string
  }>()

  const ctx = inject(AttributeEditorInjectionKey)
  if (!ctx) throw new Error('AttributeEditorRow must be used inside AttributeEditor.')
  const { testId, hintId, move, drag } = ctx
  const { armed, dragging, dropEdge } = drag
  const editor = ctx.props
  const { t } = useTranslate({ attributeEditor: en.attributeEditor })

  const RootSlot: FunctionalComponent<{ name: string; scope: Record<string, unknown> }> = (
    slotProps,
    { slots }
  ) => renderSlot(ctx.slots, slotProps.name, { ...slotProps.scope }, slots['default'])

  const errors = computed(() => ctx.rowErrors(props.index, props.groupIndex))
  const place = computed(() => ({ index: ctx.position(props.index, props.groupIndex) }))
  const removeText = computed(() => ctx.removeLabel(place.value.index, props.item))
  const update = (key: string, value: unknown) =>
    ctx.update(props.index, props.groupIndex, key, value)
  const remove = (event: MouseEvent | KeyboardEvent) =>
    ctx.remove(event, props.index, props.groupIndex)

  const ROW_CLASS =
    'relative flex min-w-0 flex-col gap-(--spacing-sm) border-t border-(--border-muted) pt-(--spacing-sm) ' +
    'first:border-t-0 first:pt-0 ' +
    'group-data-[fit=md]:@md/attribute-editor:border-t-0 group-data-[fit=xl]:@xl/attribute-editor:border-t-0 group-data-[fit=3xl]:@3xl/attribute-editor:border-t-0 ' +
    'group-data-[fit=md]:@md/attribute-editor:pt-0 group-data-[fit=xl]:@xl/attribute-editor:pt-0 group-data-[fit=3xl]:@3xl/attribute-editor:pt-0 ' +
    'data-[joined]:border-t-0 data-[joined]:pt-0 ' +
    'data-[dragging]:rounded-(--shape-card) data-[dragging]:opacity-60 data-[dragging]:outline-dashed data-[dragging]:outline-2 data-[dragging]:outline-offset-2 ' +
    'data-[dragging]:outline-(--accent) ' +
    'data-[drop]:before:pointer-events-none data-[drop]:before:absolute data-[drop]:before:inset-x-0 data-[drop]:before:h-0.5 data-[drop]:before:bg-(--accent) ' +
    "data-[drop]:before:content-[''] data-[drop=before]:before:-top-(--spacing-2xs) data-[drop=after]:before:-bottom-(--spacing-2xs)"

  const fieldOf = (item: object, key: string): unknown => (item as Record<string, unknown>)[key]

  const ROW_FIELDS_CLASS =
    'flex min-w-0 grid-cols-[repeat(var(--attribute-editor-columns),minmax(0,1fr))_auto] flex-col gap-(--spacing-sm) ' +
    'group-data-[fit=md]:@md/attribute-editor:grid group-data-[fit=xl]:@xl/attribute-editor:grid group-data-[fit=3xl]:@3xl/attribute-editor:grid ' +
    'group-data-[fit=md]:@md/attribute-editor:items-start group-data-[fit=xl]:@xl/attribute-editor:items-start group-data-[fit=3xl]:@3xl/attribute-editor:items-start'

  const REMOVE_PLACEHOLDER_CLASS =
    'hidden ' +
    'group-data-[fit=md]:@md/attribute-editor:block group-data-[fit=xl]:@xl/attribute-editor:block group-data-[fit=3xl]:@3xl/attribute-editor:block ' +
    'group-data-[size=small]/attribute-editor:w-7 group-data-[size=medium]/attribute-editor:w-8 group-data-[size=large]/attribute-editor:w-10'
</script>

<template>
  <li
    :class="ROW_CLASS"
    :data-row="index"
    :data-group="groupIndex"
    :data-joined="grouped && index > 0 ? '' : undefined"
    :data-dragging="dragging('row', index, groupIndex)"
    :data-drop="dropEdge('row', index, groupIndex)"
    :draggable="armed === itemKey ? 'true' : undefined"
    :data-testid="`${testId}__row`"
  >
    <span
      v-if="grouped && index > 0"
      class="text-body-sm text-(--text-muted)"
      aria-hidden="true"
      >{{ t('attributeEditor.and') }}</span
    >
    <RootSlot
      name="row"
      :scope="{
        item,
        index,
        groupIndex,
        errors,
        update,
        remove,
        removable,
        removeLabel: removeText,
        move: (_event: MouseEvent | KeyboardEvent, offset: number) =>
          move.moveRow(index, groupIndex, index + offset)
      }"
    >
      <div :class="ROW_FIELDS_CLASS">
        <Field
          v-for="column in editor.definition"
          :key="column.key"
          class="min-w-0"
          :invalid="Boolean(errors[column.key])"
          :required="column.required"
          :disabled="editor.disabled"
          :data-testid="`${testId}__cell`"
        >
          <FieldLabel
            class="group-data-[fit=md]:@md/attribute-editor:sr-only group-data-[fit=xl]:@xl/attribute-editor:sr-only group-data-[fit=3xl]:@3xl/attribute-editor:sr-only"
            >{{ column.label }}</FieldLabel
          >
          <RootSlot
            :name="`cell-${column.key}`"
            :scope="{
              item,
              index,
              groupIndex,
              value: fieldOf(item, column.key),
              update: (value: unknown) => update(column.key, value),
              invalid: Boolean(errors[column.key])
            }"
          >
            <Input
              :model-value="String(fieldOf(item, column.key) ?? '')"
              :placeholder="column.placeholder ?? ''"
              :size="editor.size"
              autocomplete="off"
              :spellcheck="false"
              @update:model-value="(value: string) => update(column.key, value)"
            />
          </RootSlot>
          <FieldError v-if="errors[column.key]">{{ errors[column.key] }}</FieldError>
        </Field>
        <div class="flex justify-end gap-(--spacing-2xs)">
          <template v-if="reorderShown">
            <IconButton
              icon="az az-menu"
              variant="ghost"
              :size="editor.size"
              data-reorder="grip"
              :aria-label="t('attributeEditor.reorder', place)"
              :aria-describedby="hintId"
              :disabled="editor.disabled"
              :data-testid="`${testId}__grip`"
              class="cursor-grab active:cursor-grabbing"
              @pointerdown="drag.arm(itemKey)"
              @pointerup="drag.disarm"
              @pointercancel="drag.disarm"
              @keydown="move.onGripKeydown($event, index, groupIndex)"
            />
            <Tooltip :content="t('attributeEditor.moveUp', place)">
              <IconButton
                icon="az az-chevron-up"
                variant="outline"
                :size="editor.size"
                data-reorder="up"
                :ariaLabel="t('attributeEditor.moveUp', place)"
                :disabled="editor.disabled || index === 0"
                :data-testid="`${testId}__move-up`"
                @click="move.moveRow(index, groupIndex, index - 1)"
              />
            </Tooltip>
            <Tooltip :content="t('attributeEditor.moveDown', place)">
              <IconButton
                icon="az az-chevron-down"
                variant="outline"
                :size="editor.size"
                data-reorder="down"
                :ariaLabel="t('attributeEditor.moveDown', place)"
                :disabled="editor.disabled || index === groupLength - 1"
                :data-testid="`${testId}__move-down`"
                @click="move.moveRow(index, groupIndex, index + 1)"
              />
            </Tooltip>
          </template>
          <RootSlot
            name="row-actions"
            :scope="{
              item,
              index,
              groupIndex,
              remove: (event: MouseEvent | KeyboardEvent) => remove(event),
              removable,
              removeLabel: removeText
            }"
          >
            <Tooltip
              v-if="removable"
              :content="removeText"
            >
              <IconButton
                icon="az az-trash"
                variant="outline"
                :size="editor.size"
                :ariaLabel="removeText"
                :data-testid="`${testId}__remove`"
                @click="remove($event)"
              />
            </Tooltip>
            <span
              v-else
              aria-hidden="true"
              :class="REMOVE_PLACEHOLDER_CLASS"
            />
          </RootSlot>
        </div>
      </div>
    </RootSlot>
  </li>
</template>
