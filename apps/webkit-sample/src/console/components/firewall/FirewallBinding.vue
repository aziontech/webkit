<script setup>
  // THE PROTECTION QUESTION, wherever a create asks it — one card, one shape.
  //
  // ── WHY THIS IS THE GIT-REPOSITORY SHAPE ──
  //
  // A firewall is a RESOURCE, exactly like the repository a template is cloned into is,
  // and a create that involves one asks the identical three-part question: is there one,
  // and if so — one that already exists, or a new one? That is what
  // ../../pages/applications/wizard/RepositoryStep.vue answers with a SegmentedButton over
  // two branches, so this asks it the same way. A reader who has met one of the two has
  // met both.
  //
  // OFF BY DEFAULT, and that is the whole point of the switch being here. The card used to
  // pre-answer YES and create a firewall alongside the application, which meant the flow
  // spent a resource for a reader who never looked at the row. Protection is now a
  // decision made, not a default absorbed — and because the two ways of getting one are
  // both offered, saying yes no longer means paying for a second firewall beside the one
  // the account already has.
  //
  // ── WHAT LIVES WHERE ──
  //
  // The answer is ONE object (`defaultFirewallProtection()` in
  // ../../lib/data/firewalls.js) and travels on a single `v-model`, so each flow's form
  // holds one key and every consumer of the answer — a summary line, a provisioning log, a
  // created-resource row — reads it through the same two derivations
  // (`firewallBindingName`, `firewallIsBound`) rather than re-deriving it locally.
  //
  // The EXISTING firewalls are a prop, not an import: the application create offers the
  // account's real firewalls (the Secure → Firewall list) while the workload create offers
  // the three its release strategies bind (lib/data/workload-flows.js). Which set is on
  // offer is a fact about the flow, not about this control.
  //
  // WHAT IT DOES NOT DO. It does not author RULES. Creating a firewall here decides its
  // name and which modules it starts with — the same two things the create endpoint takes.
  // Rules are the Firewall module's own job, and pretending otherwise inside a wizard is
  // how a create grows into a second product.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { FIREWALL_MODULE_FIELDS } from '../../lib/data/firewalls'
  import FieldStack from '../form/FieldStack.vue'

  const props = defineProps({
    // The existing firewalls on offer: `{ value, label, description }`. Empty is a real
    // state — an account with none gets the create branch and is told why.
    options: { type: Array, default: () => [] },
    // Seeds the new firewall's name, so the common case is already answered. The flows
    // pass the thing being created, which is what the reader would have typed.
    defaultName: { type: String, default: '' },
    // The sentence under the switch. Each flow protects a different thing — an
    // application's code, a workload's domain — and the row is where that is said.
    description: {
      type: String,
      default: 'Filters requests before they reach your code.'
    },
    // The message from the flow's own validation, shown on the branch that produced it.
    message: { type: String, default: '' },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  // ONE object for the whole answer — see ../../lib/data/firewalls.js.
  const protection = defineModel({ type: Object, required: true })

  const MODES = [
    { label: 'Existing firewall', value: 'existing' },
    { label: 'New firewall', value: 'new' }
  ]

  // Each branch writes its own key of the one object, so switching between them does not
  // discard the other's answer — a reader who typed a name, looked at the existing list
  // and came back finds their name still there.
  const enabled = computed({
    get: () => Boolean(protection.value.enabled),
    set: (next) => {
      protection.value = { ...protection.value, enabled: next }
    }
  })

  const mode = computed({
    get: () => protection.value.mode ?? 'existing',
    set: (next) => {
      protection.value = { ...protection.value, mode: next }
    }
  })

  const name = computed({
    get: () => protection.value.name ?? '',
    set: (next) => {
      protection.value = { ...protection.value, name: next }
    }
  })

  const chosen = computed(() => protection.value.firewall ?? '')
  const choose = (value) => {
    protection.value = { ...protection.value, firewall: value }
  }

  const setModule = (key, value) => {
    protection.value = {
      ...protection.value,
      modules: { ...protection.value.modules, [key]: value }
    }
  }

  // The name is seeded on the way IN to the create branch, not watched into place: a seed
  // that keeps firing would rename a firewall the reader had already named themselves.
  // Empty is the only condition — their own text is never overwritten.
  watch(
    [enabled, mode],
    ([isEnabled, which]) => {
      if (isEnabled && which === 'new' && !name.value && props.defaultName) {
        name.value = `${props.defaultName}-firewall`
      }
    },
    { immediate: true }
  )

  // --- A FEW ROWS, THEN SEARCH ---------------------------------------------
  // An account can hold dozens of firewalls, and this is a create form, not the Firewall
  // module: the card cannot become the list. So it shows the FIRST FIVE — the most
  // recently touched, which is the order `existingFirewallOptions()` sorts in — and lets
  // the reader either narrow to what they want or ask for more.
  //
  // Both affordances only exist when there is more than one page. The workload flow offers
  // three firewalls; a search field over three rows is furniture, and a Load-more button
  // with nothing to load is a lie.
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

  // Deterministic widths, so the wire reads as a column of firewall names rather than five
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

  // Narrowing produces a different list, so it gets a fresh first page — keeping the old
  // offset would dump every match at once for a query that matches few.
  watch(query, () => {
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  // Turning protection off, or crossing to the create branch, abandons the page in flight:
  // it would otherwise land behind a closed disclosure and be waiting there on return.
  watch([enabled, mode], () => cancelLoad())

  // A reader who comes BACK to this part must see their answer, and an answer sitting on
  // page three would be invisible — the list would look untouched and they would pick a
  // second firewall. So the window opens wide enough to contain it.
  const chosenIndex = props.options.findIndex(
    (option) => option.value === protection.value.firewall
  )
  if (chosenIndex >= PAGE_SIZE) {
    shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE
  }

  // Spoken, not just drawn: pressing Load more replaces nothing on screen that a screen
  // reader is looking at, so the count is what tells it the press did something.
  const summary = computed(() => {
    if (loading.value) return `Loading ${nextBatch.value} more firewalls`
    const total = props.options.length
    if (query.value.trim() && !matches.value.length) return `No firewall matches ${query.value}`
    if (remaining.value) return `${visible.value.length} of ${matches.value.length} firewalls`
    return query.value.trim()
      ? `${matches.value.length} of ${total} firewalls`
      : `${total} firewalls`
  })

  // The next page is ASKED FOR, and asking takes time. The wire that stands in for the
  // incoming rows is what makes the press feel answered — without it the button is dead
  // for 420ms and a reader presses it twice.
  let loadTimeoutId = null

  const cancelLoad = () => {
    if (loadTimeoutId) clearTimeout(loadTimeoutId)
    loadTimeoutId = null
    loading.value = false
  }

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

  // An account with no firewalls has one honest answer, so the question does not get asked:
  // the segmented control would offer a branch with nothing in it.
  const canBindExisting = computed(() => props.options.length > 0)
  watch(canBindExisting, (can) => {
    if (!can && mode.value === 'existing') mode.value = 'new'
  })
</script>

<template>
  <!-- ONE card for the whole question: the switch that asks it, and the configuration that
       exists only once the answer is yes. A card is a boundary, and there is no boundary
       between "is there a firewall" and "which one" — so a single full-bleed rule inside
       one box separates them. -->
  <CardBox :padded="false">
    <template #content>
      <!-- NO group heading on this row: "Protection" over a single switch would be a
           heading for a heading, and the row already says what it does in its own words. -->
      <Item.List>
        <Item size="small">
          <Item.Content>
            <Item.Title>Protect with Azion Firewall</Item.Title>
            <Item.Description>{{ description }}</Item.Description>
          </Item.Content>
          <Item.Actions class="justify-end">
            <Switch
              v-model="enabled"
              aria-label="Protect with Azion Firewall"
              :disabled="disabled"
            />
          </Item.Actions>
        </Item>
      </Item.List>

      <!-- WHAT SAYING YES ASKS. The grid-rows disclosure ../page/Section.vue uses, so the
           card grows into its new height instead of jumping to it. The rule rides INSIDE
           the clip, so a closed disclosure reserves nothing and the card is exactly one row
           tall. `inert` while closed keeps the hidden controls out of the tab order. -->
      <div
        :data-open="enabled || null"
        class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div
          class="min-w-0 overflow-hidden"
          :inert="!enabled"
        >
          <div class="border-t border-(--border-default)">
            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
              <!-- WHICH OF THE TWO. A segmented control and not two cards: it is one
                   question with two answers, and the answer decides what the rest of this
                   card is. `fluid` and not `class="w-full"` — the class stretches only the
                   root, leaving both answers hugging their labels at its left edge. -->
              <SegmentedButton
                v-if="canBindExisting"
                v-model="mode"
                :options="MODES"
                size="large"
                fluid
                aria-label="Where the firewall comes from"
              />

              <!-- CREATE — the two things the create endpoint takes: what it is called,
                   and which modules it starts with. The modules are below, outside this
                   padded column, so they sit on the card's own edges like every other row
                   list in this flow. -->
              <FieldStack
                v-if="mode === 'new'"
                label="Firewall name"
                required
                hint="Created alongside the resource this flow provisions. It appears in Secure → Firewall, where its rules are authored."
                description="Lowercase letters, numbers, and hyphens."
                :message="message"
                message-kind="required"
              >
                <template #default="{ controlId, describedBy }">
                  <InputText
                    :id="controlId"
                    v-model="name"
                    size="large"
                    class="w-full"
                    placeholder="my-firewall"
                    :disabled="disabled"
                    :required="!!message"
                    :aria-describedby="describedBy"
                  />
                </template>
              </FieldStack>

              <!-- EXISTING — the search, and the message. The list is not a field, so it
                   has no FieldStack to carry either, and both ride ABOVE the rows: a
                   failed advance has to land the reader somewhere they can act (see
                   ../../lib/behavior/reveal-invalid.js), and the caret goes into the
                   search, which is how the rows below get narrowed to the one they meant.
                   A message at the foot of the rows would land off-screen on the very
                   press that produced it. -->
              <div
                v-else-if="paged || message"
                :data-field-invalid="message || null"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <InputText
                  v-if="paged"
                  v-model="query"
                  size="large"
                  class="w-full"
                  placeholder="Search firewalls"
                  aria-label="Search firewalls"
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
            </div>

            <!-- EXISTING, the rows — a real list of options, so it wears the same
                 SELECTED treatment the DS gives an option in a Select / dropdown: the
                 `--bg-selected` fill plus a trailing `pi-check`
                 (webkit → inputs/select/select-option). It used to wear this flow's
                 success mark, which is the mark for "this step is settled" — a different
                 claim from "this is the one you picked", and the reason to reuse the
                 dropdown's is that the reader already reads it as selection everywhere
                 else in the console. The row stays a toggle BUTTON, so the state it
                 announces is `aria-pressed` — `aria-selected` is only meaningful on an
                 `option`/`tab`/`row`, and axe rejects it on a button. -->
            <div
              v-if="mode === 'existing'"
              class="border-t border-(--border-default)"
            >
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
                    @click="choose(option.value)"
                  >
                    <Item.Media>
                      <span
                        class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          class="ai ai-edge-firewall text-[1rem] leading-none text-(--text-default)"
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

                <!-- THE INCOMING PAGE, WIRED. As many rows as are actually coming, in the
                     geometry of the rows above them — the 32px media tile and the two
                     lines — so the list GROWS IN PLACE instead of jumping when they land.
                     It sits at the end of the rows WITH the footer button still under
                     it: the button spins and stops taking presses, so it cannot be
                     double-fired, and the reader keeps the control they aimed at.
                     Inside the same Item.List as the real rows, so the wire inherits the
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
                         themselves through their line-height, which a fixed-height Skeleton
                         has none of. -->
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

              <!-- THE NEXT PAGE, asked for from the part's FOOTER — below the row rule,
                   never as one more row in the list it is paging. The button says how many
                   are coming rather than "Load more", so the reader knows whether the list
                   is nearly done or barely started. It STAYS while its page is in flight
                   and carries its own busy state: removing the control the reader just
                   aimed at is what makes a press feel lost, and the wire above already
                   shows what is arriving. -->
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
                No firewall matches “{{ query }}”. Create one instead, or clear the search.
              </p>

              <!-- Announced, not just drawn: pressing Load more changes nothing a screen
                   reader was already on, so the count is what reports the press. -->
              <span
                class="sr-only"
                role="status"
                >{{ summary }}</span
              >
            </div>

            <!-- CREATE, the modules. The firewall is created here, so the modules it is
                 created WITH are decided here too — provisioning one whose configuration
                 the reader first meets on another page is how a create surprises somebody.
                 The rows are the same catalog the Firewall module's own list reads
                 (../../lib/data/firewalls.js), so a module's name and meaning exist once. -->
            <div
              v-else
              class="border-t border-(--border-default)"
            >
              <h3
                class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
              >
                Firewall modules
              </h3>
              <Item.List>
                <Item
                  v-for="mod in FIREWALL_MODULE_FIELDS"
                  :key="mod.key"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ mod.title }}</Item.Title>
                    <Item.Description>{{ mod.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <!-- DDoS Protection is not a switch anywhere on the platform, so it
                         states why instead of pretending to be one. -->
                    <Tooltip
                      v-if="mod.locked"
                      text="DDoS Protection is always on."
                    >
                      <Switch
                        :model-value="true"
                        disabled
                        :aria-label="mod.title"
                      />
                    </Tooltip>
                    <Switch
                      v-else
                      :model-value="protection.modules?.[mod.key] ?? false"
                      :aria-label="mod.title"
                      :disabled="disabled"
                      @update:model-value="setModule(mod.key, $event)"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CardBox>
</template>
