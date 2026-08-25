<script setup>
  // REFRESH — "fetch this list again", as an icon button on the right of the controls
  // row:
  //
  //     [⚟ Filter] [🔍 Search buckets ..................]   [↻] [⭳] [▤]
  //                                                          ╰─ this one
  //
  // AN ICON, NOT A LABEL. It shares the right group with Download CSV and Columns, and
  // those two are glyphs already; a single worded button among them makes the group
  // read as "a button and two icons" instead of one cluster of list actions. The word
  // is not lost — `ariaLabel` names it for assistive tech and the Tooltip says it to
  // everyone else, which is the same bargain ./ColumnsButton.vue makes.
  //
  // THE PENDING STATE IS THE POINT. Sample data is already in memory, so what a refresh
  // has to do here is SHOW that it ran: `loading` comes from the page's list state
  // (lib/behavior/list-state.js § refresh), which holds the flag open for one beat —
  // long enough for `IconButton`'s spinner here and the Table's skeleton rows to agree
  // that a fetch happened. It also DISABLES the control for that beat, so a second
  // click cannot stack a refresh on top of one in flight. Swap the sample's timer for
  // a real request and both halves are already wired.
  //
  // The same glyph and the same disabled-while-loading rule as webkit's own
  // `Table.RefreshButton` — that one is context-aware and only works INSIDE `<Table>`,
  // and the console's controls live one level up, outside the card (see
  // ../page/ControlsHeader.vue). So the button is re-made here rather than reached for,
  // and the behaviour is copied on purpose.
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  defineProps({
    /** Control size. Matched to the row it sits on — `medium` on a controls row. */
    size: { type: String, default: 'medium' },
    /**
     * Whether a fetch is in flight. Spins the glyph and blocks activation, so the
     * control agrees with the skeleton rows the same flag draws in the table.
     */
    loading: { type: Boolean, default: false }
  })

  const emit = defineEmits(['refresh'])
</script>

<template>
  <!-- `shrink-0`: a fixed-width control on a row whose search field takes the slack. -->
  <Tooltip
    text="Refresh"
    class="shrink-0"
  >
    <IconButton
      icon="pi pi-refresh"
      kind="outlined"
      :size="size"
      :loading="loading"
      ariaLabel="Refresh"
      data-testid="refresh-button"
      @click="(event) => emit('refresh', event)"
    />
  </Tooltip>
</template>
