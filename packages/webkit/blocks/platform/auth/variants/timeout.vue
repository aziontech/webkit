<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldPassword from '@aziontech/webkit/field-password'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import { reactive, ref } from 'vue'

  const failure = ref('timeout')
  const screen = ref('signin')

  const signin = reactive({ email: 'name@example.com', password: '' })
  const signup = reactive({ email: 'name@example.com', password: '' })

  const errors = reactive({
    signinEmail: '',
    signinPassword: '',
    signupEmail: '',
    signupPassword: ''
  })

  const cardNotice = ref(null)
  const verifying = ref(false)

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

  const signIn = () => {
    errors.signinEmail = emailError(signin.email)
    errors.signinPassword = signin.password ? '' : 'This field is required.'
    if (errors.signinEmail || errors.signinPassword) return
    if (failure.value === 'bad-credentials') {
      cardNotice.value = {
        severity: 'danger',
        label: 'Incorrect email or password. Check both and try again.'
      }
      signin.password = ''
    } else if (failure.value === 'service-unavailable')
      cardNotice.value = {
        severity: 'warning',
        label: 'Sign-in is unavailable right now. Your credentials are fine.',
        retry: signIn
      }
    else if (failure.value === 'server-error')
      cardNotice.value = {
        severity: 'danger',
        label: 'Sign-in failed on our side. You are still signed out. Error 500.',
        retry: signIn
      }
    else if (failure.value === 'timeout')
      cardNotice.value = {
        severity: 'warning',
        label: 'The server did not answer in time. Your session may already be open.',
        retry: signIn
      }
    else cardNotice.value = { severity: 'success', label: 'Signed in.' }
  }

  const signUp = () => {
    errors.signupEmail = emailError(signup.email)
    errors.signupPassword = !signup.password
      ? 'This field is required.'
      : passwordMeetsRequirements(signup.password)
        ? ''
        : 'Password does not meet requirements.'
    if (errors.signupEmail || errors.signupPassword) return
    if (failure.value === 'email-taken')
      cardNotice.value = {
        severity: 'danger',
        label: 'This email is already registered.',
        exits: true
      }
    else
      cardNotice.value = {
        severity: 'success',
        label: `Account created. We sent a verification link to ${signup.email.trim()}.`
      }
  }

  const onSignUpEmailInput = () => {
    errors.signupEmail = ''
    if (cardNotice.value?.exits) cardNotice.value = null
  }

  const goToSignIn = () => {
    signin.email = signup.email
    failure.value = ''
    cardNotice.value = null
    screen.value = 'signin'
  }

  cardNotice.value = {
    severity: 'warning',
    label: 'The server did not answer in time. Your session may already be open.',
    retry: signIn
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
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
                                @click.prevent
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
                            :required="!!errors.signinEmail && !signin.email.trim()"
                          />
                          <InputText
                            id="auth-signin-email"
                            v-model="signin.email"
                            type="email"
                            size="large"
                            name="email"
                            autocomplete="username"
                            class="w-full"
                            placeholder="name@example.com"
                            :disabled="verifying"
                            :required="!!errors.signinEmail && !signin.email.trim()"
                            :invalid="!!errors.signinEmail && !!signin.email.trim()"
                            :aria-describedby="
                              errors.signinEmail && !verifying
                                ? 'auth-signin-email-error'
                                : undefined
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

                        <FieldPassword
                          v-model="signin.password"
                          input-id="auth-signin-password"
                          name="password"
                          label="Password"
                          autocomplete="current-password"
                          placeholder="Type your password"
                          :disabled="verifying"
                          :required="!!errors.signinPassword && !signin.password"
                          :invalid="!!errors.signinPassword && !!signin.password"
                          :helper-text="verifying ? '' : errors.signinPassword"
                          @update:model-value="errors.signinPassword = ''"
                        />
                      </fieldset>

                      <Button
                        label="Sign in"
                        kind="primary"
                        size="large"
                        class="w-full"
                        :loading="verifying"
                        type="submit"
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
                                @click.prevent
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
                            :required="!!errors.signupEmail && !signup.email.trim()"
                          />
                          <InputText
                            id="auth-signup-email"
                            v-model="signup.email"
                            type="email"
                            size="large"
                            name="email"
                            autocomplete="email"
                            class="w-full"
                            placeholder="name@example.com"
                            :disabled="verifying"
                            :required="!!errors.signupEmail && !signup.email.trim()"
                            :invalid="!!errors.signupEmail && !!signup.email.trim()"
                            :aria-describedby="
                              errors.signupEmail && !verifying
                                ? 'auth-signup-email-error'
                                : undefined
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

                        <FieldPassword
                          v-model="signup.password"
                          input-id="auth-signup-password"
                          name="new-password"
                          label="Password"
                          autocomplete="new-password"
                          placeholder="Create a password"
                          requirements
                          :disabled="verifying"
                          :required="!!errors.signupPassword && !signup.password"
                          :invalid="!!errors.signupPassword && !!signup.password"
                          :helper-text="verifying ? '' : errors.signupPassword"
                          @update:model-value="errors.signupPassword = ''"
                        />
                      </fieldset>

                      <Button
                        label="Sign up"
                        kind="primary"
                        size="large"
                        class="w-full"
                        :loading="verifying"
                        type="submit"
                      />
                    </form>
                  </template>
                </CardBox>
              </Transition>
            </div>

            <div
              class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
            >
              <div
                v-if="screen === 'signin'"
                class="flex items-center justify-center gap-(--spacing-xs)"
              >
                <p class="text-body-xs text-(--text-default)">Don't have an account?</p>
                <a
                  class="text-link text-body-xs"
                  href="/signup"
                  >Sign up</a
                >
              </div>
              <div
                v-else
                class="flex items-center justify-center gap-(--spacing-xs)"
              >
                <p class="text-body-xs text-(--text-default)">Already have an account?</p>
                <a
                  class="text-link text-body-xs"
                  href="/login"
                  >Sign in</a
                >
              </div>

              <p class="text-center text-body-xs text-(--text-muted)">
                By continuing, I agree to the
                <a
                  class="text-link"
                  href="https://example.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  >terms of service</a
                >
                and
                <a
                  class="text-link"
                  href="https://example.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  >privacy policy</a
                >.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
