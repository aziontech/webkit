<script setup>
  // The FILTER BAR — narrowing a list as a ROW OF PILLS rather than a panel of fields:
  //
  //   (⚟ Add Filter)  (Author ⬤⬤ Bruno +2 ×)  (Last Modified Jun 1 – Jun 17 ×)  (Status)
  //     ╰─ dashed: it MAKES        ╰─ applied: value, faces, ×        ╰─ an offer: no
  //        filters, it isn't one      raised by --shadow-sm              value, no ×
  //
  //   The panel is a STACK OF LEVELS that slides, not a form:
  //
  //     ┌─────────────────────┐  drill ▶  ┌─────────────────────┐  Custom… ▶  ┌──────────┐
  //     │ Filter by…          │           │ ‹  Last Modified    │             │ ‹  Last… │
  //     ├─────────────────────┤  ◀ back   ├─────────────────────┤   ◀ back    ├──────────┤
  //     │ Author            › │           │ Last 24 hours       │             │  month   │
  //     │ Infrastructure    › │           │ Last 7 days       ✓ │             │   grid   │
  //     │ Status            › │           │ Last 30 days        │             │          │
  //     │ Last Modified     › │           │ Custom…           › │             └──────────┘
  //     └─────────────────────┘           ├─────────────────────┤
  //                                       │ Clear Last Modified │
  //                                       └─────────────────────┘
  //
  // WHY A BAR AND NOT A PANEL. The filter this replaced held one always-mounted
  // Select per column behind a single icon, so what was applied lived
  // inside a closed panel and only a badge count leaked out — "2" tells you that the
  // list you are reading is not the whole list, but not which two cuts made it, and
  // never on what values. Every question about the current filter cost a click. A chip
  // answers all of it in the row itself: the field, the value, and a × to undo exactly
  // one of them. That is also what makes the state SHAREABLE by eye — a screenshot of
  // this row is the query.
  //
  // THE OFFER CHIPS are the other half of the trade. Collapsing the fields behind an
  // icon hid not just the values but the very fact that Infrastructure and Status were
  // filterable at all — the panel had to be opened to be discovered. So a field that is
  // not applied still renders, recessed and ×-less: it reads as an invitation rather
  // than a state, and clicking it opens straight into its values. The bar therefore
  // always shows the FULL vocabulary of the filter, and every chip holds its position
  // for the life of the page whether it is applied or not.
  //
  // ONE ANCHOR. The panel always opens under the Add Filter pill, whether it was a chip
  // or that pill which asked for it — including when a chip is clicked to edit it.
  // Anchoring to each chip would put the panel wherever that chip happened to wrap to,
  // so the same content would appear somewhere different on every visit; one fixed
  // anchor makes the panel a place, and the chips a way to get there.
  //
  // LEVELS THAT SLIDE, NOT A FLYOUT. Going deeper replaces the panel's contents and
  // offers a ‹ back, rather than opening a second panel beside the first: a flyout has
  // to find horizontal room it does not have on a narrow viewport, and it doubles the
  // light-dismiss surface (the outside of the submenu is the inside of its parent).
  // Levels slide horizontally in the direction of travel and the panel eases between
  // their heights, so "deeper" and "back" are legible as directions instead of two
  // indistinguishable redraws — which is the whole reason a drill-down can be followed
  // at all without a breadcrumb.
  //
  // The panel light-dismisses (outside-click and Escape) everywhere except the month
  // grid, which teleports its own overlay to <body> and would read its own clicks as
  // outside ones. That suspension is scoped to the one level that needs it, rather than
  // switched off for every field the way the old filter popover had to.
  import Avatar from '@aziontech/webkit/avatar'
  import Calendar from '@aziontech/webkit/calendar'
  import Chip from '@aziontech/webkit/chip'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import { computed, nextTick, ref, watch } from 'vue'

  import { useAnimatedHeight } from '../../lib/behavior/animate-height.js'
  import {
    clearField,
    filterCount,
    isApplied,
    pickedAvatars,
    summarize,
    summarizeText,
    toggleValue
  } from '../../lib/behavior/filter-bar'

  const props = defineProps({
    /** The page's field catalog — see lib/filter-bar.js for the shape. */
    fields: { type: Array, required: true },
    /** Applied state: `{ [fieldId]: values[] }`. An empty entry is not a filter. */
    modelValue: { type: Object, default: () => ({}) },
    /** Label for the trigger that opens the field list. */
    label: { type: String, default: 'Add Filter' }
  })

  const emit = defineEmits(['update:modelValue'])

  const open = ref(false)
  // Which level the panel is on: `null` is the field list, a field id is its values.
  const activeId = ref(null)
  const query = ref('')
  const panelRef = ref(null)
  const barRef = ref(null)
  // Which CHIP opened the panel, if a chip did. Only used to put focus back on it.
  const originId = ref(null)

  const activeField = computed(
    () => props.fields.find((field) => field.id === activeId.value) ?? customField.value
  )

  // Which way the next level change travels. The slide classes cannot infer it — the
  // same pair of levels is a drill one way and a retreat the other — so whoever changes
  // the level says so.
  const direction = ref('forward')

  // One key per level, so the Transition treats a level change as a swap of blocks
  // rather than a patch of the same one.
  const levelKey = computed(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })

  // The panel's height eases between the natural heights of the two levels
  // (lib/animate-height.js). Level changes are routed through `toLevel` so the measure
  // -> pin -> ease -> release cycle wraps every one of them.
  const { region, height: regionHeight, animateHeight } = useAnimatedHeight()
  const toLevel = (dir, mutate) => {
    direction.value = dir
    animateHeight(mutate)
  }

  // CATALOG ORDER, ALWAYS — a chip never changes position, applied or not.
  //
  // Promoting the applied ones to the front was the first version, and it cost more
  // than it bought. Mechanically it broke the width animation outright: promotion
  // reorders the node in the DOM, and re-inserting an element discards its pending CSS
  // transition, so the chip that had just been given a value jumped to its new size
  // instead of growing into it (measured: 8 interpolated frames when the chip stays
  // put, 0 when it moves). It also meant the pill you just clicked was never where you
  // left it.
  //
  // Nothing is lost by holding the order, because grouping was never what told the two
  // apart — the fill, the border, the value and the × do that, and they are far louder
  // than position. Holding it adds something instead: "Status is the third pill" stays
  // true for the life of the page.
  const chips = computed(() => props.fields)

  // How many fields are narrowing the list. The bar only ever renders whether this is
  // > 0 — a dot, not a number — but the count is what the trigger's accessible name
  // says, since a dot announces nothing on its own.
  const appliedCount = computed(() => filterCount(props.modelValue))

  // ONE search field serves both levels — it narrows whatever the panel is currently
  // listing (fields, then that field's values). A second field on the second level
  // would be a different control in the same slot, which is how a user learns to
  // distrust a search box.
  const rows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const source = activeField.value ? (activeField.value.options ?? []) : props.fields
    if (!term) return source
    return source.filter((row) => row.label.toLowerCase().includes(term))
  })

  const values = computed(() => props.modelValue[activeId.value] ?? [])
  const isPicked = (value) => values.value.includes(value)

  // Per-chip reads. Kept as functions rather than one computed map because a chip's
  // content is rendered for EVERY field, applied or not — the collapsed half still
  // has to render something for its width to animate from.
  const summaryOf = (field) => summarize(field, props.modelValue[field.id])
  const avatarsOf = (field) => pickedAvatars(field, props.modelValue[field.id])

  // Open onto a field's values. The search is always cleared: a panel that reopens
  // where it was left is a panel that reopens pre-filtered, showing a shorter list
  // than the one it promises.
  //
  // Only a CHIP calls this — the Add Filter button is handled by `Popover.Trigger`
  // itself — so the field id doubles as "which chip we came from".
  const enter = (fieldId) => {
    originId.value = fieldId
    // Opening the panel is not a level change — there is no outgoing level to slide
    // away — so only an already-open panel animates the move.
    if (open.value) {
      toLevel('forward', () => {
        activeId.value = fieldId
        query.value = ''
      })
      return
    }
    activeId.value = fieldId
    query.value = ''
    open.value = true
  }
  const back = () => {
    toLevel('back', () => {
      activeId.value = null
      query.value = ''
    })
  }

  // Focus a field's chip BY ID rather than by holding on to an element: a chip is
  // remounted whenever it crosses between applied and idle (see the template), so the
  // node that was interacted with is routinely not the node that should end up focused.
  const restoreChipFocus = async (id) => {
    await nextTick()
    barRef.value?.querySelector(`[data-filter-chip="${id}"]`)?.focus()
  }

  // Closing resets the level AND puts focus back on the chip that opened the panel.
  //
  // The second half is here because `Popover` cannot do it: it restores focus by
  // calling `.focus()` on its trigger WRAPPER (a `<span>` with no tabindex), which is
  // a no-op — so whenever focus is genuinely inside the panel, closing drops it on
  // <body> and a keyboard user loses their place in the bar. Opening from the button
  // happens to survive that (focus never left the button), but opening from a chip
  // does not. The chip is also the better target of the two: it is what the panel was
  // about.
  watch(open, (isOpen) => {
    if (isOpen) return
    // Reset directly, not through `toLevel`: the panel is unmounting, so there is
    // nothing to slide and nothing to measure.
    activeId.value = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
    const id = originId.value
    originId.value = null
    if (id) restoreChipFocus(id)
  })

  const pick = (field, option) => {
    // `Custom…` is not a value — it is a request for the month grid. Drop to the third
    // level and open the calendar; nothing is committed until a range comes back.
    if (option.custom) {
      toLevel('forward', () => {
        customId.value = field.id
      })
      calendarOpen.value = true
      return
    }
    emit('update:modelValue', toggleValue(props.modelValue, field, option.value))
    // A range holds exactly ONE value, so the pick IS the answer and the level is
    // finished — go back. An options field accumulates, so staying put is what lets
    // the user check three authors without reopening the same list three times.
    if (field.kind === 'range') back()
  }

  // ── The third level: a month grid, only for `Custom…` ──────────────────────
  // `Calendar` has no inline mode — it is a trigger plus its own popover, teleported
  // to <body>. That is workable here precisely because it is teleported ABOVE this
  // panel (`--z-input-overlay` beats the popover tier), but it does mean a click in the
  // month grid is an outside-click as far as this panel is concerned. So light-dismiss
  // is suspended while the grid is open — narrowly, for the one level that needs it,
  // instead of being switched off for every field the way the old filter popover had to.
  const customId = ref(null)
  const calendarOpen = ref(false)
  const customField = computed(() => props.fields.find((field) => field.id === customId.value))
  const customRange = ref(null)

  const leaveCustom = () => {
    calendarOpen.value = false
    customRange.value = null
    toLevel('back', () => {
      customId.value = null
    })
  }

  // Calendar commits on its own Apply, so a value arriving here IS the user's answer:
  // store it as the field's single value and unwind to the chips.
  const commitCustom = (range) => {
    const field = customField.value
    if (!field) return
    const next = { ...props.modelValue }
    if (range?.start || range?.end) next[field.id] = [range]
    else delete next[field.id]
    emit('update:modelValue', next)
    const id = field.id
    leaveCustom()
    back()
    open.value = false
    restoreChipFocus(id)
  }

  const clear = (field) => {
    emit('update:modelValue', clearField(props.modelValue, field))
  }
  const clearFromChip = (field) => {
    clear(field)
    // Removing the last value of the field the panel is showing would leave it on a
    // level with nothing applied — harmless, but the panel is not what the user was
    // looking at when they clicked a chip's ×.
    if (activeId.value === field.id) back()
    // The × that was just activated belongs to a chip that is now being replaced by
    // its dimmed offer, so keyboard focus would land on <body>. Move it to the
    // replacement: the field is still there to filter by, and it is still where the
    // user was looking.
    restoreChipFocus(field.id)
  }

  // Rows are always looked up INSIDE THE CURRENT LEVEL. A level that is sliding out is
  // still in the DOM until its transition ends, so an unscoped query over the panel
  // returns the outgoing level's rows too — focusing one of those puts the keyboard on
  // an element that is about to be removed, which drops focus to <body>.
  const levelRows = () => [
    ...(panelRef.value?.querySelectorAll(`[data-level="${levelKey.value}"] [data-filter-row]`) ??
      [])
  ]

  // Arrow keys walk the rows, because this list IS a menu — Tab alone would make
  // reaching the fifth field five keystrokes and would leave the panel at the end.
  // (Popover traps Tab within the panel, so this only has to handle the arrows.)
  const move = (event, step) => {
    const items = levelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target)
    items[(index + step + items.length) % items.length]?.focus()
  }

  // Arriving at a level moves focus to its first row, so the keyboard lands where the
  // eye does instead of staying on a row that no longer exists. Keyed off `levelKey`
  // rather than `activeId` so the month-grid level counts as a level too.
  watch(levelKey, async () => {
    await nextTick()
    levelRows()[0]?.focus()
  })

  const ROW_CLASS =
    'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <!-- `flex-wrap` and not a scroller: a filter you cannot see is a filter you forget
       you set, so the bar grows downwards and pushes the list rather than hiding its
       own tail behind an edge. -->
  <div
    ref="barRef"
    class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    data-testid="filter-bar"
  >
    <Popover
      v-model:open="open"
      placement="bottom-start"
      :dismissible="!calendarOpen"
      class="shrink-0"
    >
      <!-- The trigger is a `dashed` Chip, so the bar is one row of chips end to end with
           a single shape distinction: a dashed outline is the standing convention for
           "add another one of these", separating the thing that CREATES a filter from the
           things that ARE filters. A Chip can hold this job only because its Enter/Space
           now dispatches a real DOM click — `Popover.Trigger` opens on the click that
           bubbles out of its child, so the earlier emit-only chip would have worked with
           the mouse and done nothing from the keyboard.
           No @click of its own: `Popover.Trigger` already toggles on that bubbled click,
           and a handler here would run first and then be undone by it. Reopening always
           lands on the field list because closing resets the level. -->
      <Popover.Trigger>
        <!-- The trigger stays `dashed` in every state: it is the thing that ADDS a
             filter, and that job does not change once one is applied. What changes is a
             DOT — primary, 8px, no number. A count would be a second, louder claim about
             state the chips already spell out in full beside it; the dot answers only
             the question the chips cannot answer at a glance when the bar is wide or
             wrapped: is anything narrowing this list at all.
             The dot is `aria-hidden` and the count rides the chip's accessible name
             instead, because colour is not information a screen reader can read. -->
        <!-- The indicator is positioned against THIS wrapper, not placed inside the
             chip. Two reasons, both load-bearing: the chip's root is `overflow-hidden`
             (it clips its own hover wash to the pill), so a dot inside it could never
             overhang the edge — it would be cut off; and an in-flow dot would widen the
             pill and shift its label every time a filter is applied, which is motion
             that says nothing. Overlaid, the trigger's box never changes.
             `pointer-events-none` keeps the dot from swallowing a click meant for the
             trigger, and the canvas-coloured ring separates it from the pill edge under
             it — the same shape the popover this replaced used for its badge.
             It sits at `top-px right-px`, not at the box's corner. On a PILL the corner
             of the bounding box is empty space outside the curve, so a dot pinned there
             floats free of the shape; the 45° point of a 32px pill's arc is ~4.7px in
             from each edge, which is where this lands it — straddling the border, with
             the ring punched through it. -->
        <span class="relative inline-flex">
          <Chip
            kind="dashed"
            size="medium"
            clickable
            data-testid="filter-bar__add"
            :aria-label="
              appliedCount ? `${label}: ${appliedCount} applied` : `${label}: none applied`
            "
          >
            <!-- The glyph rides the default SLOT rather than an `icon` prop: this is the
                 only chip in the bar that carries one — the applied and available chips
                 are identified by their field name, and a glyph on each would be four
                 different icons competing with the values beside them. Composing it here
                 keeps the component's prop surface from growing for a single call site. -->
            <!-- The glyph takes the chip's own `--text-default`, not a muted step. It is
                 half of a two-word label, not an adornment beside one: muting it made the
                 icon read as a disabled hint next to live text. -->
            <i
              class="ai ai-filter-alt"
              aria-hidden="true"
            />
            {{ label }}
          </Chip>
          <!-- Not a `badge` (that carries a count) and not `status-indicator` (that is a
               dot PLUS a label inside a `role="status"` live region, so an empty label
               would add 12px of gap and announce nothing). A bare marker is all this is. -->
          <span
            v-if="appliedCount"
            data-testid="filter-bar__indicator"
            class="pointer-events-none absolute top-px right-px size-2 rounded-full bg-(--primary) ring-2 ring-(--bg-canvas)"
            aria-hidden="true"
          />
        </span>
      </Popover.Trigger>

      <Popover.Content>
        <!-- THE LEVEL STACK. Each level is a keyed block inside one clipping region,
             so moving between them SLIDES rather than swapping: the outgoing level
             leaves towards the side you came from and the incoming one arrives from the
             side you are going to, which is what makes "deeper" and "back" feel like
             directions instead of two indistinguishable redraws. `direction` is set by
             whoever changes the level, because the classes alone cannot know whether a
             given change was a drill or a retreat.
             The leaving level is taken out of flow (`absolute`), so the region's height
             is driven by the ARRIVING level; `useAnimatedHeight` (lib/animate-height.js,
             shared with the onboarding flow) eases the region between the two natural
             heights so a 7-author list and a 2-status list do not snap the panel.
             The transitions name `translate`, not `transform`: Tailwind v4 compiles
             `translate-x-*` to the standalone `translate` property (and `scale-*` to
             `scale`), so a `transition-[transform]` here would compile fine, pass lint,
             and silently animate nothing. -->
        <div
          ref="panelRef"
          class="flex flex-col"
          @keydown.down="move($event, 1)"
          @keydown.up="move($event, -1)"
        >
          <div
            ref="region"
            :style="{ height: regionHeight }"
            class="relative overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
          >
            <Transition
              :enter-from-class="
                direction === 'forward'
                  ? 'translate-x-[12%] opacity-0'
                  : 'translate-x-[-12%] opacity-0'
              "
              enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              :leave-to-class="
                direction === 'forward'
                  ? 'translate-x-[-12%] opacity-0'
                  : 'translate-x-[12%] opacity-0'
              "
              leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            >
              <!-- THE CONTENT COLUMN is `--spacing-md` (16px): the list pads by
                   `--spacing-xxs` (4px) and a row by `--spacing-sm` (12px), so a row's
                   TEXT lands at 16px. The header and the month grid pad by that one
                   token, which puts the back button's box on the same x as every row
                   label. All three are existing spacing tokens — nothing derived. -->
              <div
                :key="levelKey"
                :data-level="levelKey"
                class="flex flex-col"
              >
                <!-- A deeper level's header: an IconButton to go back, then the level's
                     name as plain text. Back is a discrete action with a discrete
                     target, which is what an IconButton is for — the whole-row version
                     this replaces made the field's own name a button, so the heading
                     that says WHERE YOU ARE was also the control that leaves.

                     It pads vertically by `--spacing-xs`, the SAME step every row below
                     it takes (ROW_CLASS's `py`), so the header is one row tall rather
                     than a tighter strip: at `--spacing-xxs` its 24px button left a 32px
                     header above a 40px search block, and the panel read as though its
                     first row had been squeezed. -->
                <div
                  v-if="activeField"
                  class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)"
                >
                  <IconButton
                    icon="pi pi-angle-left"
                    kind="outlined"
                    size="small"
                    :aria-label="customField ? 'Back to date periods' : 'Back to all filters'"
                    @click="customField ? leaveCustom() : back()"
                  />
                  <span class="truncate text-label-sm text-(--text-default)">
                    {{ activeField.label }}
                  </span>
                </div>

                <!-- LEVEL 3 — the month grid, reached only from `Custom…`. -->
                <div
                  v-if="customField"
                  class="px-(--spacing-md) py-(--spacing-sm)"
                >
                  <Calendar
                    v-model="customRange"
                    v-model:open="calendarOpen"
                    mode="range"
                    size="medium"
                    :show-fields="false"
                    placeholder="Pick a range"
                    class="w-full [&>span]:w-full [&>span>span]:w-full"
                    @update:model-value="commitCustom"
                  />
                </div>

                <template v-else>
                  <!-- "Filter by…" names what the field does to the LIST, which is the
                       thing the user is here to change — a "Search" placeholder would
                       name the control instead, and there are two searches on this
                       page. -->
                  <div class="border-b border-(--border-default) p-(--spacing-xs)">
                    <InputText
                      v-model="query"
                      size="medium"
                      class="w-full"
                      :placeholder="
                        activeField ? `Filter ${activeField.label.toLowerCase()}…` : 'Filter by…'
                      "
                      :aria-label="
                        activeField ? `Search ${activeField.label} values` : 'Search filter fields'
                      "
                    >
                      <!-- The same leading glyph the page's own search field carries, so
                           the two read as one kind of control at both scales. -->
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </InputText>
                  </div>

                  <!-- The list scrolls at a fixed ceiling so a long roster (Author)
                       cannot grow the panel past the fold, while the search above and
                       the clear below stay put — the two controls that get you out of a
                       long list are the last things that should scroll away with it. -->
                  <div
                    class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)"
                  >
                    <!-- LEVEL 1 — the fields. An applied field keeps its place in the
                         list and says what it is set to, so the menu and the chip row
                         never disagree about the current filter. -->
                    <template v-if="!activeField">
                      <button
                        v-for="field in rows"
                        :key="field.id"
                        type="button"
                        data-filter-row
                        :class="ROW_CLASS"
                        :aria-expanded="false"
                        @click="enter(field.id)"
                      >
                        <span class="grow truncate">{{ field.label }}</span>
                        <span
                          v-if="isApplied(modelValue, field)"
                          class="truncate text-(--text-muted)"
                        >
                          {{ summarizeText(field, modelValue[field.id]) }}
                        </span>
                        <i
                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </button>
                    </template>

                    <!-- LEVEL 2 — the values. `menuitemcheckbox` for a field that
                         accumulates, `menuitemradio` for one that replaces: the role is
                         what tells a screen reader whether picking a second value adds
                         to the first or supersedes it. `Custom…` gets NEITHER role — it
                         commits nothing, it opens the grid, so announcing it as a
                         checkable option would promise a state it never holds. -->
                    <template v-else>
                      <button
                        v-for="option in rows"
                        :key="String(option.value)"
                        type="button"
                        data-filter-row
                        :role="
                          option.custom
                            ? undefined
                            : activeField.kind === 'range'
                              ? 'menuitemradio'
                              : 'menuitemcheckbox'
                        "
                        :aria-checked="option.custom ? undefined : isPicked(option.value)"
                        :class="ROW_CLASS"
                        @click="pick(activeField, option)"
                      >
                        <!-- An option may carry a face (`avatar`) — a person is
                             recognised faster than their name is read, and it is how the
                             same person is already identified in the Last Modified cell
                             they were filtered out of. -->
                        <Avatar
                          v-if="'avatar' in option"
                          :src="option.avatar || undefined"
                          :alt="option.label"
                          :label="option.label"
                          size="small"
                          kind="square"
                          class="shrink-0"
                        />
                        <span class="grow truncate">{{ option.label }}</span>
                        <!-- `Custom…` leads onward, so it takes the chevron the field
                             rows use; a value takes the check. The glyph cell is held
                             either way, so picking does not shift the labels beside it. -->
                        <i
                          v-if="option.custom"
                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <i
                          v-else
                          class="pi pi-check shrink-0 text-(--text-default)"
                          :class="isPicked(option.value) ? '' : 'invisible'"
                          aria-hidden="true"
                        />
                      </button>
                    </template>

                    <!-- A search that matches nothing has to say so; an empty panel
                         reads as a broken filter rather than an unmatched term. -->
                    <p
                      v-if="!rows.length"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                    >
                      No match for “{{ query }}”.
                    </p>
                  </div>

                  <!-- Undo lives on the level it undoes: a value level clears the field
                       it is showing, and there is deliberately no "clear all" here — the
                       chips already carry one × each, and a single button that wipes a
                       row of visible state is the one action this pattern does not need
                       to hide in a panel. -->
                  <div
                    v-if="activeField && isApplied(modelValue, activeField)"
                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                  >
                    <button
                      type="button"
                      :class="ROW_CLASS"
                      @click="clear(activeField)"
                    >
                      <i
                        class="pi pi-filter-slash text-(--text-muted)"
                        aria-hidden="true"
                      />
                      Clear {{ activeField.label }}
                    </button>
                  </div>
                </template>
              </div>
            </Transition>
          </div>
        </div>
      </Popover.Content>
    </Popover>

    <!-- ONE STABLE CHIP PER FIELD, applied or not — the same node keyed by field id
         for the life of the bar. Everything below depends on that: a chip that is
         never destroyed can MOVE when applying a filter promotes it to the front, and
         can GROW as its value appears, instead of one element vanishing and a
         differently-sized one popping in somewhere else.
         `Chip`'s own `removable` carries the × here, which it can only do because it
         emits `remove` and stops. An earlier build faded the whole chip to opacity 0
         first — correct for a chip that is going away, wrong here, where dropping a
         value leaves the FIELD behind as an offer, so the instance stayed invisible
         forever and the field vanished from the bar. Presence is this component's call,
         and it keeps every chip.
         THE OFFER STATE IS TOKENS, NOT OPACITY. All chips share one fill
         (`--bg-surface`) and one border (`--border-default`); an offer recedes by
         losing the applied chip's `--shadow-sm` and by holding nothing but its muted
         field name, while an applied one adds a `--text-default` value beside it.
         Opacity was the first attempt and was wrong twice over: it washes the border
         and the label by the same amount when they should recede differently, and it
         occupies the ROOT's opacity, which is what the entrance transition needs. It
         also could not have worked — a base `opacity-60` is emitted after `opacity-0`,
         so the enter-from class would have been dead on arrival. -->
    <TransitionGroup
      tag="div"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
      appear
      move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="scale-90 opacity-0"
      enter-active-class="[transition-delay:var(--chip-enter-delay)]"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="absolute"
    >
      <!-- The MOTION LIVES ON THIS WRAPPER, not on the Chip — TransitionGroup animates
           the element it iterates, and keeping that a plain span leaves the Chip free to
           be nothing but a Chip. The transitions name `translate` and `scale`, not just
           `transform`: Tailwind v4 compiles `translate-*`/`scale-*` to those standalone
           properties, so `transition-[transform]` alone compiles fine, passes lint, and
           animates nothing (TransitionGroup's own move uses an inline `transform`, which
           is why all three are listed). -->
      <span
        v-for="(field, index) in chips"
        :key="field.id"
        class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        :style="{ '--chip-enter-delay': `${index * 45}ms` }"
      >
        <!-- NO STYLING CLASSES HERE. `kind` carries the whole applied/available
             distinction — `filled` is a value that is applied, `outlined` one that could
             be — and `removable` carries the ×. Both used to be consumer-side overrides
             on this chip (`data-offer:border-…`, plus a hand-rolled × button); they
             live in the component now, so any other surface gets the same three chip
             jobs without restyling anything. -->
        <!-- `:label` is not rendered (the slot below wins) — it feeds the remove
             control's tooltip and accessible name, so the × reads "Remove Status"
             rather than a bare "Remove" repeated four times. -->
        <Chip
          :data-filter-chip="field.id"
          :label="field.label"
          :kind="isApplied(modelValue, field) ? 'filled' : 'outlined'"
          size="medium"
          clickable
          :removable="isApplied(modelValue, field)"
          @click="enter(field.id)"
          @remove="clearFromChip(field)"
        >
          <span class="flex min-w-0 items-center">
            <!-- Muted either way: on an applied chip it is the prefix the value is read
                 against, on an offer it is the whole recessed invitation. -->
            <span class="truncate text-(--text-muted)">{{ field.label }}</span>

            <!-- THE WIDTH ANIMATION. A grid track cannot be transitioned from `auto`,
                 but it CAN be transitioned from `0fr` to `1fr` — so the value lives in a
                 single-column grid whose track is the thing that animates, and the chip's
                 own `auto` width follows it. That is what makes applying a filter read as
                 the chip growing to hold its answer rather than being replaced by a
                 bigger one. It only works because the chip keeps its DOM position, which
                 is why the bar never reorders (see `chips`). -->
            <span
              class="grid grid-cols-[0fr] transition-[grid-template-columns] duration-moderate-01 ease-productive-entrance data-shown:grid-cols-[1fr] motion-reduce:transition-none"
              :data-shown="isApplied(modelValue, field) || null"
            >
              <!-- Padding on the CLIP would survive the collapse — it is not content, so
                   `min-width: 0` cannot shrink it — and every offer chip would carry dead
                   space where its value belongs. So the clip is bare and the gap lives on
                   the row inside it, which is clipped along with the text. -->
              <span class="min-w-0 overflow-hidden">
                <span
                  class="flex min-w-0 items-center gap-(--spacing-xxs) whitespace-nowrap pl-(--spacing-xxs)"
                >
                  <!-- The avatar cluster: who the filter is actually about, recognised
                       before the name beside it is read. Overlapped and ringed in the
                       chip's own surface so the stack reads as one object. -->
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
              </span>
            </span>
          </span>
        </Chip>
      </span>
    </TransitionGroup>
  </div>
</template>
