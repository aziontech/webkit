<script setup>
  // Scenario: EVERY WAY AN AUTH REQUEST CAN END — and why all of them say it in
  // the same place.
  //
  // `/forms/error-validation` sets the rule for a create form: WHERE an error goes
  // is decided by what the user can do about it. On the signed-out screens that
  // rule collapses to one answer, and this page is the statement of it:
  //
  //   AUTH NEVER TOASTS. Every outcome the server returns lands in ONE Message,
  //   inside the card, in the same slot, at the same size.
  //
  // A toast is wrong here for reasons that do not apply inside the console. There
  // is exactly ONE object on this page and the user cannot leave it, so a notice
  // that flies to a screen corner has travelled away from the only thing they are
  // looking at. It self-dismisses, which means the reason a sign-in failed can
  // expire while the user is still typing. And it stacks: three attempts leave
  // three corner cards saying the same thing, none of them near the fields.
  //
  //   | Outcome                                 | Status | Severity | Carries       |
  //   | --------------------------------------- | ------ | -------- | ------------- |
  //   | signed in / account created             | 200    | success  | nothing       |
  //   | credentials rejected                    | 401    | danger   | nothing       |
  //   | the service itself is down              | 503    | warning  | Retry         |
  //   | request failed, tied to no field        | 500    | danger   | Retry         |
  //   | no answer came back                     | none   | warning  | Retry         |
  //   | the address is already registered       | 409    | danger   | two exits     |
  //
  // Client-side validation is the ONE thing that does not go here: an empty or
  // malformed value is caught before any request, and it belongs on the field that
  // holds it (the amber required prompt, the red invalid state). The Message is for
  // what the SERVER said.
  //
  // With the placement settled, three decisions are left per outcome:
  //
  // 1. 401 is not field-scoped. Which half of the pair is wrong is not ours to
  //    disclose, since saying "wrong password" confirms the address exists. So it
  //    goes above both fields, and the password is cleared under it.
  // 2. Whether the Message carries an action. The rule is whether the user can fix
  //    it: after a 401 the credentials are right there to retype, so a button would
  //    only repeat the form. A 503, a 500 and a timeout are fixable by nobody, so
  //    the Message carries the one move left, Retry, and STAYS until it works. A
  //    409 is fixable, but not only here, so it carries the two exits as links.
  // 3. Severity, and words. A 500 is a failure (danger). A timeout is an unknown
  //    (warning): the POST may well have landed, so its copy may not claim the
  //    account was not created.
  //
  // Everything else follows the auth screens it mirrors (`/form`, Approach B):
  // stacked Label + field-* triads, validated on SUBMIT only, one `verifying` flag
  // locking the whole card (fields `:disabled`, the primary Button `:loading`),
  // released in `finally`. Copy follows `/webkit-microcopy`: sentence case, no em
  // dash, `Retry` (never "Try again"), and every error says what happened and what
  // to do next, with the status code last.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldPassword from '@aziontech/webkit/field-password'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import AuthColumn from '../../components/auth/AuthColumn.vue'

  const router = useRouter()

  // ── The outcome catalogue ──────────────────────────────────────────────────
  // `screen` pins an outcome to the card it can actually happen on ('' = either).
  // `carries` is the lesson, and note that `placement` is not a column: every one
  // of these lands in the same Message. What changes is the severity, what the
  // Message carries, and the words.
  const SCENARIOS = [
    {
      id: 'none',
      label: 'No failure',
      status: '200',
      screen: '',
      tone: 'success',
      carries: 'Card message',
      where:
        'The request succeeds. Even this reports itself on the card, because the user has not left it and nothing has to be said anywhere else.'
    },
    {
      id: 'bad-credentials',
      label: 'Incorrect credentials',
      status: '401',
      screen: 'signin',
      tone: 'danger',
      carries: 'Card message',
      where:
        'The pair is wrong, and which half is wrong is not ours to say, so it cannot ride one field. A danger message above both, and no action: the fields under it are the recovery. The password is cleared and focused.'
    },
    {
      id: 'service-unavailable',
      label: 'Service unavailable',
      status: '503',
      screen: 'signin',
      tone: 'warning',
      carries: 'Card message + Retry',
      where:
        'Nothing the user typed is wrong and nothing they type will fix it. A warning message that stays put, carrying the only move left: Retry.'
    },
    {
      id: 'server-error',
      label: 'Server error on POST',
      status: '500',
      screen: '',
      tone: 'danger',
      carries: 'Card message + Retry',
      where:
        'The POST failed and it is tied to no field. Inside the console this would be a toast. Here it is not: there is one card on the page and the user cannot leave it, so the notice stays on it and keeps Retry within reach.'
    },
    {
      id: 'timeout',
      label: 'Timeout on POST',
      status: 'no response',
      screen: '',
      tone: 'warning',
      carries: 'Card message + Retry',
      where:
        'The same message as the 500, deliberately warning and not danger. No answer came back, so the request may still have gone through, and the copy may not claim it failed.'
    },
    {
      id: 'email-taken',
      label: 'Email already registered',
      status: '409',
      screen: 'signup',
      tone: 'danger',
      carries: 'Card message + two exits',
      where:
        'Rejected, and the user can act on it, but not only here. So it takes the same message as everything else and carries the two ways out as links: sign in, or reset the password. The address stays in the field, ready to be changed.'
    }
  ]

  const scenario = ref('bad-credentials')
  const screen = ref('signin')

  const activeScenario = computed(
    () => SCENARIOS.find((entry) => entry.id === scenario.value) ?? SCENARIOS[0]
  )
  const scenarioLabel = (id) => SCENARIOS.find((entry) => entry.id === id)?.label ?? ''

  // ── Form state ─────────────────────────────────────────────────────────────
  const signin = reactive({ email: 'myemail@azion.com', password: '' })
  const signup = reactive({ email: 'myemail@azion.com', password: '' })

  // "" = valid. Written by the screen's validate() on submit and cleared on edit.
  // Client-side only: everything the SERVER says goes to `cardNotice`.
  const errors = reactive({
    signinEmail: '',
    signinPassword: '',
    signupEmail: '',
    signupPassword: ''
  })

  // The card's notice. EVERY outcome the server returns lands here, one at a time:
  // `{ severity, label, retry, exits }`. `retry` is the submit to re-run, and
  // holding the function (rather than a boolean) is what lets both cards render the
  // same Message block without either one knowing whose request failed. `exits`
  // switches the 409 to the linked form of the same Message.
  const cardNotice = ref(null)

  // One flag locks the whole card while its request is in flight.
  const verifying = ref(false)

  // SegmentedButton has no scope-level `disabled`, so the lock lands per OPTION:
  // switching cards mid-request is closed off like every other control here.
  const screenOptions = computed(() => [
    { label: 'Sign in', value: 'signin', disabled: verifying.value },
    { label: 'Sign up', value: 'signup', disabled: verifying.value }
  ])

  // ── The two selectors stay coherent ────────────────────────────────────────
  // A failure pinned to the other card would silently never fire, so picking one
  // moves the card, and moving the card drops a failure it cannot produce. No
  // combination on this page is a dead one.
  const resetSurfaces = () => {
    cardNotice.value = null
    errors.signinEmail = ''
    errors.signinPassword = ''
    errors.signupEmail = ''
    errors.signupPassword = ''
  }

  watch(scenario, () => {
    resetSurfaces()
    const pinned = activeScenario.value.screen
    if (pinned) screen.value = pinned
  })

  watch(screen, (next) => {
    resetSurfaces()
    const pinned = activeScenario.value.screen
    if (pinned && pinned !== next) scenario.value = 'none'
  })

  // ── The endpoint (mock) ────────────────────────────────────────────────────
  // One request for both cards. It fails with whatever the picker has armed for
  // the card being submitted, and with nothing at all otherwise.
  const REQUEST_MS = 900
  // Long enough to read as "this is not coming back", short enough to sit through.
  const TIMEOUT_MS = 2600

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const armedFor = (target) => {
    const entry = activeScenario.value
    if (entry.id === 'none') return ''
    if (entry.screen && entry.screen !== target) return ''
    return entry.id
  }

  const authRequest = async (target) => {
    const failure = armedFor(target)

    if (failure === 'timeout') {
      await sleep(TIMEOUT_MS)
      throw Object.assign(new Error('The server did not respond in time.'), { code: 'timeout' })
    }

    await sleep(REQUEST_MS)
    if (failure) throw Object.assign(new Error(scenarioLabel(failure)), { code: failure })

    return { ok: true }
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  // Submit only. Emptiness is the discriminator between the amber `required`
  // prompt and the red `invalid` message — never both on one field.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value) =>
    !value.trim()
      ? 'This field is required.'
      : emailPattern.test(value.trim())
        ? ''
        : 'Enter a valid email address.'

  // The same array FieldPassword's requirements row scores chip by chip, imported
  // from the DS so the score and the submit gate cannot disagree.
  const passwordMeetsRequirements = (value) =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
      typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
    )

  // An existing secret is not ours to grade — presence is the whole client check.
  const validateSignIn = () => {
    errors.signinEmail = emailError(signin.email)
    errors.signinPassword = signin.password ? '' : 'This field is required.'
    return !errors.signinEmail && !errors.signinPassword
  }

  const validateSignUp = () => {
    errors.signupEmail = emailError(signup.email)
    errors.signupPassword = !signup.password
      ? 'This field is required.'
      : passwordMeetsRequirements(signup.password)
        ? ''
        : 'Password does not meet requirements.'
    return !errors.signupEmail && !errors.signupPassword
  }

  // Editing the address retracts the 409 as well as the field's own message: the
  // notice offers to sign in as an address the user is in the middle of replacing.
  const onSignUpEmailInput = () => {
    errors.signupEmail = ''
    if (cardNotice.value?.exits) cardNotice.value = null
  }

  // ── Sign In ────────────────────────────────────────────────────────────────
  const focusSignInPassword = () =>
    globalThis.document.getElementById('auth-signin-password')?.focus()

  const signIn = async () => {
    if (verifying.value) return // re-entrancy lock
    if (!validateSignIn()) return

    cardNotice.value = null // a new attempt clears the previous outcome
    verifying.value = true
    let clearedPassword = false

    try {
      await authRequest('signin')
      // The demo stops at the door on purpose: the point of the page is where the
      // failures land, so the success reports itself and leaves the scenario loaded.
      cardNotice.value = { severity: 'success', label: 'Signed in.' }
    } catch (error) {
      if (error?.code === 'bad-credentials') {
        // Above both fields, never on one of them. No action: the fields under it
        // are the recovery. The password goes, the address stays, because retyping
        // it is a tax on someone who probably got it right.
        cardNotice.value = {
          severity: 'danger',
          label: 'Incorrect email or password. Check both and try again.'
        }
        signin.password = ''
        errors.signinPassword = ''
        clearedPassword = true
      } else if (error?.code === 'service-unavailable') {
        cardNotice.value = {
          severity: 'warning',
          label: 'Sign-in is unavailable right now. Your credentials are fine.',
          retry: signIn
        }
      } else if (error?.code === 'timeout') {
        // No answer is not the same as a refusal, and the copy has to say so.
        cardNotice.value = {
          severity: 'warning',
          label: 'The server did not answer in time. Your session may already be open.',
          retry: signIn
        }
      } else {
        cardNotice.value = {
          severity: 'danger',
          label: 'Sign-in failed on our side. You are still signed out. Error 500.',
          retry: signIn
        }
      }
    } finally {
      verifying.value = false // release on success AND failure
    }

    // Only after the lock is released: a disabled field cannot take focus.
    if (clearedPassword) {
      await nextTick()
      focusSignInPassword()
    }
  }

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const focusSignUpEmail = () => globalThis.document.getElementById('auth-signup-email')?.focus()

  const signUp = async () => {
    if (verifying.value) return // re-entrancy lock
    if (!validateSignUp()) return

    cardNotice.value = null
    verifying.value = true

    try {
      await authRequest('signup')
      cardNotice.value = {
        severity: 'success',
        label: `Account created. We sent a verification link to ${signup.email.trim()}.`
      }
    } catch (error) {
      if (error?.code === 'email-taken') {
        // Same Message as everything else, in the same slot. It is the one outcome
        // whose recovery is not on this card, so instead of Retry it carries the two
        // exits as links (`exits`, rendered by the template's linked variant).
        cardNotice.value = {
          severity: 'danger',
          label: 'This email is already registered.',
          exits: true
        }
      } else if (error?.code === 'timeout') {
        // The account may exist. Say that, and point at the inbox before the retry.
        cardNotice.value = {
          severity: 'warning',
          label:
            'The server did not answer in time. The account may already exist, so check your inbox first.',
          retry: signUp
        }
      } else {
        cardNotice.value = {
          severity: 'danger',
          label: 'Sign-up failed on our side. No account was created. Error 500.',
          retry: signUp
        }
      }
    } finally {
      verifying.value = false // release on success AND failure
    }

    // The address is what has to change, so the caret goes back to it.
    if (cardNotice.value?.exits) {
      await nextTick()
      focusSignUpEmail()
    }
  }

  // The 409's two exits, offered inside the Message. Both are real destinations in
  // this prototype, so the rejection is never a dead end.
  const goToSignIn = () => {
    signin.email = signup.email
    scenario.value = 'none'
    screen.value = 'signin'
  }

  const goToReset = () => router.push({ name: 'login' })

  const backToForms = () => router.push({ path: '/forms' })
