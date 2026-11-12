<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Wizard from '@aziontech/webkit/wizard'
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
        <Field
          required
          :invalid="nameMissing"
        >
          <Field.Label> Name </Field.Label>
          <Input v-model="name" />
        </Field>
        <Field>
          <Field.Label> Region </Field.Label>
          <Select v-model="region">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in regions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Configuration"
      description="Choose the environment it serves."
    >
      <Field>
        <Field.Label> Environment </Field.Label>
        <Select v-model="environment">
          <Select.Trigger />
          <Select.Content>
            <Select.Option
              v-for="option in environments"
              :key="String(option.value)"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </Field>
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
