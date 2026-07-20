<script setup>
// The onboarding personalization step (route /signup/personalize) — the last
// screen before the console. Inside the shared AuthShell: a decorative product
// illustration + intro on the left, the personalization form on the right.
//
// The form is Fields-separated (the `/form` skill, Approach B). Two of the
// fields are single-choice card grids (BoxGridSelection, which is a native
// radiogroup): "how are you planning to use Azion" and "role". Each question is
// captioned by its own Label; because BoxGridSelection has no amber
// border, an empty-required group surfaces the prompt through an amber
// HelperText (never coloured red). The full name is a FieldText (its own Label +
// HelperText); the onboarding toggle is an optional FieldSwitchBlock.
//
// Validation runs on submit only (empty required → amber). One `submitting`
// flag locks the whole scope (the `/usability` Pattern 1): Submit shows
// :loading and every control is :disabled off it, guarded and released in
// `finally`. On success we toast and enter the platform (the console home).
import Button from "@aziontech/webkit/button";
import BoxGridSelection from "@aziontech/webkit/box-grid-selection";
import CardBox from "@aziontech/webkit/card-box";
import FieldSwitchBlock from "@aziontech/webkit/field-switch-block";
import FieldText from "@aziontech/webkit/field-text";
import HelperText from "@aziontech/webkit/helper-text";
import Label from "@aziontech/webkit/label";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AuthShell from "./ui/AuthShell.vue";

const route = useRoute();
const router = useRouter();

const email = computed(() => route.query.email || "myemail@azion.com");

const planningOptions = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "study", label: "Study" },
];

