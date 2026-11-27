<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import RadioGroup from '@aziontech/ui/radio-group-root'

  import { accents } from '../onboarding-form-data'

  defineProps<{ submitted: boolean; previewName: string }>()

  const fullName = defineModel<string>('fullName', { required: true })
  const organizationName = defineModel<string>('organizationName', { required: true })
  const accent = defineModel<string>('accent', { required: true })
</script>

<template>
  <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
    <legend class="sr-only">Create your organization</legend>

    <div class="animate-fade-in motion-reduce:animate-none">
      <div class="flex flex-col gap-(--spacing-lg)">
        <Field
          required
          :invalid="submitted && !fullName.trim()"
        >
          <Field.Label>Your full name</Field.Label>
          <Input
            v-model="fullName"
            name="fullName"
            size="large"
            placeholder="Jane Doe"
            autocomplete="name"
          />
          <Field.Description>{{
            submitted && !fullName.trim()
              ? 'This field is required.'
              : 'How the app will greet you.'
          }}</Field.Description>
        </Field>

        <Field
          required
          :invalid="submitted && !organizationName.trim()"
        >
          <Field.Label>Organization name</Field.Label>
          <Input
            v-model="organizationName"
            name="organizationName"
            size="large"
            placeholder="Acme Inc."
          />
          <Field.Description>{{
            submitted && !organizationName.trim()
              ? 'This field is required.'
              : 'Usually your company. Everyone you invite will see it.'
          }}</Field.Description>
        </Field>

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">Organization mark</Field.Legend>
          <div
            class="w-full [&>[role=radiogroup]]:grid! [&>[role=radiogroup]]:grid-cols-3 sm:[&>[role=radiogroup]]:grid-cols-4"
          >
            <RadioGroup
              v-model="accent"
              variant="card"
              orientation="horizontal"
              :options="accents"
              aria-label="Organization mark"
              class="w-full"
            >
              <template #option="{ option }">
                <span class="flex flex-col items-center gap-(--spacing-xs)">
                  <Avatar
                    :label="previewName"
                    :alt="option.label"
                    :colors="option.colors"
                    pattern="marble"
                    size="medium"
                    variant="square"
                  />
                  <span class="text-body-xs text-(--text-muted)">{{ option.label }}</span>
                </span>
              </template>
            </RadioGroup>
          </div>
          <FieldDescription
            >Generated from the organization's name. Select its color.</FieldDescription
          >
        </fieldset>
      </div>
    </div>
  </fieldset>
</template>
