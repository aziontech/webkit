<script setup>
  // A resource id, in a table cell: the id itself, and a copy button pinned to the
  // cell's right edge.
  //
  // An id is a HANDLE, not prose. The only thing a reader ever does with one is paste
  // it somewhere else — a support ticket, an API call, an `azion` CLI command — and
  // re-typing seven digits off a screen is exactly where that goes wrong. So every
  // list column headed `ID` renders through this cell, and the button sits in the
  // same place in all of them: the id TAKES THE SLACK (`flex-1`) and the button
  // follows it, so the buttons line up down the column however long each id is.
  //
  // The id, not the button, is what carries the alignment — `ml-auto` on the button
  // would be the obvious way and it does nothing: `CopyButton` sets
  // `inheritAttrs: false` and never spreads `$attrs`, so every class a consumer
  // passes it is dropped on the floor (measured 2026-08-24: buttons landed 38px
  // apart down one column). Fixing that belongs in the DS; until it lands, the
  // layout has to come from an element we own.
  //
  // The id keeps the cell's own type and `--text-default` — it is data, not code, so
  // a row reads at one weight across its columns. `tabular-nums` is what makes a
  // COLUMN of them scannable: the digits share one advance width, so ids of the same
  // length line up character for character down the list instead of drifting a few
  // px per row.
  //
  // No `@click.stop` here: CopyButton stops the click itself, so copying inside a
  // clickable row never also opens the row.
  import CopyButton from '@aziontech/webkit/copy-button'
  import { computed } from 'vue'

  const props = defineProps({
    /** The id, as the record stores it. */
    value: { type: [String, Number], default: '' },
    /**
     * What the id identifies, lowercase and singular — `zone`, `network list`. It
     * names the button ("Copy zone ID"), which is the only thing that tells a
     * screen-reader user which of a row's several buttons this one is.
     */
    resource: { type: String, default: '' }
  })

  const text = computed(() => (props.value === null ? '' : String(props.value)))

  const ariaLabel = computed(() => (props.resource ? `Copy ${props.resource} ID` : 'Copy ID'))
</script>

<template>
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 flex-1 truncate tabular-nums">{{ text }}</span>
    <!-- A row with no id has nothing to copy: the button would be a control that
         does nothing rather than a disabled affordance worth explaining. -->
    <CopyButton
      v-if="text"
      kind="outlined"
      :value="text"
      :aria-label="ariaLabel"
    />
  </div>
</template>
