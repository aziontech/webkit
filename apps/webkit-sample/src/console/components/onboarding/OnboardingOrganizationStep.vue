<script setup>
  import FieldText from '@aziontech/webkit/field-text'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'

  import { useOnboardingForm } from '../../lib/behavior/onboarding-form.js'
  import OrgMarkPicker from '../shell/OrgMarkPicker.vue'

  const { form, errors, locked } = useOnboardingForm()

  const helper = (message) => (locked.value ? '' : message)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <div class="flex flex-col gap-(--spacing-xs)">
      <Label
        for="onboarding-full-name"
        required
        >Your full name</Label
      >
      <FieldText
        v-model="form.fullName"
        input-id="onboarding-full-name"
        name="fullName"
        size="large"
        placeholder="Jane Doe"
        autocomplete="name"
        :required="!!errors.fullName"
        :helper-text="helper(errors.fullName || 'How Azion Console will greet you.')"
        @update:model-value="errors.fullName = ''"
      />
    </div>

    <div class="flex flex-col gap-(--spacing-xs)">
      <Label
        for="onboarding-org-name"
        required
        >Organization name</Label
      >
      <FieldText
        v-model="form.name"
        input-id="onboarding-org-name"
        name="organizationName"
        size="large"
        placeholder="Acme Inc."
        :required="!!errors.name"
        :helper-text="
          helper(errors.name || 'Usually your company. Everyone you invite will see it.')
        "
        @update:model-value="errors.name = ''"
      />
    </div>

    <div class="flex flex-col gap-(--spacing-xs)">
      <Label>Organization mark</Label>
      <OrgMarkPicker
        v-model="form.accent"
        :disabled="locked"
      />
      <HelperText
        v-if="!locked"
        label="Generated from the organization's name. Select its color."
      />
    </div>
  </div>
</template>
