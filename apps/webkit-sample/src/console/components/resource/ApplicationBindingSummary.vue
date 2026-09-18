<script setup>
  // WHAT THE GATE ANSWERED, stated on the form behind it.
  //
  // The host question is asked once, as the create's first screen
  // (./ApplicationGate.vue). This band is not that question a second time — it is the
  // answer, kept visible while the reader fills in the rest, because "where does this run"
  // is the fact that decides what Save does. `Change` reopens the gate.
  //
  // NOT BOUND is a state this says out loud, in the resource's own terms
  // (../../lib/data/create-bindings.js carries the sentence): a reader who skipped should
  // meet the consequence here, where they can still undo it, rather than in a list of
  // resources that quietly never ran.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'

  import Section from '../page/Section.vue'

  defineProps({
    /** The resource's entry in the binding registry — its copy and its rule. */
    binding: { type: Object, required: true },
    /** The host being named — `{ noun, icon }` from the host registry. */
    host: { type: Object, required: true },
    /** The host the gate settled on, or `''` when there is none. */
    application: { type: String, default: '' },
    /** The page-wide lock while the commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  defineEmits(['change'])
</script>

<template>
  <Section
    stacked
    :divided="false"
    :title="host.noun.charAt(0).toUpperCase() + host.noun.slice(1)"
    hint="Where this runs. Saving finishes on the Rules Engine that puts it to work."
  >
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item size="small">
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="application ? 'ai ai-edge-application' : 'pi pi-minus-circle'"
                  class="text-[1rem] leading-none"
                  :data-unbound="application ? null : true"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ application || `Not bound to ${host.noun === 'application' ? 'an' : 'a'} ${host.noun}` }}</Item.Title>
              <Item.Description>
                {{
                  application
                    ? 'The rule that puts it to work is written here when you save.'
                    : binding.unboundNote
                }}
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                type="button"
                :label="application ? 'Change' : `Choose ${host.noun}`"
                kind="text"
                size="medium"
                :disabled="disabled"
                @click="$emit('change')"
              />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>
  </Section>
</template>
