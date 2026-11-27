<script setup lang="ts">
  import Field from '@aziontech/ui/field'
  import FieldError from '@aziontech/ui/field-error'
  import RadioGroup from '@aziontech/ui/radio-group-root'
  import Switch from '@aziontech/ui/switch'

  import { roleOptions, usageOptions } from './onboarding-form.onboarding-form-data'

  defineProps<{ submitted: boolean; creating: boolean }>()

  const usage = defineModel<string | undefined>('usage', { required: true })
  const role = defineModel<string | undefined>('role', { required: true })
  const session = defineModel<boolean>('session', { required: true })
</script>

<template>
  <fieldset
    class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
    :disabled="creating"
  >
    <legend class="sr-only">Tell us about your work</legend>

    <div class="animate-fade-in motion-reduce:animate-none">
      <div class="flex flex-col gap-(--spacing-lg)">
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">How are you planning to use the platform?</Field.Legend>
          <div class="w-full [&>[role=radiogroup]]:grid! [&>[role=radiogroup]]:grid-cols-3">
            <RadioGroup
              v-model="usage"
              variant="card"
              orientation="horizontal"
              :options="usageOptions"
              aria-label="How are you planning to use the platform?"
            />
          </div>
          <FieldError v-if="submitted && !usage">Select one to continue.</FieldError>
        </fieldset>

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">What best describes your role?</Field.Legend>
          <div
            class="w-full [&>[role=radiogroup]]:grid! [&>[role=radiogroup]]:grid-cols-2 sm:[&>[role=radiogroup]]:grid-cols-3"
          >
            <RadioGroup
              v-model="role"
              variant="card"
              orientation="horizontal"
              :options="roleOptions"
              aria-label="What best describes your role?"
            />
          </div>
          <FieldError v-if="submitted && !role">Select one to continue.</FieldError>
        </fieldset>

        <Field.Label>
          <Field orientation="horizontal">
            <Switch v-model="session" />
            <Field.Content>
              <Field.Title>Schedule an onboarding session with an expert</Field.Title>
              <Field.Description
                >A 30-minute call to create your first project. We'll email you to schedule
                it.</Field.Description
              >
            </Field.Content>
          </Field>
        </Field.Label>
      </div>
    </div>
  </fieldset>
</template>
