<script setup>
  // PART 1 — WHAT THE WORKLOAD SERVES.
  //
  // The first question, because it is the one everything after it depends on. A workload
  // is an address; an address with nothing behind it answers nothing. The domain on part 2
  // points at THIS — so it is not answerable until this is settled. It is also the reason
  // there are only two parts: an application is what makes a workload deployable, and a
  // firewall (which the flow used to ask for in between) is not — that binding happens on
  // the workload's own page.
  //
  // ── IT USED TO BE THE LAST QUESTION, AND A BARE SELECT ──
  //
  // The old flow opened by naming the workload and asked for the application two parts
  // later, from a single `Select` over four fixtures. That had two costs. The reader named
  // an address before knowing whether the thing it serves existed — and if it did not,
  // there was nothing they could do about it here: a Select over existing applications has
  // nowhere to put a new one, so the only way through was to leave the flow, create an
  // application, and come back.
  //
  // Now it is the resource question every other create asks
  // (../../../components/resource/ResourceBinding.vue): one that already exists, or a new
  // one. Both answers finish here.
  //
  // ── AND CREATING ONE ASKS WHAT THE FROM-SCRATCH DOOR ASKS ──
  //
  // The create branch was a name and nothing else, which left it the one way into this
  // console that made an application the reader could not configure on the way in. Saying
  // "new application" got them a bare layer that caches on whatever headers its origin
  // sends and fetches from a connector the deploy implied — and the only way to change
  // either was to finish the workload, go to Build → Applications, and start again.
  //
  // An application created here is the same kind of thing as one created by the
  // application create's from-scratch door: no code behind it yet, just a layer. So it is
  // asked the same two questions, by the same control
  // (../../../components/application/ApplicationLayer.vue) — how it caches, and where it
  // fetches from when the cache misses. Both stay OFF until the reader says otherwise, so
  // the short answer to this part is still a name.
  //
  // The two cards sit BELOW the binding card rather than inside it, and only on the create
  // branch. Each is its own resource, and a card is a boundary — nesting them inside the
  // card that asked which branch to take would say they are part of the question rather
  // than part of the answer.
  //
  // ── THE VERSION IS NOT ASKED ──
  //
  // There used to be a Version select beside the application. It is gone, because there is
  // only ever one right answer at creation time: the latest version that is ready to
  // serve. Pinning an older one is a thing you do to a release that already exists, from
  // the deployment that owns it — offering it here asked the reader to make a rollback
  // decision about a workload that had not been created yet, and the create branch could
  // not honour it at all (a brand-new application has exactly one version, so "v1" was a
  // promise about a build that had not run).
  //
  // So the rule is STATED on the existing branch instead of being a control. That is also
  // what keeps the binding itself one card: a second card titled "Version" over a field
  // labelled "Version" is a heading for a heading, the same thing the Advanced band avoids
  // for its custom-page row (../BindingStep.vue).
  //
  // WHAT THIS PART STILL DOES NOT DO. It does not build, and it does not author RULES.
  // Those are the Application module's own job, and a wizard that grew them would be a
  // second product.
  import { computed } from 'vue'

  import ApplicationLayer from '../../../components/application/ApplicationLayer.vue'
  import ResourceBinding from '../../../components/resource/ResourceBinding.vue'
  import { clearScratchErrors } from '../../../lib/data/application-scratch'
  import { resourceBindingIsExisting } from '../../../lib/data/resource-binding'
  import { WORKLOAD_APPLICATIONS } from '../../../lib/data/workload-flows'
  import { useWorkloadForm } from './form-context'

  defineProps({
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const { form, errors } = useWorkloadForm()

  // Read through the shared derivation rather than compared to the string here: which
  // branch the reader is on decides what this part asks, what the flow checks, and what
  // the commit provisions, and those three must not disagree.
  const creating = computed(() => !resourceBindingIsExisting(form.application))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <ResourceBinding
      v-model="form.application"
      title="Application"
      hint="What this workload serves. Bindings are per environment, so one workload can serve different applications on Production and Stage."
      :options="WORKLOAD_APPLICATIONS"
      icon="ai ai-edge-application"
      noun="application"
      existing-hint="The latest ready version of the selected application is what the release serves. Pin an older one from the deployment once the workload exists."
      create-hint="Created with the workload and built before the release is cut. Every resource made alongside it takes this name too."
      :message="errors.application"
      :disabled="disabled"
    />

    <!-- WHAT THE NEW APPLICATION IS CREATED WITH — the from-scratch door's own two
         questions, and only on the branch that creates one. Nothing here is required: none
         on is none created, and the application then caches on the headers its origin
         sends and fetches through the connector the deploy provisions for it. -->
    <ApplicationLayer
      v-if="creating"
      v-model="form.application.scratch"
      :errors="errors"
      :disabled="disabled"
      @clear="clearScratchErrors(errors, $event)"
    />
  </div>
</template>
