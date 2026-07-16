<script setup>
// The Git / Template Settings configuration — the sample app's "Fields separated"
// form (the `/form` skill, Approach B). It doubles as the gallery of EVERY webkit
// field component rendered in this style: FieldText, FieldTextarea, FieldTextSwitch,
// FieldInputGroup, FieldPassword, FieldPhoneNumber, Select, MultiSelect, the radio
// family (FieldRadioBlock / FieldRadio), the checkbox family (FieldCheckboxBlock /
// FieldCheckbox) and the switch family (FieldSwitchBlock / FieldSwitch).
//
// The central idea never changes across all of them: every field is a standalone
// triad — Label + control + HelperText — with no CardBox and no Item.List. For a
// single control the accessible name is a <Label for>; for a GROUP (radio /
// checkbox / switch blocks) the name is a <fieldset>/<legend>, and a HelperText
// carries the group-level feedback.
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
import FieldCheckbox from "@aziontech/webkit/field-checkbox";
import FieldCheckboxBlock from "@aziontech/webkit/field-checkbox-block";
import FieldInputGroup from "@aziontech/webkit/field-input-group";
import FieldPassword from "@aziontech/webkit/field-password";
import FieldPhoneNumber from "@aziontech/webkit/field-phone-number";
import FieldRadio from "@aziontech/webkit/field-radio";
import FieldRadioBlock from "@aziontech/webkit/field-radio-block";
import FieldSwitch from "@aziontech/webkit/field-switch";
import FieldSwitchBlock from "@aziontech/webkit/field-switch-block";
import FieldText from "@aziontech/webkit/field-text";
import FieldTextarea from "@aziontech/webkit/field-textarea";
import FieldTextSwitch from "@aziontech/webkit/field-text-switch";
import HelperText from "@aziontech/webkit/helper-text";
import Label from "@aziontech/webkit/label";
import MultiSelect from "@aziontech/webkit/multi-select";
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

// Deployment type — the RADIO BLOCK group (rich options with a description). It
// starts empty on purpose, to demonstrate the amber "required" group feedback.
const deploymentTypes = [
  {
    value: "static",
    label: "Static site",
    description:
      "Pre-rendered HTML/CSS/JS served straight from the edge. Fastest, no server runtime.",
  },
  {
    value: "ssr",
    label: "Server-side rendered",
    description:
      "Rendered on demand by an edge function. Best for dynamic, personalized pages.",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description:
      "A static shell with server-rendered islands. Balances speed and dynamism.",
  },
];

// Runtime — the compact inline RADIO group (label only, laid out in a row).
const runtimes = [
  { value: "node18", label: "Node.js 18" },
  { value: "node20", label: "Node.js 20 (LTS)" },
  { value: "bun", label: "Bun 1.x" },
];

// Edge regions — the MultiSelect (optional, many values).
const regionOptions = [
  { label: "US East", value: "us-east" },
  { label: "US West", value: "us-west" },
  { label: "South America", value: "sa-east" },
  { label: "Europe", value: "eu-west" },
  { label: "Asia Pacific", value: "ap-southeast" },
];
const regionsLabel = (values) =>
  (values ?? [])
    .map((value) => regionOptions.find((option) => option.value === value)?.label ?? value)
    .join(", ");

