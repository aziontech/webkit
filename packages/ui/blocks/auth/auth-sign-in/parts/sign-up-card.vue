<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import PageHeader from '@aziontech/ui/page-header'
  import Separator from '@aziontech/ui/separator'
  import { nextTick, onScopeDispose, reactive, ref } from 'vue'

  import type { SignInProvider } from '../auth-sign-in.vue'
  import { SIGN_IN_COPY } from '../lib/sign-in-copy'
  import { emailError, newPasswordError } from '../lib/sign-in-rules'
  import EmailField from './email-field.vue'
  import PasswordField from './password-field.vue'

  /** A sign-up the server refused; the card answers it like a new address. */
  export type SignUpFailure = 'email-taken'

  export interface SignUpCardProps {
    /** The email the form opens on, such as the address a failed sign-up kept. */
    defaultEmail?: string
    /** The address is already registered: the card answers exactly as for a new one, so nobody can test which addresses have an account. */
    error?: SignUpFailure | ''
  }

  interface SignUpNotice {
    severity: AlertSeverity
    label: string
  }

  const props = withDefaults(defineProps<SignUpCardProps>(), {
    defaultEmail: '',
    error: ''
  })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
  }>()

  const email = ref(props.defaultEmail)
  const password = ref('')
  const errors = reactive({ email: '', password: '' })
  const sentNotice = (address: string): SignUpNotice => ({
    severity: 'success',
    label:
      `Check your inbox at ${address} to finish. ` +
      'If this address already has an account, the email explains how to sign in instead.'
  })

  const cardNotice = ref<SignUpNotice | null>(
    props.error === 'email-taken' ? sentNotice(props.defaultEmail) : null
  )
  const verifying = ref(false)
  let requestTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(requestTimer))

  const onEmailInput = () => {
    errors.email = ''
    cardNotice.value = null
  }

  const answer = () => {
    verifying.value = false
    cardNotice.value = sentNotice(email.value.trim())
  }

  const signUp = () => {
    if (verifying.value) return
    errors.email = emailError(email.value, SIGN_IN_COPY.en)
    errors.password = newPasswordError(password.value, SIGN_IN_COPY.en)
    cardNotice.value = null
    if (errors.email || errors.password) {
      const id = errors.email ? 'signup-email' : 'signup-password'
      nextTick(() => document.getElementById(id)?.focus())
      return
    }
    verifying.value = true
    clearTimeout(requestTimer)
    requestTimer = setTimeout(answer, 600)
  }

  const providers: { id: SignInProvider; label: string; icon: string }[] = [
    { id: 'google', label: 'Continue with Google', icon: 'az-color az-google' },
    { id: 'github', label: 'Continue with GitHub', icon: 'az az-github' }
  ]
</script>

<template>
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
        </Alert>

        <div class="flex flex-col gap-(--spacing-sm)">
          <Button
            v-for="provider in providers"
            :key="provider.id"
            type="button"
            :label="provider.label"
            variant="outline"
            size="large"
            :icon="provider.icon"
            class="w-full"
            :disabled="verifying"
            @click="(event: MouseEvent) => emit('provider-click', event, provider.id)"
          />
        </div>

        <Separator label="or" />

        <fieldset
          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          :disabled="verifying"
        >
          <legend class="sr-only">Account credentials</legend>

          <EmailField
            id="signup-email"
            v-model="email"
            name="email"
            label="Work email"
            autocomplete="email"
            :error="errors.email"
            @update:model-value="onEmailInput"
          />

          <PasswordField
            id="signup-password"
            v-model="password"
            name="password"
            label="Password"
            autocomplete="new-password"
            placeholder="Create a password"
            :error="errors.password"
            show-requirements
            @update:model-value="errors.password = ''"
          />
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
</template>
