<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CodeEditor, { type CodeEditorMarker } from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { computed, onMounted, ref, watch } from 'vue'

  import EditorToolbar from './parts/editor-toolbar.vue'
  import HistorySidebar from './parts/history-sidebar.vue'
  import QueryResults from './parts/query-results.vue'
  import TableDataView from './parts/table-data-view.vue'
  import TableDefinition from './parts/table-definition.vue'
  import TablesSidebar from './parts/tables-sidebar.vue'
  import TemplatesDrawer from './parts/templates-drawer.vue'
  import { sampleHistory, sampleSql, sampleTables } from './sample'
  import type {
    QueryEditorHistoryEntry,
    QueryEditorResult,
    QueryEditorRow,
    QueryEditorTab,
    QueryEditorTable,
    QueryEditorTableView
  } from './types'

  export type {
    QueryEditorColumn,
    QueryEditorHistoryEntry,
    QueryEditorResult,
    QueryEditorResultRow,
    QueryEditorRow,
    QueryEditorTab,
    QueryEditorTable,
    QueryEditorTableView
  } from './types'

  export interface QueryEditorProps {
    /** The database tables with their rows. Left out, the sample renders; pass an empty list for a database with none. */
    tables?: QueryEditorTable[]
    /** Past queries, newest first. Left out, the sample renders. */
    history?: QueryEditorHistoryEntry[]
    /** What the last query returned; left out, Results is ready to execute. */
    result?: QueryEditorResult | null
    /** The tables and the selected table's rows are loading: skeleton lines hold the side panel and the rows table shows its loading state. */
    loading?: boolean
    /** A query is in flight: Run query spins, the editor locks and Results shows skeleton lines. */
    running?: boolean
    /** Why the selected table's rows could not load; a danger alert with Retry replaces the rows. */
    error?: string
    /** The view of the selected table the pane opens on. */
    defaultTableView?: QueryEditorTableView
    /** Rows selected when the page opens, by row key. */
    defaultSelectedKeys?: string[]
    /** The SQL quick templates drawer starts open. */
    defaultTemplatesOpen?: boolean
  }

  const props = withDefaults(defineProps<QueryEditorProps>(), {
    tables: undefined,
    history: undefined,
    result: undefined,
    loading: false,
    running: false,
    error: '',
    defaultTableView: 'data',
    defaultSelectedKeys: () => [],
    defaultTemplatesOpen: false
  })

  const emit = defineEmits<{
    run: [event: Event, sql: string]
    'refresh-tables': [event: MouseEvent]
    'create-table': [event: MouseEvent]
    'delete-table': [event: Event, table: QueryEditorTable]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'insert-row': [event: MouseEvent, table: QueryEditorTable]
    'import-csv': [event: Event, table: QueryEditorTable]
    'add-column': [event: MouseEvent, table: QueryEditorTable]
    'delete-rows': [event: Event, payload: { table: QueryEditorTable; rows: QueryEditorRow[] }]
    'delete-query': [event: Event, entry: QueryEditorHistoryEntry]
    'download-results': [event: MouseEvent, result: QueryEditorResult]
  }>()

  const activeTab = defineModel<QueryEditorTab>('tab', { default: 'tables' })
  const selectedTableId = defineModel<string | null>('table', { default: null })
  const editorSql = defineModel<string>('sql', { default: sampleSql })

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]

  const tableSource = computed<QueryEditorTable[]>(
    () => props.tables ?? (props.loading || props.error ? [] : sampleTables)
  )
  const tableList = ref<QueryEditorTable[]>([])
  watch(
    tableSource,
    (next) => {
      tableList.value = next.map((table) => ({ ...table, rows: [...table.rows] }))
    },
    { immediate: true }
  )
  const selectedTable = computed(
    () =>
      tableList.value.find((table) => table.id === selectedTableId.value) ??
      tableList.value[0] ??
      null
  )
  const selectTable = (id: string) => {
    selectedTableId.value = id
    if (narrowViewport()) leftOpen.value = false
  }
  const tablePendingDelete = ref<QueryEditorTable | null>(null)
  const tableDeleteOpen = ref(false)
  const onTableAction = (_event: Event, value: unknown, table: QueryEditorTable) => {
    if (value !== 'delete') return
    tablePendingDelete.value = table
    tableDeleteOpen.value = true
  }
  const confirmTableDelete = (event: MouseEvent) => {
    const table = tablePendingDelete.value
    if (!table) return
    tableDeleteOpen.value = false
    emit('delete-table', event, table)
  }

  const leftWidth = ref(288)
  const narrowViewport = () => Boolean(globalThis.matchMedia?.('(width < 48rem)').matches)
  const leftOpen = ref(true)
  onMounted(() => {
    if (narrowViewport()) leftOpen.value = false
  })

  const tableView = ref<QueryEditorTableView>(props.defaultTableView)
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const selectedKeys = ref<string[]>([...props.defaultSelectedKeys])
  watch(selectedTableId, () => {
    selectedKeys.value = []
  })
  const editorMarkers = computed<CodeEditorMarker[]>(() =>
    results.value?.type === 'error' && results.value.line
      ? [{ line: results.value.line, severity: 'danger', message: results.value.text }]
      : []
  )
  const removeRows = (event: Event, table: QueryEditorTable, keys: Set<string>) => {
    const rows = table.rows.filter((row) => keys.has(row.__k))
    if (!rows.length) return
    table.rows = table.rows.filter((row) => !keys.has(row.__k))
    emit('delete-rows', event, { table, rows })
  }
  const rowsPendingDelete = ref<string[]>([])
  const rowsDeleteOpen = ref(false)
  const rowsDeleteCount = computed(() => rowsPendingDelete.value.length)
  const rowsDeleteNoun = computed(() => (rowsDeleteCount.value === 1 ? 'row' : 'rows'))
  const askDeleteRows = (keys: string[]) => {
    if (!keys.length) return
    rowsPendingDelete.value = keys
    rowsDeleteOpen.value = true
  }
  const deleteRow = (_event: MouseEvent, row: QueryEditorRow) => askDeleteRows([row.__k])
  const deleteSelected = () => askDeleteRows([...selectedKeys.value])
  const confirmRowsDelete = (event: MouseEvent) => {
    const table = tableList.value.find((item) => item.id === selectedTable.value?.id)
    const keys = new Set(rowsPendingDelete.value)
    rowsDeleteOpen.value = false
    if (!table || !keys.size) return
    removeRows(event, table, keys)
    selectedKeys.value = selectedKeys.value.filter((key) => !keys.has(key))
  }

  const historySource = computed<QueryEditorHistoryEntry[]>(
    () => props.history ?? (props.loading || props.error ? [] : sampleHistory)
  )
  const historyList = ref<QueryEditorHistoryEntry[]>([])
  watch(
    historySource,
    (next) => {
      historyList.value = [...next]
    },
    { immediate: true }
  )
  const running = computed(() => props.running)
  const templatesOpen = ref(props.defaultTemplatesOpen)
  const results = computed<QueryEditorResult | null>(() =>
    props.running ? null : (props.result ?? null)
  )
  const applyTemplate = (sql: string) => {
    editorSql.value = sql
  }
  const loadFromHistory = (item: QueryEditorHistoryEntry) => {
    editorSql.value = item.sql
    activeTab.value = 'editor'
  }
  const deleteHistory = (event: Event, item: QueryEditorHistoryEntry) => {
    historyList.value = historyList.value.filter((entry) => entry.id !== item.id)
    emit('delete-query', event, item)
  }

  const resultStatus = computed(() => {
    if (running.value) return 'Running the query.'
    if (!results.value) return ''
    if (results.value.type !== 'rows') return results.value.text
    const count = results.value.rows.length
    return `${count} ${count === 1 ? 'row' : 'rows'} returned.`
  })

  const runQuery = (event: Event) => {
    const sql = editorSql.value.trim()
    if (!sql || running.value) return
    emit('run', event, sql)
  }
  useShortcuts({
    keys: 'meta+enter',
    label: 'Run query',
    group: 'Page',
    when: () => !running.value,
    handler: (event) => runQuery(event)
  })
  const onHistoryAction = (event: Event, value: unknown, item: QueryEditorHistoryEntry) => {
    if (value === 'run') {
      applyTemplate(item.sql)
      runQuery(event)
      return
    }
    deleteHistory(event, item)
  }
  const downloadResults = (event: MouseEvent) => {
    if (results.value) emit('download-results', event, results.value)
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <PageTabs v-model="activeTab">
      <Tabs.Trigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </PageTabs>

    <section
      v-if="activeTab === 'tables'"
      class="animate-page-enter motion-reduce:animate-none relative flex min-h-0 flex-1 overflow-hidden"
    >
      <TablesSidebar
        v-model:width="leftWidth"
        v-model:open="leftOpen"
        :tables="tableList"
        :selected="selectedTable"
        :loading="loading"
        @select="selectTable"
        @table-action="onTableAction"
        @refresh-tables="(event: MouseEvent) => emit('refresh-tables', event)"
        @create-table="(event: MouseEvent) => emit('create-table', event)"
      />

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          v-if="!selectedTable"
          class="flex flex-1 items-center justify-center p-(--spacing-md)"
        >
          <EmptyState
            bordered
            size="medium"
            icon="az az-table"
            title="No tables yet"
            description="Create your first table to store your data."
            class="w-full max-w-(--container-2xl)"
          >
            <template #actions>
              <div class="w-full md:w-fit">
                <Button
                  label="Create Table"
                  icon="az az-plus"
                  variant="secondary"
                  size="medium"
                  class="w-full"
                  @click="(event: MouseEvent) => emit('create-table', event)"
                />
              </div>
            </template>
          </EmptyState>
        </div>

        <div
          v-else
          class="flex min-h-0 flex-1 flex-col"
        >
          <div
            class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <div
                v-if="!leftOpen"
                class="flex shrink-0 md:hidden"
              >
                <Button
                  label="Tables"
                  icon="az az-table"
                  variant="outline"
                  size="small"
                  @click="leftOpen = true"
                />
              </div>
              <i
                class="az az-table shrink-0 text-(--text-muted) max-md:hidden"
                aria-hidden="true"
              />
              <span class="truncate text-heading-2xs text-(--text-default)">{{
                selectedTable.name
              }}</span>
            </div>
            <ToggleGroup
              v-model="tableView"
              :options="tableViewOptions"
              aria-label="Table view"
            />
          </div>

          <TableDataView
            v-if="tableView === 'data'"
            v-model:selected-keys="selectedKeys"
            :table="selectedTable"
            :loading="loading"
            :error="error"
            @refresh="(event: MouseEvent) => emit('refresh', event)"
            @retry="(event: MouseEvent) => emit('retry', event)"
            @insert-row="
              (event: MouseEvent, table: QueryEditorTable) => emit('insert-row', event, table)
            "
            @import-csv="
              (event: Event, table: QueryEditorTable) => emit('import-csv', event, table)
            "
            @delete-row="deleteRow"
            @delete-selected="deleteSelected"
          />

          <TableDefinition
            v-else
            :table="selectedTable"
            @add-column="
              (event: MouseEvent, table: QueryEditorTable) => emit('add-column', event, table)
            "
          />
        </div>
      </div>
    </section>

    <section
      v-else
      class="relative flex min-h-0 flex-1 overflow-hidden"
    >
      <HistorySidebar
        v-model:width="leftWidth"
        v-model:open="leftOpen"
        :history="historyList"
        @load="loadFromHistory"
        @history-action="onHistoryAction"
      />

      <div class="flex min-w-0 flex-1 flex-col overflow-auto">
        <EditorToolbar
          :running="running"
          :history-open="leftOpen"
          @run="runQuery"
          @templates="templatesOpen = true"
          @show-history="leftOpen = true"
        />

        <CodeEditor
          v-model="editorSql"
          language="sql"
          path="query.sql"
          height="14rem"
          :bordered="false"
          :readonly="running"
          :markers="editorMarkers"
          aria-label="SQL editor"
        />

        <QueryResults
          :results="results"
          :running="running"
          :result-status="resultStatus"
          @run="runQuery"
          @download="downloadResults"
        />
      </div>
    </section>

    <TemplatesDrawer
      v-model:open="templatesOpen"
      @choose="applyTemplate"
    />

    <ConfirmDialog
      v-model:open="rowsDeleteOpen"
      :title="rowsDeleteCount === 1 ? 'Delete row' : `Delete ${rowsDeleteCount} rows`"
      :description="`${rowsDeleteCount === 1 ? 'The row is' : `${rowsDeleteCount} rows are`} deleted from ${selectedTable?.name ?? 'the table'}. This can't be undone.`"
      :confirm-label="`Delete ${rowsDeleteNoun}`"
      size="small"
      @confirm="confirmRowsDelete"
    />

    <ConfirmDialog
      v-model:open="tableDeleteOpen"
      title="Delete table"
      :description="`${tablePendingDelete?.name ?? 'The table'} and its ${tablePendingDelete?.rows.length ?? 0} rows are deleted. This can't be undone.`"
      confirm-label="Delete table"
      :confirmation-phrase="tablePendingDelete?.name ?? ''"
      size="medium"
      @confirm="confirmTableDelete"
    />
  </div>
</template>
