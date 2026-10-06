<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import FieldPassword from '@aziontech/webkit/field-password'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const form = reactive({ email: '', password: '' })
  const errors = reactive({ email: '', password: '' })
  const submitting = ref(false)
  const provider = ref('')
  const locked = computed(() => submitting.value || provider.value !== '')

  const providersReady = ref(false)
  const probeProviders = () => new Promise((resolve) => setTimeout(resolve, 1100))

  onMounted(async () => {
    await probeProviders()
    providersReady.value = true
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordMeetsRequirements = (value) =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
      typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
    )

  const validate = () => {
    errors.email = !form.email.trim()
      ? 'This field is required.'
      : emailPattern.test(form.email.trim())
        ? ''
        : 'Enter a valid email address.'
    errors.password = !form.password
      ? 'This field is required.'
      : passwordMeetsRequirements(form.password)
        ? ''
        : 'Password does not meet requirements.'
    return !errors.email && !errors.password
  }

  const createAccount = () => new Promise((resolve) => setTimeout(resolve, 900))

  const authorizeProvider = () => new Promise((resolve) => setTimeout(resolve, 900))

  const continueWith = async (id) => {
    if (locked.value) return
    provider.value = id
    try {
      await authorizeProvider()
      router.push({
        name: 'signup-onboarding',
        query: form.email.trim() ? { email: form.email.trim() } : {}
      })
    } catch (error) {
      toast.error("Couldn't continue with that provider.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => continueWith(id) }
      })
    } finally {
      provider.value = ''
    }
  }

  const signUp = async () => {
    if (locked.value) return
    if (!validate()) return
    submitting.value = true
    try {
      await createAccount()
      router.push({
        name: 'signup-verify',
        query: { email: form.email.trim() }
      })
    } catch (error) {
      toast.error("Couldn't create your account.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => signUp() }
      })
    } finally {
      submitting.value = false
    }
  }

  const goToSignIn = () => router.push({ name: 'login' })
</script>

<template>
  <div class="flex w-full flex-col items-center gap-(--spacing-md)">
    <CardBox
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
          <button
            type="submit"
            class="sr-only"
            aria-hidden="true"
            tabindex="-1"
          />
          <header class="flex flex-col gap-(--spacing-xxs)">
            <h1 class="text-heading-sm text-(--text-default)">Sign Up for a Free Account</h1>
          </header>

          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="locked"
          >
            <legend class="sr-only">Account credentials</legend>

            <div class="flex flex-col gap-(--spacing-xs)">
              <Label
                for="signup-email"
                required
                >Work Email</Label
              >
              <InputText
                id="signup-email"
                v-model="form.email"
                type="email"
                name="email"
                size="large"
                autocomplete="email"
                class="w-full"
                placeholder="myemail@azion.com"
                :disabled="locked"
                :required="!!errors.email && !form.email.trim()"
                :invalid="!!errors.email && !!form.email.trim()"
                :aria-describedby="errors.email && !locked ? 'signup-email-error' : undefined"
                @update:model-value="errors.email = ''"
              />
              <HelperText
                v-if="errors.email && !locked"
                id="signup-email-error"
                :kind="form.email.trim() ? 'invalid' : 'required'"
                :label="errors.email"
              />
            </div>

            <div class="flex flex-col gap-(--spacing-xs)">
              <Label
                for="signup-password"
                required
                >Password</Label
              >
              <FieldPassword
                v-model="form.password"
                input-id="signup-password"
                name="password"
                autocomplete="new-password"
                placeholder="Create a password"
                requirements
                :disabled="locked"
                :required="!!errors.password && !form.password"
                :invalid="!!errors.password && !!form.password"
                :helper-text="locked ? '' : errors.password"
                @update:model-value="errors.password = ''"
              />
            </div>
          </fieldset>

          <Button
            label="Sign up"
            kind="primary"
            size="large"
            class="w-full"
            :loading="submitting"
            :disabled="provider !== ''"
            @click="signUp"
          />

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
                class="flex flex-col gap-(--spacing-sm) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              >
                <Button
                  type="button"
                  label="Continue with Google"
                  kind="outlined"
                  size="large"
                  icon="ai-cor ai-google"
                  class="w-full"
                  :loading="provider === 'google'"
                  :disabled="locked && provider !== 'google'"
                  @click="continueWith('google')"
                />
                <Button
                  type="button"
                  label="Continue with GitHub"
                  kind="outlined"
                  size="large"
                  icon="pi pi-github"
                  class="w-full"
                  :loading="provider === 'github'"
                  :disabled="locked && provider !== 'github'"
                  @click="continueWith('github')"
                />
              </div>

              <div
                v-else
                key="preparing"
                role="status"
                aria-label="Preparing sign-up providers"
                class="flex flex-col gap-(--spacing-sm) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              >
                <Skeleton height="2.5rem" />
                <Skeleton height="2.5rem" />
              </div>
            </Transition>
          </div>
        </form>
      </template>
    </CardBox>

    <div
      class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
    >
      <div class="flex items-center justify-center gap-(--spacing-xs)">
        <p class="text-body-xs text-(--text-default)">Already have an account?</p>
        <a
          class="text-link text-body-xs"
          href="/login"
          @click.prevent="goToSignIn"
          >Sign in</a
        >
      </div>

      <p class="text-center text-body-xs text-(--text-muted)">
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
    </div>
  </div>
</template>
