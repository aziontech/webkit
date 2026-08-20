<script setup>
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Popover from '@aziontech/webkit/popover'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  // The COLUMNS BUTTON — one control that hides and restores the table's columns:
  //
  //   [🔍 Search connectors                          ⚟ Filter   ▤ ]
  //                                                              ╰─ this
  //   ┌──────────────────────────┐
  //   │ Columns                  │  the header, on the content column
  //   ├──────────────────────────┤
  //   │ ●━ Name     Always shown │  the principal column — on, disabled
  //   │ ━○ ID                    │  off — the one column that ships hidden
  //   │ ●━ Address               │
  //   │ ●━ Last Editor           │
  //   ├──────────────────────────┤
  //   │ Show all columns         │  only while something is hidden
  //   └──────────────────────────┘
  //
  // WHY THIS EXISTS. Mirroring the console put `ID` and `Last Editor` on every module
  // list, which is the right set — they are what the console shows, and an operator
  // reading a support thread needs both. But they also make the widest tables wider,
  // and nobody scans a list by opaque numeric id. The release valve is this control:
  // the column is one switch away instead of gone. Adding density without giving it an
  // off switch is what makes a table feel imposed rather than configured.
  //
  // SO `ID` STARTS OFF, and it is the only column that does — every page seeds its
  // visibility map with `{ id: false }` (see any list page's `columnVisibility`). It is
  // the column you want when quoting a resource into a ticket or an API call, which is
  // a deliberate act, not the state you read the list in. Everything else ships visible:
  // a column hidden by default that nobody thinks to look for may as well not exist.
  //
  // AN ICON BUTTON, NOT A LABELLED ONE. The pair on this row is not symmetrical:
  // `Filter` CHANGES WHICH ROWS EXIST — a claim about the data that deserves a word —
  // while this only changes which of them you are looking at. Giving both the same
  // labelled weight read as two equal filters and pushed the search field narrower for
  // the lesser of the two. The glyph carries it because the panel names itself the
  // moment it opens, and the accessible name is on the button either way.
  //
  // A SWITCH PER COLUMN, NOT A CHECKBOX. A checkbox is for SELECTING members of a set
  // that is committed later; these take effect on the spot and each one is an
  // independent on/off state of the thing it names. That is a switch — and it reads as
  // one at a glance, which is what a panel you open to flip one row and leave needs.
  //
  // THE PRINCIPAL COLUMN IS ON AND DISABLED. A table whose identity column is gone is
  // a grid of attributes belonging to nothing, so the first column is listed with its
  // switch on and inert rather than omitted: an absent row would leave the panel
  // silently failing to account for a column the reader can plainly see. Which column
  // that is comes from the same `hideable: false` the table itself reads, so the panel
  // and the table cannot disagree about what can be turned off.
  //
  // Its ON-ness is said in words ("Always shown") beside it, because the disabled
  // track paints grey — see the template for why — and because words are the only
  // channel a screen reader gets for "you cannot turn this one off".
  //
  // OUTSIDE THE TABLE, LIKE THE SEARCH FIELD. The design system already ships
  // `Table.ColumnSelector`, but it is CONTEXT-AWARE — it injects the table and only
  // resolves inside `<Table>`. Our controls row sits deliberately OUTSIDE the table
  // (../page/ControlsHeader.vue argues why: the controls belong to the PAGE, and the
  // card stays a frame around data only), which is the same reason the search field is
  // a plain InputText bound to `v-model:globalFilter` rather than `Table.Search`. So
  // this is the page-level twin: it drives the table through
  // `v-model:columnVisibility` instead of through inject.
  //
  // ONE FLAT LEVEL, unlike the filter panel. A column list has no drill-down: every
  // entry is a leaf with a binary state, so the level stack that ./FilterButton.vue
  // needs would be machinery around nothing. The anatomy still matches it exactly —
  // header, scrolling list, footer, and the same content column — because the two
  // panels open from the same row and a reader should not have to relearn one.

  const props = defineProps({
    /**
     * The page's column model — the same array passed to `<Table :columns>`. The
     * action column is dropped (it is structure, not a view preference); a column
     * marked `hideable: false` is listed but locked, so the panel accounts for every
     * column the table renders.
     */
    columns: { type: Array, required: true },
    /**
     * Visibility map, `{ [columnId]: boolean }` — the shape `<Table
     * v-model:columnVisibility>` reads. A column absent from the map is visible, so
     * only hidden columns are ever recorded — the page seeds it with `{ id: false }`,
     * the one column that ships off.
     */
    modelValue: { type: Object, default: () => ({}) },
    /** Control size. Matched to the row it sits on — `medium` on a controls row. */
    size: { type: String, default: 'medium' }
  })

  const emit = defineEmits(['update:modelValue'])

  // THE CONTENT COLUMN is `--spacing-md` (16px), the same as ./FilterButton.vue: the
  // list pads by `--spacing-xxs` (4px) and a row by `--spacing-sm` (12px), so a row's
  // leading control starts at 16px — and the header pads by `--spacing-md` directly so
  // its title lands on that identical x. Two panels open from one row; their contents
  // start on one column.
  const ROW_CLASS =
    'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none'

  // A column's id is its `id` when it declares one, otherwise its `accessorKey` — the
  // same resolution TanStack does, so the keys in the visibility map match the ones the
  // table emits back.
  const columnId = (column) => column.id ?? column.accessorKey

  // What the panel calls a column: its `header`, unless the column declares a `label` —
  // the DS's own field for "the name to use when the header is not readable prose"
  // (data/table's ColumnOptions), which is how a column headed `№` says `Number` here.
  // A column with neither has no name to offer, and is left out: those are affordance
  // columns (a chevron, a checkbox), not fields the reader chose.
  const columnName = (column) => column.label ?? column.header

  // The action column is dropped entirely; everything else is listed, with `locked`
  // carrying whether the table will actually let it be hidden.
  const listedColumns = computed(() =>
    props.columns
      .filter((column) => column.kind !== 'action' && columnId(column) && columnName(column))
      .map((column) => ({
        id: columnId(column),
        label: columnName(column),
        locked: column.hideable === false
      }))
  )

  const isVisible = (id) => props.modelValue[id] !== false

  const setVisible = (id, visible) => {
    const next = { ...props.modelValue }
    // Visible is the default, so an entry is only recorded while a column is HIDDEN.
    // Keeps the map small and makes "nothing hidden" an empty object rather than a row
    // of `true`s the page has to seed and keep in step with the column model.
    if (visible) delete next[id]
    else next[id] = false
    emit('update:modelValue', next)
  }

  const hiddenCount = computed(
    () => listedColumns.value.filter((column) => !isVisible(column.id)).length
  )

  const showAll = () => emit('update:modelValue', {})

  // The trigger's tooltip stands down while the panel it opens is on screen — see the
  // template for why. Both halves are needed, and `disabled` alone is not enough:
  //
  //   `disabled` only guards the tooltip's OPENING path, so it stops the tooltip from
  //   coming back while the panel is up but never retracts the one that is already
  //   showing at the moment of the click — and the pointer is still on the trigger then,
  //   so there is always one showing.
  //
  //   Closing it therefore has to be done by hand, which is why the tooltip's open state
  //   is bound here rather than left internal. Passing `:open="false"` instead would
  //   stop working after the first hover: the tooltip resolves its state as
  //   `openModel ?? props.open`, so once its own model has been written to, an unbound
  //   `open` prop is never consulted again.
  const panelOpen = ref(false)
  const tipOpen = ref(false)
  watch(panelOpen, (open) => {
    if (open) tipOpen.value = false
  })
