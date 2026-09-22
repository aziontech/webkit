<script setup>
  // THE EMPTY MODULE, as its own step.
  //
  // It only exists when the host the reader just picked has the module off, so reaching
  // this step IS the finding: the reference the matrix records
  // (../../lib/data/resource-dependencies.js) is read by that host only while the module is
  // on, and the create would otherwise land a record nothing looks at.
  //
  // It is friction, not a wall — the switch is the fix, and leaving it off is still a way
  // through, restated on Review rather than blocked here.
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import Message from '@aziontech/webkit/message'

  
defineProps({
    /** What `moduleRequirementFor` returned — label, api name, and the reference it gates. */
    requirement: { type: Object, required: true },
    /** The host the reader chose, by name. */
    hostName: { type: String, default: '' },
    /** The host's own noun. */
    hostNoun: { type: String, default: 'host' },
    /** The resource's own noun. */
    unit: { type: String, default: 'resource' },
    /** Locks the control while the create request is in flight. */
    disabled: { type: Boolean, default: false }
  })

  /** True when the reader has agreed to switch the module on with this create. */
  const enableModule = defineModel({ type: Boolean, default: false })
</script>

<template>
  <!-- No band title: the page heading already names the module, and the message below
       carries the whole finding. A `Section` here would print the same words a third time. -->
  <CardBox :padded="false">
    <template #content>
      <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
        <Message
          severity="warning"
          size="small"
          :label="`A ${unit} is only read through ${requirement.via}, and ${hostName} has ${requirement.label} off — so nothing reads this one until the module is on.`"
        />

        <FieldSwitchBlock
          v-model="enableModule"
          :label="`Turn on ${requirement.label}`"
          :description="`Sets ${requirement.api} on the ${hostNoun} ${hostName} when this ${unit} is created.`"
          :disabled="disabled"
        />

        <p class="text-body-sm text-(--text-muted)">
          Leaving it off still creates the {{ unit }} — it simply is not read until someone
          turns {{ requirement.label }} on.
        </p>
      </div>
    </template>
  </CardBox>
</template>