</script>

<template>
  <AuthColumn>
    <!-- Demo scaffolding, deliberately dashed and outside the card so it reads as
         not-part-of-the-product, the same treatment `/forms/error-validation`
         gives its "other user" panel. -->
    <aside
      aria-label="Failure simulation"
      class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md)"
    >
      <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
        <p class="m-0 text-overline-sm text-(--text-muted)">Simulation: the endpoint</p>
        <Tag
          :label="`${activeScenario.status} · ${activeScenario.carries}`"
          :severity="activeScenario.tone"
          size="medium"
        />
      </div>

      <SegmentedButton
        v-model="screen"
        :options="screenOptions"
        aria-label="Screen"
      />

      <Select
        v-model="scenario"
        size="large"
        class="w-full"
        :display-value="scenarioLabel"
        :disabled="verifying"
      >
        <Select.Trigger
          id="auth-scenario"
          aria-label="What the endpoint returns"
        />
        <Select.Content>
          <Select.Option
            v-for="entry in SCENARIOS"
            :key="entry.id"
            :value="entry.id"
          >
            {{ entry.label }}
          </Select.Option>
        </Select.Content>
      </Select>

      <p class="m-0 text-body-xs text-(--text-muted)">{{ activeScenario.where }}</p>
    </aside>

    <!-- The two cards cross-fade: the leaving one goes out of flow so the incoming
         one owns the layout immediately and the column re-centres once. -->
    <div class="relative w-full max-w-(--container-sm)">
      <Transition
        enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="absolute inset-x-0 top-0 transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <!-- ── Sign In ──────────────────────────────────────────────────────── -->
        <CardBox
          v-if="screen === 'signin'"
          key="signin"
          class="w-full"
          :padded="false"
        >
          <template #content>
            <form
              class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
              aria-label="Sign in to your account"
              novalidate
              @submit.prevent="signIn"
            >
              <!-- Hidden native submit so Enter submits (webkit Button is type=button). -->
              <button
                type="submit"
                class="sr-only"
                aria-hidden="true"
                tabindex="-1"
              />

              <header class="flex flex-col gap-(--spacing-xxs)">
                <h1 class="text-heading-sm text-(--text-default)">Welcome back</h1>
                <p class="text-body-sm text-(--text-muted)">Sign in to your account.</p>
              </header>

              <!-- THE notice. Every outcome the server returns lands here; see the
                   block comment at the top of this file for why none of them is a
                   toast. `Message severity="danger|warning"` renders role="alert", so
                   it announces on arrival.
                   The travel sits on a WRAPPER, not on <Message>: the component sets
                   an inline `transition: opacity` on its own root, and an inline style
                   beats a utility class, so the translate would jump.
                   The copy goes through the DEFAULT SLOT rather than `label` in both
                   variants on purpose. Message renders the slot only when one exists
                   (`v-if="$slots.default"`), so a slot that is present-but-empty on
                   the non-linked outcomes would blank the banner. -->
              <Transition
                enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
                enter-from-class="translate-y-2 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-2 opacity-0"
              >
                <div v-if="cardNotice">
                  <!-- `size="small"` on every Message: it sits INSIDE a card, under a
                       heading, so it is a notice on the form and not a second banner
                       competing with it. The slotted action matches the banner's size
                       the same way the component's built-in one does (`:size="size"`). -->
                  <Message
                    :severity="cardNotice.severity"
                    size="small"
                  >
                    {{ cardNotice.label }}
                    <!-- The 409's variant: its recovery is not on this card, so
                         instead of Retry it carries the two exits as links, which
                         Message already styles inside its copy. -->
                    <template v-if="cardNotice.exits">
                      <a
                        href="#"
                        @click.prevent="goToSignIn"
                        >Sign in</a
                      >
                      or
                      <a
                        href="#"
                        @click.prevent="goToReset"
                        >reset your password</a
                      >.
                    </template>

                    <!-- Only an outcome the user CANNOT fix here carries a button. -->
                    <template
                      v-if="cardNotice.retry"
                      #action
                    >
                      <Button
                        label="Retry"
                        kind="secondary"
                        size="small"
                        :loading="verifying"
                        @click="cardNotice.retry()"
                      />
                    </template>
                  </Message>
                </div>
              </Transition>

              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                :disabled="verifying"
              >
                <legend class="sr-only">Credentials</legend>

                <div class="flex flex-col gap-(--spacing-xs)">
                  <Label
                    for="auth-signin-email"
                    label="Email"
                    required
                  />
                  <InputText
                    id="auth-signin-email"
                    v-model="signin.email"
                    type="email"
                    size="large"
                    name="email"
                    autocomplete="email"
                    class="w-full"
                    placeholder="myemail@azion.com"
                    :disabled="verifying"
                    :required="!!errors.signinEmail && !signin.email.trim()"
                    :invalid="!!errors.signinEmail && !!signin.email.trim()"
                    :aria-describedby="
                      errors.signinEmail && !verifying ? 'auth-signin-email-error' : undefined
                    "
                    @update:model-value="errors.signinEmail = ''"
                  />
                  <HelperText
                    v-if="errors.signinEmail && !verifying"
                    id="auth-signin-email-error"
                    :kind="signin.email.trim() ? 'invalid' : 'required'"
                    :label="errors.signinEmail"
                  />
                </div>

                <!-- No requirements row: this is an existing secret, not one being
                     chosen, and grading it would be both wrong and a hint. -->
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Label
                    for="auth-signin-password"
                    label="Password"
                    required
                  />
                  <FieldPassword
                    v-model="signin.password"
                    input-id="auth-signin-password"
                    name="password"
                    autocomplete="current-password"
                    placeholder="Type your password"
                    :disabled="verifying"
                    :required="!!errors.signinPassword && !signin.password"
                    :invalid="!!errors.signinPassword && !!signin.password"
                    :helper-text="verifying ? '' : errors.signinPassword"
                    @update:model-value="errors.signinPassword = ''"
                  />
                </div>
              </fieldset>

              <Button
                label="Sign in"
                kind="primary"
                size="large"
                class="w-full"
                :loading="verifying"
                @click="signIn"
              />
            </form>
          </template>
        </CardBox>

        <!-- ── Sign Up ──────────────────────────────────────────────────────── -->
        <CardBox
          v-else
          key="signup"
          class="w-full"
          :padded="false"
        >
          <template #content>
            <form
              class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
              aria-label="Sign up for a free account"
              novalidate
              @submit.prevent="signUp"
            >
              <button
                type="submit"
                class="sr-only"
                aria-hidden="true"
                tabindex="-1"
              />

              <header class="flex flex-col gap-(--spacing-xxs)">
                <h1 class="text-heading-sm text-(--text-default)">
                  Sign up for a free account
                </h1>
                <p class="text-body-sm text-(--text-muted)">
                  US$ 300 credit to use over 12 months, no credit card is required.
                </p>
              </header>

              <!-- The same notice, in the same place, driven by the same
                   `cardNotice`. Identical to Sign In's by design: that is what makes
                   "auth never toasts" a property of the page rather than a habit
                   repeated per screen. See the Sign In card above for the comments. -->
              <Transition
                enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
                enter-from-class="translate-y-2 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-2 opacity-0"
              >
                <div v-if="cardNotice">
                  <Message
                    :severity="cardNotice.severity"
                    size="small"
                  >
                    {{ cardNotice.label }}
                    <template v-if="cardNotice.exits">
                      <a
                        href="#"
                        @click.prevent="goToSignIn"
                        >Sign in</a
                      >
                      or
                      <a
                        href="#"
                        @click.prevent="goToReset"
                        >reset your password</a
                      >.
                    </template>

                    <template
                      v-if="cardNotice.retry"
                      #action
                    >
                      <Button
                        label="Retry"
                        kind="secondary"
                        size="small"
                        :loading="verifying"
                        @click="cardNotice.retry()"
                      />
                    </template>
                  </Message>
                </div>
              </Transition>

              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                :disabled="verifying"
              >
                <legend class="sr-only">Account credentials</legend>

                <div class="flex flex-col gap-(--spacing-xs)">
                  <Label
                    for="auth-signup-email"
                    label="Work email"
                    required
                  />
                  <InputText
                    id="auth-signup-email"
                    v-model="signup.email"
                    type="email"
                    size="large"
                    name="email"
                    autocomplete="email"
                    class="w-full"
                    placeholder="myemail@azion.com"
                    :disabled="verifying"
                    :required="!!errors.signupEmail && !signup.email.trim()"
                    :invalid="!!errors.signupEmail && !!signup.email.trim()"
                    :aria-describedby="
                      errors.signupEmail && !verifying ? 'auth-signup-email-error' : undefined
                    "
                    @update:model-value="onSignUpEmailInput"
                  />
                  <!-- Client-side only. What the SERVER says about this address (the
                       409) is in the notice above, with everything else. -->
                  <HelperText
                    v-if="errors.signupEmail && !verifying"
                    id="auth-signup-email-error"
                    :kind="signup.email.trim() ? 'invalid' : 'required'"
                    :label="errors.signupEmail"
                  />
                </div>

                <div class="flex flex-col gap-(--spacing-xs)">
                  <Label
                    for="auth-signup-password"
                    label="Password"
                    required
                  />
                  <FieldPassword
                    v-model="signup.password"
                    input-id="auth-signup-password"
                    name="new-password"
                    autocomplete="new-password"
                    placeholder="Create a password"
                    requirements
                    :disabled="verifying"
                    :required="!!errors.signupPassword && !signup.password"
                    :invalid="!!errors.signupPassword && !!signup.password"
                    :helper-text="verifying ? '' : errors.signupPassword"
                    @update:model-value="errors.signupPassword = ''"
                  />
                </div>
              </fieldset>

              <Button
                label="Sign up"
                kind="primary"
                size="large"
                class="w-full"
                :loading="verifying"
                @click="signUp"
              />
            </form>
          </template>
        </CardBox>
      </Transition>
    </div>

    <!-- On the canvas, outside the card — the way out of the demo, the same place
         the real auth screens put the way out of themselves. -->
    <div
      class="flex w-full max-w-(--container-sm) items-center justify-center gap-(--spacing-xs)"
    >
      <p class="text-body-sm text-(--text-default)">Pattern demo.</p>
      <a
        class="text-link text-body-sm"
        href="/forms"
        @click.prevent="backToForms"
        >Back to Forms</a
      >
    </div>
  </AuthColumn>
</template>
