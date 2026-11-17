<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import Separator from '@aziontech/webkit/separator'
  import { nextTick, onScopeDispose, reactive, ref } from 'vue'

  interface CardNotice {
    severity: AlertSeverity
    label: string
    exits?: boolean
  }

  const failure: string = ''
  const email = ref('')
  const password = ref('')
  const errors = reactive({ email: '', password: '' })
  const cardNotice = ref<CardNotice | null>(null)
  const verifying = ref(false)
  let requestTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(requestTimer))

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

  const onEmailInput = () => {
    errors.email = ''
    if (cardNotice.value?.exits) cardNotice.value = null
  }

  const signUp = () => {
    if (verifying.value) return
    errors.email = emailError(email.value)
    errors.password = newPasswordError(password.value)
    cardNotice.value = null
    if (errors.email || errors.password) {
      const id = errors.email ? 'signup-email' : 'signup-password'
      nextTick(() => document.getElementById(id)?.focus())
      return
    }
    verifying.value = true
    clearTimeout(requestTimer)
    requestTimer = setTimeout(() => {
      verifying.value = false
      cardNotice.value =
        failure === 'email-taken'
          ? { severity: 'danger', label: 'This email is already registered.', exits: true }
          : {
              severity: 'success',
              label: `Account created. We sent a verification link to ${email.value.trim()}.`
            }
    }, 600)
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand
        href="/home"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          href="/docs"
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
                <form
                  class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                  aria-label="Sign up for a free account"
                  :aria-busy="verifying || undefined"
                  novalidate
                  @submit.prevent="signUp"
                >
                  <PageHeader
                    title="Sign up for a free account"
                    size="small"
                  />

                  <Alert
                    v-if="cardNotice"
                    :key="cardNotice.label"
                    :severity="cardNotice.severity"
                    size="small"
                  >
                    {{ cardNotice.label }}
                    <template v-if="cardNotice.exits">
                      <a
                        class="text-link"
                        href="/login"
                        >Sign in</a
                      >
                      or
                      <a
                        class="text-link"
                        href="/login?reset=1"
                        >reset your password</a
                      >.
                    </template>
                  </Alert>

                  <div class="flex flex-col gap-(--spacing-sm)">
                    <Button
                      type="button"
                      label="Continue with Google"
                      variant="outline"
                      size="large"
                      icon="az-color az-google"
                      class="w-full"
                      :disabled="verifying"
                    />
                    <Button
                      type="button"
                      label="Continue with GitHub"
                      variant="outline"
                      size="large"
                      icon="az az-github"
                      class="w-full"
                      :disabled="verifying"
                    />
                  </div>

                  <Separator label="or" />

                  <fieldset
                    class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                    :disabled="verifying"
                  >
                    <legend class="sr-only">Account credentials</legend>

                    <Field
                      required
                      :invalid="!!errors.email"
                    >
                      <Field.Label for="signup-email">Work email</Field.Label>
                      <Input
                        id="signup-email"
                        v-model="email"
                        type="email"
                        name="email"
                        size="large"
                        autocomplete="email"
                        class="w-full"
                        placeholder="m@example.com"
                        required
                        :invalid="!!errors.email"
                        :aria-describedby="errors.email ? 'signup-email-error' : undefined"
                        @update:model-value="onEmailInput"
                      />
                      <FieldError
                        v-if="errors.email"
                        id="signup-email-error"
                        >{{ errors.email }}</FieldError
                      >
                    </Field>

                    <Field
                      required
                      :invalid="!!errors.password"
                    >
                      <Field.Label for="signup-password">Password</Field.Label>
                      <PasswordInput
                        id="signup-password"
                        v-model="password"
                        name="password"
                        autocomplete="new-password"
                        placeholder="Create a password"
                        @update:model-value="errors.password = ''"
                      />
                      <Field.Error v-if="errors.password">{{ errors.password }}</Field.Error>
                      <PasswordRequirements :value="password" />
                    </Field>
                  </fieldset>

                  <Button
                    label="Sign up"
                    variant="primary"
                    size="large"
                    class="w-full"
                    type="submit"
                    :loading="verifying"
                  />
                </form>
              </template>
            </Card>

            <div
              class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
            >
              <div class="flex items-center justify-center gap-(--spacing-xs)">
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
