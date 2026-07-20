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
// One `submitting` flag locks the whole scope (the `/usability` Pattern 1):
// the Sign Up Button shows :loading and every field + social button is
// :disabled off it, guarded against re-entrancy and released in `finally`.
// A request-level failure surfaces via toast with a Retry action; on success
// we advance to the email-verification screen carrying the address.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Divider from "@aziontech/webkit/divider";
import FieldPassword from "@aziontech/webkit/field-password";
import HelperText from "@aziontech/webkit/helper-text";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import Link from "@aziontech/webkit/link";
import { toast } from "@aziontech/webkit/toast";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import AuthShell from "./ui/AuthShell.vue";
import TestimonialPanel from "./ui/TestimonialPanel.vue";

const router = useRouter();

const form = reactive({ email: "", password: "" });
// "" = valid; populated only by validate() on submit.
const errors = reactive({ email: "", password: "" });
// One flag locks the scope while the account is created.
const submitting = ref(false);

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

const signUp = async () => {
  if (submitting.value) return; // re-entrancy lock
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

              <!-- Social providers -->
              <div class="flex flex-col gap-[var(--spacing-sm)]">
                <Button
                  type="button"
                  label="Continue with GitHub"
                  kind="outlined"
                  size="large"
                  icon="pi pi-github"
                  class="w-full"
                  :disabled="submitting"
                />
                <Button
                  type="button"
                  label="Continue with Google"
                  kind="outlined"
                  size="large"
                  icon="ai-cor ai-google"
                  class="w-full"
                  :disabled="submitting"
                />
              </div>

              <!-- "or" separator -->
              <Divider label="or" />

              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Account credentials</legend>

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
                    :disabled="submitting"
                    :required="!!errors.email && !form.email.trim()"
                    :invalid="!!errors.email && !!form.email.trim()"
                    :aria-describedby="errors.email ? 'signup-email-error' : undefined"
                    @update:model-value="errors.email = ''"
                  />
                  <HelperText
                    v-if="errors.email"
                    id="signup-email-error"
                    :kind="form.email.trim() ? 'invalid' : 'required'"
                    :label="errors.email"
                  />
                </div>

                <!-- Password -->
                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Label for="signup-password" required>Password</Label>
                  <FieldPassword
                    v-model="form.password"
                    input-id="signup-password"
                    name="password"
                    autocomplete="new-password"
                    placeholder="Create a password"
                    :disabled="submitting"
                    :required="!!errors.password && !form.password"
                    :invalid="!!errors.password && !!form.password"
                    :helper-text="
                      errors.password ||
                      'At least 8 characters, including a letter and a number.'
                    "
                    @update:model-value="errors.password = ''"
                  />
                </div>
              </fieldset>

              <Button
                label="Sign Up"
                kind="primary"
                size="large"
                class="w-full"
                :loading="submitting"
                @click="signUp"
              />

              <p class="text-body-sm text-[var(--text-muted)]">
                By signing up, you agree to the
                <Link
                  label="Terms of Service"
                  size="medium"
                  :show-icon="false"
                  href="https://www.azion.com/en/documentation/"
                  target="_blank"
                />
                and
                <Link
                  label="Privacy Policy."
                  size="medium"
                  :show-icon="false"
                  href="https://www.azion.com/en/documentation/"
                  target="_blank"
                />
              </p>
            </form>
          </template>
        </CardBox>

        <div class="flex items-center gap-[var(--spacing-xs)]">
          <p class="text-body-sm text-[var(--text-default)]">
            Already have an account?
          </p>
          <Link
            label="Sign In"
            size="medium"
            :show-icon="false"
            href="/login"
            @click.prevent="goToSignIn"
          />
        </div>
      </div>

      <!-- Right column: testimonial (below the card when stacked) -->
      <TestimonialPanel />
    </div>
  </AuthShell>
</template>
