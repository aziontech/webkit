<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Kbd from '@aziontech/ui/kbd'
  import ResizableHandle from '@aziontech/ui/resizable-handle'
  import { toAriaKeyshortcuts } from '@aziontech/ui/use-shortcuts'

  import { useFunctionTestRun } from '../composables/use-function-test-run'
  import EditFunction from '../edit-function.vue'
  import FunctionTestRunPane from '../parts/function-test-run-pane.vue'

  const {
    activeTab,
    activeDocument,
    selectedSpan,
    resultsHeight,
    resultsExpanded,
    running,
    saving,
    saveError,
    runTest,
    onEditorReady,
    onSubmit,
    clearError
  } = useFunctionTestRun()
</script>

<template>
  <EditFunction
    v-model:tab="activeTab"
    v-model:document="activeDocument"
    :loading="saving"
    :error="saveError"
    @submit="onSubmit"
    @discard="clearError"
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
      <FunctionTestRunPane
        v-model:basis="resultsHeight"
        v-model:open="resultsExpanded"
        v-model:selected-key="selectedSpan"
        :running="running"
      />
    </template>
  </EditFunction>
</template>
