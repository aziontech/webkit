<script setup lang="ts">
  import type { SignInProvider } from '../auth-sign-in.vue'
  import SignInFooter from '../parts/sign-in-footer.vue'
  import SignInFrame from '../parts/sign-in-frame.vue'
  import SignUpCard, { type SignUpCardProps } from '../parts/sign-up-card.vue'

  withDefaults(defineProps<SignUpCardProps>(), {
    defaultEmail: '',
    error: ''
  })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
  }>()
</script>

<template>
  <SignInFrame>
    <SignUpCard
      :default-email="defaultEmail"
      :error="error"
      @provider-click="(event, provider) => emit('provider-click', event, provider)"
    />
    <SignInFooter
      prompt="Already have an account?"
      link-label="Sign in"
      link-href="/login"
    />
  </SignInFrame>
</template>
