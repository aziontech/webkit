<script setup>
  // The signup entry — the first step of the signup flow (route /signup), rendered
  // into the card half of the split its PARENT route owns (see SignupFlow.vue and
  // AuthSplit.vue). This component is the card and what sits on the canvas under
  // it; the chrome, the seam, the network panel and the entrance belong to the flow
  // around it, which is what lets the step change without the page re-arriving.
  //
  // The split is full-bleed rather than a centred container, and that is what puts
  // the CardBox back. The two halves are not two cells of one bordered box — they
  // are two halves of the PAGE, so the form needs an edge of its own to sit on or
  // it floats loose on the canvas.
  //
  // Form order follows the design: the email path first (fields, then the primary
  // action), the divider, then the providers. The divider means what it says here
  // — everything above it is one way in, everything below it is another.
  //
  // The form is Fields-separated (the `/form` skill, Approach B): stacked
  // Label + field-* triads. Work Email and Password are validated on submit
  // only — empty is the amber `required` prompt, a malformed value is the red
  // `invalid` state, and the message rides the field as its own HelperText
  // (never a toast, never a summary block). Password is the one field that is a
  // whole DS component rather than a triad: FieldPassword owns the input, the
  // helper line and the requirements row that SCORES the value as it is typed,
  // chip by chip, against the same array validate() gates the submit on — so a
  // present-but-weak value is `invalid` while an empty one is `required`, and
  // neither can ever contradict what the chips are showing.
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
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import FieldPassword from '@aziontech/webkit/field-password'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const form = reactive({ email: '', password: '' })
  // "" = valid; populated only by validate() on submit.
  const errors = reactive({ email: '', password: '' })
  // One flag locks the scope while the account is created.
  const submitting = ref(false)
  // Which social provider's handshake is in flight ('' = none). Separate from
  // `submitting` so only the button that was pressed shows :loading — but the
  // SCOPE lock is the union of both (`locked`), so no second path can start while
  // either is running.
  const provider = ref('')
  const locked = computed(() => submitting.value || provider.value !== '')

  // Social providers are gated on a readiness probe — the OAuth endpoints this
  // screen would ping before offering them — exactly as on Sign In. Until it
  // resolves the two buttons are Skeletons in their own shape, so a click can never
  // reach a provider that is not wired up yet (a Skeleton for something coming IN,
  // never a spinner on a control the user could still press).
  const providersReady = ref(false)
  const probeProviders = () => new Promise((resolve) => setTimeout(resolve, 1100))

  onMounted(async () => {
    await probeProviders()
    providersReady.value = true
  })

  // While the scope is locked, every helper line is withheld — both fields carry the
  // disabled treatment and the pressed control carries :loading, and that is the whole
  // message. Nothing asks the user to fix a field they cannot type in, and no padlock
  // line appears on either: FieldPassword renders a helper only for the copy it is
  // given, so an empty one stays silent through the lock too.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // One rule set, two consumers: FieldPassword's requirements row scores it chip by
  // chip as the user types, and validate() gates the submit on the same array. It is
  // imported from the DS rather than restated here — the field's built-in
  // `requirements` set IS this array, so the score and the error cannot disagree.
  const passwordMeetsRequirements = (value) =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
      typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
    )

  // Validate on submit only. Emptiness is the discriminator between the amber
  // `required` prompt and the red `invalid` message.
  const validate = () => {
    errors.email = !form.email.trim()
      ? 'This field is required.'
      : emailPattern.test(form.email.trim())
        ? ''
        : 'Enter a valid email address.'
    errors.password = !form.password
      ? 'This field is required.'
      : passwordMeetsRequirements(form.password)
        ? ''
        : 'Password does not meet requirements.'
    return !errors.email && !errors.password
  }

  // Mock account creation. Reject models a request-level failure (network / 5xx).
  const createAccount = () => new Promise((resolve) => setTimeout(resolve, 900))

  // Social sign-up. The provider authenticates AND vouches for the address, so
  // this path skips the email-verification step and lands on onboarding — the same
  // screen the verification link lands on.
  const authorizeProvider = () => new Promise((resolve) => setTimeout(resolve, 900))

  const continueWith = async (id) => {
    if (locked.value) return // re-entrancy + cross-path lock
    provider.value = id
    try {
      await authorizeProvider()
      router.push({
        name: 'signup-onboarding',
        // Whatever the user had already typed carries over; otherwise Onboarding
        // falls back to its own placeholder, as it does for a direct visit.
        query: form.email.trim() ? { email: form.email.trim() } : {}
      })
    } catch (error) {
      toast.error("Couldn't continue with that provider.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => continueWith(id) }
      })
    } finally {
      provider.value = '' // release on success AND failure
    }
  }

  const signUp = async () => {
    if (locked.value) return // re-entrancy + cross-path lock
    if (!validate()) return // errors now drive :required / :invalid inline
    submitting.value = true
    try {
      await createAccount()
      router.push({
        name: 'signup-verify',
        query: { email: form.email.trim() }
      })
    } catch (error) {
      toast.error("Couldn't create your account.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => signUp() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }

  const goToSignIn = () => router.push({ name: 'login' })
</script>

<template>
  <!-- One root element, because the flow cross-fades this component inside a
       <Transition> and a fragment cannot be animated. It carries the column layout
       for its own two pieces — the card and the way out under it — while the
       centring and the half's padding come from AuthSplit. -->
  <div class="flex w-full flex-col items-center gap-(--spacing-md)">
    <CardBox
      class="w-full max-w-(--container-sm)"
      :padded="false"
    >
      <template #content>
        <!-- The card's own padding, rather than CardBox's `padded`, which
                 is a tighter step than this composition wants. -->
        <form
          class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
          aria-label="Sign up for a free account"
          novalidate
          @submit.prevent="signUp"
        >
          <!-- Hidden native submit so Enter submits (webkit Button is type=button). -->
          <button
            type="submit"
            class="sr-only"
            aria-hidden="true"
            tabindex="-1"
          />
          <header class="flex flex-col gap-(--spacing-xxs)">
            <h1 class="text-heading-sm text-(--text-default)">Sign Up for a Free Account</h1>
            <p class="text-body-sm text-(--text-muted)">
              US$ 300 credit to use over 12 months, no credit card is required.
            </p>
          </header>

          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="locked"
          >
            <legend class="sr-only">Account credentials</legend>

            <!-- Both fields go :disabled with the scope; only their HELPER
                     lines are withheld while locked, so nothing describes a
                     field the user cannot act on — and neither field grows a
                     padlock line in its place. -->

            <!-- Work Email -->
            <div class="flex flex-col gap-(--spacing-xs)">
              <Label
                for="signup-email"
                required
                >Work Email</Label
              >
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
                :aria-describedby="errors.email && !locked ? 'signup-email-error' : undefined"
                @update:model-value="errors.email = ''"
              />
              <HelperText
                v-if="errors.email && !locked"
                id="signup-email-error"
                :kind="form.email.trim() ? 'invalid' : 'required'"
                :label="errors.email"
              />
            </div>

            <!-- Password. Everything from the input down belongs to
                     FieldPassword: the visibility toggle, the helper line, and the
                     requirements row that scores the value against the DS rule set
                     as it is typed. The row replaces the old "At least 8
                     characters…" helper sentence — it says the same thing and keeps
                     saying it, per rule instead of in prose.
                     The field NAME stays a standalone Label so "* (Required)" reads
                     at rest: the field's own `required` is webkit's amber
                     failed-check state (border + helper tone), which must fire on a
                     failed submit and not before. -->
            <div class="flex flex-col gap-(--spacing-xs)">
              <Label
                for="signup-password"
                required
                >Password</Label
              >
              <FieldPassword
                v-model="form.password"
                input-id="signup-password"
                name="password"
                autocomplete="new-password"
                placeholder="Create a password"
                requirements
                :disabled="locked"
                :required="!!errors.password && !form.password"
                :invalid="!!errors.password && !!form.password"
                :helper-text="locked ? '' : errors.password"
                @update:model-value="errors.password = ''"
              />
            </div>
          </fieldset>

          <Button
            label="Sign up"
            kind="primary"
            size="large"
            class="w-full"
            :loading="submitting"
            :disabled="provider !== ''"
            @click="signUp"
          />

          <!-- The divider separates the two ways in: the email path above
                   it, the providers below. -->
          <Divider label="or" />

          <!-- Social providers. Each carries its OWN :loading (only the
                   pressed one spins) while `locked` disables every other path
                   in the card, including the email form above.

                   Until the readiness probe lands they are Skeletons in the exact
                   geometry of the large Buttons they stand in for (h-10 / 2.5rem),
                   so the swap is a pure cross-fade with no height to travel and the
                   card never jumps under the cursor. Same treatment as Sign In. -->
          <div class="relative">
            <Transition
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              leave-active-class="absolute inset-x-0 top-0"
            >
              <div
                v-if="providersReady"
                key="providers"
                class="flex flex-col gap-(--spacing-sm) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              >
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
              </div>

              <div
                v-else
                key="preparing"
                role="status"
                aria-label="Preparing sign-up providers"
                class="flex flex-col gap-(--spacing-sm) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              >
                <Skeleton height="2.5rem" />
                <Skeleton height="2.5rem" />
              </div>
            </Transition>
          </div>

          <p class="text-center text-body-sm text-(--text-muted)">
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

    <!-- Below the card, on the canvas — the design puts it outside the box
             because it is not part of signing up. It is the way out of it. -->
    <div
      class="flex w-full max-w-(--container-sm) items-center justify-center gap-(--spacing-xs)"
    >
      <p class="text-body-sm text-(--text-default)">Already have an account?</p>
      <a
        class="text-link text-body-sm"
        href="/login"
        @click.prevent="goToSignIn"
        >Sign in</a
      >
    </div>
  </div>
</template>
