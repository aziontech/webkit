<script setup>
  // THE FROM-SCRATCH PART — name it, say how it caches, say where it fetches from.
  //
  // The other two doors reach ../wizard/ConfigureStep.vue, which asks what a project WITH
  // code needs: the build pair, whatever the template declared, the modules behind the
  // Advanced band. From scratch has no code, so none of that has anything to act on — a
  // build command for a bundle that does not exist is a field that can only be answered
  // wrong. What it has instead is the application LAYER, and a layer is two OPTIONAL
  // decisions: how it caches, and where it goes when the cache misses.
  //
  // So three cards, one question each, in the order they can be answered:
  //
  //   NAME            typed. The endpoint's one requirement, and the only one.
  //   CACHE SETTINGS  a LIST of templates, one SWITCH each, and what an on row still asks.
  //   CONNECTOR       a SWITCH — then a TYPE, then whatever that type still needs.
  //
  // ── THE LAST TWO ARE NOT THIS PART'S ANY MORE ──
  //
  // They are ../../../components/application/ApplicationLayer.vue, which owns both cards,
  // why each is a switch, and why the two are not the same shape. They moved out when the
  // workload create's first part started making applications too
  // (../../workloads/wizard/ApplicationStep.vue → the New application branch): an
  // application created there is the same kind of thing as one created here, so it is
  // asked the same two questions rather than a second, drifting pair of them.
  //
  // What stayed is the NAME — because it is not the same field in both flows. Here it is a
  // card of its own, the first thing the part asks; there it is the create branch's own
  // name field, inside the card that asked which branch to take.
  //
  // The form object is the wizard's and reaches this part through injected context
  // (./form-context.js), same as the other configure part. The messages are the wizard's
  // too: its check fills them on its own press and this part hands back which of them an
  // edit invalidated (`clearScratchErrors`), so the card that renders the fields never
  // writes into a map it does not own.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'

  import ApplicationLayer from '../../../components/application/ApplicationLayer.vue'
  import FieldStack from '../../../components/form/FieldStack.vue'
  import { clearScratchErrors } from '../../../lib/data/application-scratch'
  import { useCreateForm } from './form-context'

  defineProps({
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const { form, errors } = useCreateForm()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <!-- 1. THE APPLICATION. One field, because from scratch has exactly one thing to say
         about the application itself — everything else the endpoint takes carries its own
         default and is not a decision this door asks the reader to make. -->
    <CardBox title="Name your application">
      <template #content>
        <FieldStack
          label="Name"
          required
          hint="Names the application, and every resource created alongside it. The connector and the Cache Settings both take it."
          description="Lowercase letters, numbers, and hyphens."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="my-application"
              :disabled="disabled"
              :required="!!errors.name"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </template>
    </CardBox>

    <!-- 2 AND 3. THE LAYER — how it caches, and where it fetches from. Both optional, both
         separate resources this create provisions alongside the application, and both
         shared with the workload create's New application branch. -->
    <ApplicationLayer
      v-model="form.scratch"
      :errors="errors"
      :disabled="disabled"
      @clear="clearScratchErrors(errors, $event)"
    />
  </div>
</template>
