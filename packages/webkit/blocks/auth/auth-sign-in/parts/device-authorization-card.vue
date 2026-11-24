<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, onScopeDispose, ref } from 'vue'

  import { useCodeCheck } from '../composables/use-code-check'
  import { deviceRequest as request, deviceScopes as scopes, signedInAccount } from '../sample'
  import AuthCard from './auth-card.vue'
  import ScopeList from './scope-list.vue'
  import SignedInAs from './signed-in-as.vue'

  const CODE_BOX_CLASS =
    'flex flex-col items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md)'

  const entering = ref(false)
  const code = ref('')
  const shownCode = ref(request.code)
  const pending = ref<'' | 'confirm' | 'cancel'>('')
  const outcome = ref<'' | 'connected' | 'cancelled'>('')
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  const settled = computed(() => !!outcome.value)
  const grouped = computed(() => `${shownCode.value.slice(0, 4)}-${shownCode.value.slice(4)}`)

  const focusCode = () => nextTick(() => document.getElementById('device-code')?.focus())

  const codeCheck = useCodeCheck({
    code,
    length: 8,
    messages: {
      empty: 'Enter the code your terminal shows.',
      short: 'Enter all 8 characters of the code.',
      rejected:
        'That code is not valid or has expired. Check your terminal, or start the sign-in again there.'
    },
    focus: focusCode,
    blocked: () => !!pending.value,
    onAccepted: (accepted) => {
      shownCode.value = accepted
      entering.value = false
    }
  })
  const { error: codeError, checking, unreachable, check } = codeCheck

  const enterCode = () => {
    entering.value = true
    codeCheck.reset()
    focusCode()
  }

  const respond = (answer: 'confirm' | 'cancel') => {
    if (pending.value || checking.value || settled.value) return
    pending.value = answer
    timer = setTimeout(() => {
      pending.value = ''
      outcome.value = answer === 'confirm' ? 'connected' : 'cancelled'
    }, 600)
  }
</script>

<template>
  <AuthCard>
    <section
      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
      aria-labelledby="device-authorization-title"
    >
      <PageHeader
        title-id="device-authorization-title"
        :title="`Connect ${request.client}`"
        :description="
          entering
            ? 'Enter the code your terminal shows to connect it to your account.'
            : 'Check that this code matches the one in your terminal, then confirm.'
        "
      />

      <Alert
        key="alert-1"
        v-if="outcome === 'connected'"
        severity="success"
        size="small"
        label="Device connected. Go back to your terminal; you can close this tab."
      />
      <Alert
        key="alert-2"
        v-else-if="outcome === 'cancelled'"
        severity="info"
        size="small"
        label="Request cancelled. The device was not connected."
      />
      <Alert
        key="alert-3"
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
            :loading="checking"
            @click="check"
          />
        </template>
      </Alert>

      <form
        v-if="entering"
        class="flex flex-col gap-(--spacing-lg)"
        aria-label="Enter the device code"
        novalidate
        @submit.prevent="check"
      >
        <Field :invalid="!!codeError">
          <Field.Label for="device-code">Device code</Field.Label>
          <OtpInput
            id="device-code"
            v-model="code"
            name="code"
            :length="8"
            mode="alphanumeric"
            :group="4"
            :disabled="checking"
            @update:model-value="codeCheck.clearError"
            @complete="check"
          />
          <Field.Description>{{
            codeError || `Codes expire ${request.expires} after the terminal shows them.`
          }}</Field.Description>
        </Field>
        <Button
          type="submit"
          label="Continue"
          variant="primary"
          size="large"
          class="w-full"
          :loading="checking"
        />
      </form>

      <template v-else>
        <div :class="CODE_BOX_CLASS">
          <span class="text-label-sm text-(--text-muted)">Device code</span>
          <span class="text-label-code-lg text-(--text-default)">{{ grouped }}</span>
        </div>

        <KeyValueList
          variant="split"
          aria-label="Request details"
        >
          <KeyValueList.Item label="Application">{{ request.client }}</KeyValueList.Item>
          <KeyValueList.Item label="Device">{{ request.device }}</KeyValueList.Item>
          <KeyValueList.Item label="IP address">{{ request.address }}</KeyValueList.Item>
          <KeyValueList.Item label="Requested">{{ request.requested }}</KeyValueList.Item>
        </KeyValueList>

        <SignedInAs
          :account="signedInAccount"
          :disabled="!!pending || settled"
        />

        <ScopeList
          heading-id="device-authorization-scopes"
          :client="request.client"
          :scopes="scopes"
        />

        <div class="grid grid-cols-2 gap-(--spacing-sm)">
          <Button
            label="Cancel"
            variant="secondary"
            size="large"
            class="w-full"
            :loading="pending === 'cancel'"
            :disabled="pending === 'confirm' || settled"
            @click="respond('cancel')"
          />
          <Button
            label="Confirm"
            variant="primary"
            size="large"
            class="w-full"
            :loading="pending === 'confirm'"
            :disabled="pending === 'cancel' || settled"
            @click="respond('confirm')"
          />
        </div>

        <Button
          v-if="!settled"
          variant="link"
          label="The code does not match? Enter the code from your terminal"
          class="self-start"
          @click="enterCode"
        />
      </template>
    </section>
  </AuthCard>
</template>
