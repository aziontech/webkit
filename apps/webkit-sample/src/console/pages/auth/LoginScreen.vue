<script setup>
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import FieldPassword from '@aziontech/webkit/field-password'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AuthColumn from '../../components/auth/AuthColumn.vue'
  import { startSession } from '../../lib/state/session'

  const step = ref('email')
  const email = ref('')
  const password = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const resetEmail = ref('')
  const returnStep = ref('email')
  const verifying = ref(false)
  const resending = ref(false)

  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const router = useRouter()
  const route = useRoute()

  const expiredNotice = ref(Boolean(route.query.expired))

  const expiredEmail = String(route.query.expired ? route.query.email || '' : '')
  if (expiredEmail) {
    email.value = expiredEmail
    step.value = 'password'
  }

  const afterSignIn = () => {
    const target = String(route.query.redirect || '')
    if (!target.startsWith('/') || target.startsWith('//')) {
      return { name: 'home', query: { email: email.value } }
    }
    const [path, search] = target.split('?')
    const query = Object.fromEntries(new URLSearchParams(search || ''))
    return { path, query: { ...query, email: email.value } }
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

  const validateEmailStep = () => {
    errors.email = emailError(email.value)
    return !errors.email
  }

  const validatePasswordStep = () => {
    errors.password = password.value ? '' : 'This field is required.'
    return !errors.password
  }

  const validateResetStep = () => {
    errors.resetEmail = emailError(resetEmail.value)
    return !errors.resetEmail
  }

  const validateNewPasswordStep = () => {
    errors.newPassword = !newPassword.value
      ? 'This field is required.'
      : passwordMeetsRequirements(newPassword.value)
        ? ''
        : 'Password does not meet requirements.'
    errors.confirmPassword = !confirmPassword.value
      ? 'This field is required.'
      : confirmPassword.value === newPassword.value
        ? ''
        : "Passwords don't match."
    return !errors.newPassword && !errors.confirmPassword
  }

  const heading = computed(() => {
    if (step.value === 'reset') {
      return {
        key: 'reset',
        title: 'Reset your password',
        description: "Enter the email for your account and we'll send you a link to set a new one."
      }
    }
    if (step.value === 'new-password') {
      return {
        key: 'new-password',
        title: 'Reset password',
        description: ''
      }
    }
    if (step.value === 'sent') {
      return {
        key: 'sent',
        title: 'Check your inbox',
        description: `We sent a reset link to ${resetEmail.value}. Check your inbox or spam folder and follow the instructions.`
      }
    }
    return {
      key: 'signin',
      title: 'Welcome back',
      description: 'Sign in to your account.'
    }
  })

  const primaryAction = computed(() => {
    if (step.value === 'password') return { label: 'Sign in', kind: 'primary' }
    if (step.value === 'reset') return { label: 'Send reset link', kind: 'primary' }
    if (step.value === 'new-password') return { label: 'Reset password', kind: 'primary' }
    if (step.value === 'sent') return { label: 'Return to sign in', kind: 'secondary' }
    return { label: 'Continue with email', kind: 'primary' }
  })

  const stepTransitionStyle = {
    transition: `opacity ${duration['moderate-02']} ${curve['productive-entrance']}, transform ${duration['fast-02']} ${curve['productive-entrance']}`
  }

  const identityTransitionStyle = {
    transition: `opacity ${duration['moderate-01']} ${curve['productive-entrance']} ${duration['fast-02']}, transform ${duration['moderate-01']} ${curve['productive-entrance']} ${duration['fast-02']}`
  }

  const fadeTransitionStyle = {
    transition: `opacity ${duration['moderate-01']} ${curve['productive-entrance']}`
  }

  const cardContent = ref(null)
  const cardHeight = ref(0)

  const resizing = ref(false)
  const HEIGHT_MS = Number.parseInt(duration['moderate-02'], 10)
  const CLIP_SLACK_MS = Number.parseInt(duration['fast-01'], 10)

  const providersReady = ref(false)
  const probeProviders = () => new Promise((resolve) => setTimeout(resolve, 1100))

  let resizeObserver = null
  let clipTimer = null

  watch([step, providersReady, expiredNotice], () => {
    resizing.value = true
    clearTimeout(clipTimer)
    clipTimer = setTimeout(() => {
      resizing.value = false
    }, HEIGHT_MS + CLIP_SLACK_MS)
  })

  onMounted(async () => {
    if ('ResizeObserver' in window && cardContent.value) {
      resizeObserver = new ResizeObserver(([entry]) => {
        cardHeight.value = Math.round(entry.contentRect.height)
      })
      resizeObserver.observe(cardContent.value)
    }

    await probeProviders()
    providersReady.value = true
  })

  onBeforeUnmount(() => {
    clearTimeout(clipTimer)
    clipTimer = null
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  const lookupEmail = () => new Promise((resolve) => setTimeout(resolve, 900))
  const authenticate = (secret) =>
    new Promise((resolve, reject) =>
      setTimeout(
        () => (secret === 'fail' ? reject(new Error('Invalid email or password.')) : resolve()),
        900
      )
    )

  const goToPassword = async () => {
    if (verifying.value) return
    if (!validateEmailStep()) return
    verifying.value = true
    try {
      await lookupEmail()
      step.value = 'password'
    } catch (error) {
      toast.error("Couldn't verify that email.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => goToPassword() }
      })
    } finally {
      verifying.value = false
    }
  }

  const backToEmail = () => {
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const signIn = async () => {
    if (verifying.value) return
    if (!validatePasswordStep()) return
    verifying.value = true
    try {
      await authenticate(password.value)
      startSession(email.value)
      router.push(afterSignIn())
    } catch (error) {
      toast.error('Sign-in failed.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => signIn() }
      })
    } finally {
      verifying.value = false
    }
  }

  const requestReset = () => new Promise((resolve) => setTimeout(resolve, 900))

  const forgotPassword = () => {
    if (verifying.value) return
    expiredNotice.value = false
    returnStep.value = step.value === 'password' ? 'password' : 'email'
    resetEmail.value = email.value
    errors.resetEmail = ''
    step.value = 'reset'
  }

  const backToSignIn = () => {
    step.value = returnStep.value
  }

  const sendReset = async () => {
    if (verifying.value) return
    if (!validateResetStep()) return
    verifying.value = true
    try {
      await requestReset()
      step.value = 'sent'
    } catch (error) {
      toast.error("Couldn't send the reset link.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => sendReset() }
      })
    } finally {
      verifying.value = false
    }
  }

  const openResetLink = () => {
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const saveNewPassword = () => new Promise((resolve) => setTimeout(resolve, 900))

  const resetPassword = async () => {
    if (verifying.value) return
    if (!validateNewPasswordStep()) return
    verifying.value = true
    try {
      await saveNewPassword()
      email.value = resetEmail.value
      password.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      errors.password = ''
      returnStep.value = 'password'
      step.value = 'password'
      toast.success('Password updated.', {
        description: 'Sign in with your new password.'
      })
    } catch (error) {
      toast.error("Couldn't update your password.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => resetPassword() }
      })
    } finally {
      verifying.value = false
    }
  }

  const resendReset = async () => {
    if (resending.value) return
    resending.value = true
    try {
      await requestReset()
      toast.success('Reset link sent.', {
        description: `We sent another email to ${resetEmail.value}.`
      })
    } catch (error) {
      toast.error("Couldn't resend the email.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => resendReset() }
      })
    } finally {
      resending.value = false
    }
  }

  const handlePrimary = () => {
    expiredNotice.value = false
    if (step.value === 'email') goToPassword()
    else if (step.value === 'password') signIn()
    else if (step.value === 'reset') sendReset()
    else if (step.value === 'new-password') resetPassword()
    else backToSignIn()
  }

  const goToSignUp = () => router.push({ name: 'signup' })
