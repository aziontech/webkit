<script setup>
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

  const signin = reactive({ email: 'myemail@azion.com', password: '' })
  const signup = reactive({ email: 'myemail@azion.com', password: '' })

  const errors = reactive({
    signinEmail: '',
    signinPassword: '',
    signupEmail: '',
    signupPassword: ''
  })

  const cardNotice = ref(null)

  const verifying = ref(false)

  const screenOptions = computed(() => [
    { label: 'Sign in', value: 'signin', disabled: verifying.value },
    { label: 'Sign up', value: 'signup', disabled: verifying.value }
  ])

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

  const REQUEST_MS = 900
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

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value) =>
    !value.trim()
      ? 'This field is required.'
      : emailPattern.test(value.trim())
        ? ''
        : 'Enter a valid email address.'

  const passwordMeetsRequirements = (value) =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
      typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
    )

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

  const onSignUpEmailInput = () => {
    errors.signupEmail = ''
    if (cardNotice.value?.exits) cardNotice.value = null
  }

  const focusSignInPassword = () =>
    globalThis.document.getElementById('auth-signin-password')?.focus()

  const signIn = async () => {
    if (verifying.value) return
    if (!validateSignIn()) return

    cardNotice.value = null
    verifying.value = true
    let clearedPassword = false

    try {
      await authRequest('signin')
      cardNotice.value = { severity: 'success', label: 'Signed in.' }
    } catch (error) {
      if (error?.code === 'bad-credentials') {
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
      verifying.value = false
    }

    if (clearedPassword) {
      await nextTick()
      focusSignInPassword()
    }
  }

  const focusSignUpEmail = () => globalThis.document.getElementById('auth-signup-email')?.focus()

  const signUp = async () => {
    if (verifying.value) return
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
        cardNotice.value = {
          severity: 'danger',
          label: 'This email is already registered.',
          exits: true
        }
      } else if (error?.code === 'timeout') {
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
      verifying.value = false
    }

    if (cardNotice.value?.exits) {
      await nextTick()
      focusSignUpEmail()
    }
  }

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

    <div class="relative w-full max-w-(--container-sm)">
      <Transition
        enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="absolute inset-x-0 top-0 transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
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
              </header>

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
