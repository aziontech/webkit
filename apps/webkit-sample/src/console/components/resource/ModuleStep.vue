<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import Message from '@aziontech/webkit/message'

  
  interface Props {
    requirement: Record<string, unknown>
    hostName?: string
    hostNoun?: string
    unit?: string
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    hostName: '',
    hostNoun: 'host',
    unit: 'resource',
    disabled: false
  })

  const enableModule = defineModel({ type: Boolean, default: false })
</script>

<template>
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
