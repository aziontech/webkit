<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button, { type ButtonVariant } from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import Separator from '@aziontech/webkit/separator'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onScopeDispose, reactive, ref, watch } from 'vue'

  /** The step the card shows. */
  export type SignInStep = 'email' | 'password' | 'reset' | 'sent' | 'new-password'

  /** An identity provider offered over the email field. */
  export type SignInProvider = 'google' | 'github'

  /** A sign-in failure with its own copy, severity and Retry rule. */
  export type SignInFailure = 'bad-credentials' | 'service-unavailable' | 'server-error' | 'timeout'

  /** A neutral or success outcome with its own copy. */
  export type SignInNoticeKind = 'session-expired' | 'signed-in' | 'password-updated'

  /** The credentials the form sends. */
  export interface SignInValues {
    /** The account email. */
    email: string
    /** The account password. */
    password: string
  }

  export interface SignInProps {
    /** Values the fields open on, such as the email of an expired session. */
    defaultValues?: Partial<SignInValues>
    /** A request is in flight: the step locks, the form is busy and the primary action spins. */
    loading?: boolean
    /** Why the last request failed: a failure kind with its own copy, or a message shown as a danger notice with Retry. */
    error?: SignInFailure | (string & {})
    /** A non-error outcome for the notice: a notice kind with its own copy, or a message shown as info. */
    notice?: SignInNoticeKind | (string & {})
    /** The identity providers are still loading; skeleton bars hold their place. */
    providersLoading?: boolean
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
    /** Where the Sign up link leads. */
    signUpHref?: string
    /** The terms of service page. */
    termsHref?: string
    /** The privacy policy page. */
    privacyHref?: string
  }

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry?: boolean
  }

  const props = withDefaults(defineProps<SignInProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: '',
    notice: '',
    providersLoading: false,
    homeHref: '/home',
    docsHref: '/docs',
    signUpHref: '/signup',
    termsHref: 'https://example.com/terms',
    privacyHref: 'https://example.com/privacy'
  })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
    continue: [event: Event, email: string]
    submit: [event: Event, values: SignInValues]
    'reset-request': [event: Event, email: string]
    resend: [event: MouseEvent, email: string]
    'password-reset': [event: Event, password: string]
  }>()

  const step = defineModel<SignInStep>('step', { default: 'email' })

  const failureNotices: Record<SignInFailure, CardNotice> = {
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

  const outcomeNotices: Record<SignInNoticeKind, CardNotice> = {
    'session-expired': {
      severity: 'info',
      label: 'Your session expired. Sign in again to pick up where you left off.'
    },
    'signed-in': { severity: 'success', label: 'Signed in.' },
    'password-updated': {
      severity: 'success',
      label: 'Password updated. Sign in with the new one.'
    }
  }

  const noticeFromProps = (): CardNotice | null => {
    if (props.error) {
      return (
        failureNotices[props.error as SignInFailure] ?? {
          severity: 'danger',
          label: props.error,
          retry: true
        }
      )
    }
    if (props.notice) {
      return (
        outcomeNotices[props.notice as SignInNoticeKind] ?? {
          severity: 'info',
          label: props.notice
        }
      )
    }
    return null
  }

  const returnStep = ref<SignInStep>('email')
  const email = ref(props.defaultValues.email ?? '')
  const password = ref(props.defaultValues.password ?? '')
  const resetEmail = ref(props.defaultValues.email ?? '')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const cardNotice = ref<CardNotice | null>(noticeFromProps())
  const verifying = computed(() => props.loading)
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const cardContentEl = ref<HTMLElement | null>(null)
  const cardHeight = ref(0)
  const resizing = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const onCardResize = ([entry]: ResizeObserverEntry[]) => {
    const next = Math.round(entry.contentRect.height)
    if (cardHeight.value && next !== cardHeight.value) resizing.value = true
    cardHeight.value = next
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined' || !cardContentEl.value) return
    resizeObserver = new ResizeObserver(onCardResize)
    resizeObserver.observe(cardContentEl.value)
  })

  onScopeDispose(() => {
    resizeObserver?.disconnect()
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

  const primaryAction = computed<{ label: string; variant: ButtonVariant }>(() => {
    if (step.value === 'password') return { label: 'Sign in', variant: 'primary' }
    if (step.value === 'reset') return { label: 'Send reset link', variant: 'primary' }
    if (step.value === 'new-password') return { label: 'Reset password', variant: 'primary' }
    if (step.value === 'sent') return { label: 'Return to sign in', variant: 'secondary' }
    return { label: 'Continue with email', variant: 'primary' }
  })

  const focusField = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const showOutcome = () => {
    cardNotice.value = noticeFromProps()
    if (props.error === 'bad-credentials') {
      password.value = ''
      focusField('login-password')
    }
  }

  watch([() => props.error, () => props.notice], showOutcome)
  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) showOutcome()
    }
  )

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

  const resendEmail = (event: MouseEvent) => {
    emit('resend', event, resetEmail.value)
    cardNotice.value = {
      severity: 'success',
      label: `We sent another link to ${resetEmail.value}.`
    }
  }

  const openResetLink = () => {
    cardNotice.value = null
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const signIn = (event: Event) => {
    errors.password = password.value ? '' : 'This field is required.'
    if (errors.password) {
      focusField('login-password')
      return
    }
    cardNotice.value = null
    emit('submit', event, { email: email.value.trim(), password: password.value })
  }

  const onPrimary = (event: Event) => {
    if (verifying.value) return
    cardNotice.value = null
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (errors.email) focusField('login-email')
      else {
        emit('continue', event, email.value.trim())
        step.value = 'password'
      }
    } else if (step.value === 'password') signIn(event)
    else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (errors.resetEmail) focusField('reset-email')
      else {
        emit('reset-request', event, resetEmail.value.trim())
        step.value = 'sent'
      }
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? 'This field is required.'
        : confirmPassword.value === newPassword.value
          ? ''
          : "Passwords don't match."
      if (errors.newPassword || errors.confirmPassword)
        focusField(errors.newPassword ? 'new-password' : 'confirm-password')
      else {
        email.value = resetEmail.value
        password.value = ''
        returnStep.value = 'password'
        emit('password-reset', event, newPassword.value)
      }
    } else backToSignIn()
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand>
        <a
          :href="homeHref"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            variant="default"
            size="small"
          />
        </a>
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          :href="docsHref"
        />
      </AppHeader.End>
    </AppHeader>

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
              <template #default>
                <div class="p-(--spacing-lg)">
                  <div
                    :style="cardHeight ? { height: `${cardHeight}px` } : undefined"
                    :data-resizing="resizing || null"
                    class="transition-[height] duration-moderate-02 ease-productive-entrance motion-safe:data-resizing:overflow-hidden motion-reduce:transition-none"
                    @transitionend.self="resizing = false"
                  >
                    <form
                      ref="cardContentEl"
                      class="flex flex-col gap-(--spacing-lg)"
                      aria-label="Sign in to your account"
                      :aria-busy="verifying || undefined"
                      novalidate
                      @submit.prevent="onPrimary"
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
                          #actions
                        >
                          <Button
                            label="Retry"
                            variant="secondary"
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
                          <div
                            v-if="providersLoading"
                            role="status"
                            aria-label="Preparing sign-in providers"
                            class="flex flex-col gap-(--spacing-sm)"
                          >
                            <Skeleton height="2.5rem" />
                            <Skeleton height="2.5rem" />
                          </div>
                          <div
                            v-else
                            class="flex flex-col gap-(--spacing-sm)"
                          >
                            <Button
                              type="button"
                              label="Continue with Google"
                              variant="outline"
                              size="large"
                              icon="az-color az-google"
                              class="w-full"
                              @click="
                                (event: MouseEvent) => emit('provider-click', event, 'google')
                              "
                            />
                            <Button
                              type="button"
                              label="Continue with GitHub"
                              variant="outline"
                              size="large"
                              icon="az az-github"
                              class="w-full"
                              @click="
                                (event: MouseEvent) => emit('provider-click', event, 'github')
                              "
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
                            <FieldError
                              v-if="errors.email"
                              id="login-email-error"
                              >{{ errors.email }}</FieldError
                            >
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip content="Change email">
                              <IconButton
                                icon="az az-chevron-left"
                                aria-label="Change email"
                                variant="outline"
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
                              variant="link"
                              @click="forgotPassword"
                            />
                          </div>
                        </div>

                        <div
                          v-else-if="step === 'reset'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip content="Back to sign in">
                              <IconButton
                                icon="az az-chevron-left"
                                aria-label="Back to sign in"
                                variant="outline"
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
                            <FieldError
                              v-if="errors.resetEmail"
                              id="reset-email-error"
                              >{{ errors.resetEmail }}</FieldError
                            >
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
                              variant="link"
                              @click="resendEmail"
                            />
                          </div>
                          <div class="flex items-center gap-(--spacing-xs)">
                            <p class="text-body-sm text-(--text-default)">Already opened it?</p>
                            <Button
                              type="button"
                              label="Set a new password"
                              variant="link"
                              @click="openResetLink"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <div class="relative">
                        <Button
                          :label="primaryAction.label"
                          :variant="primaryAction.variant"
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
                  :href="signUpHref"
                  >Sign up</a
                >
              </div>

              <template v-if="step === 'email' || step === 'password'">
                <p class="text-center text-body-xs text-(--text-muted)">
                  By continuing, I agree to the
                  <a
                    class="text-link"
                    :href="termsHref"
                    target="_blank"
                    rel="noopener noreferrer"
                    >terms of service</a
                  >
                  and
                  <a
                    class="text-link"
                    :href="privacyHref"
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
