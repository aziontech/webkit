<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { nextTick, ref } from 'vue'

  type TokenCheck = 'valid' | 'rejected' | 'unreachable'

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry?: boolean
  }

  const emit = defineEmits<{ 'sign-in': [event: Event, token: string] }>()

  const TOKEN_DOCS = 'https://www.azion.com/en/documentation/products/accounts/personal-tokens/'

  const token = ref('')
  const tokenError = ref('')
  const verifying = ref(false)
  const cardNotice = ref<CardNotice | null>(null)

  const focusToken = () => nextTick(() => document.getElementById('personal-token')?.focus())

  const checkToken = (candidate: string): Promise<TokenCheck> =>
    new Promise((resolve) =>
      setTimeout(() => {
        if (/^9+$/.test(candidate)) resolve('unreachable')
        else resolve(candidate.length < 32 ? 'rejected' : 'valid')
      }, 600)
    )

  const signIn = async (event: Event) => {
    if (verifying.value) return
    cardNotice.value = null
    const candidate = token.value.trim()
    if (!candidate) tokenError.value = 'Paste your personal token.'
    else if (/\s/.test(candidate))
      tokenError.value = 'A token has no spaces. Copy it again from Personal tokens.'
    else tokenError.value = ''
    if (tokenError.value) {
      focusToken()
      return
    }
    verifying.value = true
    const result = await checkToken(candidate)
    verifying.value = false
    if (result === 'rejected') {
      cardNotice.value = {
        severity: 'danger',
        label:
          'Azion did not accept this token. Check that you copied all of it and that it has not expired or been revoked.'
      }
      token.value = ''
      focusToken()
      return
    }
    if (result === 'unreachable') {
      cardNotice.value = {
        severity: 'warning',
        label: 'We could not reach Azion to check the token. Your entry is kept.',
        retry: true
      }
      return
    }
    cardNotice.value = { severity: 'success', label: 'Signed in.' }
    token.value = ''
    emit('sign-in', event, candidate)
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            variant="default"
            size="small"
          />
        </a>
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="ai ai-book"
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
                <div class="p-(--spacing-lg)">
                  <form
                    class="flex flex-col gap-(--spacing-lg)"
                    aria-label="Sign in with a personal token"
                    :aria-busy="verifying || undefined"
                    novalidate
                    @submit.prevent="signIn"
                  >
                    <PageHeader
                      title="Sign in with a personal token"
                      description="Paste a personal token from your Azion account. It is sent only to the Azion API."
                      size="small"
                    />

                    <Alert
                      v-if="cardNotice"
                      :key="cardNotice.label"
                      :severity="cardNotice.severity"
                      size="small"
                      :label="cardNotice.label"
                    >
                      <template
                        v-if="cardNotice.retry"
                        #actions
                      >
                        <Button
                          label="Retry"
                          variant="secondary"
                          size="small"
                          :loading="verifying"
                          @click="signIn"
                        />
                      </template>
                    </Alert>

                    <fieldset
                      class="m-0 flex min-w-0 flex-col border-0 p-0"
                      :disabled="verifying"
                    >
                      <legend class="sr-only">Personal token</legend>
                      <Field
                        :required="!!tokenError"
                        :invalid="!!tokenError"
                      >
                        <Field.Label for="personal-token">Personal token</Field.Label>
                        <PasswordInput
                          id="personal-token"
                          v-model="token"
                          name="token"
                          autocomplete="off"
                          spellcheck="false"
                          monospace
                          placeholder="Paste your token"
                          @update:model-value="tokenError = ''"
                        />
                        <Field.Description>
                          Create one in Account settings, Personal tokens.
                          <a
                            class="text-link"
                            :href="TOKEN_DOCS"
                            target="_blank"
                            rel="noopener noreferrer"
                            >How to create a personal token</a
                          >
                        </Field.Description>
                        <Field.Error v-if="tokenError">{{ tokenError }}</Field.Error>
                      </Field>
                    </fieldset>

                    <Button
                      type="submit"
                      label="Sign in"
                      variant="primary"
                      size="large"
                      class="w-full"
                      :loading="verifying"
                    />
                  </form>
                </div>
              </template>
            </Card>

            <p class="max-w-(--container-sm) text-center text-body-xs text-(--text-muted)">
              Use a token with only the permissions this app needs, and revoke it in Personal tokens
              when you are done.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
