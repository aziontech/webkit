<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button, { type ButtonVariant } from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { useCardHeight } from './composables/use-card-height'
  import { fillEmail, resolveSignInCopy, type SignInCopy } from './lib/sign-in-copy'
  import { type CardNotice, emailError, newPasswordError, noticeFor } from './lib/sign-in-rules'
  import EmailField from './parts/email-field.vue'
  import LastUsedTag from './parts/last-used-tag.vue'
  import PasswordField from './parts/password-field.vue'
  import SentStep from './parts/sent-step.vue'
  import SignInFooter from './parts/sign-in-footer.vue'
  import SignInFrame from './parts/sign-in-frame.vue'
  import SignInProviders from './parts/sign-in-providers.vue'
  import StepBack from './parts/step-back.vue'

  /** The step the card shows. */
  export type SignInStep = 'email' | 'password' | 'reset' | 'sent' | 'new-password'

  /** An identity provider offered over the email field. */
  export type SignInProvider = 'google' | 'github'

  /** A way to sign in: the email form or an identity provider. */
  export type SignInMethod = 'email' | SignInProvider

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
    /** The method this browser signed in with last time, which carries the Last used tag; empty shows no tag. */
    lastUsed?: SignInMethod | ''
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
    /** Focus the step's field when the screen mounts; turn off when the screen is embedded in a longer page. */
    autofocus?: boolean
  }

  const props = withDefaults(defineProps<SignInProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: '',
    notice: '',
    providersLoading: false,
    lastUsed: '',
    homeHref: '/home',
    docsHref: '/docs',
    signUpHref: '/signup',
    termsHref: 'https://example.com/terms',
    privacyHref: 'https://example.com/privacy',
    autofocus: true
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

  const { locale } = useLocale()
  const copy = computed<SignInCopy>(() => resolveSignInCopy(locale.value))

  const badCredentials = () => props.error === 'bad-credentials'
  const noticeFromProps = () =>
    badCredentials() ? null : noticeFor(props.error, props.notice, copy.value)

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
    password: badCredentials() ? copy.value.badCredentials : '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const cardContentEl = ref<HTMLElement | null>(null)
  const { height: cardHeight, resizing, onTransitionend } = useCardHeight(cardContentEl)

  const heading = computed(() => {
    if (step.value === 'reset') {
      return { title: copy.value.resetTitle, description: copy.value.resetDescription }
    }
    if (step.value === 'new-password')
      return { title: copy.value.newPasswordTitle, description: '' }
    if (step.value === 'sent') {
      return {
        title: copy.value.sentTitle,
        description: fillEmail(copy.value.sentDescription, resetEmail.value)
      }
    }
    return { title: copy.value.title, description: copy.value.description }
  })

  const primaryAction = computed<{ label: string; variant: ButtonVariant }>(() => {
    if (step.value === 'password') return { label: copy.value.signIn, variant: 'primary' }
    if (step.value === 'reset') return { label: copy.value.sendResetLink, variant: 'primary' }
    if (step.value === 'new-password')
      return { label: copy.value.resetPassword, variant: 'primary' }
    if (step.value === 'sent') return { label: copy.value.returnToSignIn, variant: 'secondary' }
    return { label: copy.value.continueWithEmail, variant: 'primary' }
  })

  const focusField = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const showOutcome = () => {
    cardNotice.value = noticeFromProps()
    if (!badCredentials()) return
    password.value = ''
    errors.password = copy.value.badCredentials
    focusField('login-password')
  }

  onMounted(() => {
    if (!props.autofocus) return
    if (step.value === 'email' || step.value === 'password') focusField(`login-${step.value}`)
  })

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
      label: fillEmail(copy.value.resent, resetEmail.value)
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
    errors.password = password.value ? '' : copy.value.passwordRequired
    if (errors.password) {
      focusField('login-password')
      return
    }
    cardNotice.value = null
    emit('submit', event, { email: email.value.trim(), password: password.value })
  }

  const submitEmail = (event: Event) => {
    errors.email = emailError(email.value, copy.value)
    if (errors.email) focusField('login-email')
    else {
      emit('continue', event, email.value.trim())
      step.value = 'password'
      focusField('login-password')
    }
  }

  const submitReset = (event: Event) => {
    errors.resetEmail = emailError(resetEmail.value, copy.value)
    if (errors.resetEmail) focusField('reset-email')
    else {
      emit('reset-request', event, resetEmail.value.trim())
      step.value = 'sent'
    }
  }

  const submitNewPassword = (event: Event) => {
    errors.newPassword = newPasswordError(newPassword.value, copy.value)
    errors.confirmPassword = !confirmPassword.value
      ? copy.value.confirmRequired
      : confirmPassword.value === newPassword.value
        ? ''
        : copy.value.mismatch
    if (errors.newPassword || errors.confirmPassword)
      focusField(errors.newPassword ? 'new-password' : 'confirm-password')
    else {
      email.value = resetEmail.value
      password.value = ''
      returnStep.value = 'password'
      emit('password-reset', event, newPassword.value)
    }
  }

  const stepActions: Record<SignInStep, (event: Event) => void> = {
    email: submitEmail,
    password: signIn,
    reset: submitReset,
    'new-password': submitNewPassword,
    sent: backToSignIn
  }

  const onPrimary = (event: Event) => {
    if (verifying.value) return
    cardNotice.value = null
    stepActions[step.value](event)
  }
