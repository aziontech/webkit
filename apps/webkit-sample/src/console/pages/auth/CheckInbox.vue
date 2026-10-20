<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Spinner from '@aziontech/webkit/spinner'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const email = computed(() => route.query.email || '')

  const description = computed(() =>
    email.value
      ? `We sent a verification link to ${email.value}. Check your inbox or spam folder and follow the instructions.`
      : "We've sent you an email with instructions to verify your account. Check your inbox or spam folder and follow the instructions."
  )

  const resending = ref(false)

  const sendVerification = () => new Promise((resolve) => setTimeout(resolve, 900))

  const resend = async () => {
    if (resending.value) return
    resending.value = true
    try {
      await sendVerification()
      toast.success('Verification email sent.', {
        description: email.value
          ? `We sent another email to ${email.value}.`
          : 'Check your inbox or spam folder.'
      })
    } catch (error) {
      toast.error("Couldn't resend the email.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => resend() }
      })
    } finally {
      resending.value = false
    }
  }

  const returnToSignIn = () => router.push({ name: 'login' })

  const openVerificationLink = () =>
    router.push({ name: 'signup-onboarding', query: { email: email.value } })
</script>

<template>
  <CardBox
    class="w-full max-w-(--container-sm)"
    :padded="false"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
        <header class="flex flex-col gap-(--spacing-xxs)">
          <h1 class="text-heading-sm text-(--text-default)">Check your inbox</h1>
          <p class="text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </header>

        <div class="flex flex-col gap-(--spacing-xs)">
          <div class="flex items-center gap-(--spacing-xs)">
            <p class="text-body-sm text-(--text-default)">Didn't receive the email?</p>
            <span
              v-if="resending"
              class="flex items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
            >
              <Spinner class="size-4" />
              Sending…
            </span>
            <a
              v-else
              class="text-link text-body-sm"
              href="#"
              @click.prevent="resend"
              >Resend Email</a
            >
          </div>
          <div class="flex items-center gap-(--spacing-xs)">
            <p class="text-body-sm text-(--text-default)">Already opened it?</p>
            <a
              class="text-link text-body-sm"
              href="#"
              @click.prevent="openVerificationLink"
              >Verify my email</a
            >
          </div>
        </div>

        <Button
          label="Return to sign in"
          kind="secondary"
          size="large"
          class="w-full"
          @click="returnToSignIn"
        />
      </div>
    </template>
  </CardBox>
</template>
