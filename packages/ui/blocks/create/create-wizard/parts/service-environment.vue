<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Hint from '@aziontech/ui/hint'
  import RadioGroup from '@aziontech/ui/radio-group-root'
  import Select from '@aziontech/ui/select'

  import { labelFor, type ServiceWizardForm } from '../lib/service-wizard'
  import { certificates, environments } from '../sample'

  /** The domain and deployment answers. */
  const form = defineModel<ServiceWizardForm>('form', { required: true })
</script>

<template>
  <div class="mt-(--layout-section-gap)">
    <Card title="Environment and certificate">
      <template #default>
        <div class="flex flex-col gap-(--spacing-lg)">
          <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
            <Field.Legend
              id="environment-label"
              type="label"
            >
              <span class="inline-flex items-center gap-(--spacing-2xs)">
                Environment
                <Hint content="Which environment this binding lands on." />
              </span>
            </Field.Legend>
            <RadioGroup
              v-model="form.environment"
              variant="card"
              orientation="horizontal"
              :options="environments"
              aria-labelledby="environment-label"
              aria-describedby="environment-helper"
            />
            <FieldDescription id="environment-helper">
              The domain answers on the environment it is bound to.
            </FieldDescription>
          </fieldset>

          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
            <Field>
              <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                <Field.Label
                  for="certificate"
                  hint="One certificate per service, not per domain on it."
                  >Certificate</Field.Label
                >
              </div>
              <Select
                v-model="form.certificate"
                size="large"
                class="w-full"
                :display-value="labelFor(certificates)"
              >
                <Select.Trigger
                  id="certificate"
                  aria-label="Certificate"
                />
                <Select.Content>
                  <Select.Item
                    v-for="option in certificates"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </Field>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
