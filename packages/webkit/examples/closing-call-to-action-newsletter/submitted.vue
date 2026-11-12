<script setup>
  import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }

  const onSubmit = (event, values) => {
    console.log(event.type, values)
  }
</script>

<template>
  <ClosingCallToActionNewsletter
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    :submitted="true"
    @submit="onSubmit"
  />
</template>
