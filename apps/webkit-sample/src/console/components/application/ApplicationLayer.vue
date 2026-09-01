<script setup>
  // THE APPLICATION LAYER — how it caches, and where it fetches from when it misses.
  //
  // Two cards, one question each, and BOTH ARE OPTIONAL:
  //
  //   CACHE SETTINGS  a LIST of templates, one SWITCH each, and what an on row still asks.
  //   CONNECTOR       a SWITCH — then a TYPE, then whatever that type still needs.
  //
  // Neither is part of the application. A Cache Settings and a connector are separate
  // RESOURCES the create provisions alongside it, and an application with neither is a
  // legitimate thing to make. So nothing is on until the reader says so: a create that
  // arrives with them switched on spends resources on behalf of somebody who never read
  // the rows. That is the mistake the firewall row already fixed
  // (../firewall/FirewallBinding.vue).
  //
  // ── IT IS SHARED, BECAUSE TWO CREATES MAKE AN APPLICATION ──
  //
  // These cards were written inside the application create's from-scratch part
  // (../../pages/applications/wizard/ScratchStep.vue) and lived there alone while that was
  // the only door that made an application with no code behind it. The workload create's
  // first part now makes one too (../../pages/workloads/wizard/ApplicationStep.vue → the
  // New application branch), and what it makes is the same kind of thing — so the cards
  // moved out rather than being typed a second time. Two creates offering two different
  // lists of cache templates, or a connector on one and not the other, is exactly the
  // drift a shared control exists to prevent.
  //
  // ── AND WHY THE TWO CARDS ARE NOT THE SAME SHAPE ──
  //
  // What is being decided differs. A connector is ONE resource with a shape to choose, so
  // the card asks once, on top — the switch, a full-bleed rule, and the shape underneath.
  // Cache Settings are INDEPENDENT of each other: an application can cache its images one
  // way and its static assets another, and both at once. There is no single yes to ask, so
  // the card IS the list — one row per template, a switch on each, and what a policy still
  // needs asked under the row that asked for it. None on is none created; a switch above
  // the list would be a second way to say the same thing.
  //
  // Inside each disclosure is a CONDITIONAL FORM, rendered from the descriptors in
  // ../../lib/data/application-scratch.js rather than from a chain of `v-if`s per option:
  // the option decides what is asked, so the option carries its own field list and this
  // file renders whatever it is handed. Adding a template or a connector type is an entry
  // in that catalog, not a branch here.
  //
  // Two cards and not one: a card is a boundary, and there is a real one between an
  // application's Cache Settings and its connector — each is a separate resource, and
  // either can be declined. One card would say they are one thing that happens to have
  // sections, and put every switch inside a box titled after the first of them.
  //
  // ── WHOSE ANSWERS AND WHOSE MESSAGES ──
  //
  // The answers are the flow's form, arriving as ONE object on a `v-model`
  // (`defaultScratchConfig()`), the way every other shared control in this console takes
  // its answer (../resource/ResourceBinding.vue, ../firewall/FirewallBinding.vue).
  //
  // The MESSAGES are the flow's too, and stay that way. They are filled by its own check
  // on its own press (`validateScratch`) and keyed the way that check keys them, so this
  // card READS the map and reports which of it an edit just invalidated — `clear`, with
  // the prefix — rather than writing into a map it does not own.
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed, useId } from 'vue'

  import {
    CACHE_POLICY_TEMPLATES,
    connectorTypeFields,
    resetScratchOption
  } from '../../lib/data/application-scratch'
  import { connectorTypeOptions } from '../../lib/data/connectors'
  import FieldStack from '../form/FieldStack.vue'

  defineProps({
    // The flow's per-field messages, keyed as `validateScratch` keys them —
    // `cache.<template>.<field>` and `connector.<field>`. Read here, never written.
    errors: { type: Object, default: () => ({}) },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  // ONE object for both answers — `defaultScratchConfig()` in
  // ../../lib/data/application-scratch.js.
  const config = defineModel({ type: Object, required: true })

  // WHICH MESSAGES AN EDIT JUST INVALIDATED, as the prefix they are keyed under. The flow
  // deletes them, because the flow filled them.
  const emit = defineEmits(['clear'])

  const cache = computed(() => config.value.cache)
  const connector = computed(() => config.value.connector)

  // What the chosen type still has to be told.
  const connectorFields = computed(() => connectorTypeFields(connector.value.type))

  // ONE POLICY'S PART OF THE FORM — `{ enabled, values }`, keyed by the template that owns
  // it, and its `errors` prefix. Namespaced by POLICY and not by field alone, because two
  // policies on at once can both declare an `extensions` and one message would then be
  // shown under both.
  const policyOf = (template) => cache.value.policies[template.value]
  const policyPrefix = (template) => `cache.${template.value}`
  const policyKey = (template, field) => `${policyPrefix(template)}.${field.name}`

  // The type chooser is a GROUP, and a `<label for>` can only name a form control — so the
  // visible name and the line under it are tied to the radiogroup by id instead.
  const typeLabelId = useId()
  const typeHelpId = useId()

  // The trigger's own label, so a Select shows the option's words and not its value.
  // `display-value` is a FUNCTION of the value (webkit's select.vue calls it), not the
  // label itself — passing the string renders nothing and throws on the first paint.
  const optionLabel = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  // CHANGING THE TYPE DROPS THE ANSWERS TO THE OLD ONE. A bucket named for the storage
  // connector the reader just abandoned would otherwise ride into an HTTP connector's
  // request, and the message the abandoned field failed on would outlive the field.
  const chooseType = (next) => {
    if (connector.value.type === next) return
    connector.value.type = next
    resetScratchOption(connector.value)
    emit('clear', 'connector.')
  }

  // Editing clears the message the field failed on, so it goes as the reader fixes it
  // rather than surviving until the next press.
  const write = (part, prefix, name, value) => {
    part.values[name] = value
    emit('clear', `${prefix}.${name}`)
  }

  // SWITCHING A PART OFF TAKES ITS MESSAGES WITH IT. The fields go with the disclosure,
  // and a message about a field that is no longer on screen is a failure the reader
  // cannot see, cannot fix, and did not cause. The VALUES stay, so switching back
  // restores what was typed.
  const toggle = (part, prefix, next) => {
    part.enabled = next
    if (!next) emit('clear', `${prefix}.`)
  }
</script>

<template>
  <!-- The two cards keep the create's own band rhythm between them, so this control drops
       into a part's column as one thing and spaces itself the way its siblings do. -->
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <!-- 1. THE CACHE SETTINGS — the list IS the card, one switch per template.
         A Cache Settings is a separate resource this create provisions, not a property of
         the application, and the templates are not variants of one policy: an application
         can cache its images one way and its static assets another, and both at once. So
         they are SWITCHES rather than a one-of select, and there is no switch above them —
         none on is none created, and the application then caches on the headers its origin
         sends.
         A TEMPLATE AND NOT THE FULL BODY: a Cache Settings written field by field is two
         screens of enums (../../lib/data/cache-settings.js is the whole shape), and none of
         it is why anybody opened a create. The templates are that policy already written;
         what is left to ask is the part they cannot guess. The full form is still there, in
         the application's own Cache Settings tab, for the reader who came to write one. -->
    <CardBox
      title="Cache Settings"
      :padded="false"
    >
      <template #content>
        <Item.List>
          <Item
            v-for="template in CACHE_POLICY_TEMPLATES"
            :key="template.value"
            size="small"
            class="flex-col items-stretch gap-0"
          >
            <!-- In an ItemGroup the ROW IS THE LABEL: the Item.Title names the policy and
                 the description says what it does to what it matches, so the switch takes
                 an `aria-label` rather than a `<label for>`. -->
            <div class="flex w-full items-center gap-(--spacing-md)">
              <Item.Content>
                <Item.Title>{{ template.label }}</Item.Title>
                <Item.Description>{{ template.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  :model-value="policyOf(template).enabled"
                  :aria-label="template.label"
                  :disabled="disabled"
                  @update:model-value="toggle(policyOf(template), policyPrefix(template), $event)"
                />
              </Item.Actions>
            </div>

            <!-- WHAT SAYING YES ASKS, UNDER THE ROW THAT ASKED IT. The grid-rows
                 disclosure this console uses everywhere, so the row grows into its height
                 instead of jumping to it. The padding rides INSIDE the clip, so a switched
                 -off row is exactly one row tall and reserves nothing; `inert` keeps the
                 hidden field out of the tab order. A template that carries everything
                 renders no disclosure at all — there is nothing to reveal. -->
            <div
              v-if="template.fields.length"
              :data-open="policyOf(template).enabled || null"
              class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
            >
              <div
                class="min-w-0 overflow-hidden"
                :inert="!policyOf(template).enabled"
              >
                <div class="flex flex-col gap-(--spacing-lg) pt-(--spacing-md)">
                  <FieldStack
                    v-for="field in template.fields"
                    :key="field.name"
                    :label="field.label"
                    :required="!!field.required"
                    :description="field.description"
                    :message="errors[policyKey(template, field)]"
                    message-kind="required"
                  >
                    <template #default="{ controlId, describedBy }">
                      <InputText
                        :id="controlId"
                        :model-value="policyOf(template).values[field.name] ?? ''"
                        size="large"
                        class="w-full"
                        :placeholder="field.placeholder"
                        :disabled="disabled"
                        :required="!!errors[policyKey(template, field)]"
                        :aria-describedby="describedBy"
                        @update:model-value="
                          write(policyOf(template), policyPrefix(template), field.name, $event)
                        "
                      />
                    </template>
                  </FieldStack>
                </div>
              </div>
            </div>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <!-- 2. THE CONNECTOR — the same shape, and the same reason. A connector is its own
         resource, and an application with none still creates fine: it has nothing to
         fetch yet, which is the premise of a create with no code behind it. Off by
         default, and the reader who has an origin now says so.
         Inside, the TYPE leads, because the type is what the address MEANS: an origin
         host, a bucket, an ingest region are three different values, and one "Address"
         field serving all three would be lying about two of them. So the type chooses the
         fields, and each field says what it is in its own words. -->
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item size="small">
            <Item.Content>
              <Item.Title>Add a connector</Item.Title>
              <Item.Description>
                Where the application fetches from when the cache does not already hold the answer.
                Add one now, or bind one later.
              </Item.Description>
            </Item.Content>
            <Item.Actions class="justify-end">
              <Switch
                :model-value="connector.enabled"
                aria-label="Add a connector"
                :disabled="disabled"
                @update:model-value="toggle(connector, 'connector', $event)"
              />
            </Item.Actions>
          </Item>
        </Item.List>

        <div
          :data-open="connector.enabled || null"
          class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
        >
          <div
            class="min-w-0 overflow-hidden"
            :inert="!connector.enabled"
          >
            <div
              class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)"
            >
              <!-- THE TYPE IS A ROW OF BOXES, not a select. Three options whose NAMES do
                   not say what they mean — a reader who has not met Object Storage cannot
                   tell it from an origin by its label — so each one carries its own line,
                   and all three are readable at once instead of two of them living behind
                   a click. No glyphs: the sentence is what separates them, and an icon
                   beside it competes for the same job at a tenth of the resolution.
                   The boxes share the row: each grows from a 256px basis, so three fit one
                   line on the create's measure and wrap rather than shrink below it.
                   The type's description is the switch row's job now — repeating it here
                   would say one sentence twice on one card. What this group owes the
                   reader instead is what the CHOICE costs: it decides what is asked next. -->
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <!-- A `<label for>` can only name a form control, and the group is a
                     radiogroup — so the visible name and the line under it are tied to it
                     by id instead. -->
                <p
                  :id="typeLabelId"
                  class="text-label-sm text-(--text-default)"
                >
                  Type
                </p>
                <BoxGridSelection
                  :model-value="connector.type"
                  :items="connectorTypeOptions"
                  :disabled="disabled"
                  :aria-labelledby="typeLabelId"
                  :aria-describedby="typeHelpId"
                  class="[&>*]:grow [&>*]:basis-(--container-3xs)"
                  @update:model-value="chooseType"
                />
                <HelperText
                  :id="typeHelpId"
                  kind="helper"
                  label="Decides what the connector is addressed by: a host, a bucket, or a region."
                />
              </div>

              <FieldStack
                v-for="field in connectorFields"
                :key="field.name"
                :label="field.label"
                :required="!!field.required"
                :description="field.description"
                :message="errors[`connector.${field.name}`]"
                message-kind="required"
              >
                <template #default="{ controlId, describedBy }">
                  <!-- A one-of field is a Select over the records that exist — the account's
                   own buckets, the regions Azion ingests from — never a text box asking
                   the reader to remember a name the console already knows. -->
                  <Select
                    v-if="field.kind === 'select'"
                    :model-value="connector.values[field.name] ?? ''"
                    size="large"
                    class="w-full"
                    :disabled="disabled"
                    :display-value="optionLabel(field.options)"
                    :required="!!errors[`connector.${field.name}`]"
                    :placeholder="`Select a ${field.label.toLowerCase()}`"
                    @update:model-value="write(connector, 'connector', field.name, $event)"
                  >
                    <Select.Trigger
                      :id="controlId"
                      :aria-label="field.label"
                      :aria-describedby="describedBy"
                    />
                    <Select.Content>
                      <Select.Option
                        v-for="option in field.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>

                  <InputText
                    v-else
                    :id="controlId"
                    :model-value="connector.values[field.name] ?? ''"
                    size="large"
                    class="w-full"
                    :placeholder="field.placeholder"
                    :disabled="disabled"
                    :required="!!errors[`connector.${field.name}`]"
                    :aria-describedby="describedBy"
                    @update:model-value="write(connector, 'connector', field.name, $event)"
                  />
                </template>
              </FieldStack>
            </div>
          </div>
        </div>
      </template>
    </CardBox>
  </div>
</template>
