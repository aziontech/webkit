<script setup>
// The email-verification screen (route /signup/verify) — reached right after
// Sign Up, inside the shared AuthShell with the testimonial beside it. It tells
// the user to check their inbox, lets them resend, and offers the way back to
// sign in.
//
// "Resend Email" is an async action, so it locks off one `resending` flag (the
// `/usability` contract): while the request is in flight the affordance shows a
// low-emphasis Spinner + "Sending…" instead of the link, the handler guards on
// the flag, and the result surfaces via toast. Field-less screen, so there is
// no form validation here.
//
// In the real product the user leaves this page by clicking the link in their
// inbox; this prototype exposes that as an explicit, clearly-labelled demo
// affordance so the flow into the platform stays traversable.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Link from "@aziontech/webkit/link";
import Spinner from "@aziontech/webkit/spinner";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AuthShell from "./ui/AuthShell.vue";
import TestimonialPanel from "./ui/TestimonialPanel.vue";

const route = useRoute();
const router = useRouter();

// The address carried over from Sign Up (falls back to a neutral phrasing).
const email = computed(() => route.query.email || "");

const resending = ref(false);

// Mock resend request. Reject models a request-level failure.
const sendVerification = () =>
  new Promise((resolve) => setTimeout(resolve, 900));

const resend = async () => {
  if (resending.value) return; // re-entrancy lock
  resending.value = true;
  try {
    await sendVerification();
    toast.success("Verification email sent.", {
      description: email.value
        ? `We sent another email to ${email.value}.`
        : "Check your inbox or spam folder.",
    });
  } catch (error) {
    toast.error("Couldn't resend the email.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => resend() },
    });
  } finally {
    resending.value = false; // release on success AND failure
  }
};

const returnToSignIn = () => router.push({ name: "login" });

// Prototype: simulate the user clicking the verification link in their inbox,
// which continues into the personalization step.
const simulateVerification = () =>
  router.push({ name: "signup-personalize", query: { email: email.value } });
</script>

<template>
  <AuthShell>
    <div
      class="mx-auto grid w-full max-w-[var(--container-7xl)] flex-1 grid-cols-1 items-center gap-[var(--spacing-xxl)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] lg:grid-cols-2"
    >
      <!-- Left column: the verification card -->
      <div class="flex flex-col items-center gap-[var(--spacing-md)]">
        <CardBox class="w-full max-w-[var(--container-sm)]">
          <template #content>
            <div class="flex flex-col gap-[var(--spacing-lg)]">
              <header class="flex flex-col gap-[var(--spacing-xs)]">
                <h1 class="text-heading-sm text-[var(--text-default)]">
                  Check your inbox
                </h1>
                <p class="text-body-sm text-[var(--text-muted)]">
                  We've sent you an email with instructions to verify your
                  account. Check your inbox or spam folder and follow the
                  instructions.
                </p>
              </header>

              <div class="flex items-center gap-[var(--spacing-xs)]">
                <p class="text-body-sm text-[var(--text-default)]">
                  Didn't receive the email?
                </p>
                <span
                  v-if="resending"
                  class="flex items-center gap-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]"
                >
                  <Spinner class="size-4" />
                  Sending…
                </span>
                <Link
                  v-else
                  label="Resend Email"
                  size="medium"
                  :show-icon="false"
                  href="#"
                  @click.prevent="resend"
                />
              </div>

              <Button
                label="Return to Sign In"
                kind="secondary"
                size="large"
                class="w-full"
                :disabled="resending"
                @click="returnToSignIn"
              />
            </div>
          </template>
        </CardBox>

        <!-- Prototype-only affordance for the verification link. -->
        <div class="flex items-center gap-[var(--spacing-xs)]">
          <p class="text-body-xs text-[var(--text-muted)]">Prototype:</p>
          <Link
            label="Simulate email verification"
            size="medium"
            icon="pi pi-arrow-right"
            href="#"
            @click.prevent="simulateVerification"
          />
        </div>
      </div>

      <!-- Right column: testimonial (below the card when stacked) -->
      <TestimonialPanel />
    </div>
  </AuthShell>
</template>
