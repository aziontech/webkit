<script setup>
  // The FILTER BUTTON — one control that opens the fields, plus a chip per APPLIED cut:
  //
  //   [🔍 Search connectors                                          ⚟ Filter ]
  //   (Type Storage ×)  (Status Active ×)                    ← ./FilterChips.vue
  //     ╰─ what is applied, and the × that undoes it
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
  // ONE BUTTON, AND ONLY THE CHIPS THAT ARE TRUE. The version this replaces spent a
  // whole row on the filter: a dashed `Add Filter` pill, then one chip for EVERY field
  // whether it was applied or not, so a four-field list opened with four pills under
  // the search saying nothing. What earned its place was the applied half — the field,
  // its value, and a × to undo exactly that one cut — so that is what stayed. The
  // vocabulary the offer chips advertised now lives one click away, in the panel, which
  // is where a reader goes to change a filter anyway.
  //
  // THE BUTTON IS ON THE SEARCH'S ROW; THE CHIPS ARE NOT. This half is a control of
  // fixed width, so it belongs beside the field, in the row that holds the things you
  // operate. The applied half is state whose width is DATA — one chip per cut, each as
  // wide as the value it names — so it takes the row underneath (./FilterChips.vue).
  // Together on one row they made each other worse: the field gave up width as chips
  // arrived, and the chips broke onto a second line the moment they outgrew what was
  // left of it, which reads as spill rather than structure.
  //
  // THE BUTTON SAYS `Filter`, AND ONLY THAT, in every state — that is its job, and the
  // job does not change once something is applied. What is applied is said beside it, in
  // words, by the chips; a count on the button would be a second, quieter claim about
  // state they already spell out in full. (It would also be a silent one: `Button`
  // forwards no `aria-label` — it drops every attr but `class` — so an overlaid marker
  // has no channel to announce itself, and colour is not information a screen reader can
  // read either way.)
  //
  // ONE ANCHOR. The panel always opens under the Filter button, whether it was a chip
  // or the button that asked for it — including when a chip is clicked to edit it.
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
  // outside ones. That suspension is scoped to the one level that needs it.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import { computed, nextTick, ref, watch } from 'vue'

  import { useAnimatedHeight } from '../../lib/behavior/animate-height.js'
  import { clearField, isApplied, summarizeText, toggleValue } from '../../lib/behavior/filter-bar'
  import { openChannel } from '../../lib/behavior/filter-open.js'

  const props = defineProps({
    /** The page's field catalog — see lib/behavior/filter-bar.js for the shape. */
    fields: { type: Array, required: true },
    /** Applied state: `{ [fieldId]: values[] }`. An empty entry is not a filter. */
    modelValue: { type: Object, default: () => ({}) },
    /** Label for the trigger that opens the field list. */
    label: { type: String, default: 'Filter' },
    /**
     * Size token, matched to the SEARCH FIELD this sits beside. `medium` — the 32px
     * control — is the default and what every table's controls row uses: this row
     * NARROWS a list, and it sits under a heading whose own action is the 40px
     * `large` button, so the page reads top-down as action then narrowing then rows.
     * Making both rows 40px flattened that: two full-height rows competing, and the
     * create action no longer the largest thing on the page.
     * It stays a real prop because the row decides, and the pair has to agree: a 32px
     * control next to a 40px one leaves a 4px break top and bottom, which is invisible
     * in review and obvious on screen.
     */
    size: { type: String, default: 'medium' }
  })

  const emit = defineEmits(['update:modelValue'])

  const open = ref(false)
  // Which level the panel is on: `null` is the field list, a field id is its values.
  const activeId = ref(null)
  const query = ref('')
  const panelRef = ref(null)
  const rootRef = ref(null)
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
  // (lib/behavior/animate-height.js). Level changes are routed through `toLevel` so the
  // measure -> pin -> ease -> release cycle wraps every one of them.
  const { region, height: regionHeight, animateHeight } = useAnimatedHeight()
  const toLevel = (dir, mutate) => {
    direction.value = dir
    animateHeight(mutate)
  }

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

  // Open onto a field's values. The search is always cleared: a panel that reopens
  // where it was left is a panel that reopens pre-filtered, showing a shorter list
  // than the one it promises.
  //
  // Reached from a CHIP (through the shared channel below) rather than from the button,
  // which `Popover.Trigger` handles itself — so the field id doubles as "which chip we
  // came from", and is what focus goes back to on close.
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

  // Focus a chip BY FIELD ID rather than by holding on to an element: a chip is mounted
  // and unmounted as its field is applied and cleared, so the node that was interacted
  // with is routinely not the node that should end up focused. When the field no longer
  // has a chip — it was just cleared — focus falls back to the button, which is where
  // that field now lives.
  //
  // The query runs over the DOCUMENT, not this component's root: the chips render in the
  // row below (./FilterChips.vue), so they are not inside it.
  //
  // Whether the chip EXISTS is asked of the state, not of the document. A chip that has
  // just lost its value is still in the DOM while its leave transition plays, so the
  // query would find it, focus it, and then lose the keyboard to <body> half a second
  // later when the transition ends and the node is removed — the exact drop this
  // function exists to prevent, delayed just enough to look like something else.
  const focusOrigin = async (id) => {
    await nextTick()
    const field = id ? props.fields.find((item) => item.id === id) : null
    const chip =
      field && isApplied(props.modelValue, field)
        ? document.querySelector(`[data-filter-chip="${id}"]`)
        : null
    ;(chip ?? rootRef.value?.querySelector('[data-testid="filter-button__trigger"]'))?.focus()
  }

  // Closing resets the level AND puts focus back where the panel was opened from.
  //
  // The second half is here because `Popover` cannot do it: it restores focus by
  // calling `.focus()` on its trigger WRAPPER (a `<span>` with no tabindex), which is
  // a no-op — so whenever focus is genuinely inside the panel, closing drops it on
  // <body> and a keyboard user loses their place in the row.
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
    focusOrigin(id)
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
  // is suspended while the grid is open — narrowly, for the one level that needs it.
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
  // store it as the field's single value and unwind to the row.
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
    focusOrigin(id)
  }

  const clear = (field) => {
    emit('update:modelValue', clearField(props.modelValue, field))
  }
  // A CHIP ASKING FOR ITS FIELD. The chips are a sibling component, so they cannot call
  // `enter` directly; they raise a request on the channel keyed by the field catalog both
  // halves were given (../../lib/behavior/filter-open.js) and this watcher answers it.
  // Keyed off the request's token rather than the field id, so asking twice for the same
  // field is two openings and not one.
  const openRequest = openChannel(props.fields)
  watch(openRequest, (request) => {
    if (request?.field) enter(request.field)
  })

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
  <!-- `shrink-0`: this is a control of FIXED width sharing the controls row with a
       search field that grows, so it keeps its size and its label instead of being
       compressed as the field takes the slack. -->
  <div
    ref="rootRef"
    class="flex shrink-0 items-center"
    data-testid="filter-button"
  >
    <!-- BOTTOM-END: the panel hangs DOWN from the button with its RIGHT edge on the
         button's right edge. This button sits at the right end of the controls row, so
         `bottom-start` anchored the panel's LEFT edge there and sent 280px of panel
         off the viewport — where `usePlacement` clamped it back to 8px from the edge.
         Clamped is not anchored: the panel landed near the corner by accident, and its
         `--popup-origin` still said `top left`, so the open animation scaled out of a
         corner the panel was no longer in.
         `flip` is on by default in `usePlacement`, so this stays automatic where it
         has to be: no room below and the panel opens upward from the same edge
         (top-end), and either way it is clamped inside the viewport. -->
    <Popover
      v-model:open="open"
      placement="bottom-end"
      :dismissible="!calendarOpen"
      class="shrink-0"
    >
      <!-- No @click of its own: `Popover.Trigger` already toggles on the click that
           bubbles out of its child, and a handler here would run first and then be
           undone by it. Reopening always lands on the field list because closing
           resets the level. -->
      <Popover.Trigger>
        <!-- The size comes from the caller, matched to the field beside it — `medium`
             on a controls row, which is the whole population today (see the prop).
             Nothing is overlaid on the button — the chips in the row below say what is
             applied, in words. -->
        <Button
          :label="label"
          kind="outlined"
          :size="size"
          icon="ai ai-filter-alt"
          data-testid="filter-button__trigger"
        />
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
             is driven by the ARRIVING level; `useAnimatedHeight` eases the region
             between the two natural heights so a 7-author list and a 2-status list do
             not snap the panel.
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
                     target, which is what an IconButton is for — making the field's own
                     name the button would mean the heading that says WHERE YOU ARE is
                     also the control that leaves.

                     It pads vertically by `--spacing-xs`, the SAME step every row below
                     it takes (ROW_CLASS's `py`), so the header is one row tall rather
                     than a tighter strip. -->
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
                         list and says what it is set to, so the panel and the chips
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
  </div>
</template>
