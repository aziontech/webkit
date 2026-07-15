<script setup>
// The Git / Template Settings configuration — the sample app's "Fields separated"
// form (the `/form` skill, Approach B). Implements the Figma "ContentSlot"
// (node 2023-19870): an intro line, a two-column row (Scope + Private Repository
// Name), a "Template Settings" sub-heading, then the Shopify credential fields
// stacked in a column. Every field is a standalone triad — Label + control +
// HelperText — with no CardBox and no Item.List.
//
// Validation has three distinct field states (in one sentence: required is
// communicated in the LABEL; the field's amber is feedback that appears ONLY
// after submit; and "empty" is a separate state from "invalid content"):
//   1. Empty (default)   — a required field shows the required tag on its LABEL
//                          only; the field itself stays neutral until a submit.
//   2. Empty after submit — the field turns amber (warning) to say "fill me". This
//                          feedback appears only after the first submit attempt.
//   3. Invalid content    — the field was filled but the value is wrong (a format
//                          error, not absence): the field turns red (invalid).
// To keep the label's required tag always visible while the amber border appears
// only post-submit, the Label is rendered here (always `required`) and the field
// wrapper is given NO `label`; its `:required` (amber) is bound to the post-submit
// empty state, and its `:invalid` (red) to a content error.
//
// Async submit follows the `/usability` skill: one `submitting` flag drives the
// Deploy button's `:loading` AND the fieldset's `:disabled` (lock the scope off
// one flag); the handler guards on it and releases in `finally`; a request-level
// failure surfaces via `toast.error` with a Retry action (never a field error).
import Button from "@aziontech/webkit/button";
import FieldText from "@aziontech/webkit/field-text";
import FieldTextSwitch from "@aziontech/webkit/field-text-switch";
import Label from "@aziontech/webkit/label";
import Select from "@aziontech/webkit/select";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// --- Field option models -------------------------------------------------
// Git account scopes the user can deploy from (the connected GitHub accounts).
const scopes = [
  { label: "gab-az", value: "gab-az" },
  { label: "azion-tech", value: "azion-tech" },
  { label: "rafael-personal", value: "rafael-personal" },
];
const scopeLabel = (value) =>
  scopes.find((option) => option.value === value)?.label ?? "";

// --- Form state ----------------------------------------------------------
const form = reactive({
  scope: "gab-az",
  repoName: "nuxt-ecommerce",
  // The trailing Switch on the Private Repository Name field (private on/off).
  repoPrivate: true,
  accessToken: "",
  revalidationSecret: "",
  storeDomain: "",
});

// Flipped on the first submit attempt. Before it, every field is neutral (state
// 1); after it, the empty/invalid feedback below goes live and tracks edits.
const submitted = ref(false);

// One flag locks the whole scope while the request is in flight.
const submitting = ref(false);

// --- Field-level validity ------------------------------------------------
// "empty" (required, missing a value) vs "invalid" (filled, wrong format) are
// deliberately separate — they drive different colours (amber vs red).
const scopeEmpty = computed(() => !form.scope);
const repoEmpty = computed(() => !form.repoName.trim());
const tokenEmpty = computed(() => !form.accessToken.trim());
// Store Domain is optional, but if filled it must be a URL — a content error.
const domainInvalid = computed(
  () =>
    form.storeDomain.trim() !== "" &&
    !/^https?:\/\/.+\..+/.test(form.storeDomain.trim()),
);

// Visible feedback = only after a submit attempt (states 2 and 3).
const repoWarning = computed(() => submitted.value && repoEmpty.value);
const tokenWarning = computed(() => submitted.value && tokenEmpty.value);
const domainError = computed(() => submitted.value && domainInvalid.value);

