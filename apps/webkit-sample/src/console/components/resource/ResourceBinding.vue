<script setup>
  // THE RESOURCE QUESTION, WHOLE — one that already exists, or a new one?
  //
  // ── ONE GRAMMAR FOR EVERY RESOURCE A CREATE INVOLVES ──
  //
  // A create that needs another resource asks exactly one question about it, and this is
  // the shape of that question everywhere in this console: a SegmentedButton over the two
  // answers, then the branch. ../../pages/applications/wizard/RepositoryStep.vue asks it
  // about a Git repository; ../firewall/FirewallBinding.vue asks it about a firewall with a
  // switch in front for the optional case. This is the plain one — a REQUIRED resource,
  // where "neither" is not an answer.
  //
  // The existing half is ./ResourcePicker.vue, shared with the firewall card. The new half
  // is a name field plus whatever the caller puts in the `new` slot, because that is the
  // only part of the question that differs per resource.
  //
  // ── WHY THE ANSWER IS ONE OBJECT ──
  //
  // Same reason the firewall's is (../../lib/data/firewalls.js →
  // `defaultFirewallProtection`): the answer is a pair — WHICH BRANCH, and the branch's own
  // value — and a flow that held them as two form keys would have to keep them agreeing by
  // hand. One `v-model` over `{ mode, existing, name }`, and each branch writes its own
  // key, so switching between them does not discard the other's answer. A reader who typed
  // a name, looked at the existing list and came back finds their name still there.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, ref, watch } from 'vue'

  import FieldStack from '../form/FieldStack.vue'
  import ResourcePicker from './ResourcePicker.vue'

  const props = defineProps({
    // The card's own title — the resource's name, singular and capitalized.
    title: { type: String, default: 'Resource' },
    // The sentence under the title: what this resource IS to the thing being created.
    hint: { type: String, default: '' },
    // The resources on offer: `{ value, label, description }`.
    options: { type: Array, default: () => [] },
    // The glyph on each picker row.
    icon: { type: String, default: 'pi pi-box' },
    // Lowercase singular, for the two branch labels and the picker's own copy.
    noun: { type: String, default: 'resource' },
    // The plural, when it is not the singular plus an "s".
    nounPlural: { type: String, default: '' },
    // What the create branch's name field explains about the resource it will make.
    createHint: { type: String, default: '' },
    // …and what the EXISTING branch says about the one it will reuse. Which version gets
    // bound, mostly — the answer a reader would otherwise go looking for a control for.
    existingHint: { type: String, default: '' },
    // Seeds the new resource's name, so the common case is already answered.
    defaultName: { type: String, default: '' },
    // The message from the flow's own validation, shown on the branch that produced it.
    message: { type: String, default: '' },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  // ONE object for the whole answer: `{ mode, existing, name }`.
  const binding = defineModel({ type: Object, required: true })

  const picker = ref(null)

  const modes = computed(() => [
    { label: `Existing ${props.noun}`, value: 'existing' },
    { label: `New ${props.noun}`, value: 'new' }
  ])

  const mode = computed({
    get: () => binding.value.mode ?? 'existing',
    set: (next) => {
      binding.value = { ...binding.value, mode: next }
    }
  })

  const existing = computed({
    get: () => binding.value.existing ?? '',
    set: (next) => {
      binding.value = { ...binding.value, existing: next }
    }
  })

  const name = computed({
    get: () => binding.value.name ?? '',
    set: (next) => {
      binding.value = { ...binding.value, name: next }
    }
  })

  // The name is seeded on the way IN to the create branch, not watched into place: a seed
  // that keeps firing would rename a resource the reader had already named themselves.
  // Empty is the only condition — their own text is never overwritten.
  watch(
    mode,
    (which) => {
      if (which === 'new' && !name.value && props.defaultName) name.value = props.defaultName
    },
    { immediate: true }
  )

  // Crossing to the create branch abandons any page in flight: it would otherwise land
  // behind a branch nobody is looking at and be waiting there on return.
  watch(mode, () => picker.value?.cancelLoad())

  // An account with none of these has one honest answer, so the question does not get
  // asked: the segmented control would offer a branch with nothing in it.
  const canBindExisting = computed(() => props.options.length > 0)
  watch(
    canBindExisting,
    (can) => {
      if (!can && mode.value === 'existing') mode.value = 'new'
    },
    { immediate: true }
  )
</script>

<template>
  <!-- `padded="false"`, with the inset moved onto the groups inside, so the rule above the
       picker rows spans the card edge to edge. A rule drawn inside the card's own padding
       stops short of both edges and reads as a field's underline rather than as the card's
       own division — the same call every other part of this flow makes. -->
  <CardBox
    :padded="false"
    :title="title"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
        <!-- WHAT THIS RESOURCE IS TO THE THING BEING CREATED. CardBox titles a card but
             carries no sub-line, so the sentence is prose at the head of the content —
             above the question, because it is what makes the question answerable. -->
        <p
          v-if="hint"
          class="text-body-sm text-(--text-muted)"
        >
          {{ hint }}
        </p>
        <!-- WHICH OF THE TWO. A segmented control and not two cards: it is one question
             with two answers, and the answer decides what the rest of this card is.
             `fluid` and not `class="w-full"` — the class stretches only the root, leaving
             both answers hugging their labels at its left edge. -->
        <SegmentedButton
          v-if="canBindExisting"
          v-model="mode"
          :options="modes"
          size="large"
          fluid
          :aria-label="`Where the ${noun} comes from`"
        />

        <!-- WHAT REUSING ONE MEANS. The counterpart of the create branch's name-field
             hint, and the reason there is no version control beside the list: the answer
             is always the latest ready one, so it is stated instead of asked. -->
        <p
          v-if="mode === 'existing' && existingHint"
          class="text-body-sm text-(--text-muted)"
        >
          {{ existingHint }}
        </p>

        <!-- CREATE — the one thing the create endpoint always takes. Anything else this
             resource needs at creation time goes in the `new` slot, below the rule, on the
             card's own edges like every other row list in this flow. -->
        <FieldStack
          v-if="mode === 'new'"
          label="Name"
          required
          :hint="createHint"
          description="Lowercase letters, numbers, and hyphens."
          :message="message"
          message-kind="required"
          class="pb-(--spacing-md)"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="name"
              size="large"
              class="w-full"
              :placeholder="`my-${noun}`"
              autocomplete="off"
              :disabled="disabled"
              :required="!!message"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </div>

      <!-- EXISTING — the shared list. It brings its own search, paging and selected mark,
           so the two resources this flow binds are picked the same way. -->
      <ResourcePicker
        v-if="mode === 'existing'"
        ref="picker"
        v-model="existing"
        :options="options"
        :icon="icon"
        :noun="noun"
        :noun-plural="nounPlural"
        :message="message"
        :disabled="disabled"
        class="pt-(--spacing-md)"
      />

      <!-- WHAT ELSE THIS RESOURCE IS CREATED WITH. The firewall's modules, an
           application's build preset — the fields that exist only on the create branch and
           only for this resource. -->
      <slot
        v-if="mode === 'new'"
        name="new"
      />
    </template>
  </CardBox>
</template>
