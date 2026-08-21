<script setup>
  // PART 2 — PROTECT IT. One question, asked the way every create in this console asks it:
  // is there a firewall in front of this workload, and if so — one that already exists, or
  // a new one?
  //
  // ── THE SHAPE IS SHARED, NOT RE-INVENTED HERE ──
  //
  // The control is ../../../components/firewall/FirewallBinding.vue, the same one the
  // application create's Configure part carries, which is itself the shape the repository
  // part uses for the same three-part question about a Git repository (a switch, then a
  // SegmentedButton over "use an existing one" / "create one"). A firewall is a resource,
  // and a create involving a resource asks one question about it — so there is one control
  // for it, and a reader who has met it once has met it everywhere.
  //
  // ── WHAT THIS REPLACES, AND WHY ──
  //
  // A single `Select` whose first option was "Not protected". It answered "is there a
  // firewall" and "which one" in one control, which reads well until the answer is CREATE
  // ONE: a Select over existing resources has nowhere to put a new firewall's name or the
  // modules it starts with, so the only way to get protection here was to have prepared it
  // somewhere else first. The switch now owns the yes/no, and the branch owns the how.
  //
  // ── OFF BY DEFAULT ──
  //
  // It used to arrive ON with the first firewall pre-selected, on the argument that a
  // workload is the public entry point and the protected shape is the one to propose. What
  // that actually did was bind a firewall the reader never chose — the pre-selection was an
  // answer, not a proposal. Protection is now a decision made rather than a default
  // absorbed, and both ways of making it are one click away.
  //
  // WHAT THIS PART DOES NOT DO. It does not author RULES. Creating a firewall here decides
  // its name and its modules — what the create endpoint takes; rules are the Firewall
  // module's own job.
  import FirewallBinding from '../../../components/firewall/FirewallBinding.vue'
  import { WORKLOAD_FIREWALLS } from '../../../lib/data/workload-flows'
  import { useWorkloadForm } from './form-context'

  defineProps({
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const { form, errors } = useWorkloadForm()

  // The firewalls a RELEASE can bind — the same three ../../../lib/data/deployment-strategies.js
  // offers, because part 3 composes a release out of this answer and a strategy authored
  // there must name the same firewall. That invariant is why the list is this one and not
  // the Firewall module's own catalog.
  const EXISTING_FIREWALLS = WORKLOAD_FIREWALLS
</script>

<template>
  <FirewallBinding
    v-model="form.protection"
    :options="EXISTING_FIREWALLS"
    :default-name="form.name"
    description="Stands in front of this workload's domain and filters requests before they reach the application. Off by default. Turn it on to bind an existing firewall, or create one with the workload."
    :message="errors.firewall"
    :disabled="disabled"
  />
</template>
