<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import SettingsGroup from '@aziontech/webkit/settings-group'

  import type { CheckedRow } from '../lib/csv-import'

  export interface ImportPreviewProps {
    /** The first rows that will be inserted, keyed by table column. */
    preview: Record<string, unknown>[]
    /** The table columns the preview shows. */
    columns: TableColumn[]
    /** How many CSV rows were read. */
    total: number
    /** How many rows pass every check. */
    validCount: number
    /** The rows that fail a check, with their problems. */
    failedRows: CheckedRow[]
    /** Import was pressed. */
    submitted?: boolean
    /** Why the column mapping cannot import. */
    mappingError?: string
  }

  withDefaults(defineProps<ImportPreviewProps>(), { submitted: false, mappingError: '' })
</script>

<template>
  <SettingsGroup
    label="Check rows"
    hint="Each value is checked against its column's type, and required columns against empty values."
  >
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
      <p
        class="m-0 text-body-sm text-(--text-default)"
        aria-live="polite"
      >
        {{ validCount }} of {{ total }} {{ total === 1 ? 'row is' : 'rows are' }} ready to insert.
        <template v-if="failedRows.length"
          >{{ failedRows.length }} {{ failedRows.length === 1 ? 'row has' : 'rows have' }} errors
          and will be skipped.</template
        >
      </p>
      <Alert
        v-if="submitted && !mappingError && !validCount"
        severity="danger"
        size="small"
        label="Every row has an error, so there is nothing to insert. Fix the file or the mapping."
      />
      <ul
        v-if="failedRows.length"
        aria-label="Rows with errors"
        class="m-0 flex list-none flex-col gap-(--spacing-2xs) rounded-(--shape-control) border border-(--danger-border) p-(--spacing-sm)"
      >
        <li
          v-for="row in failedRows.slice(0, 10)"
          :key="row.line"
          class="flex gap-(--spacing-xs) text-body-sm text-(--text-default)"
        >
          <i
            class="az az-circle-x mt-(--spacing-2xs) shrink-0 text-(--danger-foreground)"
            aria-hidden="true"
          />
          <span
            ><span class="text-label-sm">Line {{ row.line }}:</span>
            {{ row.problems.join(' ') }}</span
          >
        </li>
        <li
          v-if="failedRows.length > 10"
          class="text-body-xs text-(--text-muted)"
        >
          And {{ failedRows.length - 10 }} more.
        </li>
      </ul>
      <template v-if="preview.length">
        <p class="m-0 text-body-sm text-(--text-muted)">
          The first {{ preview.length }} rows as they will be inserted.
        </p>
        <DataTable
          :data="preview"
          :columns="columns"
          row-key="__row"
          :bordered="true"
          density="compact"
          aria-label="Import preview"
        />
      </template>
    </div>
  </SettingsGroup>
</template>
