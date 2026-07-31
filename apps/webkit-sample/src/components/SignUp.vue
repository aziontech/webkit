<script setup>
// The signup entry — a dedicated PAGE (route /signup) inside the shared
// AuthShell, with the customer testimonial beside the form (two columns on
// large screens, stacked on small).
//
// The form is Fields-separated (the `/form` skill, Approach B): stacked
// Label + field-* triads. Work Email and Password are validated on submit
// only — empty is the amber `required` prompt, a malformed value is the red
// `invalid` state, and the message rides the field as its own HelperText
// (never a toast, never a summary block). Password checks a real requirement
// set (length + a letter + a number), so a present-but-weak value is `invalid`
// while an empty one is `required`.
//
// Two paths leave this screen, and one lock covers both (the `/usability`
// Pattern 1): the email form advances to email verification, and a social
// provider — which authenticates AND vouches for the address — skips that step
// and goes straight to onboarding. `locked` is the union of the two flags, so
// whichever path is in flight shows :loading on its own control and disables
// every other one; both are guarded against re-entrancy and released in
// `finally`. Request-level failures surface via toast with a Retry action.
//
// Either way the flow ends in the same place: Onboarding, where the user's
// organization is created (signup → [verify →] onboarding → the console).
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Divider from "@aziontech/webkit/divider";
import HelperText from "@aziontech/webkit/helper-text";
import InputPassword from "@aziontech/webkit/input-password";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import AuthShell from "./ui/AuthShell.vue";
import TestimonialPanel from "./ui/TestimonialPanel.vue";

const router = useRouter();

const form = reactive({ email: "", password: "" });
// "" = valid; populated only by validate() on submit.
const errors = reactive({ email: "", password: "" });
// One flag locks the scope while the account is created.
const submitting = ref(false);
// Which social provider's handshake is in flight ('' = none). Separate from
// `submitting` so only the button that was pressed shows :loading — but the
// SCOPE lock is the union of both (`locked`), so no second path can start while
// either is running.
const provider = ref("");
const locked = computed(() => submitting.value || provider.value !== "");