// --- Form state ----------------------------------------------------------
const form = reactive({
  // Import from Git
  scope: "gab-az",
  repoName: "nuxt-ecommerce",
  repoPrivate: true,
  // Template Settings
  accessToken: "",
  revalidationSecret: "",
  storeDomain: "",
  // Deployment
  deploymentType: "", // radio block — starts empty (required)
  runtime: "node20", // radio inline — preselected
  regions: ["us-east"], // multi-select — optional
  // Build & Runtime
  buildCommand: "", // input-group — required
  deployKey: "", // password — required + min length
  buildNotes: "", // textarea — optional
  // Notifications & Alerts
  alertPhone: "", // phone — required + min length
  emailNotifications: true, // switch block
  slackAlerts: false, // switch block
  deployPreviews: true, // switch inline
  // Edge features
  edgeCaching: true, // checkbox block
  http3: false, // checkbox block
  waf: false, // checkbox block
  // Confirmation
  acceptDeploy: false, // checkbox — required (must be checked)
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
const deploymentTypeEmpty = computed(() => !form.deploymentType);
const buildCommandEmpty = computed(() => !form.buildCommand.trim());
const deployKeyEmpty = computed(() => !form.deployKey);
// Deploy Key is a secret: filled but shorter than 8 chars is invalid content.
const deployKeyInvalid = computed(
  () => form.deployKey.length > 0 && form.deployKey.length < 8,
);
const phoneEmpty = computed(() => !form.alertPhone.trim());
// A filled phone with fewer than 8 digits is invalid content (not absence).
const phoneInvalid = computed(
  () => form.alertPhone.trim() !== "" && form.alertPhone.replace(/\D/g, "").length < 8,
);
const acceptEmpty = computed(() => !form.acceptDeploy);

// Visible feedback = only after a submit attempt (states 2 and 3).
const repoWarning = computed(() => submitted.value && repoEmpty.value);
const tokenWarning = computed(() => submitted.value && tokenEmpty.value);
const domainError = computed(() => submitted.value && domainInvalid.value);
const deploymentTypeWarning = computed(() => submitted.value && deploymentTypeEmpty.value);
const buildCommandWarning = computed(() => submitted.value && buildCommandEmpty.value);
const deployKeyWarning = computed(() => submitted.value && deployKeyEmpty.value);
const deployKeyError = computed(() => submitted.value && deployKeyInvalid.value);
const phoneWarning = computed(() => submitted.value && phoneEmpty.value);
const phoneError = computed(() => submitted.value && phoneInvalid.value);
const acceptWarning = computed(() => submitted.value && acceptEmpty.value);

const isValid = computed(
  () =>
    !scopeEmpty.value &&
    !repoEmpty.value &&
    !tokenEmpty.value &&
    !domainInvalid.value &&
    !deploymentTypeEmpty.value &&
    !buildCommandEmpty.value &&
    !deployKeyEmpty.value &&
    !deployKeyInvalid.value &&
    !phoneEmpty.value &&
    !phoneInvalid.value &&
    !acceptEmpty.value,
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

          <!-- Sub-section: Deployment — the radio family + MultiSelect. -->
          <section class="flex flex-col gap-[var(--spacing-lg)]">
            <h2 class="text-heading-xs text-[var(--text-default)]">Deployment</h2>

            <!-- Deployment type — RADIO BLOCK group. A group's accessible name is
                 a <fieldset>/<legend>; the visible caption reuses <Label required>.
                 It starts empty, so the amber group HelperText appears on submit. -->
            <fieldset class="m-0 flex w-full flex-col gap-[var(--spacing-xs)] border-0 p-0">
              <legend class="mb-[var(--spacing-xs)] p-0">
                <Label required>Deployment type</Label>
              </legend>
              <div class="flex flex-col gap-[var(--spacing-sm)]">
                <FieldRadioBlock
                  v-for="option in deploymentTypes"
                  :key="option.value"
                  v-model="form.deploymentType"
                  :value="option.value"
                  name="deploymentType"
                  :input-id="`tpl-deploymentType-${option.value}`"
                  :label="option.label"
                  :description="option.description"
                  :disabled="submitting"
                />
              </div>
              <HelperText
                v-if="deploymentTypeWarning"
                kind="required"
                value="Select a deployment type."
              />
            </fieldset>

            <!-- Runtime — compact inline RADIO group (label only, in a row). -->
            <fieldset class="m-0 flex w-full flex-col gap-[var(--spacing-xs)] border-0 p-0">
              <legend class="mb-[var(--spacing-xs)] p-0">
                <Label>Runtime</Label>
              </legend>
              <div class="flex flex-wrap gap-[var(--spacing-lg)]">
                <FieldRadio
                  v-for="option in runtimes"
                  :key="option.value"
                  v-model="form.runtime"
                  :value="option.value"
                  name="runtime"
                  :input-id="`tpl-runtime-${option.value}`"
                  :label="option.label"
                  :disabled="submitting"
                />
              </div>
            </fieldset>

            <!-- Edge regions — MultiSelect (optional). Label targets the trigger. -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-regions">Edge regions</Label>
              <MultiSelect
                v-model="form.regions"
                size="large"
                :disabled="submitting"
                placeholder="Select regions"
                :display-value="regionsLabel"
              >
                <MultiSelect.Trigger id="tpl-regions" />
                <MultiSelect.Content>
                  <MultiSelect.Option
                    v-for="option in regionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Option>
                </MultiSelect.Content>
              </MultiSelect>
              <HelperText value="Leave empty to deploy to every available region." />
            </div>
          </section>

          <!-- Sub-section: Build & Runtime — input-group, password, textarea. -->
          <section class="flex flex-col gap-[var(--spacing-lg)]">
            <h2 class="text-heading-xs text-[var(--text-default)]">Build &amp; Runtime</h2>

            <!-- Build command — FieldInputGroup with a leading addon. Required:
                 amber only after an empty submit. -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-build-command" required>Build command</Label>
              <FieldInputGroup
                v-model="form.buildCommand"
                input-id="tpl-build-command"
                name="buildCommand"
                placeholder="npm run build"
                :disabled="submitting"
                :required="buildCommandWarning"
                :helper-text="
                  buildCommandWarning
                    ? 'This field is required.'
                    : 'Run from the repository root during each deployment.'
                "
              >
                <template #left>
                  <span class="font-mono text-label-sm text-[var(--text-muted)]">$</span>
                </template>
              </FieldInputGroup>
            </div>

            <!-- Deploy Key — FieldPassword (toggleable). Required (amber) when
                 empty; invalid (red) when filled but shorter than 8 chars. -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-deploy-key" required>Deploy Key</Label>
              <FieldPassword
                v-model="form.deployKey"
                input-id="tpl-deploy-key"
                name="deployKey"
                placeholder="Paste your deploy key"
                autocomplete="new-password"
                :disabled="submitting"
                :required="deployKeyWarning"
                :invalid="deployKeyError"
                :helper-text="
                  deployKeyError
                    ? 'The deploy key must be at least 8 characters.'
                    : deployKeyWarning
                      ? 'This field is required.'
                      : 'Used to authenticate the build against your repository.'
                "
              />
            </div>

            <!-- Build notes — FieldTextarea (optional, resizable). -->
            <FieldTextarea
              v-model="form.buildNotes"
              input-id="tpl-build-notes"
              name="buildNotes"
              label="Build notes"
              placeholder="Anything the team should know about this deployment (optional)."
              :disabled="submitting"
              helper-text="Markdown is supported. Shown on the deployment summary."
            />
          </section>

          <!-- Sub-section: Notifications & Alerts — phone + switch family. -->
          <section class="flex flex-col gap-[var(--spacing-lg)]">
            <h2 class="text-heading-xs text-[var(--text-default)]">Notifications &amp; Alerts</h2>

            <!-- Alert phone — FieldPhoneNumber. Required (amber) when empty;
                 invalid (red) when filled with too few digits. -->
            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="tpl-alert-phone" required>On-call alert number</Label>
              <FieldPhoneNumber
                v-model="form.alertPhone"
                input-id="tpl-alert-phone"
                name="alertPhone"
                :disabled="submitting"
                :required="phoneWarning"
                :invalid="phoneError"
                :helper-text="
                  phoneError
                    ? 'Enter a valid phone number.'
                    : phoneWarning
                      ? 'This field is required.'
                      : 'We call this number if a production deployment fails.'
                "
              />
            </div>

            <!-- Switch BLOCK group — bordered rows with label + description. -->
            <div class="flex flex-col gap-[var(--spacing-sm)]">
              <FieldSwitchBlock
                v-model="form.emailNotifications"
                label="Email notifications"
                description="Send a summary email to the team when a deployment finishes."
                :disabled="submitting"
              />
              <FieldSwitchBlock
                v-model="form.slackAlerts"
                label="Slack alerts"
                description="Post to your connected Slack channel on failures and rollbacks."
                :disabled="submitting"
              />
            </div>

            <!-- Inline SWITCH — compact single row. -->
            <FieldSwitch
              v-model="form.deployPreviews"
              label="Deploy previews"
              description="Build a preview URL for every pull request."
              :disabled="submitting"
            />
          </section>

          <!-- Sub-section: Edge features — the checkbox BLOCK family. -->
          <section class="flex flex-col gap-[var(--spacing-lg)]">
            <h2 class="text-heading-xs text-[var(--text-default)]">Edge features</h2>

            <div class="flex flex-col gap-[var(--spacing-sm)]">
              <FieldCheckboxBlock
                v-model="form.edgeCaching"
                label="Edge caching"
                description="Cache responses at the edge for faster global delivery."
                :disabled="submitting"
              />
              <FieldCheckboxBlock
                v-model="form.http3"
                label="HTTP/3"
                description="Serve traffic over HTTP/3 (QUIC) where the client supports it."
                :disabled="submitting"
              />
              <FieldCheckboxBlock
                v-model="form.waf"
                label="Web Application Firewall"
                description="Screen incoming requests against the managed WAF ruleset."
                :disabled="submitting"
              />
            </div>
          </section>

          <!-- Confirmation — a single inline FieldCheckbox that must be checked.
               Required (amber tag on its label) only after submit; the group-level
               HelperText spells out the requirement. -->
          <div class="flex flex-col gap-[var(--spacing-xs)]">
            <FieldCheckbox
              v-model="form.acceptDeploy"
              input-id="tpl-accept-deploy"
              name="acceptDeploy"
              label="I understand this triggers an immediate production deployment."
              :required="acceptWarning"
              :disabled="submitting"
            />
            <HelperText
              v-if="acceptWarning"
              kind="required"
              value="You must acknowledge this before deploying."
            />
          </div>

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
