<script setup lang="ts">
  import { computed, inject, markRaw } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import AttributeEditor from '../../attribute-editor/attribute-editor.vue'
  import FieldDescription from '../../field/field-description/field-description.vue'
  import FieldError from '../../field/field-error/field-error.vue'
  import FieldGroup from '../../field/field-group/field-group.vue'
  import FieldLegend from '../../field/field-legend/field-legend.vue'
  import FieldSet from '../../field/field-set/field-set.vue'
  import { SchemaFormInjectionKey, type SchemaFormMapRow } from '../injection-key'
  import type { SchemaFormNode, SchemaFormSchema } from '../schema'
  import SchemaFormNodes from './schema-form-nodes.vue'

  defineOptions({ name: 'SchemaFormCollection', inheritAttrs: false })

  defineProps<{ node: SchemaFormNode }>()

  const ctx = inject(SchemaFormInjectionKey)
  if (!ctx) throw new Error('SchemaFormCollection must be used inside SchemaForm.')
  const {
    testId,
    errorOf,
    isDisabled,
    isReadonly,
    onFocusout,
    tokensOf,
    setRepeat,
    mapRowsOf,
    setMap
  } = ctx
  const { t } = useTranslate({ schemaForm: en.schemaForm })

  const newToken = () => markRaw({})

  const mapErrorsOf = (node: SchemaFormNode) =>
    ctx
      .duplicateRows(node)
      .map((duplicate) => (duplicate ? { key: t('schemaForm.duplicateKey') } : undefined))

  const mapColumns = computed(() => [
    { key: 'key', label: t('schemaForm.mapKey') },
    { key: 'value', label: t('schemaForm.mapValue') }
  ])

  const itemTitleOf = (node: SchemaFormNode) =>
    (node.schema.items as SchemaFormSchema | undefined)?.title ?? ''

  const addLabelOf = (node: SchemaFormNode) => {
    const title = itemTitleOf(node)
    if (!title) return ''
    const word = /^\p{Lu}\p{Ll}/u.test(title)
      ? title.charAt(0).toLocaleLowerCase() + title.slice(1)
      : title
    return t('schemaForm.addItem', { item: word })
  }

  const itemLabelOf = (node: SchemaFormNode, index: number) =>
    (node.schema.items as SchemaFormSchema | undefined)?.title
      ? `${(node.schema.items as SchemaFormSchema).title} ${index + 1}`
      : t('schemaForm.item', { index: index + 1 })
</script>

<template>
  <FieldSet
    :data-path="node.path"
    :data-widget="node.widget"
    :data-testid="`${testId}__set`"
    @focusout="onFocusout(node, $event)"
  >
    <FieldLegend>{{ node.label }}</FieldLegend>
    <FieldDescription v-if="node.description && !errorOf(node)">{{
      node.description
    }}</FieldDescription>
    <AttributeEditor
      key="repeat"
      v-if="node.widget === 'repeat'"
      :items="tokensOf(node)"
      :new-item="newToken"
      :min-items="node.schema.minItems ?? 0"
      :limit="node.schema.maxItems"
      :add-button-label="addLabelOf(node)"
      :disabled="isDisabled(node) || isReadonly(node)"
      :aria-label="node.label"
      @update:items="setRepeat(node, $event)"
    >
      <template #row="scope">
        <div
          role="group"
          :aria-label="itemLabelOf(node, scope.index)"
          class="flex min-w-0 flex-col gap-(--spacing-md) rounded-(--shape-card) border border-(--border-muted) p-(--spacing-md)"
          :data-testid="`${testId}__item`"
        >
          <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
            <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{
              itemLabelOf(node, scope.index)
            }}</span>
            <IconButton
              v-if="scope.removable"
              icon="az az-trash"
              variant="outline"
              size="small"
              :aria-label="scope.removeLabel"
              :data-testid="`${testId}__remove`"
              @click="scope.remove($event)"
            />
          </div>
          <FieldGroup>
            <SchemaFormNodes :nodes="node.entries[scope.index] ?? []" />
          </FieldGroup>
        </div>
      </template>
    </AttributeEditor>
    <AttributeEditor
      key="map"
      v-else
      :items="mapRowsOf(node)"
      :definition="mapColumns"
      :errors="mapErrorsOf(node)"
      :new-item="() => ({ key: '', value: '' })"
      :disabled="isDisabled(node) || isReadonly(node)"
      :aria-label="node.label"
      @update:items="setMap(node, $event as SchemaFormMapRow[])"
    />
    <FieldError
      v-if="errorOf(node)"
      :data-testid="`${testId}__error`"
      >{{ errorOf(node) }}</FieldError
    >
  </FieldSet>
</template>