</script>

<template>
  <AuthColumn>
    <CardBox
      class="w-full max-w-(--container-sm)"
      :padded="false"
    >
      <template #content>
        <div class="p-(--spacing-lg)">
          <div
            :style="cardHeight ? { height: `${cardHeight}px` } : undefined"
            :data-resizing="resizing || null"
            class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
          >
            <form
              ref="cardContent"
              class="flex flex-col gap-(--spacing-lg)"
              aria-label="Sign in to your account"
              novalidate
              @submit.prevent="handlePrimary"
            >
              <button
                type="submit"
                class="sr-only"
                aria-hidden="true"
                tabindex="-1"
              />

              <div class="relative">
                <Transition
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                  leave-active-class="absolute inset-x-0 top-0"
                >
                  <header
                    :key="heading.key"
                    :style="fadeTransitionStyle"
                    class="flex flex-col gap-(--spacing-xxs) motion-reduce:transition-none"
                  >
                    <h1 class="text-heading-sm text-(--text-default)">
                      {{ heading.title }}
                    </h1>
                    <p
                      v-if="heading.description"
                      class="text-body-sm text-(--text-muted)"
                    >
                      {{ heading.description }}
                    </p>
                  </header>
                </Transition>
              </div>

              <Transition
                leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-2 opacity-0"
              >
                <div v-if="expiredNotice">
                  <Message
                    severity="info"
                    size="small"
                    label="Your session expired. Sign in again to pick up where you left off."
                  />
                </div>
              </Transition>

              <div class="relative">
                <Transition
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                  leave-active-class="absolute inset-x-0 top-0"
                >
                  <div
                    v-if="step === 'email'"
                    key="email"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-(--spacing-xs) motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <Label
                      for="login-email"
                      label="Email"
                      required
                    />
                    <InputText
                      id="login-email"
                      v-model="email"
                      type="email"
                      size="large"
                      name="email"
                      autocomplete="email"
                      class="w-full"
                      placeholder="myemail@azion.com"
                      :disabled="verifying"
                      :required="!!errors.email && !email.trim()"
                      :invalid="!!errors.email && !!email.trim()"
                      :aria-describedby="
                        errors.email && !verifying ? 'login-email-error' : undefined
                      "
                      @update:model-value="errors.email = ''"
                    />
                    <HelperText
                      v-if="errors.email && !verifying"
                      id="login-email-error"
                      :kind="email.trim() ? 'invalid' : 'required'"
                      :label="errors.email"
                    />
                  </div>

                  <div
                    v-else-if="step === 'password'"
                    key="password"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <Transition
                      appear
                      appear-from-class="opacity-0 -translate-x-1"
                      appear-to-class="opacity-100 translate-x-0"
                    >
                      <div
                        :style="identityTransitionStyle"
                        class="flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <Tooltip text="Change email">
                          <IconButton
                            icon="pi pi-chevron-left"
                            aria-label="Change email"
                            kind="outlined"
                            size="small"
                            :disabled="verifying"
                            @click="backToEmail"
                          />
                        </Tooltip>
                        <span class="truncate text-label-sm text-(--text-default)">{{
                          email
                        }}</span>
                      </div>
                    </Transition>

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="login-password"
                        label="Password"
                        required
                      />
                      <FieldPassword
                        v-model="password"
                        input-id="login-password"
                        name="password"
                        autocomplete="current-password"
                        placeholder="Type your password"
                        :disabled="verifying"
                        :required="!!errors.password && !password"
                        :invalid="!!errors.password && !!password"
                        :helper-text="verifying ? '' : errors.password"
                        @update:model-value="errors.password = ''"
                      />

                      <a
                        :aria-disabled="verifying || undefined"
                        :tabindex="verifying ? -1 : undefined"
                        class="self-start text-body-xs text-(--text-muted) underline underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) aria-disabled:pointer-events-none aria-disabled:opacity-60 motion-reduce:transition-none"
                        href="#"
                        @click.prevent="forgotPassword"
                        >Forgot your password?</a
                      >
                    </div>
                  </div>

                  <div
                    v-else-if="step === 'reset'"
                    key="reset"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <Transition
                      appear
                      appear-from-class="opacity-0 -translate-x-1"
                      appear-to-class="opacity-100 translate-x-0"
                    >
                      <div
                        :style="identityTransitionStyle"
                        class="flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <Tooltip text="Back to sign in">
                          <IconButton
                            icon="pi pi-chevron-left"
                            aria-label="Back to sign in"
                            kind="outlined"
                            size="small"
                            :disabled="verifying"
                            @click="backToSignIn"
                          />
                        </Tooltip>
                        <span class="truncate text-label-sm text-(--text-default)"
                          >Back to sign in</span
                        >
                      </div>
                    </Transition>

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="reset-email"
                        label="Email"
                        required
                      />
                      <InputText
                        id="reset-email"
                        v-model="resetEmail"
                        type="email"
                        size="large"
                        name="reset-email"
                        autocomplete="email"
                        class="w-full"
                        placeholder="myemail@azion.com"
                        :disabled="verifying"
                        :required="!!errors.resetEmail && !resetEmail.trim()"
                        :invalid="!!errors.resetEmail && !!resetEmail.trim()"
                        :aria-describedby="
                          errors.resetEmail && !verifying ? 'reset-email-error' : undefined
                        "
                        @update:model-value="errors.resetEmail = ''"
                      />
                      <HelperText
                        v-if="errors.resetEmail && !verifying"
                        id="reset-email-error"
                        :kind="resetEmail.trim() ? 'invalid' : 'required'"
                        :label="errors.resetEmail"
                      />
                    </div>
                  </div>

                  <div
                    v-else-if="step === 'new-password'"
                    key="new-password"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="new-password"
                        label="New password"
                        required
                      />
                      <FieldPassword
                        v-model="newPassword"
                        input-id="new-password"
                        name="new-password"
                        autocomplete="new-password"
                        placeholder="Enter a new password"
                        requirements
                        :disabled="verifying"
                        :required="!!errors.newPassword && !newPassword"
                        :invalid="!!errors.newPassword && !!newPassword"
                        :helper-text="verifying ? '' : errors.newPassword"
                        @update:model-value="errors.newPassword = ''"
                      />
                    </div>

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="confirm-password"
                        label="Confirm password"
                        required
                      />
                      <FieldPassword
                        v-model="confirmPassword"
                        input-id="confirm-password"
                        name="confirm-password"
                        autocomplete="new-password"
                        placeholder="Repeat the new password"
                        :disabled="verifying"
                        :required="!!errors.confirmPassword && !confirmPassword"
                        :invalid="!!errors.confirmPassword && !!confirmPassword"
                        :helper-text="verifying ? '' : errors.confirmPassword"
                        @update:model-value="errors.confirmPassword = ''"
                      />
                    </div>
                  </div>

                  <div
                    v-else
                    key="sent"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-(--spacing-xs) motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <div class="flex items-center gap-(--spacing-xs)">
                      <p class="text-body-sm text-(--text-default)">
                        Didn't receive the email?
                      </p>
                      <span
                        v-if="resending"
                        class="flex items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
                      >
                        <Spinner class="size-4" />
                        Sending…
                      </span>
                      <a
                        v-else
                        class="text-link text-body-sm"
                        href="#"
                        @click.prevent="resendReset"
                        >Resend Email</a
                      >
                    </div>
                    <div class="flex items-center gap-(--spacing-xs)">
                      <p class="text-body-sm text-(--text-default)">Already opened it?</p>
                      <a
                        class="text-link text-body-sm"
                        href="#"
                        @click.prevent="openResetLink"
                        >Set a new password</a
                      >
                    </div>
                  </div>
                </Transition>
              </div>

              <div class="flex flex-col">
                <div class="relative">
                  <Transition
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    leave-active-class="pointer-events-none absolute inset-x-0 top-0"
                  >
                    <div
                      :key="primaryAction.label"
                      :style="fadeTransitionStyle"
                      class="motion-reduce:transition-none"
                    >
                      <Button
                        :label="primaryAction.label"
                        :kind="primaryAction.kind"
                        size="large"
                        class="w-full"
                        :loading="verifying"
                        @click="handlePrimary"
                      />
                    </div>
                  </Transition>

                  <Transition
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <Tag
                      v-if="step === 'email'"
                      label="Last used"
                      severity="info"
                      size="small"
                      :style="fadeTransitionStyle"
                      class="absolute right-(--spacing-sm) top-0 -translate-y-1/2 motion-reduce:transition-none"
                    />
                  </Transition>
                </div>

                <div class="relative">
                  <Transition
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    leave-active-class="absolute inset-x-0 top-0"
                  >
                    <div
                      v-if="step === 'email'"
                      :style="fadeTransitionStyle"
                      class="flex flex-col gap-(--spacing-lg) pt-(--spacing-lg) motion-reduce:transition-none"
                    >
                      <Divider label="or" />

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
                            :style="fadeTransitionStyle"
                            class="flex flex-col gap-(--spacing-sm) motion-reduce:transition-none"
                          >
                            <Button
                              type="button"
                              label="Continue with Google"
                              kind="outlined"
                              size="large"
                              icon="ai-cor ai-google"
                              class="w-full"
                              :disabled="verifying"
                            />
                            <Button
                              type="button"
                              label="Continue with GitHub"
                              kind="outlined"
                              size="large"
                              icon="pi pi-github"
                              class="w-full"
                              :disabled="verifying"
                            />
                          </div>

                          <div
                            v-else
                            key="preparing"
                            role="status"
                            aria-label="Preparing sign-in providers"
                            :style="fadeTransitionStyle"
                            class="flex flex-col gap-(--spacing-sm) motion-reduce:transition-none"
                          >
                            <Skeleton height="2.5rem" />
                            <Skeleton height="2.5rem" />
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </form>
          </div>
        </div>
      </template>
    </CardBox>

    <div
      class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
    >
      <div class="flex items-center justify-center gap-(--spacing-xs)">
        <p class="text-body-xs text-(--text-default)">Don't have an account?</p>
        <a
          class="text-link text-body-xs"
          href="/signup"
          @click.prevent="goToSignUp"
          >Sign up</a
        >
      </div>

      <Transition
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <p
          v-if="step === 'email' || step === 'password'"
          :style="fadeTransitionStyle"
          class="text-center text-body-xs text-(--text-muted) motion-reduce:transition-none"
        >
          By continuing, I agree to Azion's
          <a
            class="text-link"
            href="https://www.azion.com/en/documentation/agreements/customer-agreement/"
            target="_blank"
            rel="noopener noreferrer"
            >terms of service</a
          >
          and
          <a
            class="text-link"
            href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            >privacy policy</a
          >.
        </p>
      </Transition>
    </div>
  </AuthColumn>
</template>
