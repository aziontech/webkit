<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { computed } from 'vue'

  import type { SchemaEditorCsvFile } from '../edit-schema.vue'

  const props = defineProps<{
    file: SchemaEditorCsvFile | null
    tokens: { file: SchemaEditorCsvFile; error: string | undefined }[]
    headers: readonly string[]
    rows: readonly Readonly<Record<string, string>>[]
  }>()

  const emit = defineEmits<{
    files: [files: FileList | File[] | null]
    pick: []
    remove: []
  }>()

  const previewColumns = computed(() =>
    props.headers.map((header): TableColumn => ({ accessorKey: header, header, minWidth: 120 }))
  )
  const preview = computed(() =>
    props.rows.slice(0, 5).map((row, index) => ({ __row: `r${index}`, ...row }))
  )
</script>

<template>
  <SettingsGroup
    label="Import data from CSV"
    hint="Optional. The first line names the columns; the types are guessed from the values and can be changed below. Every row is inserted after the table is created."
  >
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
      <FileDropzone
        v-if="!file"
        accept=".csv,text/csv"
        description="One .csv file, comma-separated, up to 10 MB."
        @drop="(_event, files) => emit('files', files)"
      >
        <Button
          type="button"
          label="Browse files"
          variant="secondary"
          size="medium"
          @click="emit('pick')"
        />
      </FileDropzone>
      <FileTokenGroup
        v-if="file"
        :items="tokens"
        @remove="emit('remove')"
      />
      <template v-if="rows.length">
        <p class="m-0 text-body-sm text-(--text-muted)">
          {{ headers.length }} columns and {{ rows.length }}
          {{ rows.length === 1 ? 'row' : 'rows' }} read. The first {{ preview.length }} below; the
          columns were filled from the header.
        </p>
        <DataTable
          :data="preview"
          :columns="previewColumns"
          row-key="__row"
          :bordered="true"
          aria-label="CSV preview"
        />
      </template>
    </div>
  </SettingsGroup>
</template>
