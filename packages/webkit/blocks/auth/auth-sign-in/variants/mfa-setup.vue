<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import QrCode from '@aziontech/webkit/qr-code'
  import { computed, nextTick, ref } from 'vue'

  import SignInFrame from '../parts/sign-in-frame.vue'

  const account = 'jane.doe@example.com'
  const setupKey = 'JBSW Y3DP EHPK 3PXP'
  const otpauthUri = `otpauth://totp/Azion:${encodeURIComponent(account)}?secret=${setupKey.replaceAll(' ', '')}&issuer=Azion`

  const recoveryCodes = [
    'K7QM2XPA',
    'R4TD9WLN',
    'B8VJ3HQE',
    'N2CY6FMT',
    'H5LP8KRW',
    'W9EX4GDB',
    'T3NA7ZQC',
    'F6RU2MJV'
  ]
  const recoveryText = recoveryCodes.join('\n')
  const codesSaved = ref(false)
  const continueHint = computed(() =>
    codesSaved.value ? '' : 'Confirm that you saved the recovery codes to continue.'
  )

  const downloadCodes = () => {
    const url = URL.createObjectURL(new Blob([`${recoveryText}\n`], { type: 'text/plain' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'azion-recovery-codes.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const code = ref('')
  const codeError = ref('')
  const verifying = ref(false)
  const enabled = ref(false)
  const unreachable = ref(false)

  const focusCode = () => nextTick(() => document.getElementById('mfa-setup-code')?.focus())

  const verify = () => {
    if (verifying.value) return
    unreachable.value = false
    if (code.value.length < 6) {
      codeError.value = code.value
        ? 'Enter all 6 digits of the code.'
        : 'Enter the 6-digit code from the app.'
      focusCode()
      return
    }
    codeError.value = ''
    verifying.value = true
    setTimeout(() => {
      verifying.value = false
      if (code.value === '000000') {
        codeError.value =
          'That code is not valid. Enter the current code; the app changes it every 30 seconds.'
        code.value = ''
        focusCode()
        return
      }
      if (code.value === '999999') {
        unreachable.value = true
        return
      }
      enabled.value = true
    }, 600)
  }

  const SETUP_KEY_CLASS =
    'flex items-center justify-between gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) ps-(--spacing-sm) pe-(--spacing-2xs) ' +
    'py-(--spacing-2xs)'
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
              title="Set up multi-factor authentication"
              description="Add a second step to sign in: a code from an authenticator app on your phone."
            />

            <Alert
              key="alert-1"
              v-if="enabled"
              severity="success"
              size="small"
              label="Multi-factor authentication is on. Save your recovery codes before you continue."
            />
            <Alert
              key="alert-2"
              v-else-if="unreachable"
              severity="warning"
              size="small"
            >
              We could not check the code, and multi-factor authentication is still off. Try again
              in a moment.
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

            <template v-if="!enabled">
              <ol
                class="flex list-decimal flex-col gap-(--spacing-xs) ps-(--spacing-lg) text-body-sm text-(--text-default)"
              >
                <li>Install an authenticator app, such as Google Authenticator, on your phone.</li>
                <li>In the app, add an account and choose to scan a QR code.</li>
                <li>Scan this code, then enter the 6-digit code the app shows.</li>
              </ol>

              <div class="flex flex-col items-center gap-(--spacing-sm)">
                <QrCode
                  :value="otpauthUri"
                  :aria-label="`QR code to add ${account} to an authenticator app`"
                />
              </div>

              <div class="flex flex-col gap-(--spacing-2xs)">
                <p class="text-label-sm text-(--text-default)">Can't scan the code?</p>
                <p class="text-body-sm text-(--text-muted)">
                  Enter this setup key in the app instead.
                </p>
                <div :class="SETUP_KEY_CLASS">
                  <code
                    class="text-label-code-sm text-(--text-default)"
                    dir="ltr"
                    >{{ setupKey }}</code
                  >
                  <CopyButton
                    :value="setupKey.replaceAll(' ', '')"
                    aria-label="Copy setup key"
                    copied-label="Setup key copied"
                    size="small"
                  />
                </div>
              </div>

              <form
                class="flex flex-col gap-(--spacing-lg)"
                aria-label="Verify the authenticator app"
                novalidate
                @submit.prevent="verify"
              >
                <Field :invalid="!!codeError">
                  <Field.Label for="mfa-setup-code">Authentication code</Field.Label>
                  <OtpInput
                    id="mfa-setup-code"
                    v-model="code"
                    name="code"
                    :disabled="verifying"
                    @update:model-value="codeError = ''"
                    @complete="verify"
                  />
                  <Field.Description>{{
                    codeError || 'The 6-digit code from the app, after you scan.'
                  }}</Field.Description>
                </Field>

                <Button
                  type="submit"
                  label="Verify code"
                  variant="primary"
                  size="large"
                  class="w-full"
                  :loading="verifying"
                />
              </form>
            </template>

            <template v-else>
              <section
                class="flex flex-col gap-(--spacing-sm)"
                aria-labelledby="mfa-setup-recovery-title"
              >
                <div class="flex flex-col gap-(--spacing-2xs)">
                  <h2
                    id="mfa-setup-recovery-title"
                    class="text-label-md text-(--text-default)"
                  >
                    Save your recovery codes
                  </h2>
                  <p class="text-body-sm text-(--text-muted)">
                    If you lose your phone, sign in with one of these codes. Each code works once.
                    Keep them somewhere safe, such as a password manager; they are not shown again.
                  </p>
                </div>
                <ul
                  class="grid grid-cols-2 gap-x-(--spacing-md) gap-y-(--spacing-2xs) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm)"
                  aria-label="Recovery codes"
                >
                  <li
                    v-for="recoveryCode in recoveryCodes"
                    :key="recoveryCode"
                    class="text-label-code-sm text-(--text-default)"
                    dir="ltr"
                  >
                    <code>{{ recoveryCode }}</code>
                  </li>
                </ul>
                <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                  <Button
                    label="Download"
                    variant="outline"
                    size="medium"
                    icon="az az-download"
                    @click="downloadCodes"
                  />
                  <CopyButton
                    :value="recoveryText"
                    aria-label="Copy recovery codes"
                    copied-label="Recovery codes copied"
                    variant="outline"
                    size="medium"
                  />
                </div>
              </section>

              <Field orientation="horizontal">
                <Checkbox
                  id="mfa-setup-codes-saved"
                  v-model="codesSaved"
                  name="codesSaved"
                />
                <Field.Content>
                  <Field.Label for="mfa-setup-codes-saved">I saved these codes</Field.Label>
                </Field.Content>
              </Field>

              <div class="flex flex-col gap-(--spacing-2xs)">
                <Button
                  label="Continue to Console"
                  variant="primary"
                  size="large"
                  class="w-full"
                  :disabled="!codesSaved"
                  :href="codesSaved ? '/home' : ''"
                  aria-describedby="mfa-setup-continue-hint"
                />
                <p
                  id="mfa-setup-continue-hint"
                  class="text-body-sm text-(--text-muted)"
                >
                  {{ continueHint }}
                </p>
              </div>
            </template>
          </div>
        </template>
      </Card>
    </div>
  </SignInFrame>
</template>
