<script setup>
  import Wizard from '@aziontech/webkit/wizard'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import { ref } from 'vue'

  const step = ref(0)
  const name = ref('storefront-api')
  const region = ref('south-america')
  const logging = ref(true)

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' }
  ]
  const labelOf = (options, value) =>
    options.find((option) => option.value === value)?.label ?? 'Not set'
</script>

<template>
  <Wizard
    v-model:active-step="step"
    aria-label="Create resource"
    submit-label="Create"
  >
    <Wizard.Step
      title="Configure"
      description="Name the resource and choose where it runs."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <FieldText
          v-model="name"
          label="Name"
          required
        />
        <FieldSelect
          v-model="region"
          label="Region"
          :options="regions"
        />
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Settings"
      description="Fine-tune the defaults, or skip to keep them."
      optional
    >
      <FieldSwitch
        v-model="logging"
        label="Enable logging"
        description="Keep a record of every request this resource handles."
      />
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      description="Check every answer before creating."
    >
      <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
        <dt class="text-(--text-muted)">Name</dt>
        <dd class="text-(--text-default)">{{ name }}</dd>
        <dt class="text-(--text-muted)">Region</dt>
        <dd class="text-(--text-default)">{{ labelOf(regions, region) }}</dd>
        <dt class="text-(--text-muted)">Logging</dt>
        <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
      </dl>
    </Wizard.Step>
  </Wizard>
</template>
