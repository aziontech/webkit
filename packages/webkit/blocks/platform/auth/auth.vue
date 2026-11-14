<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import Brand from '@aziontech/webkit/brand'
  import Button, { type ButtonKind } from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import Separator from '@aziontech/webkit/separator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onScopeDispose, reactive, ref } from 'vue'

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry?: boolean
  }

  const failure: string = ''
  const failureNotices: Record<string, CardNotice> = {
    'bad-credentials': {
      severity: 'danger',
      label: 'Incorrect email or password. Check both and try again.'
    },
    'service-unavailable': {
      severity: 'warning',
      label: 'Sign-in is unavailable right now. Your credentials are fine.',
      retry: true
    },
    'server-error': {
      severity: 'danger',
      label: 'Sign-in failed on our side. You are still signed out. Error 500.',
      retry: true
    },
    timeout: {
      severity: 'warning',
      label: 'The server did not answer in time. Your session may already be open.',
      retry: true
    }
  }

  const step = ref('email')
  const returnStep = ref('email')
  const email = ref('')
  const password = ref('')
  const resetEmail = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const cardNotice = ref<CardNotice | null>(null)
  const verifying = ref(false)
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const cardContent = ref<HTMLElement | null>(null)
  const cardHeight = ref(0)
  const resizing = ref(false)
  let resizeObserver: ResizeObserver | null = null
  let requestTimer: ReturnType<typeof setTimeout> | undefined

  const onCardResize = ([entry]: ResizeObserverEntry[]) => {
    const next = Math.round(entry.contentRect.height)
    if (cardHeight.value && next !== cardHeight.value) resizing.value = true
    cardHeight.value = next
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined' || !cardContent.value) return
    resizeObserver = new ResizeObserver(onCardResize)
    resizeObserver.observe(cardContent.value)
  })

  onScopeDispose(() => {
    resizeObserver?.disconnect()
    clearTimeout(requestTimer)
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value: string) =>
    !value.trim()
      ? 'This field is required.'
      : emailPattern.test(value.trim())
        ? ''
        : 'Enter a valid email address.'

  const newPasswordError = (value: string) =>
    !value
      ? 'This field is required.'
      : DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(value))
        ? ''
        : 'Password does not meet requirements.'

  const heading = computed(() => {
    if (step.value === 'reset') {
      return {
        title: 'Reset your password',
        description: "Enter the email for your account and we'll send you a link to set a new one."
      }
    }
    if (step.value === 'new-password') return { title: 'Reset password', description: '' }
    if (step.value === 'sent') {
      return {
        title: 'Check your inbox',
        description: `We sent a reset link to ${resetEmail.value}. Check your inbox or spam folder and follow the instructions.`
      }
    }
    return { title: 'Welcome back', description: 'Sign in to your account.' }
  })

  const primaryAction = computed<{ label: string; kind: ButtonKind }>(() => {
    if (step.value === 'password') return { label: 'Sign in', kind: 'primary' }
    if (step.value === 'reset') return { label: 'Send reset link', kind: 'primary' }
    if (step.value === 'new-password') return { label: 'Reset password', kind: 'primary' }
    if (step.value === 'sent') return { label: 'Return to sign in', kind: 'secondary' }
    return { label: 'Continue with email', kind: 'primary' }
  })

  const focusField = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const request = (done: () => void) => {
    verifying.value = true
    clearTimeout(requestTimer)
    requestTimer = setTimeout(() => {
      verifying.value = false
      done()
    }, 600)
  }

  const backToEmail = () => {
    cardNotice.value = null
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const forgotPassword = () => {
    cardNotice.value = null
    returnStep.value = step.value === 'password' ? 'password' : 'email'
    resetEmail.value = email.value
    errors.resetEmail = ''
    step.value = 'reset'
  }

  const backToSignIn = () => {
    cardNotice.value = null
    step.value = returnStep.value
  }

  const resendEmail = () => {
    request(() => {
      cardNotice.value = {
        severity: 'success',
        label: `We sent another link to ${resetEmail.value}.`
      }
    })
  }

  const openResetLink = () => {
    cardNotice.value = null
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const signIn = () => {
    errors.password = password.value ? '' : 'This field is required.'
    if (errors.password) {
      focusField('login-password')
      return
    }
    request(() => {
      cardNotice.value = failureNotices[failure] ?? { severity: 'success', label: 'Signed in.' }
    })
  }

  const handlePrimary = () => {
    if (verifying.value) return
    cardNotice.value = null
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (errors.email) focusField('login-email')
      else request(() => (step.value = 'password'))
    } else if (step.value === 'password') signIn()
    else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (errors.resetEmail) focusField('reset-email')
      else request(() => (step.value = 'sent'))
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? 'This field is required.'
        : confirmPassword.value === newPassword.value
          ? ''
          : "Passwords don't match."
      if (errors.newPassword || errors.confirmPassword)
        focusField(errors.newPassword ? 'new-password' : 'confirm-password')
      else
        request(() => {
          email.value = resetEmail.value
          password.value = ''
          returnStep.value = 'password'
          step.value = 'password'
          cardNotice.value = {
            severity: 'success',
            label: 'Password updated. Sign in with the new one.'
          }
        })
    } else backToSignIn()
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
          <div
            class="m-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none"
          >
            <Card
              class="w-full max-w-(--container-sm)"
              :padded="false"
            >
              <template #content>
                <div class="p-(--spacing-lg)">
                  <div
                    :style="cardHeight ? { height: `${cardHeight}px` } : undefined"
                    :data-resizing="resizing || null"
                    class="transition-[height] duration-moderate-02 ease-productive-entrance motion-safe:data-resizing:overflow-hidden motion-reduce:transition-none"
                    @transitionend.self="resizing = false"
                  >
                    <form
                      ref="cardContent"
                      class="flex flex-col gap-(--spacing-lg)"
                      aria-label="Sign in to your account"
                      :aria-busy="verifying || undefined"
                      novalidate
                      @submit.prevent="handlePrimary"
                    >
                      <PageHeader
                        :title="heading.title"
                        :description="heading.description"
                        size="small"
                      />

                      <Alert
                        v-if="cardNotice"
                        :key="cardNotice.label"
                        :severity="cardNotice.severity"
                        size="small"
                        :label="cardNotice.label"
                      >
                        <template
                          v-if="cardNotice.retry"
                          #action
                        >
                          <Button
                            label="Retry"
                            kind="secondary"
                            size="small"
                            :loading="verifying"
                            @click="signIn"
                          />
                        </template>
                      </Alert>

                      <fieldset
                        class="m-0 flex min-w-0 flex-col border-0 p-0"
                        :disabled="verifying"
                      >
                        <legend class="sr-only">{{ heading.title }}</legend>
                        <div
                          v-if="step === 'email'"
                          class="flex flex-col gap-(--spacing-lg) pb-(--spacing-lg)"
                        >
                          <div class="flex flex-col gap-(--spacing-sm)">
                            <Button
                              type="button"
                              label="Continue with Google"
                              kind="outlined"
                              size="large"
                              icon="ai-cor ai-google"
                              class="w-full"
                            />
                            <Button
                              type="button"
                              label="Continue with GitHub"
                              kind="outlined"
                              size="large"
                              icon="ai ai-github"
                              class="w-full"
                            />
                          </div>

                          <Separator label="or" />
                        </div>

                        <div v-if="step === 'email'">
                          <Field :required="!!errors.email && !email.trim()">
                            <Field.Label for="login-email">Email</Field.Label>
                            <Input
                              id="login-email"
                              v-model="email"
                              type="email"
                              name="email"
                              size="large"
                              autocomplete="username"
                              class="w-full"
                              placeholder="m@example.com"
                              :required="!!errors.email && !email.trim()"
                              :invalid="!!errors.email && !!email.trim()"
                              :aria-describedby="errors.email ? 'login-email-error' : undefined"
                              @update:model-value="errors.email = ''"
                            />
                            <HelperText
                              v-if="errors.email"
                              id="login-email-error"
                              :kind="email.trim() ? 'invalid' : 'required'"
                              :label="errors.email"
                            />
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip text="Change email">
                              <IconButton
                                icon="pi pi-chevron-left"
                                aria-label="Change email"
                                kind="outlined"
                                size="small"
                                @click="backToEmail"
                              />
                            </Tooltip>
                            <span class="truncate text-label-sm text-(--text-default)">{{
                              email
                            }}</span>
                          </div>

                          <div class="flex flex-col items-start gap-(--spacing-xs)">
                            <Field
                              class="w-full"
                              :required="!!errors.password && !password"
                              :invalid="!!errors.password && !!password"
                            >
                              <Field.Label for="login-password">Password</Field.Label>
                              <PasswordInput
                                id="login-password"
                                v-model="password"
                                name="password"
                                autocomplete="current-password"
                                placeholder="Type your password"
                                @update:model-value="errors.password = ''"
                              />
                              <Field.Error v-if="errors.password">{{
                                errors.password
                              }}</Field.Error>
                            </Field>

                            <Button
                              type="button"
                              label="Forgot your password?"
                              kind="link"
                              @click="forgotPassword"
                            />
                          </div>
                        </div>

                        <div
                          v-else-if="step === 'reset'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip text="Back to sign in">
                              <IconButton
                                icon="pi pi-chevron-left"
                                aria-label="Back to sign in"
                                kind="outlined"
                                size="small"
                                @click="backToSignIn"
                              />
                            </Tooltip>
                            <span class="truncate text-label-sm text-(--text-default)"
                              >Back to sign in</span
                            >
                          </div>

                          <Field :required="!!errors.resetEmail && !resetEmail.trim()">
                            <Field.Label for="reset-email">Email</Field.Label>
                            <Input
                              id="reset-email"
                              v-model="resetEmail"
                              type="email"
                              name="reset-email"
                              size="large"
                              autocomplete="email"
                              class="w-full"
                              placeholder="m@example.com"
                              :required="!!errors.resetEmail && !resetEmail.trim()"
                              :invalid="!!errors.resetEmail && !!resetEmail.trim()"
                              :aria-describedby="
                                errors.resetEmail ? 'reset-email-error' : undefined
                              "
                              @update:model-value="errors.resetEmail = ''"
                            />
                            <HelperText
                              v-if="errors.resetEmail"
                              id="reset-email-error"
                              :kind="resetEmail.trim() ? 'invalid' : 'required'"
                              :label="errors.resetEmail"
                            />
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'new-password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <Field
                            :required="!!errors.newPassword && !newPassword"
                            :invalid="!!errors.newPassword && !!newPassword"
                          >
                            <Field.Label for="new-password">New password</Field.Label>
                            <PasswordInput
                              id="new-password"
                              v-model="newPassword"
                              name="new-password"
                              autocomplete="new-password"
                              placeholder="Enter a new password"
                              @update:model-value="errors.newPassword = ''"
                            />
                            <Field.Error v-if="errors.newPassword">{{
                              errors.newPassword
                            }}</Field.Error>
                            <PasswordRequirements :value="newPassword" />
                          </Field>

                          <Field
                            :required="!!errors.confirmPassword && !confirmPassword"
                            :invalid="!!errors.confirmPassword && !!confirmPassword"
                          >
                            <Field.Label for="confirm-password">Confirm password</Field.Label>
                            <PasswordInput
                              id="confirm-password"
                              v-model="confirmPassword"
                              name="confirm-password"
                              autocomplete="new-password"
                              placeholder="Repeat the new password"
                              @update:model-value="errors.confirmPassword = ''"
                            />
                            <Field.Error v-if="errors.confirmPassword">{{
                              errors.confirmPassword
                            }}</Field.Error>
                          </Field>
                        </div>

                        <div
                          v-else
                          class="flex flex-col gap-(--spacing-xs)"
                        >
                          <div class="flex items-center gap-(--spacing-xs)">
                            <p class="text-body-sm text-(--text-default)">
                              Didn't receive the email?
                            </p>
                            <Button
                              type="button"
                              label="Resend email"
                              kind="link"
                              @click="resendEmail"
                            />
                          </div>
                          <div class="flex items-center gap-(--spacing-xs)">
                            <p class="text-body-sm text-(--text-default)">Already opened it?</p>
                            <Button
                              type="button"
                              label="Set a new password"
                              kind="link"
                              @click="openResetLink"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <div class="relative">
                        <Button
                          :label="primaryAction.label"
                          :kind="primaryAction.kind"
                          size="large"
                          class="w-full"
                          type="submit"
                          :loading="verifying"
                        />

                        <div
                          v-if="step === 'email'"
                          class="absolute end-(--spacing-sm) top-0 -translate-y-1/2"
                        >
                          <Tag
                            label="Last used"
                            severity="info"
                            size="small"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </template>
            </Card>

            <div
              class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
            >
              <div class="flex items-center justify-center gap-(--spacing-xs)">
                <p class="text-body-xs text-(--text-default)">Don't have an account?</p>
                <a
                  class="text-link text-body-xs"
                  href="/signup"
                  >Sign up</a
                >
              </div>

              <template v-if="step === 'email' || step === 'password'">
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
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
