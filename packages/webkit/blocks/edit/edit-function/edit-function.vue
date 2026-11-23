<script setup lang="ts">
  import CodeEditor from '@aziontech/webkit/code-editor'
  import FieldError from '@aziontech/webkit/field-error'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, nextTick, reactive, ref, toRaw, useId, watch } from 'vue'

  import { useFunctionFields } from './composables/use-function-fields'
  import { documents, loadMonaco, runtimeLabel, tabs } from './lib/function-editor'
  import FunctionArguments from './parts/function-arguments.vue'
  import FunctionSaveBar from './parts/function-save-bar.vue'
  import FunctionSettingsTab from './parts/function-settings-tab.vue'
  import { sampleFields, sampleService } from './sample'

  /** The value type of one argument field. */
  export type FunctionEditorFieldType =
    'string' | 'integer' | 'number' | 'boolean' | 'select' | 'array'

  /** What every argument field carries, whatever its type. */
  export interface FunctionEditorFieldBase {
    /** Stable key of the row in the builder. */
    id: string
    /** The argument name the code reads. */
    key: string
    /** The label the form shows. */
    title: string
    /** The help text under the field. */
    description: string
    /** The form refuses to save without it. */
    required: boolean
    /** Shortest text allowed, as typed. */
    minLength: string
    /** Longest text allowed, as typed. */
    maxLength: string
    /** Pattern the text must match. */
    pattern: string
    /** Smallest number allowed, as typed. */
    minimum: string
    /** Largest number allowed, as typed. */
    maximum: string
    /** The choices of a choice field. */
    options: string[]
    /** The item type of a list field. */
    itemType: string
  }

  /** One field of the argument form, with a default that matches its type. */
  export type FunctionEditorField = FunctionEditorFieldBase &
    (
      | { type: 'boolean'; default: boolean }
      | { type: 'array'; default: string[] }
      | { type: 'string' | 'integer' | 'number' | 'select'; default: string }
    )

  /** Where the service runs. */
  export type FunctionEditorEnvironment = 'request' | 'gateway'

  /** The saved service the editor opens on. */
  export interface FunctionEditorService {
    /** The service name. */
    name: string
    /** Where the service runs. */
    executionEnvironment: FunctionEditorEnvironment
    /** Whether the service runs at all. */
    active: boolean
    /** The source code. */
    code: string
    /** The argument form schema, as JSON text. */
    schema: string
  }

  /** What a save sends: the service and its argument fields. */
  export interface FunctionEditorValues extends FunctionEditorService {
    /** The argument fields, in order. */
    fields: FunctionEditorField[]
  }

  /** A tab of the editor. */
  export type FunctionEditorTab = 'code' | 'settings'

  /** A document of the Code tab. */
  export type FunctionEditorDocument = 'code' | 'arguments'

  export interface FunctionEditorProps {
    /** The saved service; the editor opens on it and Discard returns to it. Left out, the sample renders. */
    service?: FunctionEditorService
    /** The saved argument fields. Left out, the sample fields render. */
    fields?: FunctionEditorField[]
    /** Unsaved edits the editor opens with on top of the service, so it starts dirty. */
    defaultDraft?: Partial<FunctionEditorService>
    /** Ids of the fields that open expanded. */
    defaultOpenKeys?: string[]
    /** The save is in flight: the save bar stays, Save spins, Discard and the editors lock. */
    loading?: boolean
    /** Why the save failed, shown in a danger alert in the save bar; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<FunctionEditorProps>(), {
    service: undefined,
    fields: undefined,
    defaultDraft: () => ({}),
    defaultOpenKeys: () => [],
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FunctionEditorValues]
    discard: [event: MouseEvent]
    'editor-ready': [editor: unknown]
  }>()

  const activeTab = defineModel<FunctionEditorTab>('tab', { default: 'code' })
  const activeDocument = defineModel<FunctionEditorDocument>('document', { default: 'code' })

  const slots = defineSlots<{
    /** Actions at the end of the editor toolbar, beside the document switch. */
    'editor-actions'(): unknown
    /** A pane under the Code document; when given, a handle splits it from the editor. */
    'code-panel'(): unknown
  }>()

  type SchemaField = FunctionEditorField

  const savedService = computed<FunctionEditorService>(() => props.service ?? sampleService)
  const savedFields = computed<SchemaField[]>(() => props.fields ?? sampleFields)

  const split = () => Boolean(slots['code-panel'])
  const SPLIT_CLASS =
    'flex min-h-0 w-full flex-1 flex-col max-md:overflow-y-auto! max-md:*:h-auto! max-md:*:shrink-0! max-md:*:basis-auto! ' +
    'max-md:*:first:h-[60dvh]! max-md:[&>[role=separator]]:hidden'
  const form = reactive<FunctionEditorService>({ ...savedService.value })
  const draftFields = ref<SchemaField[]>(structuredClone(toRaw(savedFields.value)))
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()
  const fieldList = useFunctionFields(draftFields, formId, props.defaultOpenKeys)
  const { moveStatus } = fieldList

  const guard = useUnsavedChanges(() => ({ form: { ...form }, fields: draftFields.value }))
  Object.assign(form, props.defaultDraft)
  const dirty = guard.isDirty
  const saving = computed(() => props.loading)
  const saveError = computed(() => props.error)

  watch(
    () => JSON.stringify({ service: savedService.value, fields: savedFields.value }),
    () => {
      Object.assign(form, savedService.value)
      draftFields.value = structuredClone(toRaw(savedFields.value))
      guard.commit()
    }
  )

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now || props.error) return
      guard.commit()
      toast.success(`${form.name} saved.`)
    }
  )

  const discard = (event: MouseEvent) => {
    const saved = structuredClone(toRaw(guard.baseline.value))
    Object.assign(form, saved.form)
    draftFields.value = saved.fields
    emit('discard', event)
  }
  const save = (event: Event) => {
    if (saving.value) return
    nameError.value = form.name.trim() ? '' : 'This field is required.'
    codeError.value = form.code.trim() ? '' : 'This field is required.'
    if (codeError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'code'
    }
    if (nameError.value) activeTab.value = 'settings'
    if (nameError.value || codeError.value) {
      const target = nameError.value ? 'service-name' : 'service-source-code'
      nextTick(() => document.getElementById(target)?.focus())
      return
    }
    emit('submit', event, { ...form, fields: structuredClone(toRaw(draftFields.value)) })
  }
  const onSaveShortcut = (event: KeyboardEvent) => {
    if (!dirty.value || saving.value) return
    save(event)
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <h1 class="sr-only">{{ form.name }}</h1>
    <PageTabs v-model="activeTab">
      <Tabs.Trigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </PageTabs>
    <section
      :data-tab="activeTab"
      class="flex min-h-0 flex-1 flex-col overflow-auto data-[tab=code]:overflow-hidden"
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <fieldset class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0">
          <legend class="sr-only">{{ form.name }} settings</legend>
          <p
            class="sr-only"
            aria-live="polite"
          >
            {{ moveStatus }}
          </p>
          <div
            v-show="activeTab === 'code'"
            class="flex min-h-0 flex-1 flex-col"
          >
            <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div
                class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <ToggleGroup
                  v-model="activeDocument"
                  :options="documents"
                  aria-label="Editor document"
                />
                <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
                  {{
                    activeDocument === 'code'
                      ? runtimeLabel + ', running on request'
                      : 'The fields an instance is asked for, and their defaults.'
                  }}
                </p>
                <slot name="editor-actions" />
              </div>
              <div class="flex min-h-0 flex-1 flex-col">
                <div
                  v-show="activeDocument === 'code'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <component
                    :is="split() ? ResizableRoot : 'div'"
                    :orientation="split() ? 'vertical' : undefined"
                    :aria-label="split() ? 'Code and test run' : undefined"
                    :class="split() ? SPLIT_CLASS : 'flex min-h-0 w-full flex-1 flex-col'"
                  >
                    <component
                      :is="split() ? ResizablePane : 'div'"
                      :aria-label="split() ? 'Source code' : undefined"
                      class="flex min-h-0 w-full flex-1 flex-col"
                    >
                      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                        <div class="flex min-h-0 flex-1 flex-col">
                          <CodeEditor
                            :readonly="saving"
                            id="service-source-code"
                            v-model="form.code"
                            language="javascript"
                            path="index.js"
                            fill
                            :bordered="false"
                            pad-line-numbers
                            :loader="loadMonaco"
                            :invalid="!!codeError"
                            aria-label="Source code"
                            @ready="(editor: unknown) => emit('editor-ready', editor)"
                            @update:model-value="codeError = ''"
                          />
                        </div>
                      </div>
                      <div
                        v-if="codeError"
                        class="px-(--spacing-sm) py-(--spacing-xs)"
                      >
                        <FieldError>{{ codeError }}</FieldError>
                      </div>
                    </component>
                    <slot name="code-panel" />
                  </component>
                </div>
                <div
                  v-show="activeDocument === 'arguments'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <FunctionArguments
                    v-model:schema="form.schema"
                    v-model:draft-fields="draftFields"
                    :saving="saving"
                    :form-id="formId"
                    :fields="fieldList"
                  />
                </div>
              </div>
            </div>
          </div>
          <FunctionSettingsTab
            v-show="activeTab === 'settings'"
            :form="form"
            v-model:name-error="nameError"
            :saving="saving"
            :name-message-id="nameMessageId"
            :group-name="groupName"
          />
        </fieldset>
      </div>
    </section>
    <FunctionSaveBar
      :open="dirty || saving"
      :saving="saving"
      :error="saveError"
      @shortcut="onSaveShortcut"
      @discard="discard"
      @save="save"
    />
  </div>
</template>
