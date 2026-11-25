<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, onMounted, ref } from 'vue'

  import { useCodeCheck } from '../composables/use-code-check'
  import { mfaAccount as account } from '../sample'
  import AuthCard from './auth-card.vue'

  const recovery = ref(false)
  const code = ref('')
  const signedIn = ref(false)

  const codeField = computed(() =>
    recovery.value
      ? {
          label: 'Recovery code',
          length: 8,
          description:
            'One of the 8-character codes you saved when you set up multi-factor authentication. Each works once.',
          empty: 'Enter one of your recovery codes.',
          short: 'Enter all 8 characters of the recovery code.',
          rejected: 'That recovery code is not valid or was already used. Try another one.'
        }
      : {
          label: 'Authentication code',
          length: 6,
          description: `The 6-digit code your authenticator app shows for ${account}.`,
          empty: 'Enter the 6-digit code from the app.',
          short: 'Enter all 6 digits of the code.',
          rejected:
            'That code is not valid. Enter the current code; the app changes it every 30 seconds.'
        }
  )

  const focusCode = () => nextTick(() => document.getElementById('mfa-code')?.focus())
  onMounted(focusCode)

  const codeCheck = useCodeCheck({
    code,
    length: () => codeField.value.length,
    messages: codeField,
    focus: focusCode,
    onAccepted: () => {
      signedIn.value = true
    }
  })
  const { error: codeError, checking: verifying, unreachable, check: verify } = codeCheck

  const switchMethod = () => {
    recovery.value = !recovery.value
    codeCheck.reset()
    focusCode()
  }
</script>

<template>
  <AuthCard>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
      <PageHeader
        title="Verify it's you"
        :description="
          recovery
            ? 'Enter a recovery code to sign in without your authenticator app.'
            : 'Open your authenticator app and enter the code it shows.'
        "
      />

      <Alert
        key="alert-1"
        v-if="signedIn"
        severity="success"
        size="small"
        label="Signed in."
      />
      <Alert
        key="alert-2"
        v-else-if="unreachable"
        severity="warning"
        size="small"
      >
        We could not check the code. Your entry is kept; try again in a moment.
        <template #actions>
          <Button
            label="Retry"
            variant="secondary"
            size="small"
            :loading="verifying"
            @click="verify"
          />
        </template>
      </Alert>

      <form
        class="flex flex-col gap-(--spacing-lg)"
        novalidate
        @submit.prevent="verify"
      >
        <Field :invalid="!!codeError">
          <Field.Label for="mfa-code">{{ codeField.label }}</Field.Label>
          <OtpInput
            id="mfa-code"
            :key="recovery ? 'recovery' : 'app'"
            v-model="code"
            name="code"
            :length="codeField.length"
            :mode="recovery ? 'alphanumeric' : 'numeric'"
            :group="recovery ? 4 : 0"
            :disabled="verifying || signedIn"
            @update:model-value="codeCheck.clearError"
            @complete="verify"
          />
          <Field.Description>{{ codeField.description }}</Field.Description>
          <Field.Error v-if="codeError">{{ codeError }}</Field.Error>
        </Field>

        <Button
          type="submit"
          label="Verify"
          variant="primary"
          size="large"
          class="w-full"
          :loading="verifying"
          :disabled="signedIn"
        />
      </form>

      <div class="flex flex-col items-start gap-(--spacing-xs)">
        <Button
          type="button"
          :label="recovery ? 'Use your authenticator app' : 'Use a recovery code'"
          variant="link"
          @click="switchMethod"
        />
        <span class="text-body-sm">
          <Link
            inline
            href="/login"
            >Sign in with another account</Link
          >
        </span>
      </div>
    </div>
  </AuthCard>
</template>
