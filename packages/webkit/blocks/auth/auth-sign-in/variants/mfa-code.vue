<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, onMounted, ref } from 'vue'

  import SignInFrame from '../parts/sign-in-frame.vue'

  const account = 'jane.doe@example.com'

  const recovery = ref(false)
  const code = ref('')
  const codeError = ref('')
  const verifying = ref(false)
  const signedIn = ref(false)
  const unreachable = ref(false)

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

  const switchMethod = () => {
    recovery.value = !recovery.value
    code.value = ''
    codeError.value = ''
    unreachable.value = false
    focusCode()
  }

  const verify = () => {
    if (verifying.value) return
    unreachable.value = false
    const field = codeField.value
    if (code.value.length < field.length) {
      codeError.value = code.value ? field.short : field.empty
      focusCode()
      return
    }
    codeError.value = ''
    verifying.value = true
    setTimeout(() => {
      verifying.value = false
      if (/^0+$/.test(code.value)) {
        codeError.value = field.rejected
        code.value = ''
        focusCode()
        return
      }
      if (/^9+$/.test(code.value)) {
        unreachable.value = true
        return
      }
      signedIn.value = true
    }, 600)
  }
</script>

<template>
  <SignInFrame>
    <div class="flex w-full flex-col items-center">
      <Card
        class="w-full max-w-(--container-sm)"
        :padded="false"
      >
        <template #default>
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
                  @update:model-value="codeError = ''"
                  @complete="verify"
                />
                <Field.Description>{{ codeError || codeField.description }}</Field.Description>
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
        </template>
      </Card>
    </div>
  </SignInFrame>
</template>
