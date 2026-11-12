<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Wizard from '@aziontech/webkit/wizard'
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
        <Field required>
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
      title="Settings"
      description="Fine-tune the defaults."
    >
      <div class="flex flex-col gap-(--spacing-md)">
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
        <Field orientation="horizontal">
          <Switch v-model="logging" />
          <Field.Content>
            <Field.Label> Enable logging </Field.Label>
            <Field.Description>
              Keep a record of every request this resource handles.
            </Field.Description>
          </Field.Content>
        </Field>
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Rules"
      description="Decide what happens to matching requests."
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Field>
          <Field.Label> Path pattern </Field.Label>
          <Input v-model="path" />
          <Field.Description>
            Requests whose path matches this pattern follow the behavior below.
          </Field.Description>
        </Field>
        <Field>
          <Field.Label> Behavior </Field.Label>
          <Select v-model="behavior">
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in behaviors"
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
