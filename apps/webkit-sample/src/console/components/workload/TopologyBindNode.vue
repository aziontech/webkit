<script setup>
  // TopologyBindNode — the EMPTY node of the deployment topology: an
  // Application-level resource that CAN be bound to the deployment (Firewall,
  // Custom Page) but is not. Instead of hiding the slot, the chain keeps the
  // position visible as a dashed card carrying the CTA that fills it.
  //
  // It is the same TopologyNode frame as a provisioned node — same width, same
  // disclosure header — so the Application level reads as one column: what is
  // bound, and what is still open. It carries NO name, which is what collapses its
  // header to a single line and, with the dashed border and the "Not bound" status,
  // is what makes a free position legible while closed.
  //
  // THE CTA IS THE ENVIRONMENT PICKER'S DROPDOWN, in its own words
  // (./WorkloadSummary.vue). The answer set is not closed — a slot can be filled
  // with one of the resources that exist, or with one that does not yet — so it is
  // a picker rather than a Select: the resources sit in a LABELLED group, which is
  // what says what the rows in it are, and the create is an ACTION rather than
  // another value, so it sits in its own group under a rule. Binding is the whole
  // interaction and needs no drawer; creating leaves for the resource's own create
  // page, because a firewall and a custom page are first-level resources and that
  // is where the console creates one (../../lib/behavior/surfaces.js).
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import { computed } from 'vue'

  import TopologyNode from './TopologyNode.vue'

  const props = defineProps({
    // Resource kind shown in the header ("Firewall", "Custom Page"). It also names
    // the create row, which is the console's own label for it ("Create Firewall").
    kind: { type: String, required: true },
    // Azion icon class, matching the module's sidebar icon.
    icon: { type: String, default: '' },
    // One line on what NOT binding this resource means for the deployment.
    description: { type: String, default: '' },
    // CTA label ("Bind Firewall").
    ctaLabel: { type: String, required: true },
    // Bindable resources: `{ value, label }`.
    options: { type: Array, default: () => [] }
  })

  const emit = defineEmits(['bind', 'create'])

  // Forwarded straight to TopologyNode so the PAGE decides which nodes start open.
  const open = defineModel('open', { type: Boolean, default: false })

  // The create row's sentinel value — told apart by identity rather than by position,
  // the same way the environment picker tells its own create row apart.
  const CREATE = '__create__'

  // The group label over the rows — what the things in it ARE, in the kind's own plural.
  const listLabel = computed(() => `${props.kind}s`)

  const onSelect = (event, value) => {
    if (value === CREATE) return emit('create', event)
    emit('bind', event, value)
  }
</script>

<template>
  <TopologyNode
    v-model:open="open"
    :kind="kind"
    :icon="icon"
    status="Not bound"
    severity="neutral"
    dashed
  >
    <p class="text-body-xs text-(--text-muted)">{{ description }}</p>

    <Dropdown
      placement="bottom-start"
      @select="onSelect"
    >
      <Dropdown.Trigger>
        <Button
          :label="ctaLabel"
          kind="outlined"
          size="medium"
          icon="pi pi-plus"
          class="w-full"
        />
      </Dropdown.Trigger>

      <!-- An account with none of this resource yet still gets the control: the
           create below is always something to do in it. -->
      <Dropdown.Group
        v-if="options.length"
        :label="listLabel"
      >
        <Dropdown.Option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </Dropdown.Group>

      <Dropdown.Group>
        <Dropdown.Option
          :value="CREATE"
          :label="`Create ${kind}`"
        />
      </Dropdown.Group>
    </Dropdown>
  </TopologyNode>
</template>
