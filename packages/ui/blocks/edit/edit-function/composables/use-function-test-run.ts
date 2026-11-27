import { useShortcuts } from '@aziontech/ui/use-shortcuts'
import type { editor as MonacoEditor } from 'monaco-editor'
import { computed, type ComputedRef, onScopeDispose, readonly, type Ref, ref } from 'vue'

import type { FunctionEditorDocument, FunctionEditorTab } from '../edit-function.vue'

const writable = <T>(source: Ref<T>) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

export interface UseFunctionTestRunReturn {
  activeTab: Ref<FunctionEditorTab>
  activeDocument: Ref<FunctionEditorDocument>
  selectedSpan: Ref<string>
  resultsHeight: Ref<number>
  resultsExpanded: Ref<boolean>
  running: ComputedRef<boolean>
  saving: Readonly<Ref<boolean>>
  saveError: Readonly<Ref<string>>
  runTest: () => void
  onEditorReady: (editor: unknown) => Promise<void>
  onSubmit: () => void
  clearError: () => void
}

function useSimulatedSave() {
  const saving = ref(false)
  const saveError = ref('')
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  onScopeDispose(() => clearTimeout(saveTimer))
  const onSubmit = () => {
    saveError.value = ''
    saving.value = true
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      if (globalThis.navigator?.onLine === false)
        saveError.value = 'Not saved. You are offline; check your connection and save again.'
      saving.value = false
    }, 900)
  }
  const clearError = () => {
    saveError.value = ''
  }
  return { saving: readonly(saving), saveError: readonly(saveError), onSubmit, clearError }
}

export function useFunctionTestRun(): UseFunctionTestRunReturn {
  const activeTab = ref<FunctionEditorTab>('code')
  const activeDocument = ref<FunctionEditorDocument>('code')
  const runStatus = ref('completed')
  const selectedSpan = ref('origin')
  const resultsHeight = ref(380)
  const resultsExpanded = ref(true)
  let runTimer: ReturnType<typeof setTimeout> | undefined

  const running = computed(() => runStatus.value === 'running')

  const runTest = () => {
    resultsExpanded.value = true
    activeDocument.value = 'code'
    selectedSpan.value = ''
    runStatus.value = 'running'
    clearTimeout(runTimer)
    runTimer = setTimeout(() => {
      runStatus.value = 'completed'
    }, 900)
  }

  onScopeDispose(() => clearTimeout(runTimer))
  useShortcuts({
    keys: 'meta+enter',
    label: 'Run test',
    group: 'Page',
    when: () => activeTab.value === 'code' && !running.value,
    handler: () => runTest()
  })
  const onEditorReady = async (editor: unknown) => {
    const { KeyCode, KeyMod } = await import('monaco-editor')
    const sourceEditor = editor as MonacoEditor.IStandaloneCodeEditor
    sourceEditor.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, () => {
      if (!running.value) runTest()
    })
  }

  return {
    activeTab: writable(activeTab),
    activeDocument: writable(activeDocument),
    selectedSpan: writable(selectedSpan),
    resultsHeight: writable(resultsHeight),
    resultsExpanded: writable(resultsExpanded),
    running,
    runTest,
    onEditorReady,
    ...useSimulatedSave()
  }
}
