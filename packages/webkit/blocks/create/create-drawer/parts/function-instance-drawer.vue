<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor, {
    type CodeEditorMarker,
    type CodeEditorMonacoModule
  } from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SchemaForm from '@aziontech/webkit/schema-form'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import { parseJsonObject } from '../lib/parse-json-object'
  import { type FunctionInstanceRecord, sampleFunctionInstances, sampleFunctions } from '../sample'
  import FormDrawer from './form-drawer.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

  const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
    const [{ default: EditorWorker }, { default: JsonWorker }] = await Promise.all([
      import('monaco-editor/editor/editor.worker?worker'),
      import('monaco-editor/languages/features/json/json.worker?worker')
    ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => (label === 'json' ? new JsonWorker() : new EditorWorker())
    }
    return await import('monaco-editor')
  }

  const VIEWS = [
    { label: 'Fields', value: 'fields' },
    { label: 'JSON', value: 'json' }
  ]

  const instances = ref<FunctionInstanceRecord[]>([...sampleFunctionInstances])

  const open = ref(false)
  const editingId = ref('')
  const submitting = ref(false)
  const view = ref('fields')
  const schemaFormEl = ref<InstanceType<typeof SchemaForm> | null>(null)

  const form = reactive({ name: '', functionId: '', args: {} as Record<string, unknown> })
  const errors = reactive({ name: '', functionId: '' })
  const json = ref('{}')
  const jsonMarkers = ref<CodeEditorMarker[]>([])

  const selected = computed(() =>
    sampleFunctions.find((option) => option.value === form.functionId)
  )
  const functionLabel = (value: string) =>
    sampleFunctions.find((option) => option.value === value)?.label ?? ''
  const title = computed(() =>
    editingId.value ? 'Edit Function Instance' : 'Add Function Instance'
  )

  const stringify = (value: Record<string, unknown>) => JSON.stringify(value, null, 2)

  const openFor = (instance?: FunctionInstanceRecord) => {
    editingId.value = instance?.id ?? ''
    form.name = instance?.name ?? ''
    form.functionId = instance?.functionId ?? ''
    form.args = instance ? { ...instance.args } : {}
    json.value = stringify(form.args)
    jsonMarkers.value = []
    errors.name = ''
    errors.functionId = ''
    view.value = 'fields'
    submitting.value = false
    open.value = true
    nextTick(() => {
      schemaFormEl.value?.clearValidation()
      guard.commit()
    })
  }

  const onFunction = (value: string) => {
    form.functionId = value
    form.args = {}
    json.value = '{}'
    jsonMarkers.value = []
    errors.functionId = ''
  }

  watch(
    () => form.args,
    (value) => {
      if (view.value === 'fields') json.value = stringify(value)
    }
  )

  watch(view, (next) => {
    if (next === 'json' && !jsonMarkers.value.length) json.value = stringify(form.args)
  })

  const onJson = (text: string) => {
    json.value = text
    const result = parseJsonObject(text)
    if ('message' in result) {
      jsonMarkers.value = [{ line: 1, severity: 'danger', message: result.message }]
      return
    }
    jsonMarkers.value = []
    form.args = result.value
  }

  const validateArgs = async () => {
    if (jsonMarkers.value.length) {
      view.value = 'json'
      return false
    }
    if (!selected.value) return true
    view.value = 'fields'
    await nextTick()
    return (await schemaFormEl.value?.validate())?.valid ?? true
  }

  const submit = async () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    const argsValid = await validateArgs()
    if (errors.name || errors.functionId || !argsValid) return
    submitting.value = true
    setTimeout(() => {
      const record: FunctionInstanceRecord = {
        id: editingId.value || `instance-${instances.value.length + 1}`,
        name: form.name.trim(),
        functionId: form.functionId,
        args: { ...form.args }
      }
      instances.value = editingId.value
        ? instances.value.map((item) => (item.id === record.id ? record : item))
        : [...instances.value, record]
      submitting.value = false
      open.value = false
      toast.success(`${record.name} ${editingId.value ? 'saved' : 'added'}.`)
    }, 600)
  }

  const { guard, onOpenChange } = useDrawerGuard({
    open,
    busy: () => submitting.value,
    source: () => ({ ...form, json: json.value })
  })
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
      <h2 class="m-0 text-title-sm text-(--text-default)">Function instances</h2>
      <Button
        type="button"
        label="Add Function Instance"
        variant="outline"
        size="medium"
        icon="az az-plus"
        @click="openFor()"
      />
    </div>
    <Card :padded="false">
      <template #default>
        <Item.List aria-label="Function instances">
          <Item
            v-for="instance in instances"
            :key="instance.id"
            size="small"
          >
            <Item.Content>
              <Item.Title>{{ instance.name }}</Item.Title>
              <Item.Description>{{ functionLabel(instance.functionId) }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <IconButton
                icon="az az-pencil"
                variant="ghost"
                size="medium"
                :aria-label="`Edit ${instance.name}`"
                @click="openFor(instance)"
              />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </Card>
  </div>

  <FormDrawer
    :open="open"
    :title="title"
    description="An instance runs a function on this resource with its own arguments."
    :submit-label="editingId ? 'Save' : 'Add Function Instance'"
    :shortcut-label="editingId ? 'Save function instance' : 'Add function instance'"
    :busy="submitting"
    @update:open="onOpenChange"
    @submit="submit"
  >
    <SettingsGroup
      label="General"
      hint="The function this instance runs, and the name it is listed under."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field
          required
          :invalid="!!errors.functionId"
        >
          <Field.Label for="instance-function">Function</Field.Label>
          <Select
            :model-value="form.functionId"
            size="large"
            class="w-full"
            placeholder="Select a function"
            :disabled="submitting"
            :invalid="!!errors.functionId"
            :display-value="functionLabel"
            @update:model-value="onFunction"
          >
            <Select.Trigger
              id="instance-function"
              aria-describedby="instance-function-helper"
            />
            <Select.Content>
              <Select.Item
                v-for="option in sampleFunctions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Item>
            </Select.Content>
          </Select>
          <Field.Description id="instance-function-helper">{{
            errors.functionId ||
            (selected
              ? `${selected.runtime}. Changing the function clears the arguments.`
              : 'Its arguments appear below once a function is chosen.')
          }}</Field.Description>
        </Field>
        <Field
          required
          :invalid="!!errors.name"
        >
          <Field.Label>Name</Field.Label>
          <Input
            v-model="form.name"
            size="large"
            placeholder="resize-product-images"
            autocomplete="off"
            :spellcheck="false"
            :disabled="submitting"
            @update:model-value="errors.name = ''"
          />
          <Field.Description>{{
            errors.name || 'How this instance is listed on the resource.'
          }}</Field.Description>
        </Field>
      </div>
    </SettingsGroup>

    <SettingsGroup
      v-if="selected"
      label="Arguments"
      hint="The values this instance passes to the function, as the fields it declares or as JSON."
    >
      <div class="flex min-w-0 flex-col gap-(--spacing-md)">
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
          <ToggleGroup
            v-model="view"
            :options="VIEWS"
            aria-label="Arguments view"
            size="small"
          />
          <p class="m-0 min-w-0 truncate text-body-xs text-(--text-muted)">
            {{
              view === 'fields'
                ? 'The arguments this function declares.'
                : 'What this instance sends as its arguments.'
            }}
          </p>
        </div>
        <div v-show="view === 'fields'">
          <SchemaForm
            ref="schemaFormEl"
            v-model="form.args"
            :schema="selected.schema"
            validate-on="submit"
            :disabled="submitting"
          />
        </div>
        <div
          v-if="view === 'json'"
          class="flex min-w-0 flex-col gap-(--spacing-xs)"
        >
          <CodeEditor
            :model-value="json"
            language="json"
            path="args.json"
            height="16rem"
            :loader="loadMonaco"
            :markers="jsonMarkers"
            :invalid="jsonMarkers.length > 0"
            :disabled="submitting"
            aria-label="Arguments JSON"
            @update:model-value="onJson"
          />
          <FieldError v-if="jsonMarkers.length"
            >Fix the JSON to keep these arguments. The fields keep the last valid value.</FieldError
          >
          <FieldDescription v-else>Edits here update the fields.</FieldDescription>
        </div>
      </div>
    </SettingsGroup>
  </FormDrawer>

  <UnsavedChangesDialog
    :guard="guard"
    data-testid="unsaved-changes-dialog"
  />
</template>
