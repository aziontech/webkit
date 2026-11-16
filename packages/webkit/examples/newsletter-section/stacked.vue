<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import NewsletterSection from '@aziontech/webkit/newsletter-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

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
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <NewsletterSection
      anchor="contact"
      eyebrow="Stay up to date"
      title="Subscribe to our newsletter"
      description="Product updates, event highlights, and industry insights, delivered to your inbox."
      :form="form"
      :hatch="false"
    />
    <SectionGap hatch />

    <ClosingCallToActionSection
      variant="panel"
      title="Ready to talk?"
      description="Tell us what you are building and a specialist will reach out."
      :primary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
    />
  </SectionContainer>
</template>