const roleOptions = [
  { value: "software-developer", label: "Software Developer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "infrastructure-analyst", label: "Infrastructure Analyst" },
  { value: "network-engineer", label: "Network Engineer" },
  { value: "security-specialist", label: "Security Specialist" },
  { value: "data-engineer", label: "Data Engineer" },
  { value: "ai-ml-engineer", label: "AI/ML Engineer" },
  { value: "iot-engineer", label: "IoT Engineer" },
  { value: "team-lead", label: "Team Lead" },
  { value: "other", label: "Other" },
];

const form = reactive({
  planning: "",
  role: "",
  fullName: "",
  onboarding: true,
});

// "" = valid; populated only by validate() on submit.
const errors = reactive({ planning: "", role: "", fullName: "" });
const submitting = ref(false);

// All three are required-only, so an empty value is the amber `required` prompt.
const validate = () => {
  errors.planning = form.planning ? "" : "Select how you'll use Azion.";
  errors.role = form.role ? "" : "Select the option that best describes you.";
  errors.fullName = form.fullName.trim() ? "" : "This field is required.";
  return !errors.planning && !errors.role && !errors.fullName;
};

// Mock personalization save.
const savePreferences = () =>
  new Promise((resolve) => setTimeout(resolve, 900));

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  if (!validate()) return;
  submitting.value = true;
  try {
    await savePreferences();
    toast.success("You're all set. Welcome to Azion.");
    // Enter the platform, carrying the identity across the shell.
    router.push({ name: "home", query: { email: email.value } });
  } catch (error) {
    toast.error("Couldn't save your preferences.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <AuthShell>
    <div
      class="mx-auto grid w-full max-w-[var(--container-7xl)] flex-1 grid-cols-1 items-center gap-[var(--spacing-xxl)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] lg:grid-cols-2"
    >
      <!-- Left column: decorative product illustration + intro -->
      <div class="flex flex-col gap-[var(--spacing-xl)]">
        <!-- Decorative browser-window mock (not a loading skeleton). -->
        <div
          class="hidden overflow-hidden rounded-[var(--shape-card)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)] lg:block"
          aria-hidden="true"
        >
          <div
            class="flex items-center gap-[var(--spacing-xs)] border-b-[length:var(--border-width-default)] border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
          >
            <span class="size-[8px] rounded-full bg-[var(--border-default)]" />
            <span class="size-[8px] rounded-full bg-[var(--border-default)]" />
            <span class="size-[8px] rounded-full bg-[var(--border-default)]" />
            <span
              class="ml-[var(--spacing-sm)] h-[10px] w-[var(--container-2xs)] rounded-[var(--shape-elements)] bg-[var(--bg-canvas)]"
            />
          </div>
          <div class="flex gap-[var(--spacing-md)] p-[var(--spacing-md)]">
            <div class="flex flex-1 flex-col gap-[var(--spacing-sm)]">
              <span
                class="h-[10px] w-1/2 rounded-[var(--shape-elements)] bg-[var(--bg-canvas)]"
              />
              <span
                class="h-[64px] w-full rounded-[var(--shape-card)] bg-[var(--bg-canvas)]"
              />
              <span
                class="h-[10px] w-3/4 rounded-[var(--shape-elements)] bg-[var(--bg-canvas)]"
              />
              <span
                class="h-[10px] w-2/3 rounded-[var(--shape-elements)] bg-[var(--bg-selected)]"
              />
              <span
                class="h-[10px] w-1/2 rounded-[var(--shape-elements)] bg-[var(--bg-canvas)]"
              />
            </div>
          </div>
        </div>

        <header class="flex flex-col gap-[var(--spacing-md)]">
          <h1 class="text-heading-md text-[var(--text-default)]">
            Personalize Your Experience
          </h1>
          <p class="text-body-md text-[var(--text-muted)]">
            Find opportunities to explore Azion and improve your projects
            following a unique journey, aligned with your needs.
          </p>
        </header>
      </div>

      <!-- Right column: the personalization form -->
      <CardBox class="w-full">
        <template #content>
          <form
            class="flex flex-col gap-[var(--spacing-lg)]"
            aria-label="Personalize your experience"
            novalidate
            @submit.prevent="submit"
          >
            <!-- Hidden native submit so Enter submits (webkit Button is type=button). -->
            <button type="submit" class="sr-only" aria-hidden="true" tabindex="-1" />
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Personalization</legend>

              <!-- How are you planning to use Azion? -->
              <div class="flex flex-col gap-[var(--spacing-xs)]">
                <Label required>How are you planning to use Azion?</Label>
                <BoxGridSelection
                  v-model="form.planning"
                  :items="planningOptions"
                  :disabled="submitting"
                  aria-label="How are you planning to use Azion?"
                  @update:model-value="errors.planning = ''"
                />
                <HelperText
                  v-if="errors.planning"
                  kind="required"
                  :label="errors.planning"
                />
              </div>

              <!-- What best describes your role? -->
              <div class="flex flex-col gap-[var(--spacing-xs)]">
                <Label required>What best describes your role?</Label>
                <BoxGridSelection
                  v-model="form.role"
                  :items="roleOptions"
                  :disabled="submitting"
                  aria-label="What best describes your role?"
                  @update:model-value="errors.role = ''"
                />
                <HelperText
                  v-if="errors.role"
                  kind="required"
                  :label="errors.role"
                />
              </div>

              <!-- Full name — FieldText owns its own Label (required tag) and
                   HelperText; no bespoke Label/div wrapper. -->
              <!-- No :disabled binding: the outer fieldset already disables the
                   input while submitting, and FieldText's own disabled state would
                   force a "This field is locked." helper we don't want here. -->
              <FieldText
                v-model="form.fullName"
                input-id="personalize-name"
                name="fullName"
                label="Your Full Name"
                required
                size="large"
                placeholder="Jane Doe"
                :helper-text="errors.fullName"
                @update:model-value="errors.fullName = ''"
              />

              <!-- Onboarding session toggle — optional. field-switch-block renders
                   the switch beside its own label in a bordered block. -->
              <FieldSwitchBlock
                v-model="form.onboarding"
                :disabled="submitting"
                label="Do you want to schedule an onboarding session with an Azion expert?"
              />
            </fieldset>

            <div class="flex justify-end">
              <Button
                label="Submit"
                kind="primary"
                size="large"
                :loading="submitting"
                @click="submit"
              />
            </div>
          </form>
        </template>
      </CardBox>
    </div>
  </AuthShell>
</template>
