<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
  import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'
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

    <ClosingCallToActionNewsletter
      anchor="contact"
      eyebrow="Stay up to date"
      title="Subscribe to our newsletter"
      description="Product updates, event highlights, and industry insights, delivered to your inbox."
      :form="form"
      :hatch="false"
    />
    <SectionGap hatch />

    <ClosingCallToAction
      kind="panel"
      title="Ready to talk?"
      description="Tell us what you are building and a specialist will reach out."
      :primary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    />
  </SectionContainer>
</template>
