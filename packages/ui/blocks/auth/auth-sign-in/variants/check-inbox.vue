<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import PageHeader from '@aziontech/ui/page-header'
  import { onScopeDispose, ref } from 'vue'

  import SignInFrame from '../parts/sign-in-frame.vue'

  const resending = ref(false)
  const resent = ref(false)
  let resendTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(resendTimer))

  const resend = () => {
    resending.value = true
    resent.value = false
    clearTimeout(resendTimer)
    resendTimer = setTimeout(() => {
      resending.value = false
      resent.value = true
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
              title="Check your inbox"
              description="We sent a verification link to jane.doe@example.com. Check your inbox or spam folder and follow the instructions."
            />

            <Alert
              v-if="resent"
              severity="success"
              size="small"
              label="We sent another link to jane.doe@example.com."
            />

            <div class="flex items-center gap-(--spacing-xs)">
              <p class="text-body-sm text-(--text-default)">Didn't receive the email?</p>
              <Button
                type="button"
                label="Resend email"
                variant="link"
                :loading="resending"
                @click="resend"
              />
            </div>

            <Button
              label="Return to sign in"
              variant="secondary"
              size="large"
              class="w-full"
              href="/login"
            />
          </div>
        </template>
      </Card>
    </div>
  </SignInFrame>
</template>
