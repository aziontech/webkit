<script setup>
  // DOWNLOAD CSV — the list, as a file, from the right of the controls row:
  //
  //     [⚟ Filter] [🔍 Search buckets ..................]   [↻] [⭳] [▤]
  //                                                               ╰─ this one
  //
  // IT DRIVES THE TABLE, IT DOES NOT RE-IMPLEMENT IT. The page hands over its `<Table>`
  // instance (`ref="tableRef"`) and the click calls the DS's own `exportCsv()`, so the
  // file honours what the reader is actually looking at: the columns that are visible,
  // in their current order, minus the action column, over the rows that survived the
  // filters. A CSV serialised here from the page's rows would drift from all four the
  // first time a column was hidden.
  //
  // WHY NOT `Table.Export`. That sub-component does exactly this, but it is
  // context-aware — it `inject`s the table and no-ops outside it. The console's
  // controls sit one level up, outside the card (../page/ControlsHeader.vue), so the
  // table has to be passed in rather than injected. Everything below the click is still
  // the DS's.
  //
  // A CSV, NOT A MENU. One format, one click: a dropdown offering CSV/JSON/XLSX on a
  // list whose only real consumer is a spreadsheet spends a second click asking a
  // question that has one answer. If a second format ever earns its place, the trigger
  // becomes a Dropdown here and nothing on the pages changes.
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  const props = defineProps({
    /**
     * The page's `<Table>` instance — `ref="tableRef"` on the table, passed straight
     * through. Its exposed `exportCsv()` is what writes the file.
     */
    table: { type: Object, default: null },
    /**
     * Filename for the download, e.g. `buckets.csv`. Falls back to the table's own
     * `exportFilename` when omitted.
     */
    filename: { type: String, default: '' },
    /** Control size. Matched to the row it sits on — `medium` on a controls row. */
    size: { type: String, default: 'medium' }
  })

  // `filtered` is the DS default and the honest scope: what the file holds is what the
  // list holds, not just the page on screen (`page`) and not the rows the filters
  // ruled out (`all`).
  const exportCsv = () => props.table?.exportCsv({ filename: props.filename || undefined })

  // A page whose table is swapped out for an empty state has nothing to write, and a
  // control that silently does nothing is worse than one that says so.
  const ready = computed(() => Boolean(props.table))
</script>

<template>
  <!-- `shrink-0`: a fixed-width control on a row whose search field takes the slack. -->
  <Tooltip
    text="Download CSV"
    class="shrink-0"
  >
    <IconButton
      icon="pi pi-download"
      kind="outlined"
      :size="size"
      :disabled="!ready"
      ariaLabel="Download CSV"
      data-testid="export-button"
      @click="exportCsv"
    />
  </Tooltip>
</template>
