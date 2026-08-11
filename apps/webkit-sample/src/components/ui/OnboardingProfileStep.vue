<script setup>
  // Step 3 of onboarding — how the user plans to use Azion, what they do, and
  // whether they want an expert on a call.
  //
  // Last because none of it CONSTRAINS the account: the two questions are answered
  // before Create organization, like every other required answer in this flow, but
  // neither changes the plan, the access, or anything the user can do afterwards —
  // they only shape what gets recommended next. That is also why the flow's primary
  // action names the organization it creates rather than saying "Finish": the step
  // is the last thing before the console, not a gate in front of it.
  //
  // Two grids and a switch:
  //   · USAGE — three options, because the only useful distinction is the context
  //     the work happens in; anything finer is a question the user has to interpret
  //     before they can answer it.
  //   · ROLE — ten options in a wrap-grid. At ten, a grid is faster to scan than
  //     any taxonomy imposed on it, and every option is visible at once, which is
  //     the whole reason this is not a select.
  //   · SESSION — a yes/no about a call with an Azion expert. A switch, not a
  //     checkbox: it is a standing preference the user is turning on, and it always
  //     has a value, so it never needs validating.
  //
  // The user's full name is NOT asked here. It is step 1's question, where the
  // console's greeting comes from — asking it twice in one flow reads as the second
  // screen not having received the first.
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'

  import { useOnboardingForm } from '../../lib/onboarding-form.js'
  import { roleOptions, usageOptions } from '../../onboarding.js'

  // The flow owns the answers; the step reads and writes them.
  const { form, errors, locked } = useOnboardingForm()
</script>

<template>
  <div class="flex flex-col gap-[var(--spacing-lg)]">
    <div class="flex flex-col gap-[var(--spacing-xs)]">
      <!-- `required` here is PERSISTENT — the indicator states the field must be
           answered from first render, decoupled from the amber prompt below, which
           is only revealed by a submit the user actually pressed. -->
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

    <div class="flex flex-col gap-[var(--spacing-xs)]">
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

    <!-- The switch's own label carries the question, so it takes no Label above it
         — a label over a labelled block would state the question twice. -->
    <FieldSwitchBlock
      v-model="form.session"
      :disabled="locked"
      label="Schedule an onboarding session with an Azion expert"
      description="A 30-minute call to create your first workload. We'll email you to schedule it."
    />
  </div>
</template>
