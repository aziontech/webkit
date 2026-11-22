<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { computed, nextTick, onMounted, ref, watch } from 'vue'

  import SignInFrame from './parts/sign-in-frame.vue'

  /** Why the API did not let the token in, each with its own copy, severity and Retry rule. */
  export type TokenSignInFailure = 'rejected' | 'no-access' | 'rate-limited' | 'unreachable'

  export interface TokenSignInProps {
    /** The token is being checked against the API: the field locks and Sign in spins. */
    loading?: boolean
    /** Why the last check failed: a failure kind with its own copy, or a message shown as a danger notice with Retry. */
    error?: TokenSignInFailure | (string & {})
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
  }

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry: boolean
  }

  const props = withDefaults(defineProps<TokenSignInProps>(), {
    loading: false,
    error: '',
    homeHref: '/home',
    docsHref: '/docs'
  })

  const emit = defineEmits<{ 'sign-in': [event: Event, token: string] }>()

  const remember = defineModel<boolean>('remember', { default: false })

  const TOKEN_DOCS = 'https://www.azion.com/en/documentation/products/accounts/personal-tokens/'

  const failures: Record<TokenSignInFailure, CardNotice> = {
    rejected: {
      severity: 'danger',
      label:
        'Azion did not accept this token. Check that you copied all of it and that it has not expired or been revoked.',
      retry: false
    },
    'no-access': {
      severity: 'danger',
      label:
        'This token is valid but cannot read what this app needs. Create a token with access to the account and paste it here.',
      retry: false
    },
    'rate-limited': {
      severity: 'warning',
      label: 'Azion is limiting requests from this token. Wait a moment and retry.',
      retry: true
    },
    unreachable: {
      severity: 'warning',
      label: 'We could not reach Azion to check the token. Your entry is kept.',
      retry: true
    }
  }

  const token = ref('')
  const tokenError = ref('')

  const notice = computed<CardNotice | null>(() => {
    if (!props.error || props.loading) return null
    return (
      failures[props.error as TokenSignInFailure] ?? {
        severity: 'danger',
        label: props.error,
        retry: true
      }
    )
  })

  const focusToken = () => nextTick(() => document.getElementById('personal-token')?.focus())

  const clearsEntry = (error: string) => error === 'rejected' || error === 'no-access'

  onMounted(() => {
    if (clearsEntry(props.error)) focusToken()
  })

  watch(
    () => [props.error, props.loading] as const,
    ([error, loading]) => {
      if (loading || !clearsEntry(error)) return
      token.value = ''
      focusToken()
    }
  )

  const signIn = (event: Event) => {
    if (props.loading) return
    const candidate = token.value.trim()
    if (!candidate) tokenError.value = 'Paste your personal token.'
    else if (/\s/.test(candidate))
      tokenError.value = 'A token has no spaces. Copy it again from Personal tokens.'
    else tokenError.value = ''
    if (tokenError.value) {
      focusToken()
      return
    }
    emit('sign-in', event, candidate)
  }
</script>

<template>
  <SignInFrame
    :home-href="homeHref"
    :docs-href="docsHref"
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
            :aria-busy="loading || undefined"
            novalidate
            @submit.prevent="signIn"
          >
            <PageHeader
              title="Sign in with a personal token"
              description="Paste a personal token from your Azion account. It is sent only to the Azion API."
              size="small"
            />

            <Alert
              v-if="notice"
              :key="notice.label"
              :severity="notice.severity"
              size="small"
              :label="notice.label"
            >
              <template
                v-if="notice.retry"
                #actions
              >
                <Button
                  label="Retry"
                  variant="secondary"
                  size="small"
                  @click="signIn"
                />
              </template>
            </Alert>

            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
              :disabled="loading"
            >
              <legend class="sr-only">Personal token</legend>
              <Field
                required
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
                  <Link
                    inline
                    :href="TOKEN_DOCS"
                    target="_blank"
                    >How to create a personal token</Link
                  >
                </Field.Description>
                <Field.Error v-if="tokenError">{{ tokenError }}</Field.Error>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  v-model="remember"
                  name="remember"
                />
                <Field.Content>
                  <Field.Label>Remember for this tab</Field.Label>
                  <Field.Description>Closing the tab signs you out.</Field.Description>
                </Field.Content>
              </Field>
            </fieldset>

            <Button
              type="submit"
              label="Sign in"
              variant="primary"
              size="large"
              class="w-full"
              :loading="loading"
            />
          </form>
        </div>
      </template>
    </Card>

    <p class="max-w-(--container-sm) text-center text-body-xs text-(--text-muted)">
      Use a token with only the permissions this app needs, and revoke it in Personal tokens when
      you are done.
    </p>
  </SignInFrame>
</template>
