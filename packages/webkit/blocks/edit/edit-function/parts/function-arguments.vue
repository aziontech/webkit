<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import { computed, ref, watch } from 'vue'

  import type { UseFunctionFieldsReturn } from '../composables/use-function-fields'
  import type { FunctionEditorField } from '../edit-function.vue'
  import { cleanSchema, loadMonaco } from '../lib/function-editor'
  import FunctionFieldItem from './function-field-item.vue'

  export interface FunctionArgumentsProps {
    /** The save is in flight: the editors and the field list lock. */
    saving: boolean
    /** Prefix of the ids inside the argument form. */
    formId: string
    /** The field list behaviour. */
    fields: UseFunctionFieldsReturn
  }

  defineProps<FunctionArgumentsProps>()

  const schema = defineModel<string>('schema', { required: true })
  const draftFields = defineModel<FunctionEditorField[]>('draftFields', { required: true })

  const schemaWidth = ref(420)
  const schemaExpanded = ref(true)
  const schemaHeight = ref(240)
  const splitEl = ref<HTMLElement | null>(null)
  const splitWidth = ref(0)
  const splitStacked = computed(() => splitWidth.value > 0 && splitWidth.value < 640)
  const schemaMax = computed(() => {
    if (splitStacked.value) return 480
    if (splitWidth.value === 0) return 720
    return Math.min(720, Math.max(280, Math.floor(splitWidth.value * 0.45)))
  })
  const setSchemaBasis = (value: number | undefined) => {
    if (value === undefined) return
    if (splitStacked.value) schemaHeight.value = value
    else schemaWidth.value = value
  }
  watch(splitEl, (el, _previous, onCleanup) => {
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      splitWidth.value = entry.contentRect.width
    })
    observer.observe(el)
    onCleanup(() => observer.disconnect())
  })

  const removeFormOpen = ref(false)
  const removeForm = () => {
    schema.value = cleanSchema
    draftFields.value = []
    removeFormOpen.value = false
  }

  const FIELD_LIST_CLASS =
    'relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) ' +
    '[&>[data-slot=item]:last-child]:border-b-transparent'
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-muted)">
        {{ draftFields.length }} {{ draftFields.length === 1 ? 'field' : 'fields' }}
      </span>
      <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
        <Button
          label="Add field"
          variant="outline"
          size="medium"
          icon="az az-plus"
          :disabled="saving"
          @click="fields.addField"
        />
        <ConfirmDialog
          v-model:open="removeFormOpen"
          title="Remove form"
          :description="`The ${draftFields.length} ${draftFields.length === 1 ? 'field' : 'fields'} of the argument form are removed. Discard brings them back until you save.`"
          confirm-label="Remove form"
          size="small"
          @confirm="removeForm"
        >
          <template #trigger>
            <Button
              label="Remove form"
              variant="outline"
              size="medium"
              icon="az az-x"
              :disabled="saving"
            />
          </template>
        </ConfirmDialog>
      </div>
    </div>
    <div
      ref="splitEl"
      class="flex min-h-0 flex-1"
    >
      <ResizableRoot
        class="w-full"
        :orientation="splitStacked ? 'vertical' : 'horizontal'"
        aria-label="Argument form"
      >
        <ResizablePane
          :basis="splitStacked ? schemaHeight : schemaWidth"
          v-model:open="schemaExpanded"
          collapsible
          :min="splitStacked ? 160 : 280"
          :max="schemaMax"
          aria-label="Schema"
          @update:basis="setSchemaBasis"
        >
          <div class="flex min-h-0 w-full flex-1 flex-col">
            <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div class="flex min-h-0 flex-1 flex-col">
                <CodeEditor
                  :readonly="saving"
                  v-model="schema"
                  language="json"
                  path="args.json"
                  fill
                  :bordered="false"
                  pad-line-numbers
                  :loader="loadMonaco"
                  aria-label="Argument form schema, as JSON"
                />
              </div>
            </div>
          </div>
        </ResizablePane>
        <ResizableHandle aria-label="Resize the schema" />
        <ResizablePane aria-label="Fields">
          <div
            v-if="draftFields.length === 0"
            class="flex min-h-0 flex-1 p-(--spacing-sm)"
          >
            <div class="flex min-h-0 flex-1">
              <EmptyState
                bordered
                icon="az az-circle-plus"
                title="This form has no fields"
                description="Add the first argument the service reads."
                class="w-full"
              >
                <template #actions>
                  <Button
                    label="Add field"
                    variant="secondary"
                    size="medium"
                    icon="az az-plus"
                    @click="fields.addField"
                  />
                  <Link
                    label="Read about arguments"
                    size="medium"
                    href="https://example.com/docs/arguments"
                    target="_blank"
                  />
                </template>
              </EmptyState>
            </div>
          </div>
          <div
            v-else
            class="min-h-0 flex-1 overflow-auto p-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--save-bar-inset,0rem))]"
          >
            <fieldset
              class="layout-column-form m-0 flex min-w-0 flex-col gap-(--spacing-sm) border-0 p-0"
              :disabled="saving"
            >
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <div :class="FIELD_LIST_CLASS">
                      <FunctionFieldItem
                        v-for="(field, index) in draftFields"
                        :key="field.id"
                        v-model:field="draftFields[index]"
                        :index="index"
                        :count="draftFields.length"
                        :form-id="formId"
                        :fields="fields"
                      />
                    </div>
                  </Item.List>
                </template>
              </Card>
            </fieldset>
          </div>
        </ResizablePane>
      </ResizableRoot>
    </div>
  </div>
</template>
