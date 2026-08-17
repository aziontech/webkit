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
  // The CTA is a Dropdown of the resources available to bind — the choice is the
  // whole interaction, so it needs no drawer.
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'

  import TopologyNode from './TopologyNode.vue'

  defineProps({
    // Resource kind shown in the header ("Firewall", "Custom Page").
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

  const emit = defineEmits(['bind'])

  // Forwarded straight to TopologyNode so the PAGE decides which nodes start open.
  const open = defineModel('open', { type: Boolean, default: false })
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
      @select="(event, value) => emit('bind', event, value)"
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

      <Dropdown.Group>
        <Dropdown.Option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </Dropdown.Group>
    </Dropdown>
  </TopologyNode>
</template>
