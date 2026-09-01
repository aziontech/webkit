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
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import { FIREWALL_MODULE_FIELDS } from '../../lib/data/firewalls'
  import FieldStack from '../form/FieldStack.vue'
  import ResourcePicker from '../resource/ResourcePicker.vue'

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

  const chosen = computed({
    get: () => protection.value.firewall ?? '',
    set: (next) => {
      protection.value = { ...protection.value, firewall: next }
    }
  })

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

  // --- THE EXISTING LIST IS SHARED -----------------------------------------
  // The rows, their search, their paging and their selected mark are
  // ../resource/ResourcePicker.vue — the same list the workload create's application card
  // shows. It used to be typed out here, which was fine while the firewall was the only
  // resource a create could bind and became a duplicate the moment it was not.
  const picker = ref(null)

  // Turning protection off, or crossing to the create branch, abandons the page in flight:
  // it would otherwise land behind a closed disclosure and be waiting there on return.
  watch([enabled, mode], () => picker.value?.cancelLoad())

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
            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
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
                class="pb-(--spacing-md)"
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
            </div>

            <!-- EXISTING — the shared list (../resource/ResourcePicker.vue). It brings its
                 own search, paging, skeleton wire and selected mark, so a firewall here
                 and an application in the workload create are picked identically. -->
            <ResourcePicker
              v-if="mode === 'existing'"
              ref="picker"
              v-model="chosen"
              class="pt-(--spacing-md)"
              :options="options"
              icon="ai ai-edge-firewall"
              noun="firewall"
              :message="message"
              :disabled="disabled"
            />

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
