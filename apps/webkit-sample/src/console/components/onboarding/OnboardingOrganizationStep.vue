<script setup>
  // Step 1 of onboarding — WHO the user is, and WHAT their organization is called.
  //
  // Three decisions, and nothing else:
  //   · the user's FULL NAME, its own field. The console greets them by it and the
  //     rail shows it;
  //   · the organization's NAME — a separate question, because a company is not
  //     called what its first user is called, and echoing one into the other reads
  //     as a bug the first time they diverge;
  //   · its MARK — the generated marble avatar, whose accent the user picks (the
  //     same three accents every organization in the console wears, so the mark
  //     chosen here is the one the header shows on every page).
  //
  // What is NOT asked, because none of it is a decision at this point: the first
  // WORKSPACE (every organization is created with one, named "My Workspace" by the
  // store, renamed in the console later), and the OWNER and STATUS (the creator is
  // the owner and first Organization User, and a new organization is `active` —
  // `createOrganization` sets all three).
  //
  // Additional data — company size and industry — used to live here and no longer
  // does. It was a subsection of optional selects on the one screen where nothing
  // should compete with the questions that block the console, and the profile step
  // now asks the part of it that actually shapes a recommendation. The vocabulary
  // itself is untouched: the console's own Create Organization flow still asks it.
  import FieldText from '@aziontech/webkit/field-text'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'

  import { useOnboardingForm } from '../../lib/behavior/onboarding-form.js'
  import OrgMarkPicker from '../shell/OrgMarkPicker.vue'

  // The flow owns the answers; the step reads and writes them. `errors` is
  // populated on Continue only, so the amber `required` prompt is never revealed
  // from first render, and `locked` is the submit lock.
  const { form, errors, locked } = useOnboardingForm()

  // DISABLED YES, HELPER NO — the rule Sign Up and Create Organization follow. The
  // lock is carried by the flow's single `<fieldset :disabled>` and nothing else:
  // while it is on, every guidance line goes away (the FieldTexts take an empty
  // `helper-text`, the mark picker's HelperText unmounts) and `aria-describedby`
  // goes with it, so no line describes a field that takes no input and no input
  // points outside the DOM.
  const helper = (message) => (locked.value ? '' : message)
</script>

<template>
  <div class="flex flex-col gap-[var(--spacing-lg)]">
    <!-- Who the user is — its own field, independent of the organization's name
         below it. The console greets them by it and the rail shows it; the company
         is named separately. -->
    <div class="flex flex-col gap-[var(--spacing-xs)]">
      <Label
        for="onboarding-full-name"
        required
        >Your full name</Label
      >
      <!-- No :disabled here, deliberately: the enclosing fieldset already blocks
           the input, and the prop would make FieldText mint "This field is
           locked." — a permanent-lock claim for a 900ms wait the button's
           :loading already states. -->
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

    <!-- Label rendered here rather than by the field so its Required tag is
         PERSISTENT, decoupled from the field's amber state: :required on the
         wrapper is bound to the post-Continue empty state, so the amber is only
         revealed by a failed step, not from first render. -->
    <div class="flex flex-col gap-[var(--spacing-xs)]">
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

    <!-- The mark. Generated art rather than an upload: two organizations whose
         names share their first letters produce the same initials, which is the
         very case the mark exists to prevent. The user picks the colour it is
         painted in; the shape comes from the name itself, so each option previews
         the real mark. -->
    <div class="flex flex-col gap-[var(--spacing-xs)]">
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
