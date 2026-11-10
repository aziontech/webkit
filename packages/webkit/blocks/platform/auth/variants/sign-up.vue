<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import PageHeader from '@aziontech/webkit/page-header'
  import Separator from '@aziontech/webkit/separator'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Label from '@aziontech/webkit/label'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import { reactive, ref } from 'vue'

  const email = ref('')
  const password = ref('')
  const errors = reactive({ email: '', password: '' })

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

  const signUp = () => {
    errors.email = emailError(email.value)
    errors.password = newPasswordError(password.value)
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
            <div class="flex w-full flex-col items-center">
              <div class="flex w-full flex-col items-center gap-(--spacing-md)">
                <Card
                  class="w-full max-w-(--container-sm)"
                  :padded="false"
                >
                  <template #content>
                    <form
                      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                      aria-label="Sign up for a free account"
                      novalidate
                      @submit.prevent="signUp"
                    >
                      <PageHeader title="Sign Up for a Free Account" />

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

                      <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                        <legend class="sr-only">Account credentials</legend>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="signup-email"
                            label="Work Email"
                            required
                          />
                          <Input
                            id="signup-email"
                            v-model="email"
                            type="email"
                            name="email"
                            size="large"
                            autocomplete="email"
                            class="w-full"
                            placeholder="myemail@example.com"
                            :required="!!errors.email && !email.trim()"
                            :invalid="!!errors.email && !!email.trim()"
                            :aria-describedby="errors.email ? 'signup-email-error' : undefined"
                            @update:model-value="errors.email = ''"
                          />
                          <HelperText
                            v-if="errors.email"
                            id="signup-email-error"
                            :kind="email.trim() ? 'invalid' : 'required'"
                            :label="errors.email"
                          />
                        </div>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="signup-password"
                            label="Password"
                            required
                          />
                          <Field
                            :required="!!errors.password && !password"
                            :invalid="!!errors.password && !!password"
                          >
                            <PasswordInput
                              id="signup-password"
                              v-model="password"
                              name="password"
                              autocomplete="new-password"
                              placeholder="Create a password"
                              @update:model-value="errors.password = ''"
                            />
                            <Field.Description v-if="errors.password">{{
                              errors.password
                            }}</Field.Description>
                            <PasswordRequirements :value="password" />
                          </Field>
                        </div>
                      </fieldset>

                      <Button
                        label="Sign up"
                        kind="primary"
                        size="large"
                        class="w-full"
                        type="submit"
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
        </div>
      </div>
    </main>
  </div>
</template>