// While the scope is locked, every helper line is withheld — the fields carry the
// disabled treatment and the pressed control carries :loading, and that is the
// whole message. The kinds below therefore only ever describe the UNLOCKED field:
// red `invalid` for a present-but-weak value, amber `required` for an empty one,
// muted `helper` otherwise. Never `disabled` — which is also why the password is
// composed from InputPassword + HelperText rather than FieldPassword, whose
// helper switches itself to kind=disabled (padlock, and it outranks `invalid`)
// whenever the input is disabled, and substitutes "This field is locked." when
// asked for no helper text at all.
const passwordHelperKind = computed(() => {
  if (!errors.password) return "helper";
  return form.password ? "invalid" : "required";
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Password requirement: at least 8 characters, with a letter and a number.
const passwordMeetsRequirements = (value) =>
  value.length >= 8 && /[a-zA-Z]/.test(value) && /\d/.test(value);

// Validate on submit only. Emptiness is the discriminator between the amber
// `required` prompt and the red `invalid` message.
const validate = () => {
  errors.email = !form.email.trim()
    ? "This field is required."
    : emailPattern.test(form.email.trim())
      ? ""
      : "Enter a valid email address.";
  errors.password = !form.password
    ? "This field is required."
    : passwordMeetsRequirements(form.password)
      ? ""
      : "Password does not meet requirements.";
  return !errors.email && !errors.password;
};

// Mock account creation. Reject models a request-level failure (network / 5xx).
const createAccount = () =>
  new Promise((resolve) => setTimeout(resolve, 900));

// Social sign-up. The provider authenticates AND vouches for the address, so
// this path skips the email-verification step and lands on onboarding — the same
// screen the verification link lands on.
const authorizeProvider = () =>
  new Promise((resolve) => setTimeout(resolve, 900));

const continueWith = async (id) => {
  if (locked.value) return; // re-entrancy + cross-path lock
  provider.value = id;
  try {
    await authorizeProvider();
    router.push({
      name: "signup-onboarding",
      // Whatever the user had already typed carries over; otherwise Onboarding
      // falls back to its own placeholder, as it does for a direct visit.
      query: form.email.trim() ? { email: form.email.trim() } : {},
    });
  } catch (error) {
    toast.error("Couldn't continue with that provider.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => continueWith(id) },
    });
  } finally {
    provider.value = ""; // release on success AND failure
  }
};

const signUp = async () => {
  if (locked.value) return; // re-entrancy + cross-path lock
  if (!validate()) return; // errors now drive :required / :invalid inline
  submitting.value = true;
  try {
    await createAccount();
    router.push({
      name: "signup-verify",
      query: { email: form.email.trim() },
    });
  } catch (error) {
    toast.error("Couldn't create your account.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => signUp() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};

const goToSignIn = () => router.push({ name: "login" });
</script>

<template>
  <AuthShell>
    <div
      class="mx-auto grid w-full max-w-[var(--container-7xl)] flex-1 grid-cols-1 items-center gap-[var(--spacing-xxl)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] lg:grid-cols-2"
    >
      <!-- Left column: the signup card -->
      <div class="flex flex-col items-center gap-[var(--spacing-md)]">
        <CardBox class="w-full max-w-[var(--container-sm)]">
          <template #content>
            <form
              class="flex flex-col gap-[var(--spacing-lg)]"
              aria-label="Sign up for a free account"
              novalidate
              @submit.prevent="signUp"
            >
              <!-- Hidden native submit so Enter submits (webkit Button is type=button). -->
              <button type="submit" class="sr-only" aria-hidden="true" tabindex="-1" />
              <header class="flex flex-col gap-[var(--spacing-xs)]">
                <h1 class="text-heading-sm text-[var(--text-default)]">
                  Sign Up for a Free Account
                </h1>
                <p class="text-body-sm text-[var(--text-muted)]">
                  US$ 300 credit to use over 12 months, no credit card is
                  required.
                </p>
              </header>

              <!-- Social providers. Each carries its OWN :loading (only the
                   pressed one spins) while `locked` disables every other path in
                   the card, including the email form below. -->
              <div class="flex flex-col gap-[var(--spacing-sm)]">
                <Button
                  type="button"
                  label="Continue with GitHub"
                  kind="outlined"
                  size="large"
                  icon="pi pi-github"
                  class="w-full"
                  :loading="provider === 'github'"
                  :disabled="locked && provider !== 'github'"
                  @click="continueWith('github')"
                />
                <Button
                  type="button"
                  label="Continue with Google"
                  kind="outlined"
                  size="large"
                  icon="ai-cor ai-google"
                  class="w-full"
                  :loading="provider === 'google'"
                  :disabled="locked && provider !== 'google'"
                  @click="continueWith('google')"
                />
              </div>

              <!-- "or" separator -->
              <Divider label="or" />

              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="locked"
              >
                <legend class="sr-only">Account credentials</legend>

                <!-- Both fields go :disabled with the scope; only their HELPER
                     lines are withheld while locked, so nothing describes a
                     field the user cannot act on. -->

                <!-- Work Email -->
                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Label for="signup-email" required>Work Email</Label>
                  <InputText
                    id="signup-email"
                    v-model="form.email"
                    type="email"
                    name="email"
                    size="large"
                    autocomplete="email"
                    class="w-full"
                    placeholder="myemail@azion.com"
                    :disabled="locked"
                    :required="!!errors.email && !form.email.trim()"
                    :invalid="!!errors.email && !!form.email.trim()"
                    :aria-describedby="
                      errors.email && !locked ? 'signup-email-error' : undefined
                    "
                    @update:model-value="errors.email = ''"
                  />
                  <HelperText
                    v-if="errors.email && !locked"
                    id="signup-email-error"
                    :kind="form.email.trim() ? 'invalid' : 'required'"
                    :label="errors.email"
                  />
                </div>

                <!-- Password -->
                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Label for="signup-password" required>Password</Label>
                  <InputPassword
                    id="signup-password"
                    v-model="form.password"
                    name="password"
                    autocomplete="new-password"
                    class="w-full"
                    placeholder="Create a password"
                    :disabled="locked"
                    :required="!!errors.password && !form.password"
                    :invalid="!!errors.password && !!form.password"
                    :aria-describedby="
                      locked ? undefined : 'signup-password-helper'
                    "
                    @update:model-value="errors.password = ''"
                  />
                  <HelperText
                    v-if="!locked"
                    id="signup-password-helper"
                    :kind="passwordHelperKind"
                    :label="
                      errors.password ||
                      'At least 8 characters, including a letter and a number.'
                    "
                  />
                </div>
              </fieldset>

              <Button
                label="Sign Up"
                kind="primary"
                size="large"
                class="w-full"
                :loading="submitting"
                :disabled="provider !== ''"
                @click="signUp"
              />

              <p class="text-center text-body-sm text-[var(--text-muted)]">
                By signing up, you agree to the
                <a
                  class="text-link"
                  href="https://www.azion.com/en/documentation/"
                  target="_blank"
                  >Terms of Service</a
                >
                and
                <a
                  class="text-link"
                  href="https://www.azion.com/en/documentation/"
                  target="_blank"
                  >Privacy Policy.</a
                >
              </p>
            </form>
          </template>
        </CardBox>

        <div class="flex items-center justify-center gap-[var(--spacing-xs)]">
          <p class="text-body-sm text-[var(--text-default)]">
            Already have an account?
          </p>
          <a
            class="text-link text-body-sm"
            href="/login"
            @click.prevent="goToSignIn"
            >Sign In</a
          >
        </div>
      </div>

      <!-- Right column: testimonial (below the card when stacked) -->
      <TestimonialPanel />
    </div>
  </AuthShell>
</template>