</script>

<template>
  <SignInFrame
    :home-href="homeHref"
    :docs-href="docsHref"
    :labels="copy"
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
            @transitionend.self="onTransitionend"
          >
            <form
              ref="cardContentEl"
              class="flex flex-col gap-(--spacing-lg)"
              :aria-label="copy.form"
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
                    :label="copy.retry"
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
                <SignInProviders
                  v-if="step === 'email'"
                  :copy="copy"
                  :loading="providersLoading"
                  :last-used="lastUsed"
                  @provider-click="(event, provider) => emit('provider-click', event, provider)"
                />

                <div v-if="step === 'email'">
                  <EmailField
                    id="login-email"
                    v-model="email"
                    name="email"
                    :label="copy.email"
                    autocomplete="username"
                    :error="errors.email"
                    @update:model-value="errors.email = ''"
                  />
                </div>

                <div
                  v-else-if="step === 'password'"
                  class="flex flex-col gap-(--spacing-lg)"
                >
                  <StepBack
                    :label="copy.changeEmail"
                    :text="email"
                    username
                    @back="backToEmail"
                  />

                  <div class="flex flex-col items-start gap-(--spacing-xs)">
                    <PasswordField
                      id="login-password"
                      v-model="password"
                      class="w-full"
                      name="password"
                      :label="copy.password"
                      autocomplete="current-password"
                      :placeholder="copy.passwordPlaceholder"
                      :error="errors.password"
                      @update:model-value="errors.password = ''"
                    />

                    <Button
                      type="button"
                      :label="copy.forgotPassword"
                      variant="link"
                      @click="forgotPassword"
                    />
                  </div>
                </div>

                <div
                  v-else-if="step === 'reset'"
                  class="flex flex-col gap-(--spacing-lg)"
                >
                  <StepBack
                    :label="copy.backToSignIn"
                    :text="copy.backToSignIn"
                    @back="backToSignIn"
                  />

                  <EmailField
                    id="reset-email"
                    v-model="resetEmail"
                    name="reset-email"
                    :label="copy.email"
                    autocomplete="email"
                    :error="errors.resetEmail"
                    @update:model-value="errors.resetEmail = ''"
                  />
                </div>

                <div
                  v-else-if="step === 'new-password'"
                  class="flex flex-col gap-(--spacing-lg)"
                >
                  <PasswordField
                    id="new-password"
                    v-model="newPassword"
                    name="new-password"
                    :label="copy.newPassword"
                    autocomplete="new-password"
                    :placeholder="copy.newPasswordPlaceholder"
                    :error="errors.newPassword"
                    show-requirements
                    @update:model-value="errors.newPassword = ''"
                  />

                  <PasswordField
                    id="confirm-password"
                    v-model="confirmPassword"
                    name="confirm-password"
                    :label="copy.confirmPassword"
                    autocomplete="new-password"
                    :placeholder="copy.confirmPasswordPlaceholder"
                    :error="errors.confirmPassword"
                    @update:model-value="errors.confirmPassword = ''"
                  />
                </div>

                <SentStep
                  v-else
                  :copy="copy"
                  @resend="resendEmail"
                  @open-reset="openResetLink"
                />
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

                <LastUsedTag
                  v-if="step === 'email' && lastUsed === 'email'"
                  :label="copy.lastUsed"
                />
              </div>
            </form>
          </div>
        </div>
      </template>
    </Card>

    <SignInFooter
      :prompt="copy.noAccount"
      :link-label="copy.signUp"
      :link-href="signUpHref"
      :show-terms="step === 'email' || step === 'password'"
      :terms="copy"
      :terms-href="termsHref"
      :privacy-href="privacyHref"
    />
  </SignInFrame>
</template>
