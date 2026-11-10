<script setup>
  import Wizard from '@aziontech/webkit/wizard'
  import Alert from '@aziontech/webkit/alert'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldSelect from '@aziontech/webkit/field-select'
  import { ref } from 'vue'

  const step = ref(0)
  const name = ref('')
  const region = ref('south-america')
  const environment = ref('production')
  const nameMissing = ref(false)

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' }
  ]
  const environments = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' }
  ]
  const labelOf = (options, value) =>
    options.find((option) => option.value === value)?.label ?? 'Not set'

  const onNext = (event, current) => {
    nameMissing.value = current === 0 && !name.value.trim()
    if (nameMissing.value) event.preventDefault()
  }
</script>

<template>
  <Wizard
    v-model:active-step="step"
    aria-label="Create resource"
    submit-label="Create"
    @next="onNext"
  >
    <Wizard.Step
      title="Name and region"
      description="Name the resource and choose where it runs."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          v-if="nameMissing"
          severity="danger"
          label="Enter a name to continue."
        />
        <FieldText
          v-model="name"
          label="Name"
          required
          :invalid="nameMissing"
        />
        <FieldSelect
          v-model="region"
          label="Region"
          :options="regions"
        />
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Configuration"
      description="Choose the environment it serves."
    >
      <FieldSelect
        v-model="environment"
        label="Environment"
        :options="environments"
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
        <dt class="text-(--text-muted)">Environment</dt>
        <dd class="text-(--text-default)">{{ labelOf(environments, environment) }}</dd>
      </dl>
    </Wizard.Step>
  </Wizard>
</template>
