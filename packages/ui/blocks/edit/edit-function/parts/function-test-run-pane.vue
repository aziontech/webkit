<script setup lang="ts">
  import CopyButton from '@aziontech/ui/copy-button'
  import KeyValueList from '@aziontech/ui/key-value-list'
  import LogViewerContent from '@aziontech/ui/log-viewer-content'
  import LogViewer from '@aziontech/ui/log-viewer-root'
  import ResizablePane from '@aziontech/ui/resizable-pane'
  import StatusIndicator from '@aziontech/ui/status-indicator'
  import Trace from '@aziontech/ui/trace'

  import {
    sampleRunDetails,
    sampleRunId,
    sampleRunLines,
    sampleRunRequest,
    sampleRunSpans
  } from '../sample'

  export interface FunctionTestRunPaneProps {
    /** The test run is in flight. */
    running: boolean
  }

  defineProps<FunctionTestRunPaneProps>()

  const basis = defineModel<number>('basis', { required: true })
  const open = defineModel<boolean>('open', { required: true })
  const selectedSpan = defineModel<string>('selectedKey', { required: true })
</script>

<template>
  <ResizablePane
    v-model:basis="basis"
    v-model:open="open"
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
