<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Kbd from '@aziontech/webkit/kbd'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import LogViewerContent from '@aziontech/webkit/log-viewer-content'
  import LogViewer from '@aziontech/webkit/log-viewer-root'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Trace from '@aziontech/webkit/trace'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import type { editor as MonacoEditor } from 'monaco-editor'
  import { computed, onBeforeUnmount, ref } from 'vue'

  import EditFunction, {
    type FunctionEditorDocument,
    type FunctionEditorTab
  } from '../edit-function.vue'
  import {
    sampleRunDetails,
    sampleRunId,
    sampleRunLines,
    sampleRunRequest,
    sampleRunSpans
  } from '../sample'

  const activeTab = ref<FunctionEditorTab>('code')
  const activeDocument = ref<FunctionEditorDocument>('code')
  const runStatus = ref('completed')
  const selectedSpan = ref('origin')
  const resultsHeight = ref(380)
  const resultsExpanded = ref(true)
  const saving = ref(false)
  const saveError = ref('')
  let runTimer: ReturnType<typeof setTimeout> | undefined
  let saveTimer: ReturnType<typeof setTimeout> | undefined

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

  onBeforeUnmount(() => {
    clearTimeout(runTimer)
    clearTimeout(saveTimer)
  })
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
</script>

<template>
  <EditFunction
    v-model:tab="activeTab"
    v-model:document="activeDocument"
    :loading="saving"
    :error="saveError"
    @submit="onSubmit"
    @discard="saveError = ''"
    @editor-ready="onEditorReady"
  >
    <template #editor-actions>
      <span class="ms-auto flex">
        <Button
          variant="secondary"
          size="medium"
          icon="az az-play"
          :loading="running"
          :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
          @click="runTest"
        >
          Run test
          <Kbd
            meta
            key-name="enter"
            size="small"
            aria-hidden="true"
          />
        </Button>
      </span>
    </template>
    <template #code-panel>
      <ResizableHandle aria-label="Resize the test run" />
      <ResizablePane
        v-model:basis="resultsHeight"
        v-model:open="resultsExpanded"
        collapsible
        :min="200"
        :max="720"
        aria-label="Test run"
      >
        <section
          aria-labelledby="test-run-title"
          class="flex min-h-0 w-full flex-1 flex-col gap-(--spacing-md) overflow-auto border-t border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
        >
          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
            <h2
              id="test-run-title"
              class="text-label-md text-(--text-default)"
            >
              Test run
            </h2>
            <StatusIndicator
              :severity="running ? 'info' : 'success'"
              :label="running ? 'Running' : 'Completed'"
              :loading="running"
            />
            <span class="truncate text-label-code-sm text-(--text-muted)">{{ sampleRunId }}</span>
            <CopyButton
              :value="sampleRunId"
              aria-label="Copy the run ID"
              variant="outline"
              size="small"
            />
          </div>

          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
            <i
              class="az az-arrow-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
              aria-hidden="true"
            />
            <span class="truncate text-label-code-sm text-(--text-default)">{{
              sampleRunRequest
            }}</span>
            <span class="text-body-sm text-(--text-muted)">
              {{
                running
                  ? 'Waiting for the function to answer.'
                  : '200, served from the transform and written to cache.'
              }}
            </span>
          </div>

          <KeyValueList
            :columns="4"
            :loading="running"
            aria-label="Run details"
          >
            <KeyValueList.Item
              v-for="detail in sampleRunDetails"
              :key="detail.label"
              :label="detail.label"
            >
              {{ detail.value }}
            </KeyValueList.Item>
          </KeyValueList>

          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
            <h3 class="text-label-sm text-(--text-default)">Trace</h3>
            <p class="text-body-sm text-(--text-muted)">
              One row per span, placed against the run's own clock. Select a row to read what it
              measured.
            </p>
            <Trace
              v-if="!running"
              v-model:selected-key="selectedSpan"
              :spans="sampleRunSpans"
              aria-label="Trace of the test run"
            />
            <p
              v-else
              role="status"
              class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) text-body-sm text-(--text-muted)"
            >
              The trace appears when the run finishes.
            </p>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
            <h3 class="text-label-sm text-(--text-default)">Logs</h3>
            <LogViewer
              :lines="sampleRunLines"
              :loading="running"
              loading-label="Running the test…"
              copyable
            >
              <LogViewerContent>
                <template #empty>No log lines yet.</template>
              </LogViewerContent>
            </LogViewer>
          </div>
        </section>
      </ResizablePane>
    </template>
  </EditFunction>
</template>
