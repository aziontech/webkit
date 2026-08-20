<script setup>
  // The right-hand side of a deployment card's HEADER — the one region whose whole
  // content is decided by the state of the run:
  //
  //   running  →  the live status ("Building…"), and no control at all
  //   settled  →  the Phased/Complete switch
  //
  // Why it is a component and not markup in each card: two surfaces render this
  // header (the deployment page and the deploy flow card), and the rule above is the
  // thing that must not drift between them. The controls cannot live inside
  // ui/DeploymentLogs.vue — the design puts them in the row that names the card,
  // which the HOST renders — so the host passes them down here and drives the view
  // with `v-model:view` (see DeploymentLogs' `controls` prop).
  //
  // Nothing is offered mid-run on purpose: a view switch would hand someone who is
  // waiting a log that scrolls out from under them, so it comes back with the
  // outcome.
  //
  // There is no copy control here. Copying is the LOG's own affordance and it
  // already ships with the log: LogView pins a copy button over the lines, so the
  // Complete view copies the whole stream and each step in the Phased view copies
  // its own output. A third one up here copied the same text a second time, from the
  // row that names the card rather than from the log it belongs to.
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'

  import { LOG_VIEWS } from './deployment-steps.js'

  defineProps({
    // Whether the run FINISHED — Ready or Error, the two states that leave a log worth
    // switching views on. It comes from the HOST rather than from
    // DeploymentLogs because the host is what knows the record: a deployment page
    // reads it off the deployment, and the flow card off the run it is streaming.
    //
    // "Not settled" is not the same as "running": a Queued or a Draft deployment has
    // not started, so it gets the status and no control either — there is no output
    // to view two ways.
    settled: { type: Boolean, default: false },
    // The console's status word for the state it is in. StatusIndicator adds the
    // ellipsis when loading, so this is "Building", not "Building…".
    statusLabel: { type: String, default: 'Building' },
    // The status dot's severity, ignored while `loading` (a spinner has no severity).
    severity: { type: String, default: 'info' },
    // Whether that status is still MOVING — a spinner rather than a dot. True for a
    // deployment in flight; false for one that is queued or parked as a draft.
    loading: { type: Boolean, default: true }
  })

  const view = defineModel('view', { type: String, default: 'phased' })
</script>

<template>
  <StatusIndicator
    v-if="!settled"
    :loading="loading"
    :severity="severity"
    :label="statusLabel"
  />

  <SegmentedButton
    v-else
    v-model="view"
    :options="LOG_VIEWS"
    class="shrink-0"
    aria-label="Log view"
  />
</template>