const isValid = computed(
  () =>
    !scopeEmpty.value &&
    !repoEmpty.value &&
    !tokenEmpty.value &&
    !domainInvalid.value,
);

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock

  // Reveal validation feedback on the fields themselves (amber/red), then stop
  // if anything is wrong — no summary, no toast for field errors.
  submitted.value = true;
  if (!isValid.value) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success(`Deploying "${form.repoName}" from ${scopeLabel(form.scope)}.`);
    router.push({ path: "/forms", query: { email: userEmail.value } });
  } catch (error) {
    // Request-level failure → toast with a way to recover. Never silent.
    toast.error("Could not start the deployment.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <AppLayout
    active="forms"
    :padded="false"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Fields separated' }]"
  >
    <form
      class="flex min-h-full flex-col"
      aria-labelledby="template-settings-title"
      novalidate
      @submit.prevent="submit"
    >
      <!-- Scrollable form body -->
      <div
        class="flex w-full flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <PageHeading
          title-id="template-settings-title"
          title="Import from Git"
          description="Configure your Git repository to integrate your codebase and automate deployments directly from your version control system."
        />

        <!-- One flag locks every control while the request is in flight. -->
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Template settings</legend>

          <!-- Repository row — two Fields side by side (Approach B, separated). -->
          <div
            class="grid grid-cols-1 items-start gap-[var(--spacing-lg)] sm:grid-cols-2"
          >
            <!-- Scope — composed Select field: the Label targets the TRIGGER.
                 (Select has no amber state; Scope is preselected, so state 2 does
                 not apply — the required tag on the label carries the intent.) -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-scope" required>Scope</Label>
              <Select
                v-model="form.scope"
                size="large"
                :disabled="submitting"
                placeholder="Select an account"
                :display-value="scopeLabel"
              >
                <Select.Trigger id="tpl-scope">
                  <template #iconLeft>
                    <i class="pi pi-github" aria-hidden="true" />
                  </template>
                </Select.Trigger>
                <Select.Content>
                  <Select.Option
                    v-for="option in scopes"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>

            <!-- Private Repository Name — value + inline on/off Switch. The Label
                 is rendered here (always required); the wrapper gets no `label`,
                 so its amber `:required` only fires after an empty submit. -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-repo-name" required>Private Repository Name</Label>
              <FieldTextSwitch
                v-model="form.repoName"
                v-model:enabled="form.repoPrivate"
                input-id="tpl-repo-name"
                name="repoName"
                placeholder="my-repository"
                :required="repoWarning"
                :disabled="submitting"
              />
            </div>
          </div>

          <!-- Sub-section: Template Settings -->
          <section class="flex flex-col gap-[var(--spacing-lg)]">
            <h2 class="text-heading-xs text-[var(--text-default)]">Template Settings</h2>

            <!-- Required credential: label required always; amber only after an
                 empty submit (state 2). -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-access-token" required>Shopify Access Token</Label>
              <FieldText
                v-model="form.accessToken"
                input-id="tpl-access-token"
                name="accessToken"
                placeholder="Access Token"
                size="large"
                :disabled="submitting"
                :required="tokenWarning"
                :helper-text="
                  tokenWarning
                    ? 'This field is required.'
                    : 'You can find this token in Credentials on Shopify Project Configurations.'
                "
              >
                <template #iconRight>
                  <i class="pi pi-lock" aria-hidden="true" />
                </template>
              </FieldText>
            </div>

            <!-- Optional credential — no required tag, no feedback. -->
            <FieldText
              v-model="form.revalidationSecret"
              input-id="tpl-revalidation-secret"
              name="revalidationSecret"
              label="Shopify Revalidation Secret"
              placeholder="Revalidation Secret"
              size="large"
              :disabled="submitting"
              helper-text="You can find this secret in Credentials on Shopify Project Configurations."
            >
              <template #iconRight>
                <i class="pi pi-lock" aria-hidden="true" />
              </template>
            </FieldText>

            <!-- Optional but format-validated: filled with a bad URL → red
                 (state 3, invalid content — distinct from empty). -->
            <FieldText
              v-model="form.storeDomain"
              input-id="tpl-store-domain"
              name="storeDomain"
              label="Shopify Store Domain"
              placeholder="https://your-shopify-store..."
              size="large"
              :disabled="submitting"
              :invalid="domainError"
              :helper-text="
                domainError
                  ? 'Enter a valid URL, e.g. https://your-store.myshopify.com.'
                  : 'Your Shopify Store Domain.'
              "
            >
              <template #iconLeft>
                <i class="pi pi-globe" aria-hidden="true" />
              </template>
              <template #iconRight>
                <i class="pi pi-lock" aria-hidden="true" />
              </template>
            </FieldText>
          </section>

          <!-- A single button to simulate the submit. -->
          <div class="flex justify-end">
            <Button
              label="Deploy"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
          </div>
        </fieldset>
      </div>
    </form>
  </AppLayout>
</template>
