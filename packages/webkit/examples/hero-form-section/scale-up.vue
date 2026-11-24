<script setup>
  import HeroFormSection from '@aziontech/webkit/hero-form-section'

  const fields = [
    {
      name: 'firstname',
      autocomplete: 'given-name',
      type: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      autocomplete: 'family-name',
      type: 'text',
      label: 'Last name',
      half: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Work email',
      placeholder: 'm@example.com',
      required: true
    },
    {
      name: 'company',
      autocomplete: 'organization',
      type: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      type: 'phone',
      label: 'Phone',
      placeholder: '555-0100',
      country: 'US',
      visuallyHiddenLabel: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'Thanks, we received your request.',
    successDescription: 'A specialist will reply by email within one business day.',
    error: 'We could not send your message. Try again.'
  }

  const onSubmit = (event, values) => {
    console.warn(event.type, values)
  }

  const DESCRIPTION =
    'Up to $120,000 in service credits for your company. Azion Scale Up gives startups free credits, onboarding with Azion experts and 24/7 technical support while they build on the ' +
    'platform.'
</script>

<template>
  <HeroFormSection
    title="Azion Scale Up Credit Program"
    :description="DESCRIPTION"
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    @submit="onSubmit"
  />
</template>
