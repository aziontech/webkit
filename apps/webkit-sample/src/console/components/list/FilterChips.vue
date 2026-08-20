<script setup>
  // The APPLIED FILTERS, as a row of chips under the controls:
  //
  //     [ 🔍 Search                                          ⚟ Filter ]  ControlsHeader
  //     (Author ⬤ Bruno Germano ×)  (Status Active ×)                    this row
  //     [ table                                                       ]
  //
  // WHY A SEPARATE COMPONENT FROM THE BUTTON. The two halves of the filter belong on
  // different rows, and a component renders one root into one parent. The button sits on
  // the search's line, where a control of fixed width belongs; the chips take the row
  // under it, because a chip's width is DATA — one per applied cut, each as wide as the
  // value it names — and a row of them would otherwise eat the search field's width as
  // filters arrive, then spill onto a second line anyway once they outgrew what was
  // left.
  //
  // THE ROW DOES NOT EXIST WHEN NOTHING IS APPLIED. There is no empty container and no
  // reserved height: the root itself is conditional, so the table sits directly under
  // the controls on arrival and the row appears between them with the first filter. That
  // is only honest because the row holds nothing but state — the BUTTON is what is
  // always reachable, and it is on the row above.
  //
  // Both halves read the same `v-model` and the same `fields`, so neither owns the
  // other's state. Clicking a chip to edit it still opens the button's panel: that goes
  // through the one channel they share, keyed by the field catalog itself
  // (../../lib/behavior/filter-open.js), so no page has to wire the two together.
  import Avatar from '@aziontech/webkit/avatar'
  import Chip from '@aziontech/webkit/chip'
  import { computed } from 'vue'

  import { appliedFields, clearField, pickedAvatars, summarize } from '../../lib/behavior/filter-bar'
  import { requestOpen } from '../../lib/behavior/filter-open.js'

  const props = defineProps({
    /** The page's field catalog — the SAME array the button gets; it keys the channel. */
    fields: { type: Array, required: true },
    /** Applied state: `{ [fieldId]: values[] }`. An empty entry is not a filter. */
    modelValue: { type: Object, default: () => ({}) }
  })

  const emit = defineEmits(['update:modelValue'])

  // Only what is applied, in CATALOG ORDER — a chip's neighbours change as filters come
  // and go, but their left-to-right order never contradicts the panel's.
  const chips = computed(() => appliedFields(props.fields, props.modelValue))

  const summaryOf = (field) => summarize(field, props.modelValue[field.id])
  const avatarsOf = (field) => pickedAvatars(field, props.modelValue[field.id])

  const edit = (field) => requestOpen(props.fields, field.id)
  const remove = (field) => emit('update:modelValue', clearField(props.modelValue, field))
</script>

<template>
  <!-- `flex-wrap` and not a scroller: a filter you cannot see is a filter you forget you
       set, so a long row grows downwards and pushes the table rather than hiding its own
       tail behind an edge. `relative` is for a leaving chip, which is taken out of flow
       while its transition plays. -->
  <div
    v-if="chips.length"
    class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    data-testid="filter-chips"
  >
    <!-- NO `tag` — `TransitionGroup` renders a FRAGMENT, so each chip is a flex item of
         this row rather than a child of a box inside it. That is load-bearing: a nested
         container is ONE item as far as a wrapping row is concerned, so it breaks as a
         unit and every chip drops to the next line together, including the one that would
         have fitted. -->
    <!-- REMOVING A CHIP: it scales down and fades where it stands, and the chips after
         it close the gap. What each class does:
           · `leave-to` is the exit itself — `scale-90` + `opacity-0`. Measured on the
             wrapper: opacity 1 → 0.98 → 0.94 → 0.88 → 0.80 → 0.68 → 0.53 → 0.36 → 0 with
             scale tracking it down to 0.9, so 7 interpolated frames rather than a snap.
             `scale-90` and not something deeper: the chip is 32px tall, so a big scale
             reads as a drop rather than a dismissal.
           · `duration-fast-02` + `ease-productive-exit` on `leave-active`, so the chip
             gets out of the way instead of lingering on the entrance ease the base class
             carries. The transition PROPERTY is deliberately not restated here — two
             `transition-[…]` utilities on one element are decided by stylesheet order,
             not by which class was added last, and the base one wins (verified: the
             leaving chip computes `transition-property: transform, translate, scale,
             opacity`). It already covers scale and opacity, so restating them bought
             nothing but a comment that disagreed with the DOM.
           · `absolute` takes the leaving chip out of flow on the same frame, so the row
             re-flows immediately and `move-class` carries the survivors into place
             (measured: the two remaining chips land at x 324 and 534, closed up). That is
             also why the row is `relative` — the chip would otherwise position against an
             ancestor further up and fly across the page.
           · `pointer-events-none` so a chip on its way out cannot be clicked, or eat the
             hover of the one sliding under it. -->
    <TransitionGroup
      move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="scale-90 opacity-0"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    >
      <!-- The MOTION LIVES ON THIS WRAPPER, not on the Chip — TransitionGroup animates
           the element it iterates, and keeping that a plain span leaves the Chip free to
           be nothing but a Chip. The transitions name `translate` and `scale`, not just
           `transform`: Tailwind v4 compiles `translate-*`/`scale-*` to those standalone
           properties, so `transition-[transform]` alone compiles fine, passes lint, and
           animates nothing (TransitionGroup's own move uses an inline `transform`, which
           is why all three are listed). -->
      <span
        v-for="field in chips"
        :key="field.id"
        class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <!-- `:label` is not rendered (the slot below wins) — it feeds the remove
             control's tooltip and accessible name, so the × reads "Remove Status"
             rather than a bare "Remove" repeated four times. -->
        <Chip
          :data-filter-chip="field.id"
          :label="field.label"
          kind="filled"
          size="medium"
          clickable
          removable
          @click="edit(field)"
          @remove="remove(field)"
        >
          <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
            <!-- Muted: it is the prefix the value is read against, not the answer. -->
            <span class="truncate text-(--text-muted)">{{ field.label }}</span>
            <!-- The avatar cluster: who the filter is actually about, recognised before
                 the name beside it is read. Overlapped and ringed in the chip's own
                 surface so the stack reads as one object. -->
            <span
              v-if="avatarsOf(field).length"
              class="flex shrink-0 items-center"
            >
              <Avatar
                v-for="(option, i) in avatarsOf(field)"
                :key="String(option.value)"
                :src="option.avatar || undefined"
                :alt="option.label"
                :label="option.label"
                size="small"
                kind="circle"
                class="size-4 ring-1 ring-(--bg-surface)"
                :class="i > 0 ? '-ml-1' : ''"
              />
            </span>
            <span class="truncate">{{ summaryOf(field)?.label }}</span>
            <span
              v-if="summaryOf(field)?.extra"
              class="shrink-0 text-(--text-muted)"
            >
              +{{ summaryOf(field).extra }}
            </span>
          </span>
        </Chip>
      </span>
    </TransitionGroup>
  </div>
</template>
