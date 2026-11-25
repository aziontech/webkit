<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CodeEditor, { type CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed } from 'vue'

  import {
    sampleDataStreamPresets as presetTemplates,
    sampleDataStreamTemplates as templateOptions
  } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'
  import DataStreamInputRow from './data-stream-input-row.vue'

  const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
    const [{ default: EditorWorker }, { default: JsonWorker }, { default: TsWorker }] =
      await Promise.all([
        import('monaco-editor/editor/editor.worker?worker'),
        import('monaco-editor/languages/features/json/json.worker?worker'),
        import('monaco-editor/languages/features/typescript/ts.worker?worker')
      ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => {
        if (label === 'json') return new JsonWorker()
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        return new EditorWorker()
      }
    }
    return await import('monaco-editor')
  }

  const { form, errors, saving, clear } = useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const templateLabel = labelOf(templateOptions)

  const presetDocument = computed(() => {
    const template = presetTemplates[form.template]
    return template ? JSON.stringify(template.dataSet, null, 2) : ''
  })

  const presetTabs = computed(() => [
    {
      label: 'Data set',
      value: 'data-set',
      language: 'json',
      code: presetDocument.value
    }
  ])
</script>

<template>
  <SettingsGroup
    label="Template"
    hint="The structure of each record sent to the destination."
    anchor="template"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="template"
              title="Template"
              description="A preset sends a fixed set of variables for one source. A custom template lets you choose the variables."
            >
              <Select
                v-model="form.template"
                size="large"
                class="w-full"
                :display-value="templateLabel"
                :readonly="saving"
                @update:model-value="clear('template')"
              >
                <Select.Trigger aria-label="Template" />
                <Select.Content>
                  <Select.Item
                    v-for="option in templateOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <DataStreamInputRow
              v-if="form.template === 'custom'"
              key="templateName"
              field="templateName"
              title="Template name"
              description="Give a unique and descriptive name to identify the custom template."
              label="Template name"
              placeholder="my-custom-template"
            />
            <SettingsRow
              v-if="form.template === 'custom'"
              key="dataSet"
              title="Data set"
              description="The variables sent to the destination, as a JSON object. Each value is a variable such as $host or $status."
              variant="stacked"
            >
              <div class="flex w-full flex-col">
                <CodeEditor
                  id="data-stream-dataSet"
                  v-model="form.dataSet"
                  :loader="loadMonaco"
                  language="json"
                  path="data-set.json"
                  height="16rem"
                  aria-label="Data set"
                  :invalid="!!errors.dataSet"
                  :aria-describedby="errors.dataSet ? 'data-stream-dataSet-message' : undefined"
                  :disabled="saving"
                  @update:model-value="clear('dataSet')"
                />
              </div>
              <FieldError
                v-if="errors.dataSet"
                id="data-stream-dataSet-message"
                >{{ errors.dataSet.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              v-else
              key="preset"
              title="Data set"
              description="The variables this template sends. A preset cannot be edited; choose Custom template to pick the variables yourself."
              variant="stacked"
            >
              <div class="w-full min-w-0">
                <CodeBlock
                  :tabs="presetTabs"
                  copy-aria-label="Copy the data set as JSON"
                />
              </div>
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