</script>

<template>
  <!-- `shrink-0`: a control of FIXED width sharing the controls row with a search
       field that grows, so it keeps its size instead of being compressed as the field
       takes the slack. -->
  <Popover
    v-model:open="panelOpen"
    placement="bottom-end"
    class="shrink-0"
  >
    <Popover.Trigger>
      <!-- A TOOLTIP BECAUSE THE BUTTON HAS NO LABEL. `ariaLabel` already names it for
           assistive tech; this is the same name for everyone else, who would otherwise
           have to open the panel to find out what the glyph does. It is the one cost of
           dropping the word from the button, and it is paid here.

           SUPPRESSED WHILE THE PANEL IS OPEN. The pointer is still over the trigger the
           moment the panel appears, so without this the tooltip and the panel stack up
           — a label naming the control on top of the control's own contents, which
           already say `Columns` in its header. `disabled` is Tooltip's own prop, so it
           also closes one that was already showing rather than leaving it stranded.

           The wrapper adds no click handler of its own, so the click still bubbles to
           `Popover.Trigger`, which is what toggles the panel. -->
      <Tooltip
        v-model:open="tipOpen"
        text="Columns"
        :disabled="panelOpen"
      >
        <!-- `outlined` + the row's own size, so it sits level with the Filter button and
             the search field beside it (../page/ControlsHeader.vue § the size ladder). -->
        <IconButton
          icon="ai ai-column"
          kind="outlined"
          :size="size"
          ariaLabel="Columns"
          data-testid="columns-button__trigger"
        />
      </Tooltip>
    </Popover.Trigger>

    <Popover.Content>
      <div class="flex flex-col">
        <!-- The header names the panel rather than the control, the same way
             ./FilterButton.vue's field says "Filter by…": by the time this is on
             screen the reader knows which button they pressed. -->
        <div class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)">
          <p class="text-label-md text-(--text-default)">Columns</p>
        </div>

        <div
          class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)"
        >
          <!-- A label, not a button: the switch IS the control, and wrapping it makes
               the whole row a target for it without a second focus stop. The locked
               row takes no hover surface — nothing there responds to a pointer. -->
          <label
            v-for="column in listedColumns"
            :key="column.id"
            :class="[
              ROW_CLASS,
              column.locked
                ? 'cursor-default text-(--text-muted)'
                : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'
            ]"
          >
            <!-- ONE CONTROL FOR EVERY ROW: the principal column takes the same Switch
                 as the rest, on and disabled. The row is a column like any other and
                 reads fastest when it looks like one — a different widget on one line
                 makes the reader stop and work out what changed.
                 It is ON and it is INERT, and the handle carries the first half: it
                 sits at the travelled (right) end, which is the primary on/off signal.
                 The track is the disabled grey rather than the accent, because the
                 switch's `data-[disabled]` background lands after its `data-[checked]`
                 one — so colour alone would read as off. That is what the trailing
                 "Always shown" is for: it states the ON half in words, which is also
                 the only channel a screen reader gets for it. -->
            <Switch
              :model-value="isVisible(column.id)"
              :disabled="column.locked"
              :data-testid="`columns-button__switch-${column.id}`"
              @update:model-value="(value) => setVisible(column.id, !!value)"
            />
            <span class="min-w-0 truncate">{{ column.label }}</span>
            <span
              v-if="column.locked"
              class="ml-auto shrink-0 text-label-xs text-(--text-muted)"
              >Always shown</span
            >
          </label>
        </div>

        <!-- Offered only once there is something to undo, so the panel opens with a
             single job (pick columns) instead of an action that would do nothing.
             Mirrors the "Clear <field>" footer on ./FilterButton.vue's deeper levels. -->
        <div
          v-if="hiddenCount"
          class="border-t border-(--border-default) p-(--spacing-xxs)"
        >
          <Button
            label="Show all columns"
            kind="text"
            size="small"
            class="w-full"
            data-testid="columns-button__reset"
            @click="showAll"
          />
        </div>
      </div>
    </Popover.Content>
  </Popover>
</template>
