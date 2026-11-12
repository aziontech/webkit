<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import QrCode from '@aziontech/webkit/qr-code'
  import { nextTick, ref } from 'vue'

  const account = 'ana.silva@example.com'
  const setupKey = 'JBSW Y3DP EHPK 3PXP'
  const otpauthUri = `otpauth://totp/Azion:${encodeURIComponent(account)}?secret=${setupKey.replaceAll(' ', '')}&issuer=Azion`

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
              <Card
                class="w-full max-w-(--container-sm)"
                :padded="false"
              >
                <template #content>
                  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
                    <PageHeader
                      title="Set up multi-factor authentication"
                      description="Add a second step to sign in: a code from an authenticator app on your phone."
                    />

                    <Alert
                      v-if="enabled"
                      severity="success"
                      size="small"
                      label="Multi-factor authentication is on. You will enter a code from the app each time you sign in."
                    />
                    <Alert
                      v-else-if="unreachable"
                      severity="warning"
                      size="small"
                    >
                      We could not check the code, and multi-factor authentication is still off. Try
                      again in a moment.
                      <template #action>
                        <Button
                          label="Retry"
                          kind="secondary"
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
                        <li>
                          Install an authenticator app, such as Google Authenticator, on your phone.
                        </li>
                        <li>In the app, add an account and choose to scan a QR code.</li>
                        <li>Scan this code, then enter the 6-digit code the app shows.</li>
                      </ol>

                      <div class="flex flex-col items-center gap-(--spacing-sm)">
                        <QrCode
                          :value="otpauthUri"
                          :label="`QR code to add ${account} to an authenticator app`"
                        />
                      </div>

                      <div class="flex flex-col gap-(--spacing-xxs)">
                        <p class="text-label-sm text-(--text-default)">Can't scan the code?</p>
                        <p class="text-body-sm text-(--text-muted)">
                          Enter this setup key in the app instead.
                        </p>
                        <div
                          class="flex items-center justify-between gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) ps-(--spacing-sm) pe-(--spacing-xxs) py-(--spacing-xxs)"
                        >
                          <code
                            class="text-label-code text-(--text-default)"
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
                          kind="primary"
                          size="large"
                          class="w-full"
                          :loading="verifying"
                        />
                      </form>
                    </template>

                    <Button
                      v-else
                      label="Continue to Console"
                      kind="primary"
                      size="large"
                      class="w-full"
                      href="/home"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
