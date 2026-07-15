<script setup>
import { curve, duration } from "@aziontech/theme/animations";
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import GlobalHeader from "@aziontech/webkit/global-header";
import IconButton from "@aziontech/webkit/icon-button";
import InputPassword from "@aziontech/webkit/input-password";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import Link from "@aziontech/webkit/link";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// Prototype flow: 'email' collects the address, 'password' collects the secret.
const step = ref("email");
const email = ref("");
const password = ref("");
// Loading flag — shared by the email lookup and the sign-in submit.
const verifying = ref(false);

const router = useRouter();

const canContinue = computed(() => email.value.trim() !== "");

// Motion tokens — fast-02 (110ms) + productive-entrance curve, read from the
// theme primitives (never hardcoded). Applied inline because Tailwind cannot
// emit per-state duration/easing utilities (design.md § Motion — Drawer pattern).
const stepTransitionStyle = {
  transition: `opacity ${duration["moderate-02"]} ${curve["productive-entrance"]}, transform ${duration["fast-02"]} ${curve["productive-entrance"]}`,
};

// Mock backend calls. A rejected promise models a request-level failure
// (network / 5xx) — type "fail" as the password to exercise the error path.
const lookupEmail = () => new Promise((resolve) => setTimeout(resolve, 900));
const authenticate = (secret) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () =>
        secret === "fail"
          ? reject(new Error("Invalid email or password."))
          : resolve(),
      900,
    ),
  );

// `verifying` is the single lock: the primary Button shows :loading and every
// field is :disabled off it. The handler also guards on the flag (no
// double-submit), and releases it in `finally` so a failure never bricks the
// form. Request failures surface via toast.error with a Retry action.
const goToPassword = async () => {
  if (!canContinue.value || verifying.value) return;
  verifying.value = true;
  try {
    await lookupEmail();
    step.value = "password";
  } catch (error) {
    toast.error("Couldn't verify that email.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => goToPassword() },
    });
  } finally {
    verifying.value = false;
  }
};

const backToEmail = () => {
  step.value = "email";
  password.value = "";
};

const signIn = async () => {
  if (password.value.trim() === "" || verifying.value) return;
  verifying.value = true;
  try {
    await authenticate(password.value);
    router.push({ name: "dashboard", query: { email: email.value } });
  } catch (error) {
    toast.error("Sign-in failed.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => signIn() },
    });
  } finally {
    verifying.value = false;
  }
};

// On the email step the primary button advances; on the password step it submits.
const handlePrimary = () => {
  if (step.value === "email") goToPassword();
  else signIn();
};
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Global header -->
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Brand>
        <span class="text-[var(--primary)]">
          <svg
            viewBox="0 0 90 18"
            fill="currentColor"
            role="img"
            aria-label="Azion"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z"
            />
          </svg>
        </span>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <!-- Content -->
    <main
      class="flex flex-1 flex-col items-center justify-center p-[var(--spacing-md)]"
    >
      <div
        class="flex w-full max-w-[var(--container-sm)] flex-col items-center gap-[var(--spacing-xs)]"
      >
        <CardBox class="w-full">
          <template #content>
            <div
              class="flex flex-col gap-[var(--spacing-lg)]"
            >
              <!-- Section header -->
              <header class="flex flex-col gap-[var(--spacing-xs)]">
                <h1 class="text-heading-sm text-[var(--text-default)]">
                  Welcome Back
                </h1>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Sign in to your account.
                </p>
              </header>

              <!-- Field area swaps between steps with a fast-02 / productive-entrance motion -->
              <Transition
                mode="out-in"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <!-- Email step: email field -->
                <div
                  v-if="step === 'email'"
                  key="email"
                  :style="stepTransitionStyle"
                  class="flex flex-col gap-[var(--spacing-xs)] motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <Label for="login-email" value="Email" />
                  <InputText
                    id="login-email"
                    v-model="email"
                    type="email"
                    size="large"
                    name="email"
                    autocomplete="email"
                    placeholder="myemail@azion.com"
                    :disabled="verifying"
                    @keyup.enter="goToPassword"
                  />
                </div>

                <!-- Password step: email chip + password field -->
                <div
                  v-else
                  key="password"
                  :style="stepTransitionStyle"
                  class="flex flex-col gap-[var(--spacing-lg)] motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <div class="flex items-center gap-[var(--spacing-sm)]">
                    <IconButton
                      icon="pi pi-chevron-left"
                      aria-label="Change email"
                      kind="outlined"
                      size="small"
                      :disabled="verifying"
                      @click="backToEmail"
                    />
                    <span
                      class="truncate text-label-sm text-[var(--text-default)]"
                      >{{ email }}</span
                    >
                  </div>

                  <InputPassword
                    id="login-password"
                    v-model="password"
                    name="password"
                    autocomplete="current-password"
                    placeholder="Type your password"
                    class="w-full"
                    :disabled="verifying"
                    @keyup.enter="signIn"
                  />
                </div>
              </Transition>

              <div class="flex flex-col gap-[var(--spacing-lg)]">
                <!-- "Or" separator — only frames the social alternatives below -->
                <div
                  v-if="step === 'email'"
                  class="flex items-center gap-[var(--spacing-md)]"
                >
                  <span
                    class="h-[var(--border-width-default)] flex-1 bg-[var(--border-default)]"
                  />
                </div>

                <!-- Continue with Email + "Last used" tag -->
                <div class="relative">
                  <Button
                    :label="
                      step === 'email' ? 'Continue with Email' : 'Sign In'
                    "
                    kind="primary"
                    size="large"
                    class="w-full"
                    :loading="verifying"
                    :disabled="step === 'password' && password.trim() === ''"
                    @click="handlePrimary"
                  />
                  <Tag
                    v-if="step === 'email'"
                    value="Last used"
                    severity="info"
                    size="small"
                    class="absolute right-[var(--spacing-sm)] top-0 -translate-y-1/2"
                  />
                </div>

                <!-- Social providers — hidden once the user commits to email sign-in -->
                <div
                  v-if="step === 'email'"
                  class="flex flex-col gap-[var(--spacing-sm)]"
                >
                  <Button
                    label="Continue with Google"
                    kind="outlined"
                    size="large"
                    icon="ai-cor ai-google"
                    class="w-full"
                    :disabled="verifying"
                  />
                  <Button
                    label="Continue with Github"
                    kind="outlined"
                    size="large"
                    icon="pi pi-github"
                    class="w-full"
                    :disabled="verifying"
                  />
                </div>
              </div>
            </div>
          </template>
        </CardBox>

        <!-- Sign up prompt -->
        <div class="flex items-center justify-center gap-[var(--spacing-xs)]">
          <p class="text-body-sm text-[var(--text-default)]">
            Don't have an account?
          </p>
          <Link label="Sign up" size="medium" :show-icon="false" href="#" />
        </div>
      </div>
    </main>
  </div>
</template>
