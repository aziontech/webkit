<script setup>
  // PICK ONE THAT ALREADY EXISTS — the half of the resource question that is a LIST.
  //
  // Every create in this console that involves a resource asks the same thing: one that
  // already exists, or a new one? The "new one" half is fields, and fields differ per
  // resource — a firewall takes modules, an application takes a name. The "already exists"
  // half is identical every time: a list of rows, a way to narrow it, a way to see more of
  // it, and a mark on the one that was picked. That half is this file.
  //
  // It was written inside ../firewall/FirewallBinding.vue and lived there alone while the
  // firewall was the only resource a create could bind. The workload create now binds an
  // application the same way, so the list moved out rather than being typed a second time:
  // two paged lists in one console that arrive at two different speeds, mark selection two
  // different ways, or disagree about when a search field is worth showing is exactly the
  // drift a shared control exists to prevent.
  //
  // WHAT STAYS WITH THE CALLER. Which resources are on offer, what the card around this is
  // titled, and what the OTHER branch asks. This control knows only how to show rows.
  import Button from '@aziontech/webkit/button'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  const props = defineProps({
    // The resources on offer: `{ value, label, description }`. Empty is a real state — the
    // caller decides what to say about it, because "no firewalls" and "no applications"
    // are different sentences.
    options: { type: Array, default: () => [] },
    // The glyph on each row's media tile. A resource's own icon, so a list of applications
    // and a list of firewalls are told apart before either label is read.
    icon: { type: String, default: 'pi pi-box' },
    // What one of these is called, lowercase and singular — used in the search
    // placeholder, the spoken summary and the no-match line.
    noun: { type: String, default: 'resource' },
    // The plural, when it is not the singular plus an "s".
    nounPlural: { type: String, default: '' },
    // The message from the flow's own validation. It rides ABOVE the rows — see below.
    message: { type: String, default: '' },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  // The chosen value. `''` is "nothing picked yet", which is a state the caller validates.
  const chosen = defineModel({ type: String, default: '' })

  const plural = computed(() => props.nounPlural || `${props.noun}s`)

  // --- A FEW ROWS, THEN SEARCH ---------------------------------------------
  // An account can hold dozens of a resource, and this is a create form, not that
  // resource's module: the card cannot become the list. So it shows the FIRST FIVE — the
  // order the caller passes, which is most-recently-touched everywhere it is used — and
  // lets the reader either narrow to what they want or ask for more.
  //
  // Both affordances only exist when there is more than one page. A search field over
  // three rows is furniture, and a Load-more button with nothing to load is a lie.
  //
  // Paging over a WINDOW rather than a page number: `shown` only ever grows, so loading
  // more never moves a row the reader was reading, and the answer they already picked
  // cannot fall off the list behind them. It is the same shape the domain overflow list
  // uses (../list/DomainOverflowPopover.vue).
  const PAGE_SIZE = 5

  // Long enough for the skeleton wire to read as the next page ARRIVING rather than as a
  // flicker. In the real console this is the request; here it stands in for one — the same
  // stand-in ../list/DomainOverflowPopover.vue makes, at the same duration, so two paged
  // lists in one console do not arrive at two different speeds.
  const LOAD_LATENCY_MS = 420

  // Deterministic widths, so the wire reads as a column of names rather than five
  // identical bars — and reads the same on every press.
  const WIRE_WIDTHS = ['62%', '48%', '70%', '54%', '44%']
  const WIRE_SUB_WIDTHS = ['84%', '66%', '78%', '58%', '72%']

  const query = ref('')
  const shown = ref(PAGE_SIZE)
  const loading = ref(false)

  const paged = computed(() => props.options.length > PAGE_SIZE)

  const matches = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return props.options
    return props.options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        String(option.description ?? '')
          .toLowerCase()
          .includes(q)
    )
  })

  const visible = computed(() => matches.value.slice(0, shown.value))
  const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  // The next page is ASKED FOR, and asking takes time. The wire that stands in for the
  // incoming rows is what makes the press feel answered — without it the button is dead
  // for 420ms and a reader presses it twice.
  let loadTimeoutId = null

  const cancelLoad = () => {
    if (loadTimeoutId) clearTimeout(loadTimeoutId)
    loadTimeoutId = null
    loading.value = false
  }

  // Narrowing produces a different list, so it gets a fresh first page — keeping the old
  // offset would dump every match at once for a query that matches few.
  watch(query, () => {
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  // A reader who comes BACK to this part must see their answer, and an answer sitting on
  // page three would be invisible — the list would look untouched and they would pick a
  // second one. So the window opens wide enough to contain it.
  const chosenIndex = props.options.findIndex((option) => option.value === chosen.value)
  if (chosenIndex >= PAGE_SIZE) {
    shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE
  }

  // Spoken, not just drawn: pressing Load more replaces nothing on screen that a screen
  // reader is looking at, so the count is what tells it the press did something.
  const summary = computed(() => {
    if (loading.value) return `Loading ${nextBatch.value} more ${plural.value}`
    const total = props.options.length
    if (query.value.trim() && !matches.value.length) {
      return `No ${props.noun} matches ${query.value}`
    }
    if (remaining.value) return `${visible.value.length} of ${matches.value.length} ${plural.value}`
    return query.value.trim()
      ? `${matches.value.length} of ${total} ${plural.value}`
      : `${total} ${plural.value}`
  })

  const loadMore = () => {
    if (loading.value || !remaining.value) return
    loading.value = true
    loadTimeoutId = setTimeout(() => {
      shown.value += PAGE_SIZE
      cancelLoad()
    }, LOAD_LATENCY_MS)
  }

  // A timer outliving the part it belongs to would land rows into a list nobody is looking
  // at — and in a wizard the reader leaves this part by pressing Next.
  onScopeDispose(cancelLoad)

  // The caller hides this whole control when it crosses to the create branch; doing so
  // mid-flight would land a page behind a closed disclosure. Exposed rather than watched
  // internally, because the condition that abandons the page is the caller's, not ours.
  defineExpose({ cancelLoad })
</script>

<template>
  <div class="min-w-0">
    <!-- THE SEARCH, AND THE MESSAGE. The list is not a field, so it has no FieldStack to
         carry either, and both ride ABOVE the rows: a failed advance has to land the
         reader somewhere they can act (see ../../lib/behavior/reveal-invalid.js), and the
         caret goes into the search, which is how the rows below get narrowed to the one
         they meant. A message at the foot of the rows would land off-screen on the very
         press that produced it. -->
    <div
      v-if="paged || message"
      :data-field-invalid="message || null"
      class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
    >
      <InputText
        v-if="paged"
        v-model="query"
        size="large"
        class="w-full"
        :placeholder="`Search ${plural}`"
        :aria-label="`Search ${plural}`"
        :disabled="disabled"
      >
        <template #iconLeft>
          <i
            class="pi pi-search"
            aria-hidden="true"
          />
        </template>
      </InputText>

      <HelperText
        v-if="message"
        kind="required"
        >{{ message }}</HelperText
      >
    </div>

    <!-- THE ROWS — a real list of options, so they wear the same SELECTED treatment the DS
         gives an option in a Select / dropdown: the `--bg-selected` fill plus a trailing
         `pi-check` (webkit → inputs/select/select-option). Not this flow's success mark,
         which is the mark for "this step is settled" — a different claim from "this is the
         one you picked". The row stays a toggle BUTTON, so the state it announces is
         `aria-pressed`; `aria-selected` is only meaningful on an `option`/`tab`/`row`, and
         axe rejects it on a button. -->
    <div class="border-t border-(--border-default)">
      <Item.List>
        <Item
          v-for="option in visible"
          :key="option.value"
          as-child
          size="small"
        >
          <button
            type="button"
            class="w-full text-left data-[selected]:bg-(--bg-selected)"
            :disabled="disabled"
            :data-selected="option.value === chosen || null"
            :aria-pressed="option.value === chosen"
            @click="chosen = option.value"
          >
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="icon"
                  class="text-[1rem] leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ option.label }}</Item.Title>
              <Item.Description>{{ option.description }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <i
                v-if="option.value === chosen"
                class="pi pi-check shrink-0 text-(--text-default)"
                aria-hidden="true"
              />
            </Item.Actions>
          </button>
        </Item>

        <!-- THE INCOMING PAGE, WIRED. As many rows as are actually coming, in the geometry
             of the rows above them — the 32px media tile and the two lines — so the list
             GROWS IN PLACE instead of jumping when they land. It sits at the end of the
             rows WITH the footer button still under it: the button spins and stops taking
             presses, so it cannot be double-fired, and the reader keeps the control they
             aimed at. Inside the same Item.List as the real rows, so the wire inherits the
             row rule and the row height instead of approximating them. -->
        <template v-if="loading">
          <Item
            v-for="index in nextBatch"
            :key="`wire-${index}`"
            size="small"
            aria-hidden="true"
          >
            <Item.Media>
              <Skeleton
                kind="shape"
                width="2rem"
                height="2rem"
              />
            </Item.Media>
            <!-- Item.Content stacks flush by design — a real row's two lines space
                 themselves through their line-height, which a fixed-height Skeleton has
                 none of. -->
            <Item.Content class="gap-(--spacing-xs)">
              <Skeleton
                :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]"
                height="0.875rem"
              />
              <Skeleton
                :width="WIRE_SUB_WIDTHS[(index - 1) % WIRE_SUB_WIDTHS.length]"
                height="0.75rem"
              />
            </Item.Content>
          </Item>
        </template>
      </Item.List>

      <!-- THE NEXT PAGE, asked for from the part's FOOTER — below the row rule, never as
           one more row in the list it is paging. The button says how many are coming
           rather than "Load more", so the reader knows whether the list is nearly done or
           barely started. It STAYS while its page is in flight and carries its own busy
           state: removing the control the reader just aimed at is what makes a press feel
           lost, and the wire above already shows what is arriving. -->
      <div
        v-if="remaining"
        class="border-t border-(--border-default) p-(--spacing-xxs)"
      >
        <Button
          type="button"
          :label="`Load ${nextBatch} more`"
          kind="text"
          size="small"
          class="w-full"
          :loading="loading"
          :disabled="disabled"
          @click="loadMore"
        />
      </div>

      <p
        v-if="!matches.length"
        class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
      >
        No {{ noun }} matches “{{ query }}”. Create one instead, or clear the search.
      </p>

      <!-- Announced, not just drawn: pressing Load more changes nothing a screen reader was
           already on, so the count is what reports the press. -->
      <span
        class="sr-only"
        role="status"
        >{{ summary }}</span
      >
    </div>
  </div>
</template>
