<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, onMounted, ref } from 'vue'

  const account = 'ana.silva@example.com'

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
                        <Field.Description>{{
                          codeError || codeField.description
                        }}</Field.Description>
                      </Field>

                      <Button
                        type="submit"
                        label="Verify"
                        kind="primary"
                        size="large"
                        class="w-full"
                        :loading="verifying"
                        :disabled="signedIn"
                      />
                    </form>

                    <div class="flex flex-col items-start gap-(--spacing-xs)">
                      <a
                        class="text-link text-body-sm"
                        href="#"
                        @click.prevent="switchMethod"
                        >{{ recovery ? 'Use your authenticator app' : 'Use a recovery code' }}</a
                      >
                      <a
                        class="text-link text-body-sm"
                        href="/login"
                        >Sign in with another account</a
                      >
                    </div>
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
