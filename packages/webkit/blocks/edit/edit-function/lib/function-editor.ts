import type { CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'

import type { FunctionEditorField } from '../edit-function.vue'

export const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
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

export const tabs = [
  { value: 'code', label: 'Code' },
  { value: 'settings', label: 'Settings' }
]
export const documents = [
  { label: 'Code', value: 'code' },
  { label: 'Arguments', value: 'arguments' }
]
export const fieldTypes = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'True / false' },
  { value: 'select', label: 'Choice' },
  { value: 'array', label: 'List' }
]
export const itemTypes = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' }
]

export const runtimeLabel = 'JavaScript'
export const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)

export const fieldTypeLabel = (type: string) =>
  fieldTypes.find((option) => option.value === type)?.label ?? type
export const itemTypeLabel = (type: string) =>
  itemTypes.find((option) => option.value === type)?.label ?? type
export const summary = (field: FunctionEditorField) =>
  field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)
export const fieldName = (field: FunctionEditorField) => field.key || 'this field'

export const linesToList = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
export const listToLines = (list: unknown) => (Array.isArray(list) ? list.join('\n') : '')

export const resetForType = (field: FunctionEditorField) => {
  for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum'] as const) {
    field[constraint] = ''
  }
  if (field.type !== 'select') field.options = []
  if (field.type === 'boolean') field.default = false
  else if (field.type === 'array') field.default = []
  else field.default = typeof field.default === 'string' ? field.default : ''
}

export const emptyField = (id: string): FunctionEditorField => ({
  id,
  key: '',
  type: 'string',
  title: '',
  description: '',
  required: false,
  default: '',
  minLength: '',
  maxLength: '',
  pattern: '',
  minimum: '',
  maximum: '',
  options: [],
  itemType: 'string'
})
