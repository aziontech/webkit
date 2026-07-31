<script setup>
  // The FILTER POPOVER — the one way a list page narrows itself:
  //
  //     [ ⛭ | search …                      ]        ← ControlsHeader
  //       ╰─ Popover
  //          ┌───────────────────────────┐
  //          │ Filter                  × │
  //          │ Narrow the list by …      │
  //          ├───────────────────────────┤
  //          │ All Authors             ▾ │
  //          │ Last Modified             │
  //          │ All Statuses            ▾ │
  //          ├───────────────────────────┤
  //          │ ⌫ Clear all       Apply   │
  //          └───────────────────────────┘
  //
  // It leads the row, to the LEFT of the search: narrowing is what the page opens
  // with, and the filter is the coarse cut the search then refines — so the two read
  // in the order they are used, and the trigger sits where the eye starts instead of
  // drifting to whichever x the search field happened to end at.
  //
  // Before this, every enumerable column carried an always-visible Select in the
  // page's ControlsHeader. Four of them plus the search plus the page's own actions
  // is five controls competing for one 40px band: the search — the control people
  // actually reach for — was the first thing to give up width, each selector shrank
  // to a truncated placeholder, and a fifth column had nowhere left to go. Collapsing
  // them behind ONE icon gives the search the row back and makes the set extensible:
  // a new filter is a new line in a panel, not another 144px of a band that has none.
  //
  // The trigger is an IconButton (a glyph is enough for a control this conventional)
  // wrapped in a Tooltip — the same `Trigger > Tooltip > IconButton` shape the row
  // action menus already use — and it carries a Badge with how many filters are
  // narrowing the list, because a filter you cannot see is a filter you forget you
  // set. That count comes from the page (`:count`): the fields live in the page's
  // slot, so only the page knows which of them are non-empty.
  //
  // The fields APPLY AS YOU PICK them — there is no draft to commit. Each selector is
  // independently meaningful (unlike the field/operator/value builder in Popover's
  // own Storybook example, which cannot narrow anything until all three are set), so
  // staging them behind an Apply button would only add a second step and a second copy
  // of the page's state. The footer therefore carries what the panel really owes the
  // user: a way to undo everything at once, and a way out.
  //
  // `bottom-start` anchors the panel's left edge to the trigger, which is the correct
  // side now that the trigger leads the row: the panel opens rightwards into the page,
  // where a 408px panel always fits. (Anchoring by the right edge from here would push
  // it off the left of the viewport, taking the close × with it.)
  //
  // `:dismissible="false"` is deliberate: the panel hosts Select and Calendar, and
  // both teleport their own overlays to <body> — light-dismiss would read picking an
  // option as an outside-click and close the panel under the user. So it closes by the
  // header ×, by Done, or by the trigger. (Those nested overlays sit at
  // `--z-input-overlay` (1100) against the panel's 50, so they paint above it.)
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Popover from '@aziontech/webkit/popover'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  const props = defineProps({
    /** How many of the page's filters are currently narrowing the list. Drives the trigger badge and enables Clear all. */
    count: { type: Number, default: 0 },
    /** Second line of the panel header. States what the fields narrow. */
    description: { type: String, default: 'Narrow the list by any combination of fields.' }
  })

  /** `clear` asks the page to reset every field it renders in the panel. */
  const emit = defineEmits(['clear'])

  const open = ref(false)

  // The tooltip says the count too: the badge tells a sighted user something is
  // applied, this is what a screen-reader user (and the IconButton's accessible name)
  // gets, since the badge itself is decorative.
  const label = computed(() => (props.count ? `Filter (${props.count} applied)` : 'Filter'))
</script>

<template>
  <Popover
    v-model:open="open"
    :dismissible="false"
    width="medium"
    placement="bottom-start"
    class="shrink-0"
  >
    <Popover.Trigger>
      <Tooltip :text="label">
        <!-- The badge is positioned against this wrapper rather than the button so it
             can overhang the corner without the button clipping it. `pointer-events-none`
             keeps the overhang from swallowing a click meant for the trigger, and the
             canvas-coloured ring separates the pill from the button edge under it. -->
        <span class="relative inline-flex">
          <IconButton
            icon="ai ai-filter-alt"
            :kind="count ? 'secondary' : 'outlined'"
            :aria-label="label"
          />
          <Badge
            v-if="count"
            size="small"
            severity="primary"
            :label="String(count)"
            class="pointer-events-none absolute -right-1.5 -top-1.5 min-w-5 ring-2 ring-[var(--bg-canvas)]"
            aria-hidden="true"
          />
        </span>
      </Tooltip>
    </Popover.Trigger>

    <Popover.Content>
      <Popover.Header>
        <Popover.Title>Filter</Popover.Title>
        <Popover.Description>{{ description }}</Popover.Description>
        <Popover.Close />
      </Popover.Header>

      <!-- One field per line, each full-width: a panel has the vertical room a
           toolbar band never had, and stacking is what lets a page add a fifth
           filter without redesigning anything. The fields keep the placeholders
           they carried in the band ("All Authors", "Last Modified"), which already
           name what they narrow — a Label above each would only repeat them. -->
      <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
        <slot />
      </div>

      <Popover.Footer>
        <!-- `mr-auto` against the footer's `justify-end`: destructive-ish reset on the
             left, away from the button the user aims for to leave. Disabled while
             nothing is applied, so it never promises to undo nothing. -->
        <Button
          class="mr-auto"
          kind="outlined"
          size="medium"
          icon="pi pi-filter-slash"
          label="Clear all"
          :disabled="!count"
          @click="emit('clear')"
        />
        <Button
          kind="primary"
          size="medium"
          label="Apply"
          @click="open = false"
        />
      </Popover.Footer>
    </Popover.Content>
  </Popover>
</template>
