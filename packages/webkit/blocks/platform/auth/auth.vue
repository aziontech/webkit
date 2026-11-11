<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Separator from '@aziontech/webkit/separator'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Label from '@aziontech/webkit/label'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import IconButton from '@aziontech/webkit/icon-button'
  import Alert from '@aziontech/webkit/alert'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  const expiredEmail = ''

  const step = ref(expiredEmail ? 'password' : 'email')
  const returnStep = ref('email')
  const expiredNotice = ref(Boolean(expiredEmail))
  const email = ref(expiredEmail)
  const password = ref('')
  const resetEmail = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value) =>
    !value.trim()
      ? 'This field is required.'
      : emailPattern.test(value.trim())
        ? ''
        : 'Enter a valid email address.'

  const newPasswordError = (value) =>
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

  const primaryAction = computed(() => {
    if (step.value === 'password') return { label: 'Sign in', kind: 'primary' }
    if (step.value === 'reset') return { label: 'Send reset link', kind: 'primary' }
    if (step.value === 'new-password') return { label: 'Reset password', kind: 'primary' }
    if (step.value === 'sent') return { label: 'Return to sign in', kind: 'secondary' }
    return { label: 'Continue with email', kind: 'primary' }
  })

  const backToEmail = () => {
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const forgotPassword = () => {
    expiredNotice.value = false
    returnStep.value = step.value === 'password' ? 'password' : 'email'
    resetEmail.value = email.value
    errors.resetEmail = ''
    step.value = 'reset'
  }

  const backToSignIn = () => {
    step.value = returnStep.value
  }

  const openResetLink = () => {
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const handlePrimary = () => {
    expiredNotice.value = false
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (!errors.email) step.value = 'password'
    } else if (step.value === 'password') {
      errors.password = password.value ? '' : 'This field is required.'
    } else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (!errors.resetEmail) step.value = 'sent'
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? 'This field is required.'
        : confirmPassword.value === newPassword.value
          ? ''
          : "Passwords don't match."
      if (!errors.newPassword && !errors.confirmPassword) {
        email.value = resetEmail.value
        password.value = ''
        returnStep.value = 'password'
        step.value = 'password'
      }
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
          <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
            <Card
              class="w-full max-w-(--container-sm)"
              :padded="false"
            >
              <template #content>
                <div class="p-(--spacing-lg)">
                  <form
                    class="flex flex-col gap-(--spacing-lg)"
                    aria-label="Sign in to your account"
                    novalidate
                    @submit.prevent="handlePrimary"
                  >
                    <header class="flex flex-col gap-(--spacing-xxs)">
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

                    <Alert
                      v-if="expiredNotice"
                      severity="info"
                      size="small"
                      label="Your session expired. Sign in again to pick up where you left off."
                    />

                    <div class="flex flex-col">
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

                      <div
                        v-if="step === 'email'"
                        class="motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="login-email"
                            label="Email"
                            required
                          />
                          <Input
                            id="login-email"
                            v-model="email"
                            type="email"
                            name="email"
                            size="large"
                            autocomplete="username"
                            class="w-full"
                            placeholder="myemail@example.com"
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
                        </div>
                      </div>

                      <div
                        v-else-if="step === 'password'"
                        class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div
                          class="flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none"
                        >
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

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="login-password"
                            label="Password"
                            required
                          />
                          <Field
                            :required="!!errors.password && !password"
                            :invalid="!!errors.password && !!password"
                          >
                            <PasswordInput
                              id="login-password"
                              v-model="password"
                              name="password"
                              autocomplete="current-password"
                              placeholder="Type your password"
                              @update:model-value="errors.password = ''"
                            />
                            <Field.Description v-if="errors.password">{{
                              errors.password
                            }}</Field.Description>
                          </Field>

                          <a
                            class="self-start text-body-xs text-(--text-muted) underline underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
                            href="#"
                            @click.prevent="forgotPassword"
                            >Forgot your password?</a
                          >
                        </div>
                      </div>

                      <div
                        v-else-if="step === 'reset'"
                        class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div
                          class="flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none"
                        >
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

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="reset-email"
                            label="Email"
                            required
                          />
                          <Input
                            id="reset-email"
                            v-model="resetEmail"
                            type="email"
                            name="reset-email"
                            size="large"
                            autocomplete="email"
                            class="w-full"
                            placeholder="myemail@example.com"
                            :required="!!errors.resetEmail && !resetEmail.trim()"
                            :invalid="!!errors.resetEmail && !!resetEmail.trim()"
                            :aria-describedby="errors.resetEmail ? 'reset-email-error' : undefined"
                            @update:model-value="errors.resetEmail = ''"
                          />
                          <HelperText
                            v-if="errors.resetEmail"
                            id="reset-email-error"
                            :kind="resetEmail.trim() ? 'invalid' : 'required'"
                            :label="errors.resetEmail"
                          />
                        </div>
                      </div>

                      <div
                        v-else-if="step === 'new-password'"
                        class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="new-password"
                            label="New password"
                            required
                          />
                          <Field
                            :required="!!errors.newPassword && !newPassword"
                            :invalid="!!errors.newPassword && !!newPassword"
                          >
                            <PasswordInput
                              id="new-password"
                              v-model="newPassword"
                              name="new-password"
                              autocomplete="new-password"
                              placeholder="Enter a new password"
                              @update:model-value="errors.newPassword = ''"
                            />
                            <Field.Description v-if="errors.newPassword">{{
                              errors.newPassword
                            }}</Field.Description>
                            <PasswordRequirements :value="newPassword" />
                          </Field>
                        </div>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="confirm-password"
                            label="Confirm password"
                            required
                          />
                          <Field
                            :required="!!errors.confirmPassword && !confirmPassword"
                            :invalid="!!errors.confirmPassword && !!confirmPassword"
                          >
                            <PasswordInput
                              id="confirm-password"
                              v-model="confirmPassword"
                              name="confirm-password"
                              autocomplete="new-password"
                              placeholder="Repeat the new password"
                              @update:model-value="errors.confirmPassword = ''"
                            />
                            <Field.Description v-if="errors.confirmPassword">{{
                              errors.confirmPassword
                            }}</Field.Description>
                          </Field>
                        </div>
                      </div>

                      <div
                        v-else
                        class="flex flex-col gap-(--spacing-xs) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div class="flex items-center gap-(--spacing-xs)">
                          <p class="text-body-sm text-(--text-default)">
                            Didn't receive the email?
                          </p>
                          <a
                            class="text-link text-body-sm"
                            href="#"
                            @click.prevent
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
                    </div>

                    <div class="relative">
                      <Button
                        :label="primaryAction.label"
                        :kind="primaryAction.kind"
                        size="large"
                        class="w-full"
                        type="submit"
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

              <p
                v-if="step === 'email' || step === 'password'"
                class="text-center text-body-xs text-(--text-muted)"
              >
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
