<script setup>
  import Container from '@aziontech/webkit/container'
  import NewsletterSection from '@aziontech/webkit/newsletter-section'
  import Spacer from '@aziontech/webkit/spacer'
  import { ref } from 'vue'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }

  const loading = ref(false)
  const submitted = ref(false)
  const error = ref(false)

  const onSubmit = async (event, values) => {
    loading.value = true
    error.value = false
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      submitted.value = response.ok
      error.value = !response.ok
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <NewsletterSection
      anchor="contact"
      eyebrow="Stay up to date"
      title="Subscribe to our newsletter"
      description="Product updates, event highlights, and industry insights, delivered to your inbox."
      :form="form"
      :loading="loading"
      :submitted="submitted"
      :failed="error"
      @submit="onSubmit"
    />
  </Container>
</template>
