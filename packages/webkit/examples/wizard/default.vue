<script setup>
  import Wizard from '@aziontech/webkit/wizard'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import { ref } from 'vue'

  const step = ref(0)
  const name = ref('storefront-api')
  const region = ref('south-america')
  const environment = ref('production')
  const logging = ref(true)
  const path = ref('/api/*')
  const behavior = ref('deliver')

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
  const behaviors = [
    { value: 'deliver', label: 'Deliver' },
    { value: 'redirect', label: 'Redirect' },
    { value: 'deny', label: 'Deny' }
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
      description="Fine-tune the defaults."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <FieldSelect
          v-model="environment"
          label="Environment"
          :options="environments"
        />
        <FieldSwitch
          v-model="logging"
          label="Enable logging"
          description="Keep a record of every request this resource handles."
        />
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Rules"
      description="Decide what happens to matching requests."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <FieldText
          v-model="path"
          label="Path pattern"
          helper-text="Requests whose path matches this pattern follow the behavior below."
        />
        <FieldSelect
          v-model="behavior"
          label="Behavior"
          :options="behaviors"
        />
      </div>
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
        <dt class="text-(--text-muted)">Logging</dt>
        <dd class="text-(--text-default)">{{ logging ? 'On' : 'Off' }}</dd>
        <dt class="text-(--text-muted)">Path pattern</dt>
        <dd class="text-(--text-default)">{{ path }}</dd>
        <dt class="text-(--text-muted)">Behavior</dt>
        <dd class="text-(--text-default)">{{ labelOf(behaviors, behavior) }}</dd>
      </dl>
    </Wizard.Step>
  </Wizard>
</template>
