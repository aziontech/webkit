<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import Container from '@aziontech/webkit/container'
  import NewsletterSection from '@aziontech/webkit/newsletter-section'
  import Spacer from '@aziontech/webkit/spacer'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
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
      :hatch="false"
    />
    <Spacer hatch />

    <ClosingCallToActionSection
      variant="panel"
      title="Ready to talk?"
      description="Tell us what you are building and a specialist will reach out."
      :primary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
    />
  </Container>
</template>
