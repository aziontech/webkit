<script setup>
  // The right-hand side of a deployment card's HEADER — the one region whose whole
  // content is decided by the state of the run:
  //
  //   running  →  the live status ("Building…"), and no control at all
  //   settled  →  the Phased/Complete switch + copy all logs
  //
  // Why it is a component and not markup in each card: two surfaces render this
  // header (the deployment page and the deploy flow card), and the rule above is the
  // thing that must not drift between them. The controls cannot live inside
  // ui/DeploymentLogs.vue — the design puts them in the row that names the card,
  // which the HOST renders — so the host passes them down here and drives the view
  // with `v-model:view` (see DeploymentLogs' `controls` prop).
  //
  // Nothing is offered mid-run on purpose. A view switch would hand someone who is
  // waiting a log that scrolls out from under them, and a copy control would hand
  // them a fragment of a pipeline that has not finished — which reads, pasted into a
  // support thread, as the whole story. Both come back with the outcome.
  import CopyButton from '@aziontech/webkit/copy-button'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'

  import { LOG_VIEWS } from './deployment-steps.js'

  defineProps({
    // Whether the run FINISHED — Ready or Error, the two states that leave a log worth
    // switching views on and copying. It comes from the HOST rather than from
    // DeploymentLogs because the host is what knows the record: a deployment page
    // reads it off the deployment, and the flow card off the run it is streaming.
    //
    // "Not settled" is not the same as "running": a Queued or a Draft deployment has
    // not started, so it gets the status and no controls either — there is no output
    // to view two ways or to paste into a thread.
    settled: { type: Boolean, default: false },
    // The console's status word for the state it is in. StatusIndicator adds the
    // ellipsis when loading, so this is "Building", not "Building…".
    statusLabel: { type: String, default: 'Building' },
    // The status dot's severity, ignored while `loading` (a spinner has no severity).
    severity: { type: String, default: 'info' },
    // Whether that status is still MOVING — a spinner rather than a dot. True for a
    // deployment in flight; false for one that is queued or parked as a draft.
    loading: { type: Boolean, default: true },
    // The payload for the copy control — DeploymentLogs' exposed `logsText`, which
    // is every REVEALED line grouped under its step title.
    logsText: { type: String, default: '' }
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

  <div
    v-else
    class="flex shrink-0 items-center gap-(--spacing-sm)"
  >
    <SegmentedButton
      v-model="view"
      :options="LOG_VIEWS"
      aria-label="Log view"
    />
    <!-- The logs are the evidence of a failure, so copying them matters more after a
         broken deploy than after a clean one — but the control reads the same in
         both, and disabled when there is genuinely nothing to hand over. -->
    <CopyButton
      :value="logsText"
      kind="outlined"
      size="medium"
      aria-label="Copy all logs"
      copied-label="Logs copied"
      :disabled="!logsText"
    />
  </div>
</template>
