<script setup>
  // The email-verification screen — the second step of the signup flow (route
  // /signup/verify), rendered into the centred column its PARENT route owns
  // (see SignupFlow.vue and AuthColumn.vue). Arriving here from Sign Up changes only
  // this card: the header, the page frame and the client strip are the flow's, not
  // this screen's, so they never re-arrive.
  //
  // It is built on the same pattern as Sign In's "Check your inbox" step, which is
  // the point: the whole signed-out flow is one place with one shape, and the only
  // thing that changes between its screens is what they ask for. The testimonial
  // that used to sit beside this card is gone with it — a customer quote argued
  // for the platform at the one moment the user has already bought in and is
  // waiting on an email.
  //
  // The card is Sign In's 'sent' step, part for part: the address in the
  // description, "Didn't receive the email?" + Resend, "Already opened it?" +
  // the link's destination, and a secondary primary button as the way back.
  // Both screens are the same moment in two flows, so they read identically.
  //
  // "Resend Email" is an async action, so it locks off one `resending` flag (the
  // `/usability` contract): while the request is in flight the affordance shows a
  // low-emphasis Spinner + "Sending…" instead of the link, the handler guards on
  // the flag, and the result surfaces via toast. Field-less screen, so there is
  // no form validation here.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Spinner from '@aziontech/webkit/spinner'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // The address carried over from Sign Up.
  const email = computed(() => route.query.email || '')

  // Named the same way Sign In's 'sent' step names it: the address is the whole
  // reassurance, so it goes in the sentence when we have it and the sentence stands
  // without it when we don't.
  const description = computed(() =>
    email.value
      ? `We sent a verification link to ${email.value}. Check your inbox or spam folder and follow the instructions.`
      : "We've sent you an email with instructions to verify your account. Check your inbox or spam folder and follow the instructions."
  )

  const resending = ref(false)

  // Mock resend request. Reject models a request-level failure.
  const sendVerification = () => new Promise((resolve) => setTimeout(resolve, 900))

  const resend = async () => {
    if (resending.value) return // re-entrancy lock
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
      resending.value = false // release on success AND failure
    }
  }

  const returnToSignIn = () => router.push({ name: 'login' })

  // The emailed link's destination. In the real product the user leaves this page
  // by clicking the link in their inbox; the prototype offers it as a link of its
  // own so the flow into the platform stays traversable — the same stand-in Sign
  // In's 'sent' step makes for "Set a new password". It continues into onboarding,
  // where the user's organization is created.
  const openVerificationLink = () =>
    router.push({ name: 'signup-onboarding', query: { email: email.value } })
</script>

<template>
  <!-- One root element, because the flow cross-fades this component inside a
       <Transition> and a fragment cannot be animated. The card is the whole of this
       step; the centring and the column's padding come from AuthColumn. -->
  <CardBox
    class="w-full max-w-(--container-sm)"
    :padded="false"
  >
    <template #content>
      <!-- The card's own padding, rather than CardBox's `padded`, which is a
                 tighter step than this composition wants. -->
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
        <header class="flex flex-col gap-(--spacing-xxs)">
          <h1 class="text-heading-sm text-(--text-default)">Check your inbox</h1>
          <p class="text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </header>

        <!-- The two ways forward — ask for the email again, or (the
                   prototype's stand-in for opening it) follow the link. Same two
                   rows, same order, same wording as Sign In's 'sent' step. -->
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

        <!-- Nothing left to submit on this screen, so the button is secondary
                   and is the way back. It stays live during a resend: that request
                   carries its own low-emphasis Spinner, and leaving for sign-in
                   while it runs costs the user nothing. -->
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
