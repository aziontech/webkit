<script setup>
  // PART 2 — PROTECT IT. One binding: which firewall stands in front of this workload.
  //
  // ── THE SAME SHAPE THE APPLICATION BINDING HAS ──
  //
  // A firewall is a RESOURCE a release binds, exactly like an application is — and every
  // other place in the console that binds one already says so the same way: a labelled
  // `Select` over existing resources, with the unbound answer as a real option, because
  // the attribute is nullable in the request body. That is how the Application field on
  // part 3 reads, and how Application / Firewall / Custom Page read together in
  // ../../../components/deployment/DeploymentSettingsDrawer.vue and
  // ../../../components/workload/LinkDeploymentSettingsDrawer.vue. A workload binding a
  // firewall is not a different kind of question, so it does not get a different control.
  //
  // ── WHAT THIS REPLACES, AND WHY ──
  //
  // A switch plus a card of pickable rows. Two problems, and the second is the reason:
  //
  //   IT ASKED ONE QUESTION TWICE. The switch answered "protected?" and the list answered
  //     it again by having a selection, so two controls owned one nullable attribute.
  //     "Not protected" inside the Select is that whole answer, in one control.
  //   THE ROWS WERE NOT WEBKIT. The icon tile and the radio disc on each row were markup
  //     built here — a `<span>` drawing a ring and a dot. No such component exists, and a
  //     hand-drawn selection mark is exactly what a design system is for.
  //
  // ON is still what the flow proposes: CreateWorkload.vue seeds the baseline firewall, so
  // serving a workload unprotected costs a decision rather than happening by not deciding.
  //
  // The per-firewall sentence a reader needs to choose is not lost — it is the field's
  // guidance line, and it follows the selection (a `Select` trigger has room for a name
  // only, which is the same reason the Application field carries its guidance under it).
  //
  // WHAT THIS PART DOES NOT DO. It does not create a firewall. The three on offer are
  // existing resources (../../../lib/data/workload-flows.js, the same names
  // deployment-strategies.js binds), and binding one is the decision here; authoring rules
  // is the firewall module's job.
  import CardBox from '@aziontech/webkit/card-box'
  import Select from '@aziontech/webkit/select'
  import { computed } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import { WORKLOAD_FIREWALLS } from '../../../lib/data/workload-flows'
  import { useWorkloadForm } from './form-context'

  defineProps({
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const { form } = useWorkloadForm()

  // Unbound is a CHOICE, not an empty field — `protected: false` is a shape the
  // provisioning run handles, so it is offered as an option with its own consequence
  // spelled out, the way `Not bound` is offered for firewall and custom page on the
  // strategy form.
  const NOT_PROTECTED = {
    value: '',
    label: 'Not protected',
    description:
      'Nothing is evaluated at the edge — requests reach the application directly. A firewall can be bound after the workload exists.'
  }

  // Also the trigger's `placeholder`: the DS reads `''` as UNFILLED, so the option's own
  // label would never reach the trigger — the placeholder is where the unbound answer is
  // spelled, exactly as the Custom page field on part 3 spells `Not bound`.
  const FIREWALL_OPTIONS = [NOT_PROTECTED, ...WORKLOAD_FIREWALLS]

  const labelFor = (value) => FIREWALL_OPTIONS.find((option) => option.value === value)?.label ?? ''

  // `protected` and `firewall` are two fields of ONE answer downstream (the release
  // projects both, and the provisioning run reads both), so one control writes both
  // rather than leaving them to agree by luck.
  const firewall = computed({
    get: () => (form.protected ? form.firewall : ''),
    set: (next) => {
      form.protected = Boolean(next)
      form.firewall = next
    }
  })

  // The guidance line under the control IS the difference between these firewalls, so it
  // follows the selection instead of describing the field in general.
  const guidance = computed(
    () => FIREWALL_OPTIONS.find((option) => option.value === firewall.value)?.description ?? ''
  )
</script>

<template>
  <CardBox title="Protect this workload">
    <template #content>
      <FieldStack
        label="Firewall"
        hint="Bound to this workload's release. Firewalls are separate resources — pick one that already exists, or leave the workload unprotected."
        :description="guidance"
      >
        <template #default="{ controlId, describedBy }">
          <Select
            v-model="firewall"
            size="large"
            class="w-full"
            placeholder="Not protected"
            :disabled="disabled"
            :display-value="labelFor"
          >
            <Select.Trigger
              :id="controlId"
              aria-label="Firewall"
              :aria-describedby="describedBy"
            />
            <Select.Content>
              <Select.Option
                v-for="option in FIREWALL_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </template>
      </FieldStack>
    </template>
  </CardBox>
</template>
