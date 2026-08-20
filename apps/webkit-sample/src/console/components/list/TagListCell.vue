<script setup>
  // A cell that holds a LIST of short chips — threat types, firewall modules, status
  // codes, labels — on exactly ONE line.
  //
  // The obvious rendering (`flex-wrap` over a `v-for` of Tags) is what this replaces.
  // Wrapping makes the ROW as tall as its longest list, so a table whose rows are
  // otherwise 48px grows to 76 or 104 wherever one row happens to carry four chips:
  // the eye loses the horizontal rhythm it scans a list by, sorting appears to reflow
  // the table, and pagination shows a different amount of page per page. A list column
  // is a glance ("which modules?"), not the place to enumerate.
  //
  // So the cell shows the first `visible` chips and puts everything after them behind a
  // "+N" chip that opens the full list — the same first-item + overflow shape the
  // Workloads domain cell uses (./DomainOverflowPopover.vue) and the Teams permissions
  // cell. The row height is then a constant, whatever the data does.
  //
  // The panel's list is deliberately NOT `flex flex-col`: a flex column under a
  // max-height shrinks its items to fit instead of overflowing, which clips every line
  // to a sliver and leaves `scrollHeight === clientHeight` so `overflow-auto` has
  // nothing to scroll. Block layout lets the lines keep their height and the list
  // actually scroll.
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  const props = defineProps({
    /** The full list. Strings or numbers; rendered in the order given. */
    items: { type: Array, default: () => [] },
    /** Plural noun for the overflow panel's count line ("threat types"). */
    noun: { type: String, default: 'items' },
    /** How many chips stay inline before the rest go behind "+N". */
    visible: { type: Number, default: 2 }
  })

  const shown = computed(() => props.items.slice(0, props.visible))
  const hiddenCount = computed(() => Math.max(0, props.items.length - props.visible))
</script>

<template>
  <!-- Nothing to show reads as an em dash, like every other empty cell in the sample,
       rather than an empty cell that looks like a rendering failure. -->
  <span
    v-if="!items.length"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >

  <span
    v-else
    class="flex min-w-0 items-center gap-(--spacing-xxs)"
  >
    <!-- Each chip TRUNCATES rather than pushing the cell wider: a long label
         ("Cross-Site Scripting") shrinks with an ellipsis, so two chips plus the
         overflow chip always fit the column they were given. -->
    <Tag
      v-for="item in shown"
      :key="item"
      severity="secondary"
      size="small"
      class="min-w-0 max-w-full"
    >
      <span class="min-w-0 truncate">{{ item }}</span>
    </Tag>

    <Popover
      v-if="hiddenCount"
      placement="bottom-start"
      width="small"
    >
      <!-- `@click.stop` on both halves: several of these tables open the row on click,
           and reading the rest of a list is not a request to navigate. -->
      <Popover.Trigger @click.stop>
        <Tooltip :text="`Show all ${items.length} ${noun}`">
          <Tag
            :label="`+${hiddenCount}`"
            :aria-label="`Show all ${items.length} ${noun}`"
            severity="secondary"
            size="small"
            class="shrink-0 cursor-pointer"
          />
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content @click.stop>
        <!-- The count stays OUT of the scroller so it cannot scroll away from the
             list it counts. -->
        <p
          class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-overline-sm text-(--text-muted)"
        >
          {{ items.length }} {{ noun }}
        </p>

        <!-- `overscroll-contain`: without it, reaching either end chains the wheel to
             the page, and the panel re-anchors to its trigger on page scroll — so it
             slides out from under the pointer mid-scroll. -->
        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <span
            v-for="item in items"
            :key="item"
            class="block truncate rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
            >{{ item }}</span
          >
        </div>
      </Popover.Content>
    </Popover>
  </span>
</template>
