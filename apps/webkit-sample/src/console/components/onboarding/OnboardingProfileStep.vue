<script setup>
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'

  import { useOnboardingForm } from '../../lib/behavior/onboarding-form.js'
  import { roleOptions, usageOptions } from '../../lib/data/onboarding.js'

  const { form, errors, locked } = useOnboardingForm()
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <div class="flex flex-col gap-(--spacing-xs)">
      <Label required>How are you planning to use Azion?</Label>
      <BoxGridSelection
        v-model="form.usage"
        :items="usageOptions"
        :disabled="locked"
        aria-label="How are you planning to use Azion?"
        @update:model-value="errors.usage = ''"
      />
      <HelperText
        v-if="errors.usage && !locked"
        kind="required"
        :label="errors.usage"
      />
    </div>

    <div class="flex flex-col gap-(--spacing-xs)">
      <Label required>What best describes your role?</Label>
      <BoxGridSelection
        v-model="form.role"
        :items="roleOptions"
        :disabled="locked"
        aria-label="What best describes your role?"
        @update:model-value="errors.role = ''"
      />
      <HelperText
        v-if="errors.role && !locked"
        kind="required"
        :label="errors.role"
      />
    </div>

    <FieldSwitchBlock
      v-model="form.session"
      :disabled="locked"
      label="Schedule an onboarding session with an Azion expert"
      description="A 30-minute call to create your first workload. We'll email you to schedule it."
    />
  </div>
</template>
