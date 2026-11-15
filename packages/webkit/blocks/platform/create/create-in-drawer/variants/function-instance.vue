<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor, {
    type CodeEditorMarker,
    type CodeEditorMonacoModule
  } from '@aziontech/webkit/code-editor'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SchemaForm, { type SchemaFormSchema } from '@aziontech/webkit/schema-form'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  interface FunctionOption {
    value: string
    label: string
    runtime: string
    schema: SchemaFormSchema
  }

  interface Instance {
    id: string
    name: string
    functionId: string
    args: Record<string, unknown>
  }

  const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
    const [{ default: EditorWorker }, { default: JsonWorker }] = await Promise.all([
      import('monaco-editor/editor/editor.worker?worker'),
      import('monaco-editor/languages/features/json/json.worker?worker')
    ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => (label === 'json' ? new JsonWorker() : new EditorWorker())
    }
    return (await import('monaco-editor')) as unknown as CodeEditorMonacoModule
  }

  const FUNCTIONS: FunctionOption[] = [
    {
      value: 'image-resizer',
      label: 'image-resizer',
      runtime: 'JavaScript',
      schema: {
        type: 'object',
        required: ['width'],
        properties: {
          width: {
            type: 'integer',
            title: 'Width',
            description: 'Largest width served, in pixels.',
            minimum: 16,
            maximum: 4096
          },
          quality: {
            type: 'integer',
            title: 'Quality',
            description: 'Compression quality from 1 to 100.',
            minimum: 1,
            maximum: 100,
            default: 80
          },
          format: {
            type: 'string',
            title: 'Format',
            enum: ['webp', 'avif', 'jpeg'],
            default: 'webp'
          },
          keepMetadata: {
            type: 'boolean',
            title: 'Keep metadata',
            description: 'Keeps EXIF data such as the camera and the capture date.',
            default: false
          }
        }
      }
    },
    {
      value: 'geo-redirect',
      label: 'geo-redirect',
      runtime: 'JavaScript',
      schema: {
        type: 'object',
        required: ['targetUrl'],
        properties: {
          targetUrl: {
            type: 'string',
            title: 'Target URL',
            format: 'uri',
            description: 'Where matching visitors are sent.'
          },
          countries: {
            type: 'array',
            title: 'Countries',
            description: 'Two-letter country codes, one per line. Empty matches every country.',
            items: { type: 'string', minLength: 2, maxLength: 2 }
          },
          status: {
            type: 'integer',
            title: 'Status code',
            enum: [301, 302, 307],
            default: 302
          }
        }
      }
    },
    {
      value: 'header-injector',
      label: 'header-injector',
      runtime: 'TypeScript',
      schema: {
        type: 'object',
        required: ['headers'],
        properties: {
          headers: {
            type: 'object',
            title: 'Headers',
            description: 'Added to every response.',
            additionalProperties: { type: 'string' }
          },
          overwrite: {
            type: 'boolean',
            title: 'Overwrite existing headers',
            default: false
          }
        }
      }
    }
  ]

  const VIEWS = [
    { label: 'Fields', value: 'fields' },
    { label: 'JSON', value: 'json' }
  ]

  const instances = ref<Instance[]>([
    {
      id: 'instance-1',
      name: 'resize-product-images',
      functionId: 'image-resizer',
      args: { width: 800, quality: 75, format: 'avif', keepMetadata: false }
    },
    {
      id: 'instance-2',
      name: 'eu-storefront',
      functionId: 'geo-redirect',
      args: { targetUrl: 'https://eu.example.com', countries: ['DE', 'FR'], status: 302 }
    }
  ])

  const open = ref(false)
  const editingId = ref('')
  const submitting = ref(false)
  const view = ref('fields')
  const schemaForm = ref<InstanceType<typeof SchemaForm> | null>(null)

  const form = reactive({ name: '', functionId: '', args: {} as Record<string, unknown> })
  const errors = reactive({ name: '', functionId: '' })
  const json = ref('{}')
  const jsonMarkers = ref<CodeEditorMarker[]>([])

  const selected = computed(() => FUNCTIONS.find((option) => option.value === form.functionId))
  const functionLabel = (value: string) =>
    FUNCTIONS.find((option) => option.value === value)?.label ?? ''
  const title = computed(() =>
    editingId.value ? 'Edit Function Instance' : 'Add Function Instance'
  )

  const stringify = (value: Record<string, unknown>) => JSON.stringify(value, null, 2)

  const openFor = (instance?: Instance) => {
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
    nextTick(() => schemaForm.value?.clearValidation())
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
    try {
      const parsed: unknown = JSON.parse(text || '{}')
      if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
        jsonMarkers.value = [
          { line: 1, severity: 'error', message: 'The arguments must be a JSON object.' }
        ]
        return
      }
      jsonMarkers.value = []
      form.args = parsed as Record<string, unknown>
    } catch (error) {
      jsonMarkers.value = [
        {
          line: 1,
          severity: 'error',
          message: error instanceof Error ? error.message : 'This is not valid JSON.'
        }
      ]
    }
  }

  const submit = async () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    if (jsonMarkers.value.length) view.value = 'json'
    let argsValid = !jsonMarkers.value.length
    if (argsValid && selected.value) {
      view.value = 'fields'
      await nextTick()
      argsValid = (await schemaForm.value?.validate())?.valid ?? true
    }
    if (errors.name || errors.functionId || !argsValid) return
    submitting.value = true
    setTimeout(() => {
      const record: Instance = {
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
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
      <h2 class="m-0 text-heading-sm text-(--text-default)">Function instances</h2>
      <Button
        type="button"
        label="Add Function Instance"
        kind="outlined"
        size="medium"
        icon="ai ai-plus"
        @click="openFor()"
      />
    </div>
    <Card :padded="false">
      <template #content>
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
                icon="ai ai-pencil"
                kind="transparent"
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

  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              An instance runs a function on this resource with its own arguments.
            </p>
          </div>
        </PanelHeader>

        <PanelContent>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ title }}</legend>
            <SettingsSection
              title="General"
              hint="The function this instance runs, and the name it is listed under."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <Field :required="!!errors.functionId">
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
                      <Select.Option
                        v-for="option in FUNCTIONS"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                  <HelperText
                    id="instance-function-helper"
                    :kind="errors.functionId ? 'required' : 'helper'"
                    >{{
                      errors.functionId ||
                      (selected
                        ? `${selected.runtime}. Changing the function clears the arguments.`
                        : 'Its arguments appear below once a function is chosen.')
                    }}</HelperText
                  >
                </Field>
                <Field :required="!!errors.name">
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
            </SettingsSection>

            <SettingsSection
              v-if="selected"
              title="Arguments"
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
                    ref="schemaForm"
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
                  <HelperText
                    :kind="jsonMarkers.length ? 'invalid' : 'helper'"
                    :label="
                      jsonMarkers.length
                        ? 'Fix the JSON to keep these arguments. The fields keep the last valid value.'
                        : 'Edits here update the fields.'
                    "
                  />
                </div>
              </div>
            </SettingsSection>
          </fieldset>
        </PanelContent>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              :label="editingId ? 'Save' : 'Add Function Instance'"
              kind="primary"
              size="medium"
              :loading="submitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
